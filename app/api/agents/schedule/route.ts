import {z} from "zod";
import {db} from "@/lib/prisma";
import {AGENT_LOCAL_TIME,AGENT_SCHEDULE_ID} from "@/lib/agent-schedule";
import {apiError} from "@/lib/validation";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const input=z.object({enabled:z.boolean()}).strict();

/** Only the authenticated HQ owner can opt into daily internal checks. */
export async function POST(req:Request){
 try{
  const value=input.parse(await req.json());
  const saved=await db.$transaction(async tx=>{
   await tx.$queryRaw`SELECT 1::int AS locked FROM pg_advisory_xact_lock(23901, 31)`;
   const schedule=await tx.agentSchedule.upsert({
    where:{id:AGENT_SCHEDULE_ID},
    create:{id:AGENT_SCHEDULE_ID,enabled:value.enabled},
    update:{enabled:value.enabled},
   });
   await tx.systemAudit.create({data:{
    actor:"OWNER",
    event:value.enabled?"DAILY_LOCAL_BRIEFING_ENABLED":"DAILY_LOCAL_BRIEFING_DISABLED",
    reason:"Owner "+(value.enabled?"enabled":"disabled")+
      " 08:30 Asia/Kolkata daily LOCAL source reports. No social, voice, messaging, browsing or paid models.",
   }});
   return schedule;
  },{maxWait:15000,timeout:15000});
  return Response.json({enabled:saved.enabled,
   lastRunDate:saved.lastRunDate,localTime:AGENT_LOCAL_TIME,timeZone:"Asia/Kolkata",
   message:"Only local evidence reports are scheduled. An isolated HQ role worker must be online. Nothing is sent or published."},
   {headers:{"Cache-Control":"no-store"}});
 }catch(error){return apiError(error);}
}
