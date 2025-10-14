"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Navbar() {
    return (
        <section>
            <div className="hidden md:flex fixed justify-end items-center w-fit right-0 py-6 px-8">
                <div className="flex bg-muted/20 backdrop-blur-xs justify-end w-content outline outline-muted rounded-full">
                    <SignedIn>
                        <div className="flex flex-row gap-4 w-full justify-between items-center">
                            <div className="flex justify-end bg-muted rounded-full py-3 px-3">
                                <UserButton />
                            </div>
                        </div>
                    </SignedIn>

                    <SignedOut>
                    </SignedOut>
                </div>
            </div>
        </section>
    )
}
