"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import {
  AFTER_HOURS_LABELS,
  RESPONSE_SPEED_LABELS,
  calculateMissedRevenue,
  formatUSD,
  roundResults,
  type AfterHours,
  type CalcInputs,
  type CalcResults,
  type ResponseSpeed,
} from "@/lib/revenueMath";
import { readUtmParams, trackCalcComplete, trackCalcStart } from "@/lib/tracking";
import type { Vertical } from "@/lib/verticals/types";

type Stage = 1 | 2 | 3;

interface Details {
  firstName: string;
  orgName: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
}

const INITIAL_DETAILS: Details = {
  firstName: "",
  orgName: "",
  email: "",
  phone: "",
  smsOptIn: false,
};

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function phoneLooksValid(s: string): boolean {
  return (s.match(/\d/g) || []).length >= 7;
}

/**
 * Three-step missed-revenue calculator shared by every vertical. Sliders, chips,
 * and the results copy all read from the vertical's `calc` config; results are
 * recomputed server-side by /api/vertical-calculator (client numbers are a
 * fallback). Generalized from the gym calculator.
 */
export function RevenueCalculator({ vertical }: { vertical: Vertical }) {
  const calc = vertical.calc;

  const INITIAL_INPUTS: CalcInputs = {
    monthlyInquiries: calc.inputs.monthlyInquiries.default,
    avgValue: calc.inputs.avgValue.default,
    repeatFactor: calc.inputs.repeatFactor.default,
    responseSpeed: "sameday",
    afterHours: "voicemail",
  };

  const STAGE_LABELS: Record<Stage, string> = {
    1: `Your ${vertical.noun}`,
    2: "How you respond",
    3: "Get your numbers",
  };

  const [stage, setStage] = useState<Stage>(1);
  const [inputs, setInputs] = useState<CalcInputs>(INITIAL_INPUTS);
  const [details, setDetails] = useState<Details>(INITIAL_DETAILS);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Details, boolean>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [results, setResults] = useState<CalcResults | null>(null);

  const formStartTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  const started = useRef(false);
  const fieldId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stage > 1) headingRef.current?.focus();
  }, [stage]);

  const markStarted = () => {
    if (!started.current) {
      started.current = true;
      trackCalcStart(vertical.slug);
    }
  };

  const updateInput = <K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) => {
    markStarted();
    setInputs((v) => ({ ...v, [key]: value }));
  };

  const updateDetail = <K extends keyof Details>(key: K, value: Details[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateField = (key: keyof Details): string | undefined => {
    let msg: string | undefined;
    const v = details[key];
    if (key === "firstName" && !String(v).trim())
      msg = "Please enter your first name.";
    else if (key === "orgName" && !String(v).trim())
      msg = `Please enter your ${vertical.orgLabel.toLowerCase()}.`;
    else if (key === "email") {
      if (!String(v).trim()) msg = "Please enter your email.";
      else if (!emailLooksValid(String(v))) msg = "That email doesn't look right.";
    } else if (key === "phone") {
      if (!String(v).trim()) msg = "Please enter a phone number.";
      else if (!phoneLooksValid(String(v))) msg = "That number looks too short.";
    }
    setErrors((e) => ({ ...e, [key]: msg }));
    return msg;
  };

  const blur = (key: keyof Details) => {
    setTouched((t) => ({ ...t, [key]: true }));
    validateField(key);
  };

  const validateDetails = (): boolean => {
    const fields: (keyof Details)[] = ["firstName", "orgName", "email", "phone"];
    let ok = true;
    for (const f of fields) {
      setTouched((t) => ({ ...t, [f]: true }));
      if (validateField(f)) ok = false;
    }
    return ok;
  };

  const submit = async () => {
    if (!validateDetails()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/vertical-calculator", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          vertical: vertical.slug,
          firstName: details.firstName,
          orgName: details.orgName,
          email: details.email,
          phone: details.phone,
          smsOptIn: details.smsOptIn,
          inputs,
          utm: readUtmParams(),
          website: honeypot,
          formStartTime: formStartTime.current,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        results?: CalcResults;
      };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      // Anti-spam drops return ok without results — fall back to the local
      // calculation so the reveal never breaks for a real visitor.
      const finalResults =
        json.results ?? roundResults(calculateMissedRevenue(inputs, calc));
      setResults(finalResults);
      trackCalcComplete(vertical.slug, finalResults.missedMonthlyRevenue);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't send. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (results) {
    return (
      <div ref={cardRef} className="gradient-border rounded-lg scroll-mt-24">
        <div className="rounded-lg bg-card p-6 shadow-card md:p-10">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
              <Check className="h-4 w-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Your estimate · based on industry averages
            </div>
          </div>

          <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[30px]">
            Here&rsquo;s what the numbers suggest, {details.firstName}.
          </h3>

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ResultStat
              value={formatUSD(results.missedMonthlyRevenue)}
              label="in bookings likely missed each month"
              emphasize
            />
            <ResultStat
              value={formatUSD(results.annualRevenue)}
              label="revenue impact over the next 12 months"
              emphasize
            />
            <ResultStat
              value={`~${results.lostCustomersPerMonth}`}
              label={`${calc.unitPlural} per month going elsewhere`}
            />
          </div>

          <p className="mt-7 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
            These are estimates built on industry averages — up to 35% of calls
            to service businesses go unanswered, and 78% of callers book with
            whoever answers first. Each {calc.unitSingular} you keep is worth
            about {formatUSD(results.customerValue)} to your {vertical.noun} over
            time. Your real numbers might land higher or lower, and we&rsquo;d be
            happy to walk through them with you.
          </p>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted-foreground">
            We&rsquo;ll email a copy of this breakdown to{" "}
            <span className="text-foreground/90">{details.email}</span> along
            with a short guide to closing the gap.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="conic-border inline-flex rounded-md">
              <Button variant="hero" size="lg" href={`/ai-for-${vertical.slug}#contact`}>
                Book a 20-min demo
              </Button>
            </div>
            <Button variant="glass" size="lg" href={`/ai-for-${vertical.slug}`}>
              See how it works
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="gradient-border rounded-lg scroll-mt-24">
      <div className="rounded-lg bg-card p-6 shadow-card md:p-8">
        {/* Progress */}
        <div className="mb-7">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Step {stage} of 3
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-glow">
              {STAGE_LABELS[stage]}
            </span>
          </div>
          <div className="relative h-1 overflow-hidden rounded-full bg-border/60">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-deep via-primary to-primary-glow transition-smooth"
              style={{ width: `${(stage / 3) * 100}%` }}
            />
          </div>
        </div>

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

        {stage === 1 && (
          <div className="space-y-8">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              A few quick numbers about your {vertical.noun}.
            </h3>
            <Slider
              label={calc.inputs.monthlyInquiries.label}
              hint={calc.inputs.monthlyInquiries.hint}
              value={inputs.monthlyInquiries}
              limits={calc.inputs.monthlyInquiries}
              format={(v) =>
                v >= calc.inputs.monthlyInquiries.max ? `${v}+` : String(v)
              }
              onChange={(v) => updateInput("monthlyInquiries", v)}
            />
            <Slider
              label={calc.inputs.avgValue.label}
              hint={calc.inputs.avgValue.hint}
              value={inputs.avgValue}
              limits={calc.inputs.avgValue}
              format={(v) => `$${v.toLocaleString("en-US")}`}
              onChange={(v) => updateInput("avgValue", v)}
            />
            <Slider
              label={calc.inputs.repeatFactor.label}
              hint={calc.inputs.repeatFactor.hint}
              value={inputs.repeatFactor}
              limits={calc.inputs.repeatFactor}
              format={(v) => `${v} ${calc.inputs.repeatFactor.unit}`}
              onChange={(v) => updateInput("repeatFactor", v)}
            />
          </div>
        )}

        {stage === 2 && (
          <div className="space-y-7">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              And how inquiries get handled today.
            </h3>
            <ChipGroup<ResponseSpeed>
              label="When a lead calls, fills out a form, or sends a DM, how quickly does someone usually reply?"
              options={RESPONSE_SPEED_LABELS}
              value={inputs.responseSpeed}
              onChange={(v) => updateInput("responseSpeed", v)}
            />
            <ChipGroup<AfterHours>
              label="What happens to calls in the evening and on weekends?"
              options={AFTER_HOURS_LABELS}
              value={inputs.afterHours}
              onChange={(v) => updateInput("afterHours", v)}
            />
          </div>
        )}

        {stage === 3 && (
          <div className="space-y-5">
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              Where should we send your numbers?
            </h3>
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              You&rsquo;ll see your results right away — we&rsquo;ll also email
              you the full breakdown so you can share it with your team.
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id={fieldId + "-fn"}
                label="First name"
                value={details.firstName}
                onChange={(v) => updateDetail("firstName", v)}
                onBlur={() => blur("firstName")}
                error={touched.firstName ? errors.firstName : undefined}
                autoComplete="given-name"
              />
              <Field
                id={fieldId + "-org"}
                label={vertical.orgLabel}
                value={details.orgName}
                onChange={(v) => updateDetail("orgName", v)}
                onBlur={() => blur("orgName")}
                error={touched.orgName ? errors.orgName : undefined}
                autoComplete="organization"
              />
            </div>
            <Field
              id={fieldId + "-em"}
              label="Email"
              type="email"
              inputMode="email"
              value={details.email}
              onChange={(v) => updateDetail("email", v)}
              onBlur={() => blur("email")}
              error={touched.email ? errors.email : undefined}
              autoComplete="email"
            />
            <Field
              id={fieldId + "-ph"}
              label="Phone"
              type="tel"
              inputMode="tel"
              value={details.phone}
              onChange={(v) => updateDetail("phone", v)}
              onBlur={() => blur("phone")}
              error={touched.phone ? errors.phone : undefined}
              autoComplete="tel"
              hint="Include country code if outside the US (e.g. +1, +44, +61)."
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border/50 bg-muted/60 p-4 transition-fast hover:border-border">
              <input
                type="checkbox"
                checked={details.smsOptIn}
                onChange={(e) => updateDetail("smsOptIn", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border/60 bg-input accent-primary"
              />
              <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/90">
                  Send me marketing texts (optional).
                </span>{" "}
                By checking this box, I agree to receive recurring marketing text
                messages from Xovera — including product updates and relevant
                offers — at the number I provided. Message frequency varies. Msg
                &amp; data rates may apply. Reply STOP to unsubscribe. Consent
                isn&rsquo;t a condition of purchase. See our Privacy Policy and
                Terms.
              </span>
            </label>

            <p className="text-[11.5px] leading-relaxed text-muted-foreground/80">
              We&rsquo;ll use your details to send the breakdown and follow up
              about your results. We don&rsquo;t share them, and you can ask us
              to delete them at any time.
            </p>

            {serverError && (
              <p
                role="alert"
                className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-[13px] text-destructive"
              >
                {serverError}
              </p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-3">
          {stage > 1 ? (
            <button
              type="button"
              onClick={() => setStage((s) => (s - 1) as Stage)}
              className="inline-flex h-11 items-center rounded-md border border-border/60 bg-muted/60 px-4 text-[14px] text-foreground/85 transition-fast hover:border-border hover:bg-muted"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {stage < 3 ? (
            <button
              type="button"
              onClick={() => {
                markStarted();
                setStage((s) => (s + 1) as Stage);
              }}
              className="inline-flex h-11 items-center justify-center rounded-md bg-gradient-primary px-6 text-[14px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gradient-primary px-6 text-[14px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Calculating…" : "Show my numbers"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultStat({
  value,
  label,
  emphasize,
}: {
  value: string;
  label: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-md border border-border/50 bg-muted/40 p-5">
      <div
        className={cn(
          "font-mono text-[28px] font-semibold tracking-tight md:text-[32px]",
          emphasize ? "heat-text" : "text-foreground",
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      <div className="mt-2 text-[12.5px] leading-snug text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

interface SliderProps {
  label: string;
  hint?: string;
  value: number;
  limits: { min: number; max: number; step: number };
  format: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ label, hint, value, limits, format, onChange }: SliderProps) {
  const id = useId();
  const fill = ((value - limits.min) / (limits.max - limits.min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[13px] font-medium text-foreground/85">
          {label}
          {hint && (
            <span className="mt-0.5 block text-[12px] font-normal text-muted-foreground">
              {hint}
            </span>
          )}
        </label>
        <span
          className="shrink-0 font-mono text-[20px] font-semibold tracking-tight text-primary-glow"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={limits.min}
        max={limits.max}
        step={limits.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-input"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
        aria-valuetext={format(value)}
      />
    </div>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<T, string>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 block text-[13px] font-medium leading-relaxed text-foreground/85">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(options) as T[]).map((key) => {
          const selected = value === key;
          return (
            <button
              type="button"
              key={key}
              onClick={() => onChange(key)}
              aria-pressed={selected}
              className={cn(
                "inline-flex h-10 items-center rounded-md border px-4 text-[13.5px] tracking-tight transition-fast",
                selected
                  ? "border-primary/70 bg-primary/15 text-foreground shadow-glow-soft"
                  : "border-border/60 bg-muted/50 text-foreground/85 hover:border-primary/40 hover:bg-muted",
              )}
            >
              {options[key]}
            </button>
          );
        })}
      </div>
    </fieldset>
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
