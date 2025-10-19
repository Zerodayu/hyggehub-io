import MiniCalendarSection from "./miniCalendarSection"
import { Minus, Cake } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export default function ShopUsersDay() {
    return (
        <section>
            <MiniCalendarSection />
            <div className="flex flex-col gap-2">
                <div className="pt-6">
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2 pb-4">
                                    <Cake size={16} />
                                    <h1 className="font-mono">Todays Birthdays</h1>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                {/* <div className="flex flex-col gap-4">
                                    <span className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p>Users Username</p>
                                    </span>
                                     <span className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p>Users Username</p>
                                    </span>
                                     <span className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <p>Users Username</p>
                                    </span>
                                </div> */}

                                <div>
                                    <span className="flex items-center justify-center gap-4 text-muted-foreground">
                                        <Minus />
                                        <p className="font-mono">No birthdays today</p>
                                        <Minus />
                                    </span>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </section>
    )
}
