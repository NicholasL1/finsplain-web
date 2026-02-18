import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-[40px] sm:text-[56px] lg:text-[64px] font-bold text-[#1F2937] mb-6 leading-[1.15] tracking-tight">
              Understand your finances,{" "}
              <span className="text-[#10B981]">without the jargon</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
              Upload any financial document and get clear, actionable insights
              about fees, subscriptions, spending patterns, and unusual
              activity — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-7 py-3.5 text-white bg-[#10B981] rounded-xl hover:bg-[#059669] transition-all duration-150 text-base font-medium active:scale-[0.98]"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <Link
                href="/how-it-works"
                className="inline-flex items-center px-7 py-3.5 text-[#1F2937] border border-[#E5E7EB] rounded-xl hover:bg-[#F9FAFB] transition-all duration-150 text-base font-medium"
              >
                <FileText className="mr-2 w-4 h-4 text-[#6B7280]" />
                Try a Sample Document
              </Link>
            </div>
          </div>

          {/* Subtle product preview */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <span className="text-[#10B981] font-heading font-bold text-lg">
                      $
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-[#1F2937]">
                    $847
                  </div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Hidden fees found
                  </div>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                    <span className="text-[#F59E0B] font-heading font-bold text-lg">
                      ↻
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-[#1F2937]">
                    12
                  </div>
                  <div className="text-sm text-[#6B7280] mt-1">
                    Active subscriptions
                  </div>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center mb-3">
                    <span className="text-[#EF4444] font-heading font-bold text-lg">
                      !
                    </span>
                  </div>
                  <div className="font-heading text-2xl font-bold text-[#1F2937]">
                    3
                  </div>
                  <div className="text-sm text-[#6B7280] mt-1">
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
