

import { notFound } from "next/navigation";
import ShopCardSection from "@/components/shopCardSection";
import ShopUsersDay from "@/components/shopUsersDay";
import { auth } from '@clerk/nextjs/server'
import ShopNavbar from "@/components/shopNavbar";
import ShopEditSheet from "@/components/shopEdit";
import { getOrg } from '@/api/api-org';
import FollowersList from "@/components/followersPopup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckPlanHandle } from '@/components/checkPlan';
import QrDownload from "@/components/downloadQr";
import { Key, Phone, ArrowLeft, BadgeInfo } from "lucide-react"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { orgSlug, orgId } = await auth()
    const { slug } = await params

    if (slug !== orgSlug) {
        return notFound()
    }

    // Fetch shop metadata server-side
    const orgData = orgId ? await getOrg(orgId) : null;
    // const shopNum = orgData?.shop?.shopNum;
    const shopCode = orgData?.shop?.code;
    const shopName = orgData?.shop?.name;

    return (
        <CheckPlanHandle>
            <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">

                {/* mobile warning */}
                <section className="fixed flex md:hidden items-center justify-center w-full h-screen bg-background/50 backdrop-blur z-20 overflow-hidden touch-none">
                    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center max-w-sm mx-auto">
                        <BadgeInfo />
                        <h1 className="text-xl font-bold break-words sm:text-lg">This page works best on desktop devices</h1>
                        <p className="text-sm text-muted-foreground">Mobile input may cause errors</p>
                    </div>
                </section>

                <ShopNavbar slug={slug} />

                <Link href="/shops" className="self-start m-8">
                    <Button variant="link" className="font-mono">
                        <ArrowLeft />
                        Shops
                    </Button>
                </Link>

                <div className="flex gap-12 pt-auto max-w-auto md:max-w-6xl w-full">
                    <div className="flex-1 grid col-span-1.5">
                        <div className="flex items-center w-full gap-6">
                            <div className="flex flex-col items-start w-full">
                                <div className="flex flex-row gap-10 w-full">
                                    <span className="flex gap-2 items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                                        <Key size={16} />
                                        <p>{shopCode ?? "no shop code"}</p>
                                    </span>

                                    {/* shops phone no. */}
                                    {/* <span className="flex gap-2 items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                                    <Phone size={16} />
                                    <p>{shopNum ?? "no shop number"}</p>
                                </span> */}
                                </div>
                                <div className="flex flex-row gap-2 items-end justify-between w-full">
                                    <p className="text-5xl font-semibold">
                                        {shopName ?? "Shop Name"}
                                    </p>
                                    <ShopEditSheet />
                                </div>
                                <div className="w-full flex flex-row justify-center items-center text-xs text-muted-foreground gap-6 py-2">
                                    <div className="flex-1 w-auto h-0.5 rounded bg-accent shadow-sm" />
                                    <div className="flex flex-row items-center gap-6">
                                        <FollowersList />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid w-full">
                            <div>
                                <QrDownload />
                                <ShopCardSection />
                            </div>
                        </div>
                    </div>
                    <div>
                        <ShopUsersDay />
                    </div>
                </div>
            </section>
        </CheckPlanHandle>
    )
}