import { NextRequest } from "next/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");
    if (!clerkId) {
      return withCORS(Response.json({ success: false, error: "Missing clerkId" }, { status: 400 }));
    }

    // Find the user by clerkId
    const user = await prisma.users.findUnique({
      where: { clerkId },
      select: { userId: true, clerkId: true, username: true, email: true }
    });
    if (!user) {
      return withCORS(Response.json({ success: false, error: "User not found" }, { status: 404 }));
    }

    // Fetch shops the user is connected to via ShopSubscription
    const subscriptions = await prisma.shopSubscription.findMany({
      where: { userId: clerkId },
      include: { shop: true }
    });

    // Extract shop info
    const followedShops = subscriptions.map(sub => sub.shop);

    return withCORS(Response.json({ user, followedShops }));
  } catch (error: string | unknown) {
    return withCORS(Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 }));
  }
}