import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"

type ClerkUserEventData = {
  id: string
  username?: string | null
  email_addresses: { email_address: string }[]
  image_url?: string | null // <-- Add this line
  public_metadata?: {
    birthday?: string
    shopCodes?: string[] | string
  }
}

type ClerkOrgEventData = {
  id: string
  name: string
  image_url?: string | null // <-- Add this line
  public_metadata?: {
    message?: string
    location?: string
    code?: string
  } | null
}

// User Handlers
async function handleUserCreated(data: ClerkUserEventData) {
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

async function handleUserUpdated(data: ClerkUserEventData) {
  const { id, username, email_addresses, public_metadata, image_url } = data;
  const birthday = public_metadata?.birthday;

  const existingUser = await prisma.users.findUnique({
    where: { clerkId: id },
    include: { shops: true },
  });

  // Update user info
  await prisma.users.update({
    where: { clerkId: id },
    data: {
      username: username ?? existingUser?.username ?? '',
      email: email_addresses?.[0]?.email_address ?? existingUser?.email ?? '',
      bdate: birthday ?? existingUser?.bdate,
      avatarUrl: image_url ?? existingUser?.avatarUrl ?? null, // <-- Update image URL
    },
  });

  // --- Sync ShopSubscription ---
  // Get shopCodes from metadata
  const newShopCodes = Array.isArray(public_metadata?.shopCodes)
    ? public_metadata.shopCodes
    : typeof public_metadata?.shopCodes === "string"
      ? [public_metadata.shopCodes]
      : [];

  // Get all shop clerkOrgIds for these codes
  const shops = await prisma.shops.findMany({
    where: { code: { in: newShopCodes } },
    select: { clerkOrgId: true, code: true },
  });
  const newOrgIds = shops.map(s => s.clerkOrgId);

  // Find subscriptions to remove
  const currentOrgIds = existingUser?.shops.map(sub => sub.shopId) ?? [];
  const toRemove = currentOrgIds.filter(orgId => !newOrgIds.includes(orgId));

  // Remove subscriptions for removed codes
  for (const shopId of toRemove) {
    await prisma.shopSubscription.deleteMany({
      where: { userId: id, shopId },
    });
  }

  // Optionally, add new subscriptions for added codes (if not already present)
  for (const shopId of newOrgIds) {
    if (!currentOrgIds.includes(shopId)) {
      await prisma.shopSubscription.create({
        data: { userId: id, shopId },
      });
    }
  }
}

// Organization Handlers
async function handleOrgCreated(data: ClerkOrgEventData) {
  const { id, name, image_url } = data

  await prisma.shops.create({
    data: {
      clerkOrgId: id,
      name: name || '',
      imgUrl: image_url || null, // <-- Save org image URL
    },
  })
}

async function handleOrgUpdated(data: ClerkOrgEventData) {
  const { id, name, public_metadata, image_url } = data
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
      imgUrl: image_url ?? existingShop?.imgUrl ?? null, // <-- Update org image URL
    },
  })
}

async function handleOrgDeleted(data: Pick<ClerkOrgEventData, 'id'>) {
  const { id } = data
  await prisma.shops.delete({
    where: { clerkOrgId: id },
  })
}

// User Deleted Handler
async function handleUserDeleted(data: Pick<ClerkUserEventData, 'id'>) {
  const { id } = data;
  await prisma.users.delete({
    where: { clerkId: id },
  });
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
      case 'user.deleted':
        if (typeof evt.data.id === 'string') {
          await handleUserDeleted({ id: evt.data.id })
        } else {
          console.error('user.deleted event missing id')
        }
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
