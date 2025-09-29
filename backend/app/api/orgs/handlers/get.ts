import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkOrgId = searchParams.get("clerkOrgId");
    if (!clerkOrgId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkOrgId" }, { status: 400 }));
    }

    // Find the shop by clerkOrgId
    const shop = await prisma.shops.findUnique({
      where: { clerkOrgId },
      select: { shopId: true, clerkOrgId: true, name: true, message: true, location: true, code: true }
    });
    if (!shop) {
      return withCORS(Response.json({ success: false, error: "Shop not found" }, { status: 404 }));
    }

    // Fetch users connected to this shop via ShopSubscription
    const subscriptions = await prisma.shopSubscription.findMany({
      where: { shopId: clerkOrgId },
      include: { user: true }
    });

    // Extract user info
    const connectedUsers = subscriptions.map(sub => sub.user);

    return withCORS(Response.json({
      shop,
      connectedUsers
    }));
  } catch (error: string | unknown) {
    return withCORS(Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 }));
  }
}