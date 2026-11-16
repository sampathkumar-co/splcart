import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError} from "@/lib/validation";
export const runtime="nodejs";
const request=z.object({enabled:z.boolean(),dailyTarget:z.union([z.literal(2),z.literal(3)])}).strict();
export async function POST(req:Request){
  try{
    const value=request.parse(await req.json());
    const state=await db.$transaction(async tx=>{
      const next=await tx.creativeSchedule.upsert({
        where:{id:"hq"},create:{id:"hq",enabled:value.enabled,dailyTarget:value.dailyTarget},
        update:{enabled:value.enabled,dailyTarget:value.dailyTarget},
      });
      await tx.systemAudit.create({data:{
        actor:"OWNER",event:value.enabled?"DAILY_REELS_SCHEDULE_ENABLED":"DAILY_REELS_SCHEDULE_DISABLED",
        reason:"Owner set original 20-second local render target to "+value.dailyTarget+
          "/day. This changes future generation only; no social publishing or in-flight cancellation.",
      }});
      return next;
    });
    return Response.json({enabled:state.enabled,dailyTarget:state.dailyTarget,
      message:"Saved local-only schedule. A running HQ creative worker checks every five minutes. Nothing is posted or sent."});
  }catch(e){return apiError(e);}
}
