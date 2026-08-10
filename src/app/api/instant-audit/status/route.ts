import { NextResponse } from "next/server";
import { loadAudit } from "@/lib/audit/store";

// Polled by the landing page while the analysis runs. Deliberately returns
// nothing but the phase — the findings themselves stay behind the contact
// gate on /audit/<token>.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const record = await loadAudit(token);
  if (!record) {
    return NextResponse.json({ error: "No such audit." }, { status: 404 });
  }

  const analysis =
    record.status === "failed"
      ? "failed"
      : record.status === "pending"
        ? "running"
        : "done";

  return NextResponse.json({ analysis });
}
