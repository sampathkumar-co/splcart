import {describe,expect,it} from "vitest";
import {chooseDistinctPhotoProducts,indiaBusinessDate} from "../lib/creative-schedule";
const photos=[
  {id:"p1",productId:"j1",product:{title:"Necklace",material:"CZ",productUrl:"https://example.org/a"}},
  {id:"p2",productId:"j1",product:{title:"Necklace",material:"CZ",productUrl:"https://example.org/a"}},
  {id:"p3",productId:"j2",product:{title:"Earrings",material:"silver",productUrl:"https://example.org/b"}},
  {id:"p4",productId:"j3",product:{title:"Bangles",material:"alloy",productUrl:"https://example.org/c"}},
];
describe("opt-in original Reel scheduling without API keys",()=>{
 it("uses India-local day across UTC date boundaries",()=>{
  expect(indiaBusinessDate(new Date("2026-11-14T20:00:00Z"))).toBe("2026-11-15");
  expect(indiaBusinessDate(new Date("2026-11-15T17:00:00Z"))).toBe("2026-11-15");
 });
 it("chooses only genuine distinct owner-product images",()=>{
  expect(chooseDistinctPhotoProducts(photos,new Set<string>(),2).map(p=>p.id)).toEqual(["p1","p3"]);
  expect(chooseDistinctPhotoProducts(photos,new Set(["p1"]),3).map(p=>p.id)).toEqual(["p2","p3","p4"]);
  expect(chooseDistinctPhotoProducts([],new Set<string>(),3)).toEqual([]);
 });
});
