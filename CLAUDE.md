# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Next.js dev server with Turbopack (default port 3000).
- `npm run build` — production build.
- `npm start` — serve the production build on **port 3010** (not 3000).
- `npm run lint` — `next lint`.

No test framework is configured.

## Deployment

`main` is the production branch; Vercel auto-deploys on push. Treat any push to `main` as going live. Secrets must stay out of commits — only `CONTACT_WEBHOOK_URL` is read at runtime (see `.env.example`); if unset, contact-form submissions log to the server console instead of being forwarded.

## Architecture

This is a single-purpose marketing site for Xovera (Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict). It is not a product app — there is no database, no auth, no client state beyond the contact form.

### Page composition

- [src/app/page.tsx](src/app/page.tsx) is the landing page and is just an ordered list of section components imported from [src/components/sections/](src/components/sections/). The order of those imports **is** the narrative flow of the page (Nav → Hero → Platform → Leak → System → VoxAI → Proof → Fit → Onboarding → AgenciesBlock → FAQ → CTA → Footer). Re-ordering sections is a copy/design decision, not a refactor.
- Standalone routes: `/agencies`, `/privacy`, `/terms`, `/acceptable-use`. Legal pages all use [src/components/sections/LegalShell.tsx](src/components/sections/LegalShell.tsx), which wraps content in `Nav` + `Footer` + the `.legal-prose` typography utility.
- [src/app/layout.tsx](src/app/layout.tsx) forces dark mode (`<html className="dark">`), wires Geist Sans/Mono, emits Organization + WebSite JSON-LD, and injects the Xovera AI chat widget site-wide via `<Script src="https://app.xovera.io/widget.js" strategy="afterInteractive">`. Site metadata (title, description, OG, robots, sitemap entries) lives here and in [src/app/sitemap.ts](src/app/sitemap.ts) / [src/app/robots.ts](src/app/robots.ts) — keep them in sync when adding routes.

### Design system

The design system is CSS-first and lives entirely in [src/app/globals.css](src/app/globals.css). There is no `tailwind.config.*`:

- **Tokens** are HSL CSS variables in `:root` (`--background`, `--primary`, `--primary-glow`, `--primary-deep`, `--accent`, gradients, shadows, transitions).
- The `@theme inline { ... }` block re-exports those variables as Tailwind v4 theme tokens, which is what makes classes like `bg-background`, `text-primary-glow`, `shadow-glow` work.
- **Signature utilities** are hand-written in the same file and used heavily across sections: `.text-gradient`, `.bg-gradient-hero`, `.bg-gradient-mesh`, `.mesh-bg`, `.noise`, `.grid-overlay`, `.gradient-border`, `.conic-border`, `.heat-text`, `.letterbox`, `.marquee-track`, `.legal-prose`. Prefer these over re-implementing gradients/borders ad-hoc.
- Custom keyframes (`fade-in-up`, `orb-float`, `glow-pulse`, `shimmer`, `marquee`, `rotate-conic`) are wired as `--animate-*` theme tokens, usable via `animate-fade-in-up` etc. A `prefers-reduced-motion` block disables them globally.

### UI primitives

[src/components/ui/](src/components/ui/) holds the building blocks reused across sections. Use them rather than inlining equivalents:

- `Button` — variants `hero | premium | glass | accent | ghost`, sizes `default | lg | xl`. Renders `<button>`, `next/link`, or `<a target="_blank">` depending on `href` / `external` props.
- `Section`, `SectionEyebrow`, `SectionHeading`, `SectionLede` — every page section should sit inside `Section` for consistent vertical rhythm (`py-20 md:py-28`) and the 1320px container.
- `Card`, `Logo`, `BrandLogo`, `IntegrationsRow`, `PartnerStrip` — recurring layout fragments.

`cn()` from [src/lib/cn.ts](src/lib/cn.ts) (clsx + tailwind-merge) is the canonical class-merging helper.

### Contact form

[src/components/sections/ContactForm.tsx](src/components/sections/ContactForm.tsx) (`"use client"`) is a 3-step qualifier that POSTs JSON to [src/app/api/contact/route.ts](src/app/api/contact/route.ts). The API route has two anti-spam mechanisms that the client must keep cooperating with:

1. **Honeypot** — a `website` field that real users never see; if non-empty, the server returns `{ ok: true }` without forwarding.
2. **Time-trap** — submissions arriving < 3000 ms after `formStartTime` are silently dropped the same way.

If you change the form, preserve `website` and `formStartTime` in the payload or genuine submissions will start getting dropped.

## Path alias

`@/*` resolves to `./src/*` ([tsconfig.json](tsconfig.json)). Always use `@/components/...`, `@/lib/...` over relative imports.

## Brand & copy guidance

Tone, ICP, and visual style for Xovera are captured in user-level memory ([xovera_tone](~/.claude/projects/-Users-ryan-XoveraLandingPage2026/memory/xovera_tone.md), `xovera_style`, `xovera_icp`, `xovera_company`). When writing copy or visuals, consult those before improvising — the site has a deliberate American-English, warm-peer-to-peer voice and a dark/fiery aesthetic that the design tokens above encode.
