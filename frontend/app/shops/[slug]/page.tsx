import ShopCardSection from "@/components/shopCardSection";
import ShopUsersDay from "@/components/shopUsersDay";
import { Store, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button";
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
import { OrganizationProfile } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server'
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { orgSlug } = await auth()
    const { slug } = await params
    

    if (slug !== orgSlug) {
        return (
            notFound()
        )
    }

    return (
        <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">
            <div className="flex gap-12 pt-25 max-w-auto md:max-w-6xl w-full">
                <div className="grid col-span-1.5">
                    <div className="flex items-center w-full gap-6">
                        <div className="flex flex-col items-start w-full">
                            <span className="flex gap-2 items-center justify-center text-xl font-mono font-bold text-muted-foreground">
                                <Store size={20} />
                                <h1>{orgSlug}</h1>
                            </span>
                            <div className="flex flex-row gap-2 items-end">
                                <p className="text-5xl font-semibold">
                                    shopname
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="secondary" size="icon" className="size-8">
                                            <Settings2 />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent asChild>
                                        <div className='min-w-[60vw] justify-center items-center overflow-hidden'>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle />
                                                <AlertDialogDescription asChild>
                                                    <span>
                                                        {/* clerk component */}
                                                        <OrganizationProfile routing="hash" />
                                                    </span>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className='w-full'>Close</AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </div>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="w-full flex flex-row justify-center items-center text-xs text-muted-foreground gap-6 py-2">
                                <div className="flex-1 w-auto h-0.5 rounded bg-accent shadow-sm" />
                                <div className="flex flex-row items-center gap-6">
                                    <Button variant="link" className="font-mono">Followers</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid w-full py-4 gap-14">
                        <div>
                            <ShopCardSection />
                        </div>
                    </div>
                </div>
                <ShopUsersDay />
            </div>
        </section>
    )
}