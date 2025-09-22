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

const isValidDate = (dateStr: string): boolean => {
  // Check if the date string matches YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;

  // Check if it's a valid date
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export async function GET(request: Request) {
  try {
    const users = await prisma.users.findMany({
      include: {
        shops: {
          include: {
            shop: true
          }
        }
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
    const { name, email, bdate, password, shopCode } = body;

    // Validate required fields and their types
    if (!name || !email || !bdate || !password || !shopCode) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          details: 'All fields (name, email, bdate, password, shopCode) are required'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate date format
    if (!isValidDate(bdate)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid date format',
          details: 'Date must be in YYYY-MM-DD format'
        }), {
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

    // Create new user with hashed password and connect to shop
    const newUser = await prisma.users.create({
      data: {
        name,
        email: email.toLowerCase(),
        bdate: new Date(bdate),
        password: hashedPassword,
        shops: {
          create: {
            shopCode,
            joinedAt: new Date()
          }
        }
      },
      include: {
        shops: {
          include: {
            shop: true
          }
        }
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