import { NextRequest } from "next/server";
import { withCORS } from "@/cors";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both single object and array
    const customersData = Array.isArray(body) ? body : [body];

    if (!customersData.length) {
      return withCORS(
        Response.json(
          {
            success: false,
            error: "No customers provided",
          },
          { status: 400 },
        ),
      );
    }

    const invalidCustomerIndex = customersData.findIndex(
      (customer) =>
        !customer?.name?.toString().trim() ||
        !customer?.phone?.toString().trim(),
    );

    if (invalidCustomerIndex !== -1) {
      return withCORS(
        Response.json(
          {
            success: false,
            error: `Missing required fields: name and phone (row ${invalidCustomerIndex + 1})`,
          },
          { status: 400 },
        ),
      );
    }

    let skippedCount = 0;

    const results = await Promise.all(
      customersData.map(async ({ name, phone, shopCode, birthday }) => {
        if (!shopCode) {
          return { success: false, error: "Missing shopCode" };
        }

        // Find shop by code
        const shop = await prisma.shops.findUnique({
          where: { code: shopCode },
        });

        if (!shop) {
          return { success: false, error: "Shop code does not exist" };
        }

        // Check if customer with phone already exists (regardless of shop)
        const existingCustomer = await prisma.customers.findUnique({
          where: { phone },
          include: {
            shops: {
              where: {
                shopId: shop.clerkOrgId,
              },
            },
          },
        });

        // If customer exists and is already subscribed to this shop, skip
        if (existingCustomer && existingCustomer.shops.length > 0) {
          skippedCount++;
          return {
            success: true,
            skipped: true,
            message: "Customer already subscribed to this shop",
          };
        }

        // If customer exists but not subscribed to this shop, just create subscription
        if (existingCustomer) {
          await prisma.shopSubscription.create({
            data: {
              customerId: existingCustomer.customerId,
              shopId: shop.clerkOrgId,
            },
          });
          return {
            success: true,
            customer: existingCustomer,
            shop: shop,
            message: "Existing customer subscribed to shop",
          };
        }

        // Create new customer
        const newCustomer = await prisma.customers.create({
          data: {
            name,
            phone,
            birthday, // Add birthday field to the customer record
          },
        });

        // Link customer to shop via ShopSubscription
        await prisma.shopSubscription.create({
          data: {
            customerId: newCustomer.customerId,
            shopId: shop.clerkOrgId,
          },
        });

        return { success: true, customer: newCustomer, shop: shop };
      }),
    );

    const message =
      skippedCount > 0
        ? `Customers subscribed successfully (skipped ${skippedCount})`
        : "Customers subscribed successfully";

    return withCORS(
      Response.json(
        {
          success: true,
          customers: results,
          message,
        },
        { status: 201 },
      ),
    );
  } catch (err: string | unknown) {
    return withCORS(
      Response.json(
        {
          success: false,
          error: (err as Error).message || "Internal Server Error",
        },
        { status: 500 },
      ),
    );
  }
}
