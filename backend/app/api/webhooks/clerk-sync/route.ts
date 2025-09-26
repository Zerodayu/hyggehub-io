import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"

type ClerkUserEventData = {
  id: string
  username?: string | null
  email_addresses: { email_address: string }[]
  public_metadata?: { birthday?: string }
}

type ClerkOrgEventData = {
  id: string
  name: string
  public_metadata?: {
    message?: string
    location?: string
    code?: string
  } | null
}

// User Handlers
async function handleUserCreated(data: ClerkUserEventData) {
  const { id, username, email_addresses, public_metadata } = data
  const birthday = public_metadata?.birthday

  await prisma.users.create({
    data: {
      clerkId: id,
      username: username || '',
      email: email_addresses[0]?.email_address || '',
      bdate: birthday,
    },
  })
}

async function handleUserUpdated(data: ClerkUserEventData) {
  const { id, username, email_addresses, public_metadata } = data
  const birthday = public_metadata?.birthday

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
async function handleOrgCreated(data: ClerkOrgEventData) {
  const { id, name } = data

  await prisma.shops.create({
    data: {
      clerkOrgId: id,
      name: name || '',
    },
  })
}

async function handleOrgUpdated(data: ClerkOrgEventData) {
  const { id, name, public_metadata } = data
  const message = public_metadata?.message
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
      location: location ?? existingShop?.location,
      code: code ?? existingShop?.code ?? id,
    },
  })
}

async function handleOrgDeleted(data: Pick<ClerkOrgEventData, 'id'>) {
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
    const eventType = evt.type
    const id = evt.data?.id

    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    switch (eventType) {
      case 'user.created':
        console.log('userId:', evt.data.id)
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
        if (typeof evt.data.id === 'string') {
          await handleOrgDeleted({ id: evt.data.id })
        } else {
          console.error('organization.deleted event missing id')
        }
        break
      default:
        console.log('Unknown event type:', eventType)
        break
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
