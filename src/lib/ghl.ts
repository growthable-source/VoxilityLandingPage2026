// GoHighLevel (LeadConnector) contact upsert via a Private Integration Token.
//
// Campaign form routes call this so paid-traffic leads land directly in the
// GHL subaccount — where the speed-to-lead automations live — rather than
// relying only on an inbound-webhook workflow. The PIT needs the
// "Edit Contacts" (contacts.write) scope.
//
// Everything here is fail-soft: an unset env or a GHL outage logs and returns,
// because losing the lead's success screen to a CRM hiccup is never worth it.
// The webhook forward in each route still runs independently of this.

const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export interface GhlLead {
  /** Full name as typed; split into first/last for the contact record. */
  name: string;
  email: string;
  phone: string;
  /** Business name → GHL companyName. */
  business?: string;
  /** Their website, when the form collects a real one. */
  website?: string;
  /** Contact source shown in GHL, e.g. "Free AI Website + Teardown LP". */
  source: string;
  /** Tags to apply, e.g. ["inbound", "free-website-build"]. */
  tags: string[];
  /**
   * Google Ads click id. Stored on the contact (when GHL_GCLID_FIELD_ID is
   * set) so booked calls can be imported back into Google Ads as offline
   * conversions — form fills are a proxy; bookings are the truth.
   */
  gclid?: string;
  /**
   * Everything else worth keeping (utm params, pain answer, landing page).
   * Serialised into one custom field when GHL_ATTRIBUTION_FIELD_ID is set.
   */
  attribution?: Record<string, string | undefined>;
  /**
   * Plain-text audit report. Written to the contact when
   * GHL_AUDIT_REPORT_FIELD_ID is set (a multi-line custom field), so the
   * findings are readable as {{contact.website_audit_report}}.
   */
  auditReport?: string;
}

export function isGhlConfigured(): boolean {
  return Boolean(process.env.GHL_PIT && process.env.GHL_LOCATION_ID);
}

/** Upsert the lead as a GHL contact. Never throws. */
export async function upsertGhlContact(lead: GhlLead): Promise<void> {
  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.log("[ghl] skipped (GHL_PIT / GHL_LOCATION_ID not set):", {
      email: lead.email,
      source: lead.source,
    });
    return;
  }

  const nameParts = lead.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || undefined;

  const customFields: { id: string; field_value: string }[] = [];
  const gclidFieldId = process.env.GHL_GCLID_FIELD_ID;
  if (gclidFieldId && lead.gclid) {
    customFields.push({ id: gclidFieldId, field_value: lead.gclid });
  }
  const auditReportFieldId = process.env.GHL_AUDIT_REPORT_FIELD_ID;
  if (auditReportFieldId && lead.auditReport) {
    customFields.push({ id: auditReportFieldId, field_value: lead.auditReport });
  }
  const attributionFieldId = process.env.GHL_ATTRIBUTION_FIELD_ID;
  if (attributionFieldId && lead.attribution) {
    const entries = Object.entries(lead.attribution).filter(
      (pair): pair is [string, string] => Boolean(pair[1]),
    );
    if (entries.length > 0) {
      customFields.push({
        id: attributionFieldId,
        field_value: JSON.stringify(Object.fromEntries(entries)),
      });
    }
  }

  const body = {
    locationId,
    firstName,
    lastName,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.business || undefined,
    website: lead.website || undefined,
    source: lead.source,
    tags: lead.tags,
    ...(customFields.length > 0 ? { customFields } : {}),
  };

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        version: GHL_API_VERSION,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[ghl] contact upsert returned ${res.status}:`,
        detail.slice(0, 500),
      );
    }
  } catch (err) {
    console.error("[ghl] contact upsert failed:", err);
  }
}
