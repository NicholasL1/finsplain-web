import Navbar from "@/src/components/Navbar";
import StatusBadge from "@/src/components/StatusBadge";
import InsightsDashboard from "@/src/components/insights/InsightsDashboard";
import type { DocumentResult } from "@/src/types/api";
import {
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "../../../../../supabase/server";
import { Button } from "@/src/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: doc } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!doc) {
    notFound();
  }

  const insights = doc.insights as Record<string, unknown> | null;

  // Reconstruct the DocumentResult from stored insights
  const result: DocumentResult | null =
    doc.status === "complete" && insights && !("error" in insights)
      ? (insights as unknown as DocumentResult)
      : null;

  // Extract user-facing error message from insights if present
  const storedError =
    insights && "error" in insights ? (insights.error as string) : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute inset-0 bg-linear-to-br from-emerald-500/12 via-transparent to-indigo-500/8 dark:from-emerald-500/6 dark:to-indigo-500/4 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <Navbar />
      <main className="relative container mx-auto px-4 py-8 sm:py-12">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Documents
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-border/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {doc.filename}
              </h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Uploaded {formatDate(doc.created_at)}
              {result?.summary.period_description && (
                <span className="ml-2 text-foreground/60">
                  &middot; {result.summary.period_description}
                </span>
              )}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-10 text-sm font-medium">
              <Upload className="w-4 h-4 mr-2" />
              Upload Another
            </Button>
          </Link>
        </div>

        {/* Processing state */}
        {doc.status === "processing" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-7 h-7 text-amber-500 animate-spin" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              Analyzing your document...
            </h3>
            <p className="text-muted-foreground text-sm">
              This usually takes less than 30 seconds. The page will update
              automatically.
            </p>
          </div>
        )}

        {/* Error state */}
        {doc.status === "error" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              Analysis failed
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              {storedError ||
                "Something went wrong on our end. Please try uploading again."}
            </p>
            <Link href="/dashboard/upload">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-10 text-sm font-medium">
                Try Again
              </Button>
            </Link>
          </div>
        )}

        {/* Complete state — full insights dashboard */}
        {doc.status === "complete" && result && (
          <InsightsDashboard result={result} />
        )}
      </main>
    </div>
  );
}
