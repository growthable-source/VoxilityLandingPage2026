import type { ReactNode } from "react";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";

interface LegalShellProps {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
}

export function LegalShell({
  title,
  lastUpdated,
  intro,
  children,
}: LegalShellProps) {
  return (
    <>
      <Nav />
      <main>
        <article className="container mx-auto max-w-[760px] px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-40">
          <header className="mb-10 border-b border-border/40 pb-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary-glow">
              Legal
            </p>
            <h1
              className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
              style={{ letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              {title}
            </h1>
            <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.18em] text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
            {intro && (
              <p className="mt-6 max-w-[60ch] text-[16px] leading-relaxed text-muted-foreground">
                {intro}
              </p>
            )}
          </header>

          <div className="legal-prose">{children}</div>

          <p className="mt-16 border-t border-border/40 pt-6 text-[12px] leading-relaxed text-muted-foreground/80">
            This document is provided as a starting point and reflects
            standard practice. It is not legal advice. Xovera recommends
            review by qualified counsel before relying on it for any specific
            situation.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
