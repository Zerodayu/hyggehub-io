"use client";

import { createContext, useContext, ReactNode } from 'react';

interface ShopContextType {
    shopCode: string | null;
    shopName: string | null;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ 
    children, 
    shopCode, 
    shopName 
}: { 
    children: ReactNode;
    shopCode: string | null;
    shopName: string | null;
}) {
    return (
        <ShopContext.Provider value={{ shopCode, shopName }}>
            {children}
        </ShopContext.Provider>
    );
}

export function useShop() {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
}