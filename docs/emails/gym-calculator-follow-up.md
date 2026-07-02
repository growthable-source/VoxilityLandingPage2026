# Gym Calculator — Follow-Up Email Sequence

Five emails for leads who complete the missed-revenue calculator at
`/gym-calculator`. Written for GoHighLevel (or any ESP) — paste each into a
workflow triggered by the calculator webhook.

## Wiring it up

The webhook payload (`CALCULATOR_WEBHOOK_URL`, falling back to
`CONTACT_WEBHOOK_URL`) carries every field these emails reference. Map them to
custom fields once and the merge tags below work throughout:

| Webhook key | Suggested GHL custom field | Example value |
|---|---|---|
| `firstName` | contact.first_name | Sarah |
| `gymName` | contact.gym_name | Ironworks Fitness |
| `monthlyInquiries` | contact.calc_monthly_inquiries | 80 |
| `membershipPrice` | contact.calc_membership_price | 150 |
| `memberStayMonths` | contact.calc_member_stay_months | 12 |
| `responseSpeed` | contact.calc_response_speed | Same day |
| `afterHours` | contact.calc_after_hours | Goes to voicemail |
| `lostMembersPerMonth` | contact.calc_lost_members | 9.1 |
| `missedMonthlyRevenue` | contact.calc_missed_monthly | 1350 |
| `twelveMonthRevenue` | contact.calc_twelve_month | 106500 |
| `utmSource` / `utmCampaign` / … | attribution fields | fb / gym-calc-jul |

Format the dollar fields as currency in the ESP (e.g. `$1,350`). Below,
merge tags are written GHL-style: `{{contact.first_name}}` etc.

Suggested sender: a real person's name (e.g. "Ryan from Xovera") with a
reply-able address. Every email is deliberately short enough to read on a
phone, since these leads came from Facebook and Instagram.

---

## Email 1 — instantly on completion

**Subject:** Your numbers from the calculator, {{contact.first_name}}
**Preview:** The estimate for {{contact.gym_name}}, plus how we got there.
**Goal:** Deliver the promised breakdown while the visit is fresh; earn the open for the rest of the sequence.

Hi {{contact.first_name}},

Thanks for running the numbers for {{contact.gym_name}}. Here's the estimate
you saw, in one place:

- **{{contact.calc_lost_members}} members a month** likely joining somewhere else
- **{{contact.calc_missed_monthly}} a month** in new membership revenue missed
- **{{contact.calc_twelve_month}} over the next 12 months**, once you account for how long members stay

A quick word on how we got there. You told us {{contact.gym_name}} gets about
{{contact.calc_monthly_inquiries}} inquiries a month, replies {{contact.calc_response_speed}},
and after-hours calls currently go the "{{contact.calc_after_hours}}" route. We
applied industry averages — around 23% of calls to service businesses go
unanswered, roughly three-quarters of missed callers never reconnect, and about
35% of gym inquiries become members when they're followed up well.

Your real numbers might land higher or lower. If you'd like to pressure-test
them against what's actually happening at the front desk, we're happy to walk
through it together — it takes about 30 minutes.

[Book a 30-minute strategy call]

Either way, keep this email — the next few notes from us will show where the
gap usually comes from and what closing it looks like.

Warmly,
Ryan from Xovera

---

## Email 2 — day 1

**Subject:** Where the {{contact.calc_missed_monthly}} usually goes
**Preview:** It's rarely the ads. It's the 47 minutes after the click.
**Goal:** Teach the "leak" insight; build trust with specificity.

Hi {{contact.first_name}},

When gym owners see their calculator number, the natural first question is
where the money actually goes. In our experience it's two places, and neither
one is your marketing.

**The evening call.** Most gym inquiries happen when people are off work —
which is exactly when your front desk is coaching, closing, or gone for the
day. On average, around 23% of inbound calls to service businesses go
unanswered, and most of those callers don't leave a voicemail. They just call
the next gym on the map.

**The 47 minutes.** Lead-response studies put the median time-to-first-reply
for a new form fill at about 47 minutes. Reply within 60 seconds and you're
around 8x more likely to qualify that lead. The lead didn't go cold because
they lost interest — a competitor simply got there first.

Neither of these is a staffing problem. Your team is busy doing the job you
hired them for. It's a coverage problem, and coverage is fixable.

