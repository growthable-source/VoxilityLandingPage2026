// Plain-text rendering of a finished report, for CRM payloads.
//
// The webhook and contact-upsert payloads carry this as
// `website_audit_report`, so the GHL side can map it onto the contact
// ({{contact.website_audit_report}}) and the person taking the call — or the
// AI working the follow-up — has the findings in front of them without
// opening the link. Same provenance rules as the page: this renders what the
// audit measured, nothing else.

import type { AuditRecord } from "./types";

/** Keep well inside GHL's multi-line field limits. */
const MAX_CHARS = 6000;

const SEVERITY_LABELS: Record<string, string> = {
  critical: "COSTING ENQUIRIES",
  warning: "WORTH TIDYING",
  ok: "WORKING",
  unmeasured: "NOT MEASURED",
};

export function renderReportText(record: AuditRecord): string | null {
  const narrative = record.narrative;
  if (!narrative) return null;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xovera.io";
  const measuredUrl = record.signals?.onPage?.finalUrl ?? record.lead.website;

  const lines: string[] = [
    `WEBSITE TEARDOWN — ${record.lead.business}`,
    `Measured on: ${measuredUrl}`,
    `Report link: ${siteUrl}/audit/${record.token}`,
    "",
    narrative.summary,
    "",
    "FINDINGS",
  ];

  for (const finding of narrative.findings) {
    lines.push(
      "",
      `[${SEVERITY_LABELS[finding.severity] ?? finding.severity}] ${finding.title}`,
      finding.headline,
      finding.body,
    );
    for (const metric of finding.metrics) {
      lines.push(`  • ${metric.label}: ${metric.value}`);
    }
  }

  const gaps = record.signals?.gaps ?? [];
  if (gaps.length > 0) {
    lines.push("", "COULDN'T CHECK AUTOMATICALLY");
    for (const gap of gaps) lines.push(`  • ${gap}`);
  }

  if (narrative.callTopics.length > 0) {
    lines.push(
      "",
      "FOR THE CALL",
      ...narrative.callTopics.map((topic) => `  • ${topic.title}`),
    );
  }

  const text = lines.join("\n");
  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS - 1)}…` : text;
}
