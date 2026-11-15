import {describe,expect,it} from "vitest";
import {evaluateLocalRole,type LocalContext,type LocalLead} from "../lib/local-agents";
const now=new Date("2026-11-15T08:00:00Z");
const lead:LocalLead={
  id:"source-lead-1",name:"Fixture retailer",category:"CZ",stage:"CONTACTED",decision:"APPROVED",
  sourceUrl:"https://retailer.example.com/",updatedAt:new Date("2026-10-25"),
  verifiedBusinessAt:new Date("2026-11-09"),wholesaleIntentEvidenceUrl:"https://retailer.example.com/wholesale",
  contactConsentUrl:"https://retailer.example.com/consent",consentGrantedAt:new Date("2026-10-20"),
  lastActivityAt:new Date("2026-11-01"),reportedOrder:false,
};
const base:LocalContext={now,leads:[lead],
 products:[{id:"product-one",title:"CZ necklace",category:"CZ",material:"Owner-stated alloy",productUrl:"https://product.example.com/cz-necklace"}],
 reels:[],photos:[],research:[]};
describe("truthful no-key role task execution",()=>{
 it("gives executive factual counts, no invented paid revenue or calls",()=>{
   const r=evaluateLocalRole("general-manager",base);
   expect(r.status).toBe("COMPLETED");
   expect(r.summary).toContain("no decisions or revenue invented");
   expect(r.modelCostPaise).toBe(0);
   expect(r.computeCost).toBe("NOT_METERED");
 });
 it("only recommends permissioned due follow-ups, never sends one",()=>{
   const due=evaluateLocalRole("lead-follow-up",base);
   expect(due.status).toBe("COMPLETED");
   expect(due.evidenceUrls).toContain("https://retailer.example.com/");
   const noPermission=evaluateLocalRole("lead-follow-up",{
     ...base,leads:[{...lead,contactConsentUrl:null}],
   });
   expect(noPermission.status).toBe("BLOCKED");
   expect(noPermission.errorCode).toBe("NO_PERMISSIONED_FOLLOWUPS");
 });
 it("keeps category product matching owner-attested and source-linked",()=>{
   const r=evaluateLocalRole("jewellery-recommendation",base);
   expect(r.status).toBe("COMPLETED");
   expect(r.items[0].sourceUrl).toBe(base.products[0].productUrl);
   expect(r.items[0].details).toContain("OWNER_ATTESTED");
 });
 it("only permits manual handoff if an actual MP4 was owner approved",()=>{
   const r=evaluateLocalRole("social-publishing",base);
   expect(r.status).toBe("BLOCKED");
   const allowed=evaluateLocalRole("social-publishing",{...base,reels:[{
     id:"ci-real-job",titleSnapshot:"CZ",productId:"product-one",status:"APPROVED",
   }]});
   expect(allowed.status).toBe("COMPLETED");
   expect(allowed.summary).toContain("no Instagram/YouTube post was sent");
 });
 it("never fabricates influencer/Instagram, telephony or campaign measurements",()=>{
   for(const roleId of ["wholesale-calling","customer-conversation","instagram-discovery","marketing-performance"]){
     const output=evaluateLocalRole(roleId,base);
     expect(output.status).toBe("BLOCKED");
     expect(output.errorCode).toBeTruthy();
     expect(output.modelCostPaise).toBe(0);
   }
 });
 it("does not claim a market trend from empty browser results",()=>{
   expect(evaluateLocalRole("trend-research",base).status).toBe("BLOCKED");
   const actual=evaluateLocalRole("trend-research",{...base,research:[{
     id:"run",sourceUrl:"https://retailer.example.com/",status:"COMPLETED",pageTitle:"Real captured page",
   }]});
   expect(actual.status).toBe("COMPLETED");
   expect(actual.summary).toContain("not a validated market trend");
 });
});
