import { notFound } from "next/navigation";
import ShopCardSection from "@/components/shopCardSection";
import ShopUsersDay from "@/components/shopUsersDay";
import { Store, Phone } from "lucide-react"
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server'
import ShopNavbar from "@/components/shopNavbar";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { orgSlug } = await auth()
    const { slug } = await params


    if (slug !== orgSlug) {
        return notFound()
    }

    return (
        <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">
            <ShopNavbar />
            <div className="flex gap-12 pt-25 max-w-auto md:max-w-6xl w-full">
                <div className="grid col-span-1.5">
                    <div className="flex items-center w-full gap-6">
                        <div className="flex flex-col items-start w-full">
                            <span className="flex gap-2 items-center justify-center text-xl font-mono font-bold text-muted-foreground">
                                <Store size={20} />
                                <h1>{orgSlug}</h1>
                            </span>
                            <div className="flex flex-row gap-2 items-end justify-between w-full">
                                <p className="text-5xl font-semibold">
                                    shopname
                                </p>
                                <Button variant="ghost" className="font-mono text-xs text-muted-foreground">
                                    <Phone />
                                    1651 951 9526
                                </Button>
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
                            <PricingTable forOrganizations ctaPosition="bottom" />
                        </div>
                    </div>
                </div>

                <ShopUsersDay />
            </div>
        </section>
    )
}