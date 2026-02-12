"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  isAuthenticated: boolean;
}

export default function MobileNav({ isAuthenticated }: Readonly<MobileNavProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[#F3F4F6] transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-[#6B7280]" />
        ) : (
          <Menu className="w-5 h-5 text-[#6B7280]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.05)] z-50">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard/upload"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  Upload
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  Documents
                </Link>
                <Link
                  href="/dashboard/account"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  Account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/how-it-works"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#1F2937] hover:bg-[#F9FAFB] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <div className="pt-2 px-4">
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-[#10B981] hover:bg-[#059669] text-white text-sm font-medium rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
