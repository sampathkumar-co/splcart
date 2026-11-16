/** CI-only concurrent schedule acceptance on isolated HQ Postgres + fake photos. */
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {promisify} from "node:util";
import {execFile} from "node:child_process";
import sharp from "sharp";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1"||process.env.HQ_MEDIA_DIR!=="/tmp/hq-ci-media")
 throw new Error("SCHEDULE_SMOKE_ONLY_DISPOSABLE_CI");
const execFileAsync=promisify(execFile);
const cookie=await authenticateOwner();
const request=async(path,payload)=>{
 const response=await fetch(base+path,{
  ...(payload?{method:"POST",headers:authHeaders(cookie,true),body:JSON.stringify(payload)}:{headers:authHeaders(cookie)}),
 });
 return {status:response.status,data:await response.json()};
};
const [dashboard,prior]=await Promise.all([request("/api/dashboard"),request("/api/creative/reels")]);
assert.equal(dashboard.status,200);
assert.equal(prior.status,200);
assert.ok(prior.data.assets.length>=1,"creative smoke must seed an actual uploaded CI image");
const firstProductId=prior.data.assets[0].productId;
const secondProduct=dashboard.data.products.find(p=>p.id!==firstProductId);
assert.ok(secondProduct?.id,"domain smoke must seed a second independent CI product");
// A second photo of the SAME product must not create a second scheduled Reel.
const photo=await sharp({create:{width:512,height:512,channels:3,background:"#ae9469"}}).png().toBuffer();
for(const productId of [firstProductId,secondProduct.id]){
 const uploaded=await request("/api/creative/assets",{productId,contentBase64:photo.toString("base64")});
 assert.equal(uploaded.status,201,JSON.stringify(uploaded.data));
}
const enabled=await request("/api/creative/schedule",{enabled:true,dailyTarget:2});
assert.equal(enabled.status,200,JSON.stringify(enabled.data));
assert.equal(enabled.data.enabled,true);
// Exercise multiple independently launched workers against the same Postgres day.
const commands=await Promise.all(Array.from({length:3},()=>
 execFileAsync("npm",["run","creative:worker","--","--schedule-only"],
  {encoding:"utf8",env:process.env,timeout:45_000})));
for(const command of commands)assert.match(command.stdout,/CREATIVE_SCHEDULE/);
const state1=await request("/api/creative/reels");
const dayJobs=state1.data.reels.filter(j=>j.scheduleDate);
assert.equal(dayJobs.length,2,"concurrent workers must respect the actual two-per-day cap");
assert.equal(new Set(dayJobs.map(j=>j.productId)).size,2,
 "one day cannot include multiple photos of the same jewellery product");
assert.ok(dayJobs.every(j=>j.status==="QUEUED"));
const again=execFileSync("npm",["run","creative:worker","--","--schedule-only"],
 {encoding:"utf8",env:process.env,timeout:45_000});
assert.match(again,/TARGET_MET/);
const state2=await request("/api/creative/reels");
assert.equal(state2.data.reels.filter(j=>j.scheduleDate).length,2,"rerun cannot duplicate jobs");
const disabled=await request("/api/creative/schedule",{enabled:false,dailyTarget:2});
assert.equal(disabled.status,200);
assert.equal(disabled.data.enabled,false);
const state3=await request("/api/creative/reels");
assert.equal(state3.data.schedule.enabled,false);
console.log("PASS concurrent local creative workers, two real CI assets, same-product dedupe, per-day cap, idempotent reruns and owner disable; no paid calls or publishing.");
