import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import { Card, CardEyebrow, CardTitle, CardBody } from "@/components/ui/Card";
import { IntegrationsRow } from "@/components/ui/IntegrationsRow";
import { Megaphone, LayoutTemplate, Cpu, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Megaphone,
    eyebrow: "01 · Acquire",
    title: "Meta paid ads, run with intent.",
    body: "Lead-generation and appointment-booking campaigns across Facebook and Instagram, deployed and iterated through our own in-house ads launcher. The goal is booked appointments — not impressions.",
    bullets: [
      "Creative built per campaign",
      "Daily optimization based on real performance signals",
      "Spend-to-bookings reporting, so you see what's actually working",
    ],
  },
  {
    icon: LayoutTemplate,
    eyebrow: "02 · Convert",
    title: "Landing pages built for the offer.",
    body: "Each campaign gets its own purpose-built page — designed, written, and deployed by us, on infrastructure we control. Connected directly to the AI and CRM stack so every submission flows into follow-up immediately.",
    bullets: [
      "Live in around 10 days, iterated weekly",
      "Mobile-first, sub-1s load, global edge CDN",
      "Form, call, and SMS routed through Voxility AI",
    ],
  },
  {
    icon: Cpu,
    eyebrow: "03 · Capture",
    title: "Voxility AI answers, qualifies, books.",
    body: "Inbound voice answered in under 3 rings. SMS and chat replies inside 60 seconds. Missed calls returned within the minute. Every conversation written back to GoHighLevel or HubSpot.",
    bullets: [
      "Natural voices in 30+ languages, 24/7 coverage, region-aware compliance",
      "Books live into Mindbody, Boulevard, Jane, Cliniko, Fresha",
      "Transfers to a person when a person is needed",
    ],
  },
];

export function System() {
  return (
    <Section id="system" className="relative">
      <div className="mb-16 max-w-[640px]">
        <SectionEyebrow>The system</SectionEyebrow>
        <SectionHeading>
          One stack. One partner.
          <br />
          <span className="text-gradient">From ad click to booked.</span>
        </SectionHeading>
        <SectionLede>
          Three capabilities that are usually sold as three separate products.
          We bundle them into one accountable system, with one team to talk to
          when something needs to change.
        </SectionLede>
      </div>

      {/* Pipeline visual rail */}
      <div
        className="relative mb-10 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block"
        aria-hidden
      >
        <span className="absolute left-[16.66%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary shadow-glow" />
        <span className="absolute left-[50%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary-glow shadow-glow" />
        <span className="absolute left-[83.33%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary-deep shadow-glow" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Card>
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <CardEyebrow>{p.eyebrow}</CardEyebrow>
                <CardTitle>{p.title}</CardTitle>
                <CardBody>{p.body}</CardBody>

                <ul className="mt-6 space-y-2.5 border-t border-border/50 pt-5">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[13px] text-foreground/85"
                    >
                      <ArrowRight
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
                        strokeWidth={2.25}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-lg border border-border/50 bg-card p-6 text-center shadow-card md:p-8">
        <p className="text-[15px] text-muted-foreground md:text-base">
          You can pick up the bundle or just one piece. Most clients start with
          the bundle — it&rsquo;s where the components reinforce each other.
          Each one works on its own; together, they tend to compound.
        </p>
      </div>

      <IntegrationsRow className="mt-16" />
    </Section>
  );
}
