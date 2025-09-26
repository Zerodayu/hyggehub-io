import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/prisma/PrismaClient" // Make sure this import is correct for your project

export async function POST(req: NextRequest) {
  const { birthday, userId } = await req.json()

  // Convert birthday string to Date object
  const birthdayDate = birthday ? new Date(birthday) : null

  // Update Clerk metadata
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      birthday: birthdayDate ? birthdayDate.toISOString().split('T')[0] : null, // Store as YYYY-MM-DD
    },
  })

  // Save to database (assuming you have a users table with clerkId and bdate columns)
  if (birthdayDate) {
    await prisma.users.update({
      where: { clerkId: userId },
      data: { bdate: birthday }, // Save as 'YYYY-MM-DD'
    })
  }

  return Response.json({ success: true })
}