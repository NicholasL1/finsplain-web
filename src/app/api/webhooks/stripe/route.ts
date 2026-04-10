import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe, planFromPriceId, PLAN_CREDITS } from "@/src/lib/stripe";
import { createClient } from "@/supabase/server";

// Next.js App Router: disable body parsing so we can verify the raw signature
export const config = { api: { bodyParser: false } };

async function getUserIdFromCustomer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  customerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();
  return data?.id ?? null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    // ── User completed checkout ──────────────────────────────────────────────
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      const subscriptionId = session.subscription as string;

      if (!userId || !subscriptionId) break;

      // Retrieve subscription to get the price ID
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = planFromPriceId(priceId);
      const credits = PLAN_CREDITS[plan] ?? 5;

      await supabase
        .from("users")
        .update({
          plan,
          stripe_subscription_id: subscriptionId,
          stripe_price_id: priceId,
          subscription_status: "active",
          credits_remaining: credits,
          credits_used: 0,
          credits_reset_at: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    // ── Plan changed, renewed, trial ended ──────────────────────────────────
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const userId = await getUserIdFromCustomer(supabase, customerId);
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id ?? "";
      const plan = planFromPriceId(priceId);
      const credits = PLAN_CREDITS[plan] ?? 5;
      const status = subscription.status; // active | past_due | canceled | trialing

      await supabase
        .from("users")
        .update({
          plan,
          stripe_price_id: priceId,
          stripe_subscription_id: subscription.id,
          subscription_status: status,
          credits_remaining: credits,
          credits_reset_at: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    // ── Subscription cancelled ───────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const userId = await getUserIdFromCustomer(supabase, customerId);
      if (!userId) break;

      await supabase
        .from("users")
        .update({
          plan: "starter",
          stripe_subscription_id: null,
          stripe_price_id: null,
          subscription_status: "canceled",
          credits_remaining: PLAN_CREDITS.starter,
          credits_used: 0,
          credits_reset_at: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            1
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    // ── Successful invoice = monthly credit reset ────────────────────────────
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      // Only act on subscription renewals, not the initial checkout invoice
      // (checkout.session.completed already handles the first payment)
      if (invoice.billing_reason !== "subscription_cycle") break;

      const customerId = invoice.customer as string;
      const userId = await getUserIdFromCustomer(supabase, customerId);
      if (!userId) break;

      const { data: profile } = await supabase
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single();

      const plan = (profile?.plan as string) ?? "starter";
      const credits = PLAN_CREDITS[plan] ?? 5;

      // Derive next reset date from the invoice period end
      const periodEnd = (invoice as Stripe.Invoice & { lines: { data: Array<{ period: { end: number } }> } })
        .lines.data[0]?.period?.end;

      await supabase
        .from("users")
        .update({
          credits_used: 0,
          credits_remaining: credits,
          subscription_status: "active",
          credits_reset_at: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    // ── Payment failed ───────────────────────────────────────────────────────
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;
      const userId = await getUserIdFromCustomer(supabase, customerId);
      if (!userId) break;

      await supabase
        .from("users")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      break;
    }

    default:
      // Unhandled event — return 200 so Stripe doesn't retry
      break;
  }

  return NextResponse.json({ received: true });
}
