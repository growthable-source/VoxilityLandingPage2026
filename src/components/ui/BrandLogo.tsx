import {
  siHubspot,
  siMeta,
  siGoogle,
  siGoogleads,
} from "simple-icons";
import { cn } from "@/lib/cn";

type Brand =
  | "hubspot"
  | "meta"
  | "google"
  | "googleads"
  | "gohighlevel";

const SI: Record<
  Exclude<Brand, "gohighlevel">,
  { title: string; path: string; hex: string }
> = {
  hubspot: { title: siHubspot.title, path: siHubspot.path, hex: siHubspot.hex },
  meta: { title: siMeta.title, path: siMeta.path, hex: siMeta.hex },
  google: { title: siGoogle.title, path: siGoogle.path, hex: siGoogle.hex },
  googleads: {
    title: siGoogleads.title,
    path: siGoogleads.path,
    hex: siGoogleads.hex,
  },
};

interface BrandLogoProps {
  brand: Brand;
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

export function BrandLogo({
  brand,
  className,
  showWordmark = true,
  size = 18,
}: BrandLogoProps) {
  if (brand === "gohighlevel") {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <HighLevelMark size={size} />
        {showWordmark && (
          <span className="font-semibold tracking-tight">HighLevel</span>
        )}
      </span>
    );
  }

  const data = SI[brand];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        role="img"
        aria-label={data.title}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={`#${data.hex}`}
        className="shrink-0"
      >
        <title>{data.title}</title>
        <path d={data.path} />
      </svg>
      {showWordmark && (
        <span className="font-semibold tracking-tight">{wordmarkOf(brand)}</span>
      )}
    </span>
  );
}

function wordmarkOf(brand: Brand): string {
  switch (brand) {
    case "hubspot":
      return "HubSpot";
    case "meta":
      return "Meta";
    case "google":
      return "Google";
    case "googleads":
      return "Google Ads";
    case "gohighlevel":
      return "HighLevel";
  }
}

/**
 * HighLevel mark — three upward arrows in HighLevel brand colors
 * (yellow, blue, green), designed to read at 18–24px alongside other partner marks.
 */
function HighLevelMark({ size }: { size: number }) {
  return (
    <svg
      role="img"
      aria-label="HighLevel"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="shrink-0"
    >
      <title>HighLevel</title>
      {/* Yellow arrow — tallest, leftmost */}
      <path
        d="M2.5 22 L 2.5 7 L 1 7 L 4 2 L 7 7 L 5.5 7 L 5.5 22 Z"
        fill="#FBB614"
      />
      {/* Blue arrow — shortest, middle */}
      <path
        d="M10.5 22 L 10.5 14 L 9 14 L 12 9 L 15 14 L 13.5 14 L 13.5 22 Z"
        fill="#1E9CE8"
      />
      {/* Green arrow — medium, rightmost */}
      <path
        d="M18.5 22 L 18.5 10 L 17 10 L 20 5 L 23 10 L 21.5 10 L 21.5 22 Z"
        fill="#3DB54A"
      />
    </svg>
  );
}
