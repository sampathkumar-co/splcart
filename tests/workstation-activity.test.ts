import {describe,it,expect} from "vitest";
import {ROLE_SPECS,getAgentRecords} from "../lib/agent-roster";
import {latestWorkstationActivity,permittedEvidenceUrl,workstationWorkspace,WORKSPACE_NAMES} from "../lib/workstation-activity";
import type {ScreenTask} from "../lib/workstation-display";

const now=new Date("2026-11-15T17:00:00Z");
const empty=getAgentRecords([],now);
const t:ScreenTask[]=[
 {id:"3",roleId:"web-discovery",status:"COMPLETED",createdAt:"2026-11-15T16:50:00Z",errorCode:null,
  result:{summary:"  Inspected   a permitted retail website",items:[{label:"Official source",details:"",sourceUrl:"https://example.com/jewellery"}]}},
 {id:"1",roleId:"web-discovery",status:"BLOCKED",createdAt:"2026-11-14T17:00:00Z",errorCode:"ACCESS_POLICY_BLOCKED",result:null},
 {id:"2",roleId:"reel-generation",status:"COMPLETED",createdAt:"2026-11-15T17:00:00Z",errorCode:null,result:{summary:"Reel task evaluation"}} ,
];
describe("real 3D desk evidence explorer",()=>{
 it("maps all 16 actual roles to existing internal owner work areas, never an imaginary integration",()=>{
  expect(ROLE_SPECS).toHaveLength(16);
  for(const r of ROLE_SPECS){
   const destination=workstationWorkspace(r.id);
   expect(destination).not.toBeNull();
   expect(WORKSPACE_NAMES[destination!]).toBeTruthy();
  }
  expect(workstationWorkspace("fake-agent")).toBeNull();
  expect(workstationWorkspace("__proto__")).toBeNull();
  expect(workstationWorkspace("wholesale-calling")).toBe("leads");
  expect(workstationWorkspace("customer-conversation")).toBe("inbox");
 });
 it("filters and orders only saved tasks for the chosen desk with original evidence sources",()=>{
  const activity=latestWorkstationActivity("web-discovery",t,"ON_DEMAND");
  expect(activity).toHaveLength(2);
  expect(activity.map(x=>x.id)).toEqual(["3","1"]);
  expect(activity[0].summary).toBe("Inspected a permitted retail website");
  expect(activity[0].sourceUrl).toBe("https://example.com/jewellery");
  expect(activity[0].sourceLabel).toBe("Official source");
  expect(activity[1].state).toBe("BLOCKED");
  expect(latestWorkstationActivity("wholesale-calling",t,"NOT_CONFIGURED")).toEqual([]);
  expect(latestWorkstationActivity("web-discovery",t,"ON_DEMAND",1)).toHaveLength(1);
 });
 it("falls back to separately persisted audited source URL evidence if report items omit it",()=>{
  const task:ScreenTask={id:"evidence",roleId:"web-discovery",status:"COMPLETED",
   createdAt:"2026-11-15T16:50:00Z",errorCode:null,result:{summary:"Source reviewed"},
   sourceUrls:["javascript:alert(1)","https://example.org/wholesale"]};
  const row=latestWorkstationActivity("web-discovery",[task],"ON_DEMAND")[0];
  expect(row.sourceUrl).toBe("https://example.org/wholesale");
  expect(row.sourceLabel).toBe("Stored HQ source reference");
 });
 it("never transforms an old RUNNING task row into a claim of current active work",()=>{
  const rows:ScreenTask[]=[{id:"stale",roleId:"reel-generation",status:"RUNNING",
   createdAt:"2026-01-01T01:00:00Z",errorCode:null,result:null}];
  expect(latestWorkstationActivity("reel-generation",rows,"ON_DEMAND")[0].state)
   .toContain("NOT CONFIRMED LIVE");
  expect(latestWorkstationActivity("reel-generation",rows,"RUNNING")[0].state)
   .toBe("RUNNING");
 });
 it("rejects unsafe/credentialed or local sources without following links",()=>{
  for(const url of ["javascript:alert(1)","file:///etc/passwd","https://localhost/a",
   "https://127.0.0.1/a","https://192.168.1.1/private","http://example.com",
   "https://admin:password@example.com","https://server.internal/x","https://host.local/path",
   "https://host.test/path","data:text/html,hi",null,42]){
   expect(permittedEvidenceUrl(url)).toBeNull();
  }
  expect(permittedEvidenceUrl("https://example.org/public")).toBe("https://example.org/public");
  const poisoned:ScreenTask[]=[{id:"1",roleId:"web-discovery",createdAt:"2026-11-15T17:00:00Z",
   status:"COMPLETED",errorCode:null,result:{items:[{label:"unsafe",details:"",sourceUrl:"javascript:alert(1)"}]}}];
  expect(latestWorkstationActivity("web-discovery",poisoned,"ON_DEMAND")[0].sourceUrl).toBeNull();
 });
 it("leaves a genuinely empty database empty and does not conjure any task history",()=>{
  for(const role of empty){
   expect(latestWorkstationActivity(role.id,[],role.status)).toEqual([]);
  }
 });
});
