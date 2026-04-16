"use client";

import { usePlans } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activeLang } from "@/languages/lang";

type Currency = "DKK" | "USD";

const lang = activeLang;

const dkkTiers = [
  {
    name: "Starter",
    price: "499 kr",
    description: "Til én butik.",
    features: ["Butikker", "Beskedskabeloner", "Notifikationer", "QR-kode"],
  },
  {
    name: "Pro",
    price: "999 kr",
    description: "Til travle steder.",
    features: ["Butikker", "Beskedskabeloner", "Notifikationer", "QR-kode"],
  },
  {
    name: "Max",
    price: "2.499 kr",
    description: "Til flere lokationer.",
    features: ["Butikker", "Beskedskabeloner", "Notifikationer", "QR-kode"],
  },
] as const;

export default function DynamicPricingPlans() {
  const {
    data,
    isLoading,
    hasNextPage,
    fetchNext,
    hasPreviousPage,
    fetchPrevious,
  } = usePlans({
    for: "organization",
    pageSize: 3,
  });

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("DKK");

  if (selectedCurrency === "USD" && isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="DKK"
      className="w-full"
      onValueChange={(value) => setSelectedCurrency(value as Currency)}
    >
      {/* Currency selector */}
      <div className="flex justify-center mb-8">
        <TabsList className="font-mono font-bold">
          <TabsTrigger value="DKK">DKK</TabsTrigger>
          <TabsTrigger value="USD">USD</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="DKK">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {dkkTiers.map((tier, index) => {
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col flex-wrap px-4 p-6 ${
                  index === 1
                    ? "bg-primary text-primary-foreground rounded-lg shadow-lg scale-105 border border-primary"
                    : "bg-background rounded-lg shadow-sm border border-muted"
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold outline outline-primary">
                      {lang.pricing.mostPopular}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <span className="flex flex-wrap items-end my-4">
                  <p className="text-3xl font-bold">{tier.price}</p>
                  <p
                    className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}
                  >
                    {lang.pricing.perMonth}
                  </p>
                </span>
                <p
                  className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} my-6`}
                >
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg
                        className={`h-5 w-5 ${index !== 1 ? "text-green-500" : ""} mr-2`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={index === 1 ? "secondary" : "default"}
                  className="w-full self-end"
                >
                  {lang.pricing.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="USD">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {data.map((plan, index) => {
            const displayPrice = `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col flex-wrap px-4 p-6 ${
                  index === 1
                    ? "bg-primary text-primary-foreground rounded-lg shadow-lg scale-105 border border-primary"
                    : "bg-background rounded-lg shadow-sm border border-muted"
                }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold outline outline-primary">
                      {lang.pricing.mostPopular}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <span className="flex flex-wrap items-end my-4">
                  <p className="text-3xl font-bold">{displayPrice}</p>
                  <p
                    className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}
                  >
                    {lang.pricing.perMonth}
                  </p>
                </span>
                <p
                  className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} my-6`}
                >
                  {plan.description ||
                    (index === 0
                      ? "Perfect for small local shops"
                      : index === 1
                        ? "For growing establishments"
                        : "For multiple locations")}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-center">
                      <svg
                        className={`h-5 w-5 ${index !== 1 ? "text-green-500" : ""} mr-2`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature.name}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={index === 1 ? "secondary" : "default"}
                  className="w-full self-end"
                >
                  {lang.pricing.cta}
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>

      {selectedCurrency === "USD" && (
        <div className="flex justify-center gap-4 mt-8">
          {hasPreviousPage && (
            <Button onClick={() => fetchPrevious()} variant="outline" size="sm">
              Previous
            </Button>
          )}
          {hasNextPage && (
            <Button onClick={() => fetchNext()} variant="outline" size="sm">
              Next
            </Button>
          )}
        </div>
      )}
    </Tabs>
  );
}
