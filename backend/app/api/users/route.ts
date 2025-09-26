import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

// --- POST: Add birthday and/or shopCode ---
export async function POST(req: NextRequest) {
  const { birthday, userId, shopCode } = await req.json();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

  // Validate shopCode uniqueness
  if (shopCode && shopCodes.includes(shopCode)) {
    return Response.json({ success: false, error: "Code already exists", shopCodes }, { status: 400 });
  }

  // Add shopCode if provided
  const updatedShopCodes = shopCode ? [...shopCodes, shopCode] : shopCodes;

  // Prepare new metadata
  const newMetadata = {
    ...metadata,
    ...(birthday !== undefined && {
      birthday: birthday ? new Date(birthday).toISOString().split("T")[0] : null,
    }),
    ...(shopCode !== undefined && { shopCodes: updatedShopCodes }),
  };

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, { publicMetadata: newMetadata });

  // Save birthday to DB
  if (birthday) {
    await prisma.users.update({
      where: { clerkId: userId },
      data: { bdate: birthday },
    });
  }

  // Save shopCode to ShopSubscription
  if (shopCode) {
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
  }

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}

// --- PATCH: Add a shopCode to shopCodes array ---
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

// --- DELETE: Remove a shopCode from shopCodes array ---
export async function DELETE(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

  // Validate shopCode existence
  if (!shopCodes.includes(shopCode)) {
    return Response.json(
      { success: false, error: "Code does not exist", shopCodes },
      { status: 400 }
    );
  }

  // Remove shopCode
  const updatedShopCodes = shopCodes.filter((c) => c !== shopCode);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...metadata, shopCodes: updatedShopCodes },
  });

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}