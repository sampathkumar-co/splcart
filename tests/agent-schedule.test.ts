import {describe,it,expect} from "vitest";
import {AGENT_LOCAL_TIME,indiaBusinessClock,agentReportsDue} from "../lib/agent-schedule";
import {indiaBusinessDate} from "../lib/creative-schedule";
describe("owner-only local daily briefing time",()=>{
 it("is pinned to 08:30 Asia/Kolkata",()=>{
  expect(AGENT_LOCAL_TIME).toBe("08:30");
  expect(indiaBusinessClock(new Date("2026-11-15T02:59:00Z"))).toBe("08:29");
  expect(agentReportsDue(new Date("2026-11-15T02:59:00Z"))).toBe(false);
  expect(agentReportsDue(new Date("2026-11-15T03:00:00Z"))).toBe(true);
 });
 it("respects India local calendar, not UTC",()=>{
  expect(indiaBusinessDate(new Date("2026-11-14T20:30:00Z"))).toBe("2026-11-15");
  expect(agentReportsDue(new Date("2026-11-14T20:30:00Z"))).toBe(false);
 });
});
