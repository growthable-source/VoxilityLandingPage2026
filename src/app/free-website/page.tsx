import type { Metadata } from "next";
import { Check, Mail, Phone } from "lucide-react";
import { CampaignShell } from "@/components/free-build/CampaignChrome";
import { InstantAuditFlow } from "@/components/free-build/InstantAuditFlow";
import {
  CATCH_POINTS,
  FAQS,
  MONTHLY_BUILD_CAP,
  PROOF_STATS,
  STACK_ITEMS,
  STEPS,
  TEARDOWN_AREAS,
} from "@/components/free-build/content";
import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";

// A paid-traffic landing page: it must never compete with the real site in
// search, and it is deliberately absent from sitemap.ts.
export const metadata: Metadata = {
  title: "Free Website Built Today + Live Teardown | Xovera",
  description:
    "A brand new website, built free and delivered today. Enter your web address and we'll analyse your current site on the spot — the build is yours to keep.",
  robots: { index: false, follow: false },
};

export default function FreeWebsitePage() {
  return (
    <CampaignShell
      navNote={`Australian businesses · ${MONTHLY_BUILD_CAP} free builds a month`}
      navCtaLabel="Get my free website"
      stickyCtaLabel="Get my free website"
    >
      <Hero />
      <Catch />
      <Stats />
      <Teardown />
      <HowItWorks />
      <Stack />
      <Faq />
      <FinalCta />
    </CampaignShell>
  );
}

function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-hero">
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      {/* DOM order puts the URL field straight after the promise so it's
          above the fold on a phone; on desktop the grid splits it out to the
          right column with the bullets back under the headline. */}
      <div className="relative mx-auto grid max-w-[1320px] items-start gap-10 px-5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_.95fr] lg:gap-x-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[13px] font-medium text-primary-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            A free website, built today · Australian businesses
          </span>

          <h1
            className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
            style={{ lineHeight: 1.04, letterSpacing: "-0.035em" }}
          >
            A brand new website.
            <br />
            <span className="text-gradient">Built free. Delivered today.</span>
          </h1>

          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted-foreground">
            Your website looks fine — it&rsquo;s just not bringing you work.
            Put your address in below: we&rsquo;ll analyse the site
            you&rsquo;ve got while you&rsquo;re on this page, then build you a
            new one and hand it over on a 15 minute call. Today.
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-24">
          <InstantAuditFlow />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <ul className="grid gap-3.5">
            {[
              "A brand new site, built free, delivered today — yours to keep.",
              "A live analysis of your current site, on this page, in about a minute.",
              "Every enquiry answered inside 60 seconds: forms get an instant reply, missed calls get a text back, day or night.",
              "You keep the fixes either way. Work with us or don't.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-[16px] text-foreground/85">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                  <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                </span>
                {line}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[14px] text-muted-foreground">
            Built for trades, clinics, studios and local service businesses.
          </p>
        </div>
      </div>
    </header>
  );
}

