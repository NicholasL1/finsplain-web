"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
import { analyzeDocument, AnalyzeError } from "@/src/lib/api"
import type { AnalyzeResponse, DocumentResult } from "@/src/types/api"

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/heic",
  "image/heif",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

type Phase = "idle" | "uploading" | "extracting" | "generating" | "complete"

const PHASE_ORDER: Phase[] = ["uploading", "extracting", "generating", "complete"]

const STEPS: { id: Phase; label: string; icon: React.ElementType }[] = [
  { id: "uploading", label: "Upload complete", icon: Upload },
  { id: "extracting", label: "Extracting transactions", icon: FileText },
  { id: "generating", label: "Generating insights", icon: BarChart2 },
]

const FUN_FACTS = [
  "The average American pays over $200/year in bank fees they don't notice.",
  "Credit card statements were first introduced in 1951 by Diners Club.",
  "Nearly 84% of people underestimate their monthly subscriptions by at least 2.",
  "The word 'budget' comes from the old French 'bougette' — a small leather purse.",
  "Automatic payments account for roughly 30% of the average household's expenses.",
  "The first ATM appeared in London in 1967 — it dispensed a maximum of £10.",
  "People who review their statements monthly save an average of $500/year.",
  "The magnetic stripe on credit cards was invented by an IBM engineer in 1960.",
  "Overdraft fees generate over $30 billion in revenue for U.S. banks each year.",
  "The average person has 12 recurring subscriptions — most think they have 4.",
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

/** Map a backend DocumentResult into the insights JSONB shape stored in Supabase */
function resultToInsights(result: DocumentResult) {
  return {
    document_type: result.document_type,
    document_type_confidence: result.document_type_confidence,
    date_range: result.date_range,
    currency: result.currency,
    summary: result.summary,
    fee_hunter: result.fee_hunter,
    transactions: result.transactions,
    totals: result.totals,
  }
}

export default function UploadCard() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [funFact, setFunFact] = useState<string | null>(null)
  const [showSlowMsg, setShowSlowMsg] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Show "this might take a while" after 10s, then rotate fun facts every 8s
  useEffect(() => {
    if (phase === "idle") {
      setFunFact(null)
      setShowSlowMsg(false)
      return
    }

    const slowTimer = setTimeout(() => setShowSlowMsg(true), 10_000)

    const factTimer = setTimeout(() => {
      setFunFact(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)])
      const interval = setInterval(() => {
        setFunFact((prev) => {
          let next: string
          do {
            next = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]
          } while (next === prev && FUN_FACTS.length > 1)
          return next
        })
      }, 8_000)
      return () => clearInterval(interval)
    }, 15_000)

    return () => {
      clearTimeout(slowTimer)
      clearTimeout(factTimer)
    }
  }, [phase])

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a PDF, PNG, JPEG, or HEIC image."
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File is too large. Maximum size is 10 MB."
    }
    return null
  }

  const handleTrySample = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push("/sign-in")
    }
  }, [supabase, router])

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
        // Create the document record first
        const { data: insertedDoc, error: insertError } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            filename: file.name,
            file_type: file.type,
            file_size: file.size,
            status: "processing",
          })
          .select("id")
          .single()

        if (insertError || !insertedDoc) throw insertError

        const docId = insertedDoc.id

        // Refresh the session to ensure we have a valid access token
        const {
          data: { session },
        } = await supabase.auth.refreshSession()
        if (!session?.access_token) {
          router.push("/sign-in")
          return
        }

        setPhase("extracting")

        // Call the real backend — OCR + AI analysis happen server-side in a single request.
        // We advance to "generating" after a delay since we can't observe backend progress.
        let response: AnalyzeResponse
        const phaseTimer = setTimeout(() => setPhase("generating"), 15_000)
        try {
          response = await analyzeDocument(file, session.access_token)
        } catch (err) {
          clearTimeout(phaseTimer)
          // Handle backend errors
          const message =
            err instanceof AnalyzeError
              ? err.message
              : "Something went wrong on our end. Please try again."

          await supabase
            .from("documents")
            .update({ status: "error", insights: { error: message } })
            .eq("id", docId)

          setError(message)
          setPhase("idle")
          return
        }

        clearTimeout(phaseTimer)

        // Handle the three response statuses
        if (response.status === "error") {
          // All documents failed
          const errorMsg =
            response.errors[0]?.message ||
            "Something went wrong on our end. Please try again."
          await supabase
            .from("documents")
            .update({ status: "error", insights: { error: errorMsg } })
            .eq("id", docId)

          setError(errorMsg)
          setPhase("idle")
          return
        }

        // "success" or "partial" — we have at least one result
        const result = response.results[0]
        const insights = resultToInsights(result)

        // Compute denormalized stats
        const totalFees = result.fee_hunter.total_fees_detected
        const subscriptionsFound = result.fee_hunter.subscriptions.length
        const unusualActivities = result.summary.anomalies.length
        const savingsIdentified =
          result.fee_hunter.duplicate_charges.reduce((s, d) => s + d.amount, 0) +
          result.fee_hunter.price_creep.reduce(
            (s, p) => s + (p.new_amount - p.old_amount),
            0
          )

        await supabase
          .from("documents")
          .update({
            status: "complete",
            total_fees: totalFees,
            subscriptions_found: subscriptionsFound,
            unusual_activities: unusualActivities,
            savings_identified: savingsIdentified,
            insights,
          })
          .eq("id", docId)

        // If partial, show a warning but still navigate
        if (response.status === "partial" && response.errors.length > 0) {
          // We still got results, but some documents had issues
          console.warn("Partial analysis:", response.errors)
        }

        setPhase("complete")
        router.push(`/dashboard/documents/${docId}`)
        router.refresh()
      } catch {
        setError("An unexpected error occurred. Please try again.")
        setPhase("idle")
      }
    },
    [supabase, router]
  )

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

                <span
                  className={cn(
                    "flex-1 text-sm font-medium",
                    state === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.label}
                </span>

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

        {showSlowMsg && (
          <div className="text-center space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              This is a longer document — hang tight!
            </p>
            {funFact && (
              <div className="mx-auto max-w-sm rounded-xl border border-border/50 bg-muted/30 px-5 py-3 transition-all duration-500">
                <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                  Did you know?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {funFact}
                </p>
              </div>
            )}
          </div>
        )}

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

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-7 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-medium transition-colors duration-150 active:scale-[0.98]"
          >
            Select a file
          </button>
          <button
            onClick={() => void handleTrySample()}
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
