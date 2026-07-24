import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const cols = [
  {
    title: "Platform",
    links: [
      { l: "Xovera Ads", h: "https://ads.xovera.io/", external: true },
      { l: "Xovera AI", h: "https://app.xovera.io/", external: true },
      { l: "Xovera Go", h: "https://go.xovera.io/", external: true },
    ],
  },
  {
    title: "System",
    links: [
      { l: "Meta ads", h: "/#system" },
      { l: "Landing pages", h: "/#system" },
      { l: "Xovera AI", h: "/#voxai" },
    ],
  },
  {
    title: "Industries",
    links: [
      { l: "AI for gyms", h: "/ai-for-gyms" },
      { l: "AI for med spas", h: "/ai-for-med-spas" },
      { l: "AI for dental", h: "/ai-for-dental" },
      { l: "AI for weight loss", h: "/ai-for-medical-weight-loss" },
      { l: "AI for home services", h: "/ai-for-home-services" },
      { l: "AI for chiropractic", h: "/ai-for-chiropractic" },
    ],
  },
  {
    title: "Calculators",
    links: [
      { l: "Med spas", h: "/ai-for-med-spas/calculator" },
      { l: "Dental", h: "/ai-for-dental/calculator" },
      { l: "Weight loss", h: "/ai-for-medical-weight-loss/calculator" },
      { l: "Home services", h: "/ai-for-home-services/calculator" },
      { l: "Chiropractic", h: "/ai-for-chiropractic/calculator" },
      { l: "Gyms", h: "/gym-calculator" },
    ],
  },
  {
    title: "Audience",
    links: [
      { l: "Service businesses", h: "/" },
      { l: "Marketing agencies", h: "/agencies" },
      { l: "Onboarding", h: "/#onboarding" },
      { l: "Contact", h: "/#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { l: "Privacy", h: "/privacy" },
      { l: "Terms", h: "/terms" },
      { l: "Acceptable use", h: "/acceptable-use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="container mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="mb-5" />
            <p className="max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">
              Revenue architecture for appointment-driven service businesses
              worldwide. Meta ads, landing pages, and Xovera AI on one
              accountable system.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-4 text-[13px] sm:max-w-md">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Coverage
                </div>
                <div className="mt-1.5 text-foreground/85">
                  24/7 · global
                  <br />
                  30+ languages
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Built on
                </div>
                <div className="mt-1.5 font-mono text-foreground/85">
                  GHL · HubSpot · Meta
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-6">
            {cols.map((col) => (
              <div key={col.title}>
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {col.title}
                </div>
                <ul className="space-y-2.5">
                  {col.links.map((link) => {
                    const isExternal = "external" in link && link.external;
                    const className =
                      "text-[14px] text-foreground/80 transition-fast hover:text-primary";
                    return (
                      <li key={link.l}>
                        {isExternal ? (
                          <a
                            href={link.h}
                            target="_blank"
                            rel="noreferrer noopener"
                            className={className}
                          >
                            {link.l}
                          </a>
                        ) : (
                          <Link href={link.h} className={className}>
                            {link.l}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © {new Date().getFullYear()} Xovera · One accountable system, end-to-end
          </p>

          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-orb-pulse rounded-full bg-success/80" />
                <span className="absolute inset-0 rounded-full bg-success" />
              </span>
              All systems operational
            </span>
            <span>v.2026.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