On Thursday we'll show you what that fix looks like in practice. If you'd
rather skip ahead, the call link is here:

[Book a 30-minute strategy call]

Warmly,
Ryan from Xovera

---

## Email 3 — day 3

**Subject:** What "every call answered" looks like at a gym
**Preview:** Answered in seconds, qualified, and booked for a tour — around the clock.
**Goal:** Introduce the Xovera system as the fix, outcome-first.

Hi {{contact.first_name}},

Here's what we build for gyms like {{contact.gym_name}}, in plain terms.

When someone calls after hours, Xovera AI answers — a natural conversation,
not a phone tree. It asks what they're looking for, answers questions about
memberships and classes, and books them straight into a tour or trial slot on
your calendar.

When someone fills out a form or sends a DM, the reply goes out in seconds,
not minutes. The conversation continues by text until the visit is booked,
and your team sees the whole thread in one place.

The result we aim for is simple: every inquiry answered, every qualified lead
booked, and your staff focused on the people already in the building. The
pattern across the service businesses we work with is consistent: after-hours
calls stop going to voicemail, and the 47-minute reply window drops to
seconds.

It plugs into the booking and CRM tools you already run, so there's no
rip-and-replace. If you'd like to see it handle a real call, we'll happily
demo it live on a 30-minute call:

[Book a 30-minute strategy call]

Warmly,
Ryan from Xovera

---

## Email 4 — day 5

**Subject:** The three questions gym owners ask us first
**Preview:** Will it sound robotic, what does setup involve, and does the math work.
**Goal:** Handle the standing objections before the close.

Hi {{contact.first_name}},

By this point most owners have the same three questions, so here they are with
straight answers.

**"Will it sound robotic to my members?"** It's a natural conversation, and it
knows your gym — your classes, your pricing, your trial offer. Callers regularly
finish the call without realizing they weren't talking to the front desk. And
when someone needs a human, it hands off rather than improvising.

**"What does setup actually involve?"** About two weeks, and most of it is on
us. We learn your offers and FAQs, connect your calendar and booking system,
and test it together before it takes a single live call. Your team's routine
doesn't change.

**"Does the math work?"** Your calculator estimate was
{{contact.calc_missed_monthly}} a month in missed membership revenue. At
{{contact.calc_membership_price}} a month per member, recovering even a
handful of those inquiries tends to cover the system several times over — and
the economics work best when your ad spend is already generating steady
inquiry volume, which yours is.

If a different question is holding you back, reply to this email — a real
person reads these and will give you a real answer.

[Book a 30-minute strategy call]

Warmly,
Ryan from Xovera

---

## Email 5 — day 7

**Subject:** Closing the loop on your numbers
**Preview:** One last note, and an easy next step if the timing is right.
**Goal:** Gentle close; leave the door open without pressure.

Hi {{contact.first_name}},

Last note from us on this, I promise.

A week ago the calculator put {{contact.gym_name}}'s missed revenue at about
{{contact.calc_missed_monthly}} a month — roughly {{contact.calc_twelve_month}}
across the next 12 months. Numbers like that are worth a 30-minute
conversation, even if the answer turns out to be "not right now."

On the call we'd look at your actual inquiry volume and response times — not
industry averages — and show you exactly what Xovera would handle for
{{contact.gym_name}}, live. If it's not a fit, we'll say so; the system works
best for gyms with steady inquiry flow, and it's in nobody's interest to force
it.

[Book a 30-minute strategy call]

And if the timing just isn't right, no hard feelings — the calculator will
still be there when it is, and so will we.

Warmly,
Ryan from Xovera

---

## Sequence settings

- **Exit condition:** remove the contact from the sequence when a strategy
  call is booked or they reply — replies should route to a human inbox.
- **Send window:** 9am–6pm in the contact's timezone (Email 1 excepted — it
  sends immediately).
- **SMS:** only contacts with `smsOptIn: true` may receive texts; this
  sequence is email-only by design. A single day-2 text ("Hi {{contact.first_name}},
  Ryan from Xovera — sent your gym's numbers to your inbox, worth a look when
  you have a minute. Reply STOP to opt out.") is optional.
- **Tone guardrails:** no emoji, no exclamation-point hard sells, American
  spelling, numbers over adjectives — consistent with the site voice.
