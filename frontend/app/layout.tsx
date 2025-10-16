import type { Metadata } from 'next'
import MyClerkProvider from '@/components/clerkProvider'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import QueryProvider from "@/components/QueryProvider"
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Hyggehub.io - Notify Your Crowd. Instantly',
  description: 'Hyggehub helps bars, coffee shops, and local stores send personalized notifications to their followers — from birthday offers to new deals and happy hour alerts. Engage your customers instantly.',
  keywords: [
    // Primary keywords
    'bar notification system',
    'café customer engagement',
    'store promotion alerts',
    'birthday offer notifications',
    'follower marketing tool',
    'Vynoti app',
    'notify customers online',
    'customer loyalty SaaS',
    
    // Secondary keywords
    'marketing automation for cafés',
    'small business notification app',
    'local shop marketing tools',
    'digital loyalty notifications',
    'bar promotion manager'
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryProvider>
      <MyClerkProvider>
        <html lang="en" className="dark scroll-smooth">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Navbar />
            {children}
            <Toaster position="top-center" richColors />
          </body>
        </html>
      </MyClerkProvider>
    </QueryProvider>
  )
}