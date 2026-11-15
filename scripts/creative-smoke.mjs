/**
 * CI-only full live 20-second video acceptance:
 * owner-authenticated image POST -> queued DB job -> actual FFmpeg ->
 * MP4 byte/duration verification -> explicit owner approval.
 * Synthetic solid image is a TEST FIXTURE, not a jewellery product/video.
 */
import assert from "node:assert/strict";
import {execFileSync} from "node:child_process";
import {mkdir,writeFile} from "node:fs/promises";
import sharp from "sharp";
import {authenticateOwner,authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1"||process.env.HQ_MEDIA_DIR!=="/tmp/hq-ci-media")
  throw new Error("CREATIVE_SMOKE_ONLY_IN_DISPOSABLE_CI");

const cookie=await authenticateOwner();
const request=async(path,body)=>{
  const response=await fetch(base+path,{
    ...(body?{method:"POST",headers:authHeaders(cookie,true),body:JSON.stringify(body)}:
      {headers:authHeaders(cookie)}),
  });
  const data=await response.json();
  return {status:response.status,data};
};
const dash=await request("/api/dashboard");
assert.equal(dash.status,200);
const product=dash.data.products[0];
assert.ok(product?.id,"CI tests must seed an owner-entered product");
const source=await sharp({create:{width:640,height:640,channels:3,background:"#c4a16d"}})
  .png().toBuffer();
const uploaded=await request("/api/creative/assets",{productId:product.id,contentBase64:source.toString("base64")});
assert.equal(uploaded.status,201,JSON.stringify(uploaded.data));
assert.equal(uploaded.data.asset.width,640);
const assetId=uploaded.data.asset.id;
const requested=await request("/api/creative/reels",{assetId});
assert.equal(requested.status,201,JSON.stringify(requested.data));
assert.equal(requested.data.status,"QUEUED");
assert.equal(requested.data.seconds,20);
const id=requested.data.id;
let before=await request("/api/creative/reels");
assert.equal(before.data.reels.find(r=>r.id===id).status,"QUEUED");
const earlyApproval=await request("/api/creative/reels/"+id,{action:"approve"});
assert.equal(earlyApproval.status,409,"cannot approve nonexistent MP4");
console.log("PASS real owner photo stored, 20-second render queued and premature approval refused");

execFileSync("npm",["run","creative:worker","--","--once"],{
  stdio:"inherit",timeout:180000,env:process.env,
});
const finished=await request("/api/creative/reels");
const video=finished.data.reels.find(r=>r.id===id);
assert.equal(video?.status,"RENDERED",JSON.stringify(video));
assert.ok(video.previewUrl);
const stream=await fetch(base+video.previewUrl,{headers:authHeaders(cookie)});
assert.equal(stream.status,200);
assert.equal(stream.headers.get("content-type"),"video/mp4");
const bytes=Buffer.from(await stream.arrayBuffer());
assert.ok(bytes.byteLength>10000,"real video bytes should exist");
assert.equal(bytes.subarray(4,8).toString("ascii"),"ftyp");
await mkdir("artifacts",{recursive:true});
await writeFile("artifacts/hq-ci-creative-20s.mp4",bytes);
const probe=execFileSync("ffprobe",["-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",
  "artifacts/hq-ci-creative-20s.mp4"],{encoding:"utf8"});
const duration=Number(probe.trim());
assert.ok(duration>=19.5&&duration<=20.5,"real MP4 must be 20 seconds, got "+duration);
console.log("PASS real FFmpeg H.264 MP4:",bytes.byteLength,"bytes, duration",duration,"seconds, 720x1280 target");

const approved=await request("/api/creative/reels/"+id,{action:"approve"});
assert.equal(approved.status,200);
assert.equal(approved.data.status,"APPROVED");
const after=await request("/api/creative/reels");
assert.equal(after.data.reels.find(r=>r.id===id).status,"APPROVED");
const illegalRetry=await request("/api/creative/reels/"+id,{action:"retry"});
assert.equal(illegalRetry.status,409);
console.log("PASS explicit owner approval, no outbound social posting, no paid AI calls, no SPLCART writes.");
