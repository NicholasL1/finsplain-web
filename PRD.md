### FinSplain PRD

**_What it does:_**
_An AI-powered web app that helps people instantly understand complex financial
documents—like bank statements, loan agreements, investment reports, and tax slips—by
translating them into simple, personalized, actionable insights._

**_Why?:_**
Financial documents are confusing, cluttered, and hard to interpret. In most cases, they
are impossible to understand for people who aren’t financially literate.

```
Core MVP Features (base foundation)
```

These are enough to launch and impress:

**1. Authentication**

Supports:

```
● Email + password sign up / login
● Optional OAuth later (Google/Apple)
```

Includes:

```
● Secure sessions (httpOnly cookies or JWT)
● Protected routes (dashboard requires login)
● Basic account settings (email, logout, delete account)
```

Objective:

```
● Establish trust + privacy boundaries early (especially important for financial docs)
```

**2. Document Upload + OCR Extraction**

Supports:

```
● PDFs
● Photos
● Screenshots
```

Extracts:

```
● transactions
● totals
● categories
```

```
● fees
● balances
● contributions
● income/expense classifications
```

Documents:

```
● Bank statements
● Credit card statements
● Pay stubs
● Government cheques
● Misc (want to make this dynamic)
```

Nice-to-have for MVP quality:

```
● Upload status (uploaded → processing → complete/failed)
● “Document type detected” label + confidence
● Basic parsing normalization (dates, currency, negative values)
```

**3. Generate AI Summary + Fee Hunter**

AI Summary outputs:

```
● “What happened this period” in 5–10 bullets
● Biggest spending categories + notable changes
● Unusual transactions/anomalies (large spikes, duplicates)
```

Fee Hunter detects:

```
● recurring subscriptions + monthly cost estimate
● interest charges
● service fees/overdraft / FX fees
● duplicate payments
● “price creep” hints (optional if you have multiple docs)
```

Objective:

```
● Make outputs structured and actionable (not a generic LLM paragraph)
```

**4. Results page in the dashboard**

Displays:

```
● Document overview (type, date range, totals)
● Summary + Fee Hunter results (cards)
● Transaction table (search + filter)
● Simple charts (spending by category, top merchants)
```

UX must-haves:

```
● Clear loading/progress state while processing
● “Download report” placeholder (can be Pro / later feature)
● Mobile-friendly layout
```

**5. Access previous chats**

Users can:

```
● View a list of past analyzed documents
● Open a previous document’s “chat/analysis thread.”
● Continue asking questions about that same document
```

Includes:

```
● Conversation history tied to a document_id
● “Resume context” behavior (so it feels like a persistent assistant)
● Optional: ability to delete a document + all associated chats (privacy win)
```

**Objective:** We need to make it discernable from ChatGPT, make it feature-focused in a way
where the output is different, and more useful, than ChatGPT that will encourage people to use
it.

```
Advanced Features (to make it truly stand out)
```

⭐ **1. Fee Hunter (viral feature)**

Automatically detects:

```
● hidden fees
● subscription creep
● interest charges
● duplicate payments
```

Then says:

```
“These 4 subscriptions have increased in price without notice.”
```

This alone can go viral.

⭐ **2. “Smart Compare” Mode**

Allow users to upload two documents:

```
● two tax slips
● two pay stubs
● last month’s bank statement vs this month
● two investment reports
```

AI highlights differences:

```
● Income changes
● Expense increases
● Portfolio changes
● New fees
```

This is powerful and unique.

⭐ **3. Investment Risk Decoder**

LLM explains:

```
● market risks
● fund structure
● exposure levels
● volatility
● diversification
```

But in simple language:

```
“This fund invests heavily in tech companies, which means higher growth potential
but also higher volatility.”
```

⭐ **4. “Explain This Like I’m 5 / 15 / 25 / an MBA”**

Multiple explanation difficulty levels makes the app accessible to all.

⭐ **5. Multi-Language Support**

Huge for international users.
AI can explain documents in:

```
● English
```

```
● French
● Spanish
● Mandarin
● etc.
```

⭐ **6. Savings Opportunity Generator**

