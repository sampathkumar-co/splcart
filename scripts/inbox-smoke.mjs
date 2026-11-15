/**
 * Ephemeral HQ owner-only HTTP/Prisma inbox verification. All enquiries
 * and channels are CI fixtures. No WhatsApp, Instagram or outgoing send.
 */
import assert from "node:assert/strict";
import {PrismaClient} from "@prisma/client";
import {authHeaders,base} from "./ci-auth.mjs";
if(process.env.HQ_TEST_MODE!=="1")throw new Error("INBOX_SMOKE_ONLY_DISPOSABLE_CI");
export async function runInboxSmoke(cookie){
 const request=async(path,payload,authorized=true)=>{
  const response=await fetch(base+path,{
   method:payload?"POST":"GET",
   headers:authorized?authHeaders(cookie,!!payload):
      (payload?{Origin:base,"Content-Type":"application/json"}:{}),
   ...(payload?{body:JSON.stringify(payload)}:{}),
  });
  return {status:response.status,result:await response.json()};
 };
 const denial=await request("/api/customer-inquiries",null,false);
 assert.equal(denial.status,401);
 const before=await request("/api/customer-inquiries");
 assert.equal(before.status,200);
 assert.equal(before.result.externalChannelsConnected,false);
 const fake=await request("/api/customer-inquiries",{
  action:"record_inbound",channel:"WHATSAPP",customerAlias:"CI incoming shopper",
  category:"CZ jewellery",message:"CI-only customer asks about stud earrings.",
  customerInitiated:false,
 });
 assert.equal(fake.status,400,"must require explicit actual customer-initiated assertion");
 const created=await request("/api/customer-inquiries",{
  action:"record_inbound",channel:"WHATSAPP",customerAlias:"CI incoming shopper",
  category:"CZ jewellery",message:"CI-only customer asks about stud earrings.",
  customerInitiated:true,
 });
 assert.equal(created.status,201,JSON.stringify(created.result));
 assert.equal(created.result.inquiry.sourceLabel,"OWNER_RECORDED");
 assert.equal(created.result.inquiry.status,"OPEN");
 const id=created.result.inquiry.id;
 const premature=await request("/api/customer-inquiries",{
  action:"record_manual_reply",inquiryId:id,replyText:"I have sent this reply outside HQ.",
  ownerConfirmedSent:false,
 });
 assert.equal(premature.status,400,"manual send confirmation must be explicit");
 const completed=await request("/api/customer-inquiries",{
  action:"record_manual_reply",inquiryId:id,
  replyText:"CI only: I manually replied after checking options, no message was sent by the HQ app.",
  ownerConfirmedSent:true,
 });
 assert.equal(completed.status,200,JSON.stringify(completed.result));
 assert.equal(completed.result.inquiry.status,"REPLIED_REPORTED");
 const duplicate=await request("/api/customer-inquiries",{
  action:"record_manual_reply",inquiryId:id,
  replyText:"CI only: a duplicate manual reply must fail.",
  ownerConfirmedSent:true,
 });
 assert.equal(duplicate.status,409,"cannot falsely record the same reply twice");
 const closed=await request("/api/customer-inquiries",{
  action:"close",inquiryId:id,note:"CI-only owner completed this real manual workflow fixture",
 });
 assert.equal(closed.status,200);
 assert.equal(closed.result.inquiry.status,"CLOSED");
 const retry=await request("/api/customer-inquiries",{
  action:"close",inquiryId:id,note:"CI-only repeated close",
 });
 assert.equal(retry.status,409);
 const final=await request("/api/customer-inquiries");
 assert.ok(final.result.inquiries.find(q=>q.id===id&&q.status==="CLOSED"));
 assert.equal(final.result.externalChannelsConnected,false);
 const fresh=await request("/api/customer-inquiries",{
  action:"record_inbound",channel:"WEBSITE",customerAlias:"CI-fresh-case",
  category:"CZ jewellery",message:"CI fixture asking about earrings",
  customerInitiated:true,
 });
 assert.equal(fresh.status,201);
 const db=new PrismaClient();
 try{
  await db.customerInquiry.update({where:{id},data:{
   updatedAt:new Date(Date.now()-100*86_400_000),
  }});
  const old=await request("/api/customer-inquiries");
  assert.equal(old.result.retention.mode,"OWNER_TRIGGERED_ONLY");
  assert.ok(old.result.retention.eligibleByDays["90"]>=1);
  const noConfirmation=await request("/api/customer-inquiries",{
   action:"purge_closed",days:90,confirm:"CANCEL",
  });
  assert.equal(noConfirmation.status,400);
  const purged=await request("/api/customer-inquiries",{
   action:"purge_closed",days:90,confirm:"PURGE",
  });
  assert.equal(purged.status,200,JSON.stringify(purged.result));
  assert.ok(purged.result.deleted>=1);
  assert.equal(await db.customerInquiry.count({where:{id}}),0);
  assert.equal(await db.customerInquiry.count({where:{id:fresh.result.inquiry.id}}),1);
  const wrong=await request("/api/customer-inquiries",{
   action:"erase",inquiryId:fresh.result.inquiry.id,confirm:"CANCEL",
  });
  assert.equal(wrong.status,400);
  const erased=await request("/api/customer-inquiries",{
   action:"erase",inquiryId:fresh.result.inquiry.id,confirm:"ERASE",
  });
  assert.equal(erased.status,200,JSON.stringify(erased.result));
  assert.equal(erased.result.deleted,1);
  const repeat=await request("/api/customer-inquiries",{
   action:"erase",inquiryId:fresh.result.inquiry.id,confirm:"ERASE",
  });
  assert.equal(repeat.status,409);
 }finally{await db.$disconnect();}
 console.log("PASS owner-triggered retention: exact confirmation, closed-only older records, open record preserved and verified individual erasure.");
 console.log("PASS owner-only incoming customer workflow: manual source label, explicit initiation/sent confirmations, honest reply/closure, duplicate rejection; no platform login or send.");
}
