import * as plivo from "plivo";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";
import { validateSenderName } from "@/lib/senderNameValidator";

const authId = process.env.PLIVO_AUTH_ID;
const plivoAuthToken = process.env.PLIVO_AUTH_TOKEN;
const defaultPhoneNumber = process.env.PLIVO_PHONE_NUMBER;

// Add interface for request body
interface SmsRequestBody {
  to: string | string[]; // Support both single number and array
  body: string;
  senderName?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!authId || !plivoAuthToken) {
      console.error("Missing Plivo credentials");
      return withCORS(
        NextResponse.json(
          { error: "Missing required Plivo environment variables" },
          { status: 500 },
        ),
      );
    }

    const body = (await request.json()) as SmsRequestBody;
    const { to, body: messageBody, senderName } = body;

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
              "No sender ID provided. Either provide 'senderName' or set PLIVO_PHONE_NUMBER environment variable",
          },
          { status: 400 },
        ),
      );
    }

    const client = new plivo.Client(authId, plivoAuthToken);

    try {
      // Send SMS to all phone numbers
      const results = await Promise.allSettled(
        phoneNumbers.map(async (phone) => {
          const response = await client.messages.create({
            src: sender,
            dst: phone,
            text: messageBody,
          });

          return {
            phone,
            messageUuid: response.messageUuid,
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
          phone: phoneNumbers[index],
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

      return withCORS(
        NextResponse.json({
          success: failed.length === 0,
          totalSent: successful.length,
          totalFailed: failed.length,
          successful,
          failed,
          senderName: sender,
          message:
            failed.length === 0
              ? `SMS sent successfully to ${successful.length} recipient(s)`
              : `SMS sent to ${successful.length} recipient(s), failed for ${failed.length}`,
        }),
      );
    } catch (plivoError: unknown) {
      console.error("Plivo API error:", plivoError);
      return withCORS(
        NextResponse.json(
          {
            error: "Plivo API error",
            code: (plivoError as Error).name,
            details: (plivoError as Error).message,
          },
          { status: 500 },
        ),
      );
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return withCORS(
      NextResponse.json(
        { error: "Failed to send SMS", details: (error as Error).message },
        { status: 500 },
      ),
    );
  }
}
