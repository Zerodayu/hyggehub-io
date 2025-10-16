import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function DELETE(req: NextRequest) {
  try {
    // Get organization ID from headers
    const clerkOrgId = req.headers.get("x-clerk-org-id");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId in headers" }, { status: 400 }));
    }

    // Try to get message ID from different sources
    const url = new URL(req.url);
    
    // Try to get from search params (query string)
    let messageId = url.searchParams.get("messageId");
    
    // If not found in query string, try to get from path segments
    if (!messageId) {
      const pathSegments = url.pathname.split('/');
      // Find the last segment which might be the ID
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && lastSegment !== 'delete' && lastSegment !== 'messages') {
        messageId = lastSegment;
      }
    }
    
    // If still not found, try to parse request body
    if (!messageId) {
      try {
        const body = await req.json();
        messageId = body.messageId;
      } catch (e) {
        // Body parsing failed, continue with null messageId
      }
    }
    
    if (!messageId) {
      return withCORS(Response.json({ success: false, error: "Message ID is required" }, { status: 400 }));
    }

    // First, check if the shop exists
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId }
    });

    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    // Check if the message exists and belongs to this shop
    const message = await prisma.shopMessage.findFirst({
      where: {
        id: messageId,
        shopId: shop.shopId
      }
    });

    if (!message) {
      return withCORS(Response.json({ 
        success: false, 
        error: "Message not found or doesn't belong to this shop" 
      }, { status: 404 }));
    }

    // Delete the message
    await prisma.shopMessage.delete({
      where: { id: messageId }
    });

    return withCORS(Response.json({ 
      success: true, 
      message: "Message deleted successfully" 
    }));
  } catch (error: unknown) {
    // Check for Prisma-specific errors
    if ((error as PrismaClientKnownRequestError).code === 'P2025') {
      return withCORS(Response.json({ success: false, error: "Message not found" }, { status: 404 }));
    }
    
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}