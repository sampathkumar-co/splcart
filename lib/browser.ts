/** One owner-triggered public-page inspection via real Chromium, never an unattended scraper. */
import { chromium } from "playwright";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const FORBIDDEN = /(^|\.)(localhost|local|internal|test|invalid)$/i;
const DENIED_NAMES = new Set(["metadata.google.internal", "metadata", "instance-data"]);
function privateIP(ip: string) {
  if (ip.includes(":")) {
    const s = ip.toLowerCase();
    return s === "::1" || s === "::" || s.startsWith("fe80:") || s.startsWith("fc") || s.startsWith("fd") || s.startsWith("::ffff:");
  }
  const p = ip.split(".").map(Number);
  return p[0] === 0 || p[0] === 10 || p[0] === 127 || p[0] >= 224 || (p[0] === 169 && p[1] === 254) ||
    (p[0] === 172 && p[1] >= 16 && p[1] <= 31) || (p[0] === 192 && p[1] === 168) ||
    (p[0] === 100 && p[1] >= 64 && p[1] <= 127) || (p[0] === 192 && p[1] === 0 && p[2] === 0) ||
    (p[0] === 198 && [18,19].includes(p[1]));
}
export async function assertPublicUrl(raw: string) {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || url.port && url.port !== "443") throw new Error("HTTPS_PUBLIC_ONLY");
  const host = url.hostname.toLowerCase();
  if (FORBIDDEN.test(host) || DENIED_NAMES.has(host) || isIP(host)) throw new Error("PRIVATE_HOST_BLOCKED");
  const addresses = await lookup(host, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(a => privateIP(a.address))) throw new Error("PRIVATE_IP_BLOCKED");
  return url.toString();
}
export type BrowserEvidence = { sourceUrl: string; finalUrl: string; title: string; description: string; headings: string[]; businessLinks: { title: string; url: string }[]; excerpt: string; capturedAt: string };
export async function inspectPublicPage(raw: string): Promise<BrowserEvidence> {
  const safeUrl = await assertPublicUrl(raw);
  const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
  try {
    const context = await browser.newContext({ locale: "en-IN", javaScriptEnabled: false, acceptDownloads: false, serviceWorkers: "block" });
    await context.route("**/*", async route => {
      const url = route.request().url();
      try {
        // Page/document and on-page resource requests must not reach internal networks.
        await assertPublicUrl(url);
        if (["image", "font", "media", "stylesheet"].includes(route.request().resourceType())) return route.abort();
        await route.continue();
      } catch { await route.abort(); }
    });
    const page = await context.newPage();
    const response = await page.goto(safeUrl, { waitUntil: "domcontentloaded", timeout: 18000 });
    if (!response || !response.ok()) throw new Error(`PAGE_HTTP_${response?.status() ?? "NO_RESPONSE"}`);
    const finalUrl = await assertPublicUrl(page.url());
    const snapshot = await page.evaluate(() => {
      const title = document.title.slice(0, 200);
      const description = (document.querySelector('meta[name="description"]')?.getAttribute("content") || "").slice(0, 450);
      const headings = Array.from(document.querySelectorAll("h1,h2,h3")).slice(0, 18).map(x => x.textContent?.trim().slice(0, 180) || "").filter(Boolean);
      const businessLinks = Array.from(document.querySelectorAll("a[href]")).slice(0, 100).map(a => ({ title: (a.textContent || "Link").trim().slice(0, 90), url: (a as HTMLAnchorElement).href })).filter(a => a.url.startsWith("https://")).slice(0, 18);
      const excerpt = (document.querySelector("main")?.textContent || document.body.textContent || "").replace(/\s+/g, " ").trim().slice(0, 1800);
      return { title, description, headings, businessLinks, excerpt };
    });
    await context.close();
    return { sourceUrl: safeUrl, finalUrl, ...snapshot, capturedAt: new Date().toISOString() };
  } finally { await browser.close(); }
}
