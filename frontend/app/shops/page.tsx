"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Shapes, CirclePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { CreateOrganization } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { getUserOrgs } from '@/api/api-users';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';

// Define interface for organization data
interface Organization {
    id: string;
    name: string;
    imageUrl?: string;
    slug?: string;
    metadata?: {
        description?: string;
    };
}

export default function Page() {
    const { user } = useUser();
    const [loadingShop, setLoadingShop] = useState<string | null>(null);

    // Fetch user organizations using Tanstack Query
    const { data, isLoading, error } = useQuery({
        queryKey: ['user-organizations', user?.id],
        queryFn: async () => {
            console.log('API call initiated - Attempting to fetch user orgs');
            if (!user?.id) {
                throw new Error("User not authenticated");
            }
            try {
                const result = await getUserOrgs(user.id);
                return result;
            } catch (err) {
                console.error('API connection failed:', err);
                throw err;
            }
        },
        enabled: !!user?.id, // Only run the query when user ID is available
    });

    const organizations = data?.organizations || [];

    return (
        <section>
            <div className="fixed bg-muted-foreground/10 rounded-full backdrop-blur-xs items-center justify-between py-2 px-4 m-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="link" className="flex items-center gap-2">
                            <CirclePlus className="h-4 w-4" />
                            Add Coffee Shop
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent asChild>
                        <div className='min-w-[32vw] justify-center items-center'>
                            <AlertDialogHeader>
                                <AlertDialogTitle />
                                <AlertDialogDescription asChild>
                                    <span>
                                        {/* clerk component */}
                                        <CreateOrganization hideSlug />
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='w-full'>Cancel</AlertDialogCancel>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <div className="flex flex-wrap items-center justify-center min-h-screen max-w-screen gap-10 p-10">
                {isLoading ? (
                    <div className="text-center"><Spinner className="size-8" /></div>
                ) : error ? (
                    <div className="text-center text-red-500">Error loading your coffee shops</div>
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
                                    {org.metadata?.description || `Manage ${org.name}'s shop settings and menu`}
                                </p>
                                {/* <div className="mt-5 w-full aspect-video bg-muted rounded-xl" /> */}
                            </CardContent>
                            <CardFooter className="flex mt-6 w-full">
                                <Link href={`/shops/${org.slug || org.id}`} onClick={() => setLoadingShop(org.id)} className='w-full'>
                                    <Button disabled={loadingShop === org.id} className="w-full">
                                        <span className="flex items-center justify-between font-mono text-xs gap-2">
                                            {loadingShop === org.id ? (
                                                <>Loading <Spinner /></>
                                            ) : (
                                                <>Open <ArrowRight /></>
                                            )}
                                        </span>
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </section>
    )
}
