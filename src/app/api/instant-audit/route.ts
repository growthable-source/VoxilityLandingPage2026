import { NextResponse } from "next/server";
import { after } from "next/server";
import { normalizeSiteUrl } from "@/lib/audit/fetchSite";
import { isWebsiteLike } from "@/lib/leadValidation";
import { runAudit } from "@/lib/audit/run";
import { newAuditToken, saveAudit } from "@/lib/audit/store";
import type { AuditRecord } from "@/lib/audit/types";

// Starts an instant audit from a web address alone. Contact details arrive
// later via /api/instant-audit/contact, while the analysis runs — so this
// route deliberately captures no PII. The audit runs after the response is
// sent, but still inside this invocation; PageSpeed alone can take 35s.
export const maxDuration = 60;

const MIN_FORM_DURATION_MS = 2500;

interface StartPayload {
  website?: string;
  attribution?: Record<string, unknown>;
  // anti-spam — same decoy name as the free-build form.
  homepage?: string;
  formStartTime?: number;
}

function clampField(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.slice(0, max).trim()
    : undefined;
}

export async function POST(request: Request) {
  let body: StartPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot + time-trap. A fake token keeps the bot busy and harmless.
  if (
    (body.homepage && body.homepage.length > 0) ||
    (typeof body.formStartTime === "number" &&
      Date.now() - body.formStartTime < MIN_FORM_DURATION_MS)
  ) {
    return NextResponse.json({ ok: true, token: newAuditToken() });
  }

  const website = (body.website ?? "").slice(0, 300).trim();
  // isWebsiteLike catches what URL parsing happily swallows — an email
  // address parses as userinfo@host and would send the audit off to analyse
  // outlook.com.
  const siteUrl = isWebsiteLike(website) ? normalizeSiteUrl(website) : null;
  if (!siteUrl) {
    return NextResponse.json(
      {
        error: website.includes("@")
          ? "That's an email address — we need your website, like thompsonplumbing.com.au."
          : "That doesn't look like a web address — check it and try again.",
      },
      { status: 422 },
    );
  }

  const attribution = body.attribution ?? {};
  const record: AuditRecord = {
    token: newAuditToken(),
    status: "pending",
    flow: "instant",
    lead: {
      // Contact details arrive at the reveal gate. Until then the domain
      // stands in for the business name — Places corroborates its match by
      // website domain, so the review lookup still has what it needs.
      name: "",
      business: new URL(siteUrl).hostname.replace(/^www\./, ""),
      website,
      phone: "",
      email: "",
      pain: "",
      attribution: {
        utmSource: clampField(attribution.utmSource, 200),
        utmMedium: clampField(attribution.utmMedium, 200),
        utmCampaign: clampField(attribution.utmCampaign, 200),
        utmContent: clampField(attribution.utmContent, 200),
        utmTerm: clampField(attribution.utmTerm, 200),
        gclid: clampField(attribution.gclid, 300),
        fbclid: clampField(attribution.fbclid, 300),
        landingPage: clampField(attribution.landingPage, 500),
        referrer: clampField(attribution.referrer, 500),
      },
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined,
    },
    signals: null,
    narrative: null,
    createdAt: new Date().toISOString(),
  };

  try {
    await saveAudit(record);
  } catch (err) {
    console.error("[instant-audit] could not persist the record:", err);
    return NextResponse.json(
      { error: "We couldn't start the check. Please try again." },
      { status: 500 },
    );
  }

  after(async () => {
    await runAudit(record.token);
  });

  return NextResponse.json({ ok: true, token: record.token });
}
