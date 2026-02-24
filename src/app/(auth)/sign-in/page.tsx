import Navbar from "@/src/components/Navbar"
import { SignInForm } from "@/src/components/SignInForm"

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <SignInForm />
        </div>
      </div>
    </>
  )
}
