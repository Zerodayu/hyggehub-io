import { clerkClient } from "@clerk/nextjs/server";
import { withCORS } from "@/cors";
import type { OrganizationMembership } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
  const orgId = req.headers.get("x-clerk-org-id");
  const userId = req.headers.get("x-clerk-user-id");

  if (!userId || !orgId) {
    return Response.json(
      { success: false, error: "Missing user or organization context." },
      { status: 401 }
    );
  }

  const { shopCode, phoneNo } = await req.json();

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

    const org = await client.organizations.getOrganization({ organizationId: orgId });
    const metadata = org.publicMetadata || {};

    // Only update Clerk metadata, do NOT update DB
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { ...metadata, shopCode, phoneNo },
    });

    return withCORS(Response.json({
      success: true,
      userId,
      orgId,
      shopCode,
      phoneNo,
      message: "Shop code and phone number updated successfully."
    }, { status: 200 }
    ));
  } catch (error: string | unknown) {
    return withCORS(Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    ));
  }
}