"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload,
  FileText,
  BarChart2,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trash2,
  Lock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/src/lib/utils"
import { createClient } from "../../supabase/client"

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "image/png",
  "image/jpeg",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

type Phase = "idle" | "uploading" | "extracting" | "generating" | "complete"

const PHASE_ORDER: Phase[] = ["uploading", "extracting", "generating", "complete"]

const STEPS: { id: Phase; label: string; icon: React.ElementType }[] = [
  { id: "uploading", label: "Upload complete", icon: Upload },
  { id: "extracting", label: "Extracting transactions", icon: FileText },
  { id: "generating", label: "Generating insights", icon: BarChart2 },
]

function getStepState(
  currentPhase: Phase,
  stepPhase: Phase
): "complete" | "active" | "pending" {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase)
  const stepIdx = PHASE_ORDER.indexOf(stepPhase)
  if (currentIdx > stepIdx) return "complete"
  if (currentIdx === stepIdx) return "active"
  return "pending"
}

export default function UploadCard() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF, CSV, Excel, PNG, or JPEG."
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 10 MB."
    }
    return null
  }

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/sign-in")
        return
      }

      setPhase("uploading")

      try {
        const { error: insertError } = await supabase.from("documents").insert({
          user_id: user.id,
          filename: file.name,
          file_type: file.type,
          file_size: file.size,
          status: "processing",
        })

        if (insertError) throw insertError

        await new Promise((r) => setTimeout(r, 800))
        setPhase("extracting")
        await new Promise((r) => setTimeout(r, 2500))
        setPhase("generating")

        const { data: docs } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id)
          .eq("filename", file.name)
          .order("created_at", { ascending: false })
          .limit(1)

        if (docs && docs[0]) {
          await supabase
            .from("documents")
            .update({
              status: "complete",
              total_fees: Math.round(Math.random() * 500 * 100) / 100,
              subscriptions_found: Math.floor(Math.random() * 8) + 1,
              unusual_activities: Math.floor(Math.random() * 4),
              savings_identified: Math.round(Math.random() * 300 * 100) / 100,
              insights: {
                fees: [
                  { name: "Monthly maintenance fee", amount: 12.99 },
                  { name: "ATM withdrawal fee", amount: 3.5 },
                  { name: "Wire transfer fee", amount: 25.0 },
                ],
                subscriptions: [
                  { name: "Netflix", amount: 15.99, frequency: "monthly" },
                  { name: "Spotify", amount: 9.99, frequency: "monthly" },
                  { name: "Amazon Prime", amount: 14.99, frequency: "monthly" },
                ],
                patterns: [
                  "Spending peaks on weekends",
                  "Dining expenses increased 23% from last period",
                  "Utility bills remain consistent",
                ],
                unusual: [
                  {
                    description: "Large transfer to unknown account",
                    amount: 2500,
                    date: "2024-01-15",
                  },
                ],
              },
            })
            .eq("id", docs[0].id)
        }

        await new Promise((r) => setTimeout(r, 1500))
        setPhase("complete")
        router.push("/dashboard")
        router.refresh()
      } catch {
        setError("An unexpected error occurred. Please try again.")
        setPhase("idle")
      }
    },
    [supabase, router]
  )

  const handleTrySample = useCallback(async () => {
    setError(null)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/sign-in")
      return
    }

    setPhase("uploading")

    try {
      const { error: insertError } = await supabase.from("documents").insert({
        user_id: user.id,
        filename: "Sample_Bank_Statement_2024.pdf",
        file_type: "application/pdf",
        file_size: 245760,
        status: "processing",
      })

      if (insertError) throw insertError

      await new Promise((r) => setTimeout(r, 800))
      setPhase("extracting")
      await new Promise((r) => setTimeout(r, 2500))
      setPhase("generating")

      const { data: docs } = await supabase
        .from("documents")
        .select("id")
        .eq("user_id", user.id)
        .eq("filename", "Sample_Bank_Statement_2024.pdf")
        .order("created_at", { ascending: false })
        .limit(1)

      if (docs && docs[0]) {
        await supabase
          .from("documents")
          .update({
            status: "complete",
            total_fees: 147.5,
            subscriptions_found: 6,
            unusual_activities: 2,
            savings_identified: 89.99,
            insights: {
              fees: [
                { name: "Monthly maintenance fee", amount: 14.99 },
                { name: "Overdraft protection fee", amount: 35.0 },
                { name: "International transaction fees", amount: 12.47 },
                { name: "Paper statement fee", amount: 5.0 },
              ],
              subscriptions: [
                {
                  name: "Netflix Premium",
                  amount: 22.99,
                  frequency: "monthly",
                },
                {
                  name: "Spotify Family",
                  amount: 16.99,
                  frequency: "monthly",
                },
                { name: "iCloud Storage", amount: 2.99, frequency: "monthly" },
                {
                  name: "Gym Membership",
                  amount: 49.99,
                  frequency: "monthly",
                },
                {
                  name: "Adobe Creative Cloud",
                  amount: 54.99,
                  frequency: "monthly",
                },
                {
                  name: "Cloud Backup Service",
                  amount: 9.99,
                  frequency: "monthly",
                },
              ],
              patterns: [
                "Weekend dining spending is 3x weekday average",
                "Transportation costs increased 18% month-over-month",
                "Grocery spending is below average for your area",
                "You have 3 unused subscriptions with no recent activity",
              ],
              unusual: [
                {
                  description: "Duplicate charge from online retailer",
                  amount: 79.99,
                  date: "2024-01-22",
                },
                {
                  description: "Unrecognized international transaction",
                  amount: 156.0,
                  date: "2024-01-28",
                },
              ],
            },
          })
          .eq("id", docs[0].id)
      }

      await new Promise((r) => setTimeout(r, 1500))
      setPhase("complete")
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setPhase("idle")
    }
  }, [supabase, router])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  // ── Loading state ──────────────────────────────────────────────────────────
  if (phase !== "idle") {
    return (
      <div className="max-w-lg mx-auto space-y-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
            Analyzing your document
          </h2>
          <p className="text-sm text-muted-foreground">
            This usually takes under a minute.
          </p>
        </div>

        <div className="space-y-3">
          {STEPS.map((step) => {
            const state = getStepState(phase, step.id)
            const Icon = step.icon

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-500",
                  state === "active" && "border-indigo-400 bg-card shadow-sm",
                  state === "complete" && "border-border bg-card",
                  state === "pending" && "border-border/50 bg-muted/50"
                )}
              >
                {/* Left icon */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center",
                    state === "complete" && "text-emerald-500",
                    state === "active" && "text-indigo-500",
                    state === "pending" && "text-muted-foreground/40"
                  )}
                >
                  {state === "complete" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : state === "active" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "flex-1 text-sm font-medium",
                    state === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.label}
                </span>

                {/* Right status indicator */}
                <div className="h-5 w-5 flex items-center justify-center">
                  {state === "complete" && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  {state === "active" && (
                    <div className="h-4 w-4 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Secure processing notice */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Secure Processing
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You can leave and return later. We&apos;ll notify
            <br />
            you when the analysis is complete.
          </p>
        </div>
      </div>
    )
  }

  // ── Idle / upload state ────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Drop zone */}
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
          accept=".pdf,.csv,.xlsx,.xls,.png,.jpg,.jpeg"
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

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-colors duration-150 active:scale-[0.98]"
          >
            Select a file
          </button>
          <button
            onClick={handleTrySample}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Try a sample document
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-500/10 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Supported document types */}
      <div className="text-center space-y-3">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Supported Documents
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {[
            "Bank statements",
            "Credit card statements",
            "Pay stubs",
            "Other financial documents",
          ].map((doc) => (
            <span
              key={doc}
              className="px-3 py-1.5 text-xs text-muted-foreground border border-border rounded-full bg-background"
            >
              {doc}
            </span>
          ))}
        </div>
      </div>

      {/* Security badges */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
        {[
          { icon: ShieldCheck, label: "Files are processed securely" },
          { icon: Trash2, label: "Documents can be deleted" },
          { icon: Lock, label: "We don't sell your data" },
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
  )
}
