import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SampleDocumentModal from "@/src/components/SampleDocumentModal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-[40px] sm:text-[56px] lg:text-[64px] font-bold text-foreground mb-6 leading-[1.15] tracking-tight">
              Understand your finances,{" "}
              <span className="text-emerald-500">without the jargon</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any financial document and get clear, actionable insights
              about fees, subscriptions, spending patterns, and unusual
              activity — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-7 py-3.5 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 transition-all duration-150 text-base font-medium active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <SampleDocumentModal />
            </div>
          </div>

          {/* Subtle product preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-muted p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                    <span className="text-emerald-500 font-heading font-bold text-lg">
                      $
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-foreground">
                    $847
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Hidden fees found
                  </div>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                    <span className="text-amber-500 font-heading font-bold text-lg">
                      ↻
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-foreground">
                    12
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Active subscriptions
                  </div>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-3">
                    <span className="text-red-500 font-heading font-bold text-lg">
                      !
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-foreground">
                    3
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Unusual charges
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
