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
        <button className="inline-flex items-center px-7 py-3.5 text-foreground border border-border rounded-xl hover:bg-accent transition-all duration-150 text-base font-medium active:scale-[0.98]">
          <FileText className="mr-2 w-4 h-4 text-muted-foreground" />
          Try a Sample Document
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 bg-background overflow-hidden">
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
                      i < STEPS.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isComplete
                          ? "bg-emerald-500/10"
                          : isActive
                            ? "bg-amber-500/10"
                            : "bg-muted"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isComplete
                          ? "text-emerald-600 dark:text-emerald-400"
                          : isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                      {(isActive || isComplete) && "..."}
                    </span>
                    <span className="ml-auto text-xs">
                      {isComplete && (
                        <span className="text-emerald-600 dark:text-emerald-400">Done</span>
                      )}
                      {isActive && (
                        <span className="text-muted-foreground">Working...</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Analyzing {SAMPLE.filename}
            </p>
          </div>
        )}

        {/* Results phase */}
        {phase === "results" && (
          <div className="overflow-y-auto" style={{ maxHeight: "85vh" }}>
            {/* Demo banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Sample data</span> — this is
                what your analysis looks like. Sign up to analyze your own
                documents.
              </p>
              <Link
                href="/sign-up"
                className="flex-shrink-0 text-sm font-semibold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:no-underline whitespace-nowrap"
              >
                Get started →
              </Link>
            </div>

            <div className="p-6">
              {/* Document header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {SAMPLE.filename}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Uploaded {SAMPLE.date}
                  </p>
                </div>
                <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Complete
                </span>
              </div>

              {/* Summary grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="p-4 rounded-2xl border border-border bg-card">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    ${SAMPLE.summary.totalFees.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Total Fees Found
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {SAMPLE.summary.subscriptions}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Subscriptions
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    {SAMPLE.summary.unusual}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Unusual Activities
                  </div>
                </div>
                <div className="p-4 rounded-2xl border border-border bg-card">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="font-heading text-xl font-bold text-foreground">
                    ${SAMPLE.summary.savings.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Potential Savings
                  </div>
                </div>
              </div>

              {/* Detailed sections */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* Fees */}
                <div className="rounded-2xl border border-border p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-500" />
                    Fees Identified
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.fees.map((fee, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                      >
                        <span className="text-sm text-foreground">
                          {fee.name}
                        </span>
                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                          ${fee.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscriptions */}
                <div className="rounded-2xl border border-border p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-500" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.subscriptions.map((sub, i) => (
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

                {/* Spending Patterns */}
                <div className="rounded-2xl border border-border p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-indigo-500" />
                    Spending Patterns
                  </h3>
                  <ul className="space-y-3">
                    {SAMPLE.patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unusual Activity */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Unusual Activity
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.unusual.map((item, i) => (
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
              </div>

              {/* Footer CTA */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to analyze your own financial documents?
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center px-7 py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <p className="text-xs text-muted-foreground mt-3">
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
