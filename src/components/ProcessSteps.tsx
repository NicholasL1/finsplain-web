"use client";

import { Upload, Brain, BarChart3 } from "lucide-react";
import AnimateOnScroll from "@/src/components/AnimateOnScroll";
import HowItWorksDemo from "@/src/components/HowItWorksDemo";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Document",
    description:
      "Drag and drop any financial document — bank statements, credit card bills, or pay stubs.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    description:
      "Our engine scans every line, identifying fees, subscriptions, patterns, and anomalies.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Insights",
    description:
      "Receive a clear, jargon-free breakdown with actionable recommendations to save money.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-20 sm:py-28 bg-linear-to-b from-background via-muted to-background dark:via-muted/35 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column: text explanation */}
          <div>
            <AnimateOnScroll direction="up">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-lg">
                Three simple steps to transform your financial documents into
                clear, actionable insights. No finance degree required.
              </p>
            </AnimateOnScroll>

            <div className="space-y-6">
              {steps.map((s, index) => (
                <AnimateOnScroll key={s.step} direction="left" delay={index * 0.1}>
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-emerald-500 font-semibold mb-1">
                        STEP {s.step}
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {s.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>

          {/* Right column: interactive demo */}
          <AnimateOnScroll direction="right" className="w-full">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/5 to-indigo-500/5 blur-xl -z-10"
                aria-hidden="true"
              />
              <HowItWorksDemo compact fixedHeight />
            </div>
          </AnimateOnScroll>

        </div>
      </div>
    </section>
  );
}
