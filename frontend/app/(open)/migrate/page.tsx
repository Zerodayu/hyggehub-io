"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TableUpload from "@/components/table-upload"
import { Button } from '@/components/ui/button'
import { useRouter, useParams } from 'next/navigation'
import { ChevronRight, Store, Ungroup } from 'lucide-react'
import MigrateSteps from "@/components/migrate-steps"

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  return (
    <section className="flex flex-col items-center justify-start min-h-screen p-6 gap-6">

      {/* breadcrumb start */}
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
                  <Ungroup size={16} />
                  Migrate
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex w-full h-0.5 rounded-full bg-accent shadow-sm" />
      {/* breadcrumb end */}

      <div className="flex w-content sm:min-w-lg flex-col items-center justify-start gap-6">
        <MigrateSteps />
        
      </div>

    </section>
  )
}
