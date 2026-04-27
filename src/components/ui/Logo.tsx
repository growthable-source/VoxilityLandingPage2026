import { cn } from "@/lib/cn";

const ASPECT = 3177.22 / 956.78;

interface LogoProps {
  className?: string;
  variant?: "color" | "white";
  height?: number;
}

export function Logo({
  className,
  variant = "color",
  height = 28,
}: LogoProps) {
  const src =
    variant === "white" ? "/brand/voxility-white.svg" : "/brand/voxility-color.svg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Voxility"
      width={Math.round(height * ASPECT)}
      height={height}
      className={cn("block select-none", className)}
      style={{ height, width: "auto" }}
      draggable={false}
    />
  );
}
