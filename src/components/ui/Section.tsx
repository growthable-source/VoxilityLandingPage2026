import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
  bare?: boolean;
}

export function Section({
  children,
  id,
  className,
  containerClassName,
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        !bare && "py-20 md:py-28",
        className,
      )}
    >
      <div
        className={cn(
          "container mx-auto max-w-[1320px] px-5 md:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function SectionEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground",
        className,
      )}
    >
      <span className="inline-block h-px w-6 bg-gradient-to-r from-primary to-transparent" />
      {children}
    </div>
  );
}

export function SectionHeading({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "max-w-[22ch] text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl",
        className,
      )}
      style={{ lineHeight: 1.04, letterSpacing: "-0.03em" }}
    >
      {children}
    </h2>
  );
}

export function SectionLede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-6 max-w-[60ch] text-balance text-lg leading-relaxed text-muted-foreground md:text-xl",
        className,
      )}
    >
      {children}
    </p>
  );
}
