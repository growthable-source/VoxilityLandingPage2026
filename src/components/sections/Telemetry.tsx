import { cn } from "@/lib/cn";

interface Stat {
  label: string;
  value: string;
  delta?: string;
  hot?: boolean;
}

const stats: Stat[] = [
  { label: "Booked / wk", value: "418", delta: "+12.4%", hot: true },
  { label: "Avg reply", value: "00:04s", delta: "−71%" },
  { label: "Missed-call save", value: "94%", delta: "+38pts" },
  { label: "Cost / booking", value: "$71", delta: "−$48" },
  { label: "Show rate", value: "82%", delta: "+9pts" },
  { label: "After-hours leads recovered", value: "1,246", delta: "30d" },
];

export function Telemetry({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "letterbox relative w-full overflow-hidden border-y border-border/50 bg-card/40 backdrop-blur-md",
        className,
      )}
      aria-label="Xovera live telemetry"
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-5 py-5 md:grid-cols-3 md:px-8 lg:grid-cols-6 lg:gap-x-10">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex flex-col gap-1.5 border-l border-border/40 pl-4",
              i === 0 && "border-l-0 pl-0",
              i === 3 && "lg:border-l-0 lg:pl-0",
            )}
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.label}
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={cn(
                  "font-mono text-2xl font-semibold tracking-tight md:text-[28px]",
                  s.hot ? "heat-text" : "text-foreground",
                )}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {s.value}
              </span>
              {s.delta && (
                <span className="font-mono text-[11px] text-primary-glow/80">
                  {s.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}
