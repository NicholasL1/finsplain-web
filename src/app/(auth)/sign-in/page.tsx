import Navbar from "@/src/components/Navbar"
import { SignInForm } from "@/src/components/SignInForm"

export default function SignInPage() {
  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/8 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <SignInForm />
        </div>
      </div>

    </>
  )
}
