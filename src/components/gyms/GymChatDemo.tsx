import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const messages = [
  { from: "lead", text: "Hi, saw your ad — how much is membership?" },
  {
    from: "xovera",
    text: "Hey! Thanks for reaching out. Plans start at $39/mo. Want to swing by for a free day pass?",
  },
  { from: "lead", text: "Yeah, tomorrow evening could work" },
  {
    from: "xovera",
    text: "Perfect — I have Thursday 6:00pm open. Want me to lock it in?",
  },
  { from: "lead", text: "Yes please" },
  {
    from: "xovera",
    text: "Booked! You'll get a reminder text. See you Thursday.",
  },
] as const;

export function GymChatDemo() {
  return (
    <div className="gradient-border rounded-lg">
      <div className="rounded-lg bg-card p-5 shadow-card md:p-6">
        {/* Window header */}
        <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-orb-pulse rounded-full bg-success/80" />
              <span className="absolute inset-0 rounded-full bg-success" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Xovera · live
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            New lead · Meta ad · 9:00pm
          </span>
        </div>

        {/* Conversation */}
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex animate-fade-in-up",
                m.from === "xovera" ? "justify-end" : "justify-start",
              )}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div
                className={cn(
                  "max-w-[82%] rounded-lg px-4 py-2.5 text-[14px] leading-relaxed",
                  m.from === "xovera"
                    ? "rounded-br-sm bg-primary/15 text-foreground ring-1 ring-primary/25"
                    : "rounded-bl-sm bg-muted text-foreground/90",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Outcome */}
        <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/15 ring-1 ring-success/30">
            <Check className="h-3 w-3 text-success" strokeWidth={3} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Tour booked · synced to CRM · 9:01pm
          </span>
        </div>
      </div>
    </div>
  );
}
