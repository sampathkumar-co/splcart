/**
 * Fully deterministic, source-linked LOCAL role operations. No LLM API, fake
 * search, browsing, content publishing, telephone calls or outbound messages.
 * A BLOCKED result is a real task outcome, not simulated agent work.
 */
import { ROLE_SPECS } from "./agent-roster";

export type LocalLead={
  id:string;name:string;category:string;stage:string;decision:string;
  sourceUrl:string;updatedAt:Date;verifiedBusinessAt:Date|null;
  wholesaleIntentEvidenceUrl:string|null;contactConsentUrl:string|null;
  consentGrantedAt:Date|null; lastActivityAt:Date|null;
  reportedOrder:boolean;
};
export type LocalProduct={id:string;title:string;category:string;material:string;productUrl:string};
export type LocalReel={id:string;status:string;productId:string;titleSnapshot:string};
export type LocalPhoto={id:string;productId:string};
export type LocalBrowserRun={id:string;sourceUrl:string;status:string;provider:string;pageTitle:string|null};
export type LocalSocialPost={id:string;platform:"INSTAGRAM"|"YOUTUBE";title:string;postUrl:string;views:number|null;likes:number|null;enquiries:number|null;metricSource:string|null};
export type LocalContext={
  leads:LocalLead[];products:LocalProduct[];reels:LocalReel[];photos:LocalPhoto[];
  research:LocalBrowserRun[];socialPosts:LocalSocialPost[];now:Date;
};
export type LocalAgentReport={
  status:"COMPLETED"|"BLOCKED";roleId:string;summary:string;
  items:{label:string;details:string;sourceUrl?:string}[];
  evidenceUrls:string[];errorCode:string|null;
  modelCostPaise:0; computeCost:"NOT_METERED";
};

export const NO_KEY_TASK_ROLES = new Set([
  "general-manager","marketing-manager","trend-research","creative-director",
  "reel-generation","social-publishing","sales-manager",
  "jewellery-recommendation","lead-follow-up","wholesale-relationship",
  "customer-retention","web-discovery",
]);

function report(roleId:string,summary:string,items:LocalAgentReport["items"]):LocalAgentReport{
 return {roleId,status:"COMPLETED",summary,items,
   evidenceUrls:[...new Set(items.map(i=>i.sourceUrl).filter((s):s is string=>!!s))],
   errorCode:null,modelCostPaise:0,computeCost:"NOT_METERED"};
}
function blocked(roleId:string,errorCode:string,summary:string):LocalAgentReport{
 return {roleId,status:"BLOCKED",summary,items:[],evidenceUrls:[],
   errorCode,modelCostPaise:0,computeCost:"NOT_METERED"};
}
function consent(lead:LocalLead,now:Date){
 return !!lead.contactConsentUrl && !!lead.consentGrantedAt &&
   now.getTime()>=lead.consentGrantedAt.getTime() &&
   now.getTime()-lead.consentGrantedAt.getTime()<=365*86400_000;
}
function list(leads:LocalLead[]){
 return leads.slice(0,12).map(p=>({
   label:p.name,details:"Stage "+p.stage+
     "; category "+p.category+"; recorded source is owner-reviewed only when independently checked",
   sourceUrl:p.sourceUrl,
 }));
}

