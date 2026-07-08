import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HL } from "@/components/verticals/HL";
import { RevenueCalculator } from "@/components/verticals/RevenueCalculator";
import { VERTICAL_PATH_PARAMS, getVerticalByPath } from "@/lib/verticals";

const SITE_URL = "https://xovera.io";

export function generateStaticParams() {
  return VERTICAL_PATH_PARAMS.map((vertical) => ({ vertical }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const v = getVerticalByPath(vertical);
  if (!v) return {};
  const url = `${SITE_URL}/ai-for-${v.slug}/calculator`;
  const title = `The 60-Second Missed-Revenue Calculator for ${v.name} | Xovera`;
  return {
    title,
    description: v.calcCopy.subhead,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: v.calcCopy.subhead,
      url,
      siteName: "Xovera",
      locale: "en_US",
      type: "website",
    },
  };
}

const stats = [
  { v: "Up to 35%", l: "of inbound calls to service businesses go unanswered" },
  { v: "47m", l: "median time before a new form fill gets its first reply" },
  { v: "78%", l: "of callers buy from whoever responds first" },
];

const nextSteps = [
  {
    n: "01",
    t: "Your numbers, right away",
    d: "The estimate appears on screen the moment you finish — bookings and dollars, no waiting.",
  },
  {
    n: "02",
    t: "A breakdown in your inbox",
    d: "We email you the full working so you can sanity-check the assumptions with your team.",
  },
  {
    n: "03",
    t: "A call, if you'd like one",
    d: "If the numbers warrant it, we're happy to walk through what closing the gap looks like on a short call.",
  },
];

export default async function Page({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = getVerticalByPath(vertical);
  if (!v) notFound();

  return (
    <>
      {/* Slim header — this page is an ad destination, so no site nav */}
      <header className="glass-surface fixed inset-x-0 top-0 z-50 border-b border-border/40">
        <div className="container mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:px-8">
          <Link href="/" aria-label="Xovera home">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              60-second calculator
            </span>
          </div>
        </div>
      </header>

      <main className="relative isolate overflow-hidden pt-28 md:pt-36">
        <div className="absolute inset-0 -z-30 mesh-bg" aria-hidden />
        <div className="absolute inset-0 -z-20 grid-overlay opacity-50" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 top-24 -z-10 h-[480px] w-[480px] animate-orb-float rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, var(--orb-glow-primary), transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[520px] w-[520px] rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, var(--orb-glow-amber), transparent 70%)",
            filter: "blur(80px)",
            animation: "orb-float 16s ease-in-out infinite reverse",
          }}
        />
        <div className="noise absolute inset-0 -z-0" aria-hidden />

        <div className="container mx-auto max-w-[1320px] px-5 md:px-8">
          {/* Hero */}
          <div className="mx-auto max-w-[820px] text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {v.calc.audience}
              </span>
            </div>

            <h1
              className="text-balance font-semibold tracking-tight text-foreground"
              style={{
                fontSize: "clamp(2.25rem, 5.5vw, 4.25rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
              }}
            >
              <HL value={v.calcCopy.h1} />
            </h1>

            <p className="mx-auto mt-6 max-w-[56ch] text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              {v.calcCopy.subhead}
            </p>
          </div>

          {/* Calculator */}
          <div className="mx-auto mt-12 max-w-[720px] md:mt-16">
            <RevenueCalculator vertical={v} />
          </div>

          {/* Industry stats */}
          <div className="mx-auto mt-16 max-w-[960px] md:mt-24">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s) => (
                <div key={s.v} className="gradient-border rounded-lg">
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
            <p className="mt-4 text-center text-[12px] text-muted-foreground/70">
              Industry averages from published missed-call and lead-response
              studies. Your results are an estimate, not a quote.
            </p>
          </div>

          {/* What happens next */}
          <div className="mx-auto mt-16 max-w-[960px] pb-20 md:mt-24 md:pb-28">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              What happens after you hit calculate
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {nextSteps.map((step) => (
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
          </div>
        </div>
      </main>

      {/* Slim footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-3 px-5 py-8 md:flex-row md:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} Xovera
          </p>
          <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
            <Link href="/privacy" className="transition-fast hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-fast hover:text-foreground">
              Terms
            </Link>
            <Link
              href={`/ai-for-${v.slug}`}
              className="transition-fast hover:text-foreground"
            >
              How it works
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
