"use client";

import { OrganizationSwitcher, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

export default function Navbar() {
    return (
        <div className="flex fixed justify-end items-center w-full py-6 px-8">
            <div className="flex bg-muted/20 backdrop-blur-xs justify-end w-content outline outline-muted rounded-full">
                <SignedIn>
                    <div className="flex flex-row gap-4 w-full justify-between items-center">
                        <div className="flex justify-end bg-muted rounded-full py-3 px-3">
                            <UserButton/>
                            <OrganizationSwitcher/>
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    
                </SignedOut>
            </div>
        </div>
    )
}
