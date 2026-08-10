import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertTriangle, Check, Info, MinusCircle } from "lucide-react";
import { AuditClaimButton, AuditViewTracker } from "@/components/free-build/AuditClaim";
import { AuditLiveProgress } from "@/components/free-build/AuditLiveProgress";
import { AuditReviewBar } from "@/components/free-build/AuditReviewBar";
import { CampaignFooter, CampaignNav } from "@/components/free-build/CampaignChrome";
import { MONTHLY_BUILD_CAP } from "@/components/free-build/content";
import { rankBySeverity } from "@/lib/audit/findings";
import { isReviewer } from "@/lib/audit/reviewAuth";
import { loadAudit } from "@/lib/audit/store";
import type { AuditFinding, AuditRecord, FindingSeverity } from "@/lib/audit/types";

// Someone's own teardown, behind an unguessable token. Never indexed, and
// never cached — the record changes as it moves ready → sent → claimed.
export const metadata: Metadata = {
  title: "Your website teardown | Xovera",
  robots: { index: false, follow: false, nocache: true },
};
export const dynamic = "force-dynamic";

export default async function AuditPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const key = typeof query.key === "string" ? query.key : undefined;

  const record = await loadAudit(token);
  if (!record) notFound();

  const reviewer = isReviewer(key);

  // Instant-flow records unlock the moment the analysis is done and the
  // contact details are in — the reveal on the landing page brings people
  // here. Emailed-flow records still wait for approval, so nobody receives
  // an unreviewed audit by link.
  const instantUnlocked =
    record.flow === "instant" &&
    Boolean(record.lead.email) &&
    record.status !== "pending";

  if (
    !reviewer &&
    !instantUnlocked &&
    (record.status === "pending" || record.status === "ready")
  ) {
    // A pending instant record gets live progress that opens the report by
    // itself. An instant record that finished without contact details would
    // reload-loop on that component, so it falls through to the static page,
    // as does the emailed flow.
    if (record.flow === "instant" && record.status === "pending") {
      return (
        <div className="min-h-screen bg-background">
          <CampaignNav ctaLabel="Back to the site" ctaHref="/free-website" />
          <AuditLiveProgress token={token} business={record.lead.business} />
          <CampaignFooter />
        </div>
      );
    }
    return <HoldingPage business={record.lead.business} />;
  }
  if (!reviewer && record.status === "failed") {
    return <FailedPage record={record} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CampaignNav
        note={`Prepared for ${record.lead.business}`}
        ctaLabel="Request my free build"
      />
      {!reviewer && <AuditViewTracker token={token} />}

      <main>
        <AuditHeader record={record} />
        <Findings record={record} />
        <DesignSection record={record} />
        <Gaps record={record} />
        <CallTopics record={record} />
        <ClaimSection record={record} />
      </main>

      <CampaignFooter />

      {reviewer && key && (
        <AuditReviewBar
          token={token}
          reviewKey={key}
          status={record.status}
          recipient={record.lead.email}
        />
      )}
    </div>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function AuditHeader({ record }: { record: AuditRecord }) {
  const measuredUrl = record.signals?.onPage?.finalUrl;
  const measuredAt = record.readyAt ?? record.createdAt;

  return (
    <header className="relative overflow-hidden border-b border-border/60 bg-gradient-hero">
      <div className="relative mx-auto max-w-[860px] px-5 py-16 md:px-8 md:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Website teardown
        </p>
        <h1
          className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
          style={{ lineHeight: 1.06, letterSpacing: "-0.03em" }}
        >
          {record.lead.business}
        </h1>

        {record.narrative && (
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
            {record.narrative.summary}
          </p>
        )}

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[13.5px] text-muted-foreground">
          {measuredUrl && (
            <div>
              <dt className="inline text-muted-foreground/70">Measured on </dt>
              <dd className="inline break-all text-foreground/85">{measuredUrl}</dd>
            </div>
          )}
          <div>
            <dt className="inline text-muted-foreground/70">Date </dt>
            <dd className="inline text-foreground/85">
              {new Date(measuredAt).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        </dl>
      </div>
    </header>
  );
}

function Findings({ record }: { record: AuditRecord }) {
  const findings = record.narrative?.findings ?? [];
  if (findings.length === 0) return null;

  return (
    <section className="mx-auto max-w-[860px] px-5 py-14 md:px-8 md:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        What we measured
      </h2>
      <p className="mt-3 max-w-[60ch] text-[15.5px] leading-relaxed text-muted-foreground">
        Every number below came from your live site or your Google listing. Where
        a check couldn&rsquo;t be run, it says so rather than guessing.
      </p>

      <div className="mt-10 grid gap-5">
        {rankBySeverity(findings).map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </section>
  );
}

function FindingCard({ finding }: { finding: AuditFinding }) {
  const style = SEVERITY_STYLES[finding.severity];

  return (
    <article className="rounded-lg border border-border/60 bg-card p-6 shadow-card md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[17px] font-semibold tracking-tight text-foreground">
          {finding.title}
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium ${style.chip}`}
        >
          {style.icon}
          {style.label}
        </span>
      </div>

      <p className="mt-4 text-[17px] font-medium leading-snug text-foreground">
        {finding.headline}
      </p>
      <p className="mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-muted-foreground">
        {finding.body}
      </p>

      {finding.metrics.length > 0 && (
        <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border/60 bg-border/60 sm:grid-cols-2">
          {finding.metrics.map((metric) => (
            <div key={metric.label} className="bg-card px-4 py-3">
              <dt className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground/75">
                {metric.label}
              </dt>
              <dd className="mt-1 break-words text-[14.5px] text-foreground/90">
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

const SEVERITY_STYLES: Record<
  FindingSeverity,
  { label: string; chip: string; icon: React.ReactNode }
> = {
  critical: {
    label: "Costing you enquiries",
    chip: "bg-destructive/12 text-destructive",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
  warning: {
    label: "Worth tidying",
    chip: "bg-warning/12 text-warning",
    icon: <Info className="h-3 w-3" />,
  },
  ok: {
    label: "Working",
    chip: "bg-success/12 text-success",
    icon: <Check className="h-3 w-3" />,
  },
  unmeasured: {
    label: "Not measured",
    chip: "bg-muted text-muted-foreground",
    icon: <MinusCircle className="h-3 w-3" />,
  },
};

function DesignSection({ record }: { record: AuditRecord }) {
  const screenshot = record.signals?.pageSpeed?.screenshot;
  const desktopScreenshot = record.signals?.desktopScreenshot;
  const design = record.design;
  if (!screenshot && !desktopScreenshot) return null;

  return (
    <section className="border-y border-border/60 bg-muted/20">
      <div className="mx-auto grid max-w-[860px] items-start gap-12 px-5 py-14 md:grid-cols-[340px_1fr] md:gap-12 md:px-8 md:py-16">
        <DeviceDuo
          business={record.lead.business}
          phone={screenshot ?? null}
          laptop={desktopScreenshot ?? null}
        />

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            How it looks
          </h2>
          <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted-foreground">
            {design
              ? "This part is professional opinion rather than measurement — our designer’s read of the screenshots beside it, so you can check every observation against them."
              : "Your site as it renders today, captured during the analysis. We’ll walk through the design together on the call."}
          </p>

          {design && (
            <p className="mt-6 text-[17px] font-medium leading-snug text-foreground">
              {design.headline}
            </p>
          )}

          <div className="mt-6 grid gap-5">
            {(design?.points ?? []).map((point) => (
              <div key={point.title}>
                <h3 className="text-[15.5px] font-semibold tracking-tight text-foreground">
                  {point.title}
                </h3>
                <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
                  {point.body}
                </p>
              </div>
            ))}
          </div>

          {design && design.palette.length > 0 && (
            <div className="mt-7">
              <h3 className="text-[12px] uppercase tracking-[0.1em] text-muted-foreground/75">
                The palette we can see
              </h3>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {design.palette.map((hex) => (
                  <span
                    key={hex}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card py-1 pl-1.5 pr-2.5 text-[12px] font-mono text-muted-foreground"
                  >
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-border/60"
                      style={{ backgroundColor: hex }}
                    />
                    {hex}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * The captured screenshots framed as devices — a laptop with a phone
 * overlapping its corner when both exist, or whichever one we have.
 * Pure CSS; the images are data URIs straight from Lighthouse, so
 * next/image adds nothing here.
 */
function DeviceDuo({
  business,
  phone,
  laptop,
}: {
  business: string;
  phone: string | null;
  laptop: string | null;
}) {
  const phoneFrame = phone && (
    <div className="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card p-1.5 shadow-card">
      <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-muted" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={phone}
        alt={`${business} as it rendered on a phone`}
        className="w-full rounded-[1rem]"
      />
    </div>
  );

  const laptopFrame = laptop && (
    <div>
      <div className="overflow-hidden rounded-t-lg border border-b-0 border-border/60 bg-card p-1.5 pb-0 shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={laptop}
          alt={`${business} as it rendered on a laptop`}
          className="w-full rounded-t-md"
        />
      </div>
      <div className="relative left-1/2 h-2.5 w-[108%] -translate-x-1/2 rounded-b-lg border border-border/60 bg-muted">
        <div className="mx-auto h-1 w-12 rounded-b-md bg-border/60" />
      </div>
    </div>
  );

  return (
    <figure className="mx-auto w-full max-w-[340px]">
      {laptopFrame && phoneFrame ? (
        <div className="relative pb-10 pr-6">
          {laptopFrame}
          <div className="absolute bottom-0 right-0 w-[31%]">{phoneFrame}</div>
        </div>
      ) : (
        <div className="mx-auto max-w-[240px]">{laptopFrame ?? phoneFrame}</div>
      )}
      <figcaption className="mt-3 text-center text-[12px] text-muted-foreground/75">
        {business} as it renders today, captured during the analysis
      </figcaption>
    </figure>
  );
}

function Gaps({ record }: { record: AuditRecord }) {
  const gaps = record.signals?.gaps ?? [];
  if (gaps.length === 0) return null;

  return (
    <section className="border-y border-border/60 bg-muted/25">
      <div className="mx-auto max-w-[860px] px-5 py-12 md:px-8">
        <h2 className="text-[19px] font-semibold tracking-tight text-foreground">
          What we couldn&rsquo;t check automatically
        </h2>
        <ul className="mt-4 grid gap-3">
          {gaps.map((gap) => (
            <li
              key={gap}
              className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
            >
              <MinusCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              {gap}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CallTopics({ record }: { record: AuditRecord }) {
  const topics = record.narrative?.callTopics ?? [];
  if (topics.length === 0) return null;

  return (
    <section className="mx-auto max-w-[860px] px-5 py-14 md:px-8 md:py-16">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Three things we can&rsquo;t see from out here
      </h2>
      <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-muted-foreground">
        These are usually the most expensive numbers in a local business, and
        none of them are visible from a website. We&rsquo;d rather go through
        them with you than put an estimate in writing.
      </p>

      <div className="mt-9 grid gap-5 md:grid-cols-3">
        {topics.map((topic) => (
          <div
            key={topic.title}
            className="rounded-lg border border-border/60 bg-card p-6 shadow-card"
          >
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
              {topic.title}
            </h3>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
              {topic.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ClaimSection({ record }: { record: AuditRecord }) {
  return (
    <section
      id="claim"
      className="relative overflow-hidden border-t border-border/60 bg-gradient-hero"
    >
      <div className="relative mx-auto max-w-[720px] px-5 py-16 text-center md:px-8 md:py-20">
        <h2
          className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          style={{ lineHeight: 1.08, letterSpacing: "-0.03em" }}
        >
          Now let us rebuild it, free.
        </h2>
        <p className="mx-auto mt-5 max-w-[54ch] text-[17px] leading-relaxed text-muted-foreground">
          We&rsquo;ll build {record.lead.business}{" "}a new site that fixes
          what&rsquo;s above, and deliver it on a 15&ndash;30 minute call — same
          day where we can, and never more than 42 hours from close of business.
          The site is yours to keep either way — no card, no lock-in contract.
        </p>

        <div className="mt-9">
          <AuditClaimButton
            token={record.token}
            alreadyClaimed={record.status === "claimed"}
          />
        </div>

        <p className="mx-auto mt-7 max-w-[56ch] text-[13.5px] leading-relaxed text-muted-foreground/85">
          {/* JSX trims whitespace bordering a newline, so the gap after the
              expression has to be explicit or it renders as "6builds". */}
          {`${MONTHLY_BUILD_CAP} builds a month.`}{" "}
          Taking the site as-is is free. If you want it working harder, a
          one-off $297 USD bundles in the CRM — forms answered instantly,
          speed-to-lead follow-up, missed-call text-back and a universal inbox.
          Nothing is charged without you agreeing to it on the call.
        </p>
      </div>
    </section>
  );
}

// ─── States before the audit is readable ─────────────────────────────────────

function HoldingPage({ business }: { business: string }) {
  return (
    <div className="min-h-screen bg-background">
      <CampaignNav ctaLabel="Back to the site" ctaHref="/free-website" />
      <main className="mx-auto max-w-[640px] px-5 py-24 text-center md:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          We&rsquo;re still working on this one.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
          {business}&rsquo;s teardown isn&rsquo;t quite finished — the analysis
          usually takes about a minute. Come back to this link shortly and the
          report will be here.
        </p>
      </main>
      <CampaignFooter />
    </div>
  );
}

function FailedPage({ record }: { record: AuditRecord }) {
  return (
    <div className="min-h-screen bg-background">
      <CampaignNav ctaLabel="Back to the site" ctaHref="/free-website" />
      <main className="mx-auto max-w-[640px] px-5 py-24 text-center md:px-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          We couldn&rsquo;t run this one automatically.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">
          Something about {record.lead.business}&rsquo;s setup stopped our checks
          from completing, which happens often enough that we plan for it. Rather
          than send you a half-finished audit, we&rsquo;ll go through the whole
          thing with you live. We&rsquo;ll be in touch to book a time — the free
          build still stands.
        </p>
      </main>
      <CampaignFooter />
    </div>
  );
}
