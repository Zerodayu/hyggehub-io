import { Twilio } from "twilio";
import { withCORS } from "@/cors";
import { NextRequest, NextResponse } from "next/server";
import { validateSenderName } from "@/lib/senderNameValidator";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!accountSid || !authToken || !messagingServiceSid) {
      console.error("Missing Twilio credentials");
      return withCORS(NextResponse.json(
        { error: "Missing required Twilio environment variables" },
        { status: 500 }
      ));
    }

    const body = await request.json();
    const { to, body: messageBody, senderName } = body;

    // Validate request parameters
    if (!to || !messageBody) {
      return withCORS(NextResponse.json(
        { error: "Missing required parameters: 'to' or 'body'" },
        { status: 400 }
      ));
    }

    // Validate phone number format
    if (!to.match(/^\+[1-9]\d{1,14}$/)) {
      return withCORS(NextResponse.json(
        { error: "Invalid phone number format. Must be E.164 format (e.g., +1234567890)" },
        { status: 400 }
      ));
    }

    // Validate sender name format if provided
    if (senderName) {
      const validation = validateSenderName(senderName);
      
      if (!validation.isValid) {
        return withCORS(NextResponse.json(
          { error: validation.error },
          { status: 400 }
        ));
      }

      body.senderName = validation.formattedName;
    }

    const client = new Twilio(accountSid, authToken);
    
    try {
      const messageParams = {
        body: messageBody,
        to: to,
        messagingServiceSid,
        ...(body.senderName && { from: body.senderName })
      };

      const message = await client.messages.create(messageParams);

      return withCORS(NextResponse.json({
        success: true,
        messageSid: message.sid,
        senderName: body.senderName,
        message: "SMS sent successfully",
      }));
    } catch (twilioError: Error | any) {
      console.error("Twilio API error:", twilioError);
      return withCORS(NextResponse.json(
        { 
          error: "Twilio API error", 
          code: twilioError.code,
          details: twilioError.message 
        },
        { status: 500 }
      ));
    }

  } catch (error) {
    console.error("Error sending SMS:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to send SMS", details: (error as Error).message },
      { status: 500 }
    ));
  }
}