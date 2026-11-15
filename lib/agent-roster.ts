/**
 * Contract for the owner's requested sixteen-role organisation.
 * A role definition is not an active agent. Status is calculated from real persisted
 * evidence or explicitly marked NOT_CONFIGURED / MANUAL_ONLY.
 */
export const ROLE_SPECS = [
  { id:"general-manager", name:"AI General Manager", short:"GM", room:"ceo", description:"Owner-triggered evidence-based executive report; not an autonomous executive." },
  { id:"marketing-manager", name:"Marketing Manager", short:"M01", room:"marketing", description:"Local campaign workload from real product and creative records; no auto publishing." },
  { id:"trend-research", name:"Trend Research", short:"M02", room:"marketing", description:"Summarize actual permitted website inspections, without fabricating trends." },
  { id:"creative-director", name:"Creative Director", short:"M03", room:"marketing", description:"Local briefs from actual owner-uploaded product photography." },
  { id:"reel-generation", name:"Reel Generation", short:"M04", room:"marketing", description:"Genuine FFmpeg 20-second product Reels; local owner-triggered and opt-in scheduling." },
  { id:"social-publishing", name:"Social Publishing", short:"M05", room:"marketing", description:"Owner-approved MP4 and manual Instagram/YouTube caption handoff; no auto-post." },
  { id:"marketing-performance", name:"Marketing Performance", short:"M06", room:"marketing", description:"Campaign attribution; not configured." },
  { id:"sales-manager", name:"Sales Manager", short:"S01", room:"sales", description:"Source-backed ranked lead evidence report on demand; no autonomous decisions." },
  { id:"customer-conversation", name:"Customer Conversation", short:"S02", room:"sales", description:"Opted-in inbound messages; not configured." },
  { id:"jewellery-recommendation", name:"Jewellery Recommendation", short:"S03", room:"sales", description:"Local category-matched owner-attested product recommendations, no stock claims." },
  { id:"lead-follow-up", name:"Lead Follow-up", short:"S04", room:"sales", description:"Local consent-aware due-for-follow-up candidates; all sending remains manual." },
  { id:"wholesale-relationship", name:"Wholesale Relationship", short:"S05", room:"sales", description:"Local owner-approved permissioned wholesale relationship shortlist." },
  { id:"customer-retention", name:"Customer Retention", short:"S06", room:"sales", description:"Owner-reported retention candidates with explicit eligible contact; no messaging." },
  { id:"instagram-discovery", name:"Instagram Lead Discovery", short:"S07", room:"sales", description:"Public research proposals only; no Instagram automation or unsolicited DMs." },
  { id:"web-discovery", name:"Google & Web Discovery", short:"S08", room:"sales", description:"Owner-triggered permitted Playwright website inspection; no autonomous Google crawling." },
  { id:"wholesale-calling", name:"Wholesale AI Phone Calling", short:"S09", room:"sales", description:"Compliant opt-in voice workflow not configured." },
] as const;

export type AgentRole = typeof ROLE_SPECS[number];
export type AgentRoom = "ceo" | "marketing" | "sales" | "meeting";
export type AgentStatus = "RUNNING" | "ON_DEMAND" | "MANUAL_ONLY" | "NOT_CONFIGURED";
export type AgentRecord = {
  id: string; name: string; short: string; room: AgentRoom;
  description: string; status: AgentStatus; evidenceCount: number;
};

/** Source-derived live state; not a simulated 16-agent workforce. */
const ON_DEMAND_IDS = new Set([
 "general-manager","marketing-manager","trend-research","creative-director",
 "reel-generation","social-publishing","sales-manager","jewellery-recommendation",
 "lead-follow-up","wholesale-relationship","customer-retention","web-discovery",
]);

export function getAgentRecords(
  runs: readonly {status:string;startedAt:Date}[],
  now=new Date(),
  tasks:readonly {roleId:string;status:string;createdAt:Date}[]=[],
):AgentRecord[]{
  const recentRuns=runs.filter(r=>now.getTime()>=r.startedAt.getTime() &&
    now.getTime()-r.startedAt.getTime()<90_000);
  const browserBusy=recentRuns.some(r=>r.status==="RUNNING");
  const realBrowserCount=runs.filter(r=>r.status==="COMPLETED").length;
  return ROLE_SPECS.map(role=>{
    const actualTasks=tasks.filter(t=>t.roleId===role.id);
    const running=actualTasks.some(t=>t.status==="RUNNING" &&
      now.getTime()>=t.createdAt.getTime() && now.getTime()-t.createdAt.getTime()<90_000);
    const actualCompletions=actualTasks.filter(t=>t.status==="COMPLETED").length;
    return {...role,status:running||(role.id==="web-discovery"&&browserBusy)?"RUNNING":
      ON_DEMAND_IDS.has(role.id)?"ON_DEMAND":"NOT_CONFIGURED",
      evidenceCount:actualCompletions+(role.id==="web-discovery"?realBrowserCount:0)};
  });
}
