import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import ProcessSteps from "@/src/components/ProcessSteps";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="font-heading text-[40px] sm:text-[48px] font-bold text-[#1F2937] mb-4 leading-tight tracking-tight">
            How FinSplain Works
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            From upload to insight in under 30 seconds. No sign-up required to
            try it out.
          </p>
        </div>
      </section>

      <ProcessSteps />

      {/* Detail Cards */}
      <section className="py-20 sm:py-24 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1F2937] mb-12 text-center">
            What We Analyze
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Hidden Fees",
                description:
                  "We scan every line for maintenance fees, ATM charges, wire transfer costs, and other fees that banks bury in the fine print.",
                color: "#F59E0B",
              },
              {
                title: "Active Subscriptions",
                description:
                  "Identify every recurring charge — from streaming services to gym memberships — so you know exactly where your money goes each month.",
                color: "#10B981",
              },
              {
                title: "Spending Patterns",
                description:
                  "Understand your spending habits with clear breakdowns by category, time period, and trend analysis compared to previous periods.",
                color: "#6366F1",
              },
              {
                title: "Unusual Activity",
                description:
                  "Flag duplicate charges, unrecognized transactions, and anomalies that could indicate errors or unauthorized access.",
                color: "#EF4444",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-[#E5E7EB] bg-white"
              >
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ backgroundColor: item.color }}
                />
                <h3 className="font-heading text-lg font-semibold text-[#1F2937] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-[#1F2937] mb-4">
            Ready to try it?
          </h2>
          <p className="text-[#6B7280] mb-8 max-w-md mx-auto text-base leading-relaxed">
            Sign up in seconds and upload your first document. No credit card
            required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-7 py-3.5 text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all duration-150 text-base font-medium active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center px-7 py-3.5 text-[#1F2937] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all duration-150 text-base font-medium"
            >
              <Shield className="mr-2 w-4 h-4 text-[#6B7280]" />
              View Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
