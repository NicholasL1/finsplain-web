# Architectural Decisions — Finsplain Web

This file is a living reference. Every significant architectural or technical decision is recorded here, along with the reasoning behind it and guidance for future development. **Update this file whenever a decision changes.**

---

## Table of Contents

1. [Framework & Runtime](#1-framework--runtime)
2. [Routing Architecture](#2-routing-architecture)
3. [Styling System](#3-styling-system)
4. [UI Component Library](#4-ui-component-library)
5. [Authentication](#5-authentication)
6. [Middleware & Route Protection](#6-middleware--route-protection)
7. [Form Handling](#7-form-handling)
8. [Animation](#8-animation)
9. [State Management](#9-state-management)
10. [Database & Backend](#10-database--backend)
11. [Theming (Dark/Light Mode)](#11-theming-darklight-mode)
12. [Testing](#12-testing)
13. [File & Project Structure](#13-file--project-structure)
14. [Font Strategy](#14-font-strategy)
15. [Error Handling & Redirects](#15-error-handling--redirects)
16. [Notifications (Toasts)](#16-notifications-toasts)
17. [Charts & Data Visualization](#17-charts--data-visualization)
18. [Icons](#18-icons)

---

## 1. Framework & Runtime

**Decision:** Next.js 16 with App Router + React 19 + TypeScript (strict)

**Why:**
- App Router enables fine-grained server/client component boundaries. Pages default to Server Components, which means zero JavaScript is sent to the client unless explicitly needed. This is critical for performance on a document-analysis product where initial page load matters.
- React 19 gives us `useActionState` and `useFormStatus` natively, removing the need for extra form libraries for server-driven forms.
- TypeScript strict mode catches bugs at compile time. Given the financial nature of the app (fees, subscriptions, account data), type safety is non-negotiable.

**Going forward:**
- Default all new pages and layouts to Server Components.
- Only add `"use client"` when you need browser APIs, event handlers, or client-side state.
- Do not downgrade TypeScript strictness. If a type is hard to satisfy, model it correctly rather than using `any` or `as`.

---

## 2. Routing Architecture

**Decision:** File-based routing under `src/app/`, using route groups for auth pages

**Structure:**
```
app/
  (auth)/               # Route group — shared layout for auth pages
    sign-in/
    sign-up/
    forgot-password/
    reset-password/
  dashboard/            # Protected routes (middleware-gated)
    page.tsx            # Document list
    upload/
    documents/[id]/
    account/
    reset-password/
  auth/
    callback/route.ts   # OAuth & password-reset code exchange
```

**Why:**
- `(auth)/` is a route group — it doesn't add a URL segment but allows a shared layout for auth pages without affecting the URL.
- Dashboard routes are all under `/dashboard/` so the middleware matcher can protect them with a single prefix check.
- `/auth/callback` is an API Route (not a page) because it needs to set httpOnly cookies and redirect — it cannot be a UI page.

**Going forward:**
- New authenticated features should live under `dashboard/`.
- New public marketing pages go in `app/` directly.
- If a route needs custom metadata (title, description), define `export const metadata` in the page file.

---

## 3. Styling System

**Decision:** Tailwind CSS v4 with OKLCH color space + CSS custom properties

**Why:**
- Tailwind v4 drops the config file in favor of `@import "tailwindcss"` in CSS, which simplifies setup and enables co-location of design tokens.
- OKLCH is a perceptually uniform color space. Unlike HSL, colors with the same lightness value actually look equally bright to the human eye. This makes it far easier to create consistent light/dark themes without manual tweaking.
- CSS custom properties (`--background`, `--foreground`, etc.) allow theming to be toggled purely in CSS by swapping the `.dark` class — no JavaScript re-renders required.

**Color system:**
- All semantic colors are defined as OKLCH variables in `app/globals.css`.
- Dark mode overrides the same variables under `.dark {}`.
- Do not hardcode raw color values (e.g., `text-[#10B981]`) in components. Use semantic token classes (`text-primary`, `bg-accent`) or the emerald/indigo design accents that are already wired up.

**Custom utilities:**
- `.card-hover` — standard card hover elevation
- `.card-hover-emerald` — card hover with emerald accent border

**Going forward:**
- Add new design tokens as OKLCH CSS variables in `globals.css`, not as Tailwind config extensions.
- Use `cn()` from `src/lib/utils.ts` for all conditional class merging (never string concatenation).
- Avoid inline styles. If a one-off style is needed more than once, promote it to a utility class.

---

## 4. UI Component Library

**Decision:** shadcn/ui (new-york style) + Radix UI primitives + lucide-react icons

**Why:**
- shadcn/ui is not a dependency — it copies components directly into the repo (`components/ui/`). This means we own the code and can modify any component without fighting a library's API.
- Radix UI handles all accessibility primitives (focus management, ARIA, keyboard navigation) so we don't have to build this ourselves.
- New-york style was chosen for its sharper, more professional look over the default style — better fit for a financial product.

**Adding new components:**
```bash
npx shadcn@latest add <component-name>
```
This drops the component into `src/components/ui/`. Do not manually modify installed files unless you need to diverge from the default implementation — changes will be overwritten on the next `add`.

**Going forward:**
- Always prefer a shadcn/ui component before building a custom primitive.
- Custom composite components (e.g., `DocumentList`, `UploadCard`) live in `src/components/` (not `ui/`).
- Keep `components/ui/` clean — only shadcn-managed files go there.

---

## 5. Authentication

**Decision:** Google OAuth as the primary sign-up/sign-in method; Supabase Auth with JWT tokens in httpOnly cookies (SSR pattern)

**Why:**
- Google OAuth removes friction from sign-up — users don't need to create and remember a new password. This is the preferred and primary auth path.
- Supabase Auth manages the OAuth flow with Google and all token handling, keeping integration simple.
- httpOnly cookies prevent JavaScript access to tokens, protecting against XSS attacks.
- The Supabase SSR package handles cookie-based sessions transparently for both Server and Client Components.
- Supabase was chosen for auth + database in one service to minimize infrastructure complexity at this stage.

**Sign-up flow (Google OAuth — primary):**
1. User clicks "Continue with Google" (`GoogleOAuthButton` component).
2. Supabase redirects to Google's OAuth consent screen.
3. On approval, Google redirects back to `/auth/callback?code=...`.
4. Callback exchanges the code for a session and redirects to `/dashboard`.

**Sign-up flow (email/password — fallback):**
1. `signUpAction` in `src/app/actions.ts` creates the auth user and inserts a record into the `users` table.
2. Supabase sends a confirmation email.
3. On click, user hits `/auth/callback` which exchanges the code for a session.

**Password reset flow (tokenized — no live session):**
1. User requests reset on `/forgot-password` → `forgotPasswordAction` sends Supabase email.
2. Email link hits `/auth/callback?code=...&redirect_to=/reset-password`.
3. Callback exchanges code for tokens, then **signs out globally** to prevent session hijacking.
4. Access token is stored in a `password_reset_token` httpOnly cookie (10-min TTL).
5. `/reset-password` page calls `resetPasswordAction`.
6. Action reads the token cookie and updates the password via Supabase REST API directly (no active session needed).
7. Cookie is deleted on success.

**Why tokenized reset (not session-based):**
- Supabase's default recovery flow creates an active session. This can be a security concern — a user who clicks a reset link from an old email could inadvertently log in. The tokenized approach avoids this.

**SMTP gotcha:**
- If `signUp` hangs ~15 seconds and returns a blank `{}` error, the Supabase project has broken custom SMTP configured.
- `signUp` waits synchronously for the email; `recover` (forgot-password) is async — so signUp times out visibly but recover silently fails.
- Fix: disable custom SMTP in Supabase dashboard, or fix credentials (Resend: host=smtp.resend.com, port=465, user=resend, pass=API key; sender must use a verified domain).

**Going forward:**
- All auth server actions stay in `src/app/actions.ts`.
- Theme preference is saved to `user_metadata` via `updateThemeAction`.
- Google OAuth is already enabled. To add more providers (GitHub, Apple, etc.), enable them in the Supabase dashboard — the `/auth/callback` handler already supports any OAuth provider.

---

## 6. Middleware & Route Protection

**Decision:** `src/proxy.ts` is the active middleware file (not `src/middleware.ts`)

**Why:**
- Next.js picks up `middleware.ts` at the root automatically. We have `supabase/middleware.ts` which is a helper module — it is not auto-loaded.
- `src/proxy.ts` was named to avoid the auto-detection conflict. It is explicitly referenced in Next.js config.
- **Do not create `src/middleware.ts`** — it would conflict with `proxy.ts` and cause a duplicate middleware error.

**What the middleware does:**
- Refreshes the Supabase session on every request (required so Server Components can read auth state).
- Redirects unauthenticated requests to `/dashboard/*` → `/sign-in`.
- Does not block public routes.

**Matcher config:** `/((?!_next/static|_next/image|favicon.ico|public|api).*)`
This runs on all routes except Next.js internals and static assets.

**Going forward:**
- Add new protected route prefixes to the redirect check in `proxy.ts`.
- Never rename `proxy.ts` to `middleware.ts`.

---

## 7. Form Handling

**Decision:** React 19 native server actions + `useActionState` / `useFormStatus`; react-hook-form for complex client-side forms

**Why:**
- Server actions (with `"use server"` directive) allow form submissions without client-side JavaScript and without creating API routes. The function runs on the server and can directly access Supabase.
- `useActionState` (React 19) manages optimistic state for server action responses — no extra state boilerplate.
- `useFormStatus` provides pending state from the nearest `<form>` — used in `SubmitButton` to show loading indicators.
- `react-hook-form` is available for more complex forms that need rich client-side validation (e.g., multi-step forms, dependent fields).

**Pattern for auth forms:**
```typescript
// Server action
"use server"
export const signInAction = async (formData: FormData) => { ... }

// Client component
const [state, action] = useActionState(signInAction, null)
<form action={action}>
  <SubmitButton>Sign In</SubmitButton>
</form>
```

**Password strength validation:**
- Implemented client-side in `SignUpForm.tsx` with real-time feedback.
- Rules: 12+ chars, uppercase, lowercase, number, symbol.
- Purely UX — Supabase also enforces its own password policy server-side.

**Going forward:**
- Simple forms (login, sign-up, settings) → server actions.
- Complex multi-step or highly interactive forms → react-hook-form.
- Always use `SubmitButton` (not a raw `<button>`) so loading state is handled consistently.
- Error messages go through `FormMessage` component, sourced from URL query params (`encodedRedirect`).

---

## 8. Animation

**Decision:** `motion` library (Framer Motion v12 rebranded) for component animations; CSS for micro-interactions

**Why:**
- `motion` provides declarative, GPU-accelerated animations with a React-friendly API. The rename from Framer Motion to motion reflects the library becoming framework-agnostic.
- Scroll-triggered animations use `AnimateOnScroll` wrapper component (uses `IntersectionObserver` via motion's `useInView`).
- CSS `transition` and `@keyframes` handle simpler micro-interactions (hover lifts, accordion expand) — these don't need JavaScript.

**Current usage:**
- `Hero.tsx` — staggered entrance animations on headline, subtext, CTA
- `AnimateOnScroll.tsx` — reusable scroll-reveal wrapper
- `HowItWorksDemo.tsx` — interactive demo state transitions
- `globals.css` — accordion-down/up keyframes for shadcn Accordion

**Going forward:**
- Use `AnimateOnScroll` for any new section that should animate in on scroll.
- Keep animations subtle — this is a financial product, not a marketing site. Prefer fade+slide-up over bouncy effects.
- Do not animate layout-affecting properties (width, height) — they cause reflows. Prefer `opacity` and `transform`.

---

## 9. State Management

**Decision:** No global state manager; rely on React Server Components, URL state, and React 19 hooks

**Why:**
- Most state in this app is either server-owned (Supabase data) or form-local. There is no complex shared client state that would justify Redux or Zustand at this stage.
- Server Components fetch data directly without needing a client store.
- URL query params carry transient state (form errors, redirect targets) — this is stateless and bookmarkable.
- React 19's `useActionState` handles form submission state.

**Going forward:**
- If a feature requires genuinely shared client state (e.g., a multi-step upload wizard, a real-time document editor), introduce Zustand as a lightweight option — do not reach for Redux.
- Avoid prop drilling beyond 2 levels — use React Context for deeply shared UI state (e.g., theme already uses next-themes context).

---

## 10. Database & Backend

**Decision:** Supabase (PostgreSQL + RLS) for database and authentication; future separate backend service for document processing

**Why:**
- Supabase provides PostgreSQL, auth, storage, and real-time in one managed service — minimal infrastructure setup.
- Row Level Security (RLS) enforces data isolation at the database level — even if application logic has a bug, users cannot access other users' documents.
- Supabase's client library works in both Server and Client Components with the SSR package.

**Planned backend service (not yet built):**
- A separate backend service will handle OCR extraction and AI analysis of uploaded documents.
- The frontend will send the document to this service, which returns a structured result JSON object.
- The frontend parses this JSON and renders the results (fees, subscriptions, unusual activity, savings, etc.) in the dashboard.
- The `documents` table `status` field (`pending` → `processing` → `complete` | `error`) and `insights` JSONB column are already designed to receive this payload.
- **When this is built:** update this section to document the API contract (endpoint, request shape, response JSON schema) and update the `Going forward` notes below.

**Known tables:**
- `users` — mirrors auth.users, stores display_name, theme preference
- `documents` — stores uploaded document metadata: `id`, `user_id`, `filename`, `file_type`, `file_size`, `status`, `total_fees`, `subscriptions_found`, `unusual_activities`, `savings_identified`, `insights` (JSONB), `created_at`

**Supabase client files:**
- `supabase/server.ts` — Server Component / Server Action client (reads cookies)
- `supabase/client.ts` — Browser client (for Client Components only)
- Always use the server client in Server Components and actions; never use the browser client server-side.

**Going forward:**
- All new database operations should use the server client (`supabase/server.ts`) from Server Components or actions.
- Enable RLS on every new table. Write policies before writing application logic.
- Do not store sensitive data (PII, raw financial data) in `insights` JSONB without encryption considerations.
- Document processing (PDF parsing, AI analysis) will eventually need a separate backend service or Edge Function — design the `documents` table status field (`pending`, `processing`, `complete`, `error`) to support async processing.

---

## 11. Theming (Dark/Light Mode)

**Decision:** `next-themes` for client-side theme toggling; user preference persisted to Supabase user metadata

**Why:**
- `next-themes` integrates cleanly with App Router. It adds the `.dark` class to `<html>` before first paint, avoiding flash-of-wrong-theme.
- Persisting to user metadata (not localStorage) means preferences follow users across devices.
- On initial load, the root layout (Server Component) reads `user_metadata.theme` from Supabase and sets it as the `defaultTheme` prop on `ThemeProvider`.

**Font note:**
- Inter (body) and Space Grotesk (headings) are loaded via Google Fonts in the root layout with `display: swap` for performance.

**Going forward:**
- New components should use semantic color tokens (`bg-background`, `text-foreground`, `border-border`) — never hardcode light/dark-specific colors.
- When `updateThemeAction` is called, it updates both next-themes client state and Supabase user metadata.
- System theme (`prefers-color-scheme`) is supported as the "system" option.

---

## 12. Testing

**Decision:** Jest 30 + React Testing Library; test business logic and user journeys

**Philosophy:**
- Tests should reflect how a real user interacts with the product. Test what a button does, not what function it calls.
- Do not write tests for coverage metrics. A test that mocks everything and tests nothing is worse than no test.
- If a feature change breaks an existing test, evaluate whether the behavior change was intentional before updating the test.

**Test setup (`jest.setup.ts`):**
- Mocks `window.matchMedia`, `ResizeObserver`, `IntersectionObserver` (required by Radix UI + motion)
- Mocks `next/navigation` (useRouter, usePathname, redirect)
- Mocks `next-themes` (useTheme)
- Mocks `react-dom` (useFormStatus)
- Mocks React 19 `useActionState`

**Test utilities (`src/__tests__/test-utils.tsx`):**
- `createMockDocument()` — factory for document objects
- `createMockUser()` — factory for user objects
- `createMockSupabaseClient()` — chainable mock (supports `.from().select().eq()`, `.insert()`, `.update()`)

**Test location:** `src/__tests__/components/`

**Going forward:**
- Write or update tests for every new user-facing component.
- Use `createMockDocument()` / `createMockUser()` rather than inline fixtures.
- Run `npm run lint && npm test` before every commit (per CLAUDE.md rules).
- If you add a new server action, test it via the form component that uses it — test the user experience, not the action in isolation.

---

## 13. File & Project Structure

**Decision:** All source files under `src/`; Supabase utilities at root-level `supabase/`

```
src/
  app/          # Next.js routes, layouts, server actions
  components/   # Feature + composite components
  components/ui # shadcn/ui managed components (do not manually edit)
  hooks/        # Custom React hooks
  lib/          # Shared utilities (cn, etc.)
  utils/        # Non-React utilities (encodedRedirect, auth helpers)
  types/        # TypeScript type definitions
  __tests__/    # All test files

supabase/
  server.ts     # Supabase server client
  client.ts     # Supabase browser client
  middleware.ts  # Auth helper (NOT the active middleware — proxy.ts is)
```

**Path alias:** `@/*` maps to the project root. Use `@/src/components/...`, `@/supabase/server`, etc.

**Going forward:**
- New custom hooks → `src/hooks/`
- New utility functions (non-React) → `src/utils/`
- New feature components → `src/components/` (not `ui/`)
- Shared TypeScript types → `src/types/`
- Never put business logic directly in page files — extract to components or actions.

---

## 14. Font Strategy

**Decision:** Inter for body text, Space Grotesk for headings; both from Google Fonts

**Why:**
- Inter is the industry standard for clean, readable UI text — used by Vercel, Linear, Notion.
- Space Grotesk adds character to headings without being gimmicky — appropriate for a modern fintech product.
- Both fonts are loaded with `next/font/google` (automatically optimized — no external request at runtime, fonts are self-hosted by Next.js).

**Going forward:**
- Apply `font-sans` for body copy and `font-heading` (Space Grotesk) for page titles and major headings.
- Do not introduce additional fonts without a strong reason — font inconsistency is a common design failure.

---

## 15. Error Handling & Redirects

**Decision:** URL-encoded error messages via `encodedRedirect()` helper

**Why:**
- Server actions cannot directly set React state — they can only redirect or return data.
- Encoding error messages in URL query params (`?type=error&message=...`) allows the subsequent page render (a Server Component) to read the message and pass it to `FormMessage`.
- This is stateless and works without client JavaScript.

**Pattern:**
```typescript
// In a server action:
return encodedRedirect("error", "/sign-in", "Invalid email or password");

// In the page:
<FormMessage message={searchParams} />
```

**Going forward:**
- Use `encodedRedirect` for all server action error/success feedback that results in a redirect.
- For non-redirecting server actions (e.g., inline form state), return a state object and use `useActionState`.

---

## 16. Notifications (Toasts)

**Decision:** `sonner` toast library

**Why:**
- Sonner is lightweight, accessible, and has first-class Next.js/React support.
- It integrates with the existing shadcn/ui setup (`components/ui/sonner.tsx`).
- Positioned at bottom-right by default, non-intrusive for a data-focused product.

**Going forward:**
- Use `toast.success()`, `toast.error()`, `toast.loading()` for user feedback on async operations.
- Do not use browser `alert()` — always use sonner toasts.
- The `<Toaster />` component is already mounted in the root layout.

---

## 17. Charts & Data Visualization

**Decision:** `recharts` for data visualization

**Why:**
- Recharts is a well-maintained React charting library built on D3. It works naturally with React's component model.
- It is already installed and available. Use it for document insight visualizations (fee breakdowns, subscription costs, etc.).

**Going forward:**
- Wrap recharts components in a client component (`"use client"`) — they require browser APIs.
- Use the chart components in `components/ui/chart.tsx` (shadcn's chart wrapper) which adds theming support.
- Keep chart data transformations in a separate file or utility, not inside the component.

---

## 18. Icons

**Decision:** `lucide-react` exclusively

**Why:**
- Lucide is the shadcn/ui default icon set — consistent visual language.
- Tree-shakeable — only icons actually imported are included in the bundle.
- Covers essentially every icon needed for a financial/productivity app.

**Going forward:**
- Do not install additional icon libraries (Font Awesome, Heroicons, etc.) — use Lucide equivalents.
- If an icon doesn't exist in Lucide, create a simple SVG component rather than importing another library.

---

## Changelog

| Date | Decision Changed | Summary |
|------|-----------------|---------|
| 2026-03-04 | Initial population | Document created; captured all architectural decisions from codebase exploration |

> Update this table whenever a significant decision is added or changed.
