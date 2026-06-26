"use client";

import { useEffect, useRef } from "react";
import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";

const phases = [
  {
    days: "Days 0–14",
    label: "Stand up",
    headline: "Xovera AI goes live. Calls answered. Leads replied to in seconds.",
    bullets: [
      "Number ported or new local number provisioned",
      "GoHighLevel or HubSpot wired to your booking system",
      "Inbound call, SMS, web chat, form fills all routed through Xovera AI",
      "First reporting view live by day 10",
    ],
  },
  {
    days: "Days 14–30",
    label: "Acquire",
    headline: "Meta campaigns running against a purpose-built landing page.",
    bullets: [
      "Offer, audience, creative shot or built — not stock",
      "Landing page designed, copywritten, deployed",
      "Tracking layer (server-side + Meta CAPI) installed",
      "First booked appointments attributable to spend",
    ],
  },
  {
    days: "Days 30–60",
    label: "Compound",
    headline: "Optimization, reactivation, review velocity — the system gets tighter month by month.",
    bullets: [
      "Daily ad iteration, weekly creative refresh",
      "Outbound nurture flows on stale leads in your CRM",
      "Review-request flow turned on day-after-appointment",
      "Monthly forecast accuracy ±10% on bookings",
    ],
  },
];

export function Onboarding() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (items.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const i = Number(el.dataset.revealIndex ?? "0");
            el.style.transitionDelay = `${i * 120}ms`;
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="onboarding" className="relative">
      <div className="mb-16 max-w-[660px]">
        <SectionEyebrow>How we onboard</SectionEyebrow>
        <SectionHeading>
          Live in two weeks.
          <br />
          <span className="text-gradient">Booked appointments by week three.</span>
        </SectionHeading>
        <SectionLede>
          You don&rsquo;t need to learn a new CRM, and you don&rsquo;t need
          weekly calls. We hand over a working system, then keep tuning it
          together.
        </SectionLede>
      </div>

      <div className="relative" ref={rootRef}>
        {/* Timeline rail (desktop) */}
        <div
          className="absolute inset-x-0 top-[42px] hidden h-px bg-gradient-to-r from-primary-deep via-primary to-primary-glow md:block"
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {phases.map((phase, i) => (
            <div
              key={phase.days}
              data-reveal
              data-reveal-index={i}
              className="reveal-on-scroll relative"
            >
              {/* Marker dot */}
              <div className="relative z-10 mb-7 hidden md:block">
                <span className="absolute left-0 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                  <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary/40 blur-md" />
                  <span className="relative h-3 w-3 rounded-full bg-primary shadow-glow ring-4 ring-background" />
                </span>
                <div className="pl-9 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {phase.days} · {phase.label}
                </div>
              </div>

              <div className="md:hidden mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                {phase.days} · {phase.label}
              </div>

              <div className="gradient-border rounded-lg transition-smooth hover:-translate-y-1 hover:shadow-glow-soft">
                <div className="rounded-lg bg-card p-7 shadow-card md:p-8">
                  <h3 className="text-[19px] font-semibold tracking-tight text-foreground">
                    {phase.headline}
                  </h3>

                  <ul className="mt-5 space-y-2.5">
                    {phase.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-[14px] leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-glow" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
