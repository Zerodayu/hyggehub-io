import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";
import { withCORS } from "@/cors";

function getShopCodesArray(metadata: Record<string, unknown>, shopCode: string): string[] {
  if (!metadata || typeof metadata !== "object") {
    return [shopCode];
  }
  const codes = metadata.shopCodes;
  if (Array.isArray(codes)) {
    return codes.includes(shopCode) ? codes : [...codes, shopCode];
  }
  if (typeof codes === "string") {
    return codes === shopCode ? [codes] : [codes, shopCode];
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
      return withCORS(Response.json({ success: false, error: "Shop code does not exist" }, { status: 404 }));
    }

    // Check if shopCode already exists in metadata
    const codes = metadata.shopCodes;
    if (
      (Array.isArray(codes) && codes.includes(shopCode)) ||
      (typeof codes === "string" && codes === shopCode)
    ) {
      return withCORS(Response.json({
        success: false,
        message: "Shop code already exists."
      }, { status: 200 }));
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

    return withCORS(Response.json({
      success: true,
      message: "Shop code added successfully."
    }));
  } catch (error: string | unknown) {
    return withCORS(Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 }));
  }
}