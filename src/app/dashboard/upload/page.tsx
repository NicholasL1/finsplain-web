import Navbar from "@/src/components/Navbar";
import UploadCard from "@/src/components/UploadCard";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function UploadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/15 via-transparent to-indigo-500/10 dark:from-emerald-500/8 dark:to-indigo-500/5 pointer-events-none" aria-hidden="true" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-indigo-500/6 blur-3xl pointer-events-none" aria-hidden="true" />
      <Navbar />
      <main className="relative container mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Upload Document
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload a financial document to get clear, actionable insights.
          </p>
        </div>
        <UploadCard />
      </main>
    </div>
  );
}
