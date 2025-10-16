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

    // First, check if the shop exists
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId }
    });

    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    const url = new URL(req.url);
    const resourceType = url.searchParams.get("type") || "customer"; // Default to customer if not specified
    
    if (resourceType === "customer") {
      return await handleCustomerDeletion(req, clerkOrgId, shop);
    } else if (resourceType === "message") {
      return await handleMessageDeletion(req, clerkOrgId, shop);
    } else {
      return withCORS(Response.json({ success: false, error: "Invalid resource type. Use 'customer' or 'message'" }, { status: 400 }));
    }
  } catch (error: unknown) {
    // Check for Prisma-specific errors
    if ((error as PrismaClientKnownRequestError).code === 'P2025') {
      return withCORS(Response.json({ success: false, error: "Resource not found" }, { status: 404 }));
    }
    
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}

async function handleCustomerDeletion(req: NextRequest, clerkOrgId: string, shop: any) {
  // Try to get customer ID from different sources
  const url = new URL(req.url);
  
  // Try to get from search params (query string)
  let customerId = url.searchParams.get("customerId");
  
  // If not found in query string, try to get from path segments
  if (!customerId) {
    const pathSegments = url.pathname.split('/');
    // Find the last segment which might be the ID
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment !== 'del' && lastSegment !== 'orgs') {
      customerId = lastSegment;
    }
  }
  
  // If still not found, try to parse request body
  if (!customerId) {
    try {
      const body = await req.json();
      customerId = body.customerId;
    } catch (e) {
      // Body parsing failed, continue with null customerId
    }
  }
  
  if (!customerId) {
    return withCORS(Response.json({ success: false, error: "Customer ID is required" }, { status: 400 }));
  }

  // First delete the shop subscription linking customer to shop
  await prisma.shopSubscription.deleteMany({
    where: {
      shopId: clerkOrgId,
      customerId: customerId
    }
  });

  // Then delete the customer
  await prisma.customers.delete({
    where: { customerId }
  });

  return withCORS(Response.json({ 
    success: true, 
    message: "Customer deleted successfully" 
  }));
}

async function handleMessageDeletion(req: NextRequest, clerkOrgId: string, shop: any) {
  // Try to get message ID from different sources
  const url = new URL(req.url);
  
  // Try to get from search params (query string)
  let messageId = url.searchParams.get("messageId");
  
  // If not found in query string, try to get from path segments
  if (!messageId) {
    const pathSegments = url.pathname.split('/');
    // Find the last segment which might be the ID
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment !== 'del' && lastSegment !== 'orgs') {
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
}