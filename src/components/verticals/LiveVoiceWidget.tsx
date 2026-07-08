"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
//  ⬇️  RYAN — THIS IS WHERE YOUR VOICE WIDGET GOES.  ⬇️
//
//  You said you have your own in-browser voice agent. There are two ways to
//  wire it in; pick one:
//
//  A) NO CODE (env vars) — set these in Vercel / .env.local and you're live:
//       NEXT_PUBLIC_VOICE_WIDGET_SRC   = the <script src> your provider gives you
//       NEXT_PUBLIC_VOICE_AGENT_ID     = your public agent / assistant id
//     This file injects that script once and renders an <elevenlabs-convai
//     agent-id="…"> custom element (the common ElevenLabs Conversational AI
//     pattern). If your provider uses a different element/attribute, tweak the
//     `renderEmbed()` return below — it's the only thing to change.
//
//  B) PASTE CODE — drop your provider's React/JSX embed straight into
//     `renderEmbed()` and ignore the env vars.
//
//  When a real conversation starts and ends, call the callbacks so ad tracking
//  fires correctly:
//       props.onSessionStart()   → fires VoiceDemoStart
//       props.onSessionComplete() → fires CompletedWebDemo (the Google Ads
//                                    optimization event). Call it once the
//                                    caller has had a real exchange (≥30s or
//                                    ≥2 turns). A 30s fallback timer is wired
//                                    below in VoiceDemo in case you don't hook
//                                    your provider's events.
// ─────────────────────────────────────────────────────────────────────────────

const WIDGET_SRC = process.env.NEXT_PUBLIC_VOICE_WIDGET_SRC;
const AGENT_ID = process.env.NEXT_PUBLIC_VOICE_AGENT_ID;

/** True once Ryan has configured a live widget (env) or pasted an embed. */
export const LIVE_VOICE_CONFIGURED = Boolean(WIDGET_SRC || AGENT_ID);

export function LiveVoiceWidget({ agentId }: { agentId?: string }) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current || !WIDGET_SRC) return;
    if (document.querySelector(`script[src="${WIDGET_SRC}"]`)) {
      loaded.current = true;
      return;
    }
    const s = document.createElement("script");
    s.src = WIDGET_SRC;
    s.async = true;
    s.type = "text/javascript";
    document.body.appendChild(s);
    loaded.current = true;
  }, []);

  return renderEmbed(agentId ?? AGENT_ID);
}

function renderEmbed(agentId?: string) {
  // Default: ElevenLabs Conversational AI custom element. Replace this return
  // with your own embed if your provider differs.
  if (!agentId) return null;
  return (
    // @ts-expect-error — custom element provided by the injected widget script
    <elevenlabs-convai agent-id={agentId} />
  );
}
