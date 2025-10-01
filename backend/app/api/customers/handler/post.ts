import { NextRequest } from "next/server";
import { withCORS } from "@/cors";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json();

    if (!name || !phone) {
      return withCORS(Response.json({ success: false, error: "Missing name or phone" }, { status: 400 }));
    }

    // Check if customer with the same phone already exists
    const existingCustomer = await prisma.customers.findUnique({
      where: { phone },
    });

    if (existingCustomer) {
      return withCORS(Response.json({ success: false, error: "Customer with this phone already exists" }, { status: 400 }));
    }

    // Create new customer
    const newCustomer = await prisma.customers.create({
      data: { name, phone },
    });

    return withCORS(Response.json({ success: true, customer: newCustomer }));
  } catch (error: string | unknown) {
    return withCORS(Response.json({ success: false, error: "Internal Server Error" }, { status: 500 }));
  }
}