import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";

/**
 * Full-width "get your number" section linking to a missed-revenue
 * calculator. Shared by the vertical template (heading rendered via HL) and
 * the bespoke gym page (heading passed as JSX).
 */
export function CalculatorSection({
  eyebrow,
  heading,
  lede,
  href,
}: {
  eyebrow: string;
  heading: ReactNode;
  lede: string;
  href: string;
}) {
  return (
    <Section id="calculator" className="relative">
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60"
        aria-hidden
      />
      <div className="mx-auto max-w-[820px] text-center">
        <SectionEyebrow className="justify-center">{eyebrow}</SectionEyebrow>
        <SectionHeading className="mx-auto">{heading}</SectionHeading>
        <SectionLede className="mx-auto">{lede}</SectionLede>

        <div className="mt-9 flex justify-center">
          <div className="conic-border inline-flex rounded-md">
            <Button variant="hero" size="xl" href={href}>
              Run the 60-second calculator
              <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.25} />
            </Button>
          </div>
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Free · no signup · about a minute
        </p>
      </div>
    </Section>
  );
}
