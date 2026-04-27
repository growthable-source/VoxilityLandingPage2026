import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Voxility AI",
    eyebrow: "Standalone",
    pitch: "Speed-to-lead and missed-call rescue, plugged into your CRM.",
    price: "from $1,800",
    cadence: "/ month",
    bullets: [
      "Local number anywhere · natural voice · 24/7 coverage",
      "Inbound voice, SMS, web chat, missed-call rescue",
      "GoHighLevel or HubSpot wired in",
      "Booking system integration (Mindbody, Jane, Boulevard, Cliniko, etc)",
      "Monthly tuning + reporting",
    ],
    cta: "Talk to us",
    href: "#contact",
    featured: false,
  },
  {
    name: "Bundle",
    eyebrow: "Most clients start here",
    pitch: "Meta ads + landing pages + Voxility AI on one accountable system.",
    price: "from $4,500",
    cadence: "/ month + ad spend",
    bullets: [
      "Everything in Voxility AI",
      "Meta ad management — creative, deployment, daily optimization",
      "Campaign-built landing pages, weekly iteration",
      "Spend → bookings reporting (not spend → leads)",
      "Outbound nurture, review-request flow, reactivation",
      "Direct Slack or phone line to someone senior on the team",
    ],
    cta: "Book a strategy call",
    href: "#contact",
    featured: true,
  },
  {
    name: "Whitelabel",
    eyebrow: "For agencies",
    pitch: "Resell our infrastructure under your brand.",
    price: "tiered",
    cadence: "by client volume",
    bullets: [
      "GoHighLevel VAR with your branding",
      "Sub-account provisioning + sandbox training",
      "Voxility AI deployed under your domain",
      "Onboarding playbooks + sales collateral",
      "$2–5k/mo retained per client without hiring",
    ],
    cta: "See agency model",
    href: "/agencies",
    featured: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="relative">
      <div className="mb-14 max-w-[680px]">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <SectionHeading>
          Simple numbers.
          <br />
          <span className="text-gradient">Easy to scope.</span>
        </SectionHeading>
        <SectionLede>
          Monthly retainer with some performance-linked components. Most
          clients start with the bundle — that&rsquo;s where the components
          reinforce each other — but you&rsquo;re welcome to start with a
          single piece.
        </SectionLede>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {tiers.map((tier) => {
          const isBundle = tier.featured;
          return (
            <div
              key={tier.name}
              className={
                isBundle
                  ? "conic-border rounded-lg"
                  : "gradient-border rounded-lg transition-smooth hover:-translate-y-1 hover:shadow-glow-soft"
              }
            >
              <div className="relative flex h-full flex-col rounded-lg bg-card p-7 shadow-card md:p-9">
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  {tier.eyebrow}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-[28px]">
                  {tier.name}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {tier.pitch}
                </p>

                <div className="mt-6 flex items-baseline gap-2 border-y border-border/50 py-5">
                  <span
                    className={`text-3xl font-semibold tracking-tight md:text-[36px] ${isBundle ? "heat-text" : "text-foreground"}`}
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {tier.price}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {tier.cadence}
                  </span>
                </div>

                <ul className="my-6 grow space-y-3">
                  {tier.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-[14px] leading-relaxed text-foreground/85"
                    >
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-primary"
                        strokeWidth={2.25}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-2">
                  <Button
                    href={tier.href}
                    variant={isBundle ? "hero" : "glass"}
                    size="lg"
                    className="w-full"
                  >
                    {tier.cta}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-[13px] text-muted-foreground">
        Numbers above are starting points. We scope on the call — pricing
        scales with locations, lead volume, and ad spend. No long contracts;
        we&rsquo;d rather keep clients through results.
      </p>
    </Section>
  );
}
