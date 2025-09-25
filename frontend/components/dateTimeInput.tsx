"use client";

import { DateField, DateInput } from "@/components/ui/datefield-rac"

export default function DatetimeInput() {
  return (
    <DateField className="*:not-first:mt-2" granularity="minute" hourCycle={12}>
      <DateInput className="bg-input/30" />
    </DateField>
  )
}
