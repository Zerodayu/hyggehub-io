import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"


export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === 'user.created') {
      const { id, username, email_addresses } = evt.data
      console.log('New user created:', { id, username, email_addresses })

      // Save user to database
      await prisma.users.create({
        data: {
          clerkId: id,
          username: username || '',
          email: email_addresses[0]?.email_address || '',
          bdate: new Date(0),
        },
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}