Based on spending and fees, the app recommends:

```
● bills to cancel
● lower-fee alternatives
● unused services
● ways to optimize contributions
● loan repayment strategies
```

Not investment advice → safe

⭐ **7. Data Privacy Sandbox (trust builder)**

Show users that files are:

```
● not stored (unless they want)
● processed locally or securely
● anonymized
```

This builds trust and is super resume-friendly.

```
💰 Monetization Paths (optional)
```

**Free version:**

```
● 3 documents per month
● Basic translation
```

**Pro tier ($5–10/mo):**

```
● Unlimited docs
● Compare mode
● Advanced breakdowns
● Saving recommendations
● Multi-language support
```

```
● PDF export
● Contextual chat
```

```
B2B (if you want to go beyond portfolio):
```

```
● For accountants
● For financial coaches
● For credit repair specialists
```

```
Development Plan
```

### Tech Stack:

### Frontend : Next.js (TypeScript)

**Backend:** Go microservice with gRPC
**API Gateway:** REST/GraphQL → gRPC translator
**Infrastructure:** AWS
**AI Layer:** LLM orchestrator service written in Go or Python
**Document pipeline:** S3 + Textract
**Database:** Postgres or DynamoDB

┌─────────────┐
│ Next.js UI │
└─────┬───────┘
↓
┌─────────────┐
│ API Gateway │
└─────┬───────┘
↓ gRPC
┌─────────────────────┐
│ Go Core Service │
│ │
│ - Auth │
│ - Document handling │
│ - Business logic │
│ - AI orchestration │
└─────┬───────────────┘
↓
┌──────────────┬──────────────┬──────────────┐
│ Postgres │ S3 │ Dynamo/Mongo │
│ (source of │ (files) │ (AI artifacts │
│ truth) │ │ & OCR output) │

# MVP SPEC

## Goal

Ship a focused, trustworthy AI app that turns messy financial documents into **structured
insights** (not generic ChatGPT output), with a smooth end-to-end flow: **login → upload →
processing → results → revisit later**.

## 1) Authentication

**User stories**

```
● As a user, I can sign up and log in securely.
```

```
● As a user, I stay logged in across sessions.
```

```
● As a user, I can log out and manage basic account settings.
```

**MVP features**

```
● Email + password signup/login (OAuth optional later)
```

```
● Secure session (JWT + httpOnly cookie or equivalent)
```

```
● Protected routes (dashboard + documents require auth)
```

**Success criteria**

```
● Users can reliably authenticate and access only their own documents/results.
```

## 2) Document Upload + OCR Extraction

**User stories**

```
● As a user, I can upload a PDF/photo/screenshot of a financial document.
```

```
● As a user, I can see upload + processing status.
```

```
● As a user, I get structured extracted data from the document.
```

**Supported inputs**

```
● PDFs
```

```
● Photos
```

```
● Screenshots
```

**Supported document types (MVP targets)**

```
● Bank statements
```

```
● Credit card statements
```

```
● Pay stubs
```

```
● Government cheques
```

```
● Misc/Unknown (dynamic fallback): still OCR + basic summary even if type is unclear
```

**Extracted fields (MVP baseline)**

```
● Transactions (where applicable)
```

```
● Totals/balances (when present)
```

```
● Fees
```

```
● Categories (best-effort)
```

```
● Contributions / income classifications (for pay stubs, government cheques)
```

**Processing UX**

```
● Status states: pending_upload → uploaded → processing_ocr →
processing_ai → completed (or failed)
```

```
● Error message shown if parsing fails
```

**Success criteria**

```
● Upload works reliably; OCR runs; DB stores structured output; user can view extracted
transactions/fees.
```

## 3) AI Summary + Fee Hunter

**User stories**

```
● As a user, I can get a plain-language summary of what the document says.
```

```
● As a user, I can see suspicious fees and recurring charges highlighted automatically.
```

**AI Summary outputs**

```
● 5–10 bullet “What happened” summary
```

```
● Top categories + notable changes (if enough data)
```

```
● Unusual transactions (spikes/duplicates where detectable)
```

**Fee Hunter outputs**

