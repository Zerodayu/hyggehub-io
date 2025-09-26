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
  const { userId, code } = await req.json();

  // Get Clerk user and metadata
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(existingMetadata.shopCodes) ? existingMetadata.shopCodes : [];

  // Remove the code from shopCodes
  const updatedShopCodes = shopCodes.filter((c) => c !== code);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      shopCodes: updatedShopCodes,
    },
  });

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}

