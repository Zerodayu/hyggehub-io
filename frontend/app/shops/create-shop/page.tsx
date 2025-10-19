"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { CreateOrganization } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ChevronRight, LayoutDashboard, House } from 'lucide-react'
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

  return (
    <section className='w-full min-h-screen p-6'>
      <div className="flex w-full items-center justify-start py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button
                  variant="link"
                  className='font-mono text-muted-foreground'
                  onClick={() => router.push(`/shops/`)}
                >
                  <House />
                  Shops
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className='font-mono'>
                <span className='flex items-center gap-2 text-primary'>
                  <LayoutDashboard size={16} />
                  Plans
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex w-full h-0.5 rounded-full bg-accent shadow-sm" />
      <div className='flex flex-col justify-center items-center'>
        <div className='flex w-full items-center p-4'>
          <h1 className='text-3xl font-mono font-bold'>Add Shop</h1>
        </div>
        <CreateOrganization
          hideSlug
          afterCreateOrganizationUrl="/shops"
        />
      </div>
    </section>
  )
}
