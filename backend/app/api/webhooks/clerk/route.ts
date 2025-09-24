import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"


export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === 'user.created') {
      const { id, username, email_addresses, public_metadata } = evt.data
      const birthday = public_metadata?.birthday as string | undefined

      // Save user to database
      await prisma.users.create({
        data: {
          clerkId: id,
          username: username || '',
          email: email_addresses[0]?.email_address || '',
          bdate: birthday,
        },
      })
    }

    // Listen for user.updated event
    if (evt.type === 'user.updated') {
      const { id, username, email_addresses, public_metadata } = evt.data
      const birthday = public_metadata?.birthday as string | undefined

      // Update user in database
      await prisma.users.update({
        where: { clerkId: id },
        data: {
          username: username || '',
          email: email_addresses[0]?.email_address || '',
          bdate: birthday,
        },
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}