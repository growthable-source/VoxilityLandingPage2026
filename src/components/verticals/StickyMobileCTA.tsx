"use client";

import { Mic } from "lucide-react";

/**
 * Persistent bottom CTA bar on mobile (report: +~17% mobile conversion). Scrolls
 * the visitor to the ungated voice demo in the hero. Hidden on md+.
 */
export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/90 p-3 backdrop-blur-md md:hidden">
      <a
        href="#demo"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gradient-primary text-[15px] font-semibold text-primary-foreground shadow-primary"
      >
        <Mic className="h-4 w-4" strokeWidth={2.25} />
        Talk to the receptionist — free
      </a>
    </div>
  );
}
