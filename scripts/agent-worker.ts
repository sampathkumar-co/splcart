/**
 * Dedicated internal-DB-only reporting worker. No browser or social access.
 * --ci-at-due only works for exact ephemeral HQ CI URL, never production.
 */
import {db} from "../lib/prisma";
import {scheduleDailyLocalReports} from "../lib/agent-schedule";
import {indiaBusinessDate} from "../lib/creative-schedule";
const url=process.env.DATABASE_URL;
if(!url)throw new Error("HQ_AGENT_DATABASE_REQUIRED");
if(new URL(url).pathname!=="/hq"||/splcart/i.test(url))
 throw new Error("HQ_AGENT_REFUSES_NON_HQ_DATABASE");
const ciTime=process.argv.includes("--ci-at-due");
if(ciTime && (process.env.HQ_TEST_MODE!=="1" ||
 url!=="postgresql://hq:hq@localhost:5432/hq?schema=public"))
 throw new Error("CI_TIME_OVERRIDE_FORBIDDEN");
async function main(){
 try{
  if(process.argv.includes("--once")||ciTime){
   const now=ciTime?new Date(indiaBusinessDate()+"T14:30:00.000Z"):new Date();
   console.log("HQ_LOCAL_AGENT_SCHEDULE",JSON.stringify(await scheduleDailyLocalReports(now)));
   return;
  }
  for(;;){
   try{
    const result=await scheduleDailyLocalReports();
    if(result.created)console.log("HQ_LOCAL_AGENT_SCHEDULE",JSON.stringify(result));
   }catch(e){console.error("HQ_LOCAL_AGENT_SCHEDULE_ERROR",e instanceof Error?e.message:"unknown");}
   await new Promise(resolve=>setTimeout(resolve,300000));
  }
 }finally{await db.$disconnect();}
}
void main().catch(e=>{console.error("HQ_AGENT_WORKER_FATAL",e instanceof Error?e.message:"unknown");process.exitCode=1;});
