import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError,publicUrl} from "@/lib/validation";
import {validateMetricCounts} from "@/lib/social-reporting";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
export const runtime="nodejs";
const counts=z.number().int().min(0).max(1_000_000_000).nullable().optional();
const input=z.object({
  publicationId:z.uuid(),
  views:counts,likes:counts,enquiries:counts,
  evidenceUrl:publicUrl,
}).strict();
export async function POST(req:Request){
 try{
  const limit=await consumeRateLimit("owner-metric-records",80,86400_000);
  if(!limit.allowed)return throttled(limit.retryAfterSeconds);
  const value=input.parse(await req.json());
  validateMetricCounts({views:value.views,likes:value.likes,enquiries:value.enquiries});
  const publication=await db.socialPublication.findUnique({where:{id:value.publicationId}});
  if(!publication)return Response.json({error:"PUBLICATION_NOT_FOUND"},{status:404});
  const recorded=await db.$transaction(async tx=>{
    const row=await tx.socialMetric.create({data:{
      publicationId:publication.id,
      views:value.views??null,likes:value.likes??null,enquiries:value.enquiries??null,
      evidenceUrl:value.evidenceUrl,
      sourceLabel:"OWNER_REPORTED",observedAt:new Date(),
    }});
    await tx.systemAudit.create({data:{
      event:"SOCIAL_METRIC_OWNER_REPORTED",
      actor:"OWNER",
      reason:"Owner supplied platform figures at "+row.observedAt.toISOString()+
        " for "+publication.platform+" post "+publication.id+
        ". No independent platform analytics API or verification.",
    }});
    return row;
  });
  return Response.json({id:recorded.id,sourceLabel:"OWNER_REPORTED",
    message:"Saved an owner-reported performance snapshot; NOT platform-verified or counted as paid revenue."},{status:201});
 }catch(e){return apiError(e);}
}
