import prisma from '@/prisma/PrismaClient'

export async function GET(request: Request) {
  try {
    const users = await prisma.users.findMany({
      include: {
        shop: true // Include related shop data
      }
    });
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, shopCode } = body;

    // Validate required fields
    if (!name || !email || !password || !shopCode) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password,
        shopCode,
      },
      include: {
        shop: true // Include related shop data in response
      }
    });

    return new Response(JSON.stringify({
      message: `${newUser.name} created successfully`,
      data: newUser
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('User creation error:', error);

    // Handle unique constraint violation (email)
    if (error.code === 'P2002') {
      return new Response(
        JSON.stringify({ error: 'Email already exists' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle foreign key constraint violation (shopCode)
    if (error.code === 'P2003') {
      return new Response(
        JSON.stringify({ error: 'Invalid shop code' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to create user',
        details: error.message || 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}