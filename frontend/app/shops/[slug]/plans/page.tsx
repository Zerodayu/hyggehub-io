"use client"

import { useRouter, useParams } from 'next/navigation'
import { PricingTable } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ChevronRight, Store, Wallet } from 'lucide-react'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function Page() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    return (
        <section className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">
            <div className="flex w-full items-center justify-start">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Button
                                    variant="link"
                                    className='font-mono text-muted-foreground'
                                    onClick={() => router.push(`/shops/${slug}`)}
                                >
                                    <Store />
                                    Shop
                                </Button>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-mono'>
                                <span className='flex items-center gap-2 text-primary'>
                                    <Wallet size={16} />
                                    Plans
                                </span>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex w-full h-0.5 rounded-full bg-accent shadow-sm" />
            <div className='flex justify-center items-center w-[80vw]'>
                <PricingTable
                    for='organization'
                    ctaPosition="bottom"
                    newSubscriptionRedirectUrl={`/shops/${slug}`}
                />
            </div>
        </section>
    )
}
