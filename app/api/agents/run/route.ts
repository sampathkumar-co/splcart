import {z} from "zod";
import {db} from "@/lib/prisma";
import {apiError} from "@/lib/validation";
import {consumeRateLimit,throttled} from "@/lib/rate-limit";
import {ROLE_SPECS} from "@/lib/agent-roster";
import {evaluateLocalRole} from "@/lib/local-agents";
import {loadLocalContext} from "@/lib/agent-context";
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
      const context=await loadLocalContext();
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
