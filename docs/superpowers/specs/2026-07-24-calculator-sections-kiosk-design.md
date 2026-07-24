# Calculator sections + kiosk messaging — design

Date: 2026-07-24 · Approved by Ryan in session

## Goal

1. Make the missed-revenue calculators a first-class part of every funnel page
   instead of a one-line cross-link, and surface them (plus the live voice
   demos) from the homepage and footer.
2. Introduce the live kiosk / in-person signing capability on the two verticals
   where walk-ins matter most: med spas and gyms.

## Confirmed product facts (source: Ryan, this session)

The kiosk is **live today** and does exactly three things we may market:

- Agreements/waivers/consent forms signed on a tablet at the front desk
- New client/member signs up for a membership or package and **pays on the spot**
- Walk-in lead capture / check-in that drops the person into the follow-up pipeline

**Not confirmed, must not be claimed:** appointment booking at the kiosk.

## Changes

### 1. Vertical type (`src/lib/verticals/types.ts`)

- `calcCopy.section: { eyebrow: string; heading: Highlighted; lede: string }`
  (required) — copy for the new full calculator section on the landing page.
- `kiosk?: { eyebrow: string; heading: Highlighted; lede: string; items: KioskItem[] }`
  (optional) — only med-spas defines it. `KioskItem` = icon
  (`"PenLine" | "CreditCard" | "UserCheck"`) + title + body.

### 2. Shared presentational components (`src/components/verticals/`)

- `CalculatorSection.tsx` — centered eyebrow/heading/lede + conic-border CTA
  button ("Run the 60-second calculator") + mono trust line
  ("Free · no signup · about a minute"). Props take a rendered heading node so
  both the template (via `HL`) and the bespoke gym page can use it.
- `KioskSection.tsx` — eyebrow/heading/lede + 3 `Card` items (same card idiom
  as the methods grid). Same prop pattern.

### 3. Vertical template (`VerticalPage.tsx`)

- Keep the existing slim cross-link near the hero (early hook).
- Insert `CalculatorSection` (id `calculator`) **after the problem section**,
  before methods — the "so what's *your* number?" payoff.
- Insert `KioskSection` (id `kiosk`) **after the methods section**, rendered
  only when `vertical.kiosk` is set.

### 4. Configs (`src/lib/verticals/*.ts`)

- All five verticals get `calcCopy.section` copy (per-niche, existing voice).
- `med-spas.ts` additionally gets the `kiosk` block (consent forms, packages,
  walk-in capture).

### 5. Gym page (`src/app/ai-for-gyms/page.tsx`, bespoke)

- `KioskSection` after the three-growth-methods section (waiver before the
  first workout, membership + payment before the tour ends, walk-in check-in).
- `CalculatorSection` after the live-demo section, linking to `/gym-calculator`.
  (The gym page has no problem/real-numbers section, so the demo → "quantify
  it" transition is the equivalent slot.)

### 6. Homepage industry hub (`src/components/sections/IndustryHub.tsx`)

- New section, id `industries`, placed **after `Leak`** in `page.tsx`.
- 6 cards (5 registry verticals + hardcoded gym entry). Each card: industry
  name, one-line hook, and two CTAs:
  - "Talk to the AI live" → `/ai-for-<slug>#demo` (gym: `/ai-for-gyms#demo`)
  - "Run the 60-second calculator" → `/ai-for-<slug>/calculator`
    (gym: `/gym-calculator`)

### 7. VoxAI section CTA (`VoxAI.tsx`)

- One button under the closing paragraph: "Talk to it live — free, no signup"
  → `#industries`. Closes the loop on a section that currently makes claims
  with no way to verify them.

### 8. Footer (`Footer.tsx`)

- New "Calculators" column (6 links, gym included); desktop link grid goes
  from 5 to 6 columns.

## Out of scope

- No new routes; sitemap/SEO metadata untouched.
- No tracking changes (calculator pages already fire CalculatorStart/Complete).
- Dark/light theme parity via existing tokens only.

## Verification & ship

`npm run build` must pass clean. Commit only files belonging to this feature
(pre-existing working-tree edits to `GoogleTag.tsx` / `tracking.ts` stay
uncommitted), then push to `main` (= production via Vercel).
