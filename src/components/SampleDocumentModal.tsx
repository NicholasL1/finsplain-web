"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

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
}

const STEPS = [
  { label: "Uploading document", icon: Upload },
  { label: "Extracting transactions", icon: FileText },
  { label: "Generating insights", icon: BarChart2 },
]

const SPENDING_CHART_DATA = [
  { month: "Oct", Dining: 420, Shopping: 280, Subscriptions: 162, Other: 190 },
  { month: "Nov", Dining: 380, Shopping: 450, Subscriptions: 162, Other: 210 },
  { month: "Dec", Dining: 520, Shopping: 680, Subscriptions: 162, Other: 280 },
  { month: "Jan", Dining: 350, Shopping: 220, Subscriptions: 162, Other: 175 },
  { month: "Feb", Dining: 440, Shopping: 310, Subscriptions: 162, Other: 195 },
  { month: "Mar", Dining: 580, Shopping: 340, Subscriptions: 162, Other: 225 },
]

export default function SampleDocumentModal() {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<"drag" | "processing" | "results">("drag")
  const [dragStage, setDragStage] = useState<"flying" | "hovering" | "dropped">(
    "flying"
  )
  const [cursorPos, setCursorPos] = useState({ x: 160, y: -50 })
  const [step, setStep] = useState(0)

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setPhase("drag")
      setDragStage("flying")
      setCursorPos({ x: 160, y: -50 })
      setStep(0)
    }
    setOpen(newOpen)
  }

  // Drag phase: cursor flies in, hovers, drops, then advances to processing
  useEffect(() => {
    if (!open || phase !== "drag") return
    const t1 = setTimeout(() => setCursorPos({ x: 0, y: 0 }), 200)
    const t2 = setTimeout(() => setDragStage("hovering"), 1600)
    const t3 = setTimeout(() => setDragStage("dropped"), 2400)
    const t4 = setTimeout(() => setPhase("processing"), 3200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [open, phase])

  // Processing phase: step through analysis steps then show results
  useEffect(() => {
    if (!open || phase !== "processing") return
    const t0 = setTimeout(() => setStep(0), 0)
    const t1 = setTimeout(() => setStep(1), 1000)
    const t2 = setTimeout(() => setStep(2), 2500)
    const t3 = setTimeout(() => setPhase("results"), 4000)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [open, phase])

  const isHovering = dragStage === "hovering" || dragStage === "dropped"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="text-foreground border-border hover:bg-accent inline-flex items-center rounded-xl border px-7 py-3.5 text-base font-medium transition-all duration-150 active:scale-[0.98]">
          <FileText className="text-muted-foreground mr-2 h-4 w-4" />
          Try a Sample Document
        </button>
      </DialogTrigger>

      <DialogContent className="bg-background w-full max-w-3xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Sample Document Analysis</DialogTitle>
        <DialogDescription className="sr-only">
          Preview of Finsplain analysis results using a sample bank statement.
        </DialogDescription>

        {/* Drag phase */}
        {phase === "drag" && (
          <div className="flex flex-col items-center justify-center px-8 py-14">
            <div className="relative w-full max-w-sm">
              {/* Drop zone */}
              <div
                className={`relative flex flex-col items-center rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
                  dragStage === "dropped"
                    ? "border-emerald-500 bg-emerald-500/5"
                    : isHovering
                      ? "scale-[1.02] border-emerald-400 bg-emerald-500/5"
                      : "border-border bg-muted/30"
                }`}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 ${
                    dragStage === "dropped" ? "bg-emerald-500/10" : "bg-muted"
                  }`}
                >
                  {dragStage === "dropped" ? (
                    <Check className="h-6 w-6 text-emerald-500" />
                  ) : (
                    <Upload
                      className={`h-6 w-6 transition-colors duration-300 ${
                        isHovering
                          ? "text-emerald-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </div>

                {dragStage === "dropped" ? (
                  <>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      File received!
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {SAMPLE.filename}
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className={`text-sm font-medium transition-colors duration-300 ${
                        isHovering
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground"
                      }`}
                    >
                      {isHovering ? "Release to upload" : "Drop your file here"}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      PDF, CSV, Excel, or image
                    </p>
                  </>
                )}
              </div>

              {/* Animated cursor + file chip */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(calc(-50% + ${cursorPos.x}px), calc(-50% + ${cursorPos.y}px))`,
                  transitionProperty:
                    dragStage === "flying" ? "transform, opacity" : "none",
                  transitionDuration: "1.3s",
                  transitionTimingFunction:
                    "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  zIndex: 20,
                  pointerEvents: "none",
                  opacity: dragStage === "dropped" ? 0 : 1,
                }}
              >
                {/* Mac-style pointer cursor */}
                <svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 2L3 19.5L7.5 15L10.5 22L13.5 21L10.5 14H17L3 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 2L3 19.5L7.5 15L10.5 22L13.5 21L10.5 14H17L3 2Z"
                    fill="#111827"
                  />
                </svg>

                {/* File chip dragged by cursor */}
                <div className="bg-card border-border absolute top-5 left-3 flex rotate-3 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 whitespace-nowrap shadow-md">
                  <FileText className="h-3 w-3 flex-shrink-0 text-red-500" />
                  <span className="text-foreground text-xs font-medium">
                    statement.pdf
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mt-8 text-sm">
              Drag and drop your file to begin
            </p>
          </div>
        )}

        {/* Processing phase */}
        {phase === "processing" && (
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <div className="w-full max-w-sm">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isComplete = i < step
                const isActive = i === step
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-4 py-3.5 ${
                      i < STEPS.length - 1 ? "border-border/50 border-b" : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        isComplete
                          ? "bg-emerald-500/10"
                          : isActive
                            ? "bg-amber-500/10"
                            : "bg-muted"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      ) : (
                        <Icon className="text-muted-foreground h-4 w-4" />
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
                        <span className="text-emerald-600 dark:text-emerald-400">
                          Done
                        </span>
                      )}
                      {isActive && (
                        <span className="text-muted-foreground">
                          Working...
                        </span>
                      )}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-muted-foreground mt-8 text-sm">
              Analyzing {SAMPLE.filename}
            </p>
          </div>
        )}

        {/* Results phase */}
        {phase === "results" && (
          <div className="overflow-y-auto" style={{ maxHeight: "85vh" }}>
            {/* Demo banner */}
            <div className="flex items-center justify-between gap-4 border-b border-amber-500/30 bg-amber-500/10 px-6 py-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Sample data</span> — this is
                what your analysis looks like. Sign up to analyze your own
                documents.
              </p>
              <Link
                href="/sign-up"
                className="flex-shrink-0 text-sm font-semibold whitespace-nowrap text-amber-800 underline underline-offset-2 hover:no-underline dark:text-amber-300"
              >
                Get started →
              </Link>
            </div>

            <div className="p-6">
              {/* Document header */}
              <div className="mb-6 flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-foreground text-lg font-bold">
                    {SAMPLE.filename}
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Uploaded {SAMPLE.date}
                  </p>
                </div>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Complete
                </span>
              </div>

              {/* Spending breakdown chart */}
              <div className="border-border mb-6 rounded-2xl border p-5">
                <h3 className="font-heading text-foreground mb-4 flex items-center gap-2 text-base font-semibold">
                  <BarChart2 className="h-4 w-4 text-indigo-500" />
                  Monthly Spending Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={SPENDING_CHART_DATA}
                    margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(0,0,0,0.06)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        backgroundColor: "#ffffff",
                        fontSize: "12px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [`$${value}`, undefined]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                    />
                    <Bar dataKey="Dining" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Shopping" stackId="a" fill="#6366f1" />
                    <Bar dataKey="Subscriptions" stackId="a" fill="#10b981" />
                    <Bar
                      dataKey="Other"
                      stackId="a"
                      fill="#94a3b8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary grid */}
              <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="font-heading text-foreground text-xl font-bold">
                    ${SAMPLE.summary.totalFees.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Total Fees Found
                  </div>
                </div>
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <RefreshCw className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="font-heading text-foreground text-xl font-bold">
                    {SAMPLE.summary.subscriptions}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Subscriptions
                  </div>
                </div>
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="font-heading text-foreground text-xl font-bold">
                    {SAMPLE.summary.unusual}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Unusual Activities
                  </div>
                </div>
                <div className="border-border bg-card rounded-2xl border p-4">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                    <TrendingDown className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="font-heading text-foreground text-xl font-bold">
                    ${SAMPLE.summary.savings.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    Potential Savings
                  </div>
                </div>
              </div>

              {/* Detailed sections */}
              <div className="grid gap-4 lg:grid-cols-2">
                {/* Fees */}
                <div className="border-border rounded-2xl border p-5">
                  <h3 className="font-heading text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
                    <DollarSign className="h-4 w-4 text-amber-500" />
                    Fees Identified
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.fees.map((fee, i) => (
                      <div
                        key={i}
                        className="border-border/50 flex items-center justify-between border-b py-2 last:border-0"
                      >
                        <span className="text-foreground text-sm">
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
                <div className="border-border rounded-2xl border p-5">
                  <h3 className="font-heading text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
                    <RefreshCw className="h-4 w-4 text-emerald-500" />
                    Active Subscriptions
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.subscriptions.map((sub, i) => (
                      <div
                        key={i}
                        className="border-border/50 flex items-center justify-between border-b py-2 last:border-0"
                      >
                        <div>
                          <span className="text-foreground text-sm">
                            {sub.name}
                          </span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            {sub.frequency}
                          </span>
                        </div>
                        <span className="text-foreground text-sm font-medium">
                          ${sub.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spending Patterns */}
                <div className="border-border rounded-2xl border p-5">
                  <h3 className="font-heading text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
                    <TrendingDown className="h-4 w-4 text-indigo-500" />
                    Spending Patterns
                  </h3>
                  <ul className="space-y-3">
                    {SAMPLE.patterns.map((pattern, i) => (
                      <li
                        key={i}
                        className="text-muted-foreground flex items-start gap-3 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Unusual Activity */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <h3 className="font-heading text-foreground mb-3 flex items-center gap-2 text-base font-semibold">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Unusual Activity
                  </h3>
                  <div className="space-y-1">
                    {SAMPLE.unusual.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-red-500/10 py-2 last:border-0"
                      >
                        <div>
                          <p className="text-foreground text-sm">
                            {item.description}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {item.date}
                          </p>
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
              <div className="border-border mt-8 border-t pt-6 text-center">
                <p className="text-muted-foreground mb-4 text-sm">
                  Ready to analyze your own financial documents?
                </p>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center rounded-xl bg-emerald-500 px-7 py-3 text-base font-medium text-white transition-all duration-150 hover:bg-emerald-600 active:scale-[0.98]"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <p className="text-muted-foreground mt-3 text-xs">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
