import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  PhoneCall,
  ShieldCheck,
  Target,
  Zap,
} from "lucide-react";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionEyebrow,
  SectionHeading,
  SectionLede,
} from "@/components/ui/Section";
import { Card, CardBody, CardIcon, CardTitle } from "@/components/ui/Card";
import { VoiceSampleButton } from "@/components/gyms/VoiceSampleButton";
import { HL } from "@/components/verticals/HL";
import { VoiceDemo } from "@/components/verticals/VoiceDemo";
import { ChatDemo } from "@/components/verticals/ChatDemo";
import { DemoForm } from "@/components/verticals/DemoForm";
import { VerticalFAQ } from "@/components/verticals/VerticalFAQ";
import { StickyMobileCTA } from "@/components/verticals/StickyMobileCTA";
import { SignupCTA } from "@/components/verticals/SignupCTA";
import type { Method, Vertical } from "@/lib/verticals/types";

const ICONS = {
  Zap,
  Target,
  PhoneCall,
  Clock,
  CalendarCheck,
  ShieldCheck,
} as const;

function MethodIcon({ icon }: { icon: Method["icon"] }) {
  const Cmp = ICONS[icon] ?? Zap;
  return <Cmp className="h-5 w-5" strokeWidth={2} />;
}

/**
 * The data-driven vertical landing page. Sections follow the growth report's
 * order: ungated voice demo hero → metrics + calculator → integrations →
 * problem/value → methods → scripted demo → voice → setup → demo form →
 * sibling verticals → FAQ. Everything reads from one `Vertical` config.
 */
