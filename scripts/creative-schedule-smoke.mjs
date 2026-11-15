/** CI-only owner opt-in 2/day scheduling. Never posts/replies or uses real assets. */
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1"||process.env.HQ_MEDIA_DIR!=="/tmp/hq-ci-media")
 throw new Error("SCHEDULE_SMOKE_ONLY_DISPOSABLE_CI");
const cookie=await authenticateOwner();
const request=async(path,payload)=>{
 const response=await fetch(base+path,{
  ...(payload?{method:"POST",headers:authHeaders(cookie,true),body:JSON.stringify(payload)}:{headers:authHeaders(cookie)}),
 });
 return {status:response.status,data:await response.json()};
};
const enabled=await request("/api/creative/schedule",{enabled:true,dailyTarget:2});
assert.equal(enabled.status,200,JSON.stringify(enabled.data));
assert.equal(enabled.data.enabled,true);
const first=execFileSync("npm",["run","creative:worker","--","--schedule-only"],
 {encoding:"utf8",env:process.env,timeout:20000});
assert.match(first,/CREATIVE_SCHEDULE/);
const state1=await request("/api/creative/reels");
const dayJobs=state1.data.reels.filter(j=>j.scheduleDate);
assert.equal(dayJobs.length,1,"one owner photo means only one scheduled video, never fabricated second");
assert.equal(dayJobs[0].status,"QUEUED");
const again=execFileSync("npm",["run","creative:worker","--","--schedule-only"],
 {encoding:"utf8",env:process.env,timeout:20000});
const state2=await request("/api/creative/reels");
assert.equal(state2.data.reels.filter(j=>j.scheduleDate).length,1,"scheduler must not duplicate original photo on same day");
const disabled=await request("/api/creative/schedule",{enabled:false,dailyTarget:2});
assert.equal(disabled.status,200);
assert.equal(disabled.data.enabled,false);
const state3=await request("/api/creative/reels");
assert.equal(state3.data.schedule.enabled,false);
console.log("PASS opt-in local 2/day scheduling, distinct real photo shortage, idempotency and owner disable. No external messages or API calls.");
