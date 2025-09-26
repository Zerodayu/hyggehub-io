"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { CircleAlert, DotIcon } from "lucide-react"

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
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label="Open chat"
                                        labelIcon={<DotIcon />}
                                        onClick={() => alert('init chat')}
                                    />
                                    <UserButton.Action label="manageAccount" />
                                    <UserButton.Action label="signOut" />
                                </UserButton.MenuItems>

                                <UserButton.UserProfilePage label="Help" labelIcon={<DotIcon />} url="help">
                                    <div>
                                        <h1>Help Page</h1>
                                        <p>This is the custom help page</p>
                                    </div>
                                </UserButton.UserProfilePage>
                            </UserButton>
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
