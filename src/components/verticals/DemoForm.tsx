"use client";

import { useId, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { newMetaEventId, readUtmParams, trackDemoRequest } from "@/lib/tracking";
import type { Vertical } from "@/lib/verticals/types";

const VOLUME_BUCKETS = ["Under 50", "50–200", "200–500", "500+"];

interface FormState {
  firstName: string;
  orgName: string;
  email: string;
  phone: string;
  volume: string;
}

const INITIAL: FormState = {
  firstName: "",
  orgName: "",
  email: "",
  phone: "",
  volume: "",
};

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function phoneLooksValid(s: string): boolean {
  return (s.match(/\d/g) || []).length >= 7;
}

/**
 * Generic demo/lead form for every vertical page → /api/vertical-demo.
 * Preserves the site-wide anti-spam contract: honeypot `website` + `formStartTime`
 * time-trap. Generalized from the gym demo form.
 */
export function DemoForm({ vertical }: { vertical: Vertical }) {
  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formStartTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const fieldId = useId();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateField = (key: keyof FormState): string | undefined => {
    let msg: string | undefined;
    const v = data[key];
    if (key === "firstName" && !v.trim()) msg = "Please enter your name.";
    else if (key === "orgName" && !v.trim())
      msg = `Please enter your ${vertical.orgLabel.toLowerCase()}.`;
    else if (key === "email") {
      if (!v.trim()) msg = "Please enter your work email.";
      else if (!emailLooksValid(v)) msg = "That email doesn't look right.";
    } else if (key === "phone") {
      if (!v.trim()) msg = "Please enter a phone number.";
      else if (!phoneLooksValid(v)) msg = "That number looks too short.";
    } else if (key === "volume" && !v) {
      msg = "Please pick one.";
    }
    setErrors((e) => ({ ...e, [key]: msg }));
    return msg;
  };

  const blur = (key: keyof FormState) => {
    setTouched((t) => ({ ...t, [key]: true }));
    validateField(key);
  };

  const submit = async () => {
    const fields: (keyof FormState)[] = [
      "firstName",
      "orgName",
      "email",
      "phone",
      "volume",
    ];
    let ok = true;
    for (const f of fields) {
      setTouched((t) => ({ ...t, [f]: true }));
      if (validateField(f)) ok = false;
    }
    if (!ok) return;

    setSubmitting(true);
    setServerError(null);
    // One id shared by the API route's Conversions API events and the browser
    // pixel events below, so Meta counts the pair once.
    const metaEventId = newMetaEventId();
    try {
      const res = await fetch("/api/vertical-demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          vertical: vertical.slug,
          source: vertical.demoSource,
          metaEventId,
          firstName: data.firstName,
          orgName: data.orgName,
          email: data.email,
          phone: data.phone,
          volume: data.volume,
          utm: readUtmParams(),
          website: honeypot,
          formStartTime: formStartTime.current,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      setSubmitted(true);
      trackDemoRequest(vertical.demoSource, metaEventId);
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
      <div className="gradient-border rounded-lg">
        <div className="rounded-lg bg-card p-8 text-center shadow-card md:p-10">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
            Thanks, {data.firstName}.
          </h3>
          <p className="mx-auto mt-3 max-w-[44ch] text-balance text-[15px] leading-relaxed text-muted-foreground">
            We&rsquo;ll reach out within one business day to set up your demo —
            usually much sooner. If anything&rsquo;s urgent, reply to the
            confirmation email we just sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border rounded-lg">
      <div className="relative rounded-lg bg-card p-6 shadow-card md:p-8">
        {/* Honeypot — hidden from users */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              id={fieldId + "-fn"}
              label="Your name"
              value={data.firstName}
              onChange={(v) => update("firstName", v)}
              onBlur={() => blur("firstName")}
              error={touched.firstName ? errors.firstName : undefined}
              autoComplete="given-name"
            />
            <Field
              id={fieldId + "-org"}
              label={vertical.orgLabel}
              value={data.orgName}
              onChange={(v) => update("orgName", v)}
              onBlur={() => blur("orgName")}
              error={touched.orgName ? errors.orgName : undefined}
              autoComplete="organization"
            />
          </div>
          <Field
            id={fieldId + "-em"}
            label="Work email"
            type="email"
            inputMode="email"
            value={data.email}
            onChange={(v) => update("email", v)}
            onBlur={() => blur("email")}
            error={touched.email ? errors.email : undefined}
            autoComplete="email"
          />
          <Field
            id={fieldId + "-ph"}
            label="Phone"
            type="tel"
            inputMode="tel"
            value={data.phone}
            onChange={(v) => update("phone", v)}
            onBlur={() => blur("phone")}
            error={touched.phone ? errors.phone : undefined}
            autoComplete="tel"
            hint="Include country code if outside the US (e.g. +1, +44, +61)."
          />

          <fieldset>
            <legend className="mb-2 block text-[13px] font-medium text-foreground/85">
              Calls &amp; leads per month
            </legend>
            <div className="flex flex-wrap gap-2">
              {VOLUME_BUCKETS.map((opt) => {
                const selected = data.volume === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      update("volume", opt);
                      setTouched((t) => ({ ...t, volume: true }));
                    }}
                    aria-pressed={selected}
                    className={cn(
                      "inline-flex h-9 items-center rounded-md border px-3.5 text-[13px] tracking-tight transition-fast",
                      selected
                        ? "border-primary/70 bg-primary/15 text-foreground shadow-glow-soft"
                        : "border-border/60 bg-muted/50 text-foreground/85 hover:border-primary/40 hover:bg-muted",
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {touched.volume && errors.volume && (
              <p className="mt-1.5 text-[12px] text-destructive">
                {errors.volume}
              </p>
            )}
          </fieldset>

          {serverError && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
            >
              {serverError}
            </p>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 text-[15px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.01] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Sending…" : "Book my demo"}
          </button>

          <p className="text-center text-[11.5px] leading-relaxed text-muted-foreground/80">
            No spam. We&rsquo;ll only use this to set up your demo.
          </p>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  hint?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  inputMode,
  autoComplete,
  hint,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-medium text-foreground/85"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(
          "h-11 w-full rounded-md border bg-input px-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-fast focus:outline-none focus:ring-2 focus:ring-primary/20",
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
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
