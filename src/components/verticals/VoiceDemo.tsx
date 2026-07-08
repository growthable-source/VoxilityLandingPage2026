"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { VoiceSampleButton } from "@/components/gyms/VoiceSampleButton";
import {
  LiveVoiceWidget,
  LIVE_VOICE_CONFIGURED,
} from "@/components/verticals/LiveVoiceWidget";
import { trackCompletedWebDemo, trackVoiceDemoStart } from "@/lib/tracking";
import type { Vertical } from "@/lib/verticals/types";

// Seconds of live conversation after which we count a "completed web demo" —
// the report's Google Ads optimization event. Fired on a fallback timer unless
// the provider's own turn/end events call window.xoveraCompletedWebDemo first.
const COMPLETE_AFTER_MS = 30_000;

declare global {
  interface Window {
    /** Ryan's widget can call this on a real completed conversation. */
    xoveraCompletedWebDemo?: () => void;
  }
}

/**
 * The ungated hero demo. A visitor clicks "Talk to the receptionist" and speaks
 * to the agent in-browser — zero form (the report's aha moment). Ryan's live
 * widget mounts on click (see LiveVoiceWidget); until it's configured, we reveal
 * a graceful sample + book-a-demo fallback so the hero is never dead.
 */
export function VoiceDemo({ vertical }: { vertical: Vertical }) {
  const [launched, setLaunched] = useState(false);
  const completed = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireComplete = () => {
    if (completed.current) return;
    completed.current = true;
    trackCompletedWebDemo(vertical.slug);
  };

  useEffect(() => {
    window.xoveraCompletedWebDemo = fireComplete;
    return () => {
      if (timer.current) clearTimeout(timer.current);
      if (window.xoveraCompletedWebDemo === fireComplete) {
        window.xoveraCompletedWebDemo = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const launch = () => {
    if (launched) return;
    setLaunched(true);
    trackVoiceDemoStart(vertical.slug);
    if (LIVE_VOICE_CONFIGURED) {
      timer.current = setTimeout(fireComplete, COMPLETE_AFTER_MS);
    }
  };

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

        {!launched ? (
          <>
            <h2 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
              Talk to the {vertical.noun} receptionist.
            </h2>
            <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
              No signup, no credit card. Ask it anything a client would — it
              answers in a real voice, right here in your browser.
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={launch}
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
                    Free · unlimited · no signup
                  </span>
                </span>
              </button>
            </div>

            {/* Suggested prompts */}
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
              No signup · no credit card · talk as long as you like
            </p>
          </>
        ) : (
          <div className="mt-6">
            {LIVE_VOICE_CONFIGURED ? (
              <div className="flex flex-col items-center">
                <VoiceOrb />
                <p className="mt-5 text-center text-[14px] text-muted-foreground">
                  Connecting you to the {vertical.noun} receptionist — allow mic
                  access when your browser asks.
                </p>
                <div className="mt-5 w-full">
                  <LiveVoiceWidget />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <VoiceOrb />
                <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
                  The live browser demo is warming up. In the meantime, hear a
                  real sample call — or book a 20-minute demo and we&rsquo;ll
                  show it answering a real call for your {vertical.noun}.
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
        )}
      </div>
    </div>
  );
}

/** Pulsing mic orb shown while a call is active / connecting. */
function VoiceOrb() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary/25" />
      <span
        className="absolute inset-2 rounded-full bg-primary/20"
        style={{ animation: "orb-pulse 2s ease-in-out 0.4s infinite" }}
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-primary">
        <Mic className={cn("h-6 w-6")} strokeWidth={2.25} />
      </span>
    </div>
  );
}
