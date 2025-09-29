import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"
import type { ClerkOrgEventData } from "@/lib/types"

export async function handleOrgDeleted(data: Pick<ClerkOrgEventData, 'id'>) {
  const { id } = data

  // Delete all subscriptions for this shop
  await prisma.shopSubscription.deleteMany({
    where: { shopId: id },
  });

  // Delete the shop itself
  await prisma.shops.delete({
    where: { clerkOrgId: id },
  });
}