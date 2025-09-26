import { currentUser } from "@clerk/nextjs/server";
import ShopNavbar from "@/components/shopNavbar";
import ShopCardSection from "@/components/shopCardSection";
import ShopUsersDay from "@/components/shopUsersDay";
import Navbar from "@/components/Navbar";
import { Store } from "lucide-react"

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    return (
        <section className="flex flex-col items-center justify-start min-h-screen px-4 gap-6">
            <ShopNavbar />
            <Navbar />
            <div className="flex gap-12 pt-25 max-w-auto md:max-w-6xl w-full">
                <div className="grid col-span-1.5">
                    <div className="flex items-center w-full gap-6">
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
                                    <p className="font-mono">4 followers</p>
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