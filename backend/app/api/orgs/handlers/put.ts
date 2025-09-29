import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function PUT(req: NextRequest) {
  try {
    const { orgId, shopCode, phoneNo } = await req.json();
    const clerkUserId = req.headers.get("x-clerk-user-id");

    if (!clerkUserId) {
      return Response.json(
        { success: false, error: "Missing user authentication." },
        { status: 401 }
      );
    }

    // Check if user is a member of the org
    const membership = await prisma.orgMembers.findUnique({
      where: { clerkId_orgId: { clerkId: clerkUserId, orgId } },
    });

    if (!membership) {
      return Response.json(
        { success: false, error: "User is not a member of this organization." },
        { status: 403 }
      );
    }

    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ organizationId: orgId });
    const metadata = org.publicMetadata || {};

    // Allow updating shopCode and phoneNo
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { ...metadata, shopCode, phoneNo },
    });

    // Update DB if you store org-shopCode mapping
    await prisma.shops.updateMany({
      where: { clerkOrgId: orgId },
      data: { code: shopCode },
    });

    return Response.json({ success: true, shopCode, phoneNo, message: "Shop code and phone number updated successfully." });
  } catch (error: string | unknown) {
    return Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}