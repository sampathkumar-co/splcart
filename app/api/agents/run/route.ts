import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError} from "@/lib/validation";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
import {ROLE_SPECS} from "@/lib/agent-roster";
import {evaluateLocalRole,type LocalContext} from "@/lib/local-agents";
export const runtime="nodejs";
export const dynamic="force-dynamic";
const request=z.object({roleId:z.string().min(3).max(70)}).strict();

export async function GET() {
  try{
    const tasks=await db.agentTask.findMany({orderBy:{createdAt:"desc"},take:60});
    return Response.json({tasks:tasks.map(t=>({
      id:t.id,roleId:t.roleId,status:t.status,action:t.action,
      result:t.resultJson,errorCode:t.errorCode,sourceUrls:t.sourceUrls,
      modelCostPaise:t.modelCostPaise,createdAt:t.createdAt.toISOString(),
      finishedAt:t.finishedAt?.toISOString()||null,
    }))},{headers:{"Cache-Control":"no-store"}});
  }catch(e){return apiError(e);}
}
export async function POST(req:Request) {
  try{
    const limits=await consumeRateLimit("owner-agent-tasks",50,86400_000);
    if(!limits.allowed)return throttled(limits.retryAfterSeconds);
    const input=request.parse(await req.json());
    if(!ROLE_SPECS.some(r=>r.id===input.roleId))
      return Response.json({error:"UNKNOWN_AGENT_ROLE"},{status:400});
    const task=await db.agentTask.create({data:{
      roleId:input.roleId,action:"OWNER_TRIGGERED_LOCAL_EVIDENCE_REPORT",status:"RUNNING",
    }});
    try{
      const [leads,products,reels,photos,research,publications]=await Promise.all([
        db.prospect.findMany({orderBy:{updatedAt:"desc"},take:200,
          select:{id:true,name:true,category:true,stage:true,decision:true,
            businessSourceUrl:true,updatedAt:true,verifiedBusinessAt:true,
            wholesaleIntentEvidenceUrl:true,contactConsentUrl:true,consentGrantedAt:true,
            activities:{orderBy:{createdAt:"desc"},take:1,select:{createdAt:true}},
            conversion:{select:{id:true}},
          }}),
        db.product.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,title:true,category:true,material:true,productUrl:true}}),
        db.reelJob.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,status:true,productId:true,titleSnapshot:true}}),
        db.creativeAsset.findMany({orderBy:{createdAt:"desc"},take:150,
          select:{id:true,productId:true}}),
        db.researchRun.findMany({orderBy:{startedAt:"desc"},take:100,
          select:{id:true,sourceUrl:true,status:true,provider:true,pageTitle:true}}),
        db.socialPublication.findMany({orderBy:{recordedAt:"desc"},take:80,
          select:{id:true,platform:true,postUrl:true,
            reel:{select:{titleSnapshot:true}},
            metrics:{orderBy:{observedAt:"desc"},take:1,
              select:{views:true,likes:true,enquiries:true,sourceLabel:true}}},
        }),
      ]);
      const context:LocalContext={now:new Date(),
        leads:leads.map(p=>({id:p.id,name:p.name,category:p.category,stage:p.stage,
          decision:p.decision,sourceUrl:p.businessSourceUrl,updatedAt:p.updatedAt,
          verifiedBusinessAt:p.verifiedBusinessAt,
          wholesaleIntentEvidenceUrl:p.wholesaleIntentEvidenceUrl,contactConsentUrl:p.contactConsentUrl,
          consentGrantedAt:p.consentGrantedAt,
          lastActivityAt:p.activities[0]?.createdAt??null,reportedOrder:!!p.conversion})),
        products,reels,photos,research,
        socialPosts:publications.map(p=>({
          id:p.id,platform:p.platform,title:p.reel.titleSnapshot,
          postUrl:p.postUrl,
          views:p.metrics[0]?.views??null,likes:p.metrics[0]?.likes??null,
          enquiries:p.metrics[0]?.enquiries??null,
          metricSource:p.metrics[0]?.sourceLabel??null,
        }))};
      const report=evaluateLocalRole(input.roleId,context);
      const saved=await db.agentTask.update({where:{id:task.id},data:{
        status:report.status,
        resultJson:{summary:report.summary,items:report.items,computeCost:report.computeCost},
        errorCode:report.errorCode,
        sourceUrls:report.evidenceUrls,
        modelCostPaise:report.modelCostPaise,
        finishedAt:new Date(),
      }});
      return Response.json({id:saved.id,roleId:input.roleId,status:saved.status,
        errorCode:saved.errorCode,report,
        message:saved.status==="COMPLETED"?"Real HQ evidence report completed. No external communication was sent.":
        "Task explicitly blocked: "+report.summary},{status:200});
    }catch(error){
      await db.agentTask.update({where:{id:task.id},data:{
        status:"FAILED",errorCode:"LOCAL_TASK_FAILED",finishedAt:new Date(),
      }});
      throw error;
    }
  }catch(e){return apiError(e);}
}
