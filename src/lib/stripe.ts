import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export const PRICE_IDS = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL!,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY!,
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL!,
  },
} as const;

/** Map a Stripe Price ID back to a FinSplain plan slug. */
export function planFromPriceId(priceId: string): "pro" | "business" | "starter" {
  const all = [
    { id: process.env.STRIPE_PRICE_PRO_MONTHLY, plan: "pro" as const },
    { id: process.env.STRIPE_PRICE_PRO_ANNUAL, plan: "pro" as const },
    { id: process.env.STRIPE_PRICE_BUSINESS_MONTHLY, plan: "business" as const },
    { id: process.env.STRIPE_PRICE_BUSINESS_ANNUAL, plan: "business" as const },
  ];
  return all.find((p) => p.id === priceId)?.plan ?? "starter";
}

/** Credits granted per plan. Keep in sync with src/lib/plans.ts. */
export const PLAN_CREDITS: Record<string, number> = {
  starter: 5,
  pro: 30,
  business: 100,
};
