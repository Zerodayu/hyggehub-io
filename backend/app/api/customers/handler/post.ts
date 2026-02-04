import { NextRequest } from "next/server";
import { withCORS } from "@/cors";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        // Support both single object and array
        const customersData = Array.isArray(body) ? body : [body];
        
        const results = await Promise.all(
            customersData.map(async ({ name, phone, shopCode, birthday }) => {
                if (!name || !phone || !shopCode) {
                    return { success: false, error: "Missing name, phone, or shopCode" };
                }

                // Find shop by code
                const shop = await prisma.shops.findUnique({
                    where: { code: shopCode },
                });

                if (!shop) {
                    return { success: false, error: "Shop code does not exist" };
                }

                // Create new customer
                const newCustomer = await prisma.customers.create({
                    data: { 
                        name, 
                        phone,
                        birthday // Add birthday field to the customer record
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
            })
        );

        return withCORS(
            Response.json({
                success: true,
                customers: results,
            }, { status: 201 })
        );
    } catch (err: string | unknown) {
        return withCORS(
            Response.json({ success: false, error: (err as Error).message || "Internal Server Error" }, { status: 500 })
        );
    }
}