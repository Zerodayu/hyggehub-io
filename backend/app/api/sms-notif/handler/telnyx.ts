import Telnyx from "telnyx";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";
import { validateSenderName } from "@/lib/senderNameValidator";
import prisma from "@/prisma/PrismaClient";
import { clerkClient } from "@clerk/nextjs/server";
import type { OrganizationMembership } from "@clerk/nextjs/server";

const telnyxApiKey = process.env.TELNYX_API_KEY;
const defaultPhoneNumber = process.env.TELNYX_PHONE_NUMBER;
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;

// Add interface for request body
interface SmsRequestBody {
  to: string | string[]; // Support both single number and array
  body: string;
  senderName?: string;
}

const PLAN_LIMITS_30D: Record<string, number> = {
  starter_org: 500,
  pro_org: 1000,
  max_org: 3000,
  free_org: 0,
};

const ROLLING_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

function getWindowStart(now: Date) {
  return new Date(now.getTime() - ROLLING_WINDOW_MS);
}

function getLimitForPlan(planSlug: string | null | undefined) {
  if (!planSlug) return PLAN_LIMITS_30D.free_org;
  return PLAN_LIMITS_30D[planSlug] ?? PLAN_LIMITS_30D.free_org;
}

async function assertUserIsOrgMember(params: { orgId: string; userId: string }) {
  const client = await clerkClient();
  const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId: params.orgId,
  });

  const isMember = memberships.data.some(
    (m: OrganizationMembership) => m.publicUserData?.userId === params.userId,
  );

  if (!isMember) {
    const err = new Error("User is not a member of this organization");
    (err as any).status = 403;
    throw err;
  }
}

async function getOrgPlanSlug(orgId: string): Promise<string> {
  const client = await clerkClient();
  try {
    const sub = await client.billing.getOrganizationBillingSubscription(orgId);

    // Prefer an active item. If multiple items exist, pick the first matching known plan.
    const items = sub?.subscriptionItems ?? [];
    const known = new Set(Object.keys(PLAN_LIMITS_30D));

    const activeItems = items.filter((i) => i.status === "active");
    const inOrder = [...activeItems, ...items];
    for (const item of inOrder) {
      const slug = item.plan?.slug;
      if (slug && known.has(slug)) return slug;
    }

    return "free_org";
  } catch (e) {
    // If Billing isn't enabled / subscription missing, default to free_org.
    return "free_org";
  }
}

async function getUsageLast30Days(params: { clerkOrgId: string; now: Date }) {
  const windowStart = getWindowStart(params.now);
  const pendingValid = new Date(params.now.getTime());

  // FINAL events count fully. PENDING events count only if not expired (reservedUntil > now).
  const [finalAgg, pendingAgg] = await Promise.all([
    prisma.orgSmsUsageEvent.aggregate({
      where: {
        clerkOrgId: params.clerkOrgId,
        status: "FINAL",
        createdAt: { gte: windowStart },
      },
      _sum: { count: true },
    }),
    prisma.orgSmsUsageEvent.aggregate({
      where: {
        clerkOrgId: params.clerkOrgId,
        status: "PENDING",
        createdAt: { gte: windowStart },
        reservedUntil: { gt: pendingValid },
      },
      _sum: { count: true },
    }),
  ]);

  return {
    windowStart,
    used:
      (finalAgg._sum.count ?? 0) +
      (pendingAgg._sum.count ?? 0),
  };
}

async function reserveQuota(params: {
  clerkOrgId: string;
  intended: number;
  limit: number;
  now: Date;
}) {
  const reservationTtlMs = 2 * 60 * 1000; // avoid leaking quota on crashes
  const reservedUntil = new Date(params.now.getTime() + reservationTtlMs);

  // Simple retry for transaction serialization/race conditions.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const { used } = await (async () => {
          const windowStart = getWindowStart(params.now);
          const [finalAgg, pendingAgg] = await Promise.all([
            tx.orgSmsUsageEvent.aggregate({
              where: {
                clerkOrgId: params.clerkOrgId,
                status: "FINAL",
                createdAt: { gte: windowStart },
              },
              _sum: { count: true },
            }),
            tx.orgSmsUsageEvent.aggregate({
              where: {
                clerkOrgId: params.clerkOrgId,
                status: "PENDING",
                createdAt: { gte: windowStart },
                reservedUntil: { gt: params.now },
              },
              _sum: { count: true },
            }),
          ]);
          return {
            used:
              (finalAgg._sum.count ?? 0) +
              (pendingAgg._sum.count ?? 0),
          };
        })();

        const remaining = Math.max(0, params.limit - used);
        const allowed = Math.max(0, Math.min(params.intended, remaining));

        const reservation = await tx.orgSmsUsageEvent.create({
          data: {
            clerkOrgId: params.clerkOrgId,
            status: "PENDING",
            count: allowed,
            reservedUntil,
          },
        });

        return { reservationId: reservation.id, allowed, used, remaining };
      });
    } catch (e) {
      if (attempt === 2) throw e;
    }
  }

  throw new Error("Failed to reserve SMS quota");
}

