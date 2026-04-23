'use client'

import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="grid w-full h-screen grow items-center px-4 sm:justify-center">
      <SignIn />
    </div>
  )
}