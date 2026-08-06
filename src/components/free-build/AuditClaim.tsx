"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { newMetaEventId, trackAuditViewed, trackFreeBuildClaimed } from "@/lib/tracking";

/**
 * Records that the audit was opened. Only reachable from the emailed link, so
 * it doubles as proof the address is real and being read — which is the whole
 * reason the audit is emailed rather than promised on the call.
 */
export function AuditViewTracker({ token }: { token: string }) {
  const fired = useRef(false);

  useEffect(() => {
    // Guard against React's double-invoked effects in development.
    if (fired.current) return;
    fired.current = true;
    trackAuditViewed(token);
  }, [token]);

  return null;
}

export function AuditClaimButton({
  token,
  alreadyClaimed,
}: {
  token: string;
  alreadyClaimed: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [claimed, setClaimed] = useState(alreadyClaimed);
  const [error, setError] = useState<string | null>(null);

  const claim = async () => {
    setSubmitting(true);
    setError(null);

    const metaEventId = newMetaEventId();
    try {
      const res = await fetch("/api/audit/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, metaEventId }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        bookingUrl?: string | null;
      };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");

      setClaimed(true);
      trackFreeBuildClaimed();

      if (json.bookingUrl) {
        window.location.href = json.bookingUrl;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't do that. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (claimed) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/[0.07] p-6 text-center">
        <p className="text-[17px] font-medium text-foreground">
          Your rebuild is claimed.
        </p>
        <p className="mx-auto mt-2 max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
          We&rsquo;ve started on it. If you haven&rsquo;t picked a time for the
          call yet, we&rsquo;ll be in touch to sort one out.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={claim}
        disabled={submitting}
        className="inline-flex h-14 items-center justify-center gap-2.5 rounded-md bg-gradient-primary px-9 text-[17px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {submitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
        {submitting ? "One moment…" : "Claim my free rebuild"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-[13px] text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
