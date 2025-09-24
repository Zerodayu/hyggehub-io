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

      // Fetch current user from DB
      const existingUser = await prisma.users.findUnique({
        where: { clerkId: id },
      })

      // Update user in database, fallback to existing values if Clerk omits them
      await prisma.users.update({
        where: { clerkId: id },
        data: {
          username: username ?? existingUser?.username ?? '',
          email: email_addresses?.[0]?.email_address ?? existingUser?.email ?? '',
          bdate: birthday ?? existingUser?.bdate,
        },
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    if (evt.type === 'user.deleted') {
      const { id } = evt.data

      // Find user by clerkId to get userId
      const user = await prisma.users.findUnique({
        where: { clerkId: id },
      })

      console.log('User found:', user)

      if (!user) {
        console.log('User not found for clerkId:', id)
        return new Response('User not found', { status: 404 })
      }

      // Delete user by userId
      await prisma.users.delete({
        where: { userId: user.userId },
      })

      console.log('User deleted:', user.userId)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}