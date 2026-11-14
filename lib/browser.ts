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
import { evaluateSiteRobots, permittedProductionHost, HQ_RESEARCH_USER_AGENT, type RobotsDecision } from "./source-policy";

const FORBIDDEN = /(^|\.)(localhost|local|internal|test|invalid)$/i;
const DENIED_NAMES = new Set(["metadata.google.internal", "metadata", "instance-data"]);
const RESTRICTED_SOURCES = /(^|\.)(google\.(com|co\.in)|instagram\.com|facebook\.com|maps\.google\.com|splcart\.in)$/i;
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
export type BrowserSessionEvidence = { provider: "PLAYWRIGHT"; tabs: BrowserTab[]; completed: number; failed: number; capturedAt: string; sourcePolicy: RobotsDecision };

async function extractPage(page: Page, url: string): Promise<BrowserEvidence> {
  const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 18000 });
  if (!response || !response.ok()) throw new Error("PAGE_HTTP_" + (response?.status() ?? "NO_RESPONSE"));
  const finalUrl = await assertPublicUrl(page.url());
  if(new URL(finalUrl).hostname.replace(/^www\./,"")!==new URL(url).hostname.replace(/^www\./,""))throw new Error("RESEARCH_REDIRECTED_OUTSIDE_BUSINESS");
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
  const realProduction = process.env.NODE_ENV === "production" && process.env.HQ_TEST_MODE !== "1";
  if (!permittedProductionHost(base, realProduction, false, process.env.HQ_ALLOWED_RESEARCH_HOSTS || ""))
    throw new Error("RESEARCH_HOST_NOT_ALLOWLISTED");
  // Real production browser execution must happen in the isolated worker.
  if (realProduction && process.env.HQ_BROWSER_WORKER_PROCESS !== "1")
    throw new Error("RESEARCH_ISOLATED_WORKER_REQUIRED");
  const browser = await chromium.launch({ headless: true,
    args: process.env.HQ_TEST_MODE === "1" ? ["--no-sandbox"] : [] });
  try {
    const context = await browser.newContext({
      locale: "en-IN", userAgent: HQ_RESEARCH_USER_AGENT, javaScriptEnabled: false,
      acceptDownloads: false, serviceWorkers: "block",
    });
    await context.route("**/*", async route => {
      try {
        const resourceUrl=await assertPublicUrl(route.request().url());
        if(new URL(resourceUrl).hostname.replace(/^www\./,"")!==base)return await route.abort();
        if (["image", "font", "media", "stylesheet"].includes(route.request().resourceType()))
          return await route.abort();
        return await route.continue();
      } catch { return await route.abort(); }
    });
    // Check the site's live robots policy using the same bounded browser route.
    const robotsUrl = "https://" + new URL(urls[0]).hostname + "/robots.txt";
    const robotsPage = await context.newPage();
    let status = 0, robotsText = "";
    try {
      const response = await robotsPage.goto(robotsUrl, {waitUntil:"domcontentloaded",timeout:12_000});
      status = response?.status() || 0;
      if (status === 200) {
        const length = Number(response?.headers()["content-length"] || "0");
        if (length > 500_000) throw new Error("ROBOTS_POLICY_TOO_LARGE");
        robotsText = await response!.text();
      }
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("ROBOTS_POLICY_TOO_LARGE")) throw e;
      throw new Error("ROBOTS_POLICY_UNAVAILABLE");
    } finally { await robotsPage.close(); }
    const sourcePolicy = evaluateSiteRobots(new URL(urls[0]).origin,status,robotsText,urls);

    // One Chromium session, three genuine open tabs; visit them sequentially
    // to honor crawl delay and avoid accidental burst traffic to a retailer.
    const pages = await Promise.all(urls.map(()=>context.newPage()));
    const results: BrowserTab[] = [];
    for (const [index,url] of urls.entries()) {
      if (index > 0 && sourcePolicy.crawlDelayMs > 0)
        await new Promise(resolve=>setTimeout(resolve,sourcePolicy.crawlDelayMs));
      const page = pages[index];
      try {
        const evidence = await extractPage(page, url);
        results.push({ sourceUrl: url, status: "COMPLETED", evidence });
      } catch (e) {
        results.push({ sourceUrl: url, status: "FAILED",
          errorCode: e instanceof Error ? e.message.slice(0, 100) : "BROWSER_ERROR" });
      } finally { await page.close(); }
    }
    await context.close();
    return { provider: "PLAYWRIGHT", tabs: results, sourcePolicy,
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
