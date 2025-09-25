"use client";

import { Label } from "react-aria-components"

import { DateField, DateInput } from "@/components/ui/datefield-rac"

export default function DatetimeInput() {
  return (
    <DateField className="*:not-first:mt-2" granularity="minute" hourCycle={12}>
      <Label className="text-foreground text-sm font-medium">
        Date and time input
      </Label>
      <DateInput />
    </DateField>
  )
}
