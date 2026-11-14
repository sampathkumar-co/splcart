import createRobotsParser from "robots-parser";

export const HQ_RESEARCH_UA_TOKEN = "PrasanthHQResearch";
export const HQ_RESEARCH_USER_AGENT = "PrasanthHQResearch/1.0 (owner-requested jewellery research; no bulk crawling)";

export type RobotsDecision = { robotsStatus: number; crawlDelayMs: number; checkedUrls: number };
/**
 * Fail closed on denied/unreachable robots policy. This is a technical access
 * rule, not a substitute for permission under the site's terms or law.
 *
 * RFC 9309 404/410 indicate absent robots policy; 403/429/5xx block research
 * rather than assuming access. robots-parser 3.0.1 is MIT licensed.
 */
export function evaluateSiteRobots(
  origin: string, status: number, rawRobots: string,
  requestedUrls: readonly string[],
): RobotsDecision {
  if (![200, 404, 410].includes(status)) throw new Error("ROBOTS_POLICY_UNAVAILABLE");
  if (status === 404 || status === 410)
    return { robotsStatus: status, crawlDelayMs: 0, checkedUrls: requestedUrls.length };
  if (rawRobots.length > 500_000) throw new Error("ROBOTS_POLICY_TOO_LARGE");
  const fileUrl = new URL("/robots.txt", origin).toString();
  const robots = createRobotsParser(fileUrl, rawRobots);
  for (const url of requestedUrls) {
    if (new URL(url).origin !== new URL(origin).origin)
      throw new Error("RESEARCH_SAME_BUSINESS_ONLY");
    if (robots.isAllowed(url, HQ_RESEARCH_UA_TOKEN) === false)
      throw new Error("ROBOTS_DISALLOWS_REQUESTED_PAGE");
  }
  const delaySeconds = robots.getCrawlDelay(HQ_RESEARCH_UA_TOKEN) || 0;
  if (!Number.isFinite(delaySeconds) || delaySeconds < 0 || delaySeconds > 8)
    throw new Error("ROBOTS_CRAWL_DELAY_EXCEEDS_BOUND");
  return { robotsStatus: status, crawlDelayMs: delaySeconds * 1000,
    checkedUrls: requestedUrls.length };
}
export function permittedProductionHost(host: string, production: boolean, testMode: boolean,
  allowlist: string) {
  if (!production || testMode) return true;
  const set = new Set(allowlist.split(",").map(v=>v.trim().toLowerCase()).filter(Boolean));
  // Exact host allowlisting. Never allow wildcard suffixes or arbitrary owner
  // URL submissions to turn a production browser into an internal proxy.
  return set.has(host.toLowerCase());
}
