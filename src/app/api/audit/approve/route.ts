import { NextResponse } from "next/server";
import { buildAuditUrl } from "@/lib/audit/run";
import { isReviewer } from "@/lib/audit/reviewAuth";
import { loadAudit, saveAudit } from "@/lib/audit/store";
import { sendAuditEmail } from "@/lib/email/auditEmail";

interface ApprovePayload {
  token?: string;
  key?: string;
}

export async function POST(request: Request) {
  let body: ApprovePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isReviewer(body.key)) {
    return NextResponse.json({ error: "Not authorised." }, { status: 403 });
  }
  if (!body.token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const record = await loadAudit(body.token);
  if (!record) {
    return NextResponse.json({ error: "No such audit." }, { status: 404 });
  }
  if (record.status === "pending") {
    return NextResponse.json(
      { error: "This audit is still generating." },
      { status: 409 },
    );
  }
  if (record.status !== "ready") {
    // Already sent, claimed, or failed. Re-sending would put a second copy in
    // their inbox for no reason, so refuse rather than quietly duplicating.
    return NextResponse.json(
      { error: `This audit is already marked "${record.status}".` },
      { status: 409 },
    );
  }

  try {
    await sendAuditEmail(record, buildAuditUrl(record.token));
  } catch (err) {
    console.error("[audit] send failed for", record.token, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not send the email." },
      { status: 502 },
    );
  }

  // Only flip to "sent" once Resend has accepted it — otherwise a failed send
  // leaves a record claiming the lead was emailed when they weren't.
  await saveAudit({
    ...record,
    status: "sent",
    sentAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
