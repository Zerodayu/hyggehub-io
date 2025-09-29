import prisma from "@/prisma/PrismaClient"
import type { ClerkOrgMember } from "@/lib/types"

export async function syncOrgMembers(orgId: string, members: ClerkOrgMember[] = []) {
  // Get current members from DB
  const currentMembers = await prisma.orgMembers.findMany({
    where: { orgId },
    select: { clerkId: true }
  });
  const currentClerkIds = currentMembers.map(m => m.clerkId);

  // Upsert each member
  for (const member of members) {
    await prisma.orgMembers.upsert({
      where: { clerkId_orgId: { clerkId: member.clerkId, orgId } },
      update: { role: member.role },
      create: {
        clerkId: member.clerkId,
        orgId,
        role: member.role,
      }
    });
  }

  // Remove members not in the new list
  const newClerkIds = members.map(m => m.clerkId);
  const toRemove = currentClerkIds.filter(id => !newClerkIds.includes(id));
  for (const clerkId of toRemove) {
    await prisma.orgMembers.deleteMany({
      where: { clerkId, orgId }
    });
  }
}