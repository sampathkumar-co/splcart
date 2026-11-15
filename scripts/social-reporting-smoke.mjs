/**
 * Test fixture only: record a FAKE CI-only external post link, not a real post.
 * The application never connects to Instagram/YouTube APIs or logs in.
 */
import assert from "node:assert/strict";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1")throw Error("SOCIAL_CI_FIXTURES_ONLY");
const cookie=await authenticateOwner();
async function get(path){
 const r=await fetch(base+path,{headers:authHeaders(cookie)});
 return {status:r.status,data:await r.json()};
}
async function send(path,payload){
 const r=await fetch(base+path,{method:"POST",headers:authHeaders(cookie,true),body:JSON.stringify(payload)});
 return {status:r.status,data:await r.json()};
}
const reels=await get("/api/creative/reels");
const approved=reels.data.reels.find(r=>r.status==="APPROVED");
assert.ok(approved?.id,"CI must approve a real locally rendered MP4 first");
const first=await send("/api/creative/publications",{
 reelJobId:approved.id,platform:"INSTAGRAM",
 postUrl:"https://www.instagram.com/reel/CIfixture001/?igsh=ci-only",
});
assert.equal(first.status,201,JSON.stringify(first.data));
assert.equal(first.data.sourceLabel,"OWNER_REPORTED");
const duplicate=await send("/api/creative/publications",{
 reelJobId:approved.id,platform:"INSTAGRAM",
 postUrl:"https://www.instagram.com/reel/CIfixture001/",
});
assert.equal(duplicate.status,409);
const bad=await send("/api/creative/publications",{
 reelJobId:approved.id,platform:"YOUTUBE",postUrl:"https://api.splcart.in/not-a-short",
});
assert.equal(bad.status,400);
const metrics=await send("/api/creative/metrics",{
 publicationId:first.data.id,views:1234,likes:51,enquiries:3,
 evidenceUrl:"https://www.instagram.com/reel/CIfixture001/",
});
assert.equal(metrics.status,201,JSON.stringify(metrics.data));
assert.equal(metrics.data.sourceLabel,"OWNER_REPORTED");
const publications=await get("/api/creative/publications");
const item=publications.data.publications.find(p=>p.id===first.data.id);
assert.equal(item.latest.views,1234);
assert.equal(item.latest.enquiries,3);
assert.equal(item.latest.sourceLabel,"OWNER_REPORTED");
const outcome=await send("/api/agents/run",{roleId:"marketing-performance"});
assert.equal(outcome.status,200);
assert.equal(outcome.data.status,"COMPLETED");
assert.ok(outcome.data.report.summary.includes("NOT independently platform-verified"));
assert.equal(outcome.data.report.modelCostPaise,0);
console.log("PASS saved CI-only owner-reported publication and metrics, duplicate rejection, invalid host refusal, real local marketing report; NO actual external post/API or verified sales.");
