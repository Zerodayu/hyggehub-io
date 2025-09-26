import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function PUT(req: NextRequest) {
  try {
    const { orgId, shopCode, userId } = await req.json();

    const client = await clerkClient();
    // Get organization memberships (paginated response)
    const membershipsResponse = await client.organizations.getOrganizationMembershipList({ organizationId: orgId });
    const memberships = membershipsResponse.data; // Array of OrganizationMembership

    // Check if user is a member of the organization
    const isMember = memberships.some((m: any) => m.publicUserData.userId === userId);
    if (!isMember) {
      return Response.json(
        { success: false, error: "User is not a member of this organization" },
        { status: 403 }
      );
    }

    // Update Clerk metadata only
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { shopCode },
    });

    return Response.json({ success: true, shopCode, message: "Shop code updated successfully." });
  } catch (error: string | unknown) {
    return Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}