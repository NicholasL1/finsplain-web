"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { PasswordInput } from "@/src/components/PasswordInput";
import { Label } from "@/src/components/ui/label";
import { SubmitButton } from "@/src/components/SubmitButton";
import { FormMessage, Message } from "@/src/components/FormMessage";
import { resetPasswordAction } from "@/src/app/actions";

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

export function ResetPasswordForm({ message }: Readonly<{ message?: Message }>) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showStrength, setShowStrength] = useState(false);
  const [touchedConfirm, setTouchedConfirm] = useState(false);

  const checks = getStrengthChecks(password);
  const passwordValid = Object.values(checks).every(Boolean);
  const passwordsMatch = password === confirmPassword;
  const confirmHasContent = confirmPassword.length > 0;
  const canSubmit = passwordValid && passwordsMatch && confirmHasContent;

  return (
    <form className="flex flex-col space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Please enter your new password below.
        </p>
      </div>

      <div className="space-y-4">
        {/* New password */}
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            New password
          </Label>
          <PasswordInput
            id="password"
            name="password"
            placeholder="New password"
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

        {/* Confirm password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm password
          </Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (!touchedConfirm) setTouchedConfirm(true);
            }}
            className={`w-full rounded-xl ${
              touchedConfirm && confirmHasContent && !passwordsMatch
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-border focus:border-emerald-500 focus:ring-emerald-500"
            }`}
          />
          {touchedConfirm && confirmHasContent && (
            <p
              className={`text-xs flex items-center gap-1.5 ${
                passwordsMatch ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
              }`}
            >
              {passwordsMatch ? (
                <>
                  <Check className="w-3 h-3" /> Passwords match
                </>
              ) : (
                <>
                  <X className="w-3 h-3" /> Passwords do not match
                </>
              )}
            </p>
          )}
        </div>
      </div>

      <SubmitButton
        formAction={resetPasswordAction}
        pendingText="Resetting password..."
        disabled={!canSubmit}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Reset password
      </SubmitButton>

      {message && <FormMessage message={message} />}
    </form>
  );
}
