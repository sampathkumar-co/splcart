/**
 * Source-only micro-screen model for the 16 real Prasanth Jewellers HQ desks.
 * Pure functions: no mock activity, random usage bars, API calls or browser APIs.
 * UI receives the same authenticated agent/task snapshot as the owner console.
 */
import {ROLE_SPECS,type AgentRecord,type AgentStatus} from "./agent-roster";

export type ScreenTask={
 id:string;roleId:string;status:string;createdAt:string;errorCode:string|null;
 result?:{summary?:string;items?:{label:string;details:string;sourceUrl?:string}[]}|null;
 sourceUrls?:readonly string[];
};
export type ScreenRoom="ceo"|"sales"|"marketing"|"meeting";
export type WorkstationSignals={
 reels:{
  queued:number;rendering:number;stalled:number;rendered:number;approved:number;failed:number;
  scope:"LATEST_100_HQ_JOBS";
 };
 openInquiries:number;
 ownerRecordedPosts:number;
 leads:{awaitingReview:number;approved:number};
 research:{running:number;completed:number;blocked:number;scope:"LATEST_30_HQ_RUNS"};
};
export type WorkstationScreenData={
 roleId:string;short:string;name:string;purpose:string;room:ScreenRoom;
 status:AgentStatus;statusText:string;mainNumber:string;numberLabel:string;
 headline:string;detail:string;provenance:string;lastRecordedAt:string|null;
 recentTaskStatuses:string[];accent:string;
};

export const ATELIER_PALETTE={
 obsidian:"#0B0F12",graphite:"#121922",charcoal:"#1B232B",
 gold:"#D4B06A",brass:"#B88A44",ivory:"#F3E9D7",pearl:"#D8C8AF",
 emerald:"#33BA99",sapphire:"#6DB4E8",ruby:"#DE7B7D",amber:"#E2AE59",
 plum:"#B18DD4",
} as const;

/** Labels describe genuine capabilities; they are NOT claims of a completed task. */
const PURPOSE:Record<string,string>={
 "general-manager":"EXECUTIVE EVIDENCE",
 "marketing-manager":"CAMPAIGN READINESS",
 "trend-research":"RECORDED SOURCES",
 "creative-director":"PRODUCT CREATIVE BRIEFS",
 "reel-generation":"LOCAL REEL RENDERING",
 "social-publishing":"MANUAL POST HANDOFF",
 "marketing-performance":"OWNER-REPORTED METRICS",
 "sales-manager":"WHOLESALE PIPELINE",
 "customer-conversation":"OWNER-RECORDED INBOX",
 "jewellery-recommendation":"ATTESTED PRODUCT MATCH",
 "lead-follow-up":"CONSENT CHECK",
 "wholesale-relationship":"RETAILER RELATIONSHIPS",
 "customer-retention":"CONSENTED RETENTION",
 "instagram-discovery":"RESEARCH NOT CONNECTED",
 "web-discovery":"PERMITTED WEB RESEARCH",
 "wholesale-calling":"CALLING NOT CONNECTED",
};
const BLOCKED=new Set(["instagram-discovery","wholesale-calling"]);
const STATUS_LABEL:Record<AgentStatus,string>={
 RUNNING:"RUNNING",ON_DEMAND:"ON DEMAND",MANUAL_ONLY:"MANUAL ONLY",
 NOT_CONFIGURED:"NOT CONFIGURED",
};
const ACCENTS:Record<ScreenRoom,string>={
 ceo:ATELIER_PALETTE.gold,sales:ATELIER_PALETTE.emerald,
 marketing:ATELIER_PALETTE.plum,meeting:ATELIER_PALETTE.sapphire,
};

