import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Settings2,
    Cake,
    ClockArrowDown,
    CalendarCheck,
    Ticket,
    SquarePen,
    Send
} from "lucide-react"
import { Textarea } from "./ui/textarea"
import DatetimeInput from "./dateTimeInput"

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
                                <Dialog>
                                    <form>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="font-mono">
                                                <SquarePen />
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2">
                                                    <CalendarCheck size={20} />
                                                    Free Coffee Coupon
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Update your coupon details here. Click save when you&apos;re done.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4">
                                                <div className="grid gap-3">
                                                    <Label htmlFor="name-1">Title</Label>
                                                    <Input id="title-1" defaultValue="Default title" />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="desc-1">Description</Label>
                                                    <Textarea id="desc-1" placeholder="Type your message here." defaultValue="Default description" />
                                                </div>
                                                <div className="grid gap-3">
                                                    <Label htmlFor="desc-1">Expiration Date</Label>
                                                    <DatetimeInput />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant="outline">Cancel</Button>
                                                </DialogClose>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </form>
                                </Dialog>

                                <Button className="font-mono">
                                    <Send />
                                    Post
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
