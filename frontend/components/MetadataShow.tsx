"use client"

import { Phone } from "lucide-react"
import { useOrganization } from "@clerk/nextjs";
import { useShopMetadata } from '@/api/api-org-metadata';

export default function MetadataDisplay() {
    const { organization } = useOrganization();
    const orgId = organization?.id;

    const { data, isLoading } = useShopMetadata(orgId);

    const shopNum = data?.shopNum as string | undefined;
    const shopCode = data?.shopCode as string | undefined;

    return (
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
                <Phone />
                {isLoading ? "---" : (shopNum ?? "No phone number")}
            </span>
            <span className="flex items-center gap-1">
                {isLoading ? "---" : (shopCode ?? "No shop code")}
            </span>
        </div>
    )
}
