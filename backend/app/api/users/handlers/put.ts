import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function PUT(req: NextRequest) {
  try {
    const { birthday, userId, shopCodes } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};

    // Validate all shopCodes exist in DB
    let validShopCodes = shopCodes;
    if (Array.isArray(shopCodes)) {
      const foundShops = await prisma.shops.findMany({
        where: { code: { in: shopCodes } },
        select: { code: true },
      });
      validShopCodes = foundShops.map(shop => shop.code);
      if (validShopCodes.length !== shopCodes.length) {
        return Response.json({ success: false, error: "One or more shop codes do not exist", validShopCodes }, { status: 404 });
      }
    }

    // Update metadata fields
    const newMetadata = {
      ...metadata,
      ...(birthday !== undefined && {
        birthday: birthday ? new Date(birthday).toISOString().split("T")[0] : null,
      }),
      ...(shopCodes !== undefined && { shopCodes: validShopCodes }),
    };

    // Update Clerk metadata
    await client.users.updateUserMetadata(userId, { publicMetadata: newMetadata });

    // Update birthday in DB
    if (birthday !== undefined) {
      await prisma.users.update({
        where: { clerkId: userId },
        data: { bdate: birthday },
      });
    }

    // Update ShopSubscription for each shopCode
    if (Array.isArray(shopCodes)) {
      for (const code of shopCodes) {
        const shop = await prisma.shops.findUnique({
          where: { code },
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
    }

    return Response.json({ success: true, shopCodes: newMetadata.shopCodes, birthday: newMetadata.birthday });
  } catch (error: string | unknown) {
    return Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}