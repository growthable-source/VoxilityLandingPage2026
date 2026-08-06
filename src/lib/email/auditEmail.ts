// The audit email.
//
// Short on purpose. The email's only job is to be opened and clicked — the
// findings live on the audit page where they can be laid out properly and where
// the click tells us the address is real and being read.
//
// Australian Spam Act 2003 compliance is not optional here, even though the
// recipient asked for this: the message must identify the sender, carry
// accurate contact details, and offer a working unsubscribe. All three are
// below, plus a List-Unsubscribe header for the clients that honour it.

import { Resend } from "resend";
import { rankBySeverity } from "@/lib/audit/findings";
import type { AuditRecord } from "@/lib/audit/types";

const SENDER_NAME = "Xovera";

export class AuditEmailError extends Error {}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Build the message without sending it. Separated from `sendAuditEmail` so the
 * output can be rendered and eyeballed — email markup is the one surface with
 * no console and no error reporting, so it has to be checked by looking at it.
 */
export function renderAuditEmail(
  record: AuditRecord,
  auditUrl: string,
  replyTo = process.env.AUDIT_REPLY_TO ?? process.env.AUDIT_FROM_EMAIL ?? "hello@xovera.io",
): RenderedEmail {
  return {
    subject: subjectFor(record),
    html: htmlBody(record, auditUrl, replyTo),
    text: textBody(record, auditUrl, replyTo),
  };
}

export async function sendAuditEmail(
  record: AuditRecord,
  auditUrl: string,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUDIT_FROM_EMAIL;

  if (!apiKey || !from) {
    // Dev and any misconfigured deploy: log it rather than pretending it sent.
    console.log(
      `[audit-email] RESEND_API_KEY/AUDIT_FROM_EMAIL unset — would have sent to ${record.lead.email}:\n` +
        `${subjectFor(record)}\n${auditUrl}`,
    );
    if (process.env.NODE_ENV === "production") {
      throw new AuditEmailError(
        "Email is not configured — set RESEND_API_KEY and AUDIT_FROM_EMAIL.",
      );
    }
    return;
  }

  const replyTo = process.env.AUDIT_REPLY_TO ?? from;
  const unsubscribeMailto = `mailto:${replyTo}?subject=Unsubscribe`;
  const message = renderAuditEmail(record, auditUrl, replyTo);

  const { error } = await new Resend(apiKey).emails.send({
    from: `${SENDER_NAME} <${from}>`,
    to: record.lead.email,
    replyTo,
    subject: message.subject,
    text: message.text,
    html: message.html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeMailto}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });

  if (error) {
    throw new AuditEmailError(error.message ?? "Resend rejected the message.");
  }
}

function subjectFor(record: AuditRecord): string {
  return `${record.lead.business} — here's what we found`;
}

/** The two strongest measured findings, as one-line bullets. */
function bulletsFor(record: AuditRecord): string[] {
  const findings = record.narrative?.findings ?? [];
  return rankBySeverity(findings)
    .filter((f) => f.severity === "critical" || f.severity === "warning")
    .slice(0, 2)
    .map((f) => f.headline);
}

function textBody(record: AuditRecord, auditUrl: string, replyTo: string): string {
  const bullets = bulletsFor(record);
  const lines = [
    `Hi ${firstName(record)},`,
    "",
    `We've been through ${record.lead.business}'s setup. Here's the short version:`,
    "",
    record.narrative?.headline ?? "The full teardown is ready to read.",
    "",
    ...(bullets.length > 1 ? [`Also worth knowing: ${bullets[1]}`, ""] : []),
    "The full teardown — with the numbers behind each one, and what we'd do about them:",
    auditUrl,
    "",
    "That page is also where you claim the free rebuild. We build the site, you keep it, and we",
    "walk you through the rest on a 30-minute call. No card, no lock-in.",
    "",
    "— The team at Xovera",
    "",
    "---",
    `You're receiving this because you asked us for a website audit at xovera.io.`,
    `Xovera · https://www.xovera.io · ${replyTo}`,
    `To stop hearing from us, reply with "unsubscribe" and we'll take you off.`,
  ];
  return lines.join("\n");
}

/**
 * Table-based, inline-styled HTML. Email clients are twenty years behind
 * browsers; flexbox, grid and external stylesheets are all out. Light-only,
 * because dark-mode handling across clients is inconsistent enough that a
 * neutral light email is the safer read in both.
 */
function htmlBody(record: AuditRecord, auditUrl: string, replyTo: string): string {
  const bullets = bulletsFor(record);
  const headline = escape(
    record.narrative?.headline ?? "Your teardown is ready to read.",
  );

  const secondBullet =
    bullets.length > 1
      ? `<p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#4b5563;">
           Also worth knowing: ${escape(bullets[1])}
         </p>`
      : "";

  return `<!doctype html>
<html lang="en-AU">
<body style="margin:0;padding:0;background:#f4f4f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:28px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:36px 32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <tr><td>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#111827;">
          Hi ${escape(firstName(record))},
        </p>
        <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#4b5563;">
          We&rsquo;ve been through ${escape(record.lead.business)}&rsquo;s setup. Here&rsquo;s the short version:
        </p>
        <p style="margin:0 0 22px;padding:16px 18px;background:#fef2f2;border-left:3px solid #e8462d;border-radius:6px;font-size:17px;line-height:1.55;color:#111827;font-weight:600;">
          ${headline}
        </p>
        ${secondBullet}
        <p style="margin:0 0 26px;font-size:16px;line-height:1.6;color:#4b5563;">
          The full teardown has the numbers behind each one, and what we&rsquo;d do about them.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 26px;">
          <tr><td style="border-radius:8px;background:#e8462d;">
            <a href="${escape(auditUrl)}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
              Read the full teardown
            </a>
          </td></tr>
        </table>
        <p style="margin:0 0 26px;font-size:15px;line-height:1.6;color:#4b5563;">
          That page is also where you claim the free rebuild. We build the site, you keep it, and we
          walk you through the rest on a 30-minute call. No card, no lock-in contract.
        </p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
          &mdash; The team at Xovera
        </p>
        <hr style="margin:30px 0 18px;border:none;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
          You&rsquo;re receiving this because you asked us for a website audit at xovera.io.<br>
          Xovera &middot; <a href="https://www.xovera.io" style="color:#9ca3af;">www.xovera.io</a> &middot;
          <a href="mailto:${escape(replyTo)}" style="color:#9ca3af;">${escape(replyTo)}</a><br>
          To stop hearing from us,
          <a href="mailto:${escape(replyTo)}?subject=Unsubscribe" style="color:#9ca3af;">unsubscribe here</a>
          or reply with &ldquo;unsubscribe&rdquo;.
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function firstName(record: AuditRecord): string {
  return record.lead.name.split(/\s+/)[0] || record.lead.name;
}

/** Business names and generated prose both land in HTML — escape everything. */
function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