async function finalizeReservation(params: {
  reservationId: string;
  successfulCount: number;
}) {
  await prisma.orgSmsUsageEvent.update({
    where: { id: params.reservationId },
    data: {
      status: "FINAL",
      count: params.successfulCount,
      reservedUntil: null,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!telnyxApiKey || !messagingProfileId) {
      console.error("Missing Telnyx credentials");
      return withCORS(
        NextResponse.json(
          { error: "Missing required Telnyx environment variables" },
          { status: 500 },
        ),
      );
    }

    const body = (await request.json()) as SmsRequestBody;
    const { to, body: messageBody, senderName } = body;

    // Org context required for quota enforcement
    const clerkOrgId = request.headers.get("x-clerk-org-id");
    const clerkUserId = request.headers.get("x-clerk-user-id");
    if (!clerkOrgId || !clerkUserId) {
      return withCORS(
        NextResponse.json(
          { error: "Missing organization or user context" },
          { status: 401 },
        ),
      );
    }

    await assertUserIsOrgMember({ orgId: clerkOrgId, userId: clerkUserId });

    // Validate request parameters
    if (!to || !messageBody) {
      return withCORS(
        NextResponse.json(
          { error: "Missing required parameters: 'to' or 'body'" },
          { status: 400 },
        ),
      );
    }

    // Normalize 'to' to always be an array for uniform processing
    const phoneNumbers = Array.isArray(to) ? to : [to];

    // Simplified phone number validation for database numbers
    const phoneRegex = /^\+[1-9]\d{1,14}$/;

    // Validate all phone numbers
    const invalidNumbers = phoneNumbers.filter(
      (phone) => !phoneRegex.test(phone),
    );

    if (invalidNumbers.length > 0) {
      return withCORS(
        NextResponse.json(
          {
            error:
              "Invalid phone number format. Must be in E.164 format starting with '+' (e.g., +1234567890)",
            invalidNumbers: invalidNumbers,
          },
          { status: 400 },
        ),
      );
    }

    // Determine sender ID (alphanumeric or phone number)
    let sender = defaultPhoneNumber;

    if (senderName) {
      // Validate sender name format if provided
      const validation = validateSenderName(senderName);

      if (!validation.isValid) {
        return withCORS(
          NextResponse.json({ error: validation.error }, { status: 400 }),
        );
      }

      sender = validation.formattedName;
    }

    // Validate that we have a sender (either senderName or fallback)
    if (!sender) {
      return withCORS(
        NextResponse.json(
          {
            error:
              "No sender ID provided. Either provide 'senderName' or set TELNYX_PHONE_NUMBER environment variable",
          },
          { status: 400 },
        ),
      );
    }

    const client = new Telnyx({ apiKey: telnyxApiKey });

    const now = new Date();
    const planSlug = await getOrgPlanSlug(clerkOrgId);
    const limit = getLimitForPlan(planSlug);

    const intended = phoneNumbers.length;
    const { reservationId, allowed, used: usedBefore, remaining } =
      await reserveQuota({
        clerkOrgId,
        intended,
        limit,
        now,
      });

    if (allowed === 0) {
      // No quota left: keep the reservation as FINAL with 0 so it doesn't linger as PENDING.
      await finalizeReservation({ reservationId, successfulCount: 0 });
      return withCORS(
        NextResponse.json(
          {
            success: false,
            totalSent: 0,
            totalFailed: 0,
            notSentDueToLimit: intended,
            plan: planSlug,
            limit,
            used: usedBefore,
            remaining: 0,
            reason: "Monthly SMS limit reached (rolling 30-day window)",
          },
          { status: 429 },
        ),
      );
    }

    const limitedPhoneNumbers = phoneNumbers.slice(0, allowed);
    const notSentDueToLimit = intended - allowed;

    try {
      // Send SMS to all phone numbers
      const results = await Promise.allSettled(
        limitedPhoneNumbers.map(async (phone) => {
          const response = await client.messages.send({
            from: sender,
            to: phone,
            text: messageBody,
            messaging_profile_id: messagingProfileId,
          });

          return {
            phone,
            messageId: response.data?.id,
            status: "success",
          };
        }),
      );

      // Separate successful and failed sends
      const successful = results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      const failed = results
        .map((result, index) => ({
          result,
          index,
          phone: limitedPhoneNumbers[index],
        }))
        .filter(
          (
            item,
          ): item is {
            result: PromiseRejectedResult;
            index: number;
            phone: string;
          } => item.result.status === "rejected",
        )
        .map((item) => ({
          phone: item.phone,
          error: item.result.reason?.message || "Unknown error",
        }));

      // Count only successful sends in the quota
      await finalizeReservation({
        reservationId,
        successfulCount: successful.length,
      });

      const usageAfter = await getUsageLast30Days({
        clerkOrgId,
        now,
      });
      const remainingAfter = Math.max(0, limit - usageAfter.used);

      return withCORS(
        NextResponse.json({
          success: failed.length === 0 && notSentDueToLimit === 0,
          totalSent: successful.length,
          totalFailed: failed.length,
          notSentDueToLimit,
          successful,
          failed,
          senderName: sender,
          plan: planSlug,
          limit,
          used: usageAfter.used,
          remaining: remainingAfter,
          message:
            notSentDueToLimit > 0
              ? `SMS sent to ${successful.length} recipient(s). ${notSentDueToLimit} not sent due to plan limit (rolling 30-day window).`
              : failed.length === 0
                ? `SMS sent successfully to ${successful.length} recipient(s)`
                : `SMS sent to ${successful.length} recipient(s), failed for ${failed.length}`,
        }),
      );
    } catch (telnyxError: unknown) {
      console.error("Telnyx API error:", telnyxError);

      // Best-effort: if Telnyx throws before we can finalize, expire the reservation quickly.
      // (It is already PENDING with a short reservedUntil, so it will self-clear.)
      return withCORS(
        NextResponse.json(
          {
            error: "Telnyx API error",
            code: (telnyxError as Error).name,
            details: (telnyxError as Error).message,
          },
          { status: 500 },
        ),
      );
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    const status = (error as any)?.status;
    return withCORS(
      NextResponse.json(
        { error: "Failed to send SMS", details: (error as Error).message },
        { status: typeof status === "number" ? status : 500 },
      ),
    );
  }
}
