/**
 * Real owner-workstation activity lens: read only from authenticated HQ tasks.
 * No simulation, guessing, external sends or independent background polling.
 */
import {ROLE_SPECS,type AgentStatus} from "./agent-roster";
import type {ScreenTask} from "./workstation-display";

export type HeadquartersWorkspace="overview"|"leads"|"research"|"products"|"creative"|"inbox";
export type ActivityEntry={
 id:string;createdAt:string;state:string;summary:string;sourceUrl:string|null;
 sourceLabel:string|null;
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
):ActivityEntry[] {
 if(!workstationWorkspace(roleId))return [];
 return tasks.filter(t=>t.roleId===roleId)
  .slice().sort((a,b)=>{
   const ta=Date.parse(a.createdAt),tb=Date.parse(b.createdAt);
   return (Number.isFinite(tb)?tb:0)-(Number.isFinite(ta)?ta:0)||
     b.id.localeCompare(a.id);
  }).slice(0,Math.max(0,Math.min(5,Math.floor(limit)))).map(t=>{
   const first=(t.result?.items??[]).find(i=>permittedEvidenceUrl(i.sourceUrl));
   const state=t.status==="RUNNING"&&roleStatus!=="RUNNING"?
     "RUNNING RECORD · NOT CONFIRMED LIVE":t.status.replaceAll("_"," ");
   return {
    id:t.id,
    createdAt:t.createdAt,
    state,
    summary:compact(t.result?.summary||t.errorCode||
      (t.status==="RUNNING"?"Task started; no outcome recorded":"No task outcome recorded")),
    sourceUrl:permittedEvidenceUrl(first?.sourceUrl),
    sourceLabel:first?compact(first.label||"Recorded source",48):null,
   };
  });
}
