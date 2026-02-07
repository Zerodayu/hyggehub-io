// ...existing code...
import { getShopData } from '@/lib/server/shop';
import { ShopProvider } from '@/hooks/contexts/shop-context';
import MigrateSteps from '@/components/migrate-steps';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const shopData = await getShopData();

    return (
        <ShopProvider
            shopCode={shopData?.shopCode ?? undefined}
            shopName={shopData?.shopName ?? undefined}
        >
            {children}
        </ShopProvider>
    );
}