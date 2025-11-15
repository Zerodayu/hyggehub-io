import prisma from "@/prisma/PrismaClient"
import type { ClerkOrgEventData } from "@/lib/types"

export async function handleOrgDeleted(data: Pick<ClerkOrgEventData, 'id'>) {
  const { id } = data

  // First find the shop to get its shopId
  const shop = await prisma.shops.findUnique({
    where: { clerkOrgId: id },
    select: { shopId: true }
  });

  if (!shop) return;

  // Delete all shop messages first
  await prisma.shopMessage.deleteMany({
    where: { shopId: shop.shopId }
  });

  // Delete all subscriptions for this shop
  await prisma.shopSubscription.deleteMany({
    where: { shopId: id }
  });

  // Finally delete the shop itself
  await prisma.shops.delete({
    where: { clerkOrgId: id }
  });
}