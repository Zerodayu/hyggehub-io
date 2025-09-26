import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function DELETE(req: NextRequest) {
  const { userId, shopCode } = await req.json();

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const metadata = user.publicMetadata || {};
  const shopCodes: string[] = Array.isArray(metadata.shopCodes) ? metadata.shopCodes : [];

  // Validate shopCode existence
  if (!shopCodes.includes(shopCode)) {
    return Response.json(
      { success: false, error: "Code does not exist", shopCodes },
      { status: 400 }
    );
  }

  // Remove shopCode
  const updatedShopCodes = shopCodes.filter((c) => c !== shopCode);

  // Update Clerk metadata
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { ...metadata, shopCodes: updatedShopCodes },
  });

  return Response.json({ success: true, shopCodes: updatedShopCodes });
}