import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { ArrowUpRight } from "lucide-react";

export function AgenciesBlock() {
  return (
    <Section id="agencies" className="relative">
      <div className="gradient-border relative overflow-hidden rounded-lg">
        <div className="relative grid grid-cols-1 gap-10 rounded-lg bg-card p-8 shadow-card md:p-12 lg:grid-cols-12 lg:items-center lg:p-16">
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                "radial-gradient(60% 60% at 90% 10%, hsl(var(--primary-glow) / 0.15) 0%, transparent 60%), radial-gradient(50% 50% at 10% 90%, hsl(var(--primary-deep) / 0.18) 0%, transparent 60%)",
            }}
          />

          <div className="relative lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
                For agencies
              </span>
            </div>

            <h2
              className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-[44px]"
              style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Resell the system{" "}
              <span className="text-gradient">under your own brand.</span>
            </h2>

            <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground md:text-[17px]">
              You already run Meta ads for clients. We provide the landing
              page, the AI, and the CRM as a productized offer wrapped under
              your name — typically $2–5k/mo additional MRR per client,
              without hiring.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/agencies" variant="hero" size="lg">
                See the agency model
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button href="#contact" variant="glass" size="lg">
                Talk to a partner manager
              </Button>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Avg MRR added per client" value="$3.4k" />
              <Stat label="Onboarding to live" value="14 days" hot />
              <Stat label="Margin after our cost" value="55–70%" />
              <Stat label="Churn (12mo cohort)" value="<6%" />
            </div>
          </div>
        </div>
      </div>
    </Section>
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
    <div className="rounded-md border border-border/50 bg-card/70 p-5 backdrop-blur-md">
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
