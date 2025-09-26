"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { Calendar, CircleAlert, DotIcon } from "lucide-react"
import CalendarPickerInput from "./calendarPicker";

export default function Navbar() {
    return (
        <div className="flex fixed justify-end items-center w-full py-6 px-8">
            <div className="flex bg-muted/20 backdrop-blur-xs justify-end w-content outline outline-muted rounded-full">
                <SignedIn>
                    <div className="flex flex-row gap-4 w-full justify-between items-center">
                        {/* <div className="flex flex-1 px-6">
                            <span className="flex flex-row gap-2 items-center font-bold font-mono">
                                <LayoutGrid size={20} />
                                <p>Home</p>
                            </span>
                        </div> */}

                        <div className="flex justify-end bg-muted rounded-full py-3 px-3">
                            <UserButton/>
                        </div>
                    </div>
                </SignedIn>

                <SignedOut>
                    <SignInButton />
                </SignedOut>
            </div>
        </div>
    )
}
