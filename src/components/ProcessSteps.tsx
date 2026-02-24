import { Upload, Brain, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Document",
    description:
      "Drag and drop any financial document — bank statements, credit card bills, investment reports, or loan agreements.",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Analysis",
    description:
      "Our engine scans every line, identifying fees, subscriptions, patterns, and anomalies that matter to you.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "Get Insights",
    description:
      "Receive a clear, jargon-free breakdown with actionable recommendations to save money and stay informed.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Three simple steps to transform your financial documents into clear
            insights.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative p-8 rounded-2xl border border-border bg-card hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="text-xs font-mono text-emerald-500 font-semibold mb-4">
                STEP {s.step}
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-card-foreground mb-3">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
