import prisma from '@/prisma/PrismaClient'
import { NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return new Response(JSON.stringify({ error: 'Invalid shop ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const shop = await prisma.shops.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    })

    if (!shop) {
      return new Response(JSON.stringify({ error: 'Shop not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify(shop), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch shop' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}