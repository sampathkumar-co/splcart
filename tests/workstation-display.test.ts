import {describe,it,expect} from "vitest";
import {ROLE_SPECS,getAgentRecords} from "../lib/agent-roster";
import {buildRoomScreen,buildWorkstationScreen,ATELIER_PALETTE} from "../lib/workstation-display";
const empty=getAgentRecords([],new Date("2026-11-15T11:00:00Z"));
const record=(id:string)=>buildWorkstationScreen(id,empty,[])!;
describe("truthful code-native workstation screens",()=>{
 it("has exactly one truthful unique screen for every 16-role desk",()=>{
  const all=ROLE_SPECS.map(r=>record(r.id));
  expect(all).toHaveLength(16);
  expect(new Set(all.map(r=>r.purpose)).size).toBe(16);
  expect(all.every(x=>x.mainNumber==="0")).toBe(true);
  expect(all.every(x=>x.provenance!=="PERSISTED HQ AGENT TASK")).toBe(true);
  expect(all.find(r=>r.roleId==="web-discovery")?.statusText).toBe("ON DEMAND");
  expect(all.find(r=>r.roleId==="wholesale-calling")?.statusText).toBe("NOT CONFIGURED");
  expect(all.find(r=>r.roleId==="instagram-discovery")?.detail).toMatch(/no Instagram/i);
  expect(buildWorkstationScreen("imaginary-autonomous-revenue-bot",empty,[])).toBeNull();
 });
 it("does not fabricate activity or an evidence graph for an empty database",()=>{
  const web=record("web-discovery");
  expect(web.headline).toBe("READY FOR OWNER REQUEST");
  expect(web.recentTaskStatuses).toEqual([]);
  expect(web.lastRecordedAt).toBeNull();
  expect(buildRoomScreen("sales",empty,[]).active).toBe(0);
  expect(buildRoomScreen("marketing",empty,[]).reports).toBe(0);
 });
 it("shows actual latest persisted role report and history, not adjacent role data",()=>{
  const tasks=[
   {id:"old",roleId:"web-discovery",status:"BLOCKED",createdAt:"2026-11-14T11:00:00.000Z",errorCode:"ACCESS_DENIED",result:null},
   {id:"new",roleId:"web-discovery",status:"COMPLETED",createdAt:"2026-11-15T11:00:00.000Z",errorCode:null,result:{summary:"Owner-triggered independent business website inspected"}} ,
   {id:"other",roleId:"reel-generation",status:"RUNNING",createdAt:"2026-11-15T11:01:00.000Z",errorCode:null,result:null},
  ];
  const agents=empty.map(r=>r.id==="web-discovery"?{...r,evidenceCount:3}:r);
  const web=buildWorkstationScreen("web-discovery",agents,tasks)!;
  expect(web.mainNumber).toBe("3");
  expect(web.provenance).toBe("PERSISTED HQ AGENT TASK");
  expect(web.headline).toBe("LAST LOCAL CHECK COMPLETE");
  expect(web.detail).toContain("website inspected");
  expect(web.recentTaskStatuses).toEqual(["COMPLETED","BLOCKED"]);
  const reel=buildWorkstationScreen("reel-generation",agents,tasks)!;
  expect(reel.headline).toBe("LAST TASK NOT CONFIRMED ACTIVE");
  expect(reel.detail).toContain("No current task confirmed");
  expect(reel.mainNumber).toBe("0");
  expect(reel.detail).toMatch(/no result recorded/i);
  expect(buildRoomScreen("sales",agents,tasks).reports).toBe(1);
  expect(buildRoomScreen("marketing",agents,tasks).reports).toBe(0);
 });
 it("never represents blocked phone/Instagram connections as active even with stale tasks",()=>{
  const poisoned=empty.map(r=>r.id==="wholesale-calling"?{...r,status:"RUNNING" as const,evidenceCount:12}:r);
  const tasks=[{id:"spoof",roleId:"wholesale-calling",status:"RUNNING",createdAt:"2026-11-15T11:00:00Z",errorCode:null,result:null}];
  const phone=buildWorkstationScreen("wholesale-calling",poisoned,tasks)!;
  expect(phone.statusText).toBe("NOT CONFIGURED");
  expect(phone.headline).toBe("INTEGRATION UNAVAILABLE");
  expect(phone.mainNumber).toBe("0");
  expect(phone.recentTaskStatuses).toEqual([]);
  expect(phone.detail).toContain("No compliant dialer");
 });
 it("shows actual offline render, owner-inbox and research state without fake activity",()=>{
  const signals={
    reels:{queued:2,rendering:1,stalled:0,rendered:3,approved:2,failed:0,scope:"LATEST_100_HQ_JOBS" as const},
    openInquiries:4,ownerRecordedPosts:5,
    leads:{awaitingReview:6,approved:2},
    research:{running:0,completed:3,blocked:1,scope:"LATEST_30_HQ_RUNS" as const},
  };
  const reel=buildWorkstationScreen("reel-generation",empty,[],signals)!;
  expect(reel.mainNumber).toBe("1");
  expect(reel.headline).toContain("FFMPEG RENDER");
  expect(reel.provenance).toBe("PERSISTED HQ REEL JOBS");
  expect(reel.detail).toContain("Queued: 2");
  const inbox=buildWorkstationScreen("customer-conversation",empty,[],signals)!;
  expect(inbox.mainNumber).toBe("4");
  expect(inbox.provenance).toBe("OWNER-RECORDED HQ INQUIRIES");
  const research=buildWorkstationScreen("web-discovery",empty,[],signals)!;
  expect(research.headline).toBe("NO CONFIRMED ACTIVE BROWSER");
  expect(research.detail).toContain("Completed: 3");
  expect(buildWorkstationScreen("general-manager",empty,[],signals)?.mainNumber).toBe("6");
  expect(buildWorkstationScreen("sales-manager",empty,[],signals)?.mainNumber).toBe("2");
  expect(buildWorkstationScreen("social-publishing",empty,[],signals)?.detail).toContain("No automatic");
  expect(buildWorkstationScreen("wholesale-calling",empty,[],signals)?.headline).toBe("INTEGRATION UNAVAILABLE");
 });
 it("uses luxurious distinct palette without inventing metrics",()=>{
  const ceo=buildRoomScreen("ceo",empty,[]);
  const sales=buildRoomScreen("sales",empty,[]);
  const marketing=buildRoomScreen("marketing",empty,[]);
  expect(new Set([ceo.accent,sales.accent,marketing.accent]).size).toBe(3);
  expect(ATELIER_PALETTE.ivory).toBe("#F3E9D7");
  expect(ceo.reports+sales.reports+marketing.reports).toBe(0);
 });
});
