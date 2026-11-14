/**
 * Contract for the owner's requested sixteen-role organisation.
 * A role definition is not an active agent. Status is calculated from real persisted
 * evidence or explicitly marked NOT_CONFIGURED / MANUAL_ONLY.
 */
export const ROLE_SPECS = [
  { id:"general-manager", name:"AI General Manager", short:"GM", room:"ceo", description:"Delegation and executive oversight; orchestration not configured." },
  { id:"marketing-manager", name:"Marketing Manager", short:"M01", room:"marketing", description:"Campaign coordination; not configured." },
  { id:"trend-research", name:"Trend Research", short:"M02", room:"marketing", description:"Jewellery research; not configured." },
  { id:"creative-director", name:"Creative Director", short:"M03", room:"marketing", description:"Original creative briefs; not configured." },
  { id:"reel-generation", name:"Reel Generation", short:"M04", room:"marketing", description:"Code-rendered Reels; not configured." },
  { id:"social-publishing", name:"Social Publishing", short:"M05", room:"marketing", description:"Approved social publishing; not configured." },
  { id:"marketing-performance", name:"Marketing Performance", short:"M06", room:"marketing", description:"Campaign attribution; not configured." },
  { id:"sales-manager", name:"Sales Manager", short:"S01", room:"sales", description:"Sales supervision; no autonomous manager configured." },
  { id:"customer-conversation", name:"Customer Conversation", short:"S02", room:"sales", description:"Opted-in inbound messages; not configured." },
  { id:"jewellery-recommendation", name:"Jewellery Recommendation", short:"S03", room:"sales", description:"Owner-controlled product recording and matching tools exist; no autonomous advisor." },
  { id:"lead-follow-up", name:"Lead Follow-up", short:"S04", room:"sales", description:"Follow-up recording is manual; agent not configured." },
  { id:"wholesale-relationship", name:"Wholesale Relationship", short:"S05", room:"sales", description:"Owner-reviewed wholesale pipeline exists; no autonomous relationship agent." },
  { id:"customer-retention", name:"Customer Retention", short:"S06", room:"sales", description:"Repeat-customer messaging; not configured." },
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

/** Accepts only real stored browser-run statuses, never made-up activity. */
export function getAgentRecords(
  runs: readonly { status: string; startedAt: Date }[],
  now = new Date(),
): AgentRecord[] {
  const recentRuns = runs.filter(r => now.getTime() - r.startedAt.getTime() < 90_000 && r.startedAt.getTime() <= now.getTime());
  const browserBusy = recentRuns.some(r => r.status === "RUNNING");
  const inspected = runs.filter(r => r.status === "COMPLETED").length;
  return ROLE_SPECS.map(role => ({
    ...role,
    status: role.id === "web-discovery" ? (browserBusy ? "RUNNING" : "ON_DEMAND")
      : ["jewellery-recommendation", "wholesale-relationship"].includes(role.id) ? "MANUAL_ONLY" : "NOT_CONFIGURED",
    evidenceCount: role.id === "web-discovery" ? inspected : 0,
  }));
}
