import { z } from "zod";
import { db } from "@/lib/prisma";
import { saveOwnerPhoto } from "@/lib/creative";
import { apiError } from "@/lib/validation";
import { consumeRateLimit, throttled } from "@/lib/rate-limit";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const input=z.object({productId:z.uuid(),contentBase64:z.string().min(20).max(4_200_000)}).strict();

export async function GET() {
  try {
    const assets=await db.creativeAsset.findMany({orderBy:{createdAt:"desc"},take:80,
      select:{id:true,productId:true,width:true,height:true,byteSize:true,createdAt:true,
        product:{select:{title:true}}}});
    return Response.json({assets},{headers:{"Cache-Control":"no-store"}});
  }catch(e){return apiError(e);}
}
export async function POST(req:Request) {
  try {
    const limit=await consumeRateLimit("owner-photo-uploads",20,86400_000);
    if(!limit.allowed)return throttled(limit.retryAfterSeconds);
    const length=Number(req.headers.get("content-length")||"0");
    if(length>4_350_000) return Response.json({error:"IMAGE_UPLOAD_TOO_LARGE"},{status:413});
    const data=input.parse(await req.json());
    const product=await db.product.findUnique({where:{id:data.productId},select:{id:true}});
    if(!product)return Response.json({error:"PRODUCT_NOT_FOUND"},{status:404});
    const photo=await saveOwnerPhoto(data.contentBase64);
    const asset=await db.creativeAsset.create({data:{productId:product.id,...photo}});
    return Response.json({asset:{id:asset.id,productId:asset.productId,width:asset.width,height:asset.height,byteSize:asset.byteSize}}, {status:201});
  }catch(e){return apiError(e);}
}
