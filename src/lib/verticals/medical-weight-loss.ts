import type { Vertical } from "@/lib/verticals/types";
import { DEFAULT_MISSED_CALL_RATE, DEFAULT_SPEED_LOSS } from "@/lib/revenueMath";

// Medical weight-loss clinics (GLP-1 / semaglutide / tirzepatide programs).
// Demand is surging, so inbound call and web-inquiry volume outruns the front
// desk. Programs are cash-pay ($200–500/mo, 6–12 months), so a single patient
// is worth low thousands in LTV — and prospects price-shop several clinics at
// once, so speed to respond decides who gets the patient.
export const medicalWeightLoss: Vertical = {
  slug: "medical-weight-loss",
  name: "Medical Weight-Loss",
  noun: "weight-loss clinic",
  orgLabel: "Clinic name",
  signupUrl: "https://app.xovera.io/?ref=ai-for-medical-weight-loss",
  demoSource: "ai-for-medical-weight-loss",

  seo: {
    title: "AI Receptionist for Medical Weight-Loss Clinics — Never Miss a Patient | Xovera",
    description:
      "Xovera answers every call, quotes your GLP-1 program, and books the consult 24/7 — even after close and all weekend. Talk to it free, no signup. Works with Practice Better, Healthie, Jane, IntakeQ and Zenoti.",
    ogAlt: "Xovera AI receptionist for medical weight-loss clinics.",
    keywords: [
      "ai receptionist for weight loss clinic",
      "medical weight loss answering service",
      "glp-1 clinic front desk automation",
      "semaglutide clinic missed calls",
      "ai booking weight loss clinic",
      "after hours answering service weight loss clinic",
      "virtual receptionist medical weight loss",
    ],
  },

  hero: {
    badge: "For medical weight-loss & GLP-1 clinics · US",
    h1: { before: "Never miss another ", highlight: "GLP-1 patient", after: "." },
    subhead:
      "Xovera answers every call, quotes your program, and books the consult 24/7 — even after close and all weekend. Talk to it right now, free — no signup, no card.",
    metrics: [
      { v: "24/7", l: "every inquiry answered — nights, weekends, lunch" },
      { v: "Seconds", l: "to book a consult, not hours to call back" },
      { v: "$2,000–6,000", l: "lifetime value of a patient who stays on program" },
    ],
    demoPrompts: [
      "Ask what the program costs",
      "Try to book a consult this week",
      "Ask if you offer semaglutide",
    ],
  },

  integrations: {
    heading: {
      before: "We don't replace your practice software. ",
      highlight: "We answer the phone it can't.",
    },
    lede:
      "Keep Practice Better, Healthie, Jane — whatever runs your program. Xovera layers on top to catch every call, form, and DM the front desk misses: answered, booked, and written back to your system. Built on GoHighLevel so you get enterprise automation without running it yourself.",
    tools: [
      "Practice Better",
      "Healthie",
      "Jane",
      "IntakeQ",
      "Zenoti",
      "Mangomint",
      "RepeatMD",
      "Weave",
      "Podium",
      "NexHealth",
      "GoHighLevel",
      "Mindbody",
    ],
  },

  problem: {
    eyebrow: "The math of a missed call",
    heading: {
      before: "Every inquiry that rings out is a patient who ",
      highlight: "signed up somewhere else",
      after: ".",
    },
    lede:
      "GLP-1 demand is climbing faster than any front desk can keep up with — and prospects aren't calling just you. They're price-shopping three or four clinics at once, and they start their program with whoever answers first.",
    stats: [
      { v: "Up to 35%", l: "of calls to clinics go unanswered" },
      { v: "$2,000–6,000", l: "lifetime value of a weight-loss patient" },
      { v: "78%", l: "of callers sign up with whoever responds first" },
    ],
  },

  methods: {
    eyebrow: "Three ways it fills your program",
    heading: {
      before: "Every inquiry worked, ",
      highlight: "whichever way it comes in",
      after: ".",
    },
    items: [
      {
        icon: "Zap",
        title: "Reply in seconds, not hours",
        body:
          "The moment someone calls and you miss it, fills out a form, or DMs your page, Xovera answers and books them while they're still deciding. These prospects are calling several clinics — the one that answers first usually wins the patient.",
      },
      {
        icon: "PhoneCall",
        title: "An AI receptionist that never misses a call",
        body:
          "A warm, natural voice answers every call 24/7 — quotes your monthly program pricing from your own menu, checks real openings, and books the consult straight onto your calendar. Even at 9pm on a Sunday, no call goes to voicemail.",
      },
      {
        icon: "CalendarCheck",
        title: "Books the consult — and takes the deposit",
        body:
          "It confirms the program, books the consult onto your calendar, collects a deposit if you require one, and texts a confirmation. Clinical questions about dosing or eligibility route straight to your team — Xovera never gives medical advice.",
      },
    ],
  },

  chatDemo: {
    context: "New patient · Google · 9:12pm",
    lines: [
      { from: "lead", text: "Hi, how much is your weight-loss program?" },
      {
        from: "xovera",
        text: "Happy to help! Our program runs $300 a month, which includes your provider visits and check-ins. Would you like to book a consult to get started?",
      },
      { from: "lead", text: "Yeah. Is that with semaglutide or tirzepatide?" },
      {
        from: "xovera",
        text: "Great question — your provider decides the right option and dosing for you at the consult. I can get you in Thursday at 2pm or Friday at 10am. Which works?",
      },
      { from: "lead", text: "Friday at 10 works" },
      {
        from: "xovera",
        text: "You're booked for Friday at 10am. I'll text you a confirmation now — see you then!",
      },
    ],
    outcome: "Consult booked · clinical question routed to staff · 9:13pm",
  },
  demo: {
    eyebrow: "While the front desk is closed",
    heading: {
      before: "A missed call at 9pm. ",
      highlight: "A booked consult by 9:01.",
    },
    lede:
      "While your team is with patients or gone for the night, Xovera answers in seconds, quotes your monthly price, and books the consult straight onto your calendar — then logs it in your system. No prospect left on read.",
    metrics: [
      { v: "<60s", l: "average reply time" },
      { v: "24/7", l: "even after close" },
      { v: "0", l: "calls to voicemail" },
    ],
  },

  voice: {
    eyebrow: "Voice AI receptionist",
    heading: { before: "Never miss another call — ", highlight: "even at 9pm on a Sunday." },
    lede:
      "A natural-sounding AI answers the second the phone rings — day, night, weekends. It knows your program, pricing, and openings, books the consult, and routes anything clinical to your team. No voicemail, no missed patients.",
    bullets: [
      "Answers 24/7 in a warm, natural voice",
      "Quotes your monthly program price and real-time openings",
      "Books consults and takes deposits, then texts a confirmation",
    ],
  },

  setup: {
    eyebrow: "Live in an afternoon",
    heading: { before: "No new software ", highlight: "for your team to learn." },
    lede:
      "It works the calls and messages you already get — your front desk keeps doing what they do with patients in the room.",
    steps: [
      {
        n: "01",
        t: "Connect your tools",
        d: "Link your practice software, calendar, and inboxes in a few minutes. No developer required.",
      },
      {
        n: "02",
        t: "Xovera answers everything",
        d: "Missed calls, web forms, and DMs all get an instant, on-brand reply by voice and text — with your program pricing and openings.",
      },
      {
        n: "03",
        t: "Consults get booked",
        d: "It qualifies, quotes your price, books onto your calendar, and takes deposits — then writes it back to your system.",
      },
      {
        n: "04",
        t: "You see patients, not missed calls",
        d: "Every call and message is tracked end-to-end, so you know exactly what your ads and front desk are really producing.",
      },
    ],
  },

  contact: {
    eyebrow: "Book a demo",
    heading: { before: "See it answer a real call ", highlight: "for your clinic." },
    lede:
      "In 20 minutes we'll show Xovera answering a real call for your clinic — quoting your program, checking openings, and booking a consult live. Grab a time, it's on us.",
    bullets: [
      "Free while in beta — no card required",
      "Live in an afternoon, works with your practice software",
      "HIPAA-ready with a signed BAA",
    ],
  },

  faqs: [
    {
      q: "Is my patients' data safe? Are you HIPAA-compliant?",
      a: "Yes. Weight-loss clinics handle protected health information, so we treat it that way — Xovera operates under a signed Business Associate Agreement (BAA), encrypts data in transit and at rest, and only captures what's needed to book and confirm a consult. We're happy to walk your team through exactly how it's handled on the demo.",
    },
    {
      q: "Does it work with my practice software?",
      a: "Yes — and it doesn't replace it. Keep Practice Better, Healthie, Jane, IntakeQ, Zenoti or whatever runs your program; Xovera layers on top to answer the calls and messages your front desk misses. It's built on GoHighLevel (our preferred platform) and connects widely. Don't see your system? It's quick for us to add.",
    },
    {
      q: "What does it actually say to prospective patients?",
      a: "You set the program details, pricing, and guardrails. It answers questions about your program and monthly price from your own information and books the consult — but it never gives medical or dosing advice. Clinical questions about eligibility, medications, or dosing are routed straight to your team.",
    },
    {
      q: "Can it book consults onto my calendar and take a deposit?",
      a: "Yes — it checks real-time availability, books the consult during the conversation, and can collect a deposit if you require one, with automatic confirmations and reminders to cut no-shows.",
    },
    {
      q: "Does the voice sound like a robot?",
      a: "No. It uses natural, human-sounding voices — most callers don't realize they're talking to an AI until you tell them. The fastest way to judge it is to talk to the demo at the top of this page.",
    },
    {
      q: "Will it replace my front desk?",
      a: "No — it handles the calls and messages your team can't get to: lunch rushes, evenings, weekends, and everything after close. Your front desk stays focused on the patients in the room.",
    },
  ],

  calc: {
    unitSingular: "patient",
    unitPlural: "patients",
    closeRate: 0.35,
    callShare: 0.6,
    lostForGood: 0.75,
    missedCallRate: DEFAULT_MISSED_CALL_RATE,
    speedLoss: DEFAULT_SPEED_LOSS,
    inputs: {
      monthlyInquiries: {
        min: 20,
        max: 600,
        step: 10,
        default: 150,
        label: "Program inquiries per month",
        hint: "Calls, form fills, and DMs from prospective patients.",
      },
      avgValue: {
        min: 100,
        max: 1000,
        step: 25,
        default: 300,
        label: "Average monthly program price",
        hint: "What a patient pays per month on the program.",
      },
      repeatFactor: {
        min: 1,
        max: 12,
        step: 1,
        default: 6,
        label: "Months a patient stays on program",
        unit: "months",
      },
    },
    audience: "For medical weight-loss clinics",
  },
  calcCopy: {
    h1: { before: "See what ", highlight: "missed calls", after: " cost your clinic." },
    subhead:
      "Up to 35% of calls to clinics go unanswered, and prospects sign up with whoever responds first. Sixty seconds, a few questions, and you'll have a working estimate — in patients and dollars.",
    crossLink:
      "Curious what missed calls and slow replies cost your clinic today? Run the 60-second calculator.",
  },
};
