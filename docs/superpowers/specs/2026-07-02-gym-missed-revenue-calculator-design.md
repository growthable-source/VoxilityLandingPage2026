# Gym Missed-Revenue Calculator — Design

**Date:** 2026-07-02
**Status:** Implemented (autonomous session — assumptions documented below for review)

## Goal

A calculator funnel for Facebook/Instagram ad traffic aimed at gym and fitness
studio owners. The ad promises "find out what missed calls and slow follow-up
cost your gym"; the page delivers that number, captures the lead before the
reveal, and hands the lead to the CRM for a follow-up email sequence.

**Primary metric: completed calculator completions** — a completion is a
successful lead submit + results reveal, tracked as a Meta Pixel `Lead` event
plus a `CalculatorComplete` custom event.

## Route & page

- `/gym-calculator` — standalone funnel page (added to sitemap).
- Slim header (logo + theme toggle only, no nav links) and slim footer
  (Privacy/Terms) — ad landing pages shouldn't offer exits.
- Composition: hero promise → calculator card → three industry-stat cards
  (echoing the home page "Leak" numbers, reframed for gyms) → what-happens-next
  note → slim footer.
- Mobile-first: FB/IG traffic is predominantly mobile.

## Calculator flow

1. **Step 1 — volume & value** (sliders): monthly inquiries, average monthly
   membership price, average member stay in months.
2. **Step 2 — response habits** (chip radios): reply speed during business
   hours; what happens to calls after hours/weekends.
3. **Step 3 — details gate**: first name, gym name, email, phone, optional SMS
   opt-in. Honeypot + 3s time-trap, same as the contact form.
4. **Results**: missed members/month, missed monthly membership revenue, and
   12-month revenue impact. CTA to book a strategy call (`/#contact`).

Tracking events: `CalculatorStart` custom event on first interaction;
`Lead` + `CalculatorComplete` (with value = missed monthly revenue) on
completion; matching `dataLayer` pushes (`gym_calculator_start` /
`gym_calculator_complete`) for GTM/GA. UTM params + `fbclid` are read from the
landing URL and included in the lead payload for attribution.

## Model (src/lib/gymMath.ts — pure, shared client/server)

Assumptions (all surfaced to the user as "industry averages, estimate only"):

| Constant | Value | Basis |
|---|---|---|
| Share of inquiries that are calls / forms+DMs | 60% / 40% | service-business mix |
| Calls missed — answered "always" / "sometimes" / "voicemail after hours" | 6% / 23% / 37% | 23% anchors to the industry stat already on the home page |
| Missed callers who never reconnect | 75% | missed-call research |
| Leads lost to slow reply — <5m / within hour / same day / next day+ | 5% / 20% / 40% / 60% | lead-response studies (8x qualification within 60s) |
| Inquiry → joined member close rate | 35% | typical gym tour/trial close |

Outputs:
- `lostMembersPerMonth = inquiries × (0.6·missedRate·0.75 + 0.4·speedLoss) × 0.35`
- `missedMonthlyRevenue = lostMembersPerMonth × membershipPrice`
- `twelveMonthRevenue = Σ over 12 monthly cohorts of price × min(stay, months remaining)` — honest "collected within the next 12 months" figure, not an inflated LTV.

The API route recomputes results server-side from the raw inputs — client
numbers are display-only.

## Lead capture (src/app/api/calculator/route.ts)

Mirrors `/api/contact`: JSON POST, honeypot (`website`) + time-trap
(`formStartTime`), field clamping/validation, forwards to
`CALCULATOR_WEBHOOK_URL` (falls back to `CONTACT_WEBHOOK_URL`; logs to console
when neither is set). Payload includes `source: "gym-calculator"`, contact
fields, raw inputs, server-computed results, UTM/fbclid, smsOptIn, timestamp,
UA, IP.

## Pixel

`NEXT_PUBLIC_META_PIXEL_ID` (optional) renders the Meta Pixel site-wide via a
`MetaPixel` component in the root layout. All `fbq` calls are guarded, so
nothing breaks when the pixel is absent (dev, pixel not yet created).

## Follow-up emails

`docs/emails/gym-calculator-follow-up.md` — a 5-email sequence (instant, day 1,
day 3, day 5, day 7) written in the Xovera voice, with merge fields that map
1:1 to the webhook payload keys, ready to paste into GoHighLevel.

## Open items for Ryan

- The repo has no gym-specific page today (site targets appointment-driven
  service businesses broadly); this page is the first gym-vertical surface.
  Copy stays consistent with the Xovera system story.
- Set `NEXT_PUBLIC_META_PIXEL_ID` and `CALCULATOR_WEBHOOK_URL` in Vercel to
  activate tracking and CRM handoff.
