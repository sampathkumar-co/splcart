/**
 * Read-only, deterministic organizational readiness assessment.
 * None of these reports invoke external AI, social, telephony or browser tools.
 * BLOCKED means the role lacks real evidence/permission, never "success".
 */
import type {LocalAgentReport} from "./local-agents";
export function summarizeReadiness(reports:readonly LocalAgentReport[]){
 const completed=reports.filter(r=>r.status==="COMPLETED").length;
 const blocked=reports.filter(r=>r.status==="BLOCKED").length;
 return {total:reports.length,completed,blocked,
  blockedRoles:reports.filter(r=>r.status==="BLOCKED")
    .map(r=>({roleId:r.roleId,errorCode:r.errorCode,reason:r.summary})),
  paidModelCostPaise:reports.reduce((sum,r)=>sum+r.modelCostPaise,0),
  computeCost:"NOT_METERED" as const,
  externalActionsPerformed:0,
 };
}
