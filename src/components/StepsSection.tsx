"use client";

import { motion } from "motion/react";
import {
  Upload,
  BarChart2,
  AlertTriangle,
  Check,
  Loader2,
  DollarSign,
  RefreshCw,
  TrendingDown,
  Lock,
} from "lucide-react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";

// ─── Step 01 visual: supported formats chip cloud ─────────────────────────────

function UploadVisual() {
  const formats = [
    { label: "PDF", accent: true },
    { label: "CSV", accent: false },
    { label: "Excel", accent: true },
    { label: "JPEG / PNG", accent: false },
    { label: "Bank Statement", accent: false },
    { label: "Credit Card Bill", accent: false },
    { label: "Investment Report", accent: false },
    { label: "Loan Agreement", accent: false },
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Upload icon with radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        <div
          className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl scale-150 pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
          <Upload className="w-7 h-7 text-emerald-500" />
        </div>
      </motion.div>

      {/* Format chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formats.map((fmt, i) => (
          <motion.span
            key={fmt.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
              fmt.accent
                ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400"
                : "border-border bg-muted/80 text-muted-foreground"
            }`}
          >
            {fmt.label}
          </motion.span>
        ))}
      </div>

      {/* Security badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.65 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-xs text-muted-foreground"
      >
        <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
        Bank-level encryption on every upload
      </motion.div>
    </div>
  );
}

// ─── Step 02 visual: processing browser chrome ───────────────────────────────

function BrowserChrome({ url }: { readonly url: string }) {
  return (
    <div className="bg-muted/60 border-b border-border px-4 py-2.5 flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
      </div>
      <div className="flex-1 bg-background/80 rounded-md px-3 py-1 text-xs text-muted-foreground/70 text-center max-w-[200px] mx-auto">
        {url}
      </div>
    </div>
  );
}

function ProcessingVisual() {
  const steps = [
    { label: "Uploading document", done: true, active: false },
    { label: "Extracting transactions", done: false, active: true },
    { label: "Generating insights", done: false, active: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
    >
      <BrowserChrome url="finsplain.net/upload" />
      <div className="p-8">
        <p className="text-xs text-muted-foreground mb-6 text-center">
          Analyzing Sample_Bank_Statement_2024.pdf
        </p>
        <div className="space-y-1">
          {steps.map((s, i) => {
            let iconBg = "bg-muted";
            if (s.done) iconBg = "bg-emerald-500/10";
            else if (s.active) iconBg = "bg-amber-500/10";

            let labelClass = "text-muted-foreground";
            if (s.done) labelClass = "text-emerald-600 dark:text-emerald-400";
            else if (s.active) labelClass = "text-foreground";

            let stepIcon = <BarChart2 className="w-5 h-5 text-muted-foreground" />;
            if (s.done) stepIcon = <Check className="w-5 h-5 text-emerald-500" />;
            else if (s.active) stepIcon = <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />;

            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.1 }}
                className={`flex items-center gap-4 py-4 ${i < steps.length - 1 ? "border-b border-border/50" : ""}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                  {stepIcon}
                </div>
                <span className={`text-sm font-medium ${labelClass}`}>
                  {s.label}
                </span>
                <span className="ml-auto text-xs">
                  {s.done && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Done
                    </span>
                  )}
                  {s.active && (
                    <span className="text-muted-foreground">Working...</span>
                  )}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 03 visual: result metric cards ─────────────────────────────────────

function ResultsVisual() {
  const metrics = [
    {
      Icon: DollarSign,
      value: "$147.50",
      label: "in hidden fees found",
      colorClass: "border-amber-500/25 bg-amber-500/6",
      iconClass: "bg-amber-500/12 text-amber-500",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      Icon: RefreshCw,
      value: "6 active",
      label: "subscriptions identified",
      colorClass: "border-emerald-500/25 bg-emerald-500/6",
      iconClass: "bg-emerald-500/12 text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      Icon: AlertTriangle,
      value: "2 flagged",
      label: "unusual transactions",
      colorClass: "border-red-500/25 bg-red-500/6",
      iconClass: "bg-red-500/12 text-red-500",
      valueClass: "text-red-600 dark:text-red-400",
    },
    {
      Icon: TrendingDown,
      value: "$89.99",
      label: "in potential savings",
      colorClass: "border-emerald-500/25 bg-emerald-500/6",
      iconClass: "bg-emerald-500/12 text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 py-2">
      {metrics.map((m, i) => {
        const { Icon } = m;
        return (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.08 + i * 0.1 }}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border ${m.colorClass}`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconClass}`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className={`text-base font-bold font-heading ${m.valueClass}`}>
                {m.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {m.label}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Steps data ───────────────────────────────────────────────────────────────

type VisualKey = "upload" | "analysis" | "results";

type StepData = {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly bullets: readonly string[];
  readonly visualKey: VisualKey;
  readonly flip: boolean;
};

const STEPS: StepData[] = [
  {
    number: "01",
    title: "Upload Your Document",
    description:
      "Drag and drop any financial document — bank statements, credit card bills, investment reports, or loan agreements. We support any format.",
    bullets: [
      "Any format — PDF, CSV, Excel, or images",
      "Encrypted in transit and at rest",
      "Deleted from servers after processing",
    ],
    visualKey: "upload",
    flip: false,
  },
  {
    number: "02",
    title: "AI Scans Every Line",
    description:
      "Our engine reads your document the same way a financial expert would — line by line, categorizing every transaction and flagging what matters.",
    bullets: [
      "OCR extracts text from any document format",
      "AI categorizes every transaction automatically",
      "Pattern analysis across time periods",
    ],
    visualKey: "analysis",
    flip: true,
  },
  {
    number: "03",
    title: "Receive Clear Insights",
    description:
      "Get a jargon-free summary with actionable findings — hidden fees, subscriptions, unusual activity, and savings potential — all in one place.",
    bullets: [
      "Hidden fees surfaced and explained",
      "All subscriptions in one view",
      "Unusual activity flagged for review",
    ],
    visualKey: "results",
    flip: false,
  },
];

function getVisual(key: VisualKey) {
  if (key === "upload") return <UploadVisual />;
  if (key === "analysis") return <ProcessingVisual />;
  return <ResultsVisual />;
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function StepsSection() {
  return (
    <section className="py-16 sm:py-20 relative">
      {/* Ambient orbs — extend beyond section edges intentionally for cross-section blending */}
      <div
        className="absolute top-0 -left-40 w-[480px] h-[480px] rounded-full bg-emerald-500/6 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 -right-48 w-[400px] h-[400px] rounded-full bg-indigo-500/6 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 max-w-5xl relative">
        <div className="space-y-24 sm:space-y-32">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
            >
              {/* Visual card — slides in from the inner edge */}
              <AnimateOnScroll
                direction={step.flip ? "right" : "left"}
                delay={0.05}
                className={
                  step.flip ? "order-2 lg:order-2" : "order-2 lg:order-1"
                }
              >
                <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl shadow-black/4 dark:shadow-black/20 relative overflow-hidden">
                  {/* Subtle inner gradient tint */}
                  <div
                    className="absolute inset-0 bg-linear-to-br from-emerald-500/3 via-transparent to-indigo-500/3 pointer-events-none"
                    aria-hidden="true"
                  />
                  <div className="relative">{getVisual(step.visualKey)}</div>
                </div>
              </AnimateOnScroll>

              {/* Text — slides in from the outer edge */}
              <AnimateOnScroll
                direction={step.flip ? "left" : "right"}
                delay={0.1}
                className={
                  step.flip ? "order-1 lg:order-1" : "order-1 lg:order-2"
                }
              >
                <div className="text-xs font-mono text-emerald-500 font-semibold mb-4 tracking-widest">
                  STEP {step.number}
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {step.title}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-emerald-500" />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
