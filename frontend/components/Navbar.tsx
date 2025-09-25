import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
    return (
        <div className="flex bg-background/20 backdrop-blur-xs fixed justify-end w-full p-6">
            <SignedIn>
                <UserButton showName/>
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </div>
    )
}
