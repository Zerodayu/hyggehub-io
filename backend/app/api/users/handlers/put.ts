import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function PUT(req: NextRequest) {
  try {
    const { birthday, userId, shopCodes } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};

    // Update metadata fields
    const newMetadata = {
      ...metadata,
      ...(birthday !== undefined && {
        birthday: birthday ? new Date(birthday).toISOString().split("T")[0] : null,
      }),
      ...(shopCodes !== undefined && { shopCodes }),
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
  } catch (error: any) {
    return Response.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}