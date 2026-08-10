// Gemini looks at the rendered screenshot and writes the design review.
//
// This is the one deliberately subjective section of the audit, and it is kept
// honest differently from the findings: the screenshot it describes is shown
// right beside the commentary, so the reader can check every observation
// against the image; the prose is not allowed to contain numbers at all (a
// design opinion needs none, and this closes the fabricated-statistic door
// that narrate.ts guards with allow-lists); and the palette is a list of hex
// swatches rendered next to the image they came from.
//
// Fail-soft throughout: no screenshot, no key, a timeout, or output that
// breaks the rules simply means the report ships without a design section.

import { GoogleGenAI } from "@google/genai";
import type { DesignReview } from "./types";

const MODEL = "gemini-2.5-flash";
const TIMEOUT_MS = 20_000;
const MAX_POINTS = 4;
const MAX_PALETTE = 5;

const BRIEF = `You are reviewing the design of a small Australian business's
website from a mobile screenshot, for a report the owner will read.

Voice:
- Warm and peer-to-peer. A knowledgeable colleague, not a critic scoring them.
- Collaborative: "we", "worth a look", "tends to". Never "you should" or "your
  problem is". Describe the situation neutrally and offer help.
- Australian English (colour, organise, enquiry).
- Acknowledge what works before what doesn't, when something does work.

Cover, in three or four short observations: the overall visual impression and
whether it feels current or dated; the colour choices and how they work
together; visual hierarchy (what the eye lands on first, whether the main
action stands out); and anything about imagery, typography or trust signals
worth mentioning.

Rules:
- Only describe what is visibly in the screenshot. If something is ambiguous,
  leave it out.
- No numbers of any kind in the prose — no percentages, no counts, no years.
- Never use: revolutionary, leverage, unlock, transform, next-gen, world-class,
  cutting-edge, supercharge, game-changer, synergy, ecosystem. No emoji. No
  exclamation marks. No rhetorical questions.
- The palette is the dominant colours actually visible in the screenshot, as
  hex values, most prominent first.`;

export async function reviewDesign(
  screenshotDataUri: string,
): Promise<DesignReview | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const image = parseDataUri(screenshotDataUri);
  if (!image) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { text: BRIEF },
              { inlineData: { mimeType: image.mimeType, data: image.base64 } },
            ],
          },
        ],
        config: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              headline: { type: "string" },
              points: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    body: { type: "string" },
                  },
                  required: ["title", "body"],
                },
              },
              palette: { type: "array", items: { type: "string" } },
            },
            required: ["headline", "points", "palette"],
          },
        },
      }),
      TIMEOUT_MS,
    );

    const text = response.text;
    if (!text) return null;
    return sanitize(JSON.parse(text) as DesignReview);
  } catch (err) {
    console.error("[audit] design review failed, shipping without it:", err);
    return null;
  }
}

/** Enforce the rules the prompt asks for, rather than trusting that it did. */
function sanitize(raw: DesignReview): DesignReview | null {
  if (typeof raw?.headline !== "string" || !Array.isArray(raw.points)) {
    return null;
  }

  const numberFree = (s: string) => !/\d/.test(s);

  const headline = raw.headline.trim();
  if (!headline || !numberFree(headline)) return null;

  const points = raw.points
    .filter(
      (p): p is { title: string; body: string } =>
        Boolean(p) && typeof p.title === "string" && typeof p.body === "string",
    )
    .map((p) => ({ title: p.title.trim(), body: p.body.trim() }))
    .filter((p) => p.title && p.body && numberFree(p.title) && numberFree(p.body))
    .slice(0, MAX_POINTS);
  if (points.length === 0) return null;

  const palette = (Array.isArray(raw.palette) ? raw.palette : [])
    .filter((c): c is string => typeof c === "string")
    .map((c) => c.trim().toLowerCase())
    .filter((c) => /^#[0-9a-f]{6}$/.test(c))
    .slice(0, MAX_PALETTE);

  return { headline, points, palette };
}

function parseDataUri(
  uri: string,
): { mimeType: string; base64: string } | null {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(uri);
  return match ? { mimeType: match[1], base64: match[2] } : null;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timed out.")), ms),
    ),
  ]);
}
