import { NextRequest } from "next/server";
import { withCORS } from "@/cors";
import prisma from "@/prisma/PrismaClient";

export async function POST(req: NextRequest) {
    try {
        const { name, phone, shopCode, birthday } = await req.json();

        if (!name || !phone || !shopCode) {
            return withCORS(
                Response.json(
                    { success: false, error: "Missing name, phone, or shopCode" },
                    { status: 400 }
                )
            );
        }

        // Find shop by code
        const shop = await prisma.shops.findUnique({
            where: { code: shopCode },
        });

        if (!shop) {
            return withCORS(
                Response.json(
                    { success: false, error: "Shop code does not exist" },
                    { status: 404 }
                )
            );
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

        return withCORS(
            Response.json({
                success: true,
                customer: newCustomer,
                shop: shop,
                message: "Code claimed successfully",
            },
                { status: 201 }
            )
        );
    } catch (err: string | unknown) {
        return withCORS(
            Response.json({ success: false, error: (err as Error).message || "Internal Server Error" }, { status: 500 })
        );
    }
}