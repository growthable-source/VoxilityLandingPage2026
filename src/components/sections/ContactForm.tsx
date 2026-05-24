"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const AD_SPEND = [
  "Less than $2,000",
  "$2,000–$5,000",
  "$5,000–$15,000",
  "$15,000+",
  "Not running ads yet",
];
const CRM = [
  "GoHighLevel",
  "HubSpot",
  "Salesforce",
  "Pipedrive",
  "Other",
  "None",
];
const TEAM_SIZE = ["1–10", "11–25", "26–50", "50+"];
const ROLE = [
  "Owner / founder",
  "Practice manager",
  "Marketing lead",
  "Operations",
  "Other",
];

interface FormState {
  firstName: string;
  company: string;
  email: string;
  phone: string;
  adSpend: string;
  crm: string;
  teamSize: string;
  role: string;
  notes: string;
  smsOptIn: boolean;
}

const INITIAL: FormState = {
  firstName: "",
  company: "",
  email: "",
  phone: "",
  adSpend: "",
  crm: "",
  teamSize: "",
  role: "",
  notes: "",
  smsOptIn: false,
};

function emailLooksValid(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function phoneLooksValid(s: string): boolean {
  return (s.match(/\d/g) || []).length >= 7;
}

export function ContactForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
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

  // Anti-spam
  const formStartTime = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const firstFieldId = useId();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to step heading when step changes (after first render)
  useEffect(() => {
    if (step > 1) stepHeadingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const blur = (key: keyof FormState) => {
    setTouched((t) => ({ ...t, [key]: true }));
    validateField(key);
  };

  const validateField = (key: keyof FormState): string | undefined => {
    let msg: string | undefined;
    const v = data[key];
    if (key === "firstName" && !String(v).trim()) msg = "Please enter your first name.";
    else if (key === "company" && !String(v).trim()) msg = "Please enter your company.";
    else if (key === "email") {
      if (!String(v).trim()) msg = "Please enter your work email.";
      else if (!emailLooksValid(String(v))) msg = "That email doesn't look right.";
    } else if (key === "phone") {
      if (!String(v).trim()) msg = "Please enter a phone number.";
      else if (!phoneLooksValid(String(v))) msg = "That number looks too short.";
    } else if (
      (key === "adSpend" || key === "crm" || key === "teamSize" || key === "role") &&
      !v
    ) {
      msg = "Please pick one.";
    }
    setErrors((e) => ({ ...e, [key]: msg }));
    return msg;
  };

  const validateStep = (s: 1 | 2 | 3): boolean => {
    const fields: (keyof FormState)[] =
      s === 1
        ? ["firstName", "company", "email", "phone"]
        : s === 2
          ? ["adSpend", "crm", "teamSize", "role"]
          : [];
    const newErrors: Partial<Record<keyof FormState, string>> = {};
    let ok = true;
    for (const f of fields) {
      setTouched((t) => ({ ...t, [f]: true }));
      const msg = validateField(f);
      if (msg) {
        newErrors[f] = msg;
        ok = false;
      }
    }
    if (!ok) setErrors((e) => ({ ...e, ...newErrors }));
    return ok;
  };

  const goNext = () => {
    if (validateStep(step as 1 | 2)) setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  };
  const goBack = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

  const submit = async () => {
    if (!validateStep(1) || !validateStep(2)) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          website: honeypot,
          formStartTime: formStartTime.current,
        }),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Couldn't send. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const progress = useMemo(() => ((step - 1) / 2) * 100, [step]);

  if (submitted) {
    return (
      <div className="gradient-border rounded-lg">
        <div className="rounded-lg bg-card p-8 text-center shadow-card md:p-12">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <Check className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </div>
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
            Thanks, {data.firstName}.
          </h3>
          <p className="mx-auto mt-3 max-w-[44ch] text-balance text-[15px] leading-relaxed text-muted-foreground">
            Someone senior on our team will reach out within 24 hours to set up
            the call. If anything&rsquo;s urgent, reply to the email
            confirmation we just sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gradient-border rounded-lg">
      <div className="rounded-lg bg-card p-6 shadow-card md:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Step {step} of 3
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-glow">
              {step === 1 ? "About you" : step === 2 ? "Your business" : "Final notes"}
            </span>
          </div>
          <div className="relative h-1 overflow-hidden rounded-full bg-border/60">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-deep via-primary to-primary-glow transition-smooth"
              style={{ width: `${progress + 33}%` }}
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

        {/* Steps */}
        {step === 1 && (
          <div className="space-y-5">
            <h3
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              Tell us a bit about you.
            </h3>

            <Field
              id={firstFieldId + "-fn"}
              label="First name"
              value={data.firstName}
              onChange={(v) => update("firstName", v)}
              onBlur={() => blur("firstName")}
              error={touched.firstName ? errors.firstName : undefined}
              autoComplete="given-name"
            />
            <Field
              id={firstFieldId + "-co"}
              label="Company"
              value={data.company}
              onChange={(v) => update("company", v)}
              onBlur={() => blur("company")}
              error={touched.company ? errors.company : undefined}
              autoComplete="organization"
            />
            <Field
              id={firstFieldId + "-em"}
              label="Work email"
              type="email"
              inputMode="email"
              value={data.email}
              onChange={(v) => update("email", v)}
              onBlur={() => blur("email")}
              error={touched.email ? errors.email : undefined}
              autoComplete="email"
              hint="We&rsquo;ll only use this to set up the call."
            />
            <Field
              id={firstFieldId + "-ph"}
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-7">
            <h3
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              A little about your business.
            </h3>
            <RadioGroup
              label="Monthly ad spend"
              options={AD_SPEND}
              value={data.adSpend}
              onChange={(v) => update("adSpend", v)}
              error={touched.adSpend ? errors.adSpend : undefined}
              onTouch={() => setTouched((t) => ({ ...t, adSpend: true }))}
            />
            <RadioGroup
              label="Current CRM"
              options={CRM}
              value={data.crm}
              onChange={(v) => update("crm", v)}
              error={touched.crm ? errors.crm : undefined}
              onTouch={() => setTouched((t) => ({ ...t, crm: true }))}
            />
            <RadioGroup
              label="Team size"
              options={TEAM_SIZE}
              value={data.teamSize}
              onChange={(v) => update("teamSize", v)}
              error={touched.teamSize ? errors.teamSize : undefined}
              onTouch={() => setTouched((t) => ({ ...t, teamSize: true }))}
            />
            <RadioGroup
              label="Your role"
              options={ROLE}
              value={data.role}
              onChange={(v) => update("role", v)}
              error={touched.role ? errors.role : undefined}
              onTouch={() => setTouched((t) => ({ ...t, role: true }))}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h3
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-[20px] font-semibold tracking-tight text-foreground outline-none md:text-[22px]"
            >
              Anything we should know?
            </h3>
            <div>
              <label
                htmlFor={firstFieldId + "-nt"}
                className="mb-2 block text-[13px] font-medium text-foreground/85"
              >
                Notes for our team{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </label>
              <textarea
                id={firstFieldId + "-nt"}
                rows={5}
                maxLength={2000}
                value={data.notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  update("notes", e.target.value)
                }
                placeholder="What are you trying to fix? Any specific results you're after?"
                className="w-full resize-y rounded-md border border-border/60 bg-input px-3.5 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/60 transition-fast focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border/50 bg-muted/60 p-4 transition-fast hover:border-border">
              <input
                type="checkbox"
                checked={data.smsOptIn}
                onChange={(e) => update("smsOptIn", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-border/60 bg-input accent-primary"
              />
              <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground/90">
                  Send me marketing texts (optional).
                </span>{" "}
                By checking this box, I agree to receive recurring marketing
                text messages from Voxility — including product updates and
                relevant offers — at the number I provided. Message frequency
                varies. Msg &amp; data rates may apply. Reply STOP to
                unsubscribe. Consent isn&rsquo;t a condition of purchase. See
                our Privacy Policy and Terms.
              </span>
            </label>

            <p className="text-[11.5px] leading-relaxed text-muted-foreground/80">
              By submitting this form you&rsquo;re asking us to contact you
              about your inquiry. We don&rsquo;t share your details, and
              you can ask us to delete them at any time.
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
        <div className="mt-7 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-11 items-center rounded-md border border-border/60 bg-muted/60 px-4 text-[14px] text-foreground/85 transition-fast hover:border-border hover:bg-muted"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
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
              {submitting ? "Sending…" : "Send to our team"}
            </button>
          )}
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
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "search";
  autoComplete?: string;
  autoFocus?: boolean;
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
  autoFocus,
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
        autoFocus={autoFocus}
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
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-[12px] text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: hint }}
        />
      ) : null}
    </div>
  );
}

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  onTouch: () => void;
  error?: string;
}

function RadioGroup({
  label,
  options,
  value,
  onChange,
  onTouch,
  error,
}: RadioGroupProps) {
  return (
    <fieldset>
      <legend className="mb-2 block text-[13px] font-medium text-foreground/85">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => {
                onChange(opt);
                onTouch();
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
      {error && (
        <p className="mt-1.5 text-[12px] text-destructive">{error}</p>
      )}
    </fieldset>
  );
}
