"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Sparkles,
  Upload,
  ShieldCheck,
  Trash2,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/heic",
  "image/heif",
]);

export default function Hero({ firstName }: { firstName?: string }) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAction = useCallback(() => {
    if (!firstName) {
      router.push("/sign-up");
      return;
    }
    fileInputRef.current?.click();
  }, [firstName, router]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Navigate to upload page — the file will need to be re-selected there,
      // but this confirms intent and gets them to the right place.
      router.push("/dashboard/upload");
    },
    [router]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      if (!firstName) {
        router.push("/sign-up");
        return;
      }
      if (ACCEPTED_TYPES.has(file.type)) {
        router.push("/dashboard/upload");
      }
    },
    [firstName, router]
  );

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Full-section diagonal gradient overlay */}
      <div
        className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-indigo-500/8 pointer-events-none"
        aria-hidden="true"
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Decorative gradient orbs */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/12 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left column: headline + CTA */}
            <div className="max-w-xl">
              {/* Brand badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-5">
                  <Sparkles className="w-3 h-3" />
                  AI-Powered Financial Analysis
                </span>
              </motion.div>

              {firstName && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-sm font-medium text-emerald-500 mb-4 tracking-wide"
                >
                  Welcome back, {firstName}!
                </motion.p>
              )}

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-heading text-[40px] sm:text-[52px] lg:text-[52px] font-bold text-foreground mb-6 leading-[1.15] tracking-tight"
              >
                Understand your finances,{" "}
                <span className="bg-linear-to-r from-emerald-500 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  without the jargon
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
              >
                Upload any financial document and get clear, actionable insights
                about fees, subscriptions, spending patterns, and unusual
                activity — in seconds.
              </motion.p>

              <motion.ul
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="space-y-3"
              >
                {[
                  "No credit card required — free to start",
                  "Results in under 30 seconds",
                  "Works with PDFs and images",
                  "Bank-level encryption on every upload",
                  "Delete your data anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="mt-8 pt-6 border-t border-border/60"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">10,000+</span> documents analyzed
                  {" · "}
                  <span className="font-semibold text-foreground">$2.4M</span> in hidden fees uncovered
                </p>
              </motion.div>
            </div>

            {/* Right column: upload box */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
            >
              <div className="space-y-5">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "rounded-2xl border-2 border-dashed p-10 sm:p-12 text-center transition-all duration-200",
                    isDragging
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-border bg-muted/30 dark:bg-background/50 hover:border-emerald-400 hover:bg-emerald-500/5"
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.heic,.heif"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">
                    <Upload className="h-6 w-6 text-emerald-500" />
                  </div>

                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                    Upload a financial document
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    PDFs or photos of bank statements, credit card statements,
                    <br className="hidden sm:block" /> or pay stubs.
                  </p>

                  <button
                    onClick={handleFileAction}
                    className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-colors duration-150 active:scale-[0.98]"
                  >
                    {firstName ? "Select a file" : "Get started — it\u2019s free"}
                  </button>

                  {!firstName && (
                    <p className="mt-4 text-xs text-muted-foreground">
                      You&apos;ll need to{" "}
                      <Link href="/sign-up" className="text-emerald-500 hover:underline">
                        create a free account
                      </Link>{" "}
                      to upload
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  {[
                    { icon: ShieldCheck, label: "Processed securely" },
                    { icon: Trash2, label: "Deletable anytime" },
                    { icon: Lock, label: "Never sold" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom fade — dissolves orb ambient into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 bg-linear-to-b from-transparent to-background pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}
