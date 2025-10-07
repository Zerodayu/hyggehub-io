import { Twilio } from "twilio";
import { NextRequest, NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: NextRequest) {
  try {
    if (!accountSid || !authToken || !twilioNumber) {
      return NextResponse.json(
        { error: "Missing required Twilio environment variables" },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();

    // Get recipient phone number and message from request
    const { to, body: messageBody } = body;

    if (!to || !messageBody) {
      return NextResponse.json(
        { error: "Missing required parameters: 'to' or 'body'" },
        { status: 400 }
      );
    }

    const client = new Twilio(accountSid, authToken);

    const message = await client.messages.create({
      from: twilioNumber,
      to: to,
      body: messageBody,
    });

    return NextResponse.json({
      success: true,
      messageSid: message.sid,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json(
      { error: "Failed to send SMS", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Keep the original function for internal use
export function sendSms(to: string, messageBody: string) {
  if (!accountSid || !authToken || !twilioNumber) {
    console.error("Missing required Twilio environment variables");
    return Promise.reject("Missing required Twilio environment variables");
  }

  try {
    const client = new Twilio(accountSid, authToken);

    return client.messages.create({
      from: twilioNumber,
      to: to,
      body: messageBody,
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}