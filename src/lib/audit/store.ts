// Persistence for audit records.
//
// Two backends, chosen by env, mirroring how CONTACT_WEBHOOK_URL degrades in
// src/app/api/contact/route.ts: Vercel Blob in production, a local directory in
// dev so the funnel runs end-to-end with no cloud setup.
//
// Records live at a 256-bit random path. That is a capability URL, not access
// control — anyone holding the token can read the record, which is why the
// record carries only what the audit page and the email actually need.

import { head, put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditLead, AuditRecord } from "./types";

const PREFIX = "audits";
const LOCAL_DIR = path.join(process.cwd(), ".audit-store");

/** 32 bytes of entropy, URL-safe. The audit link's only protection. */
export function newAuditToken(): string {
  return randomBytes(32).toString("base64url");
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function pathnameFor(token: string): string {
  return `${PREFIX}/${token}.json`;
}

function leadPathnameFor(token: string): string {
  return `${PREFIX}/${token}.lead.json`;
}

/**
 * The contact details captured at the reveal gate, stored in their own file.
 *
 * Blob overwrites can serve stale reads for up to a minute, which makes
 * read-modify-write on the main record a lost-update machine: the analysis
 * finishing and the contact arriving both happen inside that window, and
 * whichever writes second can resurrect a version without the other's data —
 * which is how leads were vanishing from finished reports. Splitting the
 * writers means the analysis owns the main record, the gate owns this file,
 * and nothing ever overwrites anyone else's write. `loadAudit` merges the two.
 */
export type AuditLeadOverlay = Pick<
  AuditLead,
  "name" | "business" | "email" | "phone"
>;

export async function saveAudit(record: AuditRecord): Promise<void> {
  const body = JSON.stringify(record, null, 2);

  if (!blobConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[audit] BLOB_READ_WRITE_TOKEN is unset in production — the audit for",
        record.token,
        "cannot be persisted and its link will 404.",
      );
    }
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, `${record.token}.json`), body, "utf8");
    return;
  }

  await put(pathnameFor(record.token), body, {
    access: "public",
    contentType: "application/json",
    // Deterministic path so status transitions overwrite rather than pile up.
    addRandomSuffix: false,
    allowOverwrite: true,
    // The record changes as it moves pending → ready → sent → claimed, so it
    // must never be served from an edge cache.
    cacheControlMaxAge: 0,
  });
}

/** Persist the gate's contact details. Only the contact route calls this. */
export async function saveAuditLead(
  token: string,
  overlay: AuditLeadOverlay,
): Promise<void> {
  const body = JSON.stringify(overlay, null, 2);

  if (!blobConfigured()) {
    await mkdir(LOCAL_DIR, { recursive: true });
    await writeFile(path.join(LOCAL_DIR, `${token}.lead.json`), body, "utf8");
    return;
  }

  await put(leadPathnameFor(token), body, {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function loadAudit(token: string): Promise<AuditRecord | null> {
  if (!isPlausibleToken(token)) return null;

  const [record, overlay] = await Promise.all([
    loadJson<AuditRecord>(pathnameFor(token), `${token}.json`),
    loadJson<AuditLeadOverlay>(leadPathnameFor(token), `${token}.lead.json`),
  ]);
  if (!record) return null;
  if (!overlay) return record;
  return { ...record, lead: { ...record.lead, ...overlay } };
}

async function loadJson<T>(
  blobPathname: string,
  localFilename: string,
): Promise<T | null> {
  if (!blobConfigured()) {
    try {
      const body = await readFile(path.join(LOCAL_DIR, localFilename), "utf8");
      return JSON.parse(body) as T;
    } catch {
      return null;
    }
  }

  try {
    // head() resolves the pathname directly — unlike list(), which is
    // eventually consistent and can miss a blob written moments ago.
    const blob = await head(blobPathname);
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // head() throws BlobNotFoundError when the file doesn't exist — the
    // normal case for overlays on emailed-flow records.
    return null;
  }
}

/**
 * Read-modify-write a record. Racy by nature — two concurrent transitions could
 * clobber each other — but the transitions here (generate → approve → claim)
 * are minutes to days apart and driven by different people, so a lock would be
 * ceremony with no payoff.
 */
export async function updateAudit(
  token: string,
  mutate: (record: AuditRecord) => AuditRecord,
): Promise<AuditRecord | null> {
  const current = await loadAudit(token);
  if (!current) return null;
  const next = mutate(current);
  await saveAudit(next);
  return next;
}

/** Cheap shape check before touching storage, so junk tokens cost nothing. */
function isPlausibleToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{16,128}$/.test(token);
}
