"use client"

import { useActionState } from "react"
import { signInActionWithState } from "@/src/app/actions"
import { PasswordInput } from "@/src/components/PasswordInput"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { SubmitButton } from "@/src/components/SubmitButton"
import { GoogleOAuthButton } from "@/src/components/GoogleOAuthButton"
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
        <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            className="text-emerald-500 font-medium hover:underline transition-all"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="w-full border-border focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </Label>
            <Link
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
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
            className="w-full border-border focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <GoogleOAuthButton />

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <SubmitButton
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 text-sm font-medium"
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
            <p className="text-sm text-muted-foreground border-l-2 border-border pl-3">
              Having trouble?{" "}
              <Link
                href="/forgot-password"
                className="text-emerald-500 font-medium hover:underline"
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
