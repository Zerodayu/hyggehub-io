import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

export async function POST(req: NextRequest) {
  try {
    const clerkOrgId = req.headers.get("x-clerk-org-id");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId in headers" }, { status: 400 }));
    }

    // Check if shop exists
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId },
    });
    
    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    // Get message from request body
    const body = await req.json();
    const { title, message, expiresAt } = body;

    if (!message) {
      return withCORS(Response.json({ success: false, error: "Message is required" }, { status: 400 }));
    }

    if (!title) {
      return withCORS(Response.json({ success: false, error: "Title is required" }, { status: 400 }));
    }

    // Create the message with title and expiresAt
    const newMessage = await prisma.shopMessage.create({
      data: {
        title: title,
        value: message,
        shopId: shop.shopId,
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    return withCORS(Response.json({ 
      success: true, 
      message: "Message added successfully",
      data: newMessage
    }));
  } catch (error) {
    console.error("Error creating message:", error);
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}