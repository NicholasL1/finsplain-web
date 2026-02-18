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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Back nav */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Documents
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-heading text-2xl font-bold text-[#1F2937]">
                {doc.filename}
              </h1>
              <StatusBadge status={doc.status} />
            </div>
            <p className="text-sm text-[#6B7280]">
              Uploaded {formatDate(doc.created_at)}
            </p>
          </div>
          <Link href="/dashboard/upload">
            <Button className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl px-5 h-10 text-sm font-medium">
              <Upload className="w-4 h-4 mr-2" />
              Upload Another
            </Button>
          </Link>
        </div>

        {doc.status === "processing" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-7 h-7 text-[#F59E0B] animate-spin" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#1F2937] mb-2">
              Analyzing your document...
            </h3>
            <p className="text-[#6B7280] text-sm">
              This usually takes less than 30 seconds. The page will update
              automatically.
            </p>
          </div>
        )}

        {doc.status === "error" && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-[#EF4444]" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-[#1F2937] mb-2">
              Analysis failed
            </h3>
            <p className="text-[#6B7280] text-sm mb-6">
              We couldn't process this document. Please try uploading again.
            </p>
            <Link href="/dashboard/upload">
              <Button className="bg-[#10B981] hover:bg-[#059669] text-white rounded-xl px-5 h-10 text-sm font-medium">
                Try Again
              </Button>
            </Link>
          </div>
        )}

        {doc.status === "complete" && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white">
                <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                  <DollarSign className="w-4.5 h-4.5 text-[#F59E0B]" />
                </div>
                <div className="font-heading text-2xl font-bold text-[#1F2937]">
                  ${doc.total_fees?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  Total Fees Found
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white">
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
                  <RefreshCw className="w-4.5 h-4.5 text-[#10B981]" />
                </div>
                <div className="font-heading text-2xl font-bold text-[#1F2937]">
                  {doc.subscriptions_found || 0}
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  Subscriptions
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white">
                <div className="w-9 h-9 rounded-lg bg-[#EF4444]/10 flex items-center justify-center mb-3">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#EF4444]" />
                </div>
                <div className="font-heading text-2xl font-bold text-[#1F2937]">
                  {doc.unusual_activities || 0}
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  Unusual Activities
                </div>
              </div>
              <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white">
                <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-3">
                  <TrendingDown className="w-4.5 h-4.5 text-[#10B981]" />
                </div>
                <div className="font-heading text-2xl font-bold text-[#1F2937]">
                  ${doc.savings_identified?.toFixed(2) || "0.00"}
                </div>
                <div className="text-xs text-[#6B7280] mt-0.5">
                  Potential Savings
                </div>
              </div>
            </div>

            {/* Detailed Insights */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Fees */}
              {fees.length > 0 && (
                <div className="rounded-2xl border border-[#E5E7EB] p-6">
                  <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#F59E0B]" />
                    Fees Identified
                  </h3>
                  <div className="space-y-3">
                    {fees.map((fee, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                      >
                        <span className="text-sm text-[#1F2937]">
                          {fee.name}
                        </span>
                        <span className="text-sm font-medium text-[#F59E0B]">
                          ${fee.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subscriptions */}
              {subscriptions.length > 0 && (
                <div className="rounded-2xl border border-[#E5E7EB] p-6">
                  <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#10B981]" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-3">
                    {subscriptions.map((sub, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-[#F3F4F6] last:border-0"
                      >
                        <div>
                          <span className="text-sm text-[#1F2937]">
                            {sub.name}
                          </span>
                          <span className="text-xs text-[#6B7280] ml-2">
                            {sub.frequency}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[#1F2937]">
                          ${sub.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patterns */}
              {patterns.length > 0 && (
                <div className="rounded-2xl border border-[#E5E7EB] p-6">
                  <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-[#6366F1]" />
                    Spending Patterns
                  </h3>
                  <ul className="space-y-3">
                    {patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-[#6B7280]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-2 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Unusual Activity */}
              {unusual.length > 0 && (
                <div className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-6">
                  <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
                    Unusual Activity
                  </h3>
                  <div className="space-y-3">
                    {unusual.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-[#EF4444]/10 last:border-0"
                      >
                        <div>
                          <p className="text-sm text-[#1F2937]">
                            {item.description}
                          </p>
                          <p className="text-xs text-[#6B7280]">{item.date}</p>
                        </div>
                        <span className="text-sm font-medium text-[#EF4444]">
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
