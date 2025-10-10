import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

export async function DELETE(req: NextRequest) {
  try {
    // Get organization ID from headers
    const clerkOrgId = req.headers.get("x-clerk-org-id");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId in headers" }, { status: 400 }));
    }

    // Get customer ID from URL or search params
    const url = new URL(req.url);
    const customerId = url.searchParams.get("customerId");
    
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
  } catch (error: string | unknown) {
    // Check for Prisma-specific errors
    if ((error as any).code === 'P2025') {
      return withCORS(Response.json({ success: false, error: "Customer not found" }, { status: 404 }));
    }
    
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}