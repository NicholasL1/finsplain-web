# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture

**Finsplain Web** is an early-stage Next.js 16 app using the App Router, React 19, TypeScript (strict), and Tailwind CSS v4.

### Routing & Pages

File-based routing under `app/`. Current routes:

- `/` — Home
- `/how-it-works`, `/privacy` — Info pages
- `/login`, `/signup` — Auth pages
- `/documents`, `/upload` — Authenticated pages (gated by `isAuthenticated` in root layout)

Authentication is currently a placeholder (`isAuthenticated = false` hardcoded in `app/layout.tsx`). The nav bar conditionally renders items based on auth state.

### UI & Styling

- **shadcn/ui** (new-york style) with Radix UI primitives — configured in `components.json`
- Add new shadcn components via: `npx shadcn@latest add <component>`
- Tailwind v4 with OKLCH CSS variables for theming defined in `app/globals.css`
- Dark mode supported via `.dark` class
- Utility: `cn()` from `lib/utils.ts` merges Tailwind classes (clsx + tailwind-merge)
- Icons: `lucide-react`

### Component Patterns

- Pages are server components by default
- Client components use `"use client"` directive (e.g., `components/Nav.tsx`)
- UI primitives live in `components/ui/` (shadcn/ui managed)

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`).

## Operating Rules

- Always review this entire CLAUDE.md file before making changes.
- Follow architectural patterns described here.
- Do not introduce patterns that conflict with this document.
- If a change conflicts with these rules, explain why before proceeding.

## Mandatory After Every Change

You must:

1. Run all tests
2. Ensure all existing tests pass
3. Update tests to reflect intentional changes
4. Run the linter
5. Fix all linting issues
6. Confirm no business use cases were broken

## Additional Context Files

Claude must also read:

- docs/ARCHITECTURE.md
