"use client";

import Link from "next/link";
import Image from "next/image";
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
  Mail,
  Bell,
  Gift,
  Key,
  Shield,
  Users,
  Calendar,
  Info,
  SquareArrowOutUpRight,
  BadgeAlert,
  Phone,
} from "lucide-react";

export default function Page() {


  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full">
      <Navbar />
      <Hero />
      <Partners />
      <Features />
      <Demo />
      <Pricing />
      <Faq />
      <About />
      <Footer />
    </section>
  );
}

function Navbar() {
  const navs = [
    { name: "Features", href: "#features" },
    { name: "Setup", href: "#demo" },
    { name: "Pricing", href: "#pricing" },
    { name: "Faq", href: "#faq" },
    { name: "About", href: "#about" },
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
            <Button variant="link" className="font-mono font-bold text-background">Claim</Button>
          </Link>

          <span className="hidden lg:inline-flex">
            <SignedIn>
              <Link href="/shops">
                <Button variant="link" className="font-mono font-bold text-background">Shops</Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in">
                <Button variant="link" className="font-mono font-bold text-background">Sign-in</Button>
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
          <h1>Updates!</h1>
        </span>
        <h1 className="text-xs font-mono font-bold px-2">v0.1 Released!</h1>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-8xl font-mono font-bold">HyggeHub<span className="text-primary">.io</span></h1>
      <p className="mb-6 self-center md:self-end font-mono text-primary text-sm md:text-base">Notify Your Crowd. Instantly.</p>
      <p className="mt-2 text-sm md:text-lg text-muted-foreground max-w-2xl">
        Engage customers with personalized notifications — from birthday offers to new deals and happy hour alerts.
      </p>
      <div className="flex flex-col sm:flex-row mt-6 gap-4">
        <Link href="/sign-in" className="w-full">
          <Button className="text-xs font-mono font-bold">
            <SquareArrowOutUpRight className="h-4 w-4" />
            Get Started
          </Button>
        </Link>
        <Link href="/updates" className="w-full">
          <Button variant="outline" className="text-xs font-mono font-bold">
            <BadgeAlert className="h-4 w-4" />
            Updates
          </Button>
        </Link>
      </div>
    </section>
  )
}

