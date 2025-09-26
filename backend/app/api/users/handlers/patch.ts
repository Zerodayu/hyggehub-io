import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function PATCH(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

  // Validate shopCode uniqueness
  if (shopCodes.includes(shopCode)) {
    return Response.json({ success: false, error: "Code already exists", shopCodes }, { status: 400 });
  }

  // Add new shopCode
  shopCodes.push(shopCode);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...metadata, shopCodes },
  });

  // Add shopCode to ShopSubscription
  const shop = await prisma.shops.findUnique({
    where: { code: shopCode },
    select: { clerkOrgId: true },
  });
  if (shop) {
    await prisma.shopSubscription.upsert({
      where: { userId_shopId: { userId, shopId: shop.clerkOrgId } },
      update: {},
      create: { userId, shopId: shop.clerkOrgId },
    });
  }

  return Response.json({ success: true, shopCodes });
}