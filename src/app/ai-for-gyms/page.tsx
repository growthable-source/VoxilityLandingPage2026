import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  PhoneCall,
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
import { GymChatDemo } from "@/components/gyms/GymChatDemo";
import { GymHeroVideo } from "@/components/gyms/GymHeroVideo";
import { GymDemoForm } from "@/components/gyms/GymDemoForm";
import { GymsFAQ } from "@/components/gyms/GymsFAQ";

const PAGE_TITLE =
  "Xovera AI for Gyms — Turn every lead into a paying member, automatically";
const PAGE_DESCRIPTION =
  "The moment a lead comes in — call, text, DM, or ad — Xovera answers in seconds, qualifies them, and books the tour. 24/7, US & Canada, works with Mindbody, ABC, Club Automation and more.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "https://xovera.io/ai-for-gyms" },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://xovera.io/ai-for-gyms",
    siteName: "Xovera",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://xovera.io/og.png",
        width: 1200,
        height: 630,
        alt: "Xovera AI for gyms and fitness studios.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: ["https://xovera.io/og.png"],
  },
};

const heroMetrics = [
  { v: "Seconds", l: "to first response on every lead" },
  { v: "24/7", l: "coverage — nights, weekends, holidays" },
  { v: "US + CA", l: "with local numbers in both countries" },
];

const integrations = [
  "Mindbody",
  "ABC Fitness",
  "Club Automation",
  "Zen Planner",
  "Glofox",
  "Mariana Tek",
  "PushPress",
  "Wodify",
  "Trainerize",
  "Clubworx",
  "Gymdesk",
  "TeamUp",
];

const demoMetrics = [
  { v: "<60s", l: "average reply time" },
  { v: "3.2×", l: "more tours booked" },
  { v: "0", l: "leads to voicemail" },
];

const setupSteps = [
  {
    n: "01",
    t: "Connect your tools",
    d: "Link your CRM, calendar, and ad accounts in a few minutes. No developer required.",
  },
  {
    n: "02",
    t: "Xovera engages every lead",
    d: "Web forms, DMs, missed calls, and ad clicks all get an instant, on-brand response by text and voice.",
  },
  {
    n: "03",
    t: "Tours & trials get booked",
    d: "The agent qualifies, answers questions, and books straight onto your calendar — then logs it in your CRM.",
  },
  {
    n: "04",
    t: "You see members, not clicks",
    d: "Every interaction is tracked end-to-end, so you know exactly which ads and channels fill your floor.",
  },
];

