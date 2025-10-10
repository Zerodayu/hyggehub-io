import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

export async function GET(req: NextRequest) {
  try {
    const clerkOrgId = req.headers.get("x-clerk-org-id");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId in headers" }, { status: 400 }));
    }

    // Find the shop by clerkOrgId
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId },
      include: { 
        messages: {
          // Add orderBy to make sure we get messages in a predictable order
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    // Fetch customers connected to this shop via ShopSubscription
    const subscriptions = await prisma.shopSubscription.findMany({
      where: { 
        shopId: clerkOrgId,
        customerId: { not: null } // Only get subscriptions with valid customer IDs
      },
      include: {
        customer: {
          select: {
            customerId: true,
            name: true,
            phone: true,
            birthday: true,
            createdAt: true
          }
        }
      }
    });

    // Extract customer info from non-null customers
    const connectedCustomers = subscriptions
      .map(sub => sub.customer)
      .filter(customer => customer !== null);

    return withCORS(Response.json({
      success: true,
      shop,
      connectedCustomers
    }));
  } catch (error: string | unknown) {
    console.error("Error in GET /api/orgs:", error);
    return withCORS(Response.json({ 
      success: false, 
      error: (error as Error).message || "Internal Server Error" 
    }, { status: 500 }));
  }
}