"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/src/components/PasswordInput";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SubmitButton } from "@/src/components/SubmitButton";
import { GoogleOAuthButton } from "@/src/components/GoogleOAuthButton";
import { FormMessage, Message } from "@/src/components/FormMessage";
import { signUpAction } from "@/src/app/actions";

const STRENGTH_CHECKS = [
  { key: "minLength" as const, label: "At least 12 characters" },
  { key: "hasUppercase" as const, label: "One uppercase letter (A–Z)" },
  { key: "hasLowercase" as const, label: "One lowercase letter (a–z)" },
  { key: "hasNumber" as const, label: "One number (0–9)" },
  { key: "hasSymbol" as const, label: "One special character (!@#$...)" },
] as const;

function getStrengthChecks(password: string) {
  return {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password),
  };
}

export function SignUpForm({ message }: { message?: Message }) {
  const [password, setPassword] = useState("");
  const [showStrength, setShowStrength] = useState(false);
  const [siteUrl] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const checks = getStrengthChecks(password);
  const passwordValid = Object.values(checks).every(Boolean);

  return (
    <form className="flex flex-col space-y-6">
      {/* UrlProvider equivalent — provides origin for email redirect */}
      <input type="hidden" name="site_url" value={siteUrl} />

      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            className="text-emerald-500 font-medium hover:underline transition-all"
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="full_name"
            className="text-sm font-medium text-foreground"
          >
            Full Name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full border-border focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
          />
        </div>

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
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!showStrength) setShowStrength(true);
            }}
            className="w-full border-border focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
          />

          {showStrength && (
            <ul className="mt-2 space-y-1.5 pl-0.5">
              {STRENGTH_CHECKS.map(({ key, label }) => {
                const met = checks[key];
                return (
                  <li key={key} className="flex items-center gap-2 text-xs">
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        met ? "bg-emerald-500/15" : "bg-muted"
                      }`}
                    >
                      {met ? (
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      ) : (
                        <X className="w-2.5 h-2.5 text-muted-foreground" />
                      )}
                    </span>
                    <span className={met ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <GoogleOAuthButton />

      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      <SubmitButton
        formAction={signUpAction}
        pendingText="Signing up..."
        disabled={!passwordValid}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sign up
      </SubmitButton>

      {message && <FormMessage message={message} />}
    </form>
  );
}
