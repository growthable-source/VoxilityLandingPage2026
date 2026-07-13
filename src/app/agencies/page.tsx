import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import {
  Card,
  CardEyebrow,
  CardTitle,
  CardBody,
} from "@/components/ui/Card";
import {
  Building2,
  Repeat,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const AGENCY_TITLE =
  "Xovera for agencies — Whitelabel the system. Add $2–5k MRR per client.";
const AGENCY_DESCRIPTION =
  "Resell our Meta ads, landing pages, and Xovera AI infrastructure under your own brand. Built for 2–15 person agencies.";

export const metadata: Metadata = {
  title: AGENCY_TITLE,
  description: AGENCY_DESCRIPTION,
  alternates: {
    canonical: "https://www.xovera.io/agencies",
  },
  openGraph: {
    title: AGENCY_TITLE,
    description: AGENCY_DESCRIPTION,
    url: "https://www.xovera.io/agencies",
    siteName: "Xovera",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://www.xovera.io/og.png",
        width: 1200,
        height: 630,
        alt: "Xovera for agencies — Whitelabel the system.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: AGENCY_TITLE,
    description: AGENCY_DESCRIPTION,
    images: ["https://www.xovera.io/og.png"],
  },
};

const valueProps = [
  {
    icon: Building2,
    title: "Productized, not bespoke",
    body: "The same system, deployed for client after client. You sell it; we build it; your senior team stays on strategy.",
  },
  {
    icon: Repeat,
    title: "$2–5k MRR per client",
    body: "On top of your existing ad-management retainer. Most partners see 55–70% margin after our cost, without hiring.",
  },
  {
    icon: Wrench,
    title: "Whitelabel, end to end",
    body: "Xovera AI under your domain. GHL sub-accounts under your brand. Reporting wrapped in your colors. Your client only sees you.",
  },
  {
    icon: ShieldCheck,
    title: "Senior support, not a forum",
    body: "A direct Slack channel with someone senior on our team. We handle the build and any firefights, so you can focus on the relationship.",
  },
];

const flow = [
  {
    n: "01",
    label: "Sell",
    body: "You package the system into your existing client retainer. We provide the collateral, demo decks, and a price book.",
  },
  {
    n: "02",
    label: "Onboard",
    body: "We provision a sub-account under your brand — numbers, AI, GHL, integrations — typically live within 14 days.",
  },
  {
    n: "03",
    label: "Operate",
    body: "We look after the AI tuning, integrations, and infrastructure. You own the relationship, the strategy, and the renewal.",
  },
  {
    n: "04",
    label: "Compound",
    body: "Each retained client funds the next sales cycle. Most partners reach profitability on the partnership within two clients.",
  },
];

export default function AgenciesPage() {
  return (
    <>
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 -z-30 mesh-bg" aria-hidden />
          <div className="absolute inset-0 -z-20 grid-overlay opacity-50" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-32 top-32 -z-10 h-[600px] w-[600px] animate-orb-float rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(closest-side, hsl(var(--primary-glow) / 0.45), transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          <div className="noise absolute inset-0 -z-0" aria-hidden />

          <div className="container relative mx-auto max-w-[1320px] px-5 md:px-8">
            <div className="max-w-[820px]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 backdrop-blur-md">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
                  For agencies · GoHighLevel VAR · Whitelabel
                </span>
              </div>

              <h1
                className="text-balance font-semibold tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.04em",
                }}
              >
                From ads vendor{" "}
                <span className="text-gradient">to system partner.</span>
              </h1>

              <p className="mt-7 max-w-[60ch] text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
                Most client churn comes from leads that don&rsquo;t convert
                — and that&rsquo;s a place where you can add real value. We
                provide the landing pages, the AI, and the CRM as a whitelabel
                offer that wraps cleanly under your brand.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button variant="hero" size="xl" href="#partner-call">
                  Partner inquiry · 30-min call
                </Button>
                <Button variant="glass" size="xl" href="#flow">
                  See how it works
                </Button>
              </div>

              <div className="mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat value="$3.4k" label="avg MRR added per client" hot />
                <Stat value="14d" label="onboarding to live" />
                <Stat value="55–70%" label="margin after our cost" />
                <Stat value="<6%" label="12-mo cohort churn" />
              </div>
            </div>
          </div>
        </section>

        {/* Value props */}
        <Section>
          <div className="mb-16 max-w-[680px]">
            <SectionEyebrow>Why partner</SectionEyebrow>
            <SectionHeading>
              Built for{" "}
              <span className="text-gradient">2–15 person agencies</span>{" "}
              that want a moat.
            </SectionHeading>
            <SectionLede>
              You already have the client list and the relationship. You need
              an offer your clients can&rsquo;t replicate or churn out of.
            </SectionLede>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {valueProps.map((vp, i) => {
              const Icon = vp.icon;
              return (
                <div
                  key={vp.title}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Card>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <CardEyebrow>For your retainer</CardEyebrow>
                    <CardTitle>{vp.title}</CardTitle>
                    <CardBody>{vp.body}</CardBody>
                  </Card>
                </div>
              );
            })}
          </div>
        </Section>

        {/* How it works */}
        <Section id="flow" className="relative">
          <div className="mb-14 max-w-[680px]">
            <SectionEyebrow>How it works</SectionEyebrow>
            <SectionHeading>
              Four steps.
              <br />
              <span className="text-gradient">No mystery.</span>
            </SectionHeading>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {flow.map((step, i) => (
              <div
                key={step.n}
                className="gradient-border rounded-lg transition-smooth hover:-translate-y-1 hover:shadow-glow-soft animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex h-full flex-col rounded-lg bg-card p-7 shadow-card">
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-2xl font-semibold tracking-tight text-primary/70"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
                      {step.label}
                    </span>
                  </div>
                  <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                  {i < flow.length - 1 && (
                    <ArrowRight
                      className="mt-6 h-4 w-4 text-primary/60"
                      strokeWidth={1.75}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Disqualifier */}
        <Section>
          <div className="gradient-border rounded-lg">
            <div className="rounded-lg bg-card p-8 shadow-card md:p-12">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <SectionEyebrow>Honest disclosure</SectionEyebrow>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-[32px]">
                    We&rsquo;re not the partner for{" "}
                    <span className="text-gradient">every agency.</span>
                  </h3>
                </div>
                <div className="lg:col-span-7">
                  <p className="text-[15px] leading-relaxed text-muted-foreground md:text-base">
                    We work best with agencies that already run Meta or Google
                    ads, have at least three retained clients, and want to
                    upgrade from $1k/month ads-only retainers to $3–5k/month
                    systems retainers. If you&rsquo;re a freelancer,
                    we&rsquo;d be happy to send a referral link instead. If
                    you&rsquo;re an enterprise agency with internal ops,
                    we&rsquo;re probably overkill for what you need.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Partner CTA */}
        <section
          id="partner-call"
          className="relative isolate overflow-hidden py-24 md:py-32"
        >
          <div className="absolute inset-0 -z-30 mesh-bg" aria-hidden />
          <div className="noise absolute inset-0 -z-0" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute right-1/4 top-1/3 -z-10 h-[400px] w-[400px] animate-orb-float rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(closest-side, hsl(var(--primary) / 0.45), transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <div className="container relative mx-auto max-w-[1320px] px-5 md:px-8">
            <div className="mx-auto max-w-[760px] text-center">
              <h2
                className="text-balance font-semibold tracking-tight text-foreground"
                style={{
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.035em",
                }}
              >
                Share your client mix,
                <br />
                <span className="text-gradient">
                  and we&rsquo;ll model the MRR uplift.
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-[58ch] text-balance text-lg leading-relaxed text-muted-foreground">
                30-minute call. We&rsquo;ll walk through the partner
                economics against your actual client mix and give you a
                clear sense of whether it&rsquo;s worth your time.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="hero"
                  size="xl"
                  href="https://cal.com/xovera/partner"
                  external
                >
                  Book partner inquiry
                </Button>
                <Button
                  variant="glass"
                  size="xl"
                  href="mailto:partners@xovera.io"
                  external
                >
                  partners@xovera.io
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Stat({
  value,
  label,
  hot,
}: {
  value: string;
  label: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-md border border-border/50 bg-card/60 p-4 backdrop-blur-md">
      <div
        className={`text-2xl font-semibold tracking-tight md:text-[28px] ${hot ? "heat-text" : "text-foreground"}`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
