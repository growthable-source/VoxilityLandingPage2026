// Copy for the free-build campaign page, kept apart from layout so it can be
// edited without touching JSX. This page is noindexed and points at paid
// traffic — every claim in here should be one we can stand behind on the call.

/** How many free builds we take a month. Used in three places; change it here. */
export const MONTHLY_BUILD_CAP = 6;

/**
 * The analysis walkthrough, in the order the copy ticks through it while the
 * visitor waits. Shown on the landing page and on the report's holding state,
 * so the two experiences match.
 */
export const ANALYSIS_STEPS = [
  "Loading your site the way a visitor on a phone does",
  "Reading what the top of your page actually says",
  "Running Google's mobile speed test on your real URL",
  "Taking screenshots on a phone and a laptop",
  "Reviewing the design and colour choices",
  "Checking tap-to-call, forms and the basics",
  "Looking up your Google rating and review count",
  "Comparing you to nearby businesses in your category",
  "Writing up the findings in plain English",
];

/**
 * The same three client results the site shows in Proof.tsx, carried with their
 * attributions rather than as three naked numbers. If any of these stop being
 * true they need to come off both places.
 */
export const PROOF_STATS = [
  {
    metric: "+47",
    label: "bookings a month",
    detail: "within the first 60 days",
    attribution: "Scottsdale med spa, 3 locations",
  },
  {
    metric: "94%",
    label: "of missed calls saved",
    detail: "up from 0%",
    attribution: "Charlotte dental, 2 locations",
  },
  {
    metric: "$71",
    label: "cost per booking",
    detail: "down from $164",
    attribution: "Denver physio, 4 locations",
  },
];

export const CATCH_POINTS = [
  {
    title: "We're betting on ourselves.",
    body:
      "Most people who see what we build, and see what was holding the old setup back, ask us to " +
      "run the rest. Enough of them do that the free builds pay for themselves.",
  },
  {
    title: "We're forward-deployed engineers, and we work in the open.",
    body:
      "Agents do the heavy lifting on a build that used to take a designer three weeks, and we sit " +
      "in front of them rather than hiding it behind a process. That's the only reason we can hand " +
      "a finished site over for nothing.",
  },
  {
    title: "You genuinely keep it.",
    body:
      "Walk away after the call and the site stays live and stays yours. No invoice, no clawback, " +
      "and we don't hold your domain.",
  },
  {
    title: `${MONTHLY_BUILD_CAP} builds a month. That's it.`,
    body:
      "We build every one properly, and six is what that allows. Once they're taken, the next " +
      "spot is next month.",
  },
];

/**
 * The six teardown areas. `emailed: true` means the automated audit measures it
 * and it appears in the emailed teardown; the rest are covered live, because a
 * URL cannot reveal them and we would rather say so than estimate.
 */
export const TEARDOWN_AREAS = [
  {
    number: "01",
    title: "The first five seconds",
    body:
      "Whether the top of the page says what you do, where you do it, and what to press. We read " +
      "your actual headings and check for booking wording above the fold.",
    emailed: true,
  },
  {
    number: "02",
    title: "Speed on a 4G phone",
    body:
      "Most of your visitors are on a phone somewhere inconvenient. We run Google's mobile speed " +
      "test on your real URL and send you the number it comes back with.",
    emailed: true,
  },
  {
    number: "03",
    title: "Your review position",
    body:
      "Your Google rating and review count, next to three businesses near you in the same category. " +
      "It's usually the count rather than the rating that's doing the damage.",
    emailed: true,
  },
  {
    number: "04",
    title: "Calls you never knew about",
    body:
      "After hours, on the tools, already on another job. We can't see your call logs from outside, " +
      "so we go through them with you and put a number on it together.",
    emailed: false,
  },
  {
    number: "05",
    title: "How fast enquiries get answered",
    body:
      "Reply time tends to be the most valuable number in a local business and the one almost " +
      "nobody measures. We'll time yours on the call.",
    emailed: false,
  },
  {
    number: "06",
    title: "Where the marketing money goes",
    body:
      "If there's spend going out on ads, SEO or a retainer, we'll trace what's coming back from " +
      "it. Sometimes that's a comfortable conversation and sometimes it isn't.",
    emailed: false,
  },
];

