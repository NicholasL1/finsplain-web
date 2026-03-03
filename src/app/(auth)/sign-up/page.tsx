import { FormMessage, Message } from "@/src/components/FormMessage";
import { SmtpMessage } from "@/src/app/(auth)/SmtpMessage";
import { SignUpForm } from "@/src/components/SignUpForm";
import Navbar from "@/src/components/Navbar";

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
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/8 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <SignUpForm
            message={
              "error" in searchParams || "success" in searchParams
                ? searchParams
                : undefined
            }
          />
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
