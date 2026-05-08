import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";
import { clerkClient } from "@clerk/nextjs/server";

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
  } catch {
    // If Billing isn't enabled / subscription missing, default to free_org.
    return "free_org";
  }
}

async function getUsageLast30Days(params: { clerkOrgId: string; now: Date }) {
  const windowStart = getWindowStart(params.now);

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
        reservedUntil: { gt: params.now },
      },
      _sum: { count: true },
    }),
  ]);

  return {
    windowStart,
    used: (finalAgg._sum.count ?? 0) + (pendingAgg._sum.count ?? 0),
  };
}

export async function GET(req: NextRequest) {
  try {
    const clerkOrgId = req.headers.get("x-clerk-org-id");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId in headers" }, { status: 400 }));
    }

    // Find the shop by clerkOrgId
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId },
      include: { 
        messages: {
          // Add orderBy to make sure we get messages in a predictable order
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    // Fetch customers connected to this shop via ShopSubscription
    const subscriptions = await prisma.shopSubscription.findMany({
      where: { 
        shopId: clerkOrgId,
        customerId: { not: null } // Only get subscriptions with valid customer IDs
      },
      include: {
        customer: {
          select: {
            customerId: true,
            name: true,
            phone: true,
            birthday: true,
            createdAt: true
          }
        }
      }
    });

    // Extract customer info from non-null customers
    const connectedCustomers = subscriptions
      .map(sub => sub.customer)
      .filter(customer => customer !== null);

    // SMS quota usage (rolling 30 days) + plan limit.
    const now = new Date();
    const plan = await getOrgPlanSlug(clerkOrgId);
    const limit = getLimitForPlan(plan);
    const usage = await getUsageLast30Days({ clerkOrgId, now });
    const remaining = Math.max(0, limit - usage.used);

    return withCORS(Response.json({
      success: true,
      shop,
      connectedCustomers,
      smsUsage: {
        plan,
        limit,
        used: usage.used,
        remaining,
        windowStart: usage.windowStart.toISOString(),
      },
    }));
  } catch (error: string | unknown) {
    console.error("Error in GET /api/orgs:", error);
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}
