"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/src/components/PasswordInput";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { SubmitButton } from "@/src/components/SubmitButton";
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
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  const checks = getStrengthChecks(password);
  const passwordValid = Object.values(checks).every(Boolean);

  return (
    <form className="flex flex-col space-y-6">
      {/* UrlProvider equivalent — provides origin for email redirect */}
      <input type="hidden" name="site_url" value={siteUrl} />

      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold text-[#1F2937] tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-[#6B7280]">
          Already have an account?{" "}
          <Link
            className="text-[#10B981] font-medium hover:underline transition-all"
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
            className="text-sm font-medium text-[#1F2937]"
          >
            Full Name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="John Doe"
            required
            className="w-full border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
          />
        </div>

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
          <Label
            htmlFor="password"
            className="text-sm font-medium text-[#1F2937]"
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
            className="w-full border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
          />

          {showStrength && (
            <ul className="mt-2 space-y-1.5 pl-0.5">
              {STRENGTH_CHECKS.map(({ key, label }) => {
                const met = checks[key];
                return (
                  <li key={key} className="flex items-center gap-2 text-xs">
                    <span
                      className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                        met ? "bg-[#10B981]/15" : "bg-[#F3F4F6]"
                      }`}
                    >
                      {met ? (
                        <Check className="w-2.5 h-2.5 text-[#10B981]" />
                      ) : (
                        <X className="w-2.5 h-2.5 text-[#9CA3AF]" />
                      )}
                    </span>
                    <span className={met ? "text-[#059669]" : "text-[#9CA3AF]"}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <SubmitButton
        formAction={signUpAction}
        pendingText="Signing up..."
        disabled={!passwordValid}
        className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sign up
      </SubmitButton>

      {message && <FormMessage message={message} />}
    </form>
  );
}
