// ── Backend API response types ──────────────────────────────────────────────
// Mirrors Go structs from finsplain-be/internal/models/

export interface AnalyzeResponse {
  status: "success" | "partial" | "error"
  results: DocumentResult[]
  errors: DocumentError[]
  metadata: ResponseMetadata
}

export interface ResponseMetadata {
  processing_time_ms: number
  ocr_provider: string
  ai_model: string
  api_version: string
}

export interface DocumentResult {
  document_index: number
  document_type: string
  document_type_confidence: number
  date_range: DateRange
  currency: string
  summary: Summary
  fee_hunter: FeeHunter
  transactions: Transaction[]
  totals: Totals
}

export interface DateRange {
  start: string
  end: string
}

export interface Summary {
  period_description: string
  bullets: string[]
  top_categories: Category[]
  anomalies: Anomaly[]
}

export interface Category {
  category: string
  amount: number
  transaction_count: number
}

export interface Anomaly {
  type: string
  description: string
  amount?: number
  date?: string
}

export interface FeeHunter {
  total_fees_detected: number
  fees: Fee[]
  subscriptions: Subscription[]
  duplicate_charges: DuplicateCharge[]
  price_creep: PriceCreep[]
}

export interface Fee {
  type: string
  description: string
  amount: number
  date: string
  recurring: boolean
}

export interface Subscription {
  merchant: string
  amount: number
  frequency: string
  last_charged: string
}

export interface DuplicateCharge {
  description: string
  amount: number
  dates: string[]
}

export interface PriceCreep {
  merchant: string
  old_amount: number
  new_amount: number
  change_date: string
}

export interface Transaction {
  date: string
  amount: number
  merchant: string
  raw_description: string
  category: string
  is_recurring: boolean
}

export interface Totals {
  opening_balance: number
  closing_balance: number
  total_inflow: number
  total_outflow: number
}

export interface DocumentError {
  document_index: number
  code: "OCR_FAILED" | "AI_ANALYSIS_FAILED" | "CONTENT_TOO_LARGE"
  message: string
}

export interface APIErrorResponse {
  status: "error"
  error: {
    code: string
    message: string
    document_index?: number
  }
}

// User-facing error codes that should show the backend message
const USER_FACING_CODES = new Set([
  "FILE_TOO_LARGE",
  "TOO_MANY_FILES",
  "FILE_TYPE_UNSUPPORTED",
  "TOO_MANY_PAGES",
  "RATE_LIMITED",
  "OCR_FAILED",
  "CONTENT_TOO_LARGE",
])

export function isUserFacingError(code: string): boolean {
  return USER_FACING_CODES.has(code)
}
