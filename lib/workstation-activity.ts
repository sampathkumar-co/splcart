/**
 * Real owner-workstation activity lens: read only from authenticated HQ tasks.
 * No simulation, guessing, external sends or independent background polling.
 */
import {ROLE_SPECS,type AgentStatus} from "./agent-roster";
import type {ScreenTask} from "./workstation-display";

export type HeadquartersWorkspace="overview"|"leads"|"research"|"products"|"creative"|"inbox";
export type ActivityEntry={
 id:string;createdAt:string;state:string;summary:string;sourceUrl:string|null;
 sourceLabel:string|null;kind:"LOCAL_HQ_CHECK"|"BROWSER_INSPECTION"|"LOCAL_REEL_JOB";
};
export type WorkstationResearchRun={
 id:string;status:string;startedAt:string;sourceUrl:string;pageTitle:string|null;
 errorCode:string|null;
};
export type WorkstationReelJob={
 id:string;status:string;createdAt:string;startedAt:string|null;
 titleSnapshot:string;errorCode:string|null;
};

/** Every actual role opens an existing owner-owned work area; none triggers work. */
const ROLE_WORKSPACE:Record<(typeof ROLE_SPECS)[number]["id"],HeadquartersWorkspace>={
 "general-manager":"overview",
 "marketing-manager":"creative",
 "trend-research":"research",
 "creative-director":"creative",
 "reel-generation":"creative",
 "social-publishing":"creative",
 "marketing-performance":"creative",
 "sales-manager":"leads",
 "customer-conversation":"inbox",
 "jewellery-recommendation":"products",
 "lead-follow-up":"leads",
 "wholesale-relationship":"leads",
 "customer-retention":"leads",
 "instagram-discovery":"leads",
 "web-discovery":"research",
 "wholesale-calling":"leads",
};
export function workstationWorkspace(roleId:string):HeadquartersWorkspace|null {
 return Object.prototype.hasOwnProperty.call(ROLE_WORKSPACE,roleId)?
   ROLE_WORKSPACE[roleId as keyof typeof ROLE_WORKSPACE]:null;
}

export const WORKSPACE_NAMES:Record<HeadquartersWorkspace,string>={
 overview:"Headquarters",leads:"Wholesale Pipeline",research:"Source Research",
 products:"Owner Catalogue",creative:"Creative Studio",inbox:"Customer Inbox",
};

function compact(value:string,max=126){
 return value.replace(/[\r\n\t]+/g," ").replace(/\s+/g," ").trim().slice(0,max);
}
/**
 * URLs must be explicit public HTTPS source references. Never turn saved
 * file://, javascript:, localhost, internal hosts or embedded credentials into
 * clickable links. No network request is made by this validation.
 */
export function permittedEvidenceUrl(raw:unknown):string|null {
 if(typeof raw!=="string"||raw.length>1800)return null;
 try{
  const u=new URL(raw);
  const host=u.hostname.toLowerCase();
  if(u.protocol!=="https:"||u.username||u.password||
     !host.includes(".")||host==="localhost"||
     host.endsWith(".localhost")||host.endsWith(".local")||
     host.endsWith(".internal")||host.endsWith(".test")||
     /^\d+(?:\.\d+){3}$/.test(host)||host.startsWith("[")||
     /[\s\x00-\x1f]/.test(raw))return null;
  return u.href;
 }catch{return null;}
}

export function latestWorkstationActivity(
 roleId:string,
 tasks:readonly ScreenTask[],
 roleStatus:AgentStatus,
 limit=3,
 researchRuns:readonly WorkstationResearchRun[]=[],
 reelJobs:readonly WorkstationReelJob[]=[],
):ActivityEntry[] {
 if(!workstationWorkspace(roleId))return [];
 const taskEntries:ActivityEntry[]=tasks.filter(t=>t.roleId===roleId).map(t=>{
   const first=(t.result?.items??[]).find(i=>permittedEvidenceUrl(i.sourceUrl));
   const fallback=(t.sourceUrls??[]).map(permittedEvidenceUrl).find((u):u is string=>!!u);
   const state=t.status==="RUNNING"&&roleStatus!=="RUNNING"?
     "RUNNING RECORD · NOT CONFIRMED LIVE":t.status.replaceAll("_"," ");
   return {
    id:"task:"+t.id,
    kind:"LOCAL_HQ_CHECK" as const,
    createdAt:t.createdAt,
    state,
    summary:compact(t.result?.summary||t.errorCode||
      (t.status==="RUNNING"?"Task started; no outcome recorded":"No task outcome recorded")),
    sourceUrl:permittedEvidenceUrl(first?.sourceUrl)||fallback||null,
    sourceLabel:first?compact(first.label||"Recorded source",48):
      fallback?"Stored HQ source reference":null,
   };
  });
 const browserEntries:ActivityEntry[]=roleId==="web-discovery"?
  researchRuns.map(run=>({
    id:"browser:"+run.id,kind:"BROWSER_INSPECTION" as const,
    createdAt:run.startedAt,
    state:run.status==="RUNNING"?
      "RUNNING RECORD · VERIFY CURRENT":run.status.replaceAll("_"," "),
    summary:compact(run.pageTitle||run.errorCode||
      "Saved browser inspection of an independently supplied source"),
    sourceUrl:permittedEvidenceUrl(run.sourceUrl),
    sourceLabel:permittedEvidenceUrl(run.sourceUrl)?"Inspected official website":null,
  })):[];
 const reelEntries:ActivityEntry[]=roleId==="reel-generation"?
  reelJobs.map(reel=>{
    const fresh=reel.startedAt&&Number.isFinite(Date.parse(reel.startedAt))&&
      Date.now()>=Date.parse(reel.startedAt)&&
      Date.now()-Date.parse(reel.startedAt)<15*60_000;
    const state=reel.status==="RENDERING"&&!(fresh&&roleStatus==="RUNNING")?
      "RENDER RECORD · REVIEW":reel.status.replaceAll("_"," ");
    return {
      id:"reel:"+reel.id,kind:"LOCAL_REEL_JOB" as const,
      createdAt:reel.createdAt,state,
      summary:compact(reel.titleSnapshot||reel.errorCode||
        "Local code-rendered HQ Reel job; see Creative Studio"),
      sourceUrl:null,sourceLabel:null,
    };
  }):[];
 return [...taskEntries,...browserEntries,...reelEntries].sort((a,b)=>{
   const ta=Date.parse(a.createdAt),tb=Date.parse(b.createdAt);
   return (Number.isFinite(tb)?tb:0)-(Number.isFinite(ta)?ta:0)||
     b.id.localeCompare(a.id);
  }).slice(0,Math.max(0,Math.min(5,Math.floor(limit))));
}
