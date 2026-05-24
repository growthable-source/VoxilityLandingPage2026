import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "hero" | "premium" | "glass" | "accent" | "ghost";
type Size = "default" | "lg" | "xl";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight " +
  "transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 " +
  "disabled:pointer-events-none whitespace-nowrap select-none";

const variants: Record<Variant, string> = {
  hero:
    "bg-gradient-primary text-primary-foreground shadow-primary " +
    "hover:scale-[1.02] hover:shadow-glow",
  premium:
    "bg-gradient-hero text-foreground border-2 border-[hsl(var(--ring-soft))] " +
    "font-semibold hover:border-primary-glow hover:shadow-glow-soft",
  glass:
    "bg-card/60 backdrop-blur-sm border border-border/60 text-foreground " +
    "hover:bg-card hover:border-border",
  accent:
    "bg-accent text-accent-foreground hover:scale-[1.02] hover:shadow-accent",
  ghost: "text-muted-foreground hover:text-foreground",
};

const sizes: Record<Size, string> = {
  default: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
  xl: "h-14 px-10 text-lg",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

interface ButtonAsButton
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface ButtonAsLink extends CommonProps {
  href: string;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "hero", size = "default", className, children, ...props }, ref) => {
    const classes = cn(base, variants[variant], sizes[size], className);

    if ("href" in props && props.href) {
      const { href, external, ...rest } = props;
      if (external) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={classes}
            {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...(props as ButtonAsButton)}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
