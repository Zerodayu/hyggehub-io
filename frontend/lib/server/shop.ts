"use server";

import { auth } from '@clerk/nextjs/server';
import { getOrg } from '@/api/api-org';

export async function getShopData() {
    const { orgId } = await auth();
    
    if (!orgId) {
        return null;
    }

    const orgData = await getOrg(orgId);
    
    return {
        shopCode: orgData?.shop?.code ?? null,
        shopName: orgData?.shop?.name ?? null,
        orgData,
    };
}