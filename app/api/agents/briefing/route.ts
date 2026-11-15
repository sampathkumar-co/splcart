import {randomUUID} from "node:crypto";
import {db} from "@/lib/prisma";
import {loadLocalContext} from "@/lib/agent-context";
import {ROLE_SPECS} from "@/lib/agent-roster";
import {evaluateLocalRole} from "@/lib/local-agents";
import {summarizeReadiness} from "@/lib/agent-readiness";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
import {apiError} from "@/lib/validation";
export const runtime="nodejs";
export const dynamic="force-dynamic";

/**
 * Owner-triggered 16-role evidence sweep, not a 16-model autonomous worker.
 * No external account, browser, social platform, microphone, phone or paid API call.
 * A completed report means a completed local analysis only.
 */
export async function POST(){
 try{
  const limit=await consumeRateLimit("owner-16-role-readiness",6,86400_000);
  if(!limit.allowed)return throttled(limit.retryAfterSeconds);
  const context=await loadLocalContext();
  const reports=ROLE_SPECS.map(role=>evaluateLocalRole(role.id,context));
  const summary=summarizeReadiness(reports);
  const batchId=randomUUID();
  const finishedAt=new Date();
  await db.$transaction(async tx=>{
    for(const report of reports){
      await tx.agentTask.create({data:{
        roleId:report.roleId,
        action:"OWNER_READINESS_BATCH_"+batchId,
        status:report.status,
        resultJson:{summary:report.summary,items:report.items,computeCost:report.computeCost},
        errorCode:report.errorCode,
        sourceUrls:report.evidenceUrls,
        modelCostPaise:0,
        finishedAt,
      }});
    }
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"SIXTEEN_ROLE_READINESS_ASSESSED",
      reason:"Read-only batch "+batchId+": "+summary.completed+" local reports; "+
        summary.blocked+" explicit blockers; no external actions, paid calls or confirmed sales.",
    }});
  },{maxWait:12000,timeout:30000});
  return Response.json({batchId,...summary,
    reports:reports.map(r=>({roleId:r.roleId,status:r.status,errorCode:r.errorCode,
      summary:r.summary,evidenceUrls:r.evidenceUrls,modelCostPaise:r.modelCostPaise})),
    message:"All sixteen local readiness checks were persisted. Blocked means NOT operational. No external outreach or publishing."},
    {headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
