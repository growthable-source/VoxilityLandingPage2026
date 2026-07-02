"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Section, SectionEyebrow, SectionHeading } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "Does it work with my gym software?",
    a: "Yes — and it doesn't replace it. Keep Mindbody, ABC, Club Automation or whatever runs your gym; Xovera layers on top to handle lead acquisition and marketing. It's built on GoHighLevel (our preferred platform) and also connects to HubSpot, so leads, tours, and members stay in sync. Don't see your system? It's quick for us to add.",
  },
  {
    q: "What does it actually say to leads?",
    a: "You set the script and guardrails. It answers questions about memberships, hours, and classes from your own info, qualifies the lead, and books a tour or free trial — it never invents pricing or promises you didn't set.",
  },
  {
    q: "Can it book tours and trials on my calendar?",
    a: "Yes — it checks real-time availability and books during the conversation, with automatic confirmations and reminders to cut no-shows.",
  },
  {
    q: "Does the voice sound like a robot?",
    a: "No. It uses natural, human-sounding voices — most callers don't realize they're talking to an AI until you tell them.",
  },
  {
    q: "Is this available in the US and Canada?",
    a: "Yes — Xovera is built for gyms and fitness studios across both the US and Canada, with local phone numbers in both countries.",
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

export function GymsFAQ() {
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
            Gym owner
            <br />
            <span className="text-gradient">questions.</span>
          </SectionHeading>
          <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
            Anything else, we&rsquo;re happy to talk through on the demo. If we
            don&rsquo;t know an answer yet, we&rsquo;ll say so.
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
