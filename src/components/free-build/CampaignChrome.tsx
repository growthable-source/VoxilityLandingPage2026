// Minimal nav and footer for the campaign pages.
//
// Deliberately not the site's own Nav: a single-purpose landing page paid for
// by the click should not offer six ways to wander off it. The only navigation
// here is the CTA and the legal links we're obliged to carry.

import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function CampaignNav({
  note,
  ctaLabel = "Claim my free build",
  ctaHref = "#claim",
}: {
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" aria-label="Xovera home" className="shrink-0">
          <Logo height={26} />
        </Link>
        <div className="flex items-center gap-4">
          {note && (
            <span className="hidden text-[13px] text-muted-foreground lg:block">
              {note}
            </span>
          )}
          <a
            href={ctaHref}
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-primary px-4 text-[14px] font-medium text-primary-foreground shadow-primary transition-smooth hover:scale-[1.02] hover:shadow-glow"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}

export function CampaignFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 text-[13px] text-muted-foreground md:px-8">
        <Logo height={20} />
        <p>&copy; {new Date().getFullYear()} Xovera. Booked appointments, end to end.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="transition-fast hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition-fast hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

/** Bottom-docked CTA on mobile, where most of this traffic lands. */
export function StickyMobileCta({
  label,
  href = "#claim",
}: {
  label: string;
  href?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden">
      <a
        href={href}
        className="flex h-12 w-full items-center justify-center rounded-md bg-gradient-primary text-[16px] font-medium text-primary-foreground shadow-primary"
      >
        {label}
      </a>
    </div>
  );
}

/** Shared page shell: chrome, the mobile CTA, and the padding it needs. */
export function CampaignShell({
  children,
  navNote,
  navCtaLabel,
  stickyCtaLabel,
  className,
}: {
  children: ReactNode;
  navNote?: string;
  navCtaLabel?: string;
  stickyCtaLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen bg-background", stickyCtaLabel && "pb-20 md:pb-0", className)}>
      <CampaignNav note={navNote} ctaLabel={navCtaLabel} />
      <main>{children}</main>
      <CampaignFooter />
      {stickyCtaLabel && <StickyMobileCta label={stickyCtaLabel} />}
    </div>
  );
}
