import { useQuery } from '@tanstack/react-query';
import { getOrg } from './api-org';

export function useShopMetadata(orgId?: string) {
    return useQuery({
        queryKey: ['shop-metadata', orgId],
        queryFn: () => orgId ? getOrg(orgId).then(data => ({
            shopNum: data?.shop?.shopNum,
            shopCode: data?.shop?.code,
        })) : Promise.resolve(null),
        enabled: !!orgId,
    });
}