"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PasswordInput } from "@/src/components/PasswordInput";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Checkbox } from "@/src/components/ui/checkbox";
import { SubmitButton } from "@/src/components/SubmitButton";
import { GoogleOAuthButton } from "@/src/components/GoogleOAuthButton";
import { FormMessage, Message } from "@/src/components/FormMessage";
import { signUpAction } from "@/src/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
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

      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          className="mt-0.5 border-border data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
        <Label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-snug cursor-pointer"
        >
          I agree to the{" "}
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="text-emerald-500 font-medium hover:underline transition-all"
          >
            Terms and Conditions
          </button>
        </Label>
      </div>

      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-semibold">
              Terms of Service
            </DialogTitle>
            <p className="text-xs text-muted-foreground">Last updated: February 2026</p>
          </DialogHeader>
          <div className="space-y-6 text-sm text-foreground mt-2">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Acceptance of Terms</h3>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using FinSplain (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2. Description of Service</h3>
              <p className="text-muted-foreground leading-relaxed">
                FinSplain is a financial document analysis platform that helps users understand bank statements, credit card statements, pay stubs, and other financial documents. The Service extracts and summarizes information to surface fees, subscriptions, spending patterns, and anomalies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided for informational purposes only and does not constitute financial advice. You should consult a qualified financial professional before making any financial decisions.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3. User Accounts</h3>
              <p className="text-muted-foreground leading-relaxed">
                To access certain features you must create an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must provide accurate information when creating an account and keep it up to date.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least 18 years old to use the Service. By creating an account, you represent that you meet this requirement.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">4. Acceptable Use</h3>
              <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground leading-relaxed">
                <li>Upload documents that you do not have the right to share</li>
                <li>Use the Service for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Interfere with or disrupt the integrity or performance of the Service</li>
                <li>Reverse engineer or attempt to extract the source code of the Service</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">5. Data &amp; Privacy</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy matters to us. Our{" "}
                <Link href="/privacy" className="text-emerald-500 hover:underline" onClick={() => setTermsOpen(false)}>
                  Privacy Policy
                </Link>{" "}
                explains how we collect, use, and protect your information. By using the Service you agree to our data practices as described there.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You retain ownership of all documents and data you upload. FinSplain does not sell, share, or monetize your financial data.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">6. Intellectual Property</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Service and its original content (excluding user-uploaded documents) are and will remain the exclusive property of FinSplain and its licensors. You may not copy, modify, or distribute any part of the Service without our prior written permission.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">7. Disclaimer of Warranties</h3>
              <p className="text-muted-foreground leading-relaxed">
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely accurate. Analysis results are generated automatically and may contain errors.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">8. Limitation of Liability</h3>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, FinSplain shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">9. Changes to These Terms</h3>
              <p className="text-muted-foreground leading-relaxed">
                We may update these Terms from time to time. When we do, we will revise the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the Service after changes constitutes acceptance of the updated Terms.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">10. Contact</h3>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms, please reach out at{" "}
                <a href="mailto:support@finsplain.net" className="text-emerald-500 hover:underline">
                  support@finsplain.net
                </a>
                .
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SubmitButton
        formAction={signUpAction}
        pendingText="Signing up..."
        disabled={!passwordValid || !termsAccepted}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sign up
      </SubmitButton>

      {message && <FormMessage message={message} />}
    </form>
  );
}
