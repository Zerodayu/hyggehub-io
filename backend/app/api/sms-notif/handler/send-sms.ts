import { Twilio } from "twilio";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";
import { validateSenderName } from "@/lib/senderNameValidator";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

// Add interface for request body
interface SmsRequestBody {
  to: string | string[]; // Support both single number and array
  body: string;
  senderName?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error("Missing Twilio credentials");
      return withCORS(
        NextResponse.json(
          { error: "Missing required Twilio environment variables" },
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

    // Validate sender name format if provided
    let formattedSenderName = senderName;
    if (senderName) {
      const validation = validateSenderName(senderName);

      if (!validation.isValid) {
        return withCORS(
          NextResponse.json({ error: validation.error }, { status: 400 }),
        );
      }

      formattedSenderName = validation.formattedName;
    }

    const client = new Twilio(accountSid, authToken);

    try {
      // Send SMS to all phone numbers
      const results = await Promise.allSettled(
        phoneNumbers.map(async (phone) => {
          const messageParams = {
            body: messageBody,
            to: phone,
            messagingServiceSid,
            ...(formattedSenderName && { from: formattedSenderName }),
          };

          const message = await client.messages.create(messageParams);
          return {
            phone,
            messageSid: message.sid,
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
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected",
        )
        .map((result, index) => ({
          phone: phoneNumbers[index],
          error: result.reason?.message || "Unknown error",
        }));

      return withCORS(
        NextResponse.json({
          success: failed.length === 0,
          totalSent: successful.length,
          totalFailed: failed.length,
          successful,
          failed,
          senderName: formattedSenderName,
          message:
            failed.length === 0
              ? `SMS sent successfully to ${successful.length} recipient(s)`
              : `SMS sent to ${successful.length} recipient(s), failed for ${failed.length}`,
        }),
      );
    } catch (twilioError: unknown) {
      console.error("Twilio API error:", twilioError);
      return withCORS(
        NextResponse.json(
          {
            error: "Twilio API error",
            code: (twilioError as Error).name,
            details: (twilioError as Error).message,
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
