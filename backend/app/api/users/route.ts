import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/prisma/PrismaClient"

export async function POST(req: NextRequest) {
  const { birthday, userId, shopCodes } = await req.json()

  // Convert birthday string to Date object
  const birthdayDate = birthday ? new Date(birthday) : null

  // Get existing publicMetadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = user.publicMetadata || {};

  // Prepare new metadata, merging with existing
  const newMetadata = {
    ...existingMetadata,
    ...(birthday !== undefined && {
      birthday: birthdayDate ? birthdayDate.toISOString().split('T')[0] : null,
    }),
    ...(shopCodes !== undefined && {
      shopCodes: shopCodes,
    }),
  };

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: newMetadata,
  });

  // Save birthday to database
  if (birthday !== undefined && birthdayDate) {
    await prisma.users.update({
      where: { clerkId: userId },
      data: { bdate: birthday },
    })
  }

  // Save shopCodes to ShopSubscription
  if (Array.isArray(shopCodes) && shopCodes.length > 0) {
    // Find all shops with matching codes
    const shops = await prisma.shops.findMany({
      where: { code: { in: shopCodes } },
      select: { clerkOrgId: true },
    })

    // Create subscriptions for each shop
    await Promise.all(
      shops.map(shop =>
        prisma.shopSubscription.upsert({
          where: { userId_shopId: { userId, shopId: shop.clerkOrgId } },
          update: {},
          create: {
            userId,
            shopId: shop.clerkOrgId,
          },
        })
      )
    )
  }

  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  // Find the shop by code
  const shop = await prisma.shops.findUnique({
    where: { code: shopCode },
    select: { clerkOrgId: true },
  });

  if (!shop) {
    // Fallback: Remove code from Clerk metadata even if shop doesn't exist in DB
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const existingMetadata = user.publicMetadata || {};
    const currentShopCodes = Array.isArray(existingMetadata.shopCodes) ? existingMetadata.shopCodes : [];

    const updatedShopCodes = currentShopCodes.filter((code: string) => code !== shopCode);

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...existingMetadata,
        shopCodes: updatedShopCodes,
      },
    });

    return Response.json({ success: false, error: "Shop not found in database, but removed from metadata" }, { status: 200 });
  }

  // Delete the ShopSubscription entry
  await prisma.shopSubscription.deleteMany({
    where: {
      userId: userId,
      shopId: shop.clerkOrgId,
    },
  });

  // Update Clerk metadata: remove shopCode from shopCodes array
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = user.publicMetadata || {};
  const currentShopCodes = Array.isArray(existingMetadata.shopCodes) ? existingMetadata.shopCodes : [];

  const updatedShopCodes = currentShopCodes.filter((code: string) => code !== shopCode);

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      shopCodes: updatedShopCodes,
    },
  });

  return Response.json({ success: true });
}