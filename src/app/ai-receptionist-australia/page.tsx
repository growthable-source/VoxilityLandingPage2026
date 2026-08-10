import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import { CampaignShell } from "@/components/free-build/CampaignChrome";
import { CallbackForm } from "@/components/receptionist-au/CallbackForm";
import {
  CAPABILITIES,
  FAQS,
  GOOD_FIT,
  LEAK_POINTS,
  POOR_FIT,
  STEPS,
} from "@/components/receptionist-au/content";
import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";

// A paid-traffic landing page for an Australian campaign: it must never
// compete with the real site in search, and it is deliberately absent from
// sitemap.ts. Australian English is intentional here — see the scoped
// exception in the tone guide for geo-targeted campaign pages.
export const metadata: Metadata = {
  title: "AI Receptionist for Australian Businesses | Xovera",
  description:
    "Every call answered in under three rings, day and night. It qualifies the enquiry, books it into your calendar, and texts back anyone you miss.",
  robots: { index: false, follow: false },
};

export default function AiReceptionistAustraliaPage() {
  return (
    <CampaignShell
      navNote="Australian businesses · Answered around the clock"
      navCtaLabel="Book my callback"
      stickyCtaLabel="Book my callback"
    >
      <Hero />
      <Leaks />
      <Capabilities />
      <HowItWorks />
      <Fit />
      <Faq />
      <FinalCta />
    </CampaignShell>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-hero">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-[1320px] items-start gap-12 px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[13px] font-medium text-primary-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Australian businesses · Every call answered
          </span>

          <h1
            className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.04, letterSpacing: "-0.035em" }}
          >
            The calls you can&rsquo;t get to{" "}
            <span className="text-gradient">still get answered.</span>
          </h1>

          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
            A receptionist that picks up in under three rings, around the clock.
            It answers questions in a natural voice, qualifies the enquiry, and
            books the appointment into your calendar while the caller is still
            on the phone.
          </p>

          <ul className="mt-8 grid gap-3.5">
            {[
              "Answered day and night — weekends and public holidays included.",
              "Anyone who does slip through gets a text back within about 60 seconds.",
              "Every call logged, summarised and followed up, without you touching a thing.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-[16px] text-foreground/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[14px] text-muted-foreground">
            Trades, clinics, studios and local services.
          </p>
        </div>

        <div className="lg:sticky lg:top-24">
          <CallbackForm />
        </div>
      </div>
    </header>
  );
}

function Leaks() {
  return (
    <Section className="bg-muted/20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionEyebrow>The familiar part</SectionEyebrow>
          <SectionHeading>Three places bookings tend to slip</SectionHeading>
          <SectionLede>
            None of this is anyone doing their job badly — it&rsquo;s just what
            happens when one phone line meets a business that&rsquo;s busy
            actually doing the work.
          </SectionLede>
        </div>
        <ul className="grid gap-5 self-center">
          {LEAK_POINTS.map((point) => (
            <li key={point.title} className="flex gap-3.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="text-[15.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{point.title}.</span>{" "}
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Capabilities() {
  return (
    <Section>
      <div className="mx-auto max-w-[720px] text-center">
        <SectionEyebrow className="justify-center">What it handles</SectionEyebrow>
        <SectionHeading className="mx-auto">
          A front desk that never clocks off
        </SectionHeading>
        <SectionLede className="mx-auto">
          It does the whole job, not just the greeting — from the first ring
          through to the booking sitting in your calendar with the follow-up
          already moving.
        </SectionLede>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((item, index) => (
          <article
            key={item.title}
            className="flex h-full flex-col rounded-lg border border-border/60 bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/35"
          >
            <span className="mb-4 font-mono text-[12px] tracking-[0.18em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section className="bg-muted/20">
      <div className="mx-auto max-w-[640px] text-center">
        <SectionEyebrow className="justify-center">How it works</SectionEyebrow>
        <SectionHeading className="mx-auto">Three steps, about a week.</SectionHeading>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <div key={step.number} className="relative md:px-4">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-[18px] font-semibold text-primary-foreground shadow-primary">
              {step.number}
            </div>
            <h3 className="text-[19px] font-semibold tracking-tight text-foreground">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Fit() {
  return (
    <Section>
      <div className="mx-auto max-w-[700px] text-center">
        <SectionEyebrow className="justify-center">An honest fit check</SectionEyebrow>
        <SectionHeading className="mx-auto">Who it suits, and who it doesn&rsquo;t</SectionHeading>
        <SectionLede className="mx-auto">
          It works best where the phone is how work arrives. If that&rsquo;s not
          your business, we&rsquo;d rather say so here than on a call.
        </SectionLede>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-card p-7 shadow-card">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
            A good fit
          </h3>
          <ul className="mt-5 grid gap-3.5">
            {GOOD_FIT.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border/60 bg-card p-7 shadow-card">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
            Probably not
          </h3>
          <ul className="mt-5 grid gap-3.5">
            {POOR_FIT.map((line) => (
              <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border/60">
                  <X className="h-3 w-3 text-muted-foreground" strokeWidth={3} />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section className="bg-muted/20">
      <div className="mx-auto max-w-[640px] text-center">
        <SectionEyebrow className="justify-center">Straight answers</SectionEyebrow>
        <SectionHeading className="mx-auto">Questions we get asked</SectionHeading>
      </div>

      <div className="mx-auto mt-12 max-w-[800px]">
        {FAQS.map((faq) => (
          <details
            key={faq.question}
            open={faq.open}
            className="group border-b border-border/60 py-5"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-medium tracking-tight text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="mt-0.5 shrink-0 text-2xl font-light leading-none text-primary transition-smooth group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3.5 max-w-[68ch] text-[15.5px] leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section className="relative overflow-hidden border-t border-border/60 bg-gradient-hero">
      <div className="relative mx-auto max-w-[720px] text-center">
        <h2
          className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          style={{ lineHeight: 1.06, letterSpacing: "-0.035em" }}
        >
          Worst case, you hear a good demo.
          <br />
          Best case, you stop missing calls.
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          Fifteen minutes on the phone, hearing it answer the kinds of calls
          your business gets every day. We think that&rsquo;ll do more than
          anything we could write here.
        </p>
        <a
          href="#claim"
          className="mx-auto mt-9 inline-flex h-14 items-center justify-center rounded-md bg-gradient-primary px-10 text-[17px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow"
        >
          Book my callback
        </a>
        <p className="mt-5 text-[14px] text-muted-foreground">
          Australian businesses · One call, no lock-in to hear it
        </p>
      </div>
    </Section>
  );
}
