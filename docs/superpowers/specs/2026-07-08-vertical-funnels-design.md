# Vertical Landing-Page Funnels — Design Spec

**Date:** 2026-07-08
**Source:** CRO/growth report (`compass_artifact…`) — ungated demo → self-serve funnel for an AI voice receptionist, med-spa wedge first, then more verticals.

## Goal

Ship a **data-driven vertical template** that produces message-matched, fully-SEO'd landing pages for five service niches, each with the report's funnel structure and its own missed-revenue calculator. Med spas is the flagship (richest copy). The existing `/ai-for-gyms` page and its `/gym-calculator` stay **untouched** (proven + live) — the new system runs alongside them.

## Verticals (this round)

| Slug | Display | Signup CTA dest |
|---|---|---|
| `med-spas` | Med Spas (flagship) | `xovera.io/med-spas` |
| `dental` | Dental & Orthodontics | `xovera.io/dental` |
| `medical-weight-loss` | Medical Weight-Loss | `xovera.io/medical-weight-loss` |
| `home-services` | Home Services (HVAC/Plumbing) | `xovera.io/home-services` |
| `chiropractic` | Chiropractic & Physical Therapy | `xovera.io/chiropractic` |

Signup URLs are centralized per-vertical (Ryan's answer: "xovera.io/<niche>"). One-line to change.

## Architecture

**Data layer** — one file per vertical, zero-conflict for parallel authoring:
- `src/lib/verticals/types.ts` — the `Vertical` contract (SEO, hero, metrics, integrations, pain stats, methods, demo copy, voice copy, FAQs incl. HIPAA for medical, chat script, calc model + copy, signupUrl).
- `src/lib/verticals/<slug>.ts` — one config object each.
- `src/lib/verticals/index.ts` — registry (`getVertical`, `VERTICAL_SLUGS`).

**Calc model** — `src/lib/revenueMath.ts`: gym math generalized, parameterized by each vertical's `CalcModel` (labels, limits, closeRate, missed-call rates, per-period value + repeat factor). Pure/dependency-free so the API recomputes server-side. Gym keeps its own `gymMath.ts`.

**Components** — `src/components/verticals/`:
- `VoiceDemo.tsx` (client) — the ungated hero demo. Big "🎙️ Talk to the receptionist" button + suggested prompts + trust microcopy ("No signup. No credit card."). Lazy-mounts Ryan's live voice widget via a single documented integration point (env: `NEXT_PUBLIC_VOICE_WIDGET_SRC` / `NEXT_PUBLIC_VOICE_AGENT_ID`, optional per-vertical agent id). Fires `VoiceDemoStart` on click and `CompletedWebDemo` (the report's ad-optimization event) after ≥30s of a live session. Graceful fallback to the scripted `ChatDemo` + canned voice sample when no widget is configured, so the page is never dead.
- `ChatDemo.tsx` — generic scripted conversation from `vertical.chatDemo`.
- `DemoForm.tsx` — generic 5-field lead form → `/api/vertical-demo` (honeypot + 3s time-trap, same contract as contact form). Fires `Lead` + `DemoRequest`.
- `VerticalFAQ.tsx` — accordion + `FAQPage` JSON-LD from `vertical.faqs`.
- `RevenueCalculator.tsx` — generic 3-step calculator (sliders + chips + gated reveal) → `/api/vertical-calculator`. Fires `CalculatorStart` / `CalculatorComplete`.
- `StickyMobileCTA.tsx` — persistent mobile "Talk to the demo" bar (report: +~17% mobile).
- `VerticalPage.tsx` — the template composing all sections in the report's order: Hero+VoiceDemo → How-it-works → Problem/value (real numbers) → ChatDemo → Feature grid → Voice section → Setup → Demo form → sibling-vertical internal links → FAQ.

**Routes:**
- `src/app/ai-for-[vertical]/page.tsx` — `generateStaticParams` + per-page `generateMetadata` (title/desc/canonical/OG/Twitter) + `Service` JSON-LD. 404s unknown slugs.
- `src/app/ai-for-[vertical]/calculator/page.tsx` — lean standalone calculator funnel (slim header, no site nav), the report's ad-destination pattern. Cross-linked from the main page.

**API** (new, gym routes untouched):
- `src/app/api/vertical-demo/route.ts`
- `src/app/api/vertical-calculator/route.ts` — recomputes results server-side via `revenueMath` + the posted vertical's model.

**Tracking** (`src/lib/tracking.ts`, additive): `trackVoiceDemoStart`, `trackCompletedWebDemo`, `trackStartedPaidSignup`, plus generic `trackCalcStart(name)` / `trackCalcComplete(name, value)` and reuse of `trackDemoRequest`.

**SEO wiring:** `sitemap.ts` generates all vertical + calculator URLs from `VERTICAL_SLUGS`; each page canonical + OG + JSON-LD; robots unchanged (allows all, blocks `/api/`).

## Events (report's funnel)

`VoiceDemoStart` → `CompletedWebDemo` (≥30s live session — the Google Ads optimization target) → `EmailCaptured`/`DemoRequest` (form) → `StartedPaidSignup` (signup CTA click) → `Subscribed` (deferred to product). All guarded no-ops without a pixel.

## Non-goals

- Not touching gym page/calculator/APIs.
- Not building real telephony/provisioning (demo is Ryan's widget; paid number is the paywalled product).
- Not building auth/billing (`Subscribed` fires in the product, off-site).

## Copy guidance

American English, warm peer-to-peer, numbers over hype, 5th–7th grade, no confrontational/finger-pointing tone (per Voxility/Xovera tone memory). Real vertical economics as social proof of the problem (med spa: up to 35% missed calls, $7,800+ LTV, 78% buy from first responder). Med spa FAQ must address HIPAA/BAA explicitly; dental, weight-loss, chiropractic likewise handle PHI.
