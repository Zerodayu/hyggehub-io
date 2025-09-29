import prisma from "@/prisma/PrismaClient"
import type { ClerkUserEventData } from "@/lib/types"

export async function handleUserDeleted(data: Pick<ClerkUserEventData, 'id'>) {
  const { id } = data;
  await prisma.users.delete({
    where: { clerkId: id },
  });
}