import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/prisma/PrismaClient"

// POST: Accepts a single shopCode string, stores as array
export async function POST(req: NextRequest) {
  const { birthday, userId, shopCode } = await req.json()

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
    ...(shopCode !== undefined && {
      shopCodes: [shopCode],
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

  // Save shopCode to ShopSubscription
  if (shopCode) {
    // Find shop with matching code
    const shop = await prisma.shops.findUnique({
      where: { code: shopCode },
      select: { clerkOrgId: true },
    })

    if (shop) {
      await prisma.shopSubscription.upsert({
        where: { userId_shopId: { userId, shopId: shop.clerkOrgId } },
        update: {},
        create: {
          userId,
          shopId: shop.clerkOrgId,
        },
      })
    }
  }

  return Response.json({ success: true })
}

// PATCH: Add a shopCode to existing shopCodes array
export async function PATCH(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingMetadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(existingMetadata.shopCodes) ? existingMetadata.shopCodes : [];

  // Add new code if not already present
  if (!shopCodes.includes(shopCode)) {
    shopCodes.push(shopCode);
  }

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      shopCodes,
    },
  });

  // Add shopCode to ShopSubscription
  const shop = await prisma.shops.findUnique({
    where: { code: shopCode },
    select: { clerkOrgId: true },
  })

  if (shop) {
    await prisma.shopSubscription.upsert({
      where: { userId_shopId: { userId, shopId: shop.clerkOrgId } },
      update: {},
      create: {
        userId,
        shopId: shop.clerkOrgId,
      },
    })
  }

  return Response.json({ success: true, shopCodes });
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

