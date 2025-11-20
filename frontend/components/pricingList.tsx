'use client'

import { usePlans } from '@clerk/nextjs/experimental'
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  fetchExchangeRates,
  convertPrice,
  type ExchangeRates,
  type ConvertedPrices
} from '@/utils/currency-convert';

export default function DynamicPricingPlans() {
  const { data, isLoading, hasNextPage, fetchNext, hasPreviousPage, fetchPrevious } = usePlans({
    for: 'organization',
    pageSize: 3,
  });

  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'DKK'>('DKK');

  useEffect(() => {
    fetchExchangeRates().then(rates => {
      if (rates) setExchangeRates(rates);
    });
  }, []);

  const getConvertedPrice = (amountInCents: number): ConvertedPrices | null => {
    if (!exchangeRates) return null;
    return convertPrice(amountInCents, exchangeRates);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="DKK" className="w-full" onValueChange={(value) => setSelectedCurrency(value as 'USD' | 'DKK')}>
      {/* Currency selector */}
      <div className="flex justify-center mb-8">
        <TabsList className='font-mono font-bold'>
          <TabsTrigger value="DKK">DKK</TabsTrigger>
          <TabsTrigger value="USD">USD</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="DKK">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {data.map((plan, index) => {
            const convertedPrices = getConvertedPrice(plan.fee.amount);
            const displayPrice = convertedPrices?.DKK || `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col flex-wrap px-4 p-6 ${index === 1
                  ? "bg-primary text-primary-foreground rounded-lg shadow-lg scale-105 border border-primary"
                  : "bg-background rounded-lg shadow-sm border border-muted"
                  }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold outline outline-primary">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <span className='flex flex-wrap items-end my-4'>
                  <p className="text-3xl font-bold">
                    {displayPrice}
                  </p>
                  <p className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}>
                    /month
                  </p>
                </span>
                <p className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} my-6`}>
                  {plan.description || (index === 0 ? "Perfect for small local shops" : index === 1 ? "For growing establishments" : "For multiple locations")}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature.id} className="flex items-center">
                      <svg className={`h-5 w-5 ${index !== 1 ? "text-green-500" : ""} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature.name}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={index === 1 ? "secondary" : "default"}
                  className="w-full self-end"
                >
                  Get Started
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <TabsContent value="USD">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {data.map((plan, index) => {
            const convertedPrices = getConvertedPrice(plan.fee.amount);
            const displayPrice = convertedPrices?.USD || `${plan.fee.currencySymbol}${plan.fee.amountFormatted}`;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col flex-wrap px-4 p-6 ${index === 1
                  ? "bg-primary text-primary-foreground rounded-lg shadow-lg scale-105 border border-primary"
                  : "bg-background rounded-lg shadow-sm border border-muted"
                  }`}
              >
                {index === 1 && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold outline outline-primary">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <span className='flex flex-wrap items-end my-4'>
                  <p className="text-3xl font-bold">
                    {displayPrice}
                  </p>
                  <p className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}>
                    /month
                  </p>
                </span>
                <p className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} my-6`}>
                  {plan.description || (index === 0 ? "Perfect for small local shops" : index === 1 ? "For growing establishments" : "For multiple locations")}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(feature => (
                    <li key={feature.id} className="flex items-center">
                      <svg className={`h-5 w-5 ${index !== 1 ? "text-green-500" : ""} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature.name}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={index === 1 ? "secondary" : "default"}
                  className="w-full self-end"
                >
                  Get Started
                </Button>
              </div>
            );
          })}
        </div>
      </TabsContent>

      <div className="flex justify-center gap-4 mt-8">
        {hasPreviousPage && <Button onClick={() => fetchPrevious()} variant="outline" size="sm">Previous</Button>}
        {hasNextPage && <Button onClick={() => fetchNext()} variant="outline" size="sm">Next</Button>}
      </div>
    </Tabs>
  );
}