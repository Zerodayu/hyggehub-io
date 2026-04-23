"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import pricingList from "@/messages/pricing-list.json";
import { useTranslations } from "next-intl";

type CurrencyKey = "#dkk" | "#usd";
type PlanName = "Starter" | "Pro" | "Max";

type PricingTier = {
  name: PlanName;
  price: string;
  features: string[];
};

const planOrder: PlanName[] = ["Starter", "Pro", "Max"];

function splitPrice(price: string): { main: string; period?: string } {
  const idx = price.indexOf("/");
  if (idx === -1) return { main: price };
  return {
    main: price.slice(0, idx),
    period: price.slice(idx),
  };
}

function getTiers(currencyKey: CurrencyKey): PricingTier[] {
  const tiersByName = pricingList[currencyKey] as Record<
    string,
    { price: string; features: string[] }
  >;

  return planOrder
    .map((name) => {
      const tier = tiersByName?.[name];
      if (!tier) return null;
      return {
        name,
        price: tier.price,
        features: tier.features,
      };
    })
    .filter((v): v is PricingTier => v !== null);
}

export default function DynamicPricingPlans() {
  const t = useTranslations();
  const dkkTiers = getTiers("#dkk");
  const usdTiers = getTiers("#usd");

  return (
    <Tabs defaultValue="DKK" className="w-full">
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
            const { main, period } = splitPrice(tier.price);
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
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <span className="flex flex-wrap items-end my-4">
                  <p className="text-3xl font-bold">{main}</p>
                  <p
                    className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}
                  >
                    {period || t("pricing.perMonth")}
                  </p>
                </span>
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
                  {t("pricing.cta")}
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="USD">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {usdTiers.map((tier, index) => {
            const { main, period } = splitPrice(tier.price);
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
                      {t("pricing.mostPopular")}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <span className="flex flex-wrap items-end my-4">
                  <p className="text-3xl font-bold">{main}</p>
                  <p
                    className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}
                  >
                    {period || t("pricing.perMonth")}
                  </p>
                </span>
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
                  {t("pricing.cta")}
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
