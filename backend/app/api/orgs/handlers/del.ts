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

    // First, check if the shop exists
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId }
    });

    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
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
  } catch (error: unknown) {
    // Check for Prisma-specific errors
    if ((error as PrismaClientKnownRequestError).code === 'P2025') {
      return withCORS(Response.json({ success: false, error: "Customer not found" }, { status: 404 }));
    }
    
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}