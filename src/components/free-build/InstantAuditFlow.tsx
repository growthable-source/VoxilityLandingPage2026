"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  newMetaEventId,
  readUtmParams,
  trackFreeBuildLead,
  trackInstantAuditStart,
} from "@/lib/tracking";

// The URL-first funnel: web address in → analysis runs → contact details in
// while it works → "Show me my report" opens /audit/<token> with the findings.

/** The checks, in the order the copy walks through them while they wait. */
const CHECK_STEPS = [
  "Loading your site the way a visitor on a phone does",
  "Reading what the top of your page actually says",
  "Running Google's mobile speed test on your real URL",
  "Checking tap-to-call, forms and the basics",
  "Looking up your Google rating and review count",
  "Comparing you to nearby businesses in your category",
  "Writing up the findings in plain English",
];

const POLL_MS = 3000;
/** Cosmetic pacing for the checklist — the analysis itself sets the real pace. */
const STEP_MS = 6500;

type Analysis = "running" | "done" | "failed";

export function InstantAuditFlow() {
  const [stage, setStage] = useState<"url" | "analysing">("url");
  const [website, setWebsite] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis>("running");
  const [stepIndex, setStepIndex] = useState(0);

  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gateErrors, setGateErrors] = useState<{
    business?: string;
    email?: string;
    phone?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [contactDone, setContactDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formStartTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  // ── Poll the analysis while it runs ────────────────────────────────────────
  useEffect(() => {
    if (!token || analysis !== "running") return;
    const id = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/instant-audit/status?token=${encodeURIComponent(token)}`,
        );
        if (!res.ok) return;
        const json = (await res.json()) as { analysis?: Analysis };
        if (json.analysis && json.analysis !== "running") {
          setAnalysis(json.analysis);
        }
      } catch {
        // Transient network blips just mean we poll again.
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [token, analysis]);

  // ── Walk the cosmetic checklist forward ────────────────────────────────────
  useEffect(() => {
    if (stage !== "analysing") return;
    const id = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, CHECK_STEPS.length - 1));
    }, STEP_MS);
    return () => clearInterval(id);
  }, [stage]);

  // ── Both halves done → open the report ─────────────────────────────────────
  useEffect(() => {
    if (contactDone && analysis !== "running" && token) {
      window.location.href = `/audit/${token}`;
    }
  }, [contactDone, analysis, token]);

  const start = async (event: React.FormEvent) => {
    event.preventDefault();
    if (website.trim().length < 4) {
      setUrlError("Pop your web address in — like thompsonplumbing.com.au");
      return;
    }
    setStarting(true);
    setUrlError(null);
    try {
      const utm = readUtmParams();
      const res = await fetch("/api/instant-audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          website: website.trim(),
          attribution: {
            ...utm,
            landingPage: window.location.href,
            referrer: document.referrer || undefined,
          },
          homepage: honeypot,
          formStartTime: formStartTime.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        token?: string;
      };
      if (!res.ok || !json.token) {
        throw new Error(json.error ?? "Something went wrong.");
      }
      setToken(json.token);
      setStage("analysing");
      trackInstantAuditStart();
    } catch (err) {
      setUrlError(
        err instanceof Error ? err.message : "Couldn't start the check. Try again.",
      );
    } finally {
      setStarting(false);
    }
  };

  const submitContact = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors: typeof gateErrors = {};
    if (business.trim().length < 2) errors.business = "What's the business called?";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Check that email address";
    if ((phone.match(/\d/g) || []).length < 8) errors.phone = "We need a mobile for the delivery call";
    setGateErrors(errors);
    if (Object.keys(errors).length > 0 || !token) return;

    setSubmitting(true);
    setServerError(null);
    const metaEventId = newMetaEventId();
    try {
      const res = await fetch("/api/instant-audit/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          business: business.trim(),
          email: email.trim(),
          phone: phone.trim(),
          metaEventId,
          homepage: honeypot,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      trackFreeBuildLead("instant-audit", metaEventId);
      setContactDone(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't send. Please try again.",
      );
      setSubmitting(false);
    }
    // On success `submitting` stays true — the redirect effect takes it from here.
  };

  // ── Stage 1: the one box ───────────────────────────────────────────────────
  if (stage === "url") {
    return (
      <div className="gradient-border rounded-lg" id="claim">
        <form onSubmit={start} noValidate className="rounded-lg bg-card p-6 shadow-card md:p-7">
          <h2 className="text-[21px] font-semibold tracking-tight text-foreground">
            See what your website&rsquo;s costing you
          </h2>
          <p className="mt-1.5 text-[14px] text-muted-foreground">
            Enter your web address and we&rsquo;ll analyse it on the spot. No
            details needed to start — the check takes about a minute.
          </p>

          <Honeypot value={honeypot} onChange={setHoneypot} />

          <div className="mt-5">
            <label
              htmlFor="instant-url"
              className="mb-2 block text-[13px] font-medium text-foreground/85"
            >
              Your website address
            </label>
            <input
              id="instant-url"
              type="url"
              inputMode="url"
              placeholder="thompsonplumbing.com.au"
              autoComplete="url"
              value={website}
              onChange={(e) => {
                setWebsite(e.target.value);
                if (urlError) setUrlError(null);
              }}
              aria-invalid={Boolean(urlError)}
              className={cn(
                "h-12 w-full rounded-md border bg-input px-3.5 text-[16px] text-foreground placeholder:text-muted-foreground/50 transition-fast focus:outline-none focus:ring-2 focus:ring-primary/20",
                urlError
                  ? "border-destructive/60 focus:border-destructive/70"
                  : "border-border/60 focus:border-primary/60",
              )}
            />
            {urlError && (
              <p className="mt-1.5 text-[12px] text-destructive">{urlError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={starting}
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3.5 text-[16px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.01] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {starting ? "Starting the check…" : "Analyse my website"}
          </button>

          <p className="mt-3.5 text-center text-[12px] leading-relaxed text-muted-foreground">
            A real analysis of your live site — every number measured, nothing
            guessed. No website yet? Enter your Facebook page instead; the
            free build still stands.
          </p>
        </form>
      </div>
    );
  }

  // ── Stage 2: the wait + the gate ───────────────────────────────────────────
  return (
    <div className="gradient-border rounded-lg" id="claim">
      <div className="rounded-lg bg-card p-6 shadow-card md:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[21px] font-semibold tracking-tight text-foreground">
            {analysis === "running" ? "Analysing your site now" : "Your report is ready"}
          </h2>
          {analysis === "running" && (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
          )}
        </div>

        <ul className="mt-5 grid gap-2.5" aria-live="polite">
          {CHECK_STEPS.map((step, index) => {
            const done = analysis !== "running" || index < stepIndex;
            const current = analysis === "running" && index === stepIndex;
            if (!done && !current) return null;
            return (
              <li
                key={step}
                className="flex items-start gap-2.5 text-[14px] text-foreground/85"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-primary/15 ring-1 ring-primary/30" : "",
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

        <div className="mt-6 border-t border-border/60 pt-5">
          <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
            Where should the findings go?
          </h3>
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            The report opens right here on this page — these details are where
            we deliver the free build.
          </p>

          <form onSubmit={submitContact} noValidate className="mt-4 space-y-3.5">
            <GateField
              id="gate-business"
              label="Company name"
              placeholder="Thompson Plumbing"
              autoComplete="organization"
              value={business}
              onChange={setBusiness}
              error={gateErrors.business}
            />
            <GateField
              id="gate-email"
              label="Email"
              type="email"
              inputMode="email"
              placeholder="dave@thompsonplumbing.com.au"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              error={gateErrors.email}
            />
            <GateField
              id="gate-phone"
              label="Mobile"
              type="tel"
              inputMode="tel"
              placeholder="0412 345 678"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
              error={gateErrors.phone}
            />

            {serverError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3.5 text-[16px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.01] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting
                ? contactDone && analysis === "running"
                  ? "Finishing the last checks…"
                  : "One moment…"
                : "Show me my report"}
            </button>
            <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
              Then, if you like what you see: a brand-new site, built free and
              delivered on a 15&ndash;30 minute call.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
    >
      <label>
        Homepage
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

function GateField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-foreground/85">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-11 w-full rounded-md border bg-input px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/50 transition-fast focus:outline-none focus:ring-2 focus:ring-primary/20",
          error
            ? "border-destructive/60 focus:border-destructive/70"
            : "border-border/60 focus:border-primary/60",
        )}
      />
      {error && <p className="mt-1.5 text-[12px] text-destructive">{error}</p>}
    </div>
  );
}
