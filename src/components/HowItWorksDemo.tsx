"use client";

import { useState, useEffect, useRef } from "react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

const SPENDING_CHART_DATA = [
  { month: "Oct", Dining: 420, Shopping: 280, Subscriptions: 162, Other: 190 },
  { month: "Nov", Dining: 380, Shopping: 450, Subscriptions: 162, Other: 210 },
  { month: "Dec", Dining: 520, Shopping: 680, Subscriptions: 162, Other: 280 },
  { month: "Jan", Dining: 350, Shopping: 220, Subscriptions: 162, Other: 175 },
  { month: "Feb", Dining: 440, Shopping: 310, Subscriptions: 162, Other: 195 },
  { month: "Mar", Dining: 580, Shopping: 340, Subscriptions: 162, Other: 225 },
];

interface HowItWorksDemoProps {
  /** Compact mode: shows chart + summary grid only in results (no detail lists). Use inside Hero. */
  compact?: boolean;
}

export default function HowItWorksDemo({ compact = false }: HowItWorksDemoProps) {
  const [phase, setPhase] = useState<"idle" | "drag" | "processing" | "results">("idle");
  const [dragStage, setDragStage] = useState<"flying" | "hovering" | "dropped">("flying");
  const [cursorPos, setCursorPos] = useState({ x: 160, y: -50 });
  const [step, setStep] = useState(0);
  const [browserExpanding, setBrowserExpanding] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggeredRef = useRef(false);

  const startAnimation = () => {
    triggeredRef.current = true;
    setDragStage("flying");
    setCursorPos({ x: 160, y: -50 });
    setStep(0);
    setBrowserExpanding(false);
    setResultsVisible(false);
    setPhase("drag");
  };

  // IntersectionObserver: auto-play when scrolled into view, reset when fully out
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggeredRef.current) {
          startAnimation();
        } else if (!entry.isIntersecting) {
          triggeredRef.current = false;
          setPhase("idle");
          setDragStage("flying");
          setCursorPos({ x: 160, y: -50 });
          setStep(0);
          setBrowserExpanding(false);
          setResultsVisible(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
     
  }, []);

  // Drag phase: cursor flies in, hovers, drops, then advances to processing
  useEffect(() => {
    if (phase !== "drag") return;
    const t1 = setTimeout(() => setCursorPos({ x: 0, y: 0 }), 200);
    const t2 = setTimeout(() => setDragStage("hovering"), 1600);
    const t3 = setTimeout(() => setDragStage("dropped"), 2400);
    const t4 = setTimeout(() => setPhase("processing"), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase]);

  // Processing phase: step through analysis steps, expand browser, then show results
  useEffect(() => {
    if (phase !== "processing") return;
    const t0 = setTimeout(() => setStep(0), 0);
    const t1 = setTimeout(() => setStep(1), 1000);
    const t2 = setTimeout(() => setStep(2), 2500);
    const t3 = setTimeout(() => setBrowserExpanding(true), 3300); // begin smooth expansion
    const t4 = setTimeout(() => setPhase("results"), 4000);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase]);

  // Fade in results content after the container has had time to expand
  useEffect(() => {
    if (phase !== "results") {
      const t = setTimeout(() => setResultsVisible(false), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setResultsVisible(true), 100);
    return () => clearTimeout(t);
  }, [phase]);

  const isHovering = dragStage === "hovering" || dragStage === "dropped";
  const isExpanded = browserExpanding || phase === "results";

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: isExpanded ? "700px" : "420px",
        transition: "min-height 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className="rounded-2xl border border-border bg-background shadow-[0_1px_3px_rgba(0,0,0,0.07)] overflow-hidden"
    >
      {/* Faux browser bar */}
      <div className="bg-muted/60 border-b border-border px-4 py-2.5 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400/60" />
          <span className="w-3 h-3 rounded-full bg-amber-400/60" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
        </div>
        <div className="flex-1 bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground/70 text-center max-w-xs mx-auto">
          finsplain.net/upload
        </div>
      </div>

      {/* Drag / idle phase */}
      {(phase === "idle" || phase === "drag") && (
        <div className="flex flex-col items-center justify-center py-16 px-10 h-full">
          <div className="w-full max-w-md relative">
            {/* Drop zone */}
            <div
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center text-center ${
                dragStage === "dropped"
                  ? "border-emerald-500 bg-emerald-500/5"
                  : isHovering
                  ? "border-emerald-400 bg-emerald-500/5 scale-[1.02]"
                  : "border-border bg-muted/30"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  dragStage === "dropped" ? "bg-emerald-500/10" : "bg-muted"
                }`}
              >
                {dragStage === "dropped" ? (
                  <Check className="w-7 h-7 text-emerald-500" />
                ) : (
                  <Upload
                    className={`w-7 h-7 transition-colors duration-300 ${
                      isHovering ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>

              {dragStage === "dropped" ? (
                <>
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    File received!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{SAMPLE.filename}</p>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, CSV, Excel, or image
                  </p>
                </>
              )}
            </div>

            {/* Animated cursor + file chip — only during drag phase */}
            {phase === "drag" && (
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
                <div className="absolute top-5 left-3 bg-card border border-border rounded-lg shadow-md px-2.5 py-1.5 flex items-center gap-1.5 rotate-3 whitespace-nowrap">
                  <FileText className="w-3 h-3 text-red-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground">statement.pdf</span>
                </div>
              </div>
            )}
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            {phase === "idle"
              ? "Your financial documents, analyzed instantly"
              : "Drag and drop your file to begin"}
          </p>
        </div>
      )}

      {/* Processing phase */}
      {phase === "processing" && (
        <div className="flex flex-col items-center justify-center py-14 px-10 h-full">
          <div className="w-full max-w-md">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isComplete = i < step;
              const isActive = i === step;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 py-4 ${
                    i < STEPS.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isComplete
                        ? "bg-emerald-500/10"
                        : isActive
                        ? "bg-amber-500/10"
                        : "bg-muted"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="w-5 h-5 text-emerald-500" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <span
                    className={`text-base font-medium ${
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
                  <span className="ml-auto text-sm">
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
          <p className="mt-10 text-sm text-muted-foreground">
            Analyzing {SAMPLE.filename}
          </p>
        </div>
      )}

      {/* Results phase */}
      {phase === "results" && (
        <div
          style={{
            opacity: resultsVisible ? 1 : 0,
            transition: "opacity 0.45s ease",
          }}
        >
          {/* Demo banner */}
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-5 py-2.5 flex items-center justify-between gap-3">
            <p className={`text-amber-800 dark:text-amber-300 ${compact ? "text-xs" : "text-sm"}`}>
              <span className="font-semibold">Sample data</span>
              {compact
                ? " — sign up to analyze your own."
                : " — this is what your analysis looks like. Sign up to analyze your own documents."}
            </p>
            <Link
              href="/sign-up"
              className={`flex-shrink-0 font-semibold text-amber-800 dark:text-amber-300 underline underline-offset-2 hover:no-underline whitespace-nowrap ${compact ? "text-xs" : "text-sm"}`}
            >
              Get started →
            </Link>
          </div>

          <div className={compact ? "p-5" : "p-6"}>
            {/* Document header */}
            <div className="flex items-start gap-3 mb-5">
              <div className="flex-1 min-w-0">
                <h3 className={`font-heading font-bold text-foreground truncate ${compact ? "text-base" : "text-lg"}`}>
                  {SAMPLE.filename}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uploaded {SAMPLE.date}
                </p>
              </div>
              <span className="flex-shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Complete
              </span>
            </div>

            {/* Spending breakdown chart */}
            <div className={`rounded-2xl border border-border mb-5 ${compact ? "p-4" : "p-5"}`}>
              <h3 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Monthly Spending Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={compact ? 200 : 220}>
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
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Bar dataKey="Dining" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Shopping" stackId="a" fill="#6366f1" />
                  <Bar dataKey="Subscriptions" stackId="a" fill="#10b981" />
                  <Bar dataKey="Other" stackId="a" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary grid */}
            <div className={`grid grid-cols-2 gap-3 ${compact ? "mb-5" : "lg:grid-cols-4 gap-3 mb-6"}`}>
              <div className="p-3.5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4 text-amber-500" />
                </div>
                <div className="font-heading text-xl font-bold text-foreground">
                  ${SAMPLE.summary.totalFees.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Total Fees Found</div>
              </div>
              <div className="p-3.5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="font-heading text-xl font-bold text-foreground">
                  {SAMPLE.summary.subscriptions}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Subscriptions</div>
              </div>
              <div className="p-3.5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="font-heading text-xl font-bold text-foreground">
                  {SAMPLE.summary.unusual}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Unusual Activities</div>
              </div>
              <div className="p-3.5 rounded-2xl border border-border bg-card">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="font-heading text-xl font-bold text-foreground">
                  ${SAMPLE.summary.savings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Potential Savings</div>
              </div>
            </div>

            {/* Detailed sections — full mode only */}
            {!compact && (
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
                        <span className="text-sm text-foreground">{fee.name}</span>
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
                          <span className="text-sm text-foreground">{sub.name}</span>
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
                          <p className="text-sm text-foreground">{item.description}</p>
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
            )}

            {/* CTA */}
            <div className={`border-t border-border text-center ${compact ? "mt-5 pt-5" : "mt-8 pt-6"}`}>
              {!compact && (
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to analyze your own financial documents?
                </p>
              )}
              <Link
                href="/sign-up"
                className={`inline-flex items-center text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 font-medium active:scale-[0.98] ${
                  compact ? "px-5 py-2.5 text-sm" : "px-7 py-3 text-base"
                }`}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              {!compact && (
                <p className="text-xs text-muted-foreground mt-3">No credit card required</p>
              )}
              <button
                onClick={startAnimation}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors block mx-auto"
              >
                ↺ Watch again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
