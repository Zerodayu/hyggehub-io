import { clerkClient } from "@clerk/nextjs/server";
import { withCORS } from "@/cors";
import type { OrganizationMembership } from "@clerk/nextjs/server";
import type { ClerkOrgEventData } from "@/lib/types";
import prisma from "@/prisma/PrismaClient";

export async function PUT(req: Request) {
  const orgId = req.headers.get("x-clerk-org-id");
  const userId = req.headers.get("x-clerk-user-id");

  if (!userId || !orgId) {
    return Response.json(
      { success: false, error: "Missing user or organization context." },
      { status: 401 }
    );
  }

  const { shopCode, phoneNo, messageUpdate } = await req.json();

  try {
    // Check if user is a member of the org using Clerk API
    const client = await clerkClient();
    const memberships = await client.organizations.getOrganizationMembershipList({ organizationId: orgId });

    const isMember = memberships.data.some(
      (member: OrganizationMembership) => member.publicUserData?.userId === userId
    );

    if (!isMember) {
      return withCORS(Response.json(
        { success: false, error: "User is not a member of this organization." },
        { status: 403 }
      ));
    }

    // If there's a message update request, process it
    let updatedMessage = null;
    if (messageUpdate && messageUpdate.id) {
      // Find the shop first
      const shop = await prisma.shops.findUnique({
        where: { clerkOrgId: orgId },
      });
      
      if (!shop) {
        return withCORS(Response.json(
          { success: false, error: "Shop not found" }, 
          { status: 404 }
        ));
      }
      
      // Get the message and verify it belongs to this shop
      const existingMessage = await prisma.shopMessage.findUnique({
        where: { id: messageUpdate.id },
      });
      
      if (!existingMessage) {
        return withCORS(Response.json(
          { success: false, error: "Message not found" }, 
          { status: 404 }
        ));
      }
      
      if (existingMessage.shopId !== shop.shopId) {
        return withCORS(Response.json(
          { success: false, error: "Message does not belong to this shop" }, 
          { status: 403 }
        ));
      }
      
      // Update the message with all possible fields
      type ShopMessageUpdateData = {
        value?: string;
        title?: string;
        expiresAt?: Date | null;
      };
      
      const updateData: ShopMessageUpdateData = {};
      
      if (messageUpdate.value !== undefined) {
        updateData.value = messageUpdate.value;
      }
      
      if (messageUpdate.title !== undefined) {
        updateData.title = messageUpdate.title;
      }
      
      if (messageUpdate.expiresAt !== undefined) {
        updateData.expiresAt = messageUpdate.expiresAt ? new Date(messageUpdate.expiresAt) : null;
      }
      
      // Only update if there are fields to update
      if (Object.keys(updateData).length > 0) {
        updatedMessage = await prisma.shopMessage.update({
          where: { id: messageUpdate.id },
          data: updateData
        });
      }
    }

    // Handle the original Clerk metadata update
    const org = await client.organizations.getOrganization({ organizationId: orgId });
    const metadata = org.publicMetadata || {};

    // Prepare new metadata object
    const newMetadata: ClerkOrgEventData['public_metadata'] = { ...metadata };

    if (shopCode !== undefined) {
      newMetadata.code = shopCode;
    }
    if (phoneNo !== undefined) {
      newMetadata.phoneNo = phoneNo;
    }

    // Update Clerk metadata
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: newMetadata,
    });

    return withCORS(Response.json({
      success: true,
      userId,
      orgId,
      shopCode,
      phoneNo,
      updatedMessage,
      message: updatedMessage 
        ? "Shop code, phone number and message updated successfully." 
        : "Shop code and phone number updated successfully."
    }, { status: 200 }
    ));
  } catch (error: string | unknown) {
    return withCORS(Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    ));
  }
}