"use client";

import Link from "next/link";
import Image from "next/image";
import { danish, english } from "@/languages/lang";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import DynamicPricingPlans from "@/components/pricingList";
import { Marquee } from '@/components/ui/marquee';
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  Tickets,
  Mail,
  Bell,
  Gift,
  Key,
  Shield,
  Users,
  Calendar,
  SquareArrowOutUpRight,
  BadgeAlert,
  Phone,
} from "lucide-react";

// Language configuration
const lang = english;

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full">
      <Navbar />
      <Hero />
      <div className="w-full [&>section:nth-child(odd)]:bg-muted/50">
        <Features />
        <Demo />
        <Pricing />
        <Cta />
        <Faq />
        <Footer />
      </div>
    </section>
  );
}

function Navbar() {
  const navs = [
    { name: lang.navbar.features, href: "#features" },
    { name: lang.navbar.setup, href: "#demo" },
    { name: lang.navbar.pricing, href: "#pricing" },
    { name: lang.navbar.faq, href: "#faq" },
  ];

  return (
    <section className="flex fixed top-0 py-4 z-10">
      <div className="flex justify-between items-center space-x-4 rounded-full bg-muted-foreground/20 border-2 border-foreground backdrop-blur-sm w-[80vw]">
        <div className="px-4">
          <Link href="#hero">
            <Image src="/HyggeHub-logo.svg" alt="Logo" width={30} height={30} />
          </Link>
        </div>

        <div className="hidden lg:flex gap-4">
          {navs.map((nav) => (
            <Link key={nav.name} href={nav.href}>
              <Button variant="link" className="font-mono font-bold">
                {nav.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="bg-foreground rounded-full p-2">
          <Link href="/claim">
            <Button variant="link" className="font-mono font-bold text-background">{lang.navbar.claim}</Button>
          </Link>

          <span className="hidden lg:inline-flex">
            <SignedIn>
              <Link href="/shops">
                <Button variant="link" className="font-mono font-bold text-background">{lang.navbar.shops}</Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="link" className="font-mono font-bold text-background">{lang.navbar.signIn}</Button>
              </Link>
            </SignedOut>
          </span>
        </div>
      </div>
    </section>
  )
}

function Hero() {
  return (
    <section id="#hero" className="flex h-screen items-center justify-center flex-col text-center px-4">

      <div className="flex self-start justify-center items-center border rounded-full my-4">
        <span className="text-xs text-primary font-bold font-mono flex items-center justify-center bg-secondary/50 rounded-full px-2 gap-2">
          <BadgeAlert size={14} className="animate-pulse" />
          <h1>{lang.hero.updatesBadge}</h1>
        </span>
        <h1 className="text-xs font-mono font-bold px-2">{lang.hero.updateVersion}</h1>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-8xl font-mono font-bold">{lang.hero.title}<span className="text-primary">{lang.hero.titleExtension}</span></h1>
      <p className="mb-6 self-center md:self-end font-mono text-primary text-sm md:text-base">{lang.hero.tagline}</p>
      <p className="mt-2 text-sm md:text-lg text-muted-foreground max-w-2xl">
        {lang.hero.description}
      </p>
      <div className="flex flex-col sm:flex-row mt-6 gap-4">
        <Link href="/sign-in" className="w-full">
          <Button className="text-xs font-mono font-bold">
            <SquareArrowOutUpRight className="h-4 w-4" />
            {lang.hero.getStarted}
          </Button>
        </Link>
        <Link href="/claim" className="w-full">
          <Button variant="outline" className="text-xs font-mono font-bold">
            <Tickets className="h-4 w-4" />
            {lang.hero.claimCodes}
          </Button>
        </Link>
      </div>
      <div className="absolute w-full bottom-0">
        <Partners />
      </div>
    </section>
  )
}

function Partners() {
  function ShopsMap() {
    return (
      <div className="flex w-full items-center justify-between">
        {lang.partners.shops.map((shopName, id) => (
          <h1 key={id} className="font-mono text-primary font-bold text-2xl mx-18">{shopName}</h1>
        ))}
      </div>
    )
  }

  return (
    <section className="relative flex w-full items-center justify-center bg-secondary">
      <Marquee repeat={4} className="[--duration:60s] gap-16">
        <ShopsMap />
      </Marquee>
    </section>
  )
}

function Features() {
  const featureIcons = [Bell, Gift, Key, Shield, Users, Calendar];
  
  return (
    <section id="features" className="py-20 w-full scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">{lang.features.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {lang.features.list.map((feat, index) => {
            const IconComponent = featureIcons[index];
            return (
              <div key={index} className="bg-background p-6 rounded-md shadow-sm border">
                <IconComponent className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{feat.name}</h3>
                <p className="text-muted-foreground">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <section id="demo" className="py-20 w-full scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">{lang.demo.title}</h2>
        <div className="flex w-full justify-center items-center">
          <div className="flex w-full space-y-8 items-center justify-center">
            <Stepper defaultValue={2} orientation="vertical">
              {lang.demo.steps.map((stepData, index) => (
                <StepperItem
                  key={index + 1}
                  step={index + 1}
                  className="relative items-start not-last:flex-1"
                >
                  <StepperTrigger className="items-start rounded pb-12 last:pb-0">
                    <StepperIndicator />
                    <div className="mt-0.5 space-y-0.5 px-2 text-left">
                      <StepperTitle className="font-mono font-bold">{stepData.title}</StepperTitle>
                      <StepperDescription>
                        {stepData.description}
                      </StepperDescription>
                    </div>
                  </StepperTrigger>
                  {index < lang.demo.steps.length - 1 && (
                    <StepperSeparator className="absolute inset-y-0 top-[calc(1.5rem+0.125rem)] left-3 -order-1 m-0 -translate-x-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)]" />
                  )}
                </StepperItem>
              ))}
            </Stepper>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 w-full scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">{lang.pricing.title}</h2>
        <DynamicPricingPlans />
        <p className="text-center mt-8 text-muted-foreground">{lang.pricing.supportText}</p>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="py-20 w-full scroll-mt-30">
      <div className="container mx-auto px-4 flex flex-col">
        <h2 className="text-4xl font-bold font-mono mb-12">{lang.faq.title}</h2>
        <div className="flex w-full justify-center items-center">
          <Accordion type="single" collapsible className="w-full lg:w-[60%]">
            {lang.faq.questions.map((faqItem, idx) => (
              <AccordionItem key={idx} value={idx.toString()}>
                <AccordionTrigger className="text-primary font-mono font-bold">{faqItem.question}</AccordionTrigger>
                <AccordionContent>{faqItem.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

function Cta() {
  return (
    <section id="cta" className="flex flex-col py-20 justify-center w-full bg-gradient-to-tr from-secondary/50 to-background">
      <div className="mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h1 className="font-mono text-primary font-bold text-4xl md:text-6xl mb-4 max-w-6xl tracking-tighter">{lang.cta.title}</h1>
        <p className="text-lg font-semibold text-muted-foreground">{lang.cta.description}</p>
      </div>
      <div className="flex gap-2 items-center justify-center my-8">
        <Link href="/sign-in">
          <Button variant="secondary">
            {lang.cta.registerNow}
          </Button>
        </Link>
        <Link href="#pricing">
          <Button variant="outline">
            {lang.cta.comparePlans}
          </Button>
        </Link>
      </div>
    </section >
  )
}

function Footer() {
  return (
    <footer className="w-full">
      <div className="px-8 py-20 w-full relative overflow-hidden">
        <div className=" mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start md:px-8">
          <div>
            <div className="mr-0 md:mr-4 md:flex mb-4">
              <Link
                className="font-normal flex space-x-2 items-center text-sm mr-4 px-2 py-1 relative z-20"
                href="/"
              >
                <Image
                  alt="logo"
                  loading="lazy"
                  width={30}
                  height={30}
                  decoding="async"
                  data-nimg="1"
                  src="/HyggeHub-logo.svg"
                  className="rounded size-[2rem]"
                />
                <span className="font-bold text-xl text-foreground">{lang.hero.title}{lang.hero.titleExtension}</span>
              </Link>
            </div>
            <p className="mt-2 ml-2">{lang.footer.copyright} {new Date().getFullYear()}. {lang.footer.allRightsReserved}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
            <div className="flex justify-center space-y-4 flex-col w-full">
              <p className="font-bold font-mono text-primary">{lang.footer.pages.title}</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.pages.home}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/claim">{lang.footer.pages.claim}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/updates">{lang.footer.pages.updates}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/sign-in">{lang.footer.pages.signIn}</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <p className="font-bold font-mono text-primary">{lang.footer.contacts.title}</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.contacts.facebook}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.contacts.instagram}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.contacts.twitter}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.contacts.linkedin}</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <p className="font-bold font-mono text-primary">{lang.footer.legal.title}</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.legal.privacyPolicy}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.legal.termsOfService}</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">{lang.footer.legal.cookiePolicy}</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <h1 className="font-bold font-mono text-primary">{lang.footer.contacts.title}</h1>
              <ul className="list-none space-y-4 text-foreground">
                <li className="flex gap-2 items-center list-none hover:underline">
                  <Mail size={16} />
                  <p>{lang.footer.contacts.email}</p>
                </li>
                <li className="flex gap-2 items-center list-none hover:underline">
                  <Phone size={16} />
                  <p>{lang.footer.contacts.phone}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}