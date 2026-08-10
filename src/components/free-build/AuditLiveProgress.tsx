"use client";

import { useEffect, useState } from "react";
import { AnalysisProgress, type AnalysisPhase } from "@/components/free-build/AnalysisProgress";

// The report page while the analysis is still running: live progress instead
// of "refresh shortly". Polls the status and reloads the page the moment the
// report is ready, so the server render takes over with the full findings.

const POLL_MS = 3000;

export function AuditLiveProgress({
  token,
  business,
}: {
  token: string;
  business: string;
}) {
  const [phase, setPhase] = useState<AnalysisPhase>("running");

  useEffect(() => {
    if (phase !== "running") {
      // Brief pause so the bar visibly completes before the report replaces it.
      const id = setTimeout(() => window.location.reload(), 900);
      return () => clearTimeout(id);
    }
    const id = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/instant-audit/status?token=${encodeURIComponent(token)}`,
        );
        if (!res.ok) return;
        const json = (await res.json()) as { analysis?: AnalysisPhase };
        if (json.analysis && json.analysis !== "running") {
          setPhase(json.analysis);
        }
      } catch {
        // Network blip — poll again.
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [token, phase]);

  return (
    <main className="mx-auto max-w-[640px] px-5 py-16 md:px-8 md:py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        Website teardown
      </p>
      <h1
        className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        style={{ lineHeight: 1.08, letterSpacing: "-0.03em" }}
      >
        {phase === "running"
          ? `We're analysing ${business} now.`
          : "Done — opening your report."}
      </h1>
      <p className="mt-4 text-[15.5px] leading-relaxed text-muted-foreground">
        Every number in the report is measured on your live site — nothing is
        guessed. This page will open it the moment it&rsquo;s ready.
      </p>

      <div className="mt-9 rounded-lg border border-border/60 bg-card p-6 shadow-card md:p-7">
        <AnalysisProgress phase={phase} />
      </div>

      <p className="mt-7 text-[14px] leading-relaxed text-muted-foreground">
        While you wait: the report ends with a button that requests a
        brand new site for {business}, built free and delivered the same day
        on a 15 minute call. It&rsquo;s yours to keep either way.
      </p>
    </main>
  );
}
