"use client";

/**
 * The animated incoming-call phone mockup — ported from the VX1
 * /try/<slug> prospect demo and restyled to this site's dark tokens.
 * Two internal layers: INCOMING CALL (ringing, decline/answer) and
 * ACTIVE CALL (connecting/live, single hang-up button). Which layer
 * shows is driven entirely by `onCall` (derived from useVoiceCall's
 * state upstream) — this component has no call logic of its own, just
 * presentation + animation. Ripple rings use Tailwind's `animate-ping`;
 * the wiggle + ringing-dots keyframes live in globals.css
 * (`.phone-wiggle` / `.ring-dot`).
 */

function DeclineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="white" strokeWidth={2.25}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function AnswerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-6 w-6">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

function ActiveCallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9 9v3a3 3 0 004.83 2.38M15 9.34V6a3 3 0 00-5.94-.6M5 10v1a7 7 0 0010.61 5.99M19 11a7 7 0 01-1.02 3.65M12 18.5V21" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.05-3.15A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function RemindIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function RingDots() {
  return (
    <span className="ml-1 inline-flex gap-0.5 align-middle">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="ring-dot inline-block h-1 w-1 rounded-full"
          style={{ background: "currentColor", animationDelay: `${i * 200}ms` }}
        />
      ))}
    </span>
  );
}

