// Copy for the AU AI-receptionist campaign page, kept apart from layout so it
// can be edited without touching JSX. The page is noindexed and points at paid
// Australian traffic, so it uses Australian English deliberately — the scoped
// exception to the American-English rule that applies to geo-targeted campaign
// pages only. Every claim in here should be one we can stand behind on the call.

/** The three places appointment businesses tend to lose bookings. */
export const LEAK_POINTS = [
  {
    title: "After hours and weekends",
    body:
      "People ring when they're free, which is often exactly when you're not. A voicemail asks " +
      "them to wait until tomorrow, and plenty of callers would rather keep dialling down the " +
      "list than leave a message.",
  },
  {
    title: "Mid-job, mid-appointment",
    body:
      "You're with a patient, on the tools, or halfway up a ladder. The phone does its thing, " +
      "rings out, and by the time you're free the moment has usually passed.",
  },
  {
    title: "The enquiry that waits until tomorrow",
    body:
      "A web enquiry answered within a minute or two is a very different conversation to one " +
      "answered the next morning. Reply speed tends to be the most valuable number in a local " +
      "business, and the one almost nobody measures.",
  },
];

/** What the receptionist actually does. Capability claims only — all confirmed. */
export const CAPABILITIES = [
  {
    title: "Answers in under three rings",
    body:
      "Day, night, weekends and public holidays, in a natural voice that doesn't sound like a " +
      "phone menu. Callers talk to it the way they'd talk to your front desk.",
  },
  {
    title: "Books straight into your calendar",
    body:
      "It checks your real availability, offers times, and books the appointment while the " +
      "caller is still on the phone — then confirms it by SMS.",
  },
  {
    title: "Rescues the missed ones",
    body:
      "If a call does ring out, the caller gets a text back within about 60 seconds and the " +
      "conversation carries on from there, before they've rung the next number on Google.",
  },
  {
    title: "Asks the right questions first",
    body:
      "New or existing customer, what the job or appointment is, which suburb — whatever " +
      "qualifying questions you'd ask, it asks. The bookings that land in your calendar are " +
      "ones you actually want.",
  },
  {
    title: "Knows when to hand over",
    body:
      "Some calls need a person, and it recognises them. During your hours it transfers the " +
      "call to whoever you nominate; outside them it takes the details, and you get a summary " +
      "of every conversation either way.",
  },
  {
    title: "Writes everything down",
    body:
      "Every call, text and chat is logged against the contact — no messages on the back of a " +
      "receipt. It updates your CRM, tags the enquiry, and kicks off the follow-up on its own.",
  },
];

export const STEPS = [
  {
    number: "1",
    title: "We ring you back",
    body:
      "A 15-minute call where you hear it answer live, handling the kinds of enquiries your " +
      "business actually gets. You'll know within a few minutes whether it sounds right.",
  },
  {
    number: "2",
    title: "We set it up around how you work",
    body:
      "Your services, your prices, your calendar, and when a call should come through to a " +
      "person. Your number stays yours — we simply route the calls. Usually inside a week.",
  },
  {
    number: "3",
    title: "It starts answering",
    body:
      "You can listen to the recordings, and we tune the wording together until it sounds like " +
      "your business. Change anything, any time, by telling us.",
  },
];

export const GOOD_FIT = [
  "Appointment and enquiry businesses — clinics, allied health, dental, trades, studios, salons, local services",
  "The phone is where the work comes from, and some of it rings outside opening hours",
  "A small front desk, or no front desk — the owner is the front desk",
  "You already spend on ads or SEO and want more of those clicks to become bookings",
];

export const POOR_FIT = [
  "Online stores — we're built for bookings and quotes, not carts",
  "A fully staffed 24/7 phone team that already answers everything",
  "Businesses where the phone simply isn't part of how customers arrive",
];

export const FAQS = [
  {
    question: "Will callers know they're not talking to a person?",
    answer:
      "Some ask, most don't. It speaks naturally, doesn't talk over people, and it doesn't " +
      "pretend — if a caller wants a human it says so and hands the call across rather than " +
      "bluffing its way through. On the callback you'll hear it yourself, which settles the " +
      "question faster than we can.",
    open: true,
  },
  {
    question: "What happens with a call it can't handle?",
    answer:
      "It hands over. During your hours that means transferring the call to whoever you " +
      "nominate; after hours it takes the caller's details and the reason they rang, and you " +
      "get the summary. Nothing gets guessed at on your behalf.",
  },
  {
    question: "Do I need to change phone providers or numbers?",
    answer:
      "No. Your number stays exactly as it is — calls are simply routed to the receptionist, " +
      "either all of them or just the ones you'd otherwise miss. If you ever stop, your number " +
      "goes back to ringing the way it does today.",
  },
  {
    question: "How much work is it on our end?",
    answer:
      "An hour or so, mostly conversation. You tell us how you'd answer the common questions, " +
      "what you charge, and what makes a good booking. We do the setup, and after that your " +
      "job is listening to a few recordings and telling us what to tweak.",
  },
  {
    question: "What does it cost?",
    answer:
      "It depends on call volume, so we'll give you the exact number on the callback once we " +
      "know roughly how many calls you take. You'll have the figure in front of you before " +
      "you're asked to commit to anything.",
  },
  {
    question: "How fast can it be live?",
    answer:
      "Usually about a week from the walkthrough call to answering real calls. Most of that is " +
      "us tuning it to your business rather than anything you need to sit through.",
  },
];
