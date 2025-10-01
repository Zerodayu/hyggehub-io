import { notFound } from "next/navigation";
import ShopCardSection from "@/components/shopCardSection";
import ShopUsersDay from "@/components/shopUsersDay";
import { Key, Phone } from "lucide-react"
import { Button } from "@/components/ui/button";
import { auth } from '@clerk/nextjs/server'
import ShopNavbar from "@/components/shopNavbar";
import ShopEditSheet from "@/components/shopEdit";
import { getOrg } from '@/api/api-org'; // Import getOrg directly

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
    const shopNum = orgData?.shop?.shopNum;
    const shopCode = orgData?.shop?.code;

    return (
        <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">
            <ShopNavbar slug={slug} />
            <div className="flex gap-12 pt-25 max-w-auto md:max-w-6xl w-full">
                <div className="grid col-span-1.5">
                    <div className="flex items-center w-full gap-6">
                        <div className="flex flex-col items-start w-full">
                            <div className="flex flex-row gap-10 w-full">
                                <span className="flex gap-2 items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                                    <Key size={16} />
                                    <p>{shopCode ?? "no shop code"}</p>
                                </span>
                                <span className="flex gap-2 items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                                    <Phone size={16} />
                                    <p>{shopNum ?? "no shop number"}</p>
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 items-end justify-between w-full">
                                <p className="text-5xl font-semibold">
                                    shopname
                                </p>
                                <ShopEditSheet />
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