"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import pricingList from "@/messages/pricing-list.json";
import { useTranslations } from "next-intl";

export default function DynamicPricingPlans() {
  type CurrencyKey = "#dkk" | "#usd";
  type PlanName = "Starter" | "Pro" | "Max";

  const t = useTranslations();

  const currencies: ReadonlyArray<{ tab: "DKK" | "USD"; key: CurrencyKey }> = [
    { tab: "DKK", key: "#dkk" },
    { tab: "USD", key: "#usd" },
  ];

  const planOrder: ReadonlyArray<PlanName> = ["Starter", "Pro", "Max"];

  return (
    <Tabs defaultValue="DKK" className="w-full">
      {/* Currency selector */}
      <div className="flex justify-center mb-8">
        <TabsList className="font-mono font-bold">
          {currencies.map((c) => (
            <TabsTrigger key={c.tab} value={c.tab}>
              {c.tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {currencies.map((c) => (
        <TabsContent key={c.tab} value={c.tab}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
            {planOrder.map((planName, index) => {
              const tiersByName = pricingList[c.key] as Record<
                string,
                { price: string; features: string[] }
              >;

              const tier = tiersByName?.[planName];
              if (!tier) return null;

              const splitIdx = tier.price.indexOf("/");
              const main =
                splitIdx === -1 ? tier.price : tier.price.slice(0, splitIdx);
              const period = splitIdx === -1 ? undefined : tier.price.slice(splitIdx);

              return (
                <div
                  key={planName}
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
                  <h3 className="text-2xl font-bold mb-2">{planName}</h3>
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
      ))}
    </Tabs>
  );
}
