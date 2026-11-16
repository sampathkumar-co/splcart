import {describe,expect,it} from "vitest";
import {assertPublicUrl,inspectPublicTabs} from "../lib/browser";

describe("owner-triggered browser source safety",()=>{
 it("refuses insecure and loopback browsing",async()=>{
  await expect(assertPublicUrl("http://example.org/")).rejects.toThrow("HTTPS_PUBLIC_ONLY");
  await expect(assertPublicUrl("https://127.0.0.1/")).rejects.toThrow("PRIVATE_HOST_BLOCKED");
  await expect(assertPublicUrl("https://localhost/")).rejects.toThrow("PRIVATE_HOST_BLOCKED");
  await expect(assertPublicUrl("https://metadata.google.internal/")).rejects.toThrow("PRIVATE_HOST_BLOCKED");
 });
 it("does not treat automation as permission to scrape search and social sites",async()=>{
  await expect(assertPublicUrl("https://www.google.com/maps")).rejects.toThrow("SOURCE_POLICY_REVIEW_REQUIRED");
  await expect(assertPublicUrl("https://www.instagram.com/")).rejects.toThrow("SOURCE_POLICY_REVIEW_REQUIRED");
  await expect(assertPublicUrl("https://splcart.in/products/example")).rejects.toThrow("SOURCE_POLICY_REVIEW_REQUIRED");
  await expect(assertPublicUrl("https://api.splcart.in/")).rejects.toThrow("SOURCE_POLICY_REVIEW_REQUIRED");
 });
 it("bounds requested browser tabs before starting Chrome",async()=>{
  await expect(inspectPublicTabs([])).rejects.toThrow("INVALID_TAB_COUNT");
  await expect(inspectPublicTabs(["https://a.example.org/","https://b.example.org/","https://c.example.org/","https://d.example.org/"])).rejects.toThrow("INVALID_TAB_COUNT");
 });
});