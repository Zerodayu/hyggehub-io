// ...existing code...
import { getShopData } from '@/lib/server/shop';
import { ShopProvider } from '@/hooks/contexts/shop-context';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const shopData = await getShopData();
    
    return (
        <ShopProvider 
            shopCode={shopData?.shopCode ?? null} 
            shopName={shopData?.shopName ?? null}
        >
            {children}
        </ShopProvider>
    );
}