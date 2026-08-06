// Optional Gemini pass over the audit prose.
//
// Scope is deliberately narrow: the model rewrites the wording of findings that
// findings.ts has already decided on. It cannot add a finding, change a
// severity, or touch a metric — those arrive as fixed inputs and are copied
// straight back out.
//
// Even within that box the output is checked before it is trusted. Any number
// in a rewritten sentence that did not appear in that finding's own metrics or
// template is treated as fabricated, and the template is used instead. A
// previous funnel on this project shipped an invented case study; a model given
// real numbers is perfectly capable of inventing a fourth one to round out a
// sentence, and this is the check that catches it.

import { GoogleGenAI } from "@google/genai";
import type { AuditFinding, AuditNarrative } from "./types";

const MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 25_000;

const SYSTEM_BRIEF = `You are writing the prose for a website audit that a small
business owner in Australia will read after asking us to look at their site.

Voice:
- Warm and peer-to-peer. You are a knowledgeable colleague, not a consultant
  performing expertise.
- Collaborative: "we", "together", "worth a look". Never "you should" or "your
  problem is".
- Australian English (organise, enquiry, optimise, analyse).
- Full sentences with rhythm. One idea per paragraph.
- Never diagnose the reader as having failed. Describe the situation neutrally
  and offer help. "There's no tap-to-call link" — not "you've neglected mobile".

Never use: revolutionary, leverage, unlock, transform, next-gen, world-class,
cutting-edge, supercharge, 10x, game-changer, synergy, ecosystem, "AI-powered"
as a value claim. No emoji. No exclamation marks. No rhetorical questions.

Absolute rule: you may only reference numbers and facts that appear in the
metrics or the draft you are given. Do not add statistics, percentages,
benchmarks, industry averages, dollar figures or client examples of your own,
however plausible. If a draft has no number, the rewrite has no number.`;

interface RewrittenFinding {
  id: string;
  headline: string;
  body: string;
}

/**
 * Rewrite the narrative's prose. Returns the input unchanged when Gemini is
 * unconfigured, fails, or returns anything that doesn't survive the checks —
 * the template prose is good enough to send, so there is never a reason to
 * block on this.
 */
export async function narrate(narrative: AuditNarrative): Promise<AuditNarrative> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return narrative;

  // Unmeasured findings have fixed wording by design — nothing to rewrite.
  const rewritable = narrative.findings.filter((f) => f.severity !== "unmeasured");
  if (rewritable.length === 0) return narrative;

  let rewrites: RewrittenFinding[];
  try {
    rewrites = await requestRewrites(apiKey, rewritable);
  } catch (err) {
    console.error("[audit] narration failed, keeping template prose:", err);
    return narrative;
  }

  const byId = new Map(rewrites.map((r) => [r.id, r]));
  let anyApplied = false;

  const findings = narrative.findings.map((finding) => {
    const rewrite = byId.get(finding.id);
    if (!rewrite) return finding;
    if (!isFaithful(rewrite, finding)) {
      console.warn(
        `[audit] narration for "${finding.id}" introduced unsupported numbers — keeping template.`,
      );
      return finding;
    }
    anyApplied = true;
    // Severity and metrics are never taken from the model.
    return { ...finding, headline: rewrite.headline, body: rewrite.body };
  });

  const worst = findings.find((f) => f.severity === "critical");

  return {
    ...narrative,
    findings,
    headline: worst ? worst.headline : narrative.headline,
    narrated: anyApplied,
  };
}

async function requestRewrites(
  apiKey: string,
  findings: AuditFinding[],
): Promise<RewrittenFinding[]> {
  const ai = new GoogleGenAI({ apiKey });

  const payload = findings.map((f) => ({
    id: f.id,
    section: f.title,
    severity: f.severity,
    metrics: f.metrics,
    draftHeadline: f.headline,
    draftBody: f.body,
  }));

  const response = await withTimeout(
    ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                `${SYSTEM_BRIEF}\n\n` +
                "Rewrite the headline and body of each finding below. Keep the same meaning, the " +
                "same numbers and the same severity of tone. Return one entry per finding, using " +
                "the same id.\n\nA headline is one sentence. A body is two to four sentences.\n\n" +
                JSON.stringify(payload, null, 2),
            },
          ],
        },
      ],
      config: {
        temperature: 0.4,
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              headline: { type: "string" },
              body: { type: "string" },
            },
            required: ["id", "headline", "body"],
          },
        },
      },
    }),
    TIMEOUT_MS,
  );

  const text = response.text;
  if (!text) throw new Error("Gemini returned no text.");

  const parsed: unknown = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("Gemini returned a non-array.");

  return parsed.filter(
    (entry): entry is RewrittenFinding =>
      Boolean(entry) &&
      typeof (entry as RewrittenFinding).id === "string" &&
      typeof (entry as RewrittenFinding).headline === "string" &&
      typeof (entry as RewrittenFinding).body === "string",
  );
}

/**
 * A rewrite is faithful when every number it uses was already available to it.
 * Numbers are compared numerically, so "4.0" and "4" are the same value.
 */
function isFaithful(rewrite: RewrittenFinding, finding: AuditFinding): boolean {
  const allowed = new Set(
    numbersIn(
      [
        finding.headline,
        finding.body,
        ...finding.metrics.map((m) => `${m.label} ${m.value}`),
      ].join(" "),
    ),
  );

  const used = numbersIn(`${rewrite.headline} ${rewrite.body}`);
  return used.every((value) => allowed.has(value));
}

function numbersIn(text: string): number[] {
  return (text.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timed out.")), ms),
    ),
  ]);
}
