import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function Navbar() {
    return (
        <div className="w-full flex justify-end p-6">
            <SignedIn>
                <UserButton showName/>
            </SignedIn>
            <SignedOut>
                <SignInButton />
            </SignedOut>
        </div>
    )
}
