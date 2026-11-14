/**
 * Bounded owner-triggered real Chromium research, with up to three tabs
 * on ONE independently hosted business website.
 *
 * Browser control is not an exemption from source collection/use policies.
 * This inspector never crawls search engines, social platforms, or site links.
 * Production must additionally isolate Chromium with egress firewall/containers
 * to defeat DNS rebinding at connection time.
 */
import { chromium, type Page } from "playwright";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const FORBIDDEN = /(^|\.)(localhost|local|internal|test|invalid)$/i;
const DENIED_NAMES = new Set(["metadata.google.internal", "metadata", "instance-data"]);
const RESTRICTED_SOURCES = /(^|\.)(google\.(com|co\.in)|instagram\.com|facebook\.com|maps\.google\.com)$/i;
function privateIP(ip: string) {
  if (ip.includes(":")) {
    const s = ip.toLowerCase();
    return s === "::1" || s === "::" || s.startsWith("fe80:") ||
      s.startsWith("fc") || s.startsWith("fd") || s.startsWith("::ffff:");
  }
  const p = ip.split(".").map(Number);
  return p[0] === 0 || p[0] === 10 || p[0] === 127 || p[0] >= 224 ||
    (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) ||
    (p[0] === 192 && p[1] === 168) ||
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) ||
    (p[0] === 192 && p[1] === 0 && p[2] === 0) ||
    (p[0] === 198 && [18, 19].includes(p[1]));
}
export async function assertPublicUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443"))
    throw new Error("HTTPS_PUBLIC_ONLY");
  const host = url.hostname.toLowerCase();
  if (FORBIDDEN.test(host) || DENIED_NAMES.has(host) || isIP(host))
    throw new Error("PRIVATE_HOST_BLOCKED");
  if (RESTRICTED_SOURCES.test(host)) throw new Error("SOURCE_POLICY_REVIEW_REQUIRED");
  const addresses = await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(a => privateIP(a.address)))
    throw new Error("PRIVATE_IP_BLOCKED");
  return url.toString();
}
export type BrowserEvidence = {
  sourceUrl: string; finalUrl: string; title: string; description: string;
  headings: string[]; businessLinks: {title:string;url:string}[];
  excerpt: string; capturedAt: string;
};
export type BrowserTab = { sourceUrl: string; status: "COMPLETED" | "FAILED"; evidence?: BrowserEvidence; errorCode?: string };
export type BrowserSessionEvidence = { provider: "PLAYWRIGHT"; tabs: BrowserTab[]; completed: number; failed: number; capturedAt: string };

async function extractPage(page: Page, url: string): Promise<BrowserEvidence> {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 18000 });
  if (!response || !response.ok()) throw new Error("PAGE_HTTP_" + (response?.status() ?? "NO_RESPONSE"));
  const finalUrl = await assertPublicUrl(page.url());
  const snapshot = await page.evaluate(() => ({
    title: document.title.slice(0, 200),
    description: (document.querySelector('meta[name="description"]')?.getAttribute("content") || "").slice(0, 450),
    headings: Array.from(document.querySelectorAll("h1,h2,h3")).slice(0, 18)
      .map(x => x.textContent?.trim().slice(0, 180) || "").filter(Boolean),
    businessLinks: Array.from(document.querySelectorAll("a[href]")).slice(0, 100)
      .map(a => ({ title: (a.textContent || "Link").trim().slice(0, 90), url: (a as HTMLAnchorElement).href }))
      .filter(a => a.url.startsWith("https://")).slice(0, 18),
    excerpt: (document.querySelector("main")?.textContent || document.body.textContent || "")
      .replace(/\s+/g, " ").trim().slice(0, 1800),
  }));
  return { sourceUrl: url, finalUrl, ...snapshot, capturedAt: new Date().toISOString() };
}
export async function inspectPublicTabs(rawUrls: string[]): Promise<BrowserSessionEvidence> {
  if (rawUrls.length < 1 || rawUrls.length > 3) throw new Error("INVALID_TAB_COUNT");
  const urls = await Promise.all(rawUrls.map(assertPublicUrl));
  const base = new URL(urls[0]).hostname.replace(/^www\./, "");
  if (urls.some(u => new URL(u).hostname.replace(/^www\./, "") !== base))
    throw new Error("RESEARCH_SAME_BUSINESS_ONLY");
  if (new Set(urls).size !== urls.length) throw new Error("INVALID_DUPLICATE_TAB");
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({
      locale: "en-IN", javaScriptEnabled: false,
      acceptDownloads: false, serviceWorkers: "block",
    });
    await context.route("**/*", async route => {
      try {
        await assertPublicUrl(route.request().url());
        if (["image", "font", "media", "stylesheet"].includes(route.request().resourceType()))
          return await route.abort();
        return await route.continue();
      } catch { return await route.abort(); }
    });
    // One Chromium session, multiple real browser tabs, each independently reported.
    const results = await Promise.all(urls.map(async url => {
      const page = await context.newPage();
      try {
        const evidence = await extractPage(page, url);
        return { sourceUrl: url, status: "COMPLETED" as const, evidence };
      } catch (e) {
        return { sourceUrl: url, status: "FAILED" as const,
          errorCode: e instanceof Error ? e.message.slice(0, 100) : "BROWSER_ERROR" };
      } finally {
        await page.close();
      }
    }));
    await context.close();
    return { provider: "PLAYWRIGHT", tabs: results,
      completed: results.filter(r=>r.status==="COMPLETED").length,
      failed: results.filter(r=>r.status==="FAILED").length,
      capturedAt: new Date().toISOString() };
  } finally { await browser.close(); }
}
/** Backward-compatible single-tab interface. */
export async function inspectPublicPage(raw: string): Promise<BrowserEvidence> {
  const run = await inspectPublicTabs([raw]);
  if (run.tabs[0].status !== "COMPLETED" || !run.tabs[0].evidence)
    throw new Error(run.tabs[0].errorCode || "BROWSER_ERROR");
  return run.tabs[0].evidence;
}
