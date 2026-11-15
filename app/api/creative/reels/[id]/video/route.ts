import { z } from "zod";
import { db } from "@/lib/prisma";
import { loadMedia } from "@/lib/creative";
import { apiError } from "@/lib/validation";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){
  try {
    const {id}=await params;
    z.uuid().parse(id);
    const job=await db.reelJob.findUnique({where:{id}});
    if(!job || !["RENDERED","APPROVED"].includes(job.status) || !job.outputFilename)
      return Response.json({error:"VIDEO_NOT_READY"},{status:404});
    const file=await loadMedia("reels",job.outputFilename);
    return new Response(new Uint8Array(file),{headers:{
      "Content-Type":"video/mp4",
      "Content-Length":String(file.byteLength),
      "Content-Disposition":`inline; filename="Prasanth-Jewellers-${id}.mp4"`,
      "Cache-Control":"private, no-store",
      "Accept-Ranges":"none",
      "X-Content-Type-Options":"nosniff",
    }});
  }catch(e){return apiError(e);}
}
