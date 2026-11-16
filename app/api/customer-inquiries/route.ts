import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError} from "@/lib/validation";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
import {inquiryRetentionCutoff,INQUIRY_RETENTION_DAYS,PURGE_BATCH_LIMIT,CUSTOMER_HISTORY_REDACTED} from "@/lib/inquiry-retention";

export const runtime="nodejs";
export const dynamic="force-dynamic";
const newInquiry=z.object({
 action:z.literal("record_inbound"),
 channel:z.enum(["WHATSAPP","INSTAGRAM","WEBSITE","OTHER"]),
 customerAlias:z.string().trim().min(2).max(80),
 category:z.string().trim().min(2).max(80),
 message:z.string().trim().min(6).max(1200),
 customerInitiated:z.literal(true),
}).strict();
const reply=z.object({
 action:z.literal("record_manual_reply"),
 inquiryId:z.uuid(),
 replyText:z.string().trim().min(12).max(900),
 ownerConfirmedSent:z.literal(true),
}).strict();
const close=z.object({
 action:z.literal("close"),
 inquiryId:z.uuid(),
 note:z.string().trim().min(3).max(250),
}).strict();

const erase=z.object({
 action:z.literal("erase"),
 inquiryId:z.uuid(),
 confirm:z.literal("ERASE"),
}).strict();
const purge=z.object({
 action:z.literal("purge_closed"),
 days:z.union([z.literal(30),z.literal(90),z.literal(180)]),
 confirm:z.literal("PURGE"),
}).strict();
const input=z.discriminatedUnion("action",[newInquiry,reply,close,erase,purge]);

const fields={
 id:true,channel:true,customerAlias:true,category:true,message:true,
 status:true,sourceLabel:true,receivedAt:true,replyText:true,repliedAt:true,
 closeNote:true,createdAt:true,
} as const;

