import Image from "next/image";
import { Section, SectionEyebrow, SectionHeading, SectionLede } from "@/components/ui/Section";
import {
  PhoneCall,
  PhoneMissed,
  MessageSquareText,
  RefreshCcw,
  Workflow,
  CalendarCheck,
} from "lucide-react";

const capabilities = [
  {
    icon: PhoneCall,
    title: "Answers inbound calls in under 3 rings",
    body: "Qualifies the caller, checks availability, and books live. Transfers to a person when the conversation calls for it.",
  },
  {
    icon: PhoneMissed,
    title: "Calls back missed numbers in 60 seconds",
    body: "Missed-call rescue runs 24/7. Most businesses don&rsquo;t realize how much this is worth — we measure it for you from week one.",
  },
  {
    icon: MessageSquareText,
    title: "Replies to SMS and web chat instantly",
    body: "Inbound inquiry to first reply: under 60 seconds. Conversational, not scripted — much like a great receptionist on a good day.",
  },
  {
    icon: RefreshCcw,
    title: "Nurtures stale leads, requests reviews, reactivates",
    body: "Outbound flows for every cohort: confirmation, no-show recovery, post-appointment review request, six-month reactivation.",
  },
  {
    icon: Workflow,
    title: "Executes CRM actions, end-to-end",
    body: "Updates contacts, moves opportunities, triggers workflows, tags leads, and schedules tasks for the team — across multiple steps, without anyone needing to click through them.",
  },
  {
    icon: CalendarCheck,
    title: "Books into your real calendar",
    body: "Native integrations with Mindbody, Boulevard, Vagaro, Jane, SimplePractice, Acuity, Cliniko, Fresha, Google Calendar, Outlook, GHL.",
  },
];

export function VoxAI() {
  return (
    <Section id="voxai" className="relative overflow-hidden">
      {/* Mesh + waveform — waveform is a dark-screenshot asset, shown only in dark mode */}
      <div className="absolute inset-0 -z-10 mesh-bg opacity-50 dark:opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 hidden h-[120%] opacity-30 dark:block"
        aria-hidden
      >
        <Image
          src="/images/voxai-waveform.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority={false}
        />
      </div>

      <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionEyebrow>Xovera AI</SectionEyebrow>
          <SectionHeading>
            The receptionist
            <br />
            <span className="text-gradient">that doesn&rsquo;t miss.</span>
          </SectionHeading>
          <SectionLede>
            Xovera AI is our conversational and agentic platform — built
            in-house, GoHighLevel-native, and HubSpot-integrated. It&rsquo;s
            how we turn paid leads into actual booked appointments.
          </SectionLede>
        </div>

        <div className="lg:col-span-5">
          <div className="grid grid-cols-2 gap-3 font-mono text-[12px]">
            <Stat value="00:04s" label="avg first reply" />
            <Stat value="<3" label="rings to answer" />
            <Stat value="94%" label="missed-call save" hot />
            <Stat value="24/7" label="global coverage" />
          </div>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="gradient-border rounded-lg transition-smooth hover:-translate-y-1 hover:shadow-glow-soft animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative h-full rounded-lg bg-card p-7 shadow-card">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </div>
                <h3 className="mb-2 text-[17px] font-semibold tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: c.body }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-12 max-w-[64ch] text-center text-[15px] text-muted-foreground">
        We don&rsquo;t sell AI on its own. We deliver a system that produces
        booked appointments — and Xovera AI is the part of it your front
        desk tends to thank you for.
      </p>
    </Section>
  );
}

function Stat({
  value,
  label,
  hot,
}: {
  value: string;
  label: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-md border border-border/50 bg-card/80 p-4 backdrop-blur-md">
      <div
        className={`text-2xl font-semibold tracking-tight md:text-[28px] ${hot ? "heat-text" : "text-foreground"}`}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
