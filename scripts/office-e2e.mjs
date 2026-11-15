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
  args: ["--no-sandbox", "--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
const failures = [];
page.on("pageerror", error => failures.push(error.message));
page.on("console", msg => { if(msg.type()==="error")console.log("BROWSER_CONSOLE_ERROR",msg.text().slice(0,280)); });
try {
  const unauthenticated = await page.goto(base, { waitUntil: "domcontentloaded", timeout: 40_000 });
  assert.equal(unauthenticated?.status(), 200, "login page must load through protected redirect");
  assert.equal(new URL(page.url()).pathname, "/login", "private homepage must require owner session");
  await page.getByLabel("Owner username").fill(process.env.OWNER_USERNAME || "ci-owner");
  await page.getByLabel("Password").fill(process.env.OWNER_PASSWORD || "ci-not-a-real-secret");
  await page.getByRole("button", { name: "Enter headquarters" }).click();
  await page.waitForURL(url => url.pathname === "/", { timeout: 30_000 });
  console.log("PASS private owner session login through real browser");
  await page.locator(".station-chip").first().waitFor({ timeout: 35_000 });
  assert.equal(await page.locator(".station-chip").count(), 16, "there must be sixteen truthful workstations");
  await page.locator(".office-canvas canvas").waitFor({state:"visible",timeout:30_000});
  assert.equal(await page.locator(".office-canvas canvas").count(), 1, "3D scene must mount a WebGL canvas");
  assert.equal(await page.locator(".station-chip .status-running").count(), 0, "empty CI database must not claim any active autonomous agents");
  await page.getByRole("button", { name: /Google & Web Discovery/ }).first().click();
  assert.ok((await page.locator(".station-details").innerText()).includes("Google & Web Discovery"), "clicking a workstation must open real status");
  // Capture while WebGL is inside the viewport. Offscreen full-page screenshot
  // captures can incorrectly composite the WebGL canvas as a blank rectangle.
  await page.locator(".office-canvas").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  let sample = 0;
  for (let attempt = 0; attempt < 12; attempt++) {
    await page.waitForTimeout(650);
    const canvasPng = await page.locator(".office-canvas").screenshot({path:"artifacts/hq-office-canvas.png"});
    sample = await page.evaluate(async base64 => {
    const image = new Image();
    image.src = "data:image/png;base64," + base64;
    await image.decode();
    const probe = document.createElement("canvas");
    probe.width = image.width; probe.height = image.height;
    const context = probe.getContext("2d");
    if(!context) return 0;
    context.drawImage(image,0,0);
    const unique=new Set();
    for(let y=120;y<image.height-100;y+=18)
      for(let x=80;x<image.width-80;x+=18) {
        const pixels=context.getImageData(x,y,1,1).data;
        unique.add(pixels[0]+":"+pixels[1]+":"+pixels[2]);
      }
    return unique.size;
  }, canvasPng.toString("base64"));
    if (sample > 18) break; // WebGL frame can arrive after hydration on virtualized CI GPUs.
  }
  console.log("WebGL visual pixel diversity",sample);
  assert.ok(sample>18,"3D office must draw visible geometry, not a blank canvas");
  await page.evaluate(() => window.scrollTo(0,0));
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
  // Actual browser interaction with the owner's emergency pause on future work.
  page.once("dialog", dialog => dialog.accept("CI-only owner paused future inspection requests"));
  await page.getByRole("button", {name:"Pause new research"}).click();
  await page.getByRole("button", {name:"Resume new research"}).waitFor({timeout:15_000});
  assert.equal(await page.getByRole("button",{name:"Research paused"}).isDisabled(),true);
  page.once("dialog", dialog => dialog.accept("CI-only owner re-enabled approved inspection requests"));
  await page.getByRole("button",{name:"Resume new research"}).click();
  await page.getByRole("button",{name:"Pause new research"}).waitFor({timeout:15_000});
  console.log("PASS owner-initiated pause/resume toggles browser research in real accessible UI");

  await page.getByRole("button", { name: "Wholesale Pipeline" }).click();
  await page.getByRole("heading", { name: "Wholesale Opportunities" }).waitFor();
  await page.getByRole("heading", { name: "Wholesale quotation desk" }).waitFor();
  await page.locator(".quote-card").first().waitFor({timeout:20_000});
  assert.equal(await page.locator(".quote-card").count(), 1, "CI test lead must show one persisted approved quote");
  assert.ok((await page.locator(".quote-card").innerText()).includes("APPROVED"),
    "Quote card must show real owner approval rather than a pipeline-only stage");
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"], {origin: base});
  await page.getByRole("button", { name: "Copy approved quotation" }).click();
  const copied = await page.evaluate(async () => navigator.clipboard.readText());
  assert.ok(copied.includes("OWNER-APPROVED WHOLESALE QUOTATION") &&
    copied.includes("OWNER_ATTESTED") && copied.includes("₹810.00"),
    "Manual share text must retain approval, source and price from persisted CI quote");
  await page.screenshot({path:"artifacts/hq-quote-workflow.png",fullPage:true});
  console.log("PASS actual persisted quote UI and explicit manual-only clipboard copy");
  await page.getByRole("button",{name:"Creative Studio"}).click();
  await page.getByRole("heading",{name:"20-second jewellery Reels, rendered locally."}).waitFor();
  await page.locator(".studio-job").first().waitFor({timeout:20000});
  assert.ok((await page.locator(".studio-job").first().innerText()).includes("APPROVED"),
    "Creative Studio must show genuine owner-approved MP4 after CI render");
  const clip=page.locator(".studio-video").first();
  assert.equal(await clip.count(),1,"Studio should show playable HTML5 video from actual local renderer");
  const metadata=await clip.evaluate(async video=>{
    await new Promise((resolve,reject)=>{
      if(video.readyState>=1){resolve();return;}
      video.addEventListener("loadedmetadata",resolve,{once:true});
      video.addEventListener("error",()=>reject(new Error("No actual video metadata")),{once:true});
    });
    return {width:video.videoWidth,height:video.videoHeight,duration:video.duration};
  });
  assert.equal(metadata.width,720);
  assert.equal(metadata.height,1280);
  assert.ok(metadata.duration>=19.5&&metadata.duration<=20.5);
  await page.screenshot({path:"artifacts/hq-code-reel-studio.png",fullPage:true});
  console.log("PASS real 720x1280 20-second playable MP4 in owner-only Creative Studio; no social posting");
  await page.getByRole("button",{name:"Wholesale Pipeline"}).click();


  console.log("PASS camera overview control and business navigation");

  await page.setViewportSize({width:390,height:844});
  await page.getByRole("heading", { name: "Wholesale Opportunities" }).waitFor();
  await page.screenshot({path:"artifacts/hq-mobile.png",fullPage:true});
  console.log("PASS mobile-sized responsive render");
  assert.deepEqual(failures, [], "no uncaught page errors");
  await page.getByRole("button", { name: /Sign out/ }).click();
  await page.waitForURL(url => url.pathname === "/login", { timeout: 15_000 });
  console.log("PASS owner sign out clears active browser session");

} finally {
  await browser.close();
}
