import { currentUser } from "@clerk/nextjs/server";
import ShopSidebar from "@/components/shopNavbar";
import ShopCardSection from "@/components/shopCardSection";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Minus, CircleAlert, Store } from "lucide-react"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">
            <ShopSidebar />
            <div className="flex gap-12 pt-25 max-w-auto md:max-w-6xl">
                <div className="grid col-span-1.5">
                    <div className="flex flex-col items-start w-full">
                        <span className="flex gap-2 items-center justify-center text-xl font-mono font-bold text-muted-foreground">
                            <Store size={20} />
                            <h1>shop</h1>
                        </span>
                        <p className="text-5xl font-semibold">
                            Shop Name
                        </p>
                        <div className="w-full flex flex-row justify-center items-center text-xs text-muted-foreground gap-6 py-2">
                            <div className="flex-1 w-auto h-0.5 rounded bg-accent shadow-sm" />
                            <div className="flex flex-row items-center gap-6">
                                <p>4 followers</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid w-full py-4 gap-14">
                        <div>
                            <span className="flex items-center gap-2 pb-4">
                                <Minus size={16} />
                                <h1 className="font-mono">your coupons</h1>
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

                        <div>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>
                                        <span className="flex items-center gap-2 pb-4">
                                            <Minus size={16} />
                                            <h1 className="font-mono">expired/claimed coupons</h1>
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>

                                        <Card className="opacity-50">
                                            <CardHeader>
                                                <CardTitle className="text-lg font-bold">Discount Coffee Coupon</CardTitle>
                                                <CardDescription>Show name here</CardDescription>
                                                <CardAction className="opacity-50 text-destructive outline rounded-full px-2 font-mono text-xs">
                                                    Expired
                                                </CardAction>
                                            </CardHeader>
                                            <CardContent>
                                                <p>Card Description here, Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem.</p>
                                            </CardContent>
                                            <CardFooter className="text-muted-foreground gap-2">
                                                <CircleAlert size={16} />
                                                <p>expires on {new Date().toLocaleDateString()}</p>
                                            </CardFooter>
                                        </Card>

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
                <ShopCardSection />
            </div>
        </section>
    )
}