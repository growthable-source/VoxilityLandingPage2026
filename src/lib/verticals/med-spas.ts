import type { Vertical } from "@/lib/verticals/types";
import { DEFAULT_MISSED_CALL_RATE, DEFAULT_SPEED_LOSS } from "@/lib/revenueMath";

// Flagship vertical. Med spa economics make the pain visceral and quantifiable
// (up to 35% missed calls, $7,800+ client LTV, 78% book with whoever answers
// first), so this config carries the richest copy — the exemplar the other
// verticals mirror.
export const medSpas: Vertical = {
  slug: "med-spas",
  name: "Med Spas",
  noun: "med spa",
  orgLabel: "Med spa name",
  signupUrl: "https://app.xovera.io/?ref=ai-for-med-spas",
  demoSource: "ai-for-med-spas",

  seo: {
    title: "AI Receptionist for Med Spas — Never Miss a Booking | Xovera",
    description:
      "Xovera answers every call, books the appointment, and works your med spa's front desk 24/7 — even at lunch, after close, and all weekend. Talk to it free, no signup. Works with Aesthetic Record, Boulevard, Vagaro, Mangomint and Zenoti.",
    ogAlt: "Xovera AI receptionist for med spas.",
    keywords: [
      "ai receptionist for med spa",
      "med spa answering service",
      "virtual receptionist medical spa",
      "med spa missed calls",
      "ai booking med spa",
      "after hours answering service med spa",
      "med spa front desk automation",
    ],
  },

  hero: {
    badge: "For med spas & aesthetic clinics · US",
    h1: { before: "Never miss another ", highlight: "Botox booking", after: "." },
    subhead:
      "Xovera answers every call, books the appointment, and works your front desk 24/7 — even at lunch, after close, and all weekend. Talk to it right now, free — no signup, no card.",
    metrics: [
      { v: "24/7", l: "every call answered — lunch, nights, weekends" },
      { v: "Seconds", l: "to book an appointment, not hours to call back" },
      { v: "$7,800+", l: "lifetime value of a client you keep off voicemail" },
    ],
    demoPrompts: [
      "Ask about Botox pricing",
      "Try to book a Friday facial",
      "Ask if you're open Sunday",
    ],
  },

  integrations: {
    heading: {
      before: "We don't replace your booking software. ",
      highlight: "We answer the phone it can't.",
    },
    lede:
      "Keep Aesthetic Record, Boulevard, Vagaro — whatever runs your calendar. Xovera layers on top to catch every call, DM, and form the front desk misses: answered, booked, and written back to your system. Built on GoHighLevel so you get enterprise automation without running it yourself.",
    tools: [
      "Aesthetic Record",
      "Boulevard",
      "Vagaro",
      "Mangomint",
      "Zenoti",
      "Nextech",
      "Symplast",
      "Jane",
      "RepeatMD",
      "Weave",
      "Podium",
      "Mindbody",
    ],
  },

  problem: {
    eyebrow: "The math of a missed call",
    heading: {
      before: "Every call that rings out is a client who ",
      highlight: "booked somewhere else",
      after: ".",
    },
    lede:
      "Your busiest booking windows — lunch, evenings, weekends — are exactly when the front desk can't get to the phone. And in aesthetics, the caller doesn't leave a voicemail. They call the next spa on the list.",
    stats: [
      { v: "Up to 35%", l: "of calls to salons and med spas go unanswered" },
      { v: "$7,800+", l: "lifetime value of a single med spa client" },
      { v: "78%", l: "of callers book with whoever answers first" },
    ],
  },

  methods: {
    eyebrow: "Three ways it fills your calendar",
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
          "The moment someone calls and you miss it, DMs your page, or fills out a form, Xovera answers and books them while they're still deciding. Aesthetics clients book fast — the spa that answers first usually wins the appointment.",
      },
      {
        icon: "PhoneCall",
        title: "An AI receptionist that never misses a call",
        body:
          "A warm, natural voice answers every call 24/7 — quotes Botox and filler pricing from your own menu, checks real openings, and books straight onto your calendar. Even at 8pm on a Sunday, no call goes to voicemail.",
      },
      {
        icon: "CalendarCheck",
        title: "Books the appointment — and the upsell",
        body:
          "It confirms the treatment, offers a complimentary consult or add-on where it fits, takes a deposit if you require one, and texts a confirmation. Every booking is logged so nothing slips between the phone and the chart.",
      },
    ],
  },

  chatDemo: {
    context: "New client · Instagram DM · 8:40pm",
    lines: [
      { from: "lead", text: "Hi! Do you have any Botox openings this week?" },
      {
        from: "xovera",
        text: "We do! Botox is $12/unit and I have Thursday 2pm or Friday 11am open. Which suits you better?",
      },
      { from: "lead", text: "Friday 11 please" },
      {
        from: "xovera",
        text: "Booked you in for Friday at 11am. Want me to add a complimentary skin consult while you're here?",
      },
      { from: "lead", text: "Yes, that'd be great" },
      {
        from: "xovera",
        text: "All set — you'll get a confirmation text shortly. See you Friday!",
      },
    ],
    outcome: "Appointment booked · consult added · 8:41pm",
  },
  demo: {
    eyebrow: "While the front desk is closed",
    heading: {
      before: "A missed call at 8pm. ",
      highlight: "A booked appointment by 8:01.",
    },
    lede:
      "While your team is with clients or gone for the night, Xovera answers in seconds, quotes your pricing, and books the appointment straight onto your calendar — then logs it in your system. No client left on read.",
    metrics: [
      { v: "<60s", l: "average reply time" },
      { v: "24/7", l: "even after close" },
      { v: "0", l: "calls to voicemail" },
    ],
  },

  voice: {
    eyebrow: "Voice AI receptionist",
    heading: { before: "Never miss another call — ", highlight: "even at 8pm on a Sunday." },
    lede:
      "A natural-sounding AI answers the second the phone rings — day, night, weekends. It knows your treatments, pricing, and openings, books the appointment, and routes anything clinical to your team. No voicemail, no missed clients.",
    bullets: [
      "Answers 24/7 in a warm, natural voice",
      "Knows your treatments, pricing, and real-time openings",
      "Books appointments, adds upsells, then texts a confirmation",
    ],
  },

  setup: {
    eyebrow: "Live in an afternoon",
    heading: { before: "No new software ", highlight: "for your team to learn." },
    lede:
      "It works the calls and messages you already get — your front desk keeps doing what they do with clients in the room.",
    steps: [
      {
        n: "01",
        t: "Connect your tools",
        d: "Link your booking system, calendar, and social inboxes in a few minutes. No developer required.",
      },
      {
        n: "02",
        t: "Xovera answers everything",
        d: "Missed calls, DMs, and web forms all get an instant, on-brand reply by voice and text — with your pricing and openings.",
      },
      {
        n: "03",
        t: "Appointments get booked",
        d: "It qualifies, quotes, books onto your calendar, and takes deposits — then writes it back to your system.",
      },
      {
        n: "04",
        t: "You see clients, not missed calls",
        d: "Every call and message is tracked end-to-end, so you know exactly what your ads and front desk are really producing.",
      },
    ],
  },

  contact: {
    eyebrow: "Book a demo",
    heading: { before: "See it answer a real call ", highlight: "for your med spa." },
    lede:
      "In 20 minutes we'll show Xovera answering a real call for your spa — quoting pricing, checking openings, and booking an appointment live. Grab a time, it's on us.",
    bullets: [
      "Free while in beta — no card required",
      "Live in an afternoon, works with your booking software",
      "HIPAA-ready with a signed BAA",
    ],
  },

  faqs: [
    {
      q: "Is my clients' data safe? Are you HIPAA-compliant?",
      a: "Yes. Med spas handle protected health information, so we treat it that way — Xovera operates under a signed Business Associate Agreement (BAA), encrypts data in transit and at rest, and only captures what's needed to book and confirm an appointment. We're happy to walk your team through exactly how it's handled on the demo.",
    },
    {
      q: "Does it work with my booking software?",
      a: "Yes — and it doesn't replace it. Keep Aesthetic Record, Boulevard, Vagaro, Mangomint, Zenoti or whatever runs your calendar; Xovera layers on top to answer the calls and messages your front desk misses. It's built on GoHighLevel (our preferred platform) and connects widely. Don't see your system? It's quick for us to add.",
    },
    {
      q: "What does it actually say to clients?",
      a: "You set the menu, pricing, and guardrails. It answers questions about treatments, pricing, and openings from your own information, books the appointment, and offers add-ons only where you allow — it never invents pricing or makes clinical promises you didn't approve.",
    },
    {
      q: "Can it take deposits and book directly onto my calendar?",
      a: "Yes — it checks real-time availability, books during the conversation, and can collect a deposit if you require one, with automatic confirmations and reminders to cut no-shows.",
    },
    {
      q: "Does the voice sound like a robot?",
      a: "No. It uses natural, human-sounding voices — most callers don't realize they're talking to an AI until you tell them. The fastest way to judge it is to talk to the demo at the top of this page.",
    },
    {
      q: "Will it replace my front desk?",
      a: "No — it handles the calls and messages your team can't get to: lunch rushes, evenings, weekends, and everything after close. Your front desk stays focused on the clients in the room.",
    },
  ],

  kiosk: {
    eyebrow: "At the front desk, too",
    heading: {
      before: "Walk-ins get the ",
      highlight: "same treatment",
      after: " as callers.",
    },
    lede:
      "Xovera isn't only on the phone. A kiosk at your front desk lets a walk-in sign the consent forms, pick a package, and pay — right there, while your team stays with the client in the room. Every walk-in ends up in your system, not on a sticky note.",
    items: [
      {
        icon: "PenLine",
        title: "Consent forms, signed on the spot",
        body:
          "Waivers and treatment consents get signed on the tablet and saved to the client's record — no paper forms, no chasing signatures before an appointment.",
      },
      {
        icon: "CreditCard",
        title: "Sign up and pay in one visit",
        body:
          "A new client picks their membership or package and pays at the kiosk. Signed up, paid, and logged in your system before they walk out the door.",
      },
      {
        icon: "UserCheck",
        title: "Every walk-in, captured",
        body:
          "Walk-ins check in and land in your follow-up pipeline automatically — so the ones who say they'll come back later actually hear from you.",
      },
    ],
  },

  calc: {
    unitSingular: "appointment",
    unitPlural: "appointments",
    closeRate: 0.4,
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
        label: "Calls & inquiries per month",
        hint: "Calls, form fills, and DMs combined.",
      },
      avgValue: {
        min: 150,
        max: 2000,
        step: 25,
        default: 600,
        label: "Average appointment value",
        hint: "Botox, filler, laser, facials — your typical booking.",
      },
      repeatFactor: {
        min: 1,
        max: 12,
        step: 1,
        default: 4,
        label: "Visits in a client's first year",
        unit: "visits",
      },
    },
    audience: "For med spa owners",
  },
  calcCopy: {
    h1: { before: "See what ", highlight: "missed calls", after: " cost your med spa." },
    subhead:
      "Up to 35% of calls to med spas go unanswered, and aesthetics clients book with whoever answers first. Sixty seconds, a few questions, and you'll have a working estimate — in appointments and dollars.",
    crossLink:
      "Curious what missed calls and slow replies cost your med spa today? Run the 60-second calculator.",
    section: {
      eyebrow: "Your number, not the industry's",
      heading: {
        before: "What are missed calls costing ",
        highlight: "your med spa",
        after: "?",
      },
      lede:
        "The stats above are industry averages. Your call volume, treatment value, and hours set the real number. Three sliders, sixty seconds, and you'll have a working estimate — in appointments and dollars.",
    },
  },
};
