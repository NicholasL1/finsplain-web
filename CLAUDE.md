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
