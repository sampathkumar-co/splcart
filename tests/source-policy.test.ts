import {describe,expect,it} from "vitest";
import {evaluateSiteRobots,permittedProductionHost} from "../lib/source-policy";

const base="https://retailer.example.org";
describe("independent business website access policy",()=>{
 it("obeys disallow rules and matching allow exceptions",()=>{
  const text=["User-agent: *","Disallow: /private/","Allow: /private/public/","Crawl-delay: 2"].join("\n");
  expect(evaluateSiteRobots(base,200,text,[base+"/private/public/products"]).crawlDelayMs).toBe(2000);
  expect(()=>evaluateSiteRobots(base,200,text,[base+"/private/customer-data"]))
    .toThrow("ROBOTS_DISALLOWS_REQUESTED_PAGE");
 });
 it("fails closed for blocked, throttled or broken robots policies",()=>{
  expect(()=>evaluateSiteRobots(base,403,"",[base])).toThrow("ROBOTS_POLICY_UNAVAILABLE");
  expect(()=>evaluateSiteRobots(base,503,"",[base])).toThrow("ROBOTS_POLICY_UNAVAILABLE");
  expect(evaluateSiteRobots(base,404,"",[base]).robotsStatus).toBe(404);
  expect(()=>evaluateSiteRobots(base,200,"User-agent: *\nCrawl-delay: 20",[base]))
    .toThrow("ROBOTS_CRAWL_DELAY_EXCEEDS_BOUND");
 });
 it("does not permit external origins or oversized robots text",()=>{
  expect(()=>evaluateSiteRobots(base,200,"User-agent: *",[base,"https://another.example.org"]))
    .toThrow("RESEARCH_SAME_BUSINESS_ONLY");
  expect(()=>evaluateSiteRobots(base,200,"x".repeat(500001),[base]))
    .toThrow("ROBOTS_POLICY_TOO_LARGE");
 });
 it("requires exact explicit owner-approved hosts in production",()=>{
  expect(permittedProductionHost("retailer.example.org",true,false,"retailer.example.org,shop.example.org")).toBe(true);
  expect(permittedProductionHost("other.retailer.example.org",true,false,"retailer.example.org")).toBe(false);
  expect(permittedProductionHost("evil.example.org",true,false,"")).toBe(false);
  expect(permittedProductionHost("example.org",false,false,"")).toBe(true);
 });
});
