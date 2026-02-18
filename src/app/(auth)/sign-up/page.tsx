import { FormMessage, Message } from "@/src/components/FormMessage";
import { SubmitButton } from "@/src/components/SubmitButton";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "@/src/app/(auth)/SmtpMessage";
import { signUpAction } from "@/src/app/actions";
import Navbar from "@/src/components/Navbar";
import { UrlProvider } from "@/src/components/UrlProvider";

export default async function Signup(props: {
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <UrlProvider>
            <form className="flex flex-col space-y-6">
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
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-[#1F2937]"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                    className="w-full border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] rounded-xl"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl h-11 text-sm font-medium"
              >
                Sign up
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
