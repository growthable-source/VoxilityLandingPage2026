import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { label: "System", href: "#system" },
  { label: "Xovera AI", href: "#voxai" },
  { label: "Proof", href: "#proof" },
  { label: "Agencies", href: "/agencies" },
];

export function Nav() {
  return (
    <header className="glass-surface fixed inset-x-0 top-0 z-50 border-b border-border/40">
      <div className="container mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Xovera home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-fast hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <a
            href="https://go.xovera.io/"
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-1 rounded-md px-3 py-2 text-sm text-muted-foreground transition-fast hover:text-foreground md:inline-flex"
          >
            Sign in
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
          <Button href="#contact" variant="glass" size="default" className="hidden md:inline-flex">
            Talk to us
          </Button>
          <Button href="#contact" variant="hero" size="default">
            Book a call
          </Button>
        </div>
      </div>
    </header>
  );
}
