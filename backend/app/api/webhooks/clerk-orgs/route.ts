import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import prisma from "@/prisma/PrismaClient"

export async function GET() {
  try {
    const shops = await prisma.shops.findMany()
    return new Response(JSON.stringify(shops), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching shops:', err)
    return new Response('Error fetching shops', { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Organization created
    if (evt.type === 'organization.created') {
      const { id, name, public_metadata } = evt.data
      const message = public_metadata?.message as string | undefined
      const location = public_metadata?.location as string | undefined
      const code = public_metadata?.code as string | undefined

      await prisma.shops.create({
        data: {
          clerkOrgId: id,
          name: name || '',
          message,
          location,
          code: code || id, // fallback to org id if no code
        },
      })
    }

    // Organization updated
    if (evt.type === 'organization.updated') {
      const { id, name, public_metadata } = evt.data
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

    // Optionally handle organization.deleted
    if (evt.type === 'organization.deleted') {
      const { id } = evt.data
      await prisma.shops.delete({
        where: { clerkOrgId: id },
      })
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying org webhook:', err)
    return new Response('Error verifying org webhook', { status: 400 })
  }
}