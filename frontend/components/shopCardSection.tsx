import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CardAction } from "@/components/ui/card"
import {
    Settings2,
    CircleAlert,
    Cake,
    ChevronDownIcon,
    ClockArrowDown,
    CalendarCheck,
    Ticket,
    SquarePen
} from "lucide-react"
import { Button } from "./ui/button"

export default function ShopCardSection() {
    return (
        <section className="flex-1 py-6 px-8">
            <div className="grid w-full py-4 gap-12">
                <div>
                    <span className="flex items-center gap-2 pb-4">
                        <Settings2 size={16} />
                        <h1 className="font-mono">Coupon Setups</h1>
                    </span>
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <ClockArrowDown size={20} />
                                    <p>Slow hours boost</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <Cake size={20} />
                                    <p>Birthday Special</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <Ticket size={20} />
                                    <p>Holiday Promos</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                                <CardDescription>Show name here</CardDescription>
                                <CardAction className="flex items-center justify-center gap-2 font-mono">
                                    <CalendarCheck size={20} />
                                    <p>Weekend Specials</p>
                                </CardAction>
                            </CardHeader>
                            <CardContent>
                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                            </CardContent>
                            <CardFooter className="text-muted-foreground gap-2 justify-end">
                                <Button variant="secondary" className="font-mono">
                                    <SquarePen />
                                    Edit
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
