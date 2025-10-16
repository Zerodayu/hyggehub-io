import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Target,
  Bell,
  Gift,
  Key,
  Shield,
  Users,
  Calendar,
  Info
} from "lucide-react";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen w-full">
      <section className="flex fixed top-0 py-4 z-10">
        <div className="flex justify-between items-center space-x-4 rounded-full bg-muted-foreground/20 border-2 border-foreground backdrop-blur-sm w-[80vw]">
          <div className="px-4">
            <Target className="" size={30} />
          </div>

          <div className="hidden lg:flex">
            <Button variant="link" className="font-mono font-bold" >Features</Button>
            <Button variant="link" className="font-mono font-bold" >Pricing</Button>
            <Button variant="link" className="font-mono font-bold" >About</Button>
          </div>

          <div className="bg-foreground rounded-full p-2">
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

            <Link href="/open/claim">
              <Button variant="link" className="font-mono font-bold text-background">Claim</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex h-screen items-center justify-center flex-col text-center px-4">
        <h1 className="text-8xl font-semibold">Hyggehub.io</h1>
        <p className="mt-6 text-xl text-muted-foreground">Notify Your Crowd. Instantly.</p>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Engage customers with personalized notifications — from birthday offers to new deals and happy hour alerts.
        </p>
        <div className="flex mt-8 gap-6">
          <Link href="/sign-in">
            <Button className="font-mono font-bold">Get Started</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" className="font-mono font-bold">Learn More</Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 w-full bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
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
      <section id="pricing" className="py-20 w-full">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
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
          <h2 className="text-4xl font-bold text-center mb-12">About Us</h2>
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
      <footer className="py-12 bg-background border-t">
        <div className="container mx-auto px-4 text-center">
          <Target className="mx-auto mb-4" size={30} />
          <p className="text-muted-foreground">© {new Date().getFullYear()} hyggehub.io. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
