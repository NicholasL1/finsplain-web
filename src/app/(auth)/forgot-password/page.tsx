import { FormMessage, Message } from "@/src/components/FormMessage";
import { SubmitButton } from "@/src/components/SubmitButton";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "@/src/app/(auth)/SmtpMessage";
import { forgotPasswordAction } from "@/src/app/actions";
import Navbar from "@/src/components/Navbar";
import { UrlProvider } from "@/src/components/UrlProvider";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/8 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <UrlProvider>
            <form className="flex flex-col space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground">
                  Remember your password?{" "}
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
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
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
              </div>

              <SubmitButton
                formAction={forgotPasswordAction}
                pendingText="Sending reset link..."
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-11 text-sm font-medium"
              >
                Reset Password
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </UrlProvider>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