export function VerticalPage({
  vertical,
  siblings,
}: {
  vertical: Vertical;
  siblings: Vertical[];
}) {
  return (
    <>
      <Nav />
      <main className="pb-20 md:pb-0">
        {/* Hero — full-bleed photographic, matching /ai-for-gyms */}
        <section className="relative isolate flex min-h-[clamp(560px,86vh,820px)] items-center justify-center overflow-hidden px-5 py-24 md:px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/landing/${vertical.slug}-hero.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
          {/* Scrims — hero sits on the photo in both themes */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,8,12,0.82) 0%, rgba(7,8,12,0.58) 45%, rgba(7,8,12,0.86) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse at 80% 15%, hsl(var(--primary) / 0.24), transparent 55%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-[880px] pt-10 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                {vertical.hero.badge}
              </span>
            </div>

            <h1
              className="text-balance font-semibold tracking-tight text-white"
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
              }}
            >
              <HL value={vertical.hero.h1} />
            </h1>

            <p className="mx-auto mt-7 max-w-[58ch] text-balance text-lg leading-relaxed text-white/75 md:text-[20px]">
              {vertical.hero.subhead}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <div className="conic-border inline-flex rounded-md">
                <Button variant="hero" size="xl" href="#demo">
                  Talk to the receptionist
                </Button>
              </div>
              <SignupCTA
                href={vertical.signupUrl}
                slug={vertical.slug}
                variant="glass"
                size="xl"
                className="border-white/20 bg-black/40 text-white hover:bg-black/60"
              >
                Start free
              </SignupCTA>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              Free while in beta — no card required
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />
        </section>

        {/* Ungated voice demo — the report's aha moment, kept prominent */}
        <Section id="demo" className="pt-14 pb-0 md:pt-16">
          <div className="mx-auto max-w-[640px]">
            <VoiceDemo vertical={vertical} />
          </div>
        </Section>

        {/* Metrics + calculator cross-link */}
        <section className="relative">
          <div className="container mx-auto max-w-[1320px] px-5 py-14 md:px-8 md:py-16">
            <div className="mx-auto grid max-w-[880px] grid-cols-1 gap-4 sm:grid-cols-3">
              {vertical.hero.metrics.map((m) => (
                <div
                  key={m.l}
                  className="rounded-lg border border-border/50 bg-card/60 p-5 text-center backdrop-blur-sm"
                >
                  <div className="heat-text font-mono text-2xl font-semibold tracking-tight">
                    {m.v}
                  </div>
                  <div className="mt-1.5 text-[13px] leading-snug text-muted-foreground">
                    {m.l}
                  </div>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-8 max-w-[880px]">
              <Link
                href={`/ai-for-${vertical.slug}/calculator`}
                className="group flex flex-col items-start justify-between gap-2 rounded-lg border border-border/50 bg-muted/40 px-5 py-4 transition-fast hover:border-primary/40 hover:bg-muted/70 sm:flex-row sm:items-center"
              >
                <span className="text-[14px] text-foreground/90">
                  {vertical.calcCopy.crossLink}
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium text-primary-glow">
                  Get your estimate
                  <ArrowRight className="h-3.5 w-3.5 transition-smooth group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <Section id="integrations">
          <div className="mx-auto max-w-[820px] text-center">
            <SectionEyebrow className="justify-center">
              Works with what you already run
            </SectionEyebrow>
            <SectionHeading className="mx-auto">
              <HL value={vertical.integrations.heading} />
            </SectionHeading>
            <SectionLede className="mx-auto">{vertical.integrations.lede}</SectionLede>

            <div className="relative mt-10 overflow-hidden py-2">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent"
              />
              <ul className="marquee-track items-center gap-12">
                {[...vertical.integrations.tools, ...vertical.integrations.tools].map(
                  (name, i) => (
                    <li
                      key={`${name}-${i}`}
                      aria-hidden={i >= vertical.integrations.tools.length}
                      className="shrink-0 whitespace-nowrap text-xl font-bold tracking-tight text-muted-foreground/70 md:text-2xl"
                    >
                      {name}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <p className="mt-5 text-[13px] text-muted-foreground">
              Don&rsquo;t see your system? We&rsquo;ll build the integration —
              it&rsquo;s quick.
            </p>
          </div>
        </Section>

        <div className="letterbox-divider" aria-hidden />

        {/* Problem / value with real numbers */}
        <Section id="problem">
          <div className="mx-auto max-w-[820px] text-center">
            <SectionEyebrow className="justify-center">
              {vertical.problem.eyebrow}
            </SectionEyebrow>
            <SectionHeading className="mx-auto">
              <HL value={vertical.problem.heading} />
            </SectionHeading>
            <SectionLede className="mx-auto">{vertical.problem.lede}</SectionLede>
          </div>
          <div className="mx-auto mt-12 grid max-w-[960px] grid-cols-1 gap-4 sm:grid-cols-3">
            {vertical.problem.stats.map((s) => (
              <div key={s.l} className="gradient-border rounded-lg">
                <div className="rounded-lg bg-card p-6 shadow-card">
                  <div
                    className="heat-text font-mono text-3xl font-semibold tracking-tight"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {s.v}
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                    {s.l}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Three growth methods */}
        <Section id="methods">
          <SectionEyebrow>{vertical.methods.eyebrow}</SectionEyebrow>
          <SectionHeading>
            <HL value={vertical.methods.heading} />
          </SectionHeading>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {vertical.methods.items.map((m) => (
              <Card key={m.title}>
                <CardIcon>
                  <MethodIcon icon={m.icon} />
                </CardIcon>
                <CardTitle>{m.title}</CardTitle>
                <CardBody>{m.body}</CardBody>
              </Card>
            ))}
          </div>
        </Section>

        {/* Scripted demo */}
        <Section id="conversation" className="relative">
          <div
            className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60"
            aria-hidden
          />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionEyebrow>{vertical.demo.eyebrow}</SectionEyebrow>
              <SectionHeading>
                <HL value={vertical.demo.heading} />
              </SectionHeading>
              <SectionLede>{vertical.demo.lede}</SectionLede>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {vertical.demo.metrics.map((m) => (
                  <div key={m.l}>
                    <div
                      className="heat-text font-mono text-2xl font-semibold tracking-tight md:text-3xl"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {m.v}
                    </div>
                    <div className="mt-1 text-[12px] leading-snug text-muted-foreground">
                      {m.l}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button variant="premium" size="lg" href="#contact">
                  See it answer a lead live
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ChatDemo data={vertical.chatDemo} />
            </div>
          </div>
        </Section>

        <div className="letterbox-divider" aria-hidden />

        {/* Voice AI */}
        <Section id="voice" className="relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionEyebrow>{vertical.voice.eyebrow}</SectionEyebrow>
              <SectionHeading>
                <HL value={vertical.voice.heading} />
              </SectionHeading>
              <SectionLede>{vertical.voice.lede}</SectionLede>
            </div>
            <div className="lg:col-span-6">
              <div className="space-y-4">
                {vertical.voice.bullets.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-3 rounded-lg border border-border/50 bg-card/60 p-5"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-foreground/90">
                      {f}
                    </span>
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <VoiceSampleButton />
                  <Button variant="glass" size="lg" href="#demo">
                    Talk to it yourself
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <div className="letterbox-divider" aria-hidden />

        {/* Setup */}
        <Section id="setup">
          <div className="mx-auto max-w-[820px] text-center">
            <SectionEyebrow className="justify-center">
              {vertical.setup.eyebrow}
            </SectionEyebrow>
            <SectionHeading className="mx-auto">
              <HL value={vertical.setup.heading} />
            </SectionHeading>
            <SectionLede className="mx-auto">{vertical.setup.lede}</SectionLede>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vertical.setup.steps.map((step) => (
              <div
                key={step.n}
                className="rounded-lg border border-border/50 bg-card/60 p-6"
              >
                <span className="font-mono text-xl font-semibold text-primary/70">
                  {step.n}
                </span>
                <h3 className="mt-3 text-[16px] font-semibold tracking-tight text-foreground">
                  {step.t}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">
                  {step.d}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Demo booking */}
        <Section id="contact" className="relative">
          <div
            className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60"
            aria-hidden
          />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <SectionEyebrow>{vertical.contact.eyebrow}</SectionEyebrow>
              <SectionHeading>
                <HL value={vertical.contact.heading} />
              </SectionHeading>
              <SectionLede>{vertical.contact.lede}</SectionLede>

              <ul className="mt-8 space-y-3">
                {vertical.contact.bullets.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[15px] text-muted-foreground"
                  >
                    <CalendarCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <DemoForm vertical={vertical} />
            </div>
          </div>
        </Section>

        {/* Sibling verticals — internal linking */}
        {siblings.length > 0 && (
          <Section id="other-businesses" className="!pt-0">
            <div className="mx-auto max-w-[820px] text-center">
              <SectionEyebrow className="justify-center">
                Xovera for other businesses
              </SectionEyebrow>
              <p className="mx-auto max-w-[48ch] text-[15px] leading-relaxed text-muted-foreground">
                Run a different kind of business? Xovera answers the phone for
                these too.
              </p>
            </div>
            <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap justify-center gap-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/ai-for-${s.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-[14px] text-foreground/85 transition-fast hover:border-primary/40 hover:bg-muted"
                >
                  {s.name}
                  <ArrowRight className="h-3.5 w-3.5 text-primary-glow transition-smooth group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </Section>
        )}

        <VerticalFAQ vertical={vertical} />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
