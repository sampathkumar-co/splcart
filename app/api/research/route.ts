import { db } from "@/lib/prisma";
import { inspectPublicPage } from "@/lib/browser";
import { apiError, researchInput } from "@/lib/validation";
export const runtime = "nodejs";
export const maxDuration = 60;
/** Exactly one website, explicitly requested by owner. No crawling, contact extraction, or Google Maps scraping. */
export async function POST(req: Request) {
  try {
    const input = researchInput.parse(await req.json());
    const active = await db.researchRun.count({ where: { status: "RUNNING", startedAt: { gt: new Date(Date.now() - 90_000) } } });
    if (active > 0) return Response.json({ error: "RESEARCH_ALREADY_RUNNING" }, { status: 409 });
    const run = await db.researchRun.create({ data: { sourceUrl: input.url, provider: "PLAYWRIGHT", status: "RUNNING" } });
    try {
      const finding = await inspectPublicPage(input.url);
      await db.researchRun.update({ where: { id: run.id }, data: { status: "COMPLETED", finalUrl: finding.finalUrl,
        pageTitle: finding.title, excerpt: finding.excerpt, evidenceJson: JSON.parse(JSON.stringify(finding)), finishedAt: new Date() } });
      return Response.json({ id: run.id, status: "COMPLETED", finding }, { status: 201 });
    } catch (e) {
      const code = e instanceof Error ? e.message.slice(0, 100) : "BROWSER_ERROR";
      await db.researchRun.update({ where: { id: run.id }, data: { status: "FAILED", errorCode: code, finishedAt: new Date() } });
      return Response.json({ id: run.id, status: "FAILED", error: code }, { status: 422 });
    }
  } catch (e) { return apiError(e); }
}
