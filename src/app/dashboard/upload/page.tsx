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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12 sm:py-16">
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
