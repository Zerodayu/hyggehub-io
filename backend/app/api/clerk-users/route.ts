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

    // Handle both email/password and OAuth sign-ups
    const createUserParams: any = {
      externalAccounts: body.externalAccounts || [], // For OAuth providers
      emailAddress: body.emailAddress ? [body.emailAddress] : [],
      username: body.username
    }

    // Only add password for email/password signup
    if (body.password) {
      createUserParams.password = body.password
    }

    const user = await clerkClient.users.createUser(createUserParams)
    return NextResponse.json({ message: 'User created', user })
    
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 })
  }
}