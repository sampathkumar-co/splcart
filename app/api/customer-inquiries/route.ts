import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError} from "@/lib/validation";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";

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
const input=z.discriminatedUnion("action",[newInquiry,reply,close]);

const fields={
 id:true,channel:true,customerAlias:true,category:true,message:true,
 status:true,sourceLabel:true,receivedAt:true,replyText:true,repliedAt:true,
 closeNote:true,createdAt:true,
} as const;

/** No platform integration: every entry is owner-recorded, not verified. */
export async function GET(){
 try{
  const [inquiries,openCount]=await Promise.all([
   db.customerInquiry.findMany({
    orderBy:{createdAt:"desc"},take:70,select:fields,
   }),
   db.customerInquiry.count({where:{status:"OPEN"}}),
  ]);
  return Response.json({inquiries,openCount,source:"OWNER_RECORDED",
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
  const result=await db.$transaction(async tx=>{
    const changed=await tx.customerInquiry.updateMany({
     where:{id:value.inquiryId,status:{not:"CLOSED"}},
     data:{status:"CLOSED",closeNote:value.note},
    });
    if(changed.count!==1)return null;
    await tx.systemAudit.create({data:{
      actor:"OWNER",event:"INQUIRY_CLOSED_BY_OWNER",
      reason:"Owner closed inquiry "+value.inquiryId+". Reason: "+value.note,
    }});
    return tx.customerInquiry.findUnique({where:{id:value.inquiryId},select:fields});
  });
  if(!result)return Response.json({error:"INQUIRY_ALREADY_CLOSED_OR_MISSING"},{status:409});
  return Response.json({inquiry:result,
   message:"Enquiry closed by the owner; no external account or message touched."},
   {headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