function formatTime(secs: number | null): string {
  if (secs === null) return "0:00";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export interface PhoneDemoProps {
  /** Caller name on the phone screen, e.g. "Xovera Receptionist". */
  callerName: string;
  /** Line under the caller name, e.g. "AI receptionist · Med spa demo". */
  callerDetail: string;
  /** Presentation state — false shows the ringing incoming-call screen,
   *  true shows the active-call screen. */
  onCall: boolean;
  connecting: boolean;
  secondsLeft: number | null;
  /** Small status line above the buttons while not on a call. */
  statusLabel: string;
  answerDisabled: boolean;
  onAnswer: () => void;
  onHangup: () => void;
}

export function PhoneDemo({
  callerName,
  callerDetail,
  onCall,
  connecting,
  secondsLeft,
  statusLabel,
  answerDisabled,
  onAnswer,
  onHangup,
}: PhoneDemoProps) {
  const initial = callerName.trim().charAt(0).toUpperCase() || "X";

  return (
    <div className="relative shrink-0">
      {/* Warm glow under the phone */}
      <div
        className="pointer-events-none absolute -bottom-9 left-1/2 h-[70px] w-[210px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ background: "hsl(var(--primary) / 0.22)" }}
      />
      <div
        className="relative h-[520px] w-[250px] overflow-hidden rounded-[42px] border border-border/70 sm:h-[560px] sm:w-[270px] sm:rounded-[46px]"
        style={{
          background: "hsl(var(--card))",
          boxShadow:
            "0 0 0 8px hsl(var(--muted) / 0.9), 0 0 0 9px hsl(var(--border) / 0.8), 0 40px 100px -20px rgba(0,0,0,0.6), 0 0 60px hsl(var(--primary) / 0.12), inset 0 0 0 1px hsl(var(--border) / 0.6)",
        }}
      >
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(175deg, hsl(var(--card)) 0%, hsl(var(--muted) / 0.7) 55%, hsl(var(--card)) 100%)",
          }}
        />

        {/* Dynamic-island style status pill */}
        <div className="absolute left-1/2 top-3 z-10 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-black sm:top-3.5 sm:h-[32px] sm:w-[112px]">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-white/10 bg-white/5" />
          <span className="h-1.5 w-1.5 rounded-full bg-success/60 ring-1 ring-success/80" />
        </div>

        {!onCall ? (
          // ═══ INCOMING CALL ═══
          <div className="relative flex h-full flex-col items-center px-5 pb-8 pt-14 sm:px-6 sm:pb-9 sm:pt-16">
            <p className="w-full text-[11px] tracking-[0.04em] text-muted-foreground sm:text-[12px]">
              9:41
            </p>
            <p className="mt-3 w-full font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground sm:text-[11px]">
              Incoming Call
            </p>
            <div className="relative mt-3 flex h-[52px] w-[76px] items-center justify-center rounded-[32px] bg-gradient-primary sm:h-[58px] sm:w-[86px] sm:rounded-[36px]">
              <span
                className="pointer-events-none absolute inset-0 rounded-[32px] sm:rounded-[36px]"
                style={{
                  boxShadow:
                    "0 0 0 10px hsl(var(--primary) / 0.08), 0 0 0 20px hsl(var(--primary) / 0.04)",
                }}
              />
              <span className="text-xl font-black text-primary-foreground sm:text-2xl">
                {initial}
              </span>
            </div>
            <h3 className="mt-3 text-center text-xl font-bold tracking-tight text-foreground sm:text-[22px]">
              {callerName}
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">{callerDetail}</p>
            <div className="flex-1" />
            <p className="mb-5 text-[10px] tracking-[0.06em] text-muted-foreground sm:mb-6 sm:text-[11px]">
              {statusLabel}
              <RingDots />
            </p>
            <div className="mb-6 flex gap-3 sm:gap-4">
              {[
                { label: "Silence", Icon: MuteIcon },
                { label: "Message", Icon: MessageIcon },
                { label: "Remind", Icon: RemindIcon },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-2xl border border-border/60 bg-muted/50 text-muted-foreground sm:h-12 sm:w-12"
                >
                  <Icon />
                  <span className="text-[8px] sm:text-[9px]">{label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-10 sm:gap-12">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  aria-hidden
                  className="flex h-[58px] w-[58px] select-none items-center justify-center rounded-full bg-[#e31c1c] sm:h-[64px] sm:w-[64px]"
                  style={{ boxShadow: "0 6px 10px rgba(227,28,28,0.35)" }}
                >
                  <DeclineIcon />
                </div>
                <span className="text-[9px] tracking-wide text-muted-foreground sm:text-[10px]">
                  Decline
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative">
                  {!answerDisabled && (
                    <>
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#188b42] opacity-30" />
                      <span
                        className="absolute inset-0 animate-ping rounded-full bg-[#188b42] opacity-20"
                        style={{ animationDelay: "450ms" }}
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={onAnswer}
                    disabled={answerDisabled}
                    aria-label="Answer the call"
                    className={`relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#188b42] transition disabled:cursor-not-allowed disabled:opacity-50 sm:h-[64px] sm:w-[64px] ${answerDisabled ? "" : "phone-wiggle hover:scale-105"}`}
                    style={{ boxShadow: "0 6px 10px rgba(24,139,66,0.35)" }}
                  >
                    <AnswerIcon />
                  </button>
                </div>
                <span className="text-[9px] tracking-wide text-muted-foreground sm:text-[10px]">
                  Answer
                </span>
              </div>
            </div>
            <p className="mt-3 text-center text-[10px] text-muted-foreground/70 sm:mt-4 sm:text-[11px]">
              Tap Answer · No download needed
            </p>
          </div>
        ) : (
          // ═══ ACTIVE CALL ═══
          <div className="relative flex h-full flex-col items-center px-5 pb-8 pt-14 sm:pt-16">
            <p className="font-mono text-xs font-bold tracking-[0.1em] text-success">
              {connecting ? "···" : formatTime(secondsLeft)}
            </p>
            <div className="mt-4 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gradient-primary sm:mt-5 sm:h-[72px] sm:w-[72px]">
              <ActiveCallIcon />
            </div>
            <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:mt-4 sm:text-xl">
              {callerName}
            </h3>
            <p className="mt-1.5 text-[11px] font-semibold text-primary-glow sm:text-xs">
              {connecting ? "Connecting…" : "AI receptionist is speaking…"}
            </p>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onHangup}
              aria-label="End call"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e31c1c] transition hover:scale-105"
              style={{ boxShadow: "0 6px 10px rgba(227,28,28,0.35)" }}
            >
              <DeclineIcon />
            </button>
            <p className="mt-2 text-[10px] text-muted-foreground/80 sm:text-[11px]">Tap to end</p>
          </div>
        )}
      </div>
    </div>
  );
}
