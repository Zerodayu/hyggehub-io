import Link from 'next/link'
import { PricingTable } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Store, Wallet } from 'lucide-react'

export default function Page() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen px-4 gap-6">
            <div className="flex w-full items-center justify-start">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/shops">
                                    <Button variant="link" className='font-mono text-muted-foreground'>
                                        <Store />
                                        Shop
                                    </Button>
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-mono'>
                                <span className='flex items-center gap-2'>
                                    <Wallet size={16}/>
                                    Plans
                                </span>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex w-full h-0.5 rounded bg-accent shadow-sm" />
            <div className='flex justify-center items-center w-[80vw]'>
                <PricingTable forOrganizations ctaPosition="bottom" />
            </div>
        </section>
    )
}
