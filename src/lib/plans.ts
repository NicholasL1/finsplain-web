export type PlanId = "starter" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  credits: number;
  maxPages: number;
  retention: string;
  features: string[];
  highlighted: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for occasional use — try FinSplain at no cost.",
    monthlyPrice: null,
    annualPrice: null,
    credits: 5,
    maxPages: 5,
    retention: "30 days",
    features: [
      "5 document credits / month",
      "Up to 5 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "30-day document history",
    ],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For individuals who review finances regularly.",
    monthlyPrice: 9.99,
    annualPrice: 8.33,
    credits: 30,
    maxPages: 10,
    retention: "90 days",
    features: [
      "30 document credits / month",
      "Up to 10 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "90-day document history",
      "PDF & CSV export",
      "Priority processing",
    ],
    highlighted: true,
  },
  {
    id: "business",
    name: "Business",
    description: "For power users, freelancers, and small teams.",
    monthlyPrice: 24.99,
    annualPrice: 20.83,
    credits: 100,
    maxPages: 10,
    retention: "1 year",
    features: [
      "100 document credits / month",
      "Up to 10 pages per document",
      "Full AI insights dashboard",
      "Spending breakdown & charts",
      "Fee & subscription detection",
      "1-year document history",
      "PDF & CSV export",
      "Priority processing",
      "Bulk upload (5 docs at once)",
      "Email alerts for fees & anomalies",
      "Dedicated support",
    ],
    highlighted: false,
  },
];

export const PLAN_MAP: Record<PlanId, Plan> = Object.fromEntries(
  PLANS.map((p) => [p.id, p])
) as Record<PlanId, Plan>;
