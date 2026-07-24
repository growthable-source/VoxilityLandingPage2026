import type { ReactNode } from "react";
import { CreditCard, PenLine, UserCheck } from "lucide-react";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import { Card, CardBody, CardIcon, CardTitle } from "@/components/ui/Card";
import type { KioskItem } from "@/lib/verticals/types";

const ICONS = {
  PenLine,
  CreditCard,
  UserCheck,
} as const;

/**
 * Walk-in kiosk / in-person signing section. Shared by the vertical template
 * (med spas) and the bespoke gym page. Copy must stay within the confirmed
 * kiosk capabilities — see KioskConfig in lib/verticals/types.ts.
 */
export function KioskSection({
  eyebrow,
  heading,
  lede,
  items,
}: {
  eyebrow: string;
  heading: ReactNode;
  lede: string;
  items: KioskItem[];
}) {
  return (
    <Section id="kiosk" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 mesh-bg opacity-40" aria-hidden />
      <div className="mx-auto max-w-[820px] text-center">
        <SectionEyebrow className="justify-center">{eyebrow}</SectionEyebrow>
        <SectionHeading className="mx-auto">{heading}</SectionHeading>
        <SectionLede className="mx-auto">{lede}</SectionLede>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1080px] grid-cols-1 gap-5 md:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.icon] ?? PenLine;
          return (
            <Card key={item.title}>
              <CardIcon>
                <Icon className="h-5 w-5" strokeWidth={2} />
              </CardIcon>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.body}</CardBody>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
