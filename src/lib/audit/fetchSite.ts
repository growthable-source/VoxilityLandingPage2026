// Fetching a stranger's website, politely.
//
// This runs against sites belonging to people who have asked us to look at
// them, but who have not agreed to be load-tested: one request, a hard timeout,
// a capped read, and an honest user-agent that says who we are. We never submit
// their forms and never follow anything but the page they gave us.

const TIMEOUT_MS = 10_000;
const MAX_BYTES = 2_000_000;
const USER_AGENT =
  "XoveraAuditBot/1.0 (+https://www.xovera.io; website audit requested by the site owner)";

export interface FetchedSite {
  finalUrl: string;
  statusCode: number;
  html: string;
  bytes: number;
}

export class SiteFetchError extends Error {}

/**
 * Turn whatever they typed into a URL. People write "thompsonplumbing.com.au",
 * "www.thompsonplumbing.com.au" and "http://thompsonplumbing.com.au/" in about
 * equal measure. Returns null for input that isn't a website at all — "none",
 * "n/a", a bare business name.
 */
export function normalizeSiteUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^(none|n\/a|na|no|nil|don'?t have one|no website)$/i.test(raw)) {
    return null;
  }

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }

  // A hostname with no dot isn't a domain — it's them typing their trading name.
  if (!url.hostname.includes(".")) return null;
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  return url.toString();
}

export async function fetchSite(url: string): Promise<FetchedSite> {
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-AU,en;q=0.9",
      },
    });
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "TimeoutError"
        ? `didn't respond within ${TIMEOUT_MS / 1000} seconds`
        : "couldn't be reached";
    throw new SiteFetchError(`The site ${reason}.`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (res.ok && contentType && !contentType.includes("html")) {
    throw new SiteFetchError(
      `The URL returned ${contentType.split(";")[0]}, not a web page.`,
    );
  }

  const { text, bytes } = await readCapped(res);

  return {
    finalUrl: res.url || url,
    statusCode: res.status,
    html: text,
    bytes,
  };
}

/**
 * Read the body but stop at MAX_BYTES. Content-Length is a hint, not a promise,
 * so the cap is enforced on the stream itself.
 */
async function readCapped(res: Response): Promise<{ text: string; bytes: number }> {
  if (!res.body) return { text: "", bytes: 0 };

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  try {
    while (bytes < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        bytes += value.byteLength;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }

  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    text: new TextDecoder("utf-8", { fatal: false }).decode(merged),
    bytes,
  };
}
