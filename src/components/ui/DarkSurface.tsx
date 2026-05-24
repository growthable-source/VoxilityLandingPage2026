import { cn } from "@/lib/cn";

type DarkSurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Render macOS-style window chrome (3 traffic-light dots + 1px ring) */
  chrome?: boolean;
  /** Optional small label rendered in the chrome bar (e.g. "voxility.ai/dashboard") */
  chromeLabel?: string;
};

/**
 * Forces dark design tokens on its subtree regardless of the active root theme.
 * Used for product screenshots / dashboard chrome that should always read as dark UI.
 */
export function DarkSurface({
  chrome = false,
  chromeLabel,
  className,
  children,
  ...rest
}: DarkSurfaceProps) {
  return (
    <div
      {...rest}
      className={cn(
        "vx-dark-surface relative overflow-hidden rounded-lg border border-border/60 shadow-card",
        className,
      )}
    >
      {chrome ? (
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(0_70%_55%)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(40_85%_55%)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(140_55%_45%)]" />
          {chromeLabel ? (
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">
              {chromeLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}
