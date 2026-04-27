import { cn } from "@/lib/cn";

const bookingSystems = [
  "Mindbody",
  "Boulevard",
  "Vagaro",
  "Jane",
  "SimplePractice",
  "Acuity",
  "Cliniko",
  "Fresha",
];

const calendars = ["Google Calendar", "Outlook", "Apple Calendar"];

const crms = ["GoHighLevel", "HubSpot", "Pipedrive", "Salesforce"];

interface IntegrationsRowProps {
  className?: string;
  variant?: "compact" | "wide";
}

/**
 * Honest representation: we don't own the brand marks for third-party booking systems.
 * Show them as styled chips with the brand name in a clean treatment —
 * communicates "we integrate" without faking logo artwork.
 */
export function IntegrationsRow({
  className,
  variant = "wide",
}: IntegrationsRowProps) {
  const all = variant === "compact" ? bookingSystems : [...crms, ...bookingSystems, ...calendars];

  return (
    <div className={cn("relative", className)}>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Integrates with
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-border via-border/60 to-transparent" />
      </div>
      <ul className="flex flex-wrap gap-2">
        {all.map((name) => (
          <li
            key={name}
            className={cn(
              "inline-flex items-center rounded-md border border-border/60 bg-card/50 px-3 py-1.5",
              "font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/80 backdrop-blur-md",
              "transition-fast hover:border-primary/50 hover:text-foreground",
            )}
          >
            <span
              className="mr-2 inline-block h-1 w-1 rounded-full bg-primary-glow/70"
              aria-hidden
            />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
