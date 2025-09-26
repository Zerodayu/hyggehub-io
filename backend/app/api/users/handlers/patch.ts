import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

function getShopCodesArray(metadata: any, shopCode: string): string[] {
  if (!metadata || typeof metadata !== "object") {
    // No metadata exists, create array with the new shopCode
    return [shopCode];
  }
  if (Array.isArray(metadata.shopCodes)) {
    return [...metadata.shopCodes, shopCode];
  }
  if (metadata.shopCodes) {
    return [metadata.shopCodes, shopCode];
  }
  return [shopCode];
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, shopCode } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};

    // Validate shopCode existence in DB
    const shop = await prisma.shops.findUnique({
      where: { code: shopCode },
      select: { clerkOrgId: true },
    });
    if (!shop) {
      return Response.json({ success: false, error: "Shop code does not exist" }, { status: 404 });
    }

    // Create or update shopCodes array
    const shopCodes = getShopCodesArray(metadata, shopCode);

    // Update Clerk metadata
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { ...metadata, shopCodes },
    });

    // Add shopCode to ShopSubscription
    await prisma.shopSubscription.upsert({
      where: { userId_shopId: { userId, shopId: shop.clerkOrgId } },
      update: {},
      create: { userId, shopId: shop.clerkOrgId },
    });

    return Response.json({ 
      success: true, 
      message: "Shop code added successfully.", 
      shopCodes
    });
  } catch (error: string | unknown) {
    return Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}