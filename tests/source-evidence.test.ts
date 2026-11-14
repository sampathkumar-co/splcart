import {describe,expect,it} from "vitest";
import {verifyCapturedBusinessClaim} from "../lib/source-evidence";
describe("reviewed retailer evidence",()=>{
 const capture={sourceUrl:"https://retailer.example.com",tabs:[
   {status:"COMPLETED",evidence:{title:"Retailer",headings:["CZ jewellery wholesale retailer"],excerpt:"We offer gold plated CZ jewellery for wholesale buyers in Visakhapatnam."}},
   {status:"FAILED",errorCode:"PAGE_HTTP_404",evidence:{excerpt:"fabricated CZ jewellery evidence"}},
 ]};
 it("requires text really present in successfully visited retailer site",()=>{
   expect(verifyCapturedBusinessClaim(capture,"CZ jewellery wholesale retailer","CZ jewellery")).toBe(true);
   expect(verifyCapturedBusinessClaim(capture,"No such jewellery business website statement","CZ jewellery")).toBe(false);
 });
 it("does not count a successful HTTP page without jewellery evidence",()=>{
   expect(verifyCapturedBusinessClaim({excerpt:"Welcome to Example Domain. Used in examples."},"Welcome to Example Domain","CZ jewellery")).toBe(false);
 });
 it("does not accept content from failed browser tabs or missing proof",()=>{
   expect(verifyCapturedBusinessClaim(capture,"fabricated CZ jewellery evidence","CZ jewellery")).toBe(false);
   expect(verifyCapturedBusinessClaim(undefined,"CZ jewellery wholesale retailer","CZ jewellery")).toBe(false);
   expect(verifyCapturedBusinessClaim(capture,"CZ jewellery","CZ jewellery")).toBe(false);
 });
 it("retains compatibility with a legacy single page real snapshot",()=>{
   expect(verifyCapturedBusinessClaim({headings:["Original gold plated jewellery house"],excerpt:"Gold jewellery retailer in Vizag."},
     "Original gold plated jewellery house","gold plated jewellery")).toBe(true);
 });
});