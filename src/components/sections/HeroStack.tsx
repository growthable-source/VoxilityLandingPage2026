import { cn } from "@/lib/cn";

/**
 * The peek-card stack — front card is the live Xovera AI conversation,
 * second tilted card peeks behind showing the booked appointment,
 * third card behind shows Meta Ads Manager. Three planes, three artifacts,
 * connected. Communicates "we connect these" without copy.
 */
export function HeroStack({ className }: { className?: string }) {
  return (
    <div className={cn("relative isolate w-full max-w-[440px]", className)}>
      {/* Glow halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 animate-orb-pulse opacity-80"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, hsl(var(--primary) / 0.32) 0%, transparent 60%)",
          filter: "blur(20px)",
        }}
      />

      {/* Card 3 — Meta Ads (back, lower-left) */}
      <div
        className="absolute -left-12 top-[18%] hidden w-[62%] sm:block"
        style={{ transform: "rotate(-7deg)" }}
      >
        <MiniCard
          eyebrow="Meta Ads"
          rows={[
            { l: "Phoenix • Lead Gen", r: "ACTIVE" },
            { l: "Spend (7d)", r: "$3,840" },
            { l: "CPL", r: "$11.20" },
          ]}
          tone="muted"
        />
      </div>

      {/* Card 2 — Booking confirmed (back, upper-right) */}
      <div
        className="absolute -right-10 top-[2%] hidden w-[58%] sm:block"
        style={{ transform: "rotate(6deg)" }}
      >
        <MiniCard
          eyebrow="Cliniko"
          rows={[
            { l: "Booking confirmed", r: "Wed 3:40pm" },
            { l: "Patient", r: "S. Mehta" },
            { l: "Practitioner", r: "Dr. Lin" },
          ]}
          tone="muted"
        />
      </div>

      {/* Card 1 — Xovera AI conversation (front, centered) */}
      <div className="relative mx-auto w-full animate-fade-in-up">
        <div className="gradient-border rounded-lg shadow-glow">
          <div className="relative rounded-lg bg-card/95 p-6 backdrop-blur-md">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inset-0 animate-orb-pulse rounded-full bg-primary" />
                  <span className="absolute inset-0 rounded-full bg-primary" />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Xovera AI · Live call
                </span>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                00:00:14
              </span>
            </div>

            <div className="space-y-3 text-[14px] leading-relaxed">
              <Bubble side="them">
                Hi, I saw your ad — looking for a hydrafacial. Can I get in this
                week?
              </Bubble>
              <Bubble side="us">
                Yep, we&rsquo;ve got Wednesday 3:40pm with Dr Lin or Friday
                10am. Which suits?
              </Bubble>
              <Bubble side="them">Wednesday works.</Bubble>
              <Bubble side="us" status="booked">
                Booked. Confirmation sent to your mobile. See you Wednesday.
              </Bubble>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <Pulse />
                CRM updated · pipeline → Booked
              </div>
              <span className="font-mono text-[11px] text-primary-glow">
                +1 booking
              </span>
            </div>
          </div>
        </div>

        {/* Cursor blink decoration */}
        <span className="absolute -bottom-1 right-6 inline-block h-3 w-1.5 animate-blink bg-primary-glow" />
      </div>
    </div>
  );
}

function Bubble({
  side,
  status,
  children,
}: {
  side: "us" | "them";
  status?: "booked";
  children: React.ReactNode;
}) {
  const isUs = side === "us";
  return (
    <div className={cn("flex", isUs ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "relative max-w-[78%] rounded-lg px-3.5 py-2.5",
          isUs
            ? "bg-primary/12 text-foreground"
            : "bg-secondary/80 text-foreground",
          status === "booked" &&
            "ring-1 ring-primary/40 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]",
        )}
      >
        {children}
        {status === "booked" && (
          <span className="ml-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-primary-glow">
            <span className="inline-block h-1 w-1 rounded-full bg-primary-glow" />
            Booked
          </span>
        )}
      </div>
    </div>
  );
}

function Pulse() {
  return (
    <span className="relative inline-flex h-1.5 w-1.5">
      <span className="absolute inset-0 animate-orb-pulse rounded-full bg-success/80" />
      <span className="absolute inset-0 rounded-full bg-success" />
    </span>
  );
}

function MiniCard({
  eyebrow,
  rows,
}: {
  eyebrow: string;
  rows: { l: string; r: string }[];
  tone?: "muted" | "primary";
}) {
  return (
    <div className="gradient-border rounded-lg">
      <div className="rounded-lg bg-card/85 p-4 backdrop-blur-md shadow-card">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </div>
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.l}
              className="flex items-center justify-between font-mono text-[12px] tabular-nums"
            >
              <span className="text-muted-foreground">{row.l}</span>
              <span className="text-foreground">{row.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