export function evaluateLocalRole(roleId:string,context:LocalContext):LocalAgentReport {
 if(!ROLE_SPECS.some(r=>r.id===roleId))return blocked(roleId,"UNKNOWN_AGENT_ROLE","Role not in the authorized headquarters roster.");
 const {leads,products,reels,photos,research,socialPosts,now}=context;
 const approved=leads.filter(p=>p.decision==="APPROVED");
 const verified=leads.filter(p=>!!p.verifiedBusinessAt);
 const permissioned=approved.filter(p=>consent(p,now));
 const rendered=reels.filter(r=>["RENDERED","APPROVED"].includes(r.status));
 const approvedVideos=reels.filter(r=>r.status==="APPROVED");
 const completedRuns=research.filter(r=>r.status==="COMPLETED"&&r.provider==="PLAYWRIGHT");

 switch(roleId){
 case "general-manager":{
   return report(roleId,"Local HQ evidence report; no decisions or revenue invented.",[
     {label:"Retailers",details:leads.length+" recorded; "+verified.length+" owner-reviewed website evidence entries"},
     {label:"Owner decisions",details:approved.length+" approved; "+permissioned.length+" approved with documented eligible contact"},
     {label:"Real creative jobs",details:reels.length+" queued/rendered/approved records; "+rendered.length+" actual rendered outputs"},
     {label:"Business result",details:leads.filter(p=>p.reportedOrder).length+
       " owner-reported orders, not payment-verified revenue"},
   ]);
 }
 case "marketing-manager":
   if(!products.length)return blocked(roleId,"NO_OWNER_PRODUCTS","Owner must add authentic catalogue references before planning promotions.");
   return report(roleId,"Owner-ready local creative workload; no trend or demand predictions.",[
     {label:"Catalogue",details:products.length+" owner-supplied products available as copy sources"},
     {label:"Photography",details:photos.length+" verified uploads recorded for product video use"},
     {label:"Video reviews",details:rendered.length+" real rendered videos; "+approvedVideos.length+" approved for MANUAL publishing"},
   ]);
 case "trend-research":
   if(!completedRuns.length)return blocked(roleId,"NO_REAL_BROWSER_EVIDENCE","No eligible owner-triggered retailer website captures to summarize.");
   return report(roleId,"Archive of actual permitted browser visits only; not a validated market trend.",completedRuns.slice(0,10)
     .map(r=>({label:r.pageTitle||"Inspected website",details:"Real completed browser visit; independent trend claims not made",sourceUrl:r.sourceUrl})));
 case "creative-director":
   if(!photos.length)return blocked(roleId,"NO_OWNER_PRODUCT_PHOTOS","Upload a real owner-provided jewellery photograph before making a brief.");
   return report(roleId,"Code-native 20-second silent jewellery video briefs; no AI-person generation.",
     photos.slice(0,10).map(a=>{
       const p=products.find(x=>x.id===a.productId);
       return {label:p?.title||"Owner photo",details:"Original product-photo motion, warm gold typography, vertical 9:16, 20s; no fabricated offers",sourceUrl:p?.productUrl};
     }));
 case "reel-generation":
   if(!reels.length)return blocked(roleId,"NO_LOCAL_REEL_JOBS","No FFmpeg videos have been queued or rendered.");
   return report(roleId,"Observed local renderer job states. This report does not itself render or publish.",
     reels.slice(0,10).map(r=>({label:r.titleSnapshot,details:"Actual job status: "+r.status+"; ID "+r.id})));
 case "social-publishing":
   if(!approvedVideos.length)return blocked(roleId,"NO_OWNER_APPROVED_VIDEOS","Approve a real rendered MP4 before creating a manual publishing handoff.");
   return report(roleId,"Owner manual social handoff is ready; no Instagram/YouTube post was sent.",
     approvedVideos.slice(0,10).map(r=>({label:r.titleSnapshot,details:"Approved MP4 "+r.id+"; copy a verified-facts caption in Creative Studio and publish yourself"})));
 case "sales-manager":
   if(!verified.length)return blocked(roleId,"NO_OWNER_REVIEWED_RETAILERS","No retailer website evidence has been owner-reviewed.");
   return report(roleId,"Source-backed owner-reviewed retailer shortlist; no unverified sales forecast.",
     list(verified.sort((a,b)=>Number(!!b.wholesaleIntentEvidenceUrl)-Number(!!a.wholesaleIntentEvidenceUrl))));
 case "jewellery-recommendation":{
   const found=leads.flatMap(p=>products.filter(product=>p.category.trim().toLowerCase()===product.category.trim().toLowerCase())
     .map(product=>({label:product.title+" → "+p.name,
       details:"Category relevance only. Price, availability and compatibility are OWNER_ATTESTED, not independently verified.",
       sourceUrl:product.productUrl})));
   return found.length?report(roleId,"Category-matched real owner products, not automated stock or price verification.",found.slice(0,12)):
     blocked(roleId,"NO_CATEGORY_MATCH","No recorded retailer and owner product share a category.");
 }
 case "lead-follow-up":{
   const due=permissioned.filter(p=>!["WON_VERIFIED","WON_REPORTED","LOST"].includes(p.stage) &&
     (now.getTime()-(p.lastActivityAt||p.updatedAt).getTime())>=7*86400_000);
   return due.length?report(roleId,"Permissioned owner-reviewed follow-up candidates. No message sent.",list(due)):
     blocked(roleId,"NO_PERMISSIONED_FOLLOWUPS","No owner-approved, eligible prospect is due after seven days.");
 }
 case "wholesale-relationship":
   return permissioned.length?report(roleId,"Owner-permissioned wholesale relationships for MANUAL review.",list(permissioned)):
     blocked(roleId,"NO_PERMISSIONED_WHOLESALE_LEADS","No approved leads have documented eligible contact permission.");
 case "customer-retention":{
   const rows=permissioned.filter(p=>p.reportedOrder);
   return rows.length?report(roleId,"Owner-reported prior orders only; no automatic recontact.",list(rows)):
     blocked(roleId,"NO_ELIGIBLE_REPORTED_CUSTOMERS","No eligible contact and owner-reported order pairs available.");
 }
 case "web-discovery":
   return completedRuns.length?report(roleId,"Actual completed Playwright website inspections; never automatic Google crawling.",
     completedRuns.slice(0,12).map(r=>({label:r.pageTitle||"Inspected site",
       details:"Successfully captured owner-requested browser source; not proof of legal identity",sourceUrl:r.sourceUrl}))):
     blocked(roleId,"NO_COMPLETED_BROWSER_RUNS","No completed real browser sessions yet. Use Web Discovery manually.");
 case "marketing-performance":{
   const measured=socialPosts.filter(p=>p.metricSource==="OWNER_REPORTED" &&
     (p.views!==null||p.likes!==null||p.enquiries!==null));
   if(!measured.length)return blocked(roleId,"NO_OWNER_REPORTED_METRICS",
     "No owner-observed Instagram/YouTube post metrics recorded. Platform analytics API and verification are NOT connected.");
   return report(roleId,"Owner-entered post snapshots only. NOT independently platform-verified, not confirmed revenue.",
     measured.slice(0,15).map(p=>({
       label:p.platform+" · "+p.title,
       details:(p.views??"Unknown")+" reported views · "+(p.likes??"Unknown")+
         " reported likes · "+(p.enquiries??"Unknown")+" reported enquiries. Source: OWNER_REPORTED.",
       sourceUrl:p.postUrl,
     })));
 }
 case "customer-conversation":
   return blocked(roleId,"NO_OPTED_IN_INBOUND_CHANNEL","No consent-aware inbound Instagram/WhatsApp/website account connection is configured.");
 case "instagram-discovery":
   return blocked(roleId,"INSTAGRAM_RESEARCH_MANUAL_ONLY","Research leads manually on the platform; automated cold DMs/scraping are not enabled.");
 case "wholesale-calling":
   return blocked(roleId,"NO_COMPLIANT_PHONE_CHANNEL","No legally authorized caller ID, eligible lead permission or voice calling integration is configured.");
 default:
   return blocked(roleId,"NO_PERMITTED_TOOL","No compliant local tool configured for this role.");
 }
}
