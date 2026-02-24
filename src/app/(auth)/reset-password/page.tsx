import { FormMessage, Message } from "@/src/components/FormMessage";
import Navbar from "@/src/components/Navbar";
import { ResetPasswordForm } from "@/src/components/ResetPasswordForm";

export default async function ResetPassword(props: {
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <ResetPasswordForm
            message={
              "error" in searchParams || "success" in searchParams
                ? searchParams
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
}
