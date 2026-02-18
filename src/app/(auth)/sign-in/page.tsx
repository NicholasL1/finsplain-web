import { signInAction } from "@/src/app/actions";
import { FormMessage, Message } from "@/src/components/FormMessage";
import Navbar from "@/src/components/Navbar";
import { SubmitButton } from "@/src/components/SubmitButton";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <form className="flex flex-col space-y-6">
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
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1F2937]"
                >
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
                <Input
                  id="password"
                  type="password"
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
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>

            <FormMessage message={message} />
          </form>
        </div>
      </div>
    </>
  );
}
