"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  BarChart2,
  Check,
  Loader2,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/src/components/ui/dialog";

const SAMPLE = {
  filename: "Sample_Bank_Statement_2024.pdf",
  date: "March 1, 2024",
  summary: {
    totalFees: 147.5,
    subscriptions: 6,
    unusual: 2,
    savings: 89.99,
  },
  fees: [
    { name: "Monthly maintenance fee", amount: 14.99 },
    { name: "Out-of-network ATM fee (×3)", amount: 15.0 },
    { name: "Foreign transaction fee", amount: 8.5 },
    { name: "Overdraft protection fee", amount: 34.99 },
    { name: "Paper statement fee", amount: 3.0 },
    { name: "Wire transfer fee", amount: 25.0 },
    { name: "Returned payment fee", amount: 36.02 },
  ],
  subscriptions: [
    { name: "Netflix Premium", amount: 22.99, frequency: "monthly" },
    { name: "Spotify Family", amount: 16.99, frequency: "monthly" },
    { name: "Amazon Prime", amount: 14.99, frequency: "monthly" },
    { name: "Adobe Creative Cloud", amount: 54.99, frequency: "monthly" },
    { name: "Dropbox Plus", amount: 11.99, frequency: "monthly" },
    { name: "LinkedIn Premium", amount: 39.99, frequency: "monthly" },
  ],
  patterns: [
    "Weekend dining spending is 3× your weekday average",
    "Grocery spending increased 18% compared to last month",
    "Most subscriptions renew between the 1st–5th of the month",
    "Largest spending category: Dining & Entertainment at 31%",
  ],
  unusual: [
    {
      description: "Duplicate charge from Amazon Marketplace",
      amount: 79.99,
      date: "Mar 14, 2024",
    },
    {
      description: "Unrecognized international transaction",
      amount: 142.3,
      date: "Mar 22, 2024",
    },
  ],
};

const STEPS = [
  { label: "Uploading document", icon: Upload },
  { label: "Extracting transactions", icon: FileText },
  { label: "Generating insights", icon: BarChart2 },
];

export default function SampleDocumentModal() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"processing" | "results">("processing");
  const [step, setStep] = useState(0);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setPhase("processing");
      setStep(0);
    }
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!open) return;
    const t1 = setTimeout(() => setStep(1), 1000);
    const t2 = setTimeout(() => setStep(2), 2500);
    const t3 = setTimeout(() => setPhase("results"), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center px-7 py-3.5 text-[#1F2937] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all duration-150 text-base font-medium active:scale-[0.98]">
          <FileText className="mr-2 w-4 h-4 text-[#6B7280]" />
          Try a Sample Document
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 bg-white overflow-hidden">
        <DialogTitle className="sr-only">Sample Document Analysis</DialogTitle>
        <DialogDescription className="sr-only">
          Preview of Finsplain analysis results using a sample bank statement.
        </DialogDescription>

        {/* Processing phase */}
        {phase === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-full max-w-sm">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isComplete = i < step;
                const isActive = i === step;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 py-3.5 ${
                      i < STEPS.length - 1 ? "border-b border-[#F3F4F6]" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isComplete
                          ? "bg-[#10B981]/10"
                          : isActive
                            ? "bg-[#F59E0B]/10"
                            : "bg-[#F3F4F6]"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-[#10B981]" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-[#F59E0B] animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4 text-[#9CA3AF]" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isComplete
                          ? "text-[#10B981]"
                          : isActive
                            ? "text-[#1F2937]"
                            : "text-[#9CA3AF]"
                      }`}
                    >
                      {s.label}
                      {(isActive || isComplete) && "..."}
                    </span>
                    <span className="ml-auto text-xs">
                      {isComplete && (
                        <span className="text-[#10B981]">Done</span>
                      )}
                      {isActive && (
                        <span className="text-[#6B7280]">Working...</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-sm text-[#9CA3AF]">
              Analyzing {SAMPLE.filename}
            </p>
          </div>
        )}

        {/* Results phase */}
        {phase === "results" && (
          <div className="overflow-y-auto" style={{ maxHeight: "85vh" }}>
            {/* Demo banner */}
            <div className="bg-[#FFFBEB] border-b border-[#F59E0B]/30 px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-[#92400E]">
                <span className="font-semibold">Sample data</span> — this is
                what your analysis looks like. Sign up to analyze your own
                documents.
              </p>
              <Link
                href="/sign-up"
                className="flex-shrink-0 text-sm font-semibold text-[#92400E] underline underline-offset-2 hover:no-underline whitespace-nowrap"
              >
                Get started →
              </Link>
            </div>

            <div className="p-6">
              {/* Document header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-bold text-[#1F2937]">
                    {SAMPLE.filename}
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-0.5">
                    Uploaded {SAMPLE.date}
                  </p>
                </div>
                <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#10B981]/10 text-[#059669]">
                  Complete
                </span>
              </div>

              {/* Summary grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center mb-2">
                    <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <div className="font-heading text-xl font-bold text-[#1F2937]">
                    ${SAMPLE.summary.totalFees.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    Total Fees Found
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-2">
                    <RefreshCw className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div className="font-heading text-xl font-bold text-[#1F2937]">
                    {SAMPLE.summary.subscriptions}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    Subscriptions
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                  </div>
                  <div className="font-heading text-xl font-bold text-[#1F2937]">
                    {SAMPLE.summary.unusual}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    Unusual Activities
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-2">
                    <TrendingDown className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <div className="font-heading text-xl font-bold text-[#1F2937]">
                    ${SAMPLE.summary.savings.toFixed(2)}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-0.5">
                    Potential Savings
                  </div>
                </div>
              </div>

              {/* Detailed sections */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Fees */}
                <div className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-heading text-base font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#F59E0B]" />
                    Fees Identified
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.fees.map((fee, i) => (
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

                {/* Subscriptions */}
                <div className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-heading text-base font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#10B981]" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.subscriptions.map((sub, i) => (
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

                {/* Spending Patterns */}
                <div className="rounded-2xl border border-[#E5E7EB] p-5">
                  <h3 className="font-heading text-base font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-[#6366F1]" />
                    Spending Patterns
                  </h3>
                  <ul className="space-y-3">
                    {SAMPLE.patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-[#6B7280]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] mt-1.5 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unusual Activity */}
                <div className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-5">
                  <h3 className="font-heading text-base font-semibold text-[#1F2937] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                    Unusual Activity
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.unusual.map((item, i) => (
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
              </div>

              {/* Footer CTA */}
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
                <p className="text-sm text-[#6B7280] mb-4">
                  Ready to analyze your own financial documents?
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-7 py-3 text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all duration-150 text-base font-medium active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <p className="text-xs text-[#9CA3AF] mt-3">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
