import { db } from "@/lib/prisma";
import { fullProspect, serializeProspect } from "@/lib/serialize";
import { apiError } from "@/lib/validation";
import { getAgentRecords } from "@/lib/agent-roster";
import {permittedEvidenceUrl} from "@/lib/workstation-activity";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [prospects, products, runs, control, controlAudit, agentTasks, agentSchedule,
      reelStatuses, openInquiryCount, ownerRecordedPostCount] = await Promise.all([
      db.prospect.findMany({ ...fullProspect, orderBy: { updatedAt: "desc" }, take: 100 }),
      db.product.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      db.researchRun.findMany({ orderBy: { startedAt: "desc" }, take: 30 }),
      db.systemControl.findUnique({ where: { id:"hq" } }),
      db.systemAudit.findMany({ orderBy: { createdAt:"desc" }, take:10 }),
      db.agentTask.findMany({ orderBy: { createdAt:"desc" }, take:60 }),
      db.agentSchedule.findUnique({where:{id:"hq-local-readiness"}}),
      // Status-only aggregates; no images, chat content, media blobs or platform credentials.
      db.reelJob.findMany({select:{id:true,status:true,startedAt:true,createdAt:true,
        titleSnapshot:true,errorCode:true},orderBy:{createdAt:"desc"},take:100}),
      db.customerInquiry.count({where:{status:"OPEN"}}),
      db.socialPublication.count(),
    ]);
    const snapshotNow=new Date();
    const activeRenderJobs=reelStatuses.filter(r=>r.status==="RENDERING"&&r.startedAt&&
      snapshotNow.getTime()>=r.startedAt.getTime()&&
      snapshotNow.getTime()-r.startedAt.getTime()<15*60_000);
    const stalledRenderJobs=reelStatuses.filter(r=>r.status==="RENDERING"&&
      (!r.startedAt||snapshotNow.getTime()-r.startedAt.getTime()>=15*60_000)).length;
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
      control: {
        researchPaused: control?.researchPaused || false,
        reason: control?.reason || "",
        updatedAt: control?.updatedAt?.toISOString() || null,
        audit: controlAudit.map(a=>({id:a.id,event:a.event,reason:a.reason,createdAt:a.createdAt.toISOString()})),
      },
      agents: getAgentRecords(runs,snapshotNow,agentTasks,activeRenderJobs.length>0),
      agentTasks: agentTasks.slice(0,25).map(t=>({
        id:t.id,roleId:t.roleId,status:t.status,errorCode:t.errorCode,
        createdAt:t.createdAt.toISOString(),
        result:t.resultJson,
        sourceUrls:Array.isArray(t.sourceUrls)?
          t.sourceUrls.slice(0,5).map(permittedEvidenceUrl).filter((u):u is string=>!!u):[],
        modelCostPaise:t.modelCostPaise,
      })),
      agentSchedule: {
        enabled:agentSchedule?.enabled??false,lastRunDate:agentSchedule?.lastRunDate??null,
        localTime:"08:30",timeZone:"Asia/Kolkata",
      },
      reelJobs:reelStatuses.slice(0,8).map(r=>({
        id:r.id,status:r.status,createdAt:r.createdAt.toISOString(),
        startedAt:r.startedAt?.toISOString()||null,
        titleSnapshot:r.titleSnapshot,errorCode:r.errorCode,
      })),
      workstationSignals:{
        reels:{
          queued:reelStatuses.filter(r=>r.status==="QUEUED").length,
          rendering:activeRenderJobs.length,
          stalled:stalledRenderJobs,
          rendered:reelStatuses.filter(r=>r.status==="RENDERED").length,
          approved:reelStatuses.filter(r=>r.status==="APPROVED").length,
          failed:reelStatuses.filter(r=>r.status==="FAILED").length,
          scope:"LATEST_100_HQ_JOBS",
        },
        openInquiries:openInquiryCount,
        ownerRecordedPosts:ownerRecordedPostCount,
        leads:{
          awaitingReview:prospects.filter(p=>p.decision==="PENDING").length,
          approved:prospects.filter(p=>p.decision==="APPROVED").length,
        },
        research:{
          running:runs.filter(r=>r.status==="RUNNING"&&
            snapshotNow.getTime()>=r.startedAt.getTime()&&
            snapshotNow.getTime()-r.startedAt.getTime()<90_000).length,
          completed:runs.filter(r=>r.status==="COMPLETED").length,
          blocked:runs.filter(r=>r.status==="BLOCKED"||r.status==="FAILED").length,
          scope:"LATEST_30_HQ_RUNS",
        },
      },
      integrations: { splcart: "EXTERNAL_SHOPPING_REFERENCE_ONLY", browser: "MANUAL_BROWSER_RESEARCH", outreach: "MANUAL_ONLY", quotations: "OWNER_APPROVED_MANUAL_SHARING", revenue: "OWNER_REPORTED_UNVERIFIED" },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) { return apiError(e); }
}
