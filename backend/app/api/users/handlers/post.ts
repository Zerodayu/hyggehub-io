import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  try {
    const { birthday, userId, shopCode } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};
    const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

    // Validation: Check if birthday or shopCode already exists
    const birthdayExists = metadata.birthday !== undefined && metadata.birthday !== null;
    const shopCodeExists = shopCode && shopCodes.includes(shopCode);

    if ((birthday && birthdayExists) || shopCodeExists) {
      return Response.json(
        {
          success: false,
          error: `Already exists: ${birthdayExists ? "birthday" : ""}${birthdayExists && shopCodeExists ? " & " : ""}${shopCodeExists ? "shopCode" : ""}`,
          shopCodes,
          birthday: metadata.birthday,
        },
        { status: 400 }
      );
    }

    // Prepare new metadata, only add if not present
    const newMetadata = {
      ...metadata,
      ...(birthday && !birthdayExists && {
        birthday: new Date(birthday).toISOString().split("T")[0],
      }),
      ...(shopCode && !shopCodeExists && {
        shopCodes: [...shopCodes, shopCode],
      }),
    };

    // Update Clerk metadata
    await client.users.updateUserMetadata(userId, { publicMetadata: newMetadata });

    // Save birthday to DB if not present
    if (birthday && !birthdayExists) {
      await prisma.users.update({
        where: { clerkId: userId },
        data: { bdate: birthday },
      });
    }

    // Validate shopCode existence in DB
    if (shopCode) {
      const shop = await prisma.shops.findUnique({
        where: { code: shopCode },
        select: { clerkOrgId: true },
      });
      if (!shop) {
        return Response.json({ success: false, error: "Shop code does not exist" }, { status: 404 });
      }
    }

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

    return Response.json({ success: true, shopCodes: newMetadata.shopCodes || shopCodes, birthday: newMetadata.birthday });
  } catch (error: string | unknown) {
    return Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}