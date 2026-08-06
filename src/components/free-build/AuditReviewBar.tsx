"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import type { AuditStatus } from "@/lib/audit/types";

/**
 * The human-review gate. Nothing reaches a lead's inbox until someone has read
 * this page and pressed send — the audit is generated automatically, but it is
 * not published automatically.
 */
export function AuditReviewBar({
  token,
  reviewKey,
  status,
  recipient,
}: {
  token: string;
  reviewKey: string;
  status: AuditStatus;
  recipient: string;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(status !== "ready");
  const [error, setError] = useState<string | null>(null);

  const approve = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/audit/approve", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, key: reviewKey }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Send failed.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sticky bottom-0 z-50 border-t border-primary/30 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-3.5 md:px-8">
        <div className="text-[13.5px] text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.16em] text-primary">
            Review mode
          </span>
          <span className="mx-2">·</span>
          {sent ? (
            <>
              Sent to <span className="text-foreground/90">{recipient}</span>. The
              lead sees this page without this bar.
            </>
          ) : (
            <>
              Check every number against the source, then send to{" "}
              <span className="text-foreground/90">{recipient}</span>.
            </>
          )}
        </div>

        {!sent && (
          <button
            type="button"
            onClick={approve}
            disabled={sending}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-gradient-primary px-5 text-[14px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {sending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            {sending ? "Sending…" : "Approve & send"}
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="px-5 pb-3 text-[13px] text-destructive md:px-8">
          {error}
        </p>
      )}
    </div>
  );
}
