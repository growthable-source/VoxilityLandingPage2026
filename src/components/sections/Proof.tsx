import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";

const proofs = [
  {
    metric: "+47",
    metricSuffix: "bookings/mo",
    delta: "in the first 60 days",
    quote:
      "We were spending the same on Meta. The difference was Xovera AI picking up after-hours and on lunch breaks. We didn't change a thing in the clinic.",
    name: "Practice Manager",
    business: "Scottsdale med spa · 3 locations",
  },
  {
    metric: "94%",
    metricSuffix: "missed-call save",
    delta: "vs 0% before",
    quote:
      "Every call that used to drop into voicemail now gets a callback within the minute. Front desk stopped sounding stressed. Patients comment on it.",
    name: "Practice Owner",
    business: "Charlotte dental · 2 locations",
  },
  {
    metric: "$71",
    metricSuffix: "cost / booking",
    delta: "down from $164",
    quote:
      "Same ad budget, less than half the cost per booked appointment. We finally know which campaign is actually filling the chair.",
    name: "Director",
    business: "Denver physio · 4 locations",
  },
];

export function Proof() {
  return (
    <Section id="proof" className="relative">
      <div className="mb-16 max-w-[680px]">
        <SectionEyebrow>Proof</SectionEyebrow>
        <SectionHeading>
          Numbers, from businesses
          <br />
          <span className="text-gradient">that look like yours.</span>
        </SectionHeading>
        <SectionLede>
          We work with appointment-based service businesses — clinics,
          health, real estate, and premium trades. Same offer, same stack,
          same monthly report.
        </SectionLede>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {proofs.map((p, i) => (
          <article
            key={p.business}
            className="gradient-border rounded-lg transition-smooth hover:-translate-y-1 hover:shadow-glow-soft animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex h-full flex-col rounded-lg bg-card p-7 shadow-card md:p-8">
              <div className="mb-6 border-b border-border/50 pb-5">
                <div className="flex items-baseline gap-2">
                  <span
                    className="heat-text text-[44px] font-semibold tracking-tight md:text-[52px]"
                    style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1 }}
                  >
                    {p.metric}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {p.metricSuffix}
                  </span>
                </div>
                <div className="mt-1.5 font-mono text-[11px] tracking-wide text-primary-glow">
                  {p.delta}
                </div>
              </div>

              <blockquote className="grow text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{p.quote}&rdquo;
              </blockquote>

              <footer className="mt-6 border-t border-border/50 pt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <div className="text-foreground/80">{p.name}</div>
                <div>{p.business}</div>
              </footer>
            </div>
          </article>
        ))}
      </div>

      <p className="mt-10 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
        Names withheld at client request · Specifics available under NDA on
        request
      </p>
    </Section>
  );
}
