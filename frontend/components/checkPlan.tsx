import React from 'react'
import { useRouter } from 'next/navigation';
import { useAuth } from "@clerk/nextjs";
import { PricingTable } from "@clerk/nextjs";
import { Button } from '@/components/ui/button'
import { ChevronRight, House, Wallet } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function CheckPlanHandle({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  // Check if the user is on a free plan
  const freeUser = auth.isLoaded ? auth.has({ plan: 'free_user' }) : true;

  return (
    <>
      {freeUser && <UpgradePlan />}
      {!freeUser && children}
    </>
  )
}

export function UpgradePlan() {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex flex-col items-center p-8">
      <div className="flex w-full items-center justify-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button
                  variant="link"
                  className='font-mono text-muted-foreground'
                  onClick={() => router.push(`/`)}
                >
                  <House />
                  Main
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
                  Upgrade
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex w-full h-0.5 rounded bg-accent shadow-sm" />
      <h1 className='text-3xl font-bold my-8'>Upgrade your plan</h1>
      <p className='mb-4 text-center'>To access this feature, please upgrade your plan. Choose the plan that best fits your needs and enjoy additional benefits and features.</p>
      <p className='mb-8 text-center'>Click on a plan below to proceed with the upgrade process.</p>
      <PricingTable
        forOrganizations
      />
    </div>
  )
}