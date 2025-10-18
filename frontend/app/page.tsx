import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
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

export default function Home() {
  const navs = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "About", href: "#about" },
  ];

  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full">
      <section className="flex fixed top-0 py-4 z-10">
        <div className="flex justify-between items-center space-x-4 rounded-full bg-muted-foreground/20 border-2 border-foreground backdrop-blur-sm w-[80vw]">
          <div className="px-4">
            <Link href="#hero">
              <Image src="/HyggeHub-logo.svg" alt="Logo" width={30} height={30} />
            </Link>
          </div>

          <div className="hidden lg:flex">
            {navs.map((nav) => (
              <Link key={nav.name} href={nav.href}>
                <Button variant="link" className="font-mono font-bold">
                  {nav.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="bg-foreground rounded-full p-2">
            <Link href="/open/claim">
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

      <section id="#hero" className="flex h-screen items-center justify-center flex-col text-center px-4">

        <div className="flex self-start justify-center items-center border rounded-full my-4">
          <span className="text-xs text-primary font-mono flex items-center justify-center bg-secondary/50 rounded-full px-2 gap-2">
            <BadgeAlert size={14} className="animate-pulse" />
            <h1>Updates!</h1>
          </span>
          <h1 className="text-xs font-mono font-bold px-2">asodasdiasuh</h1>
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
          <Link href="#features" className="w-full">
            <Button variant="outline" className="text-xs font-mono font-bold">
              <BadgeAlert className="h-4 w-4" />
              Updates
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 w-full bg-muted/50 scroll-mt-30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-mono mb-12">— Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Bell className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Instant Notifications</h3>
              <p className="text-muted-foreground">Keep your followers informed with real-time alerts about special offers, events, and promotions.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Gift className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Birthday Offers</h3>
              <p className="text-muted-foreground">Automatically send personalized birthday messages and special offers to enhance customer loyalty.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Key className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Shop Dashboard</h3>
              <p className="text-muted-foreground">Manage your shop profile, track follower activity, and oversee all your notification campaigns in one place.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">End-to-end encryption and compliance with data privacy regulations for peace of mind.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Follower Management</h3>
              <p className="text-muted-foreground">Organize customer information and preferences for targeted, personalized messaging.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Calendar className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Scheduled Campaigns</h3>
              <p className="text-muted-foreground">Plan and automate promotional messages or happy hour alerts to be sent at optimal times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 w-full scroll-mt-30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold font-mono mb-12">— Pricing Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-background p-8 rounded-lg shadow-sm border border-muted">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-4xl font-bold mb-4">$389<span className="text-muted-foreground text-base font-normal">/month</span></p>
              <p className="text-muted-foreground mb-6">Perfect for small local shops</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 500 notifications/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Basic shop dashboard
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Standard notification templates
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="bg-primary text-primary-foreground p-8 rounded-lg shadow-lg scale-105 border border-primary">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-4xl font-bold mb-4">$549<span className="text-primary-foreground/80 text-base font-normal">/month</span></p>
              <p className="text-primary-foreground/80 mb-6">For growing establishments</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 2,000 notifications/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Enhanced shop management
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom notification templates
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Birthday automation
                </li>
              </ul>
              <Button variant="secondary" className="w-full">Get Started</Button>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm border border-muted">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-4xl font-bold mb-4">$700<span className="text-muted-foreground text-base font-normal">/month</span></p>
              <p className="text-muted-foreground mb-6">For multiple locations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 10,000 notifications/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Multi-shop management
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom integrations
                </li>
              </ul>
              <Button className="w-full">Contact Sales</Button>
            </div>
          </div>
          <p className="text-center mt-8 text-muted-foreground">All plans include free setup and 24/7 customer support.</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 w-full bg-muted/50">
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

      {/* Footer */}
      <footer className="w-full py-12 bg-background border-t">

        <div className=" px-8 py-20 bg-background w-full relative overflow-hidden">
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
                    <Link className="transition-colors hover:text-text-neutral-800" href="/open/claim">Claim</Link>
                  </li>
                  <li className="list-none hover:underline">
                    <Link className="transition-colors hover:text-text-neutral-800" href="#">Plans</Link>
                  </li>
                  <li className="list-none hover:underline">
                    <Link className="transition-colors hover:text-text-neutral-800" href="#">Updates</Link>
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
    </section>
  );
}