function safeSummary(value:string|undefined){
 if(!value)return "";
 // Snapshot summary is owner-only. Sanitize whitespace and limit visual spill.
 return value.replace(/[\r\n\t]+/g," ").replace(/\s+/g," ").trim().slice(0,92);
}
function asTimestamp(value:string):number{
 const n=Date.parse(value);return Number.isFinite(n)?n:-1;
}
function roleStatus(agent:AgentRecord|undefined,roleId:string):AgentStatus{
 if(BLOCKED.has(roleId))return "NOT_CONFIGURED";
 return agent?.status??"NOT_CONFIGURED";
}
export function buildWorkstationScreen(
 roleId:string,
 agents:readonly AgentRecord[],
 tasks:readonly ScreenTask[],
 signals:WorkstationSignals|null=null,
):WorkstationScreenData|null {
 const role=ROLE_SPECS.find(r=>r.id===roleId);
 if(!role)return null;
 const agent=agents.find(a=>a.id===roleId);
 const status=roleStatus(agent,roleId);
 const roleTasks=tasks.filter(t=>t.roleId===roleId)
   .sort((a,b)=>asTimestamp(b.createdAt)-asTimestamp(a.createdAt)||
     b.id.localeCompare(a.id));
 const last=roleTasks[0];
 const forcedOffline=BLOCKED.has(roleId);
 const count=forcedOffline?0:Math.max(0,Math.trunc(agent?.evidenceCount??0));
 let headline:string,detail:string,provenance:string;
 if(forcedOffline){
  headline="INTEGRATION UNAVAILABLE";
  detail=roleId==="wholesale-calling"?
   "No compliant dialer or live phone calls":"No Instagram discovery automation or DMs";
  provenance="PROVIDER NOT CONFIGURED";
 }else if(last?.status==="RUNNING"&&status==="RUNNING"){
  headline="RECORDED TASK IN PROGRESS";
  detail=safeSummary(last.result?.summary)||"No result recorded yet";
  provenance="PERSISTED HQ AGENT TASK";
 }else if(last?.status==="RUNNING"){
  // Old RUNNING rows are not permission to display a live worker forever.
  headline="LAST TASK NOT CONFIRMED ACTIVE";
  detail="No current task confirmed by HQ status";
  provenance="PERSISTED HQ AGENT TASK";
 }else if(!last&&status==="RUNNING"){
  headline="RECORDED BROWSER RUN ACTIVE";
  detail="No task completion recorded";
  provenance="PERSISTED BROWSER STATUS";
 }else if(last?.status==="COMPLETED"){
  headline="LAST LOCAL CHECK COMPLETE";
  detail=safeSummary(last.result?.summary)||"Recorded report available in owner console";
  provenance="PERSISTED HQ AGENT TASK";
 }else if(last?.status==="BLOCKED"||last?.status==="FAILED"){
  headline="LAST LOCAL CHECK BLOCKED";
  detail=last.errorCode?"Reason: "+safeSummary(last.errorCode):
   safeSummary(last.result?.summary)||"Check failed or was blocked";
  provenance="PERSISTED HQ AGENT TASK";
 }else{
  headline=status==="ON_DEMAND"?"READY FOR OWNER REQUEST":"NO CONNECTED EXECUTION";
  detail=status==="ON_DEMAND"?"No recent task in the loaded HQ history":
    "This role is not configured to execute";
  provenance="NO TASK RECORD";
 }
 // Higher-value role telemetry comes from the SAME authenticated HQ database,
 // never from decorative motion or a fabricated external integration.
 let mainNumber=String(count);
 let numberLabel="RECORDED EVIDENCE";
 let sourceTime:string|null=last?.createdAt??null;
 if(signals&&!forcedOffline){
  if(roleId==="reel-generation"){
   const r=signals.reels;
   mainNumber=String(r.rendering);
   numberLabel="REELS RENDERING";
   headline=r.rendering>0?"FFMPEG RENDER JOB ACTIVE":
    r.stalled>0?"STALE RENDER NEEDS OWNER REVIEW":
    r.queued>0?"LOCAL RENDER QUEUE PENDING":"NO ACTIVE LOCAL RENDERS";
   detail="Queued: "+r.queued+" | Rendered: "+r.rendered+
    " | Approved: "+r.approved+" | Stale: "+r.stalled+" (recent 100)";
   provenance="PERSISTED HQ REEL JOBS";sourceTime=null;
  }else if(roleId==="customer-conversation"){
   mainNumber=String(signals.openInquiries);
   numberLabel="OPEN INQUIRIES";
   headline=signals.openInquiries>0?"OWNER INPUT REQUIRES REVIEW":"NO OPEN OWNER-RECORDED INQUIRIES";
   detail="Owner-transcribed inbound only; no connected account";
   provenance="OWNER-RECORDED HQ INQUIRIES";sourceTime=null;
  }else if(roleId==="social-publishing"){
   mainNumber=String(signals.ownerRecordedPosts);
   numberLabel="OWNER-REPORTED POSTS";
   headline="MANUAL PUBLISHING HANDOFF";
   detail="No automatic Instagram / YouTube posting";
   provenance="OWNER-REPORTED HQ PUBLICATIONS";sourceTime=null;
  }else if(roleId==="marketing-performance"){
   mainNumber=String(signals.ownerRecordedPosts);
   numberLabel="OWNER-REPORTED POSTS";
   headline="NO CONNECTED ANALYTICS API";
   detail="Any social measurements are owner-recorded";
   provenance="OWNER-REPORTED HQ PUBLICATIONS";sourceTime=null;
  }else if(roleId==="general-manager"){
   mainNumber=String(signals.leads.awaitingReview);
   numberLabel="OWNER REVIEWS";
   headline=signals.leads.awaitingReview>0?"PROSPECTS AWAITING APPROVAL":"NO PENDING PROSPECT REVIEWS";
   detail="Real HQ prospects; no payment-verified revenue claim";
   provenance="PERSISTED HQ PROSPECTS";sourceTime=null;
  }else if(roleId==="sales-manager"){
   mainNumber=String(signals.leads.approved);
   numberLabel="APPROVED PROSPECTS";
   headline="OWNER-APPROVED WHOLESALE PIPELINE";
   detail="Approval is not evidence of an order or payment";
   provenance="PERSISTED HQ PROSPECTS";sourceTime=null;
  }else if(roleId==="web-discovery"){
   const r=signals.research;
   mainNumber=String(r.running);
   numberLabel="BROWSER RUNS ACTIVE";
   headline=r.running>0&&status==="RUNNING"?
    "RECORDED BROWSER INSPECTION ACTIVE":"NO CONFIRMED ACTIVE BROWSER";
   detail="Completed: "+r.completed+" | Blocked / failed: "+r.blocked+" (recent 30)";
   provenance="PERSISTED HQ RESEARCH RUNS";sourceTime=null;
  }
 }
 return {
  roleId,short:role.short,name:role.name,purpose:PURPOSE[roleId]||"SOURCE EVIDENCE",
  room:role.room,status,statusText:STATUS_LABEL[status],
  mainNumber,numberLabel,
  headline,detail,provenance,lastRecordedAt:sourceTime,
  recentTaskStatuses:forcedOffline?[]:roleTasks.slice(0,6).map(t=>t.status),
  accent:forcedOffline?ATELIER_PALETTE.ruby:roleId==="web-discovery"?
   ATELIER_PALETTE.sapphire:ACCENTS[role.room],
 };
}
export function buildRoomScreen(
 room:ScreenRoom, agents:readonly AgentRecord[], tasks:readonly ScreenTask[],
){
 const roles=ROLE_SPECS.filter(r=>room==="meeting"?true:r.room===room);
 const relevant=new Set<string>(roles.map(r=>r.id));
 const count=roles.length;
 const active=agents.filter(a=>relevant.has(a.id)&&a.status==="RUNNING").length;
 const blocked=agents.filter(a=>relevant.has(a.id)&&a.status==="NOT_CONFIGURED").length;
 const reports=tasks.filter(t=>relevant.has(t.roleId)&&t.status==="COMPLETED").length;
 return {
  room,
  title:room==="ceo"?"EXECUTIVE INTELLIGENCE":
   room==="sales"?"WHOLESALE COMMAND":room==="marketing"?
   "CREATIVE ATELIER":"REVIEW / DECIDE / SCALE",
  subtitle:room==="meeting"?"All 16 role statuses":"Authenticated HQ evidence",
  active,blocked,reports,count,
  accent:ACCENTS[room],
 };
}
