import {
  DollarSign,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: DollarSign,
    iconColor: "#F59E0B",
    iconBgClass: "bg-amber-500/10",
    title: "Hidden Fee Detection",
    description:
      "Every maintenance charge, ATM fee, and transfer cost — surfaced automatically so nothing slips past you.",
  },
  {
    icon: RefreshCw,
    iconColor: "#6366F1",
    iconBgClass: "bg-indigo-500/10",
    title: "Subscription Tracking",
    description:
      "All recurring charges in one view. Spot forgotten trials and unused services before the next billing cycle.",
  },
  {
    icon: TrendingUp,
    iconColor: "#10B981",
    iconBgClass: "bg-emerald-500/10",
    title: "Spending Patterns",
    description:
      "Category breakdowns and month-over-month trends — without reading a single line of raw transaction data.",
  },
  {
    icon: AlertTriangle,
    iconColor: "#EF4444",
    iconBgClass: "bg-red-500/10",
    title: "Anomaly Alerts",
    description:
      "Duplicate charges and unrecognized transactions are flagged before they turn into bigger problems.",
  },
]

const stats = [
  { label: "Fees found", value: "$147.50", color: "#F59E0B" },
  { label: "Subscriptions", value: "6 active", color: "#6366F1" },
  { label: "Unusual activity", value: "2 flagged", color: "#EF4444" },
  { label: "Savings identified", value: "$89.99", color: "#10B981" },
]

const insights = [
  { dot: "#F59E0B", text: "Monthly maintenance fee · $14.99" },
  { dot: "#6366F1", text: "Adobe Creative Cloud · $54.99/mo" },
  { dot: "#10B981", text: "Grocery spending below area average" },
  { dot: "#EF4444", text: "Duplicate charge from online retailer · $79.99" },
]

export default function FeatureShowcase() {
  return (
    <section className="py-20 sm:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Financial clarity, visualized
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            FinSplain turns pages of transactions into a clean summary you can
            actually act on — in under 30 seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Feature list */}
          <div className="space-y-7">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${f.iconBgClass}`}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.iconColor }} />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mock dashboard card */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Sample_Bank_Statement_2024.pdf
                  </p>
                  <p className="text-sm font-semibold text-card-foreground mt-0.5">
                    Analysis complete
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Complete
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-px bg-border border-b border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p
                    className="font-heading font-semibold text-sm mt-0.5"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Insights list */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Top insights
              </p>
              {insights.map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.dot }}
                  />
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
