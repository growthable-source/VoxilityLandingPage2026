import { Button } from "@/components/ui/Button";
import { PartnerStrip } from "@/components/ui/PartnerStrip";
import { HeroStack } from "./HeroStack";
import { Telemetry } from "./Telemetry";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 md:pt-32">
      {/* Plane 1 — mesh */}
      <div className="absolute inset-0 -z-30 mesh-bg" aria-hidden />

      {/* Plane 2 — faint geometric grid */}
      <div className="absolute inset-0 -z-20 grid-overlay opacity-60" aria-hidden />

      {/* Plane 3 — orb floats */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-[520px] w-[520px] animate-orb-float rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.5), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-40 -z-10 h-[600px] w-[600px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary-glow) / 0.45), transparent 70%)",
          filter: "blur(80px)",
          animation: "orb-float 16s ease-in-out infinite reverse",
        }}
      />

      {/* Plane 4 — noise grain */}
      <div className="noise absolute inset-0 -z-0" aria-hidden />

      <div className="container mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Copy */}
          <div className="relative z-10 lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 backdrop-blur-md">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
                <span className="absolute inset-0 rounded-full bg-primary" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Revenue architecture for appointment-driven service businesses
              </span>
            </div>

            <h1
              className="text-balance font-semibold tracking-tight text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.25rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
              }}
            >
              Booked{" "}
              <span className="text-gradient">appointments</span>,
              <br className="hidden md:inline" /> end-to-end.
            </h1>

            <p className="mt-7 max-w-[58ch] text-balance text-lg leading-relaxed text-muted-foreground md:text-[21px]">
              We run your Meta ads, design the landing pages they connect to,
              and look after the inbound conversation — so your team can stay
              focused on the people in front of them. One partner across the
              path from ad click to booked appointment.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button variant="hero" size="xl" href="#contact">
                Book a 30-min strategy call
              </Button>
              <Button variant="glass" size="xl" href="#system">
                See the system
              </Button>
            </div>

            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Certified partner
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
              </div>
              <PartnerStrip />
            </div>
          </div>

          {/* Visual stack */}
          <div className="relative z-10 flex justify-center lg:col-span-5 lg:justify-end">
            <HeroStack />
          </div>
        </div>

        {/* Telemetry strip — sits below hero, replaces a generic subheadline */}
        <div className="mt-20">
          <Telemetry />
        </div>
      </div>

      {/* Bottom amber rule */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-glow/40 to-transparent" />
    </section>
  );
}

