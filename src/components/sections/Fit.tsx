import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

const categories: { label: string; items: string[] }[] = [
  {
    label: "Health & wellness",
    items: [
      "Med spas",
      "Cosmetic clinics",
      "Dental",
      "Cosmetic dentistry",
      "Physio",
      "Chiropractic",
      "Allied health",
      "Laser & skin clinics",
      "Hair transplant clinics",
      "Fertility clinics",
    ],
  },
  {
    label: "Property & finance",
    items: ["Real estate teams", "Mortgage brokers"],
  },
  {
    label: "Home & premium trades",
    items: [
      "Solar installers",
      "Home renovation",
      "Pool builders",
      "Premium electricians",
      "Premium plumbers",
    ],
  },
];

const profile = [
  { v: "5–50", l: "employees" },
  { v: "$1M–20M", l: "annual revenue" },
  { v: "1–10", l: "locations" },
  { v: "$500+", l: "avg customer value" },
];

export function Fit() {
  return (
    <Section id="fit" className="relative">
      <div className="mb-14 max-w-[760px]">
        <SectionEyebrow>Who we build for</SectionEyebrow>
        <SectionHeading>
          We work best with service businesses that{" "}
          <span className="text-gradient">already pay for the click.</span>
        </SectionHeading>
        <SectionLede>
          If you&rsquo;re already running Meta or Google ads, getting 50+
          inbound inquiries a month, with an owner, practice manager, or
          single marketing person looking after it all — that&rsquo;s the
          kind of business we&rsquo;re built for.
        </SectionLede>
      </div>

      {/* Profile bar */}
      <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {profile.map((p) => (
          <div
            key={p.l}
            className="rounded-md border border-border/50 bg-card/50 p-5 backdrop-blur-md"
          >
            <div
              className="heat-text text-2xl font-semibold tracking-tight md:text-[30px]"
              style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1 }}
            >
              {p.v}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {p.l}
            </div>
          </div>
        ))}
      </div>

      {/* Vertical chip grid grouped by category */}
      <div className="gradient-border rounded-lg">
        <div className="rounded-lg bg-card/60 p-7 shadow-card backdrop-blur-md md:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
            {categories.map((cat, i) => (
              <div
                key={cat.label}
                className={cn(
                  "animate-fade-in-up",
                  i === 0 && "md:col-span-6",
                  i === 1 && "md:col-span-3",
                  i === 2 && "md:col-span-3",
                )}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary-glow">
                    {cat.label}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
                </div>
                <ul className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className={cn(
                        "inline-flex items-center rounded-md border border-border/60 bg-background/60 px-3 py-1.5",
                        "text-[13px] tracking-tight text-foreground/90",
                        "transition-fast hover:border-primary/50 hover:bg-card hover:text-foreground",
                      )}
                    >
                      <span
                        className="mr-2 inline-block h-1 w-1 rounded-full bg-primary-glow/70"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[64ch] border-t border-border/50 pt-6 text-[14px] leading-relaxed text-muted-foreground">
            Don&rsquo;t see your vertical here? If you run an appointment-driven
            service business with a $500+ average customer value, the system
            likely still applies. Happy to talk it through on a call.
          </p>
        </div>
      </div>
    </Section>
  );
}
