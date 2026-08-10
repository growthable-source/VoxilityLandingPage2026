"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { ANALYSIS_STEPS } from "@/components/free-build/content";

// The animated wait: a progress bar that eases toward done and the analysis
// checklist ticking through. Used on the landing page while the audit runs and
// on the report's holding state, so both feel like the same machine working.
//
// The pacing here is cosmetic — the analysis sets its own pace and the parent
// tells us when it's actually finished. The bar eases toward ~92% and holds,
// then snaps to 100% on completion, which is honest about being an estimate
// without ever appearing stuck.

const TICK_MS = 200;
/** Time constant for the easing — ~63% of the way there after this long. */
const EASE_S = 28;
const STEP_MS = 5500;
const MAX_BEFORE_DONE = 92;

export type AnalysisPhase = "running" | "done" | "failed";

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function AnalysisProgress({ phase }: { phase: AnalysisPhase }) {
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setElapsedMs((t) => t + TICK_MS), TICK_MS);
    return () => clearInterval(id);
  }, [phase]);

  const percent =
    phase === "running"
      ? Math.round(MAX_BEFORE_DONE * (1 - Math.exp(-elapsedMs / 1000 / EASE_S)))
      : 100;
  const stepIndex =
    phase === "running"
      ? Math.min(Math.floor(elapsedMs / STEP_MS), ANALYSIS_STEPS.length - 1)
      : ANALYSIS_STEPS.length;

  return (
    <div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Website analysis progress"
      >
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[13px] font-medium text-foreground/85">
            {phase === "running" ? (
              <>
                Analysing…{" "}
                <span className="font-mono text-[12px] text-muted-foreground">
                  {formatElapsed(elapsedMs)}
                </span>
              </>
            ) : (
              "Analysis complete"
            )}
          </span>
          <span className="font-mono text-[12px] text-primary">{percent}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-primary transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ul className="mt-5 grid gap-2.5" aria-live="polite">
        {ANALYSIS_STEPS.map((step, index) => {
          const done = index < stepIndex;
          const current = phase === "running" && index === stepIndex;
          if (!done && !current) return null;
          return (
            <li
              key={step}
              className="flex items-start gap-2.5 text-[14px] text-foreground/85"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full",
                  done && "bg-primary/15 ring-1 ring-primary/30",
                )}
              >
                {done ? (
                  <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                )}
              </span>
              <span className={done ? "" : "text-muted-foreground"}>{step}…</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
