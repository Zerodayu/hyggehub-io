import Telnyx from "telnyx";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";
import { validateSenderName } from "@/lib/senderNameValidator";

const telnyxApiKey = process.env.TELNYX_API_KEY;
const defaultPhoneNumber = process.env.TELNYX_PHONE_NUMBER;
const messagingProfileId = process.env.TELNYX_MESSAGING_PROFILE_ID;

// Add interface for request body
interface SmsRequestBody {
  to: string | string[]; // Support both single number and array
  body: string;
  senderName?: string;
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

    const client = new Telnyx(telnyxApiKey);

    try {
      // Send SMS to all phone numbers
      const results = await Promise.allSettled(
        phoneNumbers.map(async (phone) => {
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
    } catch (telnyxError: unknown) {
      console.error("Telnyx API error:", telnyxError);
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
    return withCORS(
      NextResponse.json(
        { error: "Failed to send SMS", details: (error as Error).message },
        { status: 500 },
      ),
    );
  }
}
