// Persistence for audit records.
//
// Two backends, chosen by env, mirroring how CONTACT_WEBHOOK_URL degrades in
// src/app/api/contact/route.ts: Vercel Blob in production, a local directory in
// dev so the funnel runs end-to-end with no cloud setup.
//
// Records live at a 256-bit random path. That is a capability URL, not access
// control — anyone holding the token can read the record, which is why the
// record carries only what the audit page and the email actually need.

import { list, put } from "@vercel/blob";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AuditRecord } from "./types";

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

export async function loadAudit(token: string): Promise<AuditRecord | null> {
  if (!isPlausibleToken(token)) return null;

  if (!blobConfigured()) {
    try {
      const body = await readFile(
        path.join(LOCAL_DIR, `${token}.json`),
        "utf8",
      );
      return JSON.parse(body) as AuditRecord;
    } catch {
      return null;
    }
  }

  try {
    const { blobs } = await list({ prefix: pathnameFor(token), limit: 1 });
    const blob = blobs[0];
    if (!blob) return null;
    const res = await fetch(blob.url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AuditRecord;
  } catch (err) {
    console.error("[audit] failed to load", token, err);
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
