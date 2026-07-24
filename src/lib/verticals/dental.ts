import type { Vertical } from "@/lib/verticals/types";
import { DEFAULT_MISSED_CALL_RATE, DEFAULT_SPEED_LOSS } from "@/lib/revenueMath";

// Dental & orthodontics. The economics are stark: practices miss ~30–35% of
// inbound calls, a new patient is worth $1,200–1,500 in year one (often $10k+
// lifetime, ~$5–6k for an ortho case), and 78% of callers book with whoever
// answers first. This config mirrors the med-spa exemplar's structure and tone.
export const dental: Vertical = {
  slug: "dental",
  name: "Dental & Orthodontics",
  noun: "dental practice",
  orgLabel: "Practice name",
  signupUrl: "https://app.xovera.io/?ref=ai-for-dental",
  demoSource: "ai-for-dental",

  seo: {
    title: "AI Receptionist for Dental Practices — Never Miss a New Patient | Xovera",
    description:
      "Xovera answers every call, books the exam, and works your dental front desk 24/7 — even at lunch, after hours, and all weekend. Talk to it free, no signup. Works with Dentrix, Eaglesoft, Open Dental, Curve, Denticon and Dolphin.",
    ogAlt: "Xovera AI receptionist for dental and orthodontic practices.",
    keywords: [
      "ai receptionist for dental practice",
      "dental answering service",
      "virtual receptionist dental office",
      "dental office missed calls",
      "ai booking dental",
      "after hours answering service dental",
      "orthodontic front desk automation",
    ],
  },

  hero: {
    badge: "For dental & ortho practices · US",
    h1: { before: "Never miss another ", highlight: "new-patient call", after: "." },
    subhead:
      "Xovera answers every call, books the exam, and works your front desk 24/7 — even at lunch, after hours, and all weekend. Talk to it right now, free — no signup, no card.",
    metrics: [
      { v: "24/7", l: "every call answered — lunch, nights, weekends" },
      { v: "Seconds", l: "to book an exam, not hours to call back" },
      { v: "$10k+", l: "lifetime value of a patient you keep off voicemail" },
    ],
    demoPrompts: [
      "Ask about a new-patient exam",
      "Try to book a cleaning next week",
      "Ask if you take my insurance",
    ],
  },

  integrations: {
    heading: {
      before: "We don't replace your practice software. ",
      highlight: "We answer the phone it can't.",
    },
    lede:
      "Keep Dentrix, Eaglesoft, Open Dental — whatever runs your schedule. Xovera layers on top to catch every call, form, and message the front desk misses: answered, booked, and written back to your system. Built on GoHighLevel so you get enterprise automation without running it yourself.",
    tools: [
      "Dentrix",
      "Eaglesoft",
      "Open Dental",
      "Curve Dental",
      "Denticon",
      "Dolphin",
      "NexHealth",
      "Weave",
      "RevenueWell",
      "tab32",
      "Podium",
      "Adit",
    ],
  },

  problem: {
    eyebrow: "The math of a missed call",
    heading: {
      before: "Every call that rings out is a new patient who ",
      highlight: "booked somewhere else",
      after: ".",
    },
    lede:
      "Your busiest call windows — lunch and after work — are exactly when the front desk is chairside with a patient. And a new patient shopping for a dentist rarely leaves a voicemail. They call the next office on the list.",
    stats: [
      { v: "30–35%", l: "of calls to dental offices go unanswered" },
      { v: "$1,200+", l: "first-year value of a single new patient" },
      { v: "78%", l: "of callers book with whoever answers first" },
    ],
  },

  methods: {
    eyebrow: "Three ways it fills your schedule",
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
          "The moment someone calls and you miss it, fills out a form, or messages your page, Xovera answers and books them while they're still deciding. New patients book fast — the office that answers first usually wins the exam.",
      },
      {
        icon: "PhoneCall",
        title: "An AI receptionist that never misses a call",
        body:
          "A warm, natural voice answers every call 24/7 — greets new patients, answers common questions from your own information, checks real openings, and books straight onto your schedule. Even at 7pm or on a Saturday, no call goes to voicemail.",
      },
      {
        icon: "CalendarCheck",
        title: "Books the exam — and captures the details",
        body:
          "It confirms the visit, gathers name, contact, and basic insurance details, notes the reason for the visit, and texts a confirmation. Every booking is logged so nothing slips between the phone and the chart.",
      },
    ],
  },

  chatDemo: {
    context: "New patient · Google · 7:12pm",
    lines: [
      { from: "lead", text: "Hi, are you taking new patients? I need a cleaning and checkup." },
      {
        from: "xovera",
        text: "We are! I can get you in for a new-patient exam and cleaning. I have Tuesday at 10am or Thursday at 3pm open — which works better?",
      },
      { from: "lead", text: "Thursday 3 works. Do you take Delta Dental?" },
      {
        from: "xovera",
        text: "Yes, we're in-network with Delta Dental. I'll note your plan and our team will verify the details before your visit. Can I grab your name and number to hold Thursday at 3pm?",
      },
      { from: "lead", text: "Sure — Jordan Reyes, 555-0142" },
      {
        from: "xovera",
        text: "You're booked for Thursday at 3pm, Jordan. You'll get a confirmation text shortly. See you then!",
      },
    ],
    outcome: "New-patient exam booked · insurance noted · 7:13pm",
  },
  demo: {
    eyebrow: "While the front desk is chairside",
    heading: {
      before: "A missed call at 7pm. ",
      highlight: "A booked exam by 7:01.",
    },
    lede:
      "While your team is with patients or gone for the night, Xovera answers in seconds, answers the caller's questions, and books the exam straight onto your schedule — then logs it in your system. No patient left on read.",
    metrics: [
      { v: "<60s", l: "average reply time" },
      { v: "24/7", l: "even after hours" },
      { v: "0", l: "calls to voicemail" },
    ],
  },

  voice: {
    eyebrow: "Voice AI receptionist",
    heading: { before: "Never miss another call — ", highlight: "even at 7pm on a Saturday." },
    lede:
      "A natural-sounding AI answers the second the phone rings — day, night, weekends. It knows your services, hours, and openings, books the exam, and routes anything clinical to your team. No voicemail, no missed patients.",
    bullets: [
      "Answers 24/7 in a warm, natural voice",
      "Knows your services, hours, and real-time openings",
      "Books exams, notes insurance basics, then texts a confirmation",
    ],
  },

  setup: {
    eyebrow: "Live in an afternoon",
    heading: { before: "No new software ", highlight: "for your team to learn." },
    lede:
      "It works the calls and messages you already get — your front desk keeps doing what they do with patients in the chair.",
    steps: [
      {
        n: "01",
        t: "Connect your tools",
        d: "Link your practice management system, calendar, and web forms in a few minutes. No developer required.",
      },
      {
        n: "02",
        t: "Xovera answers everything",
        d: "Missed calls, web forms, and messages all get an instant, on-brand reply by voice and text — with your hours and openings.",
      },
      {
        n: "03",
        t: "Appointments get booked",
        d: "It qualifies, answers questions, books onto your schedule, and captures insurance basics — then writes it back to your system.",
      },
      {
        n: "04",
        t: "You see patients, not missed calls",
        d: "Every call and message is tracked end-to-end, so you know exactly what your marketing and front desk are really producing.",
      },
    ],
  },

  contact: {
    eyebrow: "Book a demo",
    heading: { before: "See it answer a real call ", highlight: "for your practice." },
    lede:
      "In 20 minutes we'll show Xovera answering a real call for your office — greeting a new patient, checking openings, and booking an exam live. Grab a time, it's on us.",
    bullets: [
      "Free while in beta — no card required",
      "Live in an afternoon, works with your practice software",
      "HIPAA-ready with a signed BAA",
    ],
  },

  faqs: [
    {
      q: "Is my patients' data safe? Are you HIPAA-compliant?",
      a: "Yes. Dental practices handle protected health information, so we treat it that way — Xovera operates under a signed Business Associate Agreement (BAA), encrypts data in transit and at rest, and only captures what's needed to book and confirm an appointment. We're happy to walk your team through exactly how it's handled on the demo.",
    },
    {
      q: "Does it work with my practice management software?",
      a: "Yes — and it doesn't replace it. Keep Dentrix, Eaglesoft, Open Dental, Curve, Denticon, Dolphin or whatever runs your schedule; Xovera layers on top to answer the calls and messages your front desk misses. It's built on GoHighLevel (our preferred platform) and connects widely. Don't see your system? It's quick for us to add.",
    },
    {
      q: "What does it actually say to patients?",
      a: "You set the services, hours, and guardrails. It greets new patients, answers common questions from your own information, and books the exam — it never invents pricing or makes clinical promises you didn't approve, and anything clinical routes to your team.",
    },
    {
      q: "Can it book onto my schedule and handle insurance basics?",
      a: "Yes — it checks real-time availability and books the exam during the conversation. For insurance, it can confirm the plans you accept and capture the patient's carrier and member details so your team can verify coverage before the visit.",
    },
    {
      q: "Does the voice sound like a robot?",
      a: "No. It uses natural, human-sounding voices — most callers don't realize they're talking to an AI until you tell them. The fastest way to judge it is to talk to the demo at the top of this page.",
    },
    {
      q: "Will it replace my front desk?",
      a: "No — it handles the calls and messages your team can't get to: lunch rushes, evenings, weekends, and everything after hours. Your front desk stays focused on the patients in the chair.",
    },
  ],

  calc: {
    unitSingular: "patient",
    unitPlural: "patients",
    closeRate: 0.35,
    callShare: 0.65,
    lostForGood: 0.75,
    missedCallRate: DEFAULT_MISSED_CALL_RATE,
    speedLoss: DEFAULT_SPEED_LOSS,
    inputs: {
      monthlyInquiries: {
        min: 30,
        max: 700,
        step: 10,
        default: 200,
        label: "New-patient calls per month",
        hint: "Calls, form fills, and messages from prospective patients.",
      },
      avgValue: {
        min: 300,
        max: 6000,
        step: 50,
        default: 1200,
        label: "Average new patient's first-year value",
        hint: "Exams, cleanings, and the first treatment plan.",
      },
      repeatFactor: {
        min: 1,
        max: 12,
        step: 1,
        default: 3,
        label: "Visits in a patient's first year",
        unit: "visits",
      },
    },
    audience: "For dental & ortho practices",
  },
  calcCopy: {
    h1: { before: "See what ", highlight: "missed calls", after: " cost your practice." },
    subhead:
      "Dental offices miss 30–35% of inbound calls, and new patients book with whoever answers first. Sixty seconds, a few questions, and you'll have a working estimate — in patients and dollars.",
    crossLink:
      "Curious what missed calls and slow replies cost your practice today? Run the 60-second calculator.",
    section: {
      eyebrow: "Your number, not the industry's",
      heading: {
        before: "What are unanswered calls costing ",
        highlight: "your practice",
        after: "?",
      },
      lede:
        "The stats above are industry averages. Your call volume, patient value, and front-desk hours set the real number. Three sliders, sixty seconds, and you'll have a working estimate — in new patients and dollars.",
    },
  },
};