function Stats() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-[1320px] divide-y divide-border/60 md:grid-cols-3 md:divide-x md:divide-y-0">
        {PROOF_STATS.map((stat) => (
          <div key={stat.attribution} className="px-6 py-9 text-center">
            <div className="text-gradient text-4xl font-semibold tracking-tight md:text-5xl">
              {stat.metric}
            </div>
            <p className="mt-2 text-[15px] text-foreground/85">{stat.label}</p>
            <p className="text-[14px] text-muted-foreground">{stat.detail}</p>
            <p className="mt-2 text-[12px] text-muted-foreground/75">{stat.attribution}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Catch() {
  return (
    <Section className="bg-muted/20">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionEyebrow>Let&rsquo;s get it out of the way</SectionEyebrow>
          <SectionHeading>Why free?</SectionHeading>
          <SectionLede>
            Because building your site is faster than explaining what we do.
            Most people stay after. Some don&rsquo;t. Both are fine — here&rsquo;s
            the honest version, so you&rsquo;re not waiting for a trapdoor.
          </SectionLede>
        </div>
        <ul className="grid gap-5 self-center">
          {CATCH_POINTS.map((point) => (
            <li key={point.title} className="flex gap-3.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p className="text-[15.5px] leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{point.title}</span>{" "}
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Teardown() {
  return (
    <Section>
      <div className="mx-auto max-w-[720px] text-center">
        <SectionEyebrow className="justify-center">The teardown</SectionEyebrow>
        <SectionHeading className="mx-auto">
          Six places local businesses leak enquiries
        </SectionHeading>
        <SectionLede className="mx-auto">
          The first three we measure on your actual site and show you on the
          spot. The last three can&rsquo;t be seen from outside, so we go through
          them with you on the call rather than guessing at them.
        </SectionLede>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TEARDOWN_AREAS.map((area) => (
          <article
            key={area.number}
            className="flex h-full flex-col rounded-lg border border-border/60 bg-card p-6 shadow-card transition-smooth hover:-translate-y-0.5 hover:border-primary/35"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[12px] tracking-[0.18em] text-primary">
                {area.number}
              </span>
              <span
                className={
                  area.emailed
                    ? "inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-medium text-primary-glow"
                    : "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                }
              >
                {area.emailed ? (
                  <>
                    <Mail className="h-3 w-3" /> In your report
                  </>
                ) : (
                  <>
                    <Phone className="h-3 w-3" /> On the call
                  </>
                )}
              </span>
            </div>
            <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
              {area.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {area.body}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section className="bg-muted/20">
      <div className="mx-auto max-w-[640px] text-center">
        <SectionEyebrow className="justify-center">How it works</SectionEyebrow>
        <SectionHeading className="mx-auto">Three steps, same day.</SectionHeading>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <div key={step.number} className="relative md:px-4">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary text-[18px] font-semibold text-primary-foreground shadow-primary">
              {step.number}
            </div>
            <h3 className="text-[19px] font-semibold tracking-tight text-foreground">
              {step.title}
            </h3>
            <p className="mt-2.5 text-[15.5px] leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Stack() {
  return (
    <Section>
      <div className="mx-auto max-w-[700px] text-center">
        <SectionEyebrow className="justify-center">If you want us to keep going</SectionEyebrow>
        <SectionHeading className="mx-auto">The rest of the machine</SectionHeading>
        <SectionLede className="mx-auto">
          A website on its own is a brochure. These are the parts that turn it
          into booked work, and on the call we&rsquo;ll tell you which of them
          you actually need.
        </SectionLede>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {STACK_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-border/60 bg-card p-6 shadow-card"
          >
            <h3 className="text-[16.5px] font-semibold tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Faq() {
  return (
    <Section className="bg-muted/20">
      <div className="mx-auto max-w-[640px] text-center">
        <SectionEyebrow className="justify-center">Straight answers</SectionEyebrow>
        <SectionHeading className="mx-auto">Questions we get asked</SectionHeading>
      </div>

      <div className="mx-auto mt-12 max-w-[800px]">
        {FAQS.map((faq) => (
          <details
            key={faq.question}
            open={faq.open}
            className="group border-b border-border/60 py-5"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-medium tracking-tight text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
              {faq.question}
              <span className="mt-0.5 shrink-0 text-2xl font-light leading-none text-primary transition-smooth group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3.5 max-w-[68ch] text-[15.5px] leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <Section className="relative overflow-hidden border-t border-border/60 bg-gradient-hero">
      <div className="relative mx-auto max-w-[720px] text-center">
        <h2
          className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-5xl"
          style={{ lineHeight: 1.06, letterSpacing: "-0.035em" }}
        >
          A free website, delivered today,
          <br />
          and an honest report on the old one.
        </h2>
        <p className="mx-auto mt-5 max-w-[52ch] text-lg leading-relaxed text-muted-foreground">
          That&rsquo;s the whole deal. Worst case, you keep both and never
          speak to us again — best case, the phone starts ringing.
        </p>
        <a
          href="#claim"
          className="mx-auto mt-9 inline-flex h-14 items-center justify-center rounded-md bg-gradient-primary px-10 text-[17px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow"
        >
          Get my free website
        </a>
        <p className="mt-5 text-[14px] text-muted-foreground">
          {`${MONTHLY_BUILD_CAP} builds a month · Australian businesses`}
        </p>
      </div>
    </Section>
  );
}
