import Navbar from "@/src/components/Navbar"
import Footer from "@/src/components/Footer"
import { Mail, Linkedin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-20 pb-12 sm:pt-28 sm:pb-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="font-heading text-[40px] sm:text-[48px] font-bold text-[#1F2937] mb-4 leading-tight tracking-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed">
            Have a question, feedback, or just want to say hello? We&apos;d love
            to hear from you.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="space-y-4">
            <a
              href="mailto:support@finsplain.net"
              className="flex items-center gap-5 p-6 rounded-2xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-[#10B981]/40 transition-all duration-150 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Mail className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1">
                  Email
                </p>
                <p className="font-heading font-semibold text-[#1F2937]">
                  support@finsplain.net
                </p>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  For support, billing, or general questions
                </p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/nicholas-lachhman1/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-2xl border border-[#E5E7EB] bg-white hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-150 group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Linkedin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-widest mb-1">
                  LinkedIn
                </p>
                <p className="font-heading font-semibold text-[#1F2937]">
                  Nicholas Lachhman
                </p>
                <p className="text-sm text-[#6B7280] mt-0.5">
                  Connect or send a message
                </p>
              </div>
            </a>
          </div>

          <p className="text-center text-sm text-[#9CA3AF] mt-10">
            We typically respond within one business day.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
