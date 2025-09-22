import prisma from '@/prisma/PrismaClient'
import { genSaltSync, hashSync } from "bcrypt-ts";

// Validation utility functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);

  return hasMinLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumber;
};

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

    // Validate email format and password strength
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!isValidPassword(password)) {
      return new Response(
        JSON.stringify({ 
          error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Hash password before storing
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    // Create new user with hashed password
    const newUser = await prisma.users.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword, // Store the hashed password instead of plain text
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