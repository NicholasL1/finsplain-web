import { Shield, Lock, Eye, Trash2, Server, FileCheck } from "lucide-react";

const principles = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description:
      "Your documents are encrypted in transit and at rest using AES-256 encryption. We never store raw document data.",
  },
  {
    icon: Eye,
    title: "No Data Selling",
    description:
      "We will never sell, share, or monetize your financial data. Your information is yours alone.",
  },
  {
    icon: Trash2,
    title: "Auto-Delete Option",
    description:
      "Set documents to auto-delete after analysis, or keep them for future reference. You control the retention.",
  },
  {
    icon: Server,
    title: "SOC 2 Compliant",
    description:
      "Our infrastructure meets SOC 2 Type II standards with regular third-party audits and penetration testing.",
  },
  {
    icon: FileCheck,
    title: "Minimal Data Collection",
    description:
      "We only collect what's needed to analyze your documents. No tracking, no profiling, no unnecessary data.",
  },
  {
    icon: Shield,
    title: "Open Security Policy",
    description:
      "Our security practices are transparent and documented. We believe trust is built through openness.",
  },
];

export default function PrivacyPrinciples() {
  return (
    <section className="py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Privacy, Our Priority
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            We built FinSplain with privacy as a foundational principle, not an
            afterthought.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {principles.map((p) => (
            <div
              key={p.title}
              className="p-6 rounded-2xl border border-border bg-card hover:-translate-y-0.5 transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <p.icon className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-card-foreground mb-2">
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
