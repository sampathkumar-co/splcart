import { z } from "zod";
import { db } from "@/lib/prisma";
import { apiError } from "@/lib/validation";
import { consumeRateLimit, throttled } from "@/lib/rate-limit";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const createInput=z.object({assetId:z.uuid()}).strict();

export async function GET() {
  try {
    const [jobs,assets]=await Promise.all([
      db.reelJob.findMany({orderBy:{createdAt:"desc"},take:50,
        select:{id:true,productId:true,assetId:true,status:true,outputFilename:true,
          durationSeconds:true,titleSnapshot:true,materialSnapshot:true,linkSnapshot:true,
          errorCode:true,approvedAt:true,createdAt:true,finishedAt:true}}),
      db.creativeAsset.findMany({orderBy:{createdAt:"desc"},take:80,
        select:{id:true,productId:true,width:true,height:true,createdAt:true,product:{select:{title:true}}}}),
    ]);
    const reels=jobs.map(j=>({...j,
      previewUrl:j.outputFilename && ["RENDERED","APPROVED"].includes(j.status)
        ? "/api/creative/reels/"+j.id+"/video":null}));
    return Response.json({reels,assets},{headers:{"Cache-Control":"no-store"}});
  }catch(e){return apiError(e);}
}

export async function POST(req:Request) {
  try {
    const limit=await consumeRateLimit("owner-reels",12,86400_000);
    if(!limit.allowed)return throttled(limit.retryAfterSeconds);
    const input=createInput.parse(await req.json());
    const asset=await db.creativeAsset.findUnique({where:{id:input.assetId},include:{product:true}});
    if(!asset)return Response.json({error:"OWNER_PHOTO_NOT_FOUND"},{status:404});
    const active=await db.reelJob.count({where:{status:{in:["QUEUED","RENDERING"]}}});
    if(active>=5) return Response.json({error:"RENDER_QUEUE_FULL"},{status:409});
    const job=await db.reelJob.create({data:{
      productId:asset.productId,assetId:asset.id,durationSeconds:20,
      titleSnapshot:asset.product.title,materialSnapshot:asset.product.material,
      linkSnapshot:asset.product.productUrl,status:"QUEUED",
    }});
    await db.systemAudit.create({data:{event:"REEL_QUEUED_BY_OWNER",
      reason:"Queued original 20-second no-key promo for product reference "+asset.productId+
        "; asset "+asset.id+"; job "+job.id+". No publishing requested."}});
    return Response.json({id:job.id,status:job.status,seconds:job.durationSeconds,
      message:"Queued for local FFmpeg rendering; no AI API or publishing action."},{status:201});
  }catch(e){return apiError(e);}
}
