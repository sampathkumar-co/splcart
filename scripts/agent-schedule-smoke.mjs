/**
 * CI-only real PostgreSQL and HTTP: opt in, concurrent dedupe, BLOCKED roles,
 * opt out; no external model calls, messaging, publication or browser actions.
 */
import assert from "node:assert/strict";
import {promisify} from "node:util";
import {execFile} from "node:child_process";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1"||
 process.env.DATABASE_URL!=="postgresql://hq:hq@localhost:5432/hq?schema=public")
 throw new Error("CI_ONLY_LOCAL_AGENTS_TEST");
const exec=promisify(execFile);
const cookie=await authenticateOwner();
async function request(path,body){
 const response=await fetch(base+path,{
  ...(body?{method:"POST",headers:authHeaders(cookie,true),body:JSON.stringify(body)}:
   {headers:authHeaders(cookie)}),
 });
 return {status:response.status,data:await response.json()};
}
const before=await request("/api/dashboard");
assert.equal(before.status,200);
assert.equal(before.data.agentSchedule.enabled,false,"daily schedule disabled by default");
const enabled=await request("/api/agents/schedule",{enabled:true});
assert.equal(enabled.status,200,JSON.stringify(enabled.data));
assert.equal(enabled.data.enabled,true);
const commands=await Promise.all(Array.from({length:3},()=>
 exec("npm",["run","agents:worker","--","--ci-at-due"],
  {env:process.env,encoding:"utf8",timeout:75_000})));
const results=commands.map(out=>{
 const line=out.stdout.split("\n").find(x=>x.startsWith("HQ_LOCAL_AGENT_SCHEDULE "));
 assert.ok(line,"Worker output missing: "+out.stdout);
 return JSON.parse(line.slice("HQ_LOCAL_AGENT_SCHEDULE ".length));
});
assert.equal(results.filter(x=>x.status==="RECORDED").length,1);
assert.equal(results.reduce((sum,x)=>sum+x.created,0),16);
const history=await request("/api/agents/run");
assert.equal(history.status,200);
const daily=history.data.tasks.filter(x=>x.action.startsWith("LOCAL_DAILY_READINESS_"));
assert.equal(daily.length,16,"16 agents are evaluated only once each per local day");
assert.equal(new Set(daily.map(x=>x.roleId)).size,16);
assert.ok(daily.some(x=>x.roleId==="wholesale-calling"&&x.status==="BLOCKED"));
assert.ok(daily.some(x=>x.roleId==="instagram-discovery"&&x.status==="BLOCKED"));
assert.ok(daily.every(x=>x.modelCostPaise===0));
const retry=await exec("npm",["run","agents:worker","--","--ci-at-due"],
 {env:process.env,encoding:"utf8",timeout:75_000});
assert.match(retry.stdout,/ALREADY_RECORDED/);
const off=await request("/api/agents/schedule",{enabled:false});
assert.equal(off.status,200);
const final=await request("/api/dashboard");
assert.equal(final.data.agentSchedule.enabled,false);
assert.ok(final.data.agentSchedule.lastRunDate);
console.log("PASS opt-in 16-role daily internal evidence, three concurrent DB workers, idempotence, verified blockers and owner disable. No paid models or external actions.");
