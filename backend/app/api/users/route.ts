import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/prisma/PrismaClient"

export async function POST(req: NextRequest) {
  const { birthday, userId, shopCodes } = await req.json()

  // Convert birthday string to Date object
  const birthdayDate = birthday ? new Date(birthday) : null

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      birthday: birthdayDate ? birthdayDate.toISOString().split('T')[0] : null,
      shopCodes: [],
    },
  })

  // Save birthday to database
  if (birthdayDate) {
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