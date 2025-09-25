import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CardAction } from "@/components/ui/card"
import { Settings2, CircleAlert } from "lucide-react"
import MiniCalendarSection from "./miniCalendarSection"

export default function ShopCardSection() {
    return (
        <section className="flex-1 py-6 px-8">
            <div className="grid w-full py-4 gap-12">
                <MiniCalendarSection />
                <div>
                    <span className="flex items-center gap-2 pb-4">
                        <Settings2 size={16} />
                        <h1 className="font-mono">Coupon Setups</h1>
                    </span>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Free Coffee Coupon</CardTitle>
                            <CardDescription>Show name here</CardDescription>
                            <CardAction className="opacity-50 text-success outline rounded-full px-2 font-mono text-xs">
                                New coupon
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                        </CardContent>
                        <CardFooter className="text-muted-foreground gap-2">
                            <CircleAlert size={16} />
                            <p>until {new Date().toLocaleDateString()}</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    )
}
