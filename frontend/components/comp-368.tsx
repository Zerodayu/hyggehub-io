import {
  Cake,
  ChevronDownIcon,
  ClockArrowDown,
  CalendarCheck,
  Ticket,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Dropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="font-mono font-bold">
          Post Coupons
          <ChevronDownIcon
            className="-me-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <ClockArrowDown size={16} className="opacity-60" aria-hidden="true" />
          Slow Hours Boost
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Cake size={16} className="opacity-60" aria-hidden="true" />
          Birthday Special
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Ticket size={16} className="opacity-60" aria-hidden="true" />
          Holiday Promos
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CalendarCheck size={16} className="opacity-60" aria-hidden="true" />
          Weekend Specials
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