```
● Hidden/service fees (overdraft, admin, FX, interest charges)
```

```
● Duplicate charges (best-effort heuristics)
```

```
● Subscription/recurring detection (merchant + estimated monthly cost)
```

```
● Clear disclaimers: informational only, not financial advice
```

**Output format requirement (to differentiate from ChatGPT)**

```
● Always produce structured JSON behind the scenes (rendered as UI cards)
```

```
● Consistent sections: Summary / Fees / Subscriptions / Anomalies
```

**Success criteria**

```
● Results are consistently structured, actionable, and tied to the extracted data (not
hallucinated).
```

## 4) Results Page (Dashboard)

**User stories**

```
● As a user, I can view results for a document in a clean dashboard.
```

```
● As a user, I can search/filter transactions.
```

**Dashboard components**

```
● Document overview card (type, date range, totals/balances if found, processing
timestamps)
```

```
● Summary + Fee Hunter cards
```

```
● Transactions table (search/filter, pagination)
```

```
● Simple chart(s) (optional but nice): spending by category, top merchants
```

**Success criteria**

```
● The page loads quickly, works on mobile, and makes the output “feel like a product,” not
a chat tool.
```

## 5) Access Previous Chats / Analyses

**User stories**

```
● As a user, I can revisit any previously analyzed document.
```

```
● As a user, I can continue asking questions about that same document.
```

**MVP features**

```
● Document list/history page (most recent first)
```

```
● Open a document → see prior AI outputs + chat history
```

```
● Continue the thread (same document context)
```

**Privacy control**

```
● Delete document = deletes associated results + chat history (trust builder)
```

**Success criteria**

```
● Users can return later and pick up where they left off, tied to document_id.
```

**_Minimal Database Tables + Columns Needed_**

Below is the _minimum_ schema to support all MVP features cleanly (including “previous chats”).
This assumes Postgres (Supabase is fine).

## 1) users

```
● id (uuid, PK)
```

```
● email (unique)
```

```
● created_at (timestamp)
```

```
If you use Supabase Auth, you can often rely on auth.users and keep your own
users table minimal (or skip it and reference Supabase auth user IDs directly).
```

## 2) documents

**Purpose:** one row per uploaded file / statement.

```
● id (uuid, PK)
```

```
● user_id (uuid, FK → users.id)
```

```
● document_type (text) — bank_statement, credit_card, pay_stub,
government_cheque, unknown
```

```
● original_filename (text)
```

```
● s3_key (text) — store the object key, not a public URL
```

```
● status (text) —
pending_upload|uploaded|processing_ocr|processing_ai|completed|fa
iled
```

```
● processing_error (text, nullable)
```

```
● uploaded_at (timestamp)
```

```
● ocr_completed_at (timestamp, nullable)
```

```
● ai_completed_at (timestamp, nullable)
```

Optional but useful:

```
● detected_currency (text, nullable)
```

```
● statement_start_date / statement_end_date (date, nullable)
```

```
● total_inflow / total_outflow (numeric, nullable)
```

```
● ending_balance (numeric, nullable)
```

## 3) transactions

**Purpose:** line items extracted from a document (many per document).

```
● id (uuid, PK)
```

```
● document_id (uuid, FK → documents.id)
```

```
● date (date)
```

```
● amount (numeric) — negative for spend, positive for income (pick a convention)
```

```
● merchant (text, nullable)
```

```
● raw_description (text, nullable) — what OCR saw
```

```
● category (text, nullable)
```

```
● is_recurring (bool, default false)
```

Highly recommended (duplicate control):

```
● fingerprint (text, unique per document)
Example computed from (date, amount, normalized_merchant,
raw_description).
```

## 4) fees

**Purpose:** extracted fees/interest charges (many per document).

```
● id (uuid, PK)
```

```
● document_id (uuid, FK → documents.id)
```

```
● amount (numeric)
```

```
● fee_type (text) — interest, fx_fee, overdraft, service_fee, etc.
```

```
● description (text, nullable)
```

## 5) subscriptions

**Purpose:** recurring charges detected for a user (many per user).

```
● id (uuid, PK)
```

