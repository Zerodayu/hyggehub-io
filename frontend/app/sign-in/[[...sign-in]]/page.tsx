import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            <div className="flex flex-1 items-center justify-center p-10">
                <SignIn />
            </div>
            <div className="bg-muted flex flex-1 items-center justify-center p-10">
                <h1 className="text-4xl font-bold text-center">Welcome Back!</h1>
            </div>
        </section>
    )
}