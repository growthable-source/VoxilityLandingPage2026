"use client";

import { useId, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { newMetaEventId, readUtmParams, trackFreeBuildLead } from "@/lib/tracking";

const PAIN_OPTIONS = [
  "Website gets traffic but nobody enquires",
  "Barely anyone finds the website at all",
  "We're missing calls, or not ringing people back fast enough",
  "Not enough Google reviews",
  "Ads are running but not producing jobs",
  "No website yet — starting from scratch",
];

interface FormState {
  name: string;
  business: string;
  website: string;
  phone: string;
  email: string;
  pain: string;
}

const INITIAL: FormState = {
  name: "",
  business: "",
  website: "",
  phone: "",
  email: "",
  pain: "",
};

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function phoneLooksValid(s: string): boolean {
  return (s.match(/\d/g) || []).length >= 8;
}

export function FreeBuildForm() {
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Anti-spam. The API route drops anything with `homepage` filled or a
  // sub-3-second fill time; keep both or genuine submissions start vanishing.
  const formStartTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const uid = useId();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (data.name.trim().length < 2) next.name = "Pop your name in";
    if (data.business.trim().length < 2) next.business = "What's the business called?";
    if (data.website.trim().length < 3) {
      next.website = 'Give us a URL — or just write "none"';
    }
    if (!phoneLooksValid(data.phone)) next.phone = "We need a mobile to call you on";
    if (!emailLooksValid(data.email)) next.email = "Check that email address";
    if (!data.pain) next.pain = "Pick the closest one";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      document
        .querySelector<HTMLElement>("[data-invalid='true']")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const metaEventId = newMetaEventId();
    const utm = readUtmParams();

    try {
      const res = await fetch("/api/free-build", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          metaEventId,
          attribution: {
            ...utm,
            landingPage: window.location.href,
            referrer: document.referrer || undefined,
          },
          homepage: honeypot,
          formStartTime: formStartTime.current,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      trackFreeBuildLead(data.pain, metaEventId);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't send. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="gradient-border rounded-lg" id="claim">
        <div className="rounded-lg bg-card p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <Check className="h-6 w-6 text-primary" strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            You&rsquo;re in, {data.name.split(/\s+/)[0]}.
          </h3>
          <p className="mx-auto mt-3 max-w-[42ch] text-balance text-[15px] leading-relaxed text-muted-foreground">
            We&rsquo;re pulling your site apart now. The audit lands in your inbox
            at <span className="text-foreground/90">{data.email}</span> — that
            email is where you claim the free rebuild, so keep an eye out for it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border rounded-lg" id="claim">
      <form onSubmit={submit} noValidate className="rounded-lg bg-card p-6 shadow-card md:p-7">
        <h2 className="text-[21px] font-semibold tracking-tight text-foreground">
          Get your free build and teardown
        </h2>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          Takes about 40 seconds. The audit comes by email.
        </p>

        <p className="mt-5 rounded-md border border-primary/25 bg-primary/[0.06] px-3.5 py-3 text-[13px] leading-relaxed text-foreground/80">
          We only take six free builds a month so each one gets done properly. If
          this month is full we&rsquo;ll tell you straight away rather than
          stringing you along.
        </p>

        {/* Honeypot — off-screen, never seen by a person. */}
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
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <div className="mt-5 space-y-4">
          <Field
            id={`${uid}-name`}
            label="Your name"
            placeholder="Dave Thompson"
            autoComplete="name"
            value={data.name}
            onChange={(v) => update("name", v)}
            error={errors.name}
          />
          <Field
            id={`${uid}-business`}
            label="Business name"
            placeholder="Thompson Plumbing"
            autoComplete="organization"
            value={data.business}
            onChange={(v) => update("business", v)}
            error={errors.business}
          />
          <Field
            id={`${uid}-website`}
            label="Current website"
            hint='If you haven&rsquo;t got one, just write "none".'
            placeholder="thompsonplumbing.com.au"
            value={data.website}
            onChange={(v) => update("website", v)}
            error={errors.website}
          />
          <Field
            id={`${uid}-phone`}
            label="Mobile"
            type="tel"
            inputMode="tel"
            placeholder="0412 345 678"
            autoComplete="tel"
            value={data.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
          />
          <Field
            id={`${uid}-email`}
            label="Email"
            type="email"
            inputMode="email"
            placeholder="dave@thompsonplumbing.com.au"
            autoComplete="email"
            hint="This is where the audit goes, so make it one you check."
            value={data.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
          />

          <div>
            <label
              htmlFor={`${uid}-pain`}
              className="mb-2 block text-[13px] font-medium text-foreground/85"
            >
              What&rsquo;s hurting most right now?
            </label>
            <select
              id={`${uid}-pain`}
              value={data.pain}
              onChange={(e) => update("pain", e.target.value)}
              aria-invalid={Boolean(errors.pain)}
              data-invalid={Boolean(errors.pain)}
              className={cn(
                "h-11 w-full rounded-md border bg-input px-3 text-[15px] text-foreground transition-fast focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.pain
                  ? "border-destructive/60 focus:border-destructive/70"
                  : "border-border/60 focus:border-primary/60",
                !data.pain && "text-muted-foreground/70",
              )}
            >
              <option value="">Pick one…</option>
              {PAIN_OPTIONS.map((option) => (
                <option key={option} value={option} className="text-foreground">
                  {option}
                </option>
              ))}
            </select>
            {errors.pain && (
              <p className="mt-1.5 text-[12px] text-destructive">{errors.pain}</p>
            )}
          </div>
        </div>

        {serverError && (
          <p
            role="alert"
            className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
          >
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 py-3.5 text-[16px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.01] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Sending…" : "Send me the audit"}
        </button>

        <p className="mt-3.5 text-center text-[12px] leading-relaxed text-muted-foreground">
          No card, no lock-in contract. The build is yours whether you work with
          us afterwards or not.
        </p>
      </form>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = "text",
  inputMode,
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-foreground/85">
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
        data-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(
          "h-11 w-full rounded-md border bg-input px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/50 transition-fast focus:outline-none focus:ring-2 focus:ring-primary/20",
          error
            ? "border-destructive/60 focus:border-destructive/70"
            : "border-border/60 focus:border-primary/60",
        )}
      />
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[12px] text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-[12px] text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}
