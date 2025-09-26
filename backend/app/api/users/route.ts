import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/prisma/PrismaClient"

// --- Global Helpers ---
const getClerkClient = async () => await clerkClient();
const getClerkUser = async (client: any, userId: string) => await client.users.getUser(userId);

const getUserMetadata = (user: any) => user.publicMetadata || {};
const getShopCodes = (metadata: any): string[] =>
  Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

const getShopByCode = async (shopCode: string) =>
  await prisma.shops.findUnique({
    where: { code: shopCode },
    select: { clerkOrgId: true },
  });

const upsertShopSubscription = async (userId: string, shopId: string) =>
  await prisma.shopSubscription.upsert({
    where: { userId_shopId: { userId, shopId } },
    update: {},
    create: { userId, shopId },
  });

// --- POST: Accepts a single shopCode string, stores as array ---
export async function POST(req: NextRequest) {
  const { birthday, userId, shopCode } = await req.json();

  // Convert birthday string to Date object
  const birthdayDate = birthday ? new Date(birthday) : null;

  // Clerk user and metadata
  const client = await getClerkClient();
  const user = await getClerkUser(client, userId);
  const existingMetadata = getUserMetadata(user);
  const existingShopCodes = getShopCodes(existingMetadata);

  // Validation: shopCode must be a string
  if (typeof shopCode !== "string" || !shopCode.trim()) {
    return Response.json({ success: false, error: "shopCode must be a non-empty string" }, { status: 400 });
  }

  // Validation: Check if shopCode already exists
  if (existingShopCodes.includes(shopCode)) {
    return Response.json({ success: false, error: "Code already exists", shopCodes: existingShopCodes }, { status: 400 });
  }

  // Always store as array
  const updatedShopCodes = [...existingShopCodes, shopCode];

  // Prepare new metadata, merging with existing
  const newMetadata = {
    ...existingMetadata,
    ...(birthday !== undefined && {
      birthday: birthdayDate ? birthdayDate.toISOString().split('T')[0] : null,
    }),
    shopCodes: updatedShopCodes,
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
    });
  }

  // Save shopCode to ShopSubscription
  const shop = await getShopByCode(shopCode);
  if (shop) {
    await upsertShopSubscription(userId, shop.clerkOrgId);
  }

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}

// --- PATCH: Add a shopCode to existing shopCodes array ---
export async function PATCH(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  const client = await getClerkClient();
  const user = await getClerkUser(client, userId);
  const existingMetadata = getUserMetadata(user);
  const shopCodes = getShopCodes(existingMetadata);

  // Validation: Check if shopCode already exists
  if (shopCodes.includes(shopCode)) {
    return Response.json({ success: false, error: "Code already exists", shopCodes }, { status: 400 });
  }

  // Add new code
  shopCodes.push(shopCode);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      shopCodes,
    },
  });

  // Add shopCode to ShopSubscription
  const shop = await getShopByCode(shopCode);
  if (shop) {
    await upsertShopSubscription(userId, shop.clerkOrgId);
  }

  return Response.json({ success: true, shopCodes });
}

// --- DELETE: Remove a shopCode from shopCodes array ---
export async function DELETE(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  // Clerk user and metadata
  const client = await getClerkClient();
  const user = await getClerkUser(client, userId);
  const existingMetadata = getUserMetadata(user);
  const shopCodes = getShopCodes(existingMetadata);

  // Remove the code from shopCodes
  const updatedShopCodes = shopCodes.filter((c) => c !== shopCode);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...existingMetadata,
      shopCodes: updatedShopCodes,
    },
  });

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}