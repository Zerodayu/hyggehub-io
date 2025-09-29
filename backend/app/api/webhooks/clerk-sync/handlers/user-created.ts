import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"
import type { ClerkUserEventData } from "@/lib/types"


export async function handleUserCreated(data: ClerkUserEventData) {
  const { id, username, email_addresses, public_metadata, image_url } = data
  const birthday = public_metadata?.birthday

  await prisma.users.create({
    data: {
      clerkId: id,
      username: username || '',
      email: email_addresses[0]?.email_address || '',
      bdate: birthday,
      avatarUrl: image_url || null, // <-- Save image URL
    },
  })
}