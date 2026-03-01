import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HowItWorksDemo from "@/src/components/HowItWorksDemo";

export default function Hero({ firstName }: { firstName?: string }) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-start">

            {/* Left column: headline + CTA */}
            <div className="max-w-xl lg:pt-10">
              {firstName && (
                <p className="text-sm font-medium text-emerald-500 mb-4 tracking-wide">
                  Welcome back, {firstName}!
                </p>
              )}
              <h1 className="font-heading text-[40px] sm:text-[52px] lg:text-[52px] font-bold text-foreground mb-6 leading-[1.15] tracking-tight">
                Understand your finances,{" "}
                <span className="text-emerald-500">without the jargon</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed">
                Upload any financial document and get clear, actionable insights
                about fees, subscriptions, spending patterns, and unusual
                activity — in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {firstName ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Right column: inline animated demo */}
            <div className="w-full lg:pt-10">
              <HowItWorksDemo compact />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
