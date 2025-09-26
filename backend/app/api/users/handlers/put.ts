import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    const { userId, birthday } = await req.json();

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.publicMetadata || {};

    // Update metadata fields (only birthday)
    const newMetadata = {
      ...metadata,
      ...(birthday !== undefined && { birthday }),
    };

    // Update Clerk metadata
    await client.users.updateUserMetadata(userId, { publicMetadata: newMetadata });

    return Response.json({ success: true, birthday: newMetadata.birthday, message: "Birthday updated successfully." });
  } catch (error: string | unknown) {
    return Response.json({ success: false, error: (error as Error).message || "Internal Server Error" }, { status: 500 });
  }
}