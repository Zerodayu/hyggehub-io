import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"
import type { ClerkOrgEventData } from "@/lib/types"

export async function handleOrgCreated(data: ClerkOrgEventData) {
  const { id, name, image_url, members } = data

  await prisma.shops.create({
    data: {
      clerkOrgId: id,
      name: name || '',
      imgUrl: image_url || null,
    },
  });

  // Scan and load members into OrgMembers and Users
  if (members && members.length > 0) {
    for (const member of members) {
      // Upsert user if not exists (minimal info, can be updated later)
      await prisma.users.upsert({
        where: { clerkId: member.clerkId },
        update: {},
        create: {
          clerkId: member.clerkId,
          username: '',
          email: '', // You may want to fetch email if available
        }
      });

      // Upsert org membership
      await prisma.orgMembers.upsert({
        where: { clerkId_orgId: { clerkId: member.clerkId, orgId: id } },
        update: { role: member.role },
        create: {
          clerkId: member.clerkId,
          orgId: id,
          role: member.role,
        }
      });
    }
  }
}