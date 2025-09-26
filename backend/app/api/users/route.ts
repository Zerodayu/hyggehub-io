import { NextRequest } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"

export async function POST(req: NextRequest) {
  const { birthday, userId } = await req.json()

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      birthday,
    },
  })

  return Response.json({ success: true })
}