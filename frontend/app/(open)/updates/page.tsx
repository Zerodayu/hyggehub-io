

import React from 'react'
import Link from 'next/link'
import { updates } from './updates'
import { Button } from '@/components/ui/button'
import { ChevronRight, LayoutDashboard, ClipboardClock } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Page() {

  return (
    <section className='w-full min-h-screen p-6'>
      <div className="flex w-full items-center justify-start py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">
                  <Button
                    variant="link"
                    className='font-mono text-muted-foreground'
                  >
                    <LayoutDashboard />
                    Home
                  </Button>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className='font-mono'>
                <span className='flex items-center gap-2 text-primary'>
                  <ClipboardClock size={16} />
                  Updates
                </span>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex w-full h-0.5 rounded-full bg-accent shadow-sm" />

      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-center mt-10 mb-8'>Changelog</h1>

        <div className='space-y-8'>
          {updates.map((update, index) => (
            <div key={index} className='p-6'>
              <div className='flex flex-col mb-4'>
                <span className='text-xs font-mono text-primary'>v{update.version}</span>
                <h2 className='text-2xl font-semibold'>{update.title}</h2>
                <p className='text-muted-foreground text-sm font-mono'>{update.date}</p>
              </div>
              <p className='mb-6'>{update.description}</p>

              <div className='space-y-4'>
                {update.changes.added.length > 0 && (
                  <div>
                    <h3 className='text-lg font-mono text-green-600'>Added</h3>
                    <ul className='list-disc pl-5'>
                      {update.changes.added.map((item, i) => (
                        <li key={i} className='text-sm text-foreground'>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.changes.changed.length > 0 && (
                  <div>
                    <h3 className='text-lg font-mono text-amber-600'>Changed</h3>
                    <ul className='list-disc pl-5'>
                      {update.changes.changed.map((item, i) => (
                        <li key={i} className='text-sm text-foreground'>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.changes.fixed.length > 0 && (
                  <div>
                    <h3 className='text-lg font-mono text-destructive'>Fixed</h3>
                    <ul className='list-disc pl-5'>
                      {update.changes.fixed.map((item, i) => (
                        <li key={i} className='text-sm text-foreground'>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex w-full h-0.5 rounded-full bg-accent shadow-sm my-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
