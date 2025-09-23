import { createClerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export async function GET() {
  try {
    const userList = await clerkClient.users.getUserList()
    return NextResponse.json({ users: userList })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
 
    const user = await clerkClient.users.createUser({
      emailAddress: [body.emailAddress], // Changed to array of strings
      password: body.password,
      username: body.username
    })
    return NextResponse.json({ message: 'User created', user })
  } catch (error: any) {
    // Handle Clerk-specific errors
    if (error.errors) {
      return NextResponse.json({ 
        error: error.errors[0].message,
        details: error.errors
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Error creating user',
      message: error.message 
    }, { status: 500 })
  }
}