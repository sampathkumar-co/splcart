/**
 * No-key, owner-opted-in scheduler for original 20s product reels.
 * One photo per product per India-local day. Never posts, messages or invents
 * product availability. Insufficient owner photos => fewer truthful jobs.
 */
import { db } from "./prisma";

export function indiaBusinessDate(now=new Date()) {
  const parts=new Intl.DateTimeFormat("en-GB",{
    timeZone:"Asia/Kolkata",year:"numeric",month:"2-digit",day:"2-digit",
  }).formatToParts(now);
  const read=(type:string)=>parts.find(p=>p.type===type)?.value || "";
  return read("year")+"-"+read("month")+"-"+read("day");
}

export type EligiblePhoto={
  id:string; productId:string;
  product:{title:string;material:string;productUrl:string};
};
export function chooseDistinctPhotoProducts(
  photos:readonly EligiblePhoto[],usedAssetIds:ReadonlySet<string>,max:number
) {
  if(max<=0)return [];
  const usedProducts=new Set<string>();
  const output:EligiblePhoto[]=[];
  for(const item of photos){
    if(usedAssetIds.has(item.id)||usedProducts.has(item.productId))continue;
    usedProducts.add(item.productId);
    output.push(item);
    if(output.length>=max)break;
  }
  return output;
}

export async function scheduleToday(now=new Date()){
  const config=await db.creativeSchedule.findUnique({where:{id:"hq"}});
  if(!config?.enabled)return {status:"DISABLED" as const,created:0,day:indiaBusinessDate(now)};
  const target=Math.min(3,Math.max(2,config.dailyTarget));
  const day=indiaBusinessDate(now);
  const existing=await db.reelJob.findMany({where:{scheduleDate:day},select:{assetId:true,productId:true}});
  const missing=Math.max(0,target-existing.length);
  if(missing===0)return {status:"TARGET_MET" as const,created:0,day};
  const count=await db.reelJob.count({where:{status:{in:["QUEUED","RENDERING"]}}});
  const room=Math.max(0,5-count);
  if(!room)return {status:"QUEUE_FULL" as const,created:0,day};
  const photos=await db.creativeAsset.findMany({orderBy:{createdAt:"desc"},take:150,
    include:{product:{select:{title:true,material:true,productUrl:true}}}});
  const alreadyUsed=new Set(existing.map(x=>x.assetId));
  const usedProducts=new Set(existing.map(x=>x.productId));
  const options=chooseDistinctPhotoProducts(photos.filter(p=>!usedProducts.has(p.productId)),alreadyUsed,Math.min(room,missing));
  if(options.length===0)return {status:"NO_NEW_OWNER_PHOTOS" as const,created:0,day};
  const result=await db.reelJob.createMany({data:options.map(p=>({
    productId:p.productId,assetId:p.id,
    titleSnapshot:p.product.title,materialSnapshot:p.product.material,
    linkSnapshot:p.product.productUrl,
    scheduleDate:day,durationSeconds:20,status:"QUEUED" as const,
  })),skipDuplicates:true});
  if(result.count>0)await db.systemAudit.create({data:{
    event:"DAILY_ORIGINAL_REELS_QUEUED",actor:"HQ_LOCAL_CREATIVE_SCHEDULER",
    reason:result.count+" original product-photo Reels queued for "+day+
      ". Owner enabled daily target "+target+"; no external publishing.",
  }});
  return {status:"SCHEDULED" as const,created:result.count,day};
}
