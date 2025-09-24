import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Example: handle user.created event
  if (body.type === "user.created") {
    const { id, username, email, birthday } = body.data;
    await prisma.users.upsert({
      where: { clerkId: id },
      update: { username, email, bdate: new Date(birthday) },
      create: { clerkId: id, username, email, bdate: new Date(birthday) },
    });
  }

  // Example: handle organization.created event
  if (body.type === "organization.created") {
    const { id, name, code, location, message } = body.data;
    await prisma.shops.upsert({
      where: { clerkOrgId: id },
      update: { name, code, location, message },
      create: { clerkOrgId: id, name, code, location, message },
    });
  }

  return NextResponse.json({ ok: true });
}