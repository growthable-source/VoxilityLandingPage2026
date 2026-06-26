import { cn } from "@/lib/cn";

const ASPECT = 3177.22 / 956.78;

interface LogoProps {
  className?: string;
  /**
   * `color` — the fiery gradient mark (default; reads on both light + dark).
   * `mono` — white on dark, near-black on light (auto-swapped per theme).
   */
  variant?: "color" | "mono" | "white";
  height?: number;
}

export function Logo({
  className,
  variant = "color",
  height = 28,
}: LogoProps) {
  const width = Math.round(height * ASPECT);

  if (variant === "color") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/brand/xovera-color.svg"
        alt="Xovera"
        width={width}
        height={height}
        className={cn("block select-none", className)}
        style={{ height, width: "auto" }}
        draggable={false}
      />
    );
  }

  // mono / white — swap based on the active theme via Tailwind's dark: variant.
  // `xovera-white.svg` for dark theme, `xovera-black.svg` for light theme.
  return (
    <span className={cn("block select-none", className)} style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/xovera-white.svg"
        alt="Xovera"
        width={width}
        height={height}
        className="hidden h-full w-auto dark:block"
        style={{ height, width: "auto" }}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/xovera-black.svg"
        alt="Xovera"
        width={width}
        height={height}
        className="block h-full w-auto dark:hidden"
        style={{ height, width: "auto" }}
        draggable={false}
      />
    </span>
  );
}
