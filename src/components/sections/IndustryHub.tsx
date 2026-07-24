import Link from "next/link";
import { ArrowRight, Calculator, Mic } from "lucide-react";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import { VERTICALS } from "@/lib/verticals";
import type { Highlighted } from "@/lib/verticals/types";

function flat(h: Highlighted): string {
  return `${h.before}${h.highlight}${h.after ?? ""}`;
}

interface HubCard {
  name: string;
  hook: string;
  demoHref: string;
  calcHref: string;
}

// Registry verticals + the bespoke gym funnel (intentionally outside the
// vertical registry — see src/lib/verticals/index.ts).
const CARDS: HubCard[] = [
  ...VERTICALS.map((v) => ({
    name: v.name,
    hook: flat(v.hero.h1),
    demoHref: `/ai-for-${v.slug}#demo`,
    calcHref: `/ai-for-${v.slug}/calculator`,
  })),
  {
    name: "Gyms & Fitness Studios",
    hook: "A missed inquiry at 9pm. A booked tour by 9:01.",
    demoHref: "/ai-for-gyms#demo",
    calcHref: "/gym-calculator",
  },
];

/**
 * Homepage funnel hub: one card per industry, each leading to that niche's
 * ungated live demo (the aha moment) and its missed-revenue calculator.
 */
export function IndustryHub() {
  return (
    <Section id="industries" className="relative">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60"
        aria-hidden
      />
      <div className="mx-auto max-w-[820px] text-center">
        <SectionEyebrow className="justify-center">
          Hear it before you buy it
        </SectionEyebrow>
        <SectionHeading className="mx-auto">
          Pick your industry.
          <br />
          <span className="text-gradient">Talk to the receptionist.</span>
        </SectionHeading>
        <SectionLede className="mx-auto">
          Every page below has a live demo you can talk to right now, and a
          60-second calculator that shows what missed calls cost a business
          like yours. No signup, no card.
        </SectionLede>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.name}
            className="group flex flex-col rounded-lg border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-smooth hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow-soft"
          >
            <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
              {card.name}
            </h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted-foreground">
              {card.hook}
            </p>

            <div className="mt-5 space-y-2.5 border-t border-border/50 pt-4">
              <Link
                href={card.demoHref}
                className="flex items-center justify-between text-[14px] font-medium text-primary-glow transition-fast hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Mic className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Talk to the AI live
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={card.calcHref}
                className="flex items-center justify-between text-[14px] text-foreground/75 transition-fast hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Calculator className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Run the 60-second calculator
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