/** No platform integration: every entry is owner-recorded, not verified. */
export async function GET(){
 try{
  const [inquiries,openCount,...retentionEligible]=await Promise.all([
   db.customerInquiry.findMany({
    orderBy:{createdAt:"desc"},take:70,select:fields,
   }),
   db.customerInquiry.count({where:{status:"OPEN"}}),
   ...INQUIRY_RETENTION_DAYS.map(days=>db.customerInquiry.count({
    where:{status:"CLOSED",updatedAt:{lt:inquiryRetentionCutoff(days)}},
   })),
  ]);
  return Response.json({inquiries,openCount,source:"OWNER_RECORDED",
   retention:{mode:"OWNER_TRIGGERED_ONLY",windowsDays:INQUIRY_RETENTION_DAYS,
     eligibleByDays:Object.fromEntries(INQUIRY_RETENTION_DAYS.map((days,index)=>[days,retentionEligible[index]])),
     batchLimit:PURGE_BATCH_LIMIT,backupCopies:"NOT_ERASED_BY_LIVE_DATABASE_ACTION"},
   externalChannelsConnected:false,
   message:"Only manually recorded inbound enquiries are displayed. No social account has been accessed."},
   {headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
export async function POST(req:Request){
 try{
  const limit=await consumeRateLimit("owner-inquiry-actions",40,86400_000);
  if(!limit.allowed)return throttled(limit.retryAfterSeconds);
  const value=input.parse(await req.json());
  if(value.action==="record_inbound"){
   const saved=await db.$transaction(async tx=>{
    const row=await tx.customerInquiry.create({
     data:{channel:value.channel,customerAlias:value.customerAlias,
      category:value.category,message:value.message,sourceLabel:"OWNER_RECORDED"},
     select:fields,
    });
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"CUSTOMER_INBOUND_MANUALLY_RECORDED",
      reason:"Owner asserted one customer-initiated "+value.channel+
       " enquiry was transcribed into standalone HQ. Record "+row.id+
       "; external channel not accessed, no outbound communication.",
    }});
    return row;
   });
   return Response.json({inquiry:saved,
     message:"Customer-initiated enquiry recorded as OWNER_RECORDED, not platform-verified. No reply sent."},
     {status:201,headers:{"Cache-Control":"no-store"}});
  }
  if(value.action==="record_manual_reply"){
   const result=await db.$transaction(async tx=>{
    const changed=await tx.customerInquiry.updateMany({
     where:{id:value.inquiryId,status:"OPEN"},
     data:{status:"REPLIED_REPORTED",replyText:value.replyText,repliedAt:new Date()},
    });
    if(changed.count!==1)return null;
    await tx.systemAudit.create({data:{
     actor:"OWNER",event:"INQUIRY_REPLY_OWNER_REPORTED",
     reason:"Owner confirms a manual reply outside HQ for inquiry "+value.inquiryId+
      ". No platform delivery, identity or response verified by Headquarters.",
    }});
    return tx.customerInquiry.findUnique({where:{id:value.inquiryId},select:fields});
   });
   if(!result)return Response.json({error:"INQUIRY_NOT_OPEN_OR_MISSING"},{status:409});
   return Response.json({inquiry:result,
    message:"Manual reply recorded as OWNER_REPORTED. No message sent by Headquarters."},
    {headers:{"Cache-Control":"no-store"}});
  }

  if(value.action==="erase"){
   const result=await db.$transaction(async tx=>{
    const deleted=await tx.customerInquiry.deleteMany({where:{id:value.inquiryId}});
    if(deleted.count!==1)return false;
    // Old close-audit code could have copied the owner's close note into audit text.
    await tx.systemAudit.updateMany({
      where:{event:"INQUIRY_CLOSED_BY_OWNER",reason:{contains:value.inquiryId}},
      data:{reason:"Owner closed a customer enquiry. Personal details redacted after record erasure."},
    });
    // Prior local task reports might have held the nickname. Scrub the full role's
    // historical items instead of leaving hidden copies after the deletion.
    await tx.agentTask.updateMany({
      where:{roleId:"customer-conversation"},
      data:{resultJson:CUSTOMER_HISTORY_REDACTED},
    });
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"CUSTOMER_INQUIRY_ERASED",
      reason:"Owner explicitly erased private HQ enquiry "+value.inquiryId+
       " from the live DB; previous customer-role task reports redacted. Encrypted backups are separate.",
    }});
    return true;
   });
   if(!result)return Response.json({error:"INQUIRY_NOT_FOUND"},{status:409});
   return Response.json({deleted:1,
      message:"Customer enquiry erased from live HQ and past customer-role report details redacted. Existing encrypted backups have independent retention."},
     {headers:{"Cache-Control":"no-store"}});
  }
  if(value.action==="purge_closed"){
   const result=await db.$transaction(async tx=>{
    const candidates=await tx.customerInquiry.findMany({
      where:{status:"CLOSED",updatedAt:{lt:inquiryRetentionCutoff(value.days)}},
      orderBy:{updatedAt:"asc"},take:PURGE_BATCH_LIMIT,select:{id:true},
    });
    if(!candidates.length)return 0;
    const ids=candidates.map(q=>q.id);
    const deleted=await tx.customerInquiry.deleteMany({
      where:{id:{in:ids},status:"CLOSED",updatedAt:{lt:inquiryRetentionCutoff(value.days)}},
    });
    // Sanitize historically copied closure notes on these specific records.
    for(const id of ids){
      await tx.systemAudit.updateMany({
        where:{event:"INQUIRY_CLOSED_BY_OWNER",reason:{contains:id}},
        data:{reason:"Owner closed a customer enquiry. Personal details redacted after retention purge."},
      });
    }
    await tx.agentTask.updateMany({
      where:{roleId:"customer-conversation"},
      data:{resultJson:CUSTOMER_HISTORY_REDACTED},
    });
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"CUSTOMER_INQUIRY_RETENTION_PURGE",
      reason:"Owner confirmed batch erasure of "+deleted.count+
        " CLOSED HQ enquiries last updated more than "+value.days+
        " days ago; old customer role reports redacted. No live open/replied enquiries erased. Backups remain separately managed.",
    }});
    return deleted.count;
   },{maxWait:15000,timeout:30000});
   return Response.json({deleted:result,batchLimit:PURGE_BATCH_LIMIT,
     message:result+" closed old enquiries erased from live HQ. Open/replied records untouched; existing encrypted backups follow separate retention."},
     {headers:{"Cache-Control":"no-store"}});
  }
  const result=await db.$transaction(async tx=>{
    const changed=await tx.customerInquiry.updateMany({
     where:{id:value.inquiryId,status:{not:"CLOSED"}},
     data:{status:"CLOSED",closeNote:value.note},
    });
    if(changed.count!==1)return null;
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"INQUIRY_CLOSED_BY_OWNER",
      reason:"Owner closed inquiry "+value.inquiryId+". Owner-entered reason retained only in the private inquiry record.",
    }});
    return tx.customerInquiry.findUnique({where:{id:value.inquiryId},select:fields});
  });
  if(!result)return Response.json({error:"INQUIRY_ALREADY_CLOSED_OR_MISSING"},{status:409});
  return Response.json({inquiry:result,
   message:"Enquiry closed by the owner; no external account or message touched."},
   {headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
