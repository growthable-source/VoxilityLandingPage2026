"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VoiceSampleButton } from "@/components/gyms/VoiceSampleButton";
import { PhoneDemo } from "@/components/verticals/PhoneDemo";
import { useVoiceCall, VOICE_DEMO_CONFIGURED } from "@/lib/voice/use-voice-call";
import { trackCompletedWebDemo, trackVoiceDemoStart } from "@/lib/tracking";
import type { Vertical } from "@/lib/verticals/types";

// Seconds of live conversation after which we count a "completed web demo" —
// the Google Ads optimization event.
const COMPLETE_AFTER_SECS = 30;

/**
 * The ungated hero demo — a ringing phone the visitor answers to talk to
 * the AI receptionist live in the browser (mic → Gemini Live, token minted
 * by the Xovera app's public voice-demo endpoint). The phase-driven /try
 * experience this is ported from lives in the VX1 repo; this version has
 * no training step — one shared demo agent, answer and talk.
 *
 * Until NEXT_PUBLIC_VOICE_API_BASE is set (or whenever the endpoint says
 * the demo agent isn't configured), the card falls back to a sample
 * recording + book-a-demo so the hero is never dead.
 */
export function VoiceDemo({ vertical }: { vertical: Vertical }) {
  const completed = useRef(false);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireComplete = () => {
    if (completed.current) return;
    completed.current = true;
    trackCompletedWebDemo(vertical.slug);
  };

  const { state, error, secondsLeft, startCall, endCall } = useVoiceCall({
    onEnded: ({ secsUsed }) => {
      if (secsUsed >= COMPLETE_AFTER_SECS) fireComplete();
    },
  });

  // Fire the completion event mid-call once the conversation is real —
  // don't wait for hang-up.
  useEffect(() => {
    if (state !== "live") return;
    completeTimer.current = setTimeout(fireComplete, COMPLETE_AFTER_SECS * 1000);
    return () => {
      if (completeTimer.current) clearTimeout(completeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onCall = state === "connecting" || state === "live";

  const answer = () => {
    if (onCall) return;
    trackVoiceDemoStart(vertical.slug);
    void startCall();
  };

  const hangup = () => void endCall("ended");

  // Fallback mode: no API base configured, or the endpoint reported the
  // demo agent isn't live yet (503). Same graceful sample + book-a-demo.
  const [fallback, setFallback] = useState(!VOICE_DEMO_CONFIGURED);
  const [fallbackLaunched, setFallbackLaunched] = useState(false);
  useEffect(() => {
    if (state === "unavailable") {
      // The visitor already tapped Answer — skip the fallback's own launch
      // button and land straight on the sample + book-a-demo content.
      setFallback(true);
      setFallbackLaunched(true);
    }
  }, [state]);

  return (
    <div className="conic-border rounded-2xl">
      <div className="relative overflow-hidden rounded-2xl bg-card/95 p-6 shadow-card backdrop-blur-sm md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
              <span className="absolute inset-0 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Live demo · talk to it now
            </span>
          </div>
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:inline-flex">
            <Sparkles className="h-3 w-3 text-primary" /> {vertical.name}
          </span>
        </div>

        <h2 className="mt-5 text-balance text-center text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
          Talk to the {vertical.noun} receptionist.
        </h2>
        <p className="mx-auto mt-2 max-w-[46ch] text-center text-[15px] leading-relaxed text-muted-foreground">
          No signup, no credit card. Answer the call and ask it anything a
          client would — it answers in a real voice, right here in your
          browser.
        </p>

        {!fallback ? (
          <>
            {/* The phone */}
            <div className="mt-8 flex justify-center">
              <PhoneDemo
                callerName="Xovera Receptionist"
                callerDetail={`AI receptionist · ${vertical.name} demo`}
                onCall={onCall}
                connecting={state === "connecting"}
                secondsLeft={secondsLeft}
                statusLabel="ringing"
                answerDisabled={false}
                onAnswer={answer}
                onHangup={hangup}
              />
            </div>

            {error && (
              <p className="mx-auto mt-5 max-w-[46ch] text-center text-[13px] leading-relaxed text-destructive">
                {error}
              </p>
            )}

            {state === "ended" && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="hero" size="lg" href="#contact">
                  Get this answering your calls
                </Button>
                <VoiceSampleButton />
              </div>
            )}

            {/* Suggested prompts — tapping one answers the call */}
            <div className="mt-7">
              <p className="mb-2.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Try asking
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {vertical.hero.demoPrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={answer}
                    disabled={onCall}
                    className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-[12.5px] text-foreground/80 transition-fast hover:border-primary/40 hover:bg-muted disabled:cursor-default disabled:opacity-60"
                  >
                    &ldquo;{p}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
              Free · no signup · a real two-minute call
            </p>
          </>
        ) : !fallbackLaunched ? (
          <>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setFallbackLaunched(true);
                  trackVoiceDemoStart(vertical.slug);
                }}
                className="group inline-flex h-16 items-center gap-4 rounded-full bg-gradient-primary pl-3 pr-8 text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
                  <Mic className="h-5 w-5" strokeWidth={2.25} />
                </span>
                <span className="text-left">
                  <span className="block text-[16px] font-semibold leading-tight">
                    Talk to the receptionist
                  </span>
                  <span className="block text-[12px] font-normal leading-tight text-primary-foreground/80">
                    Free · no signup
                  </span>
                </span>
              </button>
            </div>

            <div className="mt-6">
              <p className="mb-2.5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Try asking
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {vertical.hero.demoPrompts.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3.5 py-1.5 text-[12.5px] text-foreground/80"
                  >
                    &ldquo;{p}&rdquo;
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted-foreground/80">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />
              No signup · no credit card
            </p>
          </>
        ) : (
          <div className="mt-6 flex flex-col items-center text-center">
            <VoiceOrb />
            <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
              The live browser demo is warming up. In the meantime, hear a
              real sample call — or book a 20-minute demo and we&rsquo;ll show
              it answering a real call for your {vertical.noun}.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <VoiceSampleButton />
              <Button variant="hero" size="lg" href="#contact">
                Book a live demo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Pulsing mic orb shown in the fallback state. */
function VoiceOrb() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary/25" />
      <span
        className="absolute inset-2 rounded-full bg-primary/20"
        style={{ animation: "orb-pulse 2s ease-in-out 0.4s infinite" }}
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-primary">
        <Mic className="h-6 w-6" strokeWidth={2.25} />
      </span>
    </div>
  );
}
