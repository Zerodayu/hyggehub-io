import { Twilio } from "twilio";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

export async function POST(request: NextRequest) {
  try {
    if (!accountSid || !authToken || !twilioNumber) {
      return withCORS(NextResponse.json(
        { error: "Missing required Twilio environment variables" },
        { status: 500 }
      ));
    }

    // Parse the request body
    const body = await request.json();

    // Get recipient phone number and message from request
    const { to, body: messageBody } = body;

    if (!to || !messageBody) {
      return withCORS(NextResponse.json(
        { error: "Missing required parameters: 'to' or 'body'" },
        { status: 400 }
      ));
    }

    const client = new Twilio(accountSid, authToken);

    const message = await client.messages.create({
      from: twilioNumber,
      to: to,
      body: messageBody,
    });

    return withCORS(NextResponse.json({
      success: true,
      messageSid: message.sid,
      message: "SMS sent successfully"
    }));
  } catch (error) {
    console.error("Error sending SMS:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to send SMS", details: (error as Error).message },
      { status: 500 }
    ));
  }
}