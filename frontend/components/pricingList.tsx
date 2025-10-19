'use client'

import { usePlans } from '@clerk/nextjs/experimental'
import { Button } from "@/components/ui/button";

export default function DynamicPricingPlans() {
  const { data, isLoading, hasNextPage, fetchNext, hasPreviousPage, fetchPrevious } = usePlans({
    for: 'organization',
    pageSize: 3,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {data.map((plan, index) => (
        <div 
          key={plan.id} 
          className={`${
            index === 1 
              ? "bg-primary text-primary-foreground p-8 rounded-lg shadow-lg scale-105 border border-primary relative" 
              : "bg-background p-8 rounded-lg shadow-sm border border-muted"
          }`}
        >
          {index === 1 && (
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-bold">
                MOST POPULAR
              </span>
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
          <p className="text-4xl font-bold mb-4">
            {plan.fee.currencySymbol}{plan.fee.amountFormatted}
            <span className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} text-base font-normal`}>
              /month
            </span>
          </p>
          <p className={`${index === 1 ? "text-primary-foreground/80" : "text-muted-foreground"} mb-6`}>
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
            className="w-full"
          >
            Get Started
          </Button>
        </div>
      ))}
      
      <div className="col-span-1 md:col-span-3 flex justify-center gap-4 mt-4">
        {hasPreviousPage && <Button onClick={() => fetchPrevious()} variant="outline" size="sm">Previous</Button>}
        {hasNextPage && <Button onClick={() => fetchNext()} variant="outline" size="sm">Next</Button>}
      </div>
    </div>
  );
}