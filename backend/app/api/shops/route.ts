import prisma from '@/prisma/PrismaClient'

export async function GET(request: Request) {
  try {
    const shops = await prisma.shops.findMany({
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });
    return new Response(JSON.stringify(shops), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch shops' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, location, code } = body;

    // Validate required fields
    if (!name || !message || !location || !code) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new shop with optional user connection
    const newShop = await prisma.shops.create({
      data: {
        name,
        message,
        location,
        code,
      },
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    return new Response(JSON.stringify({
      message: `${newShop.name} shop created successfully`,
      data: newShop
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Shop creation error:', error);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return new Response(
        JSON.stringify({ error: 'Shop code already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to create shop',
        details: error.message || 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}