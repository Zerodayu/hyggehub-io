import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"

// User Handlers
async function handleUserCreated(data: any) {
  const { id, username, email_addresses, public_metadata } = data
  const birthday = public_metadata?.birthday as string | undefined

  await prisma.users.create({
    data: {
      clerkId: id,
      username: username || '',
      email: email_addresses[0]?.email_address || '',
      bdate: birthday,
    },
  })
}

async function handleUserUpdated(data: any) {
  const { id, username, email_addresses, public_metadata } = data
  const birthday = public_metadata?.birthday as string | undefined

  const existingUser = await prisma.users.findUnique({
    where: { clerkId: id },
  })

  await prisma.users.update({
    where: { clerkId: id },
    data: {
      username: username ?? existingUser?.username ?? '',
      email: email_addresses?.[0]?.email_address ?? existingUser?.email ?? '',
      bdate: birthday ?? existingUser?.bdate,
    },
  })
}

// Organization Handlers
async function handleOrgCreated(data: any) {
  const { id, name } = data

  await prisma.shops.create({
    data: {
      clerkOrgId: id,
      name: name || '',
    },
  })
}

async function handleOrgUpdated(data: any) {
  const { id, name, public_metadata } = data
  const message = public_metadata?.message as string | undefined
  const location = public_metadata?.location as string | undefined
  const code = public_metadata?.code as string | undefined

  const existingShop = await prisma.shops.findUnique({
    where: { clerkOrgId: id },
  })

  await prisma.shops.update({
    where: { clerkOrgId: id },
    data: {
      name: name ?? existingShop?.name ?? '',
      message: message ?? existingShop?.message,
      location: location ?? existingShop?.location,
      code: code ?? existingShop?.code ?? id,
    },
  })
}

async function handleOrgDeleted(data: any) {
  const { id } = data
  await prisma.shops.delete({
    where: { clerkOrgId: id },
  })
}

export async function GET() {
  try {
    const users = await prisma.users.findMany()
    const shops = await prisma.shops.findMany()
    return new Response(JSON.stringify({ users, shops }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching users/shops:', err)
    return new Response('Error fetching users/shops', { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'organization.created':
        await handleOrgCreated(evt.data)
        break
      case 'organization.updated':
        await handleOrgUpdated(evt.data)
        break
      case 'organization.deleted':
        await handleOrgDeleted(evt.data)
        break
      default:
        // Optionally handle unknown event types
        break
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
