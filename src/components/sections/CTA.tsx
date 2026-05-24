import { ContactForm } from "./ContactForm";

export function CTA() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-30 mesh-bg" aria-hidden />
      <div className="absolute inset-0 -z-20 grid-overlay opacity-50" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-[500px] w-[500px] animate-orb-float rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, var(--orb-glow-primary), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-1/4 -z-10 h-[420px] w-[420px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, var(--orb-glow-amber), transparent 70%)",
          filter: "blur(80px)",
          animation: "orb-float 18s ease-in-out infinite reverse",
        }}
      />
      <div className="noise absolute inset-0 -z-0" aria-hidden />

      <div className="container relative mx-auto max-w-[1320px] px-5 md:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-glow">
              30 minutes · Conversational · No slide deck required
            </span>
          </div>

          <h2
            className="text-balance font-semibold tracking-tight text-foreground"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4.5rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
            }}
          >
            We&rsquo;d be happy to walk you through
            <br />
            <span className="text-gradient">what&rsquo;s costing you most.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[58ch] text-balance text-lg leading-relaxed text-muted-foreground">
            Share a few details below and someone senior on our team will
            reach out within 24 hours to set up a 30-minute call.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[560px]">
          <ContactForm />
        </div>

        <p className="mx-auto mt-8 max-w-[60ch] text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Senior on the call · No SDR · Quote within 48 hours
        </p>
      </div>
    </section>
  );
}
