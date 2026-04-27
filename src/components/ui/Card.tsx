import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  hoverLift?: boolean;
}

export function Card({
  children,
  className,
  innerClassName,
  hoverLift = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "gradient-border rounded-lg",
        hoverLift &&
          "transition-smooth hover:-translate-y-1 hover:shadow-glow-soft",
        className,
      )}
    >
      <div
        className={cn(
          "relative h-full rounded-lg bg-card p-8 shadow-card",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CardIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardEyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return (
    <p className="text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
