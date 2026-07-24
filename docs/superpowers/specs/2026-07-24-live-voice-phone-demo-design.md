# Ringing-phone live voice demo — design

Date: 2026-07-24 · Approved by Ryan in session

## Goal

Replace the never-configured widget-based hero demo on the 5 vertical pages
with the real in-browser voice call experience Ryan built for the outbound
email tool's `/try/<slug>` pages (VX1 `ghl-agent` repo): the animated
incoming-call phone, ringing animation, tap-Answer → live mic conversation.

## Decisions (Ryan, this session)

- VX1 ghl-agent is deployed at **https://app.xovera.io** — the marketing site
  mints tokens from its public, CORS-open `/api/public/voice-demo/web-token`.
- Scope now: **phone + live call on the 5 vertical pages** with the single
  fixed demo agent that endpoint serves.
- Phase 2 (not built): the training option ("build my AI from your website")
  — requires a new self-serve, rate-limited public endpoint in the VX1 repo;
  per-vertical agents — requires the web-token route to accept a
  vertical/agent parameter. Homepage phone: not now.

## Implementation

- `src/lib/voice/gemini-live.ts`, `audio-client.ts` — ported from VX1
  (`lib/copilot/providers/gemini-live.ts`, `lib/copilot/audio-client.ts`)
  with types inlined; behaviorally identical. New dep: `@google/genai`.
- `src/lib/voice/use-voice-call.ts` — adapted from VX1's
  `usePublicVoiceCall`; token endpoint is
  `${NEXT_PUBLIC_VOICE_API_BASE}/api/public/voice-demo/web-token`.
  Exports `VOICE_DEMO_CONFIGURED` (env set?).
- `src/components/verticals/PhoneDemo.tsx` — ported PhoneMockup, restyled to
  the dark token system (card/muted/border/primary; green answer + red
  decline kept). Keyframes `.phone-wiggle` / `.ring-dot` added to globals.css.
- `src/components/verticals/VoiceDemo.tsx` — reworked: phone experience when
  configured; tapping a "Try asking" chip also answers; post-call CTA row.
  Fallback (sample + book-a-demo) when env is unset, the endpoint 503s, or
  errors occur. `LiveVoiceWidget.tsx` and its env vars removed.
- Tracking preserved: `VoiceDemoStart` on Answer; `CompletedWebDemo` at 30s
  of live call (mid-call timer + on-end backstop, fired once).

## Ops checklist (Ryan)

- Marketing site Vercel: `NEXT_PUBLIC_VOICE_API_BASE=https://app.xovera.io`.
- app.xovera.io Vercel: `VOICE_DEMO_AGENT_ID` + `GEMINI_API_KEY`
  (route 503s → graceful fallback until set). Session cap
  `VOICE_DEMO_MAX_SECS` defaults to 120s server-side.
