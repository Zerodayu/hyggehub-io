import { Button } from '@/components/ui/button'
import { ArrowRight, Shapes, CirclePlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { CreateOrganization } from '@clerk/nextjs';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Page() {
    // Example: Array of cards (replace with your actual data)
    const cards = [1, 2, 3, 4, 5];

    return (
        <section>
            <div className="fixed bg-muted-foreground/10 rounded-full backdrop-blur-xs items-center justify-between py-2 px-4 m-6">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="link">Show Dialog</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent asChild>
                        <div className='min-w-[32vw] justify-center items-center'>
                            <AlertDialogHeader>
                                <AlertDialogTitle />
                                <AlertDialogDescription asChild>
                                    <span>
                                        {/* clerk component */}
                                        <CreateOrganization hideSlug/>
                                    </span>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className='w-full'>Cancel</AlertDialogCancel>
                            </AlertDialogFooter>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="flex flex-wrap items-center justify-center min-h-screen max-w-screen space-x-10">
                {cards.map((idx) => (
                    <Card key={idx} className="max-w-xs shadow-none gap-0 pt-0 min-w-[25vw]">
                        <CardHeader className="py-4 px-5 flex flex-row items-center gap-3 font-bold font-mono">
                            <div className="h-8 w-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full">
                                <Shapes className="h-5 w-5" />
                            </div>
                            Shadcn UI Blocks
                        </CardHeader>
                        <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
                            <p>Explore a collection of Shadcn UI blocks and components, ready to preview and copy.</p>
                            <div className="mt-5 w-full aspect-video bg-muted rounded-xl" />
                        </CardContent>
                        <CardFooter className="mt-6">
                            <Button>
                                <span className="flex items-center justify-between font-mono text-xs gap-2">
                                    Open <ArrowRight />
                                </span>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    )
}
