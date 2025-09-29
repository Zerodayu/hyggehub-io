"use client"

import { useRouter } from 'next/navigation'
import { OrganizationProfile } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Store, Settings2 } from 'lucide-react'


export default function Page() {
    const router = useRouter();

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
                                    onClick={() => router.back()}
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
                                <span className='flex items-center gap-2'>
                                    <Settings2 size={16} />
                                    Shop Profile
                                </span>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex w-full h-0.5 rounded bg-accent shadow-sm" />
            <div className='flex justify-center items-center w-full'>
                <OrganizationProfile routing='hash' />
            </div>
        </section>
    )
}
