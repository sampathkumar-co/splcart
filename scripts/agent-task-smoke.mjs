/** Real HQ-only PostgreSQL + HTTP task acceptance. Never external API calls. */
import assert from "node:assert/strict";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
import {runAgentScheduleSmoke} from "./agent-schedule-smoke.mjs";
if(process.env.HQ_TEST_MODE!=="1")throw new Error("AGENT_TEST_ONLY_ISOLATED_CI");
const cookie=await authenticateOwner();
async function runRole(roleId){
 const response=await fetch(base+"/api/agents/run",{method:"POST",headers:authHeaders(cookie,true),
   body:JSON.stringify({roleId})});
 const body=await response.json();
 assert.equal(response.status,200,JSON.stringify(body));
 return body;
}
const gm=await runRole("general-manager");
assert.equal(gm.status,"COMPLETED");
assert.equal(gm.report.modelCostPaise,0);
assert.equal(gm.report.computeCost,"NOT_METERED");
const match=await runRole("jewellery-recommendation");
assert.equal(match.status,"COMPLETED");
assert.ok(match.report.evidenceUrls.length>0);
const social=await runRole("social-publishing");
assert.equal(social.status,"COMPLETED","CI approved a real FFmpeg MP4 earlier");
const marketing=await runRole("marketing-performance");
assert.equal(marketing.status,"COMPLETED","CI has one owner-reported fixture, not verified platform analytics");
assert.ok(marketing.report.summary.includes("NOT independently platform-verified"));
const phone=await runRole("wholesale-calling");
assert.equal(phone.status,"BLOCKED");
assert.equal(phone.report.errorCode,"NO_COMPLIANT_PHONE_CHANNEL");
const instagram=await runRole("instagram-discovery");
assert.equal(instagram.status,"BLOCKED");
const briefingResponse=await fetch(base+"/api/agents/briefing",{
 method:"POST",headers:authHeaders(cookie,true),body:"{}",
});
const briefing=await briefingResponse.json();
assert.equal(briefingResponse.status,200,JSON.stringify(briefing));
assert.equal(briefing.total,16);
assert.equal(briefing.reports.length,16);
assert.equal(briefing.completed+briefing.blocked,16);
assert.ok(briefing.blocked>=3,"three missing external connectors cannot become operational");
assert.equal(briefing.externalActionsPerformed,0);
assert.equal(briefing.paidModelCostPaise,0);
assert.equal(briefing.computeCost,"NOT_METERED");
assert.equal(briefing.reports.find(x=>x.roleId==="wholesale-calling").status,"BLOCKED");
assert.equal(briefing.reports.find(x=>x.roleId==="instagram-discovery").status,"BLOCKED");
const batchAudit=(await fetch(base+"/api/dashboard",{headers:authHeaders(cookie)}));
const batchDashboard=await batchAudit.json();
assert.equal(batchDashboard.agentTasks.filter(t=>t.status==="BLOCKED").length>=3,true);
console.log("PASS one-click 16-role persisted readiness batch, real blockers, no network or paid model activity.");
const data=await fetch(base+"/api/dashboard",{headers:authHeaders(cookie)});
assert.equal(data.status,200);
const dashboard=await data.json();
assert.ok(dashboard.agentTasks.find(t=>t.roleId==="general-manager"&&t.status==="COMPLETED"));
assert.equal(dashboard.agents.length,16);
assert.ok(dashboard.agents.find(a=>a.id==="general-manager").evidenceCount>=1);
assert.equal(dashboard.agents.filter(a=>a.status==="RUNNING").length,0);
assert.equal(dashboard.stats.verifiedRevenueRupees,0);
console.log("PASS genuine owner-triggered persistent agent tasks, product sources, approved Reel handoff, explicit phone/Instagram blockers, zero verified revenue and zero paid model calls.");

// Reuse the authenticated CI session so the real 8-attempt owner-login limit stays intact.
await runAgentScheduleSmoke(cookie);
