import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  try {
    const { userId, shopCode } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};
    const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

    // Validation: Check if shopCode already exists
    const shopCodeExists = shopCode && shopCodes.includes(shopCode);

    if (shopCodeExists) {
      return Response.json(
        {
          success: false,
          error: "Already exists: shopCode",
          shopCodes,
        },
        { status: 400 }
      );
    }

    // Validate shopCode existence in DB
    let validShopCode: string | null = null;
    if (shopCode) {
      const shop = await prisma.shops.findUnique({
        where: { code: shopCode },
        select: { clerkOrgId: true },
      });
      if (!shop) {
        return Response.json({ success: false, error: "Shop code does not exist" }, { status: 404 });
      }
      validShopCode = shopCode;
    }

    // Prepare new metadata, only add if not present and valid
    const newMetadata = {
      ...metadata,
      ...(validShopCode && !shopCodeExists && {
        shopCodes: [...shopCodes, validShopCode],
      }),
    };

    // Update Clerk metadata
    await client.users.updateUserMetadata(userId, { publicMetadata: newMetadata });

    // Save shopCode to ShopSubscription if not present
    if (shopCode && !shopCodeExists) {
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

    return Response.json({ success: true, shopCodes: newMetadata.shopCodes || shopCodes, message: "Shop code added successfully." });
  } catch (error: string | unknown) {
    return Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}