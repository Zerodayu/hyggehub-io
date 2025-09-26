import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  try {
    const { orgId, shopCode } = await req.json();

    const client = await clerkClient();
    const org = await client.organizations.getOrganization(orgId);
    const metadata = org.publicMetadata || {};

    // Only allow one shopCode per org
    if (metadata.shopCode && metadata.shopCode === shopCode) {
      return Response.json(
        {
          success: false,
          error: "Organization already has this shopCode",
          shopCode: metadata.shopCode,
        },
        { status: 400 }
      );
    }

    // Update Clerk metadata
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { ...metadata, shopCode },
    });

    // Optionally, update DB if you store org-shopCode mapping
    await prisma.shops.updateMany({
      where: { clerkOrgId: orgId },
      data: { code: shopCode },
    });

    return Response.json({ success: true, shopCode });
  } catch (error: string | unknown) {
    return Response.json(
      { success: false, error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}