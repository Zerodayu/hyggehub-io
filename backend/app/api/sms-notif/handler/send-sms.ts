import { Twilio } from "twilio";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

export async function POST(request: NextRequest) {
  try {
    if (!accountSid || !authToken || !messagingServiceSid) {
      return withCORS(NextResponse.json(
        { error: "Missing required Twilio environment variables" },
        { status: 500 }
      ));
    }

    const body = await request.json();
    const { to, body: messageBody, senderName } = body;

    if (!to || !messageBody) {
      return withCORS(NextResponse.json(
        { error: "Missing required parameters: 'to' or 'body'" },
        { status: 400 }
      ));
    }

    const client = new Twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: `${senderName}: ${messageBody}`,
      messagingServiceSid: messagingServiceSid,
      to: to,
      sendAsMms: true, // Required for alphanumeric sender IDs in some regions
    });

    return withCORS(NextResponse.json({
      success: true,
      messageSid: message.sid,
      senderName: senderName,
      message: "SMS sent successfully",
    }));

  } catch (error) {
    console.error("Error sending SMS:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to send SMS", details: (error as Error).message },
      { status: 500 }
    ));
  }
}