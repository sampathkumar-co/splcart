import { z } from "zod";
import { db } from "@/lib/prisma";
import { apiError } from "@/lib/validation";
export const runtime="nodejs";
const decision=z.object({action:z.enum(["approve","void","retry"])}).strict();
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params;
    z.uuid().parse(id);
    const body=decision.parse(await req.json());
    const job=await db.reelJob.findUnique({where:{id}});
    if(!job)return Response.json({error:"REEL_NOT_FOUND"},{status:404});
    if(body.action==="approve" && job.status!=="RENDERED")
      return Response.json({error:"REEL_NOT_READY_FOR_APPROVAL"},{status:409});
    if(body.action==="retry" && job.status!=="FAILED")
      return Response.json({error:"REEL_NOT_FAILED"},{status:409});
    if(body.action==="void" && ["APPROVED","VOID"].includes(job.status))
      return Response.json({error:"REEL_NOT_VOIDABLE"},{status:409});
    if(body.action==="void" && job.status==="RENDERING")
      return Response.json({error:"ACTIVE_RENDER_CANNOT_BE_INTERRUPTED"},{status:409});
    const target=body.action==="approve"?"APPROVED":body.action==="retry"?"QUEUED":"VOID";
    await db.$transaction(async tx=>{
      const result=await tx.reelJob.updateMany({where:{id,status:job.status},data:{
        status:target,
        approvedAt:body.action==="approve"?new Date():null,
        errorCode:null,
        ...(body.action==="retry"?{outputFilename:null,startedAt:null,finishedAt:null}:{}),
      }});
      if(result.count!==1)throw new Error("REEL_STATE_CONFLICT");
      await tx.systemAudit.create({data:{event:"REEL_"+target+"_BY_OWNER",
        reason:"Owner "+body.action+" decision for original video job "+id+". No social post or message was sent."}});
    });
    return Response.json({id,status:target,message:"Saved to HQ only; nothing published."});
  }catch(e){return apiError(e);}
}