export default function AiForGymsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero — full-bleed background video, ported from app.xovera.io */}
        <section className="relative isolate flex min-h-[clamp(560px,86vh,820px)] items-center justify-center overflow-hidden px-5 py-24 md:px-8">
          {/* Poster fallback paints first and covers reduced-motion */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/landing/gym-hero-poster.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 -z-30 h-full w-full object-cover"
          />
          <GymHeroVideo />
          {/* Scrims — hero sits on dark footage in both themes */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, rgba(7,8,12,0.80) 0%, rgba(7,8,12,0.55) 45%, rgba(7,8,12,0.84) 100%)",
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

          <div className="relative z-10 mx-auto max-w-[860px] pt-10 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
                For gyms &amp; fitness studios · US &amp; Canada
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
              Turn every lead into a{" "}
              <span className="text-gradient">paying member</span> —
              automatically.
            </h1>

            <p className="mx-auto mt-7 max-w-[58ch] text-balance text-lg leading-relaxed text-white/75 md:text-[20px]">
              The moment a lead comes in — call, text, DM, or ad — Xovera
              answers in seconds, routes it to the right instructor or
              salesperson, and follows up until they&rsquo;re signed up and
              paying. Any hour, with nobody at the desk.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <div className="conic-border inline-flex rounded-md">
                <Button variant="hero" size="xl" href="#contact">
                  Book a demo
                </Button>
              </div>
              <Button
                variant="glass"
                size="xl"
                href="https://app.xovera.io/"
                external
                className="border-white/20 bg-black/40 text-white hover:bg-black/60"
              >
                Start free
              </Button>
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
              Free while in beta — no card required
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />
        </section>

        {/* Metrics + calculator cross-link */}
        <section className="relative">
          <div className="container mx-auto max-w-[1320px] px-5 py-14 md:px-8 md:py-16">
            {/* Metrics strip */}
            <div className="mx-auto grid max-w-[880px] grid-cols-1 gap-4 sm:grid-cols-3">
              {heroMetrics.map((m) => (
                <div
                  key={m.v}
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

            {/* Calculator cross-link */}
            <div className="mx-auto mt-8 max-w-[880px]">
              <Link
                href="/gym-calculator"
                className="group flex flex-col items-start justify-between gap-2 rounded-lg border border-border/50 bg-muted/40 px-5 py-4 transition-fast hover:border-primary/40 hover:bg-muted/70 sm:flex-row sm:items-center"
              >
                <span className="text-[14px] text-foreground/90">
                  Curious what missed calls and slow follow-up cost your gym
                  today? Run the 60-second calculator.
                </span>
                <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-primary-glow">
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
              We don&rsquo;t replace your gym software.
              <br />
              <span className="text-gradient">We run your growth on top of it.</span>
            </SectionHeading>
            <SectionLede className="mx-auto">
              Keep Mindbody, ABC, Club Automation — whatever runs your floor.
              Xovera layers on top to take over lead acquisition and marketing:
              every inquiry answered, qualified, and booked. Built on
              GoHighLevel, our preferred platform, so you get enterprise-grade
              automation without running it yourself.
            </SectionLede>

            <div className="mt-10 flex flex-wrap justify-center gap-2.5">
              {integrations.map((name) => (
                <span
                  key={name}
                  className="inline-flex h-10 items-center rounded-md border border-border/50 bg-card/70 px-4 font-mono text-[13px] tracking-tight text-foreground/85"
                >
                  {name}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[13px] text-muted-foreground">
              Don&rsquo;t see your system? We&rsquo;ll build the integration —
              it&rsquo;s quick.
            </p>
          </div>
        </Section>

        <div className="letterbox-divider" aria-hidden />

        {/* Three growth methods */}
        <Section id="methods">
          <SectionEyebrow>Three ways it grows your gym</SectionEyebrow>
          <SectionHeading>
            Every lead worked,
            <br />
            <span className="text-gradient">whichever door it comes through.</span>
          </SectionHeading>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card>
              <CardIcon>
                <Zap className="h-5 w-5" strokeWidth={2} />
              </CardIcon>
              <CardTitle>Reply in seconds, not hours</CardTitle>
              <CardBody>
                The instant someone fills out a form, DMs your page, or calls
                and you miss it, Xovera texts and calls back automatically —
                qualifies them and books a tour while they&rsquo;re still
                interested. Leads contacted within five minutes convert
                dramatically more than ones you get to tomorrow.
              </CardBody>
            </Card>
            <Card>
              <CardIcon>
                <Target className="h-5 w-5" strokeWidth={2} />
              </CardIcon>
              <CardTitle>Turn ad spend into booked tours</CardTitle>
              <CardBody>
                Connect your Meta and Google ads and every click that becomes a
                lead is instantly engaged, qualified, and booked — with the
                outcome written back to your CRM. See real cost-per-tour and
                cost-per-member, not just cost-per-click.
              </CardBody>
            </Card>
            <Card>
              <CardIcon>
                <PhoneCall className="h-5 w-5" strokeWidth={2} />
              </CardIcon>
              <CardTitle>An AI receptionist that never misses a call</CardTitle>
              <CardBody>
                A natural, human-sounding voice answers every call 24/7 —
                handles &ldquo;how much is membership?&rdquo;, books trials and
                tours straight onto your calendar, and routes real issues to
                your team. Even at 11pm on a Sunday, no call goes to voicemail.
              </CardBody>
            </Card>
          </div>
        </Section>

        {/* Live demo */}
        <Section id="demo" className="relative">
          <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60" aria-hidden />
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionEyebrow>While the desk is closed</SectionEyebrow>
              <SectionHeading>
                A missed inquiry at 9pm.
                <br />
                <span className="text-gradient">A booked tour by 9:01.</span>
              </SectionHeading>
              <SectionLede>
                While your front desk is closed, Xovera texts back in seconds,
                answers the real questions, and books the tour straight onto
                your calendar — then logs it in your CRM. No lead left on read.
              </SectionLede>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {demoMetrics.map((m) => (
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
              <GymChatDemo />
            </div>
          </div>
        </Section>

        <div className="letterbox-divider" aria-hidden />

        {/* Ads: self-serve or managed */}
        <Section id="ads">
          <div className="mx-auto max-w-[820px] text-center">
            <SectionEyebrow className="justify-center">
              Your ads, your call
            </SectionEyebrow>
            <SectionHeading className="mx-auto">
              Run the ads yourself —
              <br />
              <span className="text-gradient">or hand us the keys.</span>
            </SectionHeading>
            <SectionLede className="mx-auto">
              Either way it&rsquo;s the same platform and the same agent
              working every lead. Start hands-on, upgrade to fully managed
              whenever you want.
            </SectionLede>
          </div>

          <div className="mx-auto mt-12 grid max-w-[880px] grid-cols-1 gap-5 md:grid-cols-2">
            <Card>
              <CardTitle>Launch your own ads</CardTitle>
              <ul className="mt-2 space-y-3">
                {[
                  "Meta & Google in one place",
                  "Leads auto-engaged & booked",
                  "Cost-per-tour reporting",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <CardTitle>Have us run them for you</CardTitle>
              <ul className="mt-2 space-y-3">
                {[
                  "We plan, launch & optimize",
                  "Creative & copy testing",
                  "You keep full visibility",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15px] text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button variant="glass" size="default" href="#contact">
                  Ask us about managed ads
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </Section>

        {/* Voice AI */}
        <Section id="voice" className="relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <SectionEyebrow>Voice AI receptionist</SectionEyebrow>
              <SectionHeading>
                Never miss another call —
                <br />
                <span className="text-gradient">even at 11pm.</span>
              </SectionHeading>
              <SectionLede>
                A natural-sounding AI answers every call the second it rings —
                day, night, weekends. It knows your memberships, classes and
                hours, routes the call to the right instructor or salesperson,
                and books the lead in. No voicemail, no missed members.
              </SectionLede>
            </div>
            <div className="lg:col-span-6">
              <div className="space-y-4">
                {[
                  "Answers 24/7 in a real, human-sounding voice",
                  "Routes to the right person — or handles it end-to-end",
                  "Books trials & tours, then follows up by text",
                ].map((f) => (
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
                <div className="pt-2">
                  <Button variant="glass" size="lg" href="#contact">
                    Hear it handle a real call
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
              Live in an afternoon
            </SectionEyebrow>
            <SectionHeading className="mx-auto">
              No new software
              <br />
              <span className="text-gradient">for your team to learn.</span>
            </SectionHeading>
            <SectionLede className="mx-auto">
              It works the leads you already get — your team keeps doing what
              they do on the floor.
            </SectionLede>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {setupSteps.map((step) => (
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
          <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-gradient-subtle opacity-60" aria-hidden />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
              <SectionEyebrow>Book a demo</SectionEyebrow>
              <SectionHeading>
                See it answer a real lead
                <br />
                <span className="text-gradient">for your gym.</span>
              </SectionHeading>
              <SectionLede>
                In 20 minutes we&rsquo;ll show Xovera answering a real lead for
                your gym — texting, qualifying, and booking a tour live. Grab a
                time, it&rsquo;s on us.
              </SectionLede>

              <ul className="mt-8 space-y-3">
                {[
                  "Free while in beta — no card required",
                  "Live in an afternoon, no new software to learn",
                  "Local numbers across the US & Canada",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[15px] text-muted-foreground"
                  >
                    <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <GymDemoForm />
            </div>
          </div>
        </Section>

        <GymsFAQ />
      </main>
      <Footer />
    </>
  );
}
