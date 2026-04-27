import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/cn";

interface Partner {
  brand: "hubspot" | "meta" | "google" | "googleads" | "gohighlevel";
  role: string;
}

const partners: Partner[] = [
  { brand: "gohighlevel", role: "Whitelabel Reseller" },
  { brand: "hubspot", role: "Solutions Partner" },
  { brand: "meta", role: "Business Partner" },
  { brand: "googleads", role: "Google Partner" },
];

export function PartnerStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-7 gap-y-4 lg:gap-x-9",
        className,
      )}
      aria-label="Voxility partner programs"
    >
      {partners.map((p) => (
        <li
          key={p.brand}
          className="flex items-baseline gap-2.5 text-foreground/85 transition-fast hover:text-foreground"
        >
          <BrandLogo
            brand={p.brand}
            size={18}
            className="text-foreground/90"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {p.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