```
● user_id (uuid, FK → users.id)
```

```
● merchant (text)
```

```
● monthly_cost (numeric)
```

```
● first_detected_on (date)
```

```
● last_seen_document_id (uuid, FK → documents.id, nullable)
```

Recommended index:

```
● Unique: (user_id, merchant)
```

```
This supports “Fee Hunter” + showing a user’s subscriptions. If later you want
price-change history, add subscription_events.
```

## 6) ai_outputs

**Purpose:** store AI results tied to a document.

```
● id (uuid, PK)
```

```
● document_id (uuid, FK → documents.id)
```

```
● output_type (text) — summary|fee_hunter|risk|comparison
```

```
● content_json (jsonb) — structured output your UI renders
```

```
● created_at (timestamp)
```

Optional:

```
● model (text) — which LLM
```

```
● prompt_version (text) — helps debugging changes
```

## 7) chats and chat_messages (for “Access previous chats”)

To support persistent chat per document cleanly, use two tables:

**chats**

```
● id (uuid, PK)
```

```
● user_id (uuid, FK → users.id)
```

```
● document_id (uuid, FK → documents.id)
```

```
● title (text, nullable) — e.g., “Dec 2025 RBC Statement”
```

```
● created_at (timestamp)
```

Recommended:

```
● Unique (user_id, document_id) for “one chat thread per document” (simple MVP)
```

**chat_messages**

```
● id (uuid, PK)
```

```
● chat_id (uuid, FK → chats.id)
```

```
● role (text) — user|assistant|system
```

```
● content (text)
```

```
● created_at (timestamp)
```

Optional:

```
● citations_json (jsonb, nullable) — if you later cite extracted fields
```

```
● tokens_used (int, nullable)
```

**_Minimal Relationships Summary_**

```
● users 1 → many documents
```

```
● documents 1 → many transactions
```

```
● documents 1 → many fees
```

```
● documents 1 → many ai_outputs
```

```
● users 1 → many subscriptions
```

```
● documents 1 → many subscriptions (via last_seen_document_id, optional
pointer)
```

```
● documents 1 → 1 chats (if you enforce unique per doc per user)
```

```
● chats 1 → many chat_messages
```

**_Minimal Service Contracts + API_**

```
● POST /auth/signup
● POST /auth/login
● POST /documents/init-upload → {document_id, presigned_url}
● POST /documents/{id}/complete-upload → queues OCR job
● GET /documents → list
● GET /documents/{id} → doc metadata + status
● GET /documents/{id}/results → summary + fees + transactions
● POST /documents/{id}/chat → add message, get reply
● GET /documents/{id}/chat → history
```

## Internal gRPC (between services)

```
● AuthService: VerifySession, GetUserContext
● DocumentService: CreateDoc, CompleteUpload, GetDoc, ListDocs
● Worker interfaces can be queue-driven (no gRPC needed initially)
```

**_Database Information_**

Name: FinSplain-Auth

Password: 6BEnKGyUw68WCuZm

Project ID: smdvoawuouqnemskupwm

API key: sb_publishable_bme456Md6hPS9-iQcGDHvg_SFr7wliL

https://fin-splain-reset--ajaylachhman109.replit.app/dashboard

**_Subscriptions and Monthly Costs:_**

### General Email:

finsplain@gmail.com
Speedy109901!

### Cloudflare:

Domain hosting service, email domain for receiving
ajaylachhman109@gmail.com
Spider109901!

- Domain (Cloudflare): _finsplain.net_ - 18.29 CAD/year
- Custom email receiving (email forwards): _support@finsplain.net -> finsplain@gmail.com\_
- Claude code pro: 31.64 CAD/month

### Test Users

ajaylachhman109@gmail.com - Speedy109901!
nlachhman2@gmail.com - Spider109901!
finsplaintest@yopmail.com - Speedy109901!
finsplaintest@yopmail.com - Spider109901!

### Resend

Custom SMTP (Email domains for sending - auth, forgot pass)

- Login with Google - finsplain@gmail.com

### GCP

Used for google sign up/login - issued through supabase auth

- Login with Google - finsplain@gmail.com
