"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Shapes, CirclePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import Image from 'next/image';
import Link from 'next/link';
import { useOrganizationList } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define interface for organization data
interface Organization {
    id: string;
    name: string;
    imageUrl?: string;
    slug?: string | null;
    metadata?: {
        description?: string;
    };
}

export default function Page() {
    const [loadingShop, setLoadingShop] = useState<string | null>(null);
    const router = useRouter();

    // Use Clerk's useOrganizationList hook instead of the custom API call
    const { isLoaded, userMemberships, setActive } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    // Transform the organizations data to match our expected format
    const organizations = userMemberships?.data?.map(mem => ({
        id: mem.organization.id,
        name: mem.organization.name,
        imageUrl: mem.organization.imageUrl,
        slug: mem.organization.slug,
    })) || [];

    // Handle opening a shop - set active org and then navigate
    const handleOpenShop = async (org: Organization) => {
        if (!setActive) {
            console.error("setActive function is not available");
            return;
        }

        try {
            setLoadingShop(org.id);
            await setActive({ organization: org.id });
            router.push(`/shops/${org.slug || org.id}`);
        } catch (error) {
            console.error("Error setting active organization:", error);
            setLoadingShop(null);
        }
    };

    return (
        <section>
            <div className="fixed bg-muted-foreground/10 rounded-full backdrop-blur-xs items-center justify-between py-2 px-4 m-6">
                <Link href="/shops/create-shop">
                    <Button variant="link" className="flex items-center gap-2">
                        <CirclePlus className="h-4 w-4" />
                        Add Coffee Shop
                    </Button>
                </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center min-h-screen max-w-screen gap-10 p-10">
                {!isLoaded ? (
                    <div className="text-center"><Spinner className="size-8" /></div>
                ) : organizations.length === 0 ? (
                    <div className="text-center">
                        <p className="mb-4">You don&apos;t have any coffee shops yet</p>
                        <p className="mb-4">Click the &quot;Add Coffee Shop&quot; button above to create one</p>
                    </div>
                ) : (
                    organizations.map((org: Organization) => (
                        <Card key={org.id} className="max-w-xs shadow-none gap-0 pt-0 min-w-[25vw]">
                            <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-bold font-mono">
                                <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full overflow-hidden">
                                    {org.imageUrl ? (
                                        <Image
                                            src={org.imageUrl}
                                            alt={org.name}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    ) : (
                                        <Shapes className="h-5 w-5" />
                                    )}
                                </div>
                                {org.name}
                            </CardHeader>
                            <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
                                <p>
                                    Manage {org.name}'s shop settings and menu
                                </p>
                            </CardContent>
                            <CardFooter className="flex mt-6 w-full">
                                <Button 
                                    disabled={loadingShop === org.id || !setActive} 
                                    className="w-full"
                                    onClick={() => handleOpenShop(org)}
                                >
                                    <span className="flex items-center justify-between font-mono text-xs gap-2">
                                        {loadingShop === org.id ? (
                                            <>Loading <Spinner /></>
                                        ) : (
                                            <>Open <ArrowRight /></>
                                        )}
                                    </span>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            {/* Load more organizations button */}
            {userMemberships?.hasNextPage && (
                <div className="text-center pb-8">
                    <Button
                        variant="outline"
                        onClick={() => userMemberships?.fetchNext?.()}
                        disabled={!userMemberships?.hasNextPage}
                    >
                        Load more shops
                    </Button>
                </div>
            )}
        </section>
    )
}
