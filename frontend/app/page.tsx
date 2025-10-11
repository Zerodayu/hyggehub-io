import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target,
  Coffee,
  MessageSquare,
  TrendingUp,
  Shield,
  CreditCard,
  Users,
  Clock,
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

          <div>
            <Button variant="link" className="font-mono font-bold" >Features</Button>
            <Button variant="link" className="font-mono font-bold" >Pricing</Button>
            <Button variant="link" className="font-mono font-bold" >About</Button>
          </div>

          <div className="bg-foreground rounded-full p-2">
            <Link href="/sign-in">
              <Button variant="link" className="font-mono font-bold text-background">Sign-in</Button>
            </Link>

            <Link href="/open/claim">
              <Button variant="link" className="font-mono font-bold text-background">Claim</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="flex h-screen items-center justify-center flex-col text-center px-4">
        <h1 className="text-8xl font-semibold">Coffee Shop SMS</h1>
        <p className="mt-6 text-xl text-muted-foreground">Streamline your coffee shop operations with SMS notifications</p>
        <div className="mt-8">
          <Link href="/sign-up">
            <Button size="lg" className="mr-4">Get Started</Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">Learn More</Button>
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <section id="features" className="py-20 w-full bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Coffee className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Order Notifications</h3>
              <p className="text-muted-foreground">Instantly notify customers when their coffee order is ready with automated SMS alerts.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <MessageSquare className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Two-way Messaging</h3>
              <p className="text-muted-foreground">Enable customers to respond or ask questions directly via text messages.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <TrendingUp className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Track customer engagement and measure the performance of your SMS campaigns.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Shield className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
              <p className="text-muted-foreground">End-to-end encryption and compliance with messaging regulations for peace of mind.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Customer Database</h3>
              <p className="text-muted-foreground">Organize customer information and preferences for personalized messaging.</p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Clock className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Scheduled Campaigns</h3>
              <p className="text-muted-foreground">Set up promotional messages or special offers to be sent at specific times.</p>
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
              <p className="text-4xl font-bold mb-4">$29<span className="text-muted-foreground text-base font-normal">/month</span></p>
              <p className="text-muted-foreground mb-6">Perfect for small coffee shops</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 500 SMS/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Basic analytics
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Order notifications
                </li>
              </ul>
              <Button className="w-full">Get Started</Button>
            </div>
            <div className="bg-primary text-primary-foreground p-8 rounded-lg shadow-lg scale-105 border border-primary">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-4xl font-bold mb-4">$79<span className="text-primary-foreground/80 text-base font-normal">/month</span></p>
              <p className="text-primary-foreground/80 mb-6">For growing coffee shops</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 2,000 SMS/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Advanced analytics
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Two-way messaging
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Customer database
                </li>
              </ul>
              <Button variant="secondary" className="w-full">Get Started</Button>
            </div>
            <div className="bg-background p-8 rounded-lg shadow-sm border border-muted">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-4xl font-bold mb-4">$199<span className="text-muted-foreground text-base font-normal">/month</span></p>
              <p className="text-muted-foreground mb-6">For multiple locations</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 10,000 SMS/month
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Enterprise analytics
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
                Coffee Shop SMS was founded in 2023 by a team of coffee enthusiasts and tech experts who noticed a gap in the market for effective customer communication in coffee shops.
              </p>
              <p className="mb-4 text-muted-foreground">
                Our mission is to help coffee shops enhance customer experience, reduce wait times, and build stronger relationships with their community through effective SMS communication.
              </p>
              <p className="text-muted-foreground">
                Today, we serve hundreds of coffee shops across the country, from small indie cafes to major chains, all using our platform to keep their customers informed and engaged.
              </p>
            </div>
            <div className="bg-muted p-8 rounded-lg">
              <Info className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span>Built specifically for coffee shops</span>
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
          <p className="text-muted-foreground">© {new Date().getFullYear()} Coffee Shop SMS. All rights reserved.</p>
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
