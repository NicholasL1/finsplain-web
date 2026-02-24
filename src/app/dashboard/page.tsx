import Navbar from "@/src/components/Navbar";
import DocumentList from "@/src/components/DocumentList";
import { Upload } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Documents
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {documents && documents.length > 0
                ? `${documents.length} document${documents.length !== 1 ? "s" : ""} analyzed`
                : "Upload a document to get started"}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl px-5 h-10 text-sm font-medium">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        {/* Document List */}
        <DocumentList documents={documents || []} />
      </main>
    </div>
  );
}
