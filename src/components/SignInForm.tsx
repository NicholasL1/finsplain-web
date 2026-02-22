"use client"

import { useActionState } from "react"
import { signInActionWithState } from "@/src/app/actions"
import { PasswordInput } from "@/src/components/PasswordInput"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { SubmitButton } from "@/src/components/SubmitButton"
import Link from "next/link"

const FORGOT_PASSWORD_HINT_AFTER = 5

export function SignInForm() {
  const [state, formAction] = useActionState(signInActionWithState, null)

  const attempts = state?.attempts ?? 0
  const error = state?.error ?? null
  const showForgotHint = attempts >= FORGOT_PASSWORD_HINT_AFTER

  return (
    <form action={formAction} className="flex flex-col space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold text-[#1F2937] tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-[#6B7280]">
          Don&apos;t have an account?{" "}
          <Link
            className="text-[#10B981] font-medium hover:underline transition-all"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-[#1F2937]"
            >
              Password
            </Label>
            <Link
              className="text-xs text-[#6B7280] hover:text-[#1F2937] hover:underline transition-all"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Your password"
            required
            className="w-full border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
          />
        </div>
      </div>

      <SubmitButton
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-11 text-sm font-medium"
        pendingText="Signing in..."
      >
        Sign in
      </SubmitButton>

      {error && (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm text-red-500 border-l-2 border-red-500 pl-3">
            {error}
          </p>
          {showForgotHint && (
            <p className="text-sm text-[#6B7280] border-l-2 border-[#E5E7EB] pl-3">
              Having trouble?{" "}
              <Link
                href="/forgot-password"
                className="text-[#10B981] font-medium hover:underline"
              >
                Reset your password
              </Link>{" "}
              if you&apos;ve forgotten it.
            </p>
          )}
        </div>
      )}
    </form>
  )
}
