import Navbar from "@/src/components/Navbar";
import StatusBadge from "@/src/components/StatusBadge";
import {
  ArrowLeft,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
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

  const insights = (doc.insights as Record<string, unknown>) || {};
  const fees = (insights.fees as Array<{ name: string; amount: number }>) || [];
  const subscriptions =
    (insights.subscriptions as Array<{
      name: string;
      amount: number;
      frequency: string;
    }>) || [];
  const patterns = (insights.patterns as string[]) || [];
  const unusual =
    (insights.unusual as Array<{
      description: string;
      amount: number;
      date: string;
    }>) || [];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Documents
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {doc.filename}
              </h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Uploaded {formatDate(doc.created_at)}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-10 text-sm font-medium">
              <Upload className="w-4 h-4 mr-2" />
              Upload Another
            </Button>
          </Link>
        </div>

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

        {doc.status === "error" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              Analysis failed
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              We couldn't process this document. Please try uploading again.
            </p>
            <Link href="/dashboard/upload">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-10 text-sm font-medium">
                Try Again
              </Button>
            </Link>
          </div>
        )}

        {doc.status === "complete" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                  <DollarSign className="w-4.5 h-4.5 text-amber-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-card-foreground">
                  ${doc.total_fees?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Total Fees Found
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <RefreshCw className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-card-foreground">
                  {doc.subscriptions_found || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Subscriptions
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-card-foreground">
                  {doc.unusual_activities || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Unusual Activities
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
                  <TrendingDown className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div className="font-heading text-2xl font-bold text-card-foreground">
                  ${doc.savings_identified?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Potential Savings
                </div>
              </div>
            </div>

            {/* Detailed Insights */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Fees */}
              {fees.length > 0 && (
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    Fees Identified
                  </h3>
                  <div className="space-y-3">
                    {fees.map((fee, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <span className="text-sm text-foreground">
                          {fee.name}
                        </span>
                        <span className="text-sm font-medium text-amber-500">
                          ${fee.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscriptions */}
              {subscriptions.length > 0 && (
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-500" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-3">
                    {subscriptions.map((sub, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <div>
                          <span className="text-sm text-foreground">
                            {sub.name}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {sub.frequency}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          ${sub.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patterns */}
              {patterns.length > 0 && (
                <div className="rounded-2xl border border-border p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-indigo-500" />
                    Spending Patterns
                  </h3>
                  <ul className="space-y-3">
                    {patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unusual Activity */}
              {unusual.length > 0 && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Unusual Activity
                  </h3>
                  <div className="space-y-3">
                    {unusual.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-red-500/10 last:border-0"
                      >
                        <div>
                          <p className="text-sm text-foreground">
                            {item.description}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <span className="text-sm font-medium text-red-500">
                          ${item.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
