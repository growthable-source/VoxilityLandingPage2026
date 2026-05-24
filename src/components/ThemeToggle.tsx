"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";
import { cn } from "@/lib/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-fast hover:border-primary/40 hover:text-foreground",
        className,
      )}
    >
      <span className="sr-only">{label}</span>
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Moon className="h-4 w-4" strokeWidth={2} />
        )
      ) : (
        <Sun className="h-4 w-4 opacity-0" strokeWidth={2} />
      )}
    </button>
  );
}
