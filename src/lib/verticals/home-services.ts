import type { Vertical } from "@/lib/verticals/types";
import { DEFAULT_MISSED_CALL_RATE, DEFAULT_SPEED_LOSS } from "@/lib/revenueMath";

// Home services (HVAC, plumbing, electrical). The economics are urgent and
// concrete: when the AC dies or a pipe bursts, the homeowner calls down the
// list and books the first company that picks up (78% buy from the first
// responder). Crews are on jobs all day, so the calls that ring out are often
// the highest-value emergency and after-hours work.
export const homeServices: Vertical = {
  slug: "home-services",
  name: "Home Services",
  noun: "home-services business",
  orgLabel: "Company name",
  signupUrl: "https://xovera.io/home-services",
  demoSource: "ai-for-home-services",

  seo: {
    title: "AI Receptionist for Home Services — Win the Job by Answering First | Xovera",
    description:
      "Xovera answers every service call, captures the address and problem, and books the job onto your schedule 24/7 — even when your crew is on a job, after hours, and all weekend. Talk to it free, no signup. Works with ServiceTitan, Housecall Pro, Jobber and FieldEdge.",
    ogAlt: "Xovera AI receptionist for home-services contractors.",
    keywords: [
      "ai receptionist for home services",
      "hvac answering service",
      "plumber answering service",
      "electrician virtual receptionist",
      "after hours answering service contractor",
      "home services missed calls",
      "ai call booking hvac plumbing electrical",
    ],
  },

  hero: {
    badge: "For HVAC, plumbing & electrical · US",
    h1: { before: "Win the job by ", highlight: "answering first", after: "." },
    subhead:
      "When the AC dies or a pipe bursts, the homeowner books whoever picks up. Xovera answers every call, captures the address and the problem, and books the job onto your schedule 24/7 — even when your crew is on a job. Talk to it right now, free — no signup, no card.",
    metrics: [
      { v: "24/7", l: "every call answered — on the job, after hours, weekends" },
      { v: "78%", l: "of homeowners book with whoever answers first" },
      { v: "Seconds", l: "to book the visit, not hours to call back" },
    ],
    demoPrompts: [
      "Say your AC stopped working",
      "Ask for a plumber tonight",
      "Ask if they do weekend service",
    ],
  },

  integrations: {
    heading: {
      before: "We don't replace your field-service software. ",
      highlight: "We answer the phone it can't.",
    },
    lede:
      "Keep ServiceTitan, Housecall Pro, Jobber — whatever runs your schedule. Xovera layers on top to catch every call, form, and booking request your team misses while they're on a job: answered, booked, and written back to your system. Built on GoHighLevel so you get enterprise automation without running it yourself.",
    tools: [
      "ServiceTitan",
      "Housecall Pro",
      "Jobber",
      "FieldEdge",
      "Service Fusion",
      "ServiceM8",
      "Workiz",
      "Podium",
      "Weave",
      "CompanyCam",
      "GoHighLevel",
      "Angi",
    ],
  },

  problem: {
    eyebrow: "The math of a missed call",
    heading: {
      before: "Every call that rings out is a job that ",
      highlight: "goes to the competitor who picked up",
      after: ".",
    },
    lede:
      "Your crew is on a job, so the phone rings out — and the highest-value calls are the ones that come in after hours and on weekends, when the AC just died or the basement is flooding. The homeowner doesn't leave a voicemail. They call the next company on the list.",
    stats: [
      { v: "78%", l: "of homeowners book with the first company that answers" },
      { v: "$5k–12k+", l: "value of a single install — a system, water heater, or repipe" },
      { v: "Nights & weekends", l: "when the highest-value emergency calls come in" },
    ],
  },

  methods: {
    eyebrow: "Three ways it fills your schedule",
    heading: {
      before: "Every call worked, ",
      highlight: "whenever it comes in",
      after: ".",
    },
    items: [
      {
        icon: "Zap",
        title: "Answer first, win the job",
        body:
          "The moment someone calls and you miss it, or fills out a form, Xovera picks up and books them while they're still on the phone. When a pipe bursts, the homeowner books whoever answers first — so you win the job instead of the shop down the road.",
      },
      {
        icon: "PhoneCall",
        title: "A dispatcher that never misses a call",
        body:
          "A warm, professional voice answers every call 24/7 — even when your whole crew is on a job. It captures the address, the problem, and how urgent it is, checks your openings, and books the visit straight onto your schedule. No call goes to voicemail.",
      },
      {
        icon: "CalendarCheck",
        title: "Books the job with the details you need",
        body:
          "It confirms the service, gets the address and problem details, flags true emergencies, and texts the homeowner a confirmation. Every job is logged with the notes your tech needs before they roll — nothing lost between the phone and the schedule.",
      },
    ],
  },

  chatDemo: {
    context: "New customer · Google · 9:15pm",
    lines: [
      { from: "lead", text: "My AC just quit and the house is getting hot. Can someone come out?" },
      {
        from: "xovera",
        text: "Sorry to hear that — we can help. Is this the home at a single address, and can I grab the street address so I can get a tech out to you?",
      },
      { from: "lead", text: "Yeah, 418 Maple Street. It's blowing warm air and won't cool down." },
      {
        from: "xovera",
        text: "Got it — 418 Maple Street, AC blowing warm and not cooling. I have a tech who can come first thing tomorrow at 8am, or I can flag this for tonight's on-call. Which works?",
      },
      { from: "lead", text: "Tomorrow at 8 is fine, thanks." },
      {
        from: "xovera",
        text: "You're booked for 8am tomorrow at 418 Maple Street. I've sent a confirmation text with the details — we'll see you then.",
      },
    ],
    outcome: "Job booked · address + issue captured · 9:16pm",
  },
  demo: {
    eyebrow: "While your crew is on a job",
    heading: {
      before: "A missed call at 9pm. ",
      highlight: "A booked job by 9:01.",
    },
    lede:
      "While your team is on a job or done for the night, Xovera answers in seconds, captures the address and the problem, and books the visit straight onto your schedule — then logs it in your system with the notes your tech needs. No homeowner left on voicemail.",
    metrics: [
      { v: "<60s", l: "average time to answer" },
      { v: "24/7", l: "even after hours" },
      { v: "0", l: "calls to voicemail" },
    ],
  },

  voice: {
    eyebrow: "Voice AI dispatcher",
    heading: { before: "Never miss a service call — ", highlight: "even at 9pm on a Sunday." },
    lede:
      "A natural-sounding AI answers the second the phone rings — day, night, weekends, and whenever your crew is on a job. It captures the address and the problem, checks your openings, books the visit, and routes true emergencies to your on-call tech. No voicemail, no lost jobs.",
    bullets: [
      "Answers 24/7 in a warm, professional voice",
      "Captures the address, the problem, and how urgent it is",
      "Books the job onto your schedule and routes real emergencies to on-call",
    ],
  },

  setup: {
    eyebrow: "Live in an afternoon",
    heading: { before: "No new software ", highlight: "for your team to learn." },
    lede:
      "It works the calls and requests you already get — your team keeps their hands on the tools instead of the phone.",
    steps: [
      {
        n: "01",
        t: "Connect your tools",
        d: "Link your field-service software, schedule, and web forms in a few minutes. No developer required.",
      },
      {
        n: "02",
        t: "Xovera answers everything",
        d: "Missed calls and booking requests all get an instant, on-brand reply by voice and text — with your service area, hours, and openings.",
      },
      {
        n: "03",
        t: "Jobs get booked",
        d: "It captures the address and problem, books onto your schedule, and flags true emergencies — then writes it back to your system with tech notes.",
      },
      {
        n: "04",
        t: "You run jobs, not the phone",
        d: "Every call and request is tracked end-to-end, so you know exactly what your ads and your phone are really producing.",
      },
    ],
  },

  contact: {
    eyebrow: "Book a demo",
    heading: { before: "See it answer a real call ", highlight: "for your business." },
    lede:
      "In 20 minutes we'll show Xovera answering a real call for your shop — capturing the address, the problem, and booking the visit live onto a schedule. Grab a time, it's on us.",
    bullets: [
      "Free while in beta — no card required",
      "Live in an afternoon, works with your field-service software",
      "Routes true emergencies to your on-call tech",
    ],
  },

  faqs: [
    {
      q: "Does it work with my field-service software?",
      a: "Yes — and it doesn't replace it. Keep ServiceTitan, Housecall Pro, Jobber, FieldEdge or whatever runs your schedule; Xovera layers on top to answer the calls and requests your team misses while they're on a job. It's built on GoHighLevel (our preferred platform) and connects widely. Don't see your system? It's quick for us to add.",
    },
    {
      q: "Does it sound professional, like a real dispatcher?",
      a: "Yes. It uses natural, human-sounding voices and answers like a sharp office dispatcher — most homeowners don't realize they're talking to an AI until you tell them. The fastest way to judge it is to talk to the demo at the top of this page.",
    },
    {
      q: "Can it book jobs and get the address and problem onto my schedule?",
      a: "Yes — it captures the service address, the problem, and how urgent it is, checks your real openings, and books the visit straight onto your schedule with the notes your tech needs before they roll. Every job is logged so nothing slips between the phone and the truck.",
    },
    {
      q: "What about after-hours and emergency calls?",
      a: "That's where it earns its keep. Xovera answers nights and weekends when your highest-value calls come in, books routine work for the next opening, and routes true emergencies straight to your on-call tech the way you set it up. You decide what counts as an emergency and where those calls go.",
    },
    {
      q: "Can it handle overflow when my team is on a job?",
      a: "Yes — that's the point. When every call would normally ring out because the crew is heads-down on a job, Xovera picks up in seconds, books what it can, and captures the rest so no homeowner ends up calling your competitor instead.",
    },
    {
      q: "Will it replace my office staff?",
      a: "No — it handles the calls your team can't get to: the overflow while they're on a job, plus evenings, weekends, and everything after hours. Your office staff stays focused on the work in front of them and hands off the phone when they need to.",
    },
  ],

  calc: {
    unitSingular: "job",
    unitPlural: "jobs",
    closeRate: 0.5,
    callShare: 0.8,
    lostForGood: 0.8,
    missedCallRate: DEFAULT_MISSED_CALL_RATE,
    speedLoss: DEFAULT_SPEED_LOSS,
    inputs: {
      monthlyInquiries: {
        min: 30,
        max: 800,
        step: 10,
        default: 250,
        label: "Service calls per month",
        hint: "Inbound calls, form fills, and booking requests.",
      },
      avgValue: {
        min: 100,
        max: 3000,
        step: 25,
        default: 450,
        label: "Average job ticket",
        hint: "Your typical service call or repair — installs run much higher.",
      },
      repeatFactor: {
        min: 1,
        max: 12,
        step: 1,
        default: 3,
        label: "Jobs from a customer over time",
        unit: "jobs",
      },
    },
    audience: "For home-services owners",
  },
  calcCopy: {
    h1: { before: "See what ", highlight: "missed calls", after: " cost your shop." },
    subhead:
      "78% of homeowners book with whoever answers first, and the calls that ring out are often your highest-value emergency work. Sixty seconds, a few questions, and you'll have a working estimate — in jobs and dollars.",
    crossLink:
      "Curious what missed calls and slow callbacks cost your shop today? Run the 60-second calculator.",
  },
};
