"use client";

import { useState } from "react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/ui/Section";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "Will the AI sound like a robot to my patients?",
    a: "Not really. Xovera AI uses natural-sounding voices across 30+ languages and accents, tuned for the conversational pacing of clinical and home-services inquiries. Most callers don't realize it's not a person. We can turn that disclosure on or off, depending on your industry's compliance requirements.",
  },
  {
    q: "How fast can we go live?",
    a: "Xovera AI is usually live within 14 days of kickoff — including number porting, GHL or HubSpot wiring, and booking system integration. Meta campaigns and the purpose-built landing page typically follow between days 21 and 30.",
  },
  {
    q: "We already use HubSpot — do we have to switch to GoHighLevel?",
    a: "Not at all. We're HubSpot solutions partners, and the Bundle and Xovera AI both work natively with HubSpot. Most agency-resold work runs on GHL because of the whitelabel mechanics, but direct clients on HubSpot stay on HubSpot.",
  },
  {
    q: "What if I just want the ads, not the AI?",
    a: "We're happy to, though we'll be upfront on the call: the economics work best when the components are connected. Xovera AI tends to catch the leads ads agencies usually hand off and lose, which is what makes the cost-per-booking what it is.",
  },
  {
    q: "Are there long contracts?",
    a: "There aren't any. We ask for the first 90 days so the system has time to compound, then it's month-to-month. We'd rather keep clients through results than paperwork.",
  },
  {
    q: "Who actually does the work?",
    a: "Someone senior on our team, not an account manager handing the work down. You get a direct line — Slack or phone. If you'd like a weekly check-in, we're happy to set one up; most owners prefer we just get on with it.",
  },
  {
    q: "What happens to the leads we already have in our CRM?",
    a: "We work them. From day one, an outbound nurture flow runs over your existing list — appointment confirmations, no-show recovery, and six-month reactivation. Most clients see meaningful revenue from leads they'd already paid for.",
  },
  {
    q: "Can we cancel and keep our number / data?",
    a: "Yes. The numbers stay yours, the CRM records stay yours, and if you ever leave we'll export a clean copy of everything. It's never been a sticking point.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
          <SectionEyebrow>Questions</SectionEyebrow>
          <SectionHeading>
            Eight things we get
            <br />
            <span className="text-gradient">asked most often.</span>
          </SectionHeading>
          <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
            Anything else, we&rsquo;re happy to talk through on a call. If
            we don&rsquo;t know an answer yet, we&rsquo;ll say so.
          </p>
        </div>

        <div className="lg:col-span-8">
          <ul className="divide-y divide-border/50 border-y border-border/50">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <li key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start gap-4 py-5 text-left transition-fast hover:bg-muted/50"
                  >
                    <span
                      className="mt-0.5 font-mono text-[12px] tabular-nums text-muted-foreground"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[16px] font-medium tracking-tight text-foreground md:text-[17px]">
                      {faq.q}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-smooth group-hover:border-primary/60 group-hover:text-primary",
                        isOpen &&
                          "rotate-45 border-primary/70 bg-primary/10 text-primary",
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  </button>

                  <div
                    className={cn(
                      "grid transition-all duration-300 ease-out",
                      isOpen
                        ? "grid-rows-[1fr] pb-6 opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="ml-9 max-w-[64ch] pr-10 text-[15px] leading-relaxed text-muted-foreground">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Section>
  );
}
