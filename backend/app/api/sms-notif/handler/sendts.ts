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

    // Get recipient phone numbers and message from request
    // 'to' can now be either a string or an array of strings
    const { to, body: messageBody } = body;

    if (!to || !messageBody) {
      return withCORS(NextResponse.json(
        { error: "Missing required parameters: 'to' or 'body'" },
        { status: 400 }
      ));
    }

    const client = new Twilio(accountSid, authToken);
    const results = [];

    // If 'to' is an array, send message to each number
    if (Array.isArray(to)) {
      // Check if array is empty
      if (to.length === 0) {
        return withCORS(NextResponse.json(
          { error: "No recipient phone numbers provided" },
          { status: 400 }
        ));
      }

      // Send message to each number in the array
      for (const recipientNumber of to) {
        const message = await client.messages.create({
          from: twilioNumber,
          to: recipientNumber,
          body: messageBody,
        });
        
        results.push({
          to: recipientNumber,
          messageSid: message.sid
        });
      }

      return withCORS(NextResponse.json({
        success: true,
        messages: results,
        message: `SMS sent successfully to ${results.length} recipients`
      }));
    } else {
      // Handle single recipient case (for backward compatibility)
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
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    return withCORS(NextResponse.json(
      { error: "Failed to send SMS", details: (error as Error).message },
      { status: 500 }
    ));
  }
}