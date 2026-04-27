import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

const leaks = [
  {
    n: "01",
    label: "Missed calls",
    headline: "After hours, calls often go to voicemail.",
    body: "On average, service businesses miss around 23% of inbound calls, and most aren&rsquo;t called back. Those leads usually find a competitor on the next search.",
    metric: { v: "23%", l: "calls missed (industry avg)" },
  },
  {
    n: "02",
    label: "Slow follow-up",
    headline: "Form fills often wait 47 minutes for a reply.",
    body: "Lead-response data is consistent: contact a lead within 60 seconds and you&rsquo;re around 8x more likely to qualify them. Most teams take 47 minutes — by which point a few competitors will already have replied.",
    metric: { v: "47m", l: "median time-to-first-reply" },
  },
  {
    n: "03",
    label: "No review flow",
    headline: "Your best patients rarely leave a review.",
    body: "Google review velocity drives ranking, ad relevance, and trust. Without a systematic, day-after-the-appointment ask, you tend to collect a fraction of what you&rsquo;ve earned.",
    metric: { v: "1 in 12", l: "happy patients leave a review" },
  },
];

export function Leak() {
  return (
    <Section id="leak" className="relative">
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60" aria-hidden />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <SectionEyebrow>The leak</SectionEyebrow>
          <SectionHeading>
            When ad spend underperforms, it&rsquo;s rarely the ads.
            <br />
            <span className="text-gradient">It&rsquo;s what happens after the click.</span>
          </SectionHeading>
          <SectionLede>
            You&rsquo;re paying for every click. Most of the lost revenue sits
            in the minutes between a lead landing and someone replying. We
            help close that gap.
          </SectionLede>
        </div>

        <div className="space-y-4 lg:col-span-7">
          {leaks.map((leak, i) => (
            <article
              key={leak.n}
              className={cn(
                "gradient-border rounded-lg transition-smooth hover:-translate-y-0.5 hover:shadow-glow-soft",
                "animate-fade-in-up",
              )}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative grid grid-cols-12 gap-4 rounded-lg bg-card p-7 shadow-card md:p-9">
                <div className="col-span-12 flex items-start gap-4 md:col-span-9">
                  <span
                    className="font-mono text-2xl font-semibold tracking-tight text-primary/70"
                    aria-hidden
                  >
                    {leak.n}
                  </span>
                  <div>
                    <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {leak.label}
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-[22px]">
                      {leak.headline}
                    </h3>
                    <p
                      className="mt-2 text-[15px] leading-relaxed text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: leak.body }}
                    />
                  </div>
                </div>

                <div className="col-span-12 flex items-center gap-4 border-t border-border/50 pt-4 md:col-span-3 md:flex-col md:items-end md:border-l md:border-t-0 md:pl-4 md:pt-0 md:text-right">
                  <span
                    className="heat-text font-mono text-3xl font-semibold tracking-tight md:text-[40px]"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {leak.metric.v}
                  </span>
                  <span className="text-[11px] leading-tight text-muted-foreground">
                    {leak.metric.l}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
