import {describe,it,expect} from "vitest";
import {categoryMatches,manualInquiryReply} from "../lib/customer-inquiry";
const products=[
 {id:"1",title:"CZ stud earring",category:"CZ jewellery",material:"alloy",productUrl:"https://example.com/stud"},
 {id:"2",title:"One gram pendant",category:"one gram gold",material:"alloy",productUrl:"https://example.com/pendant"},
];
describe("manual-only enquiry suggestions",()=>{
 it("matches exact category without inventing similarity, price or inventory",()=>{
  expect(categoryMatches(" cz JEWELLERY ",products).map(x=>x.id)).toEqual(["1"]);
  expect(categoryMatches("silver jewellery",products)).toEqual([]);
 });
 it("drafts a truthful reply without claiming current stock, deals, sending or platform verification",()=>{
  const draft=manualInquiryReply("CZ jewellery",products);
  expect(draft).toContain("CZ stud earring");
  expect(draft).toContain("confirm current availability");
  expect(draft).not.toMatch(/in stock|20%|sent|verified buyer/i);
 });
 it("unknown category gets an honest generic request rather than a fake item",()=>{
  const draft=manualInquiryReply("Silver jewellery",products);
  expect(draft).toContain("check actual options");
  expect(draft).not.toContain("CZ stud earring");
 });
});
