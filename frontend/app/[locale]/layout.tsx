import MyClerkProvider from "@/components/clerkProvider";
import Navbar from "@/components/Navbar";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { redirect } from "next/navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HyggeHub.io - Notify Your Crowd. Instantly",
  description:
    "Hyggehub helps bars, coffee shops, and local stores send personalized notifications to their followers — from birthday offers to new deals and happy hour alerts. Engage your customers instantly.",
  keywords: [
    // Primary keywords
    "bar notification system",
    "café customer engagement",
    "store promotion alerts",
    "birthday offer notifications",
    "follower marketing tool",
    "Hyggehub io",
    "hyggehub",
    "notify customers online",
    "customer loyalty SaaS",

    // Secondary keywords
    "marketing automation for cafés",
    "small business notification app",
    "local shop marketing tools",
    "digital loyalty notifications",
    "bar promotion manager",
  ],
  verification: {
    google: "R6aYZ5CCHZLgTGtEHN5X0-qHFgTRELLMhd_CsuTZcg4",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/HyggeHub-logo.svg" }],
    apple: [{ url: "/HyggeHub-logo.svg" }],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    redirect("/");
  }

  setRequestLocale(locale);

  return (
    <QueryProvider>
      <MyClerkProvider>
        <html className="dark scroll-smooth">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NextIntlClientProvider>
              <Navbar />
              {children}
              <Toaster position="top-center" richColors />
            </NextIntlClientProvider>
          </body>
        </html>
      </MyClerkProvider>
    </QueryProvider>
  );
}
