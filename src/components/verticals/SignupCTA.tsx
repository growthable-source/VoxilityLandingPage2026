"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { trackStartedPaidSignup } from "@/lib/tracking";

/**
 * The paid "Start free / Get my number" CTA. Fires StartedPaidSignup, then the
 * inner link navigates to the vertical's signup destination (xovera.io/<niche>).
 * The wrapping span uses `display:contents` so it adds no layout box — the click
 * bubbles up from the anchor.
 */
export function SignupCTA({
  href,
  slug,
  children,
  variant = "glass",
  size = "lg",
  className,
}: {
  href: string;
  slug: string;
  children: ReactNode;
  variant?: "hero" | "premium" | "glass" | "accent" | "ghost";
  size?: "default" | "lg" | "xl";
  className?: string;
}) {
  return (
    <span
      className="contents"
      onClick={() => trackStartedPaidSignup(slug)}
    >
      <Button href={href} external variant={variant} size={size} className={className}>
        {children}
      </Button>
    </span>
  );
}
