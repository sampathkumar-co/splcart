import {describe,expect,it} from "vitest";
import {INQUIRY_RETENTION_DAYS,inquiryRetentionCutoff,PURGE_BATCH_LIMIT,CUSTOMER_HISTORY_REDACTED} from "../lib/inquiry-retention";
describe("explicit owner-controlled HQ customer record retention",()=>{
 it("offers only fixed retention windows and uses last touched time",()=>{
  expect(INQUIRY_RETENTION_DAYS).toEqual([30,90,180]);
  expect(inquiryRetentionCutoff(90,new Date("2026-11-15T12:00:00Z")).toISOString()).toBe("2026-08-17T12:00:00.000Z");
  expect(()=>inquiryRetentionCutoff(1 as 30)).toThrow("INVALID_RETENTION_WINDOW");
  expect(PURGE_BATCH_LIMIT).toBe(100);
 });
 it("redacts old reports without preserving customer alias or original message",()=>{
  expect(JSON.stringify(CUSTOMER_HISTORY_REDACTED)).not.toContain("customerAlias");
  expect(CUSTOMER_HISTORY_REDACTED.items).toHaveLength(0);
  expect(CUSTOMER_HISTORY_REDACTED.provenance).toBe("PRIVACY_REDACTED");
 });
});
