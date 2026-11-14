import { describe, expect, it } from "vitest";
import { ROLE_SPECS, getAgentRecords } from "../lib/agent-roster";
const now = new Date("2026-11-14T10:00:00Z");
describe("truthful sixteen-role office", () => {
 it("contains exactly the owner's sixteen roles, without duplicate identifiers", () => {
   expect(ROLE_SPECS).toHaveLength(16);
   expect(new Set(ROLE_SPECS.map(a=>a.id)).size).toBe(16);
 });
 it("never invents active agents when no research jobs were executed", () => {
   const agents=getAgentRecords([],now);
   expect(agents.filter(a=>a.status==="RUNNING")).toHaveLength(0);
   expect(agents.find(a=>a.id==="web-discovery")?.status).toBe("ON_DEMAND");
   expect(agents.find(a=>a.id==="reel-generation")?.status).toBe("NOT_CONFIGURED");
 });
 it("only shows running for recent persisted browser research", () => {
   const running=getAgentRecords([{status:"RUNNING",startedAt:new Date("2026-11-14T09:59:30Z")}],now);
   expect(running.find(a=>a.id==="web-discovery")?.status).toBe("RUNNING");
   expect(running.filter(a=>a.status==="RUNNING")).toHaveLength(1);
   const stale=getAgentRecords([{status:"RUNNING",startedAt:new Date("2026-11-14T09:55:00Z")}],now);
   expect(stale.find(a=>a.id==="web-discovery")?.status).toBe("ON_DEMAND");
 });
 it("counts only completed browser evidence, not unverified attempts", () => {
   const agents=getAgentRecords([
     {status:"FAILED",startedAt:now},{status:"COMPLETED",startedAt:now},
     {status:"BLOCKED",startedAt:now},
   ],now);
   expect(agents.find(a=>a.id==="web-discovery")?.evidenceCount).toBe(1);
 });
});