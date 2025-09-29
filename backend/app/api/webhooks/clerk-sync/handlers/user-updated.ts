import prisma from "@/prisma/PrismaClient"
import type { ClerkUserEventData } from "@/lib/types"

export async function handleUserUpdated(data: ClerkUserEventData) {
  const { id, username, email_addresses, public_metadata, image_url } = data;
  const birthday = public_metadata?.birthday;

  const existingUser = await prisma.users.findUnique({
    where: { clerkId: id },
    include: { shops: true },
  });

  // Update user info
  await prisma.users.update({
    where: { clerkId: id },
    data: {
      username: username ?? existingUser?.username ?? '',
      email: email_addresses?.[0]?.email_address ?? existingUser?.email ?? '',
      bdate: birthday ?? existingUser?.bdate,
      avatarUrl: image_url ?? existingUser?.avatarUrl ?? null, // <-- Update image URL
    },
  });

  // --- Sync ShopSubscription ---
  // Get shopCodes from metadata
  const newShopCodes = Array.isArray(public_metadata?.shopCodes)
    ? public_metadata.shopCodes
    : typeof public_metadata?.shopCodes === "string"
      ? [public_metadata.shopCodes]
      : [];

  // Get all shop clerkOrgIds for these codes
  const shops = await prisma.shops.findMany({
    where: { code: { in: newShopCodes } },
    select: { clerkOrgId: true, code: true },
  });
  const newOrgIds = shops.map(s => s.clerkOrgId);

  // Find subscriptions to remove
  const currentOrgIds = existingUser?.shops.map(sub => sub.shopId) ?? [];
  const toRemove = currentOrgIds.filter(orgId => !newOrgIds.includes(orgId));

  // Remove subscriptions for removed codes
  for (const shopId of toRemove) {
    await prisma.shopSubscription.deleteMany({
      where: { userId: id, shopId },
    });
  }

  // Optionally, add new subscriptions for added codes (if not already present)
  for (const shopId of newOrgIds) {
    if (!currentOrgIds.includes(shopId)) {
      await prisma.shopSubscription.create({
        data: { userId: id, shopId },
      });
    }
  }
}