function Partners() {
  const shops = [
    { name: "Café Vendi" },
    { name: "Café Pronto" },
    { name: "Bagericaféet" },
    { name: "Café i København" },
    { name: "Kaffebar i Malmö" },
    { name: "Café i Skåne" }
  ]

  function ShopsMap() {
    return (
      <div className="flex w-full items-center justify-between">
        {shops.map((shop, id) => (
          <h1 key={id} className="font-mono text-primary font-bold text-2xl mx-18">{shop.name}</h1>
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
  const features = [
    {
      name: "Instant Notifications",
      icon: Bell,
      description: "Keep your followers informed with real-time alerts about special offers, events, and promotions."
    },
    {
      name: "Birthday Offers",
      icon: Gift,
      description: "Automatically send personalized birthday messages and special offers to enhance customer loyalty."
    },
    {
      name: "Shop Dashboard",
      icon: Key,
      description: "Manage your shop profile, track follower activity, and oversee all your notification campaigns in one place."
    },
    {
      name: "Secure Platform",
      icon: Shield,
      description: "End-to-end encryption and compliance with data privacy regulations for peace of mind."
    },
    {
      name: "Follower Management",
      icon: Users,
      description: "Organize customer information and preferences for targeted, personalized messaging."
    },
    {
      name: "Scheduled Campaigns",
      icon: Calendar,
      description: "Plan and automate promotional messages or happy hour alerts to be sent at optimal times."
    },
  ]
  return (
    <section id="features" className="py-20 w-full bg-muted/50 scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">— Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <div key={index} className="bg-background p-6 rounded-md shadow-sm border">
              <feat.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">{feat.name}</h3>
              <p className="text-muted-foreground">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  const steps = [
    {
      step: 1,
      title: "Step One",
      description: "Create your shop profile",
    },
    {
      step: 2,
      title: "Step Two",
      description: "Setup your notification preferences",
    },
    {
      step: 3,
      title: "Step Two",
      description: "Let Customers follow your shop through QR code",
    },
    {
      step: 4,
      title: "Step Three",
      description: "Start sending notifications to your followers",
    },
  ]

  return (
    <section id="demo" className="py-20 w-full h-[80vh] scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">— How It Works</h2>
        <div className="flex w-full justify-center items-center">
          <div className="w-full space-y-8 text-center py-50">
            <Stepper defaultValue={2}>
              {steps.map(({ step, title, description }) => (
                <StepperItem
                  key={step}
                  step={step}
                  className="relative flex-1 flex-col!"
                >
                  <StepperTrigger className="flex-col gap-3 rounded">
                    <StepperIndicator />
                    <div className="space-y-0.5 px-2">
                      <StepperTitle>{title}</StepperTitle>
                      <StepperDescription className="max-sm:hidden">
                        {description}
                      </StepperDescription>
                    </div>
                  </StepperTrigger>
                  {step < steps.length && (
                    <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
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
    <section id="pricing" className="py-20 w-full bg-muted/50 scroll-mt-30">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">— Pricing Plans</h2>
        <DynamicPricingPlans />
        <p className="text-center mt-8 text-muted-foreground">All plans include free setup and 24/7 customer support.</p>
      </div>
    </section>
  )
}

function Faq() {
  const faqs = [
    {
      question: "What is ReUI?",
      answer: "ReUI provides ready-to-use CRUD examples for developers."
    },
    {
      question: "Who benefits from ReUI?",
      answer: "Developers looking to save time with pre-built CRUD solutions."
    },
    {
      question: "Why choose ReUI?",
      answer: "ReUI simplifies development with plug-and-play CRUDs."
    }
  ]

  return (
    <section id="faq" className="py-20 w-full scroll-mt-30">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <Accordion type="single" collapsible className="w-full lg:w-[75%]">
          {faqs.map((faqs, idx) => (
            <AccordionItem key={idx} value={idx.toString()}>
              <AccordionTrigger className="text-primary font-mono font-bold">{faqs.question}</AccordionTrigger>
              <AccordionContent>{faqs.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-20 bg-muted/50 w-full">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold font-mono mb-12">— About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
          <div>
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="mb-4 text-muted-foreground">
              hyggehub.io was founded in 2023 by a team of local business enthusiasts and tech experts who noticed a gap in the market for effective customer communication in bars, cafés, and local shops.
            </p>
            <p className="mb-4 text-muted-foreground">
              Our mission is to help local businesses enhance customer experience, increase loyalty, and build stronger relationships with their community through effective, personalized notifications.
            </p>
            <p className="text-muted-foreground">
              Today, we serve hundreds of establishments across the country, from small indie cafés to popular bars and local shops, all using our platform to keep their followers informed and engaged.
            </p>
          </div>
          <div className="bg-muted p-8 rounded-lg">
            <Info className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-4">Why Choose hyggehub.io?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Built specifically for local businesses</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>99.9% uptime reliability</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Dedicated customer support team</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Regular feature updates based on client feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
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
                <span className="font-bold text-xl text-foreground">HyggeHub.io</span>
              </Link>
            </div>
            <p className="mt-2 ml-2">© copyright HyggeHub.io {new Date().getFullYear()}. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start mt-10 sm:mt-0 md:mt-0">
            <div className="flex justify-center space-y-4 flex-col w-full">
              <p className="font-bold font-mono text-primary">— Pages</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Home</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/claim">Claim</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/updates">Updates</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="/sign-in">Sign-in</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <p className="font-bold font-mono text-primary">— Contacts</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Facebook</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Instagram</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Twitter</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">LinkedIn</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <p className="font-bold font-mono text-primary">— Legal</p>
              <ul className="list-none space-y-4 text-foreground">
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Privacy Policy</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Terms of Service</Link>
                </li>
                <li className="list-none hover:underline">
                  <Link className="transition-colors hover:text-text-neutral-800" href="#">Cookie Policy</Link>
                </li>
              </ul>
            </div>
            <div className="flex justify-center space-y-4 flex-col">
              <h1 className="font-bold font-mono text-primary">— Contacts</h1>
              <ul className="list-none space-y-4 text-foreground">
                <li className="flex gap-2 items-center list-none hover:underline">
                  <Mail size={16} />
                  <p>support@hyggehub.io</p>
                </li>
                <li className="flex gap-2 items-center list-none hover:underline">
                  <Phone size={16} />
                  <p>+45 42349115</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}