export const STEPS = [
  {
    number: "1",
    title: "Enter your web address",
    body:
      "One box, no details needed to start. We analyse your live site on the spot — what the top " +
      "of the page says, mobile speed, tap-to-call, your Google review position. About a minute.",
  },
  {
    number: "2",
    title: "See your report",
    body:
      "Tell us where the findings should go — company name, email, mobile — and the report opens " +
      "right there, in plain English with the measured numbers behind every finding.",
  },
  {
    number: "3",
    title: "Claim your free website",
    body:
      "One button on the report. We build the new site and deliver it the same day, on a 15 minute " +
      "call. No deck, no pressure.",
  },
];

export const STACK_ITEMS = [
  {
    title: "AI receptionist",
    body:
      "Answers every call, day or night. Qualifies the job, books it into your calendar, and texts " +
      "back anyone who slips through. Usually the fastest of these to pay for itself.",
  },
  {
    title: "Review engine",
    body:
      "Asks every happy customer at the right moment and routes the unhappy ones to you privately " +
      "first. Ratings climb, and the map ranking tends to follow.",
  },
  {
    title: "Meta and Google ads",
    body:
      "Run with the phone calls tracked back to the ad that caused them, so you're looking at cost " +
      "per booked job rather than impressions.",
  },
  {
    title: "Conversational AI",
    body:
      "Handles website chat, SMS and Messenger in your voice, and books straight into the calendar. " +
      "Replaces the live chat widget nobody was manning.",
  },
  {
    title: "Social content planner",
    body:
      "A month of posts planned, written and scheduled, so the business looks alive when someone " +
      "checks you out before calling.",
  },
  {
    title: "Follow-up that doesn't stop",
    body:
      "Every enquiry chased by text and email until they book or ask you to stop. More money tends " +
      "to be lost here than anywhere else on this list.",
  },
];

export const FAQS = [
  {
    question: "Is the build actually free, or is it free with a subscription?",
    answer:
      "Actually free. No card, no trial, no minimum term. We build the site, it goes live, and if " +
      "you say it's not for you it stays yours anyway. The bet is that enough people like what they " +
      "see to have us run the rest.",
    open: true,
  },
  {
    question: "So where does the money come in?",
    answer:
      "The site is free. If you want revisions and your forms wired into a CRM — yours, or ours, " +
      "built on GoHighLevel — there's a small activation fee. We'll cover it on the call.",
  },
  {
    question: "What if I already have a website I paid good money for?",
    answer:
      "That's often the more interesting call. We'll go through it honestly and tell you if it's " +
      "fine — plenty of sites look great and simply weren't built to convert. Some of what we find " +
      "is a five-minute fix you can do yourself.",
  },
  {
    question: "How long does it take?",
    answer:
      "The analysis runs while you're on the page — about a minute. From requesting the build, " +
      "your new site is delivered the same day, on a 15 minute call.",
  },
  {
    question: "Will I get hammered with sales calls?",
    answer:
      "One call, booked at a time you choose. If it's a no it's a no, and we'd rather spend the " +
      "time on the next build.",
  },
  {
    question: "Do you only work with certain industries?",
    answer:
      "We work best with businesses that live on appointments and enquiries — trades, clinics, " +
      "allied health, studios, salons, local services. If you sell physical products online we're " +
      "probably not the right fit, and we'll say so quickly.",
  },
  {
    question: "Who owns the website?",
    answer:
      "You do. Domain, content, the lot. Holding a client's site hostage is a poor way to keep " +
      "them, so we don't.",
  },
];
