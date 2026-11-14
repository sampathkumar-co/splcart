/**
 * Real Chromium acceptance run against the built Next app and ephemeral CI DB.
 * CI fixtures are explicitly not production leads/revenue. Screenshots are
 * QA artifacts, not a promise that third-party sites were researched.
 */
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.HQ_E2E_URL || "http://127.0.0.1:3000";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-webgl", "--use-angle=swiftshader"],
});
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
  httpCredentials: {
    username: process.env.OWNER_USERNAME || "ci-owner",
    password: process.env.OWNER_PASSWORD || "ci-not-a-real-secret",
  },
});
const page = await ctx.newPage();
const failures = [];
page.on("pageerror", error => failures.push(error.message));
try {
  const response = await page.goto(base, { waitUntil: "domcontentloaded", timeout: 40_000 });
  assert.equal(response?.status(), 200, "authenticated app must load");
  await page.locator(".station-chip").first().waitFor({ timeout: 35_000 });
  assert.equal(await page.locator(".station-chip").count(), 16, "there must be sixteen truthful workstations");
  assert.equal(await page.locator(".office-canvas canvas").count(), 1, "3D scene must mount a WebGL canvas");
  assert.equal(await page.locator(".station-chip .status-running").count(), 0, "empty CI database must not claim any active autonomous agents");
  await page.getByRole("button", { name: /Google & Web Discovery/ }).first().click();
  assert.ok((await page.locator(".station-details").innerText()).includes("Google & Web Discovery"), "clicking a workstation must open real status");
  await page.screenshot({path:"artifacts/hq-desktop-3d.png",fullPage:true});
  console.log("PASS 16 real-state agent workstations, 3D scene and interactive inspector");

  await page.getByRole("button", { name: "2D ACCESSIBLE VIEW" }).click();
  await page.getByRole("button", { name: /SALES FLOOR/ }).waitFor();
  assert.equal(await page.locator(".room-select").count(), 4, "2D fallback must show all four departments");
  await page.screenshot({path:"artifacts/hq-2d-fallback.png",fullPage:true});
  console.log("PASS accessible 2D workspace");

  await page.getByRole("button", { name: "3D OFFICE VIEW" }).click();
  await page.locator(".office-canvas canvas").waitFor();
  await page.getByRole("button", { name: "Overview" }).click();
  await page.getByRole("button", { name: "Web Discovery" }).first().click();
  await page.getByRole("heading", { name: "Intelligence Discovery" }).waitFor();
  await page.getByRole("button", { name: "Wholesale Pipeline" }).click();
  await page.getByRole("heading", { name: "Wholesale Opportunities" }).waitFor();
  console.log("PASS camera overview control and business navigation");

  await page.setViewportSize({width:390,height:844});
  await page.getByRole("heading", { name: "Wholesale Opportunities" }).waitFor();
  await page.screenshot({path:"artifacts/hq-mobile.png",fullPage:true});
  console.log("PASS mobile-sized responsive render");
  assert.deepEqual(failures, [], "no uncaught page errors");
} finally {
  await browser.close();
}
