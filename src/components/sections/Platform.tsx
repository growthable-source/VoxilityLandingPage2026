import { ArrowUpRight } from "lucide-react";
import { Section, SectionEyebrow } from "@/components/ui/Section";

const products = [
  {
    name: "Xovera Ads",
    domain: "ads.xovera.io",
    href: "https://ads.xovera.io/",
    body: "Build, launch, and manage Meta and Google ad campaigns with an AI launcher.",
  },
  {
    name: "Xovera AI",
    domain: "app.xovera.io",
    href: "https://app.xovera.io/",
    body: "Conversational, agentic AI that answers, qualifies, books, and writes back to your CRM.",
  },
  {
    name: "Xovera Go",
    domain: "go.xovera.io",
    href: "https://go.xovera.io/",
    body: "A whitelabel marketing and sales platform on GoHighLevel, configured and run by us.",
  },
];

const platformJsonLd = {
  "@context": "https://schema.org",
  "@graph": products.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.name,
    url: p.href,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: p.body,
    publisher: { "@type": "Organization", name: "Xovera" },
    offers: { "@type": "Offer", availability: "https://schema.org/InStock" },
  })),
};

export function Platform() {
  return (
    <Section id="platform" bare className="py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(platformJsonLd) }}
      />
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <SectionEyebrow>Platform</SectionEyebrow>
          <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-[32px]">
            Three products.{" "}
            <span className="text-gradient">One accountable system.</span>
          </h2>
        </div>
        <p className="hidden max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground md:block">
          Available bundled or stand-alone — every client gets access to the
          layer they need.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {products.map((p, i) => (
          <li
            key={p.name}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group block h-full"
            >
              <div className="gradient-border h-full rounded-lg transition-smooth group-hover:-translate-y-0.5 group-hover:shadow-glow-soft">
                <div className="flex h-full flex-col rounded-lg bg-card p-6 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
                        {p.name}
                      </h3>
                      <div className="mt-1 font-mono text-[11px] tracking-wide text-primary-glow">
                        {p.domain}
                      </div>
                    </div>
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-smooth group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-primary/60 group-hover:text-primary">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                  </div>

                  <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
