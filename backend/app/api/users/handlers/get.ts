import { clerkClient } from "@clerk/nextjs/server";
import { withCORS } from "@/cors";
import type { OrganizationMembership } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const userId = req.headers.get("x-clerk-user-id");

  if (!userId) {
    return Response.json(
      { success: false, error: "Missing user context." },
      { status: 401 }
    );
  }

  try {
    // Initialize Clerk client
    const client = await clerkClient();
    
    // Get user's organization memberships
    const memberships = await client.users.getOrganizationMembershipList({
      userId
    });

    // Get detailed information for each organization
    const organizations = await Promise.all(
      memberships.data.map(async (membership: OrganizationMembership) => {
        const orgId = membership.organization.id;
        const org = await client.organizations.getOrganization({
          organizationId: orgId
        });

        return {
          id: orgId,
          name: org.name,
          slug: org.slug,
          imageUrl: org.imageUrl,
          memberRole: membership.role,
          metadata: org.publicMetadata || {}
        };
      })
    );

    return withCORS(Response.json({
      success: true,
      userId,
      organizations,
      count: organizations.length
    }, { status: 200 }));
    
  } catch (error) {
    return withCORS(Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    ));
  }
}