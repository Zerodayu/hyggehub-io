import prisma from "@/prisma/PrismaClient"
import type { ClerkOrgEventData } from "@/lib/types"
import { syncOrgMembers } from './sync-orgMembers'

export async function handleOrgUpdated(data: ClerkOrgEventData) {
    const { id, name, public_metadata, image_url, members } = data
    const message = public_metadata?.message
    const phoneNo = public_metadata?.phoneNo
    const location = public_metadata?.location
    const code = public_metadata?.code

    const existingShop = await prisma.shops.findUnique({
        where: { clerkOrgId: id },
    })

    await prisma.shops.update({
        where: { clerkOrgId: id },
        data: {
            name: name ?? existingShop?.name ?? '',
            message: message ?? existingShop?.message,
            shopNum: phoneNo ?? existingShop?.shopNum ?? null,
            location: location ?? existingShop?.location,
            code: code ?? existingShop?.code ?? id,
            imgUrl: image_url ?? existingShop?.imgUrl ?? null,
        },
    });

    // Sync members
    await syncOrgMembers(id, members || []);
}