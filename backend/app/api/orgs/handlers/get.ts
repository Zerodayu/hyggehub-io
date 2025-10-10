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
      select: { shopId: true, clerkOrgId: true, name: true, messages: true, location: true, code: true, shopNum: true }
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
      shop,
      connectedCustomers
    }));
  } catch (error: string | unknown) {
    return withCORS(Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 }));
  }
}