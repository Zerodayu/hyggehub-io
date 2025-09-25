"use client";

import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/miniCalendar";

const MiniCalendarSection = () => (
  <MiniCalendar>
    <MiniCalendarNavigation direction="prev" />
    <MiniCalendarDays>
      {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
    </MiniCalendarDays>
    <MiniCalendarNavigation direction="next" />
  </MiniCalendar>
);

export default MiniCalendarSection;
