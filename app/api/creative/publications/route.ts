import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError,publicUrl} from "@/lib/validation";
import {normalizeSocialPost} from "@/lib/social-reporting";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const input=z.object({reelJobId:z.uuid(),platform:z.enum(["INSTAGRAM","YOUTUBE"]),postUrl:publicUrl}).strict();

export async function GET(){
 try{
  const data=await db.socialPublication.findMany({orderBy:{recordedAt:"desc"},take:70,
    include:{reel:{select:{titleSnapshot:true,status:true}},
      metrics:{orderBy:{observedAt:"desc"},take:1}}});
  return Response.json({publications:data.map(p=>({
    id:p.id,reelJobId:p.reelJobId,platform:p.platform,postUrl:p.postUrl,
    recordedAt:p.recordedAt.toISOString(),sourceLabel:p.sourceLabel,
    title:p.reel.titleSnapshot,status:p.reel.status,
    latest:p.metrics[0]?{views:p.metrics[0].views,likes:p.metrics[0].likes,
      enquiries:p.metrics[0].enquiries,observedAt:p.metrics[0].observedAt.toISOString(),
      evidenceUrl:p.metrics[0].evidenceUrl,sourceLabel:p.metrics[0].sourceLabel}:null,
  }))},{headers:{"Cache-Control":"no-store"}});
 }catch(e){return apiError(e);}
}

export async function POST(req:Request){
 try{
  const limit=await consumeRateLimit("owner-social-records",40,86400_000);
  if(!limit.allowed)return throttled(limit.retryAfterSeconds);
  const value=input.parse(await req.json());
  const postUrl=normalizeSocialPost(value.platform,value.postUrl);
  const job=await db.reelJob.findUnique({where:{id:value.reelJobId},select:{status:true}});
  if(!job)return Response.json({error:"REEL_NOT_FOUND"},{status:404});
  if(job.status!=="APPROVED")return Response.json({error:"OWNER_APPROVED_REEL_REQUIRED"},{status:409});
  const existing=await db.socialPublication.findUnique({where:{reelJobId_platform:{
    reelJobId:value.reelJobId,platform:value.platform}}});
  if(existing)return Response.json({error:"PUBLICATION_ALREADY_RECORDED",publicationId:existing.id},{status:409});
  const publication=await db.$transaction(async tx=>{
    const item=await tx.socialPublication.create({data:{
      reelJobId:value.reelJobId,platform:value.platform,postUrl,sourceLabel:"OWNER_REPORTED",
    }});
    await tx.systemAudit.create({data:{event:"SOCIAL_LINK_OWNER_RECORDED",
      actor:"OWNER",reason:"Owner supplied external "+value.platform+" post URL for approved Reel "+
      value.reelJobId+". No external publishing, post validation, or platform API access was performed."}});
    return item;
  });
  return Response.json({id:publication.id,postUrl:publication.postUrl,sourceLabel:"OWNER_REPORTED",
    message:"Recorded the link you entered. Platform publishing was NOT performed or independently verified."},{status:201});
 }catch(e){return apiError(e);}
}
