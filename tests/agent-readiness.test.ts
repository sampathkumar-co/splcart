import {describe,expect,it} from "vitest";
import {summarizeReadiness} from "../lib/agent-readiness";
import type {LocalAgentReport} from "../lib/local-agents";
function report(roleId:string,status:"COMPLETED"|"BLOCKED"):LocalAgentReport{
 return {roleId,status,summary:roleId+" source check",
   items:[],evidenceUrls:[],errorCode:status==="BLOCKED"?"NO_CONSENT":null,
   modelCostPaise:0,computeCost:"NOT_METERED"};
}
describe("truthful owner-triggered local readiness batch",()=>{
 it("does not mistake a blocked phone/Instagram role for a completed agent",()=>{
  const result=summarizeReadiness([report("general-manager","COMPLETED"),
    report("wholesale-calling","BLOCKED"),report("instagram-discovery","BLOCKED")]);
  expect(result).toMatchObject({total:3,completed:1,blocked:2,
    paidModelCostPaise:0,computeCost:"NOT_METERED",externalActionsPerformed:0});
  expect(result.blockedRoles.map(x=>x.roleId)).toEqual(["wholesale-calling","instagram-discovery"]);
 });
 it("reports no invented activity when every role is blocked",()=>{
  expect(summarizeReadiness([report("customer-conversation","BLOCKED")]))
    .toMatchObject({completed:0,blocked:1,externalActionsPerformed:0});
 });
});
