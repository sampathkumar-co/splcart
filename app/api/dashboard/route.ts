import { db } from "@/lib/prisma";
import { fullProspect, serializeProspect } from "@/lib/serialize";
import { apiError } from "@/lib/validation";
import { getAgentRecords } from "@/lib/agent-roster";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [prospects, products, runs] = await Promise.all([
      db.prospect.findMany({ ...fullProspect, orderBy: { updatedAt: "desc" }, take: 100 }),
      db.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      db.researchRun.findMany({ orderBy: { startedAt: "desc" }, take: 30 }),
    ]);
    const verifiedRevenue = prospects.filter(p => p.conversion?.verifiedAt).reduce((sum, p) => sum + (p.conversion?.grossAmountPaise || 0), 0);
    return Response.json({
      stats: { researched: prospects.length, qualified: prospects.filter(p => p.stage === "QUALIFIED" || p.stage === "APPROVED").length,
        awaitingReview: prospects.filter(p => p.decision === "PENDING").length, approved: prospects.filter(p => p.decision === "APPROVED").length,
        interested: prospects.filter(p => ["INTERESTED", "QUOTATION", "NEGOTIATION"].includes(p.stage)).length,
        ownerReportedOrders: prospects.filter(p => p.conversion && !p.conversion.verifiedAt).length,
        verifiedRevenueRupees: verifiedRevenue / 100 },
      prospects: prospects.map(serializeProspect),
      products: products.map(p => ({ id: p.id, splcartProductId: p.splcartProductId, title: p.title, category: p.category, material: p.material,
        priceRupees: p.pricePaise / 100, unitDescription: p.unitDescription, productUrl: p.productUrl, verificationSource: p.verificationSource })),
      runs: runs.map(r => ({ id: r.id, sourceUrl: r.sourceUrl, finalUrl: r.finalUrl, pageTitle: r.pageTitle, excerpt: r.excerpt,
        status: r.status, errorCode: r.errorCode, startedAt: r.startedAt.toISOString(), finishedAt: r.finishedAt?.toISOString() || null,
        evidence: r.evidenceJson })),
      agents: getAgentRecords(runs),
      integrations: { splcart: "CONTRACT_NOT_VERIFIED", browser: "MANUAL_BROWSER_RESEARCH", outreach: "MANUAL_ONLY", revenue: "OWNER_REPORTED_UNTIL_RECONCILED" },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) { return apiError(e); }
}
