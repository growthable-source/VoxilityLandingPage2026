import type { Vertical } from "@/lib/verticals/types";
import { DEFAULT_MISSED_CALL_RATE, DEFAULT_SPEED_LOSS } from "@/lib/revenueMath";

// Chiropractic & physical therapy. The economics are recurring: a new patient
// often commits to a plan of care of 12–24+ visits, so one booking is worth
// roughly $1,000–3,000. The front desk is constantly pulled onto the floor —
// adjustments, therapy, checkouts — so calls ring out during the busiest hours.
// This config mirrors the med-spas exemplar's structure and tone.
export const chiropractic: Vertical = {
  slug: "chiropractic",
  name: "Chiropractic & Physical Therapy",
  noun: "practice",
  orgLabel: "Practice name",
  signupUrl: "https://app.xovera.io/?ref=ai-for-chiropractic",
  demoSource: "ai-for-chiropractic",

  seo: {
    title: "AI Receptionist for Chiropractic & PT — Never Miss a New Patient | Xovera",
    description:
      "Xovera answers every call, books new patients, and works your practice's front desk 24/7 — even when the team is on the floor, at lunch, or after close. Talk to it free, no signup. Works with Jane, ChiroTouch, WebPT, Cliniko and NexHealth.",
    ogAlt: "Xovera AI receptionist for chiropractic and physical therapy practices.",
    keywords: [
      "ai receptionist for chiropractic",
      "chiropractic answering service",
      "physical therapy virtual receptionist",
      "chiropractic missed calls",
      "ai booking chiropractor",
      "after hours answering service physical therapy",
      "chiropractic front desk automation",
    ],
  },

  hero: {
    badge: "For chiropractic & PT practices · US",
    h1: { before: "Never miss another ", highlight: "new patient", after: "." },
    subhead:
      "Xovera answers every call, books the new-patient appointment, and works your front desk 24/7 — even when the team is on the floor, at lunch, or after close. Talk to it right now, free — no signup, no card.",
    metrics: [
      { v: "24/7", l: "every call answered — floor, lunch, nights, weekends" },
      { v: "Seconds", l: "to book a new patient, not hours to call back" },
      { v: "$1,000+", l: "value of a plan of care you keep off voicemail" },
    ],
    demoPrompts: [
      "Ask if you take my insurance",
      "Try to book a new-patient visit",
      "Ask about hours and parking",
    ],
  },

  integrations: {
    heading: {
      before: "We don't replace your practice software. ",
      highlight: "We answer the phone it can't.",
    },
    lede:
      "Keep Jane, ChiroTouch, WebPT — whatever runs your schedule. Xovera layers on top to catch every call, form, and message the front desk misses: answered, booked, and written back to your system. Built on GoHighLevel so you get enterprise automation without running it yourself.",
    tools: [
      "Jane",
      "ChiroTouch",
      "ChiroFusion",
      "Genesis Chiropractic",
      "WebPT",
      "Cliniko",
      "Practice Fusion",
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
      before: "Every call that rings out is a new patient who ",
      highlight: "booked somewhere else",
      after: ".",
    },
    lede:
      "Your busiest hours are exactly when the front desk is pulled onto the floor — adjustments, therapy, checkouts. And a new patient in pain doesn't leave a voicemail. They call the next practice on the list.",
    stats: [
      { v: "Up to 35%", l: "of calls to practices go unanswered" },
      { v: "$1,000–3,000", l: "value of a new patient's plan of care" },
      { v: "78%", l: "of callers book with whoever responds first" },
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
          "The moment someone calls and you miss it, messages your page, or fills out a form, Xovera answers and books them while they're still deciding. Patients in pain book fast — the practice that responds first usually wins the visit.",
      },
      {
        icon: "PhoneCall",
        title: "An AI receptionist that never misses a call",
        body:
          "A warm, natural voice answers every call 24/7 — covers your hours, location, and insurance basics from your own info, checks real openings, and books straight onto your calendar. Even when the whole team is on the floor, no call goes to voicemail.",
      },
      {
        icon: "CalendarCheck",
        title: "Books the visit — and protects the schedule",
        body:
          "It confirms the new-patient appointment, books it onto your calendar, and sends reminders to cut no-shows and refill open slots. Anything clinical is routed to your staff, and every booking is logged so nothing slips between the phone and the chart.",
      },
    ],
  },

  chatDemo: {
    context: "New patient · Google · 7:15pm",
    lines: [
      { from: "lead", text: "Hi, my lower back has been killing me. Are you taking new patients?" },
      {
        from: "xovera",
        text: "We are, and I'm sorry you're hurting. I can get you in for a new-patient visit. I have tomorrow at 9am or Thursday at 4pm — which works better?",
      },
      { from: "lead", text: "Tomorrow at 9 would be great." },
      {
        from: "xovera",
        text: "You're booked for tomorrow at 9am. Quick question so we're ready — do you have insurance you'd like us to check, or would you prefer self-pay?",
      },
      { from: "lead", text: "I've got Blue Cross." },
      {
        from: "xovera",
        text: "Perfect, I've noted that for our team to verify. I'll text you a confirmation and a reminder before your visit. Feel better — see you at 9!",
      },
    ],
    outcome: "New patient booked · reminder set · 7:16pm",
  },
  demo: {
    eyebrow: "While the team is on the floor",
    heading: {
      before: "A missed call at 7pm. ",
      highlight: "A booked new patient by 7:01.",
    },
    lede:
      "While your team is with patients or gone for the night, Xovera answers in seconds, covers your hours and insurance basics, and books the new-patient visit straight onto your calendar — then logs it in your system. No patient left on read.",
    metrics: [
      { v: "<60s", l: "average reply time" },
      { v: "24/7", l: "even after close" },
      { v: "0", l: "calls to voicemail" },
    ],
  },

  voice: {
    eyebrow: "Voice AI receptionist",
    heading: { before: "Never miss another call — ", highlight: "even when the whole team's on the floor." },
    lede:
      "A natural-sounding AI answers the second the phone rings — day, night, weekends. It covers your hours, location, and insurance basics, books the new-patient visit, and routes anything clinical to your team. No voicemail, no missed patients, no medical advice.",
    bullets: [
      "Answers 24/7 in a warm, natural voice",
      "Covers your hours, location, insurance basics, and real-time openings",
      "Books new patients, sends reminders, and routes clinical questions to staff",
    ],
  },

  setup: {
    eyebrow: "Live in an afternoon",
    heading: { before: "No new software ", highlight: "for your team to learn." },
    lede:
      "It works the calls and messages you already get — your front desk keeps doing what they do with patients on the floor.",
    steps: [
      {
        n: "01",
        t: "Connect your tools",
        d: "Link your practice software, calendar, and inboxes in a few minutes. No developer required.",
      },
      {
        n: "02",
        t: "Xovera answers everything",
        d: "Missed calls, messages, and web forms all get an instant, on-brand reply by voice and text — with your hours, location, and insurance basics.",
      },
      {
        n: "03",
        t: "New patients get booked",
        d: "It answers the basics, books onto your calendar, and sends reminders — then writes it back to your system and routes clinical questions to staff.",
      },
      {
        n: "04",
        t: "You treat patients, not missed calls",
        d: "Every call and message is tracked end-to-end, so you know exactly what your marketing and front desk are really producing.",
      },
    ],
  },

  contact: {
    eyebrow: "Book a demo",
    heading: { before: "See it answer a real call ", highlight: "for your practice." },
    lede:
      "In 20 minutes we'll show Xovera answering a real call for your practice — covering your hours and insurance basics, checking openings, and booking a new-patient visit live. Grab a time, it's on us.",
    bullets: [
      "Free while in beta — no card required",
      "Live in an afternoon, works with your practice software",
      "HIPAA-ready with a signed BAA",
    ],
  },

  faqs: [
    {
      q: "Is my patients' data safe? Are you HIPAA-compliant?",
      a: "Yes. Chiropractic and PT practices handle protected health information, so we treat it that way — Xovera operates under a signed Business Associate Agreement (BAA), encrypts data in transit and at rest, and only captures what's needed to book and confirm a visit. We're happy to walk your team through exactly how it's handled on the demo.",
    },
    {
      q: "Does it work with my practice software?",
      a: "Yes — and it doesn't replace it. Keep Jane, ChiroTouch, WebPT, Cliniko, NexHealth or whatever runs your schedule; Xovera layers on top to answer the calls and messages your front desk misses. It's built on GoHighLevel (our preferred platform) and connects widely. Don't see your system? It's quick for us to add.",
    },
    {
      q: "What does it actually say to patients?",
      a: "It books new patients, answers questions about your hours, location, and insurance basics from your own information, and routes anything clinical to your staff. It never gives medical advice, diagnoses, or makes promises you didn't approve — you set the guardrails.",
    },
    {
      q: "Can it book onto my calendar and send reminders to cut no-shows?",
      a: "Yes — it checks real-time availability, books the visit during the conversation, and sends automatic confirmations and reminders. That protects your schedule, cuts no-shows, and helps refill open slots.",
    },
    {
      q: "Does the voice sound like a robot?",
      a: "No. It uses natural, human-sounding voices — most callers don't realize they're talking to an AI until you tell them. The fastest way to judge it is to talk to the demo at the top of this page.",
    },
    {
      q: "Will it replace my front desk?",
      a: "No — it handles the calls and messages your team can't get to while they're on the floor: adjustments, therapy sessions, checkouts, lunch, evenings, and everything after close. Your front desk stays focused on the patients in the room.",
    },
  ],

  calc: {
    unitSingular: "patient",
    unitPlural: "patients",
    closeRate: 0.4,
    callShare: 0.65,
    lostForGood: 0.75,
    missedCallRate: DEFAULT_MISSED_CALL_RATE,
    speedLoss: DEFAULT_SPEED_LOSS,
    inputs: {
      monthlyInquiries: {
        min: 20,
        max: 600,
        step: 10,
        default: 160,
        label: "New-patient inquiries per month",
        hint: "Calls, form fills, and messages from prospective patients.",
      },
      avgValue: {
        min: 40,
        max: 300,
        step: 5,
        default: 75,
        label: "Average value per visit",
        hint: "Typical collected amount per visit.",
      },
      repeatFactor: {
        min: 1,
        max: 20,
        step: 1,
        default: 12,
        label: "Visits in a plan of care",
        unit: "visits",
      },
    },
    audience: "For chiropractic & PT practices",
  },
  calcCopy: {
    h1: { before: "See what ", highlight: "missed calls", after: " cost your practice." },
    subhead:
      "Up to 35% of calls to practices go unanswered, and 78% of patients book with whoever responds first. Sixty seconds, a few questions, and you'll have a working estimate — in new patients and dollars.",
    crossLink:
      "Curious what missed calls and slow replies cost your practice today? Run the 60-second calculator.",
    section: {
      eyebrow: "Your number, not the industry's",
      heading: {
        before: "What is a rung-out phone costing ",
        highlight: "your practice",
        after: "?",
      },
      lede:
        "The stats above are industry averages. Your call volume, plan-of-care value, and front-desk hours set the real number. Three sliders, sixty seconds, and you'll have a working estimate — in new patients and dollars.",
    },
  },
};
