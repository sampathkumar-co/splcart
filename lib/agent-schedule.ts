/**
 * Owner-opted-in India-local daily no-key evidence review.
 * No external browsing, marketing publication, messages or calling.
 */
import {randomUUID} from "node:crypto";
import {db} from "./prisma";
import {loadLocalContext} from "./agent-context";
import {ROLE_SPECS} from "./agent-roster";
import {evaluateLocalRole} from "./local-agents";
import {summarizeReadiness} from "./agent-readiness";
import {indiaBusinessDate} from "./creative-schedule";

export const AGENT_SCHEDULE_ID="hq-local-readiness";
export const AGENT_LOCAL_TIME="08:30";

export function indiaBusinessClock(now=new Date()){
 const parts=new Intl.DateTimeFormat("en-GB",{
  timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hourCycle:"h23",
 }).formatToParts(now);
 return (parts.find(p=>p.type==="hour")?.value||"00")+":"+
   (parts.find(p=>p.type==="minute")?.value||"00");
}
export function agentReportsDue(now=new Date()){
 return indiaBusinessClock(now)>=AGENT_LOCAL_TIME;
}
export async function scheduleDailyLocalReports(now=new Date()){
 const day=indiaBusinessDate(now);
 if(!agentReportsDue(now))return {status:"NOT_DUE" as const,day,created:0};
 // Avoid opening six evidence queries on every disabled five-minute poll.
 const prior=await db.agentSchedule.findUnique({where:{id:AGENT_SCHEDULE_ID}});
 if(!prior?.enabled)return {status:"DISABLED" as const,day,created:0};
 if(prior.lastRunDate===day)return {status:"ALREADY_RECORDED" as const,day,created:0};
 // Snapshot may age briefly before the TX lock. This is an honest captured
 // source-based report, never automatic contact/publishing/verified payment.
 const context=await loadLocalContext(now);
 const reports=ROLE_SPECS.map(r=>evaluateLocalRole(r.id,context));
 const summary=summarizeReadiness(reports);
 return db.$transaction(async tx=>{
  await tx.$queryRaw`SELECT 1::int AS locked FROM pg_advisory_xact_lock(23901, 31)`;
  const config=await tx.agentSchedule.findUnique({where:{id:AGENT_SCHEDULE_ID}});
  if(!config?.enabled)return {status:"DISABLED" as const,day,created:0};
  if(config.lastRunDate===day)return {status:"ALREADY_RECORDED" as const,day,created:0};
  const batchId=randomUUID();
  const finishedAt=new Date();
  for(const report of reports){
   await tx.agentTask.create({data:{
    roleId:report.roleId,
    action:"LOCAL_DAILY_READINESS_"+day+"_"+batchId,
    status:report.status,
    resultJson:{summary:report.summary,items:report.items,
      computeCost:report.computeCost,provenance:"HQ_OWNER_RECORDS",day},
    errorCode:report.errorCode,
    sourceUrls:report.evidenceUrls,
    modelCostPaise:0,
    finishedAt,
   }});
  }
  await tx.agentSchedule.update({
   where:{id:AGENT_SCHEDULE_ID},data:{lastRunDate:day},
  });
  await tx.systemAudit.create({data:{
   actor:"HQ_LOCAL_READINESS_WORKER",
   event:"DAILY_LOCAL_ROLE_BRIEFING_RECORDED",
   reason:"Daily internal evidence "+day+": "+summary.completed+
    " local reports; "+summary.blocked+
    " role blockers; no external actions or paid model calls.",
  }});
  return {status:"RECORDED" as const,day,created:reports.length,
    completed:summary.completed,blocked:summary.blocked,batchId};
 },{maxWait:15000,timeout:30000});
}
