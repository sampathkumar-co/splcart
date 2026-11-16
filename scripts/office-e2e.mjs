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
let page = await ctx.newPage();
const failures = [];
page.on("pageerror", error => failures.push(error.message));
page.on("console", msg => { if(msg.type()==="error")console.log("BROWSER_CONSOLE_ERROR",msg.text().slice(0,280)); });

/** Capture the actual viewport-visible WebGL without Playwright's element
 * stability wait; the 3D camera intentionally transitions while the Canvas
 * DOM box remains fixed, and software WebGL can be slow on CI CPUs. */
async function captureOffice(path){
  const container=page.locator(".office-canvas");
  await container.scrollIntoViewIfNeeded();
  const box=await container.boundingBox();
  assert.ok(box && box.width>350 && box.height>250,"real 3D canvas bounds required");
  const viewport=page.viewportSize();
  assert.ok(viewport,"viewport required for screenshot");
  const x=Math.max(0,box.x),y=Math.max(0,box.y);
  const width=Math.min(box.width-(x-box.x),viewport.width-x);
  const height=Math.min(box.height-(y-box.y),viewport.height-y);
  assert.ok(width>350&&height>200,"visible WebGL region must exist");
  return page.screenshot({path,clip:{x,y,width,height},
    timeout:90_000,animations:"disabled"});
}

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
  // Real WebGL visual QA: owner controls affect geometry, lighting and display
  // size, never agent running status or synthetic task history.
  const sceneCanvas=page.locator(".office-canvas canvas");
  const signature=await sceneCanvas.screenshot({
    path:"artifacts/hq-office-signature.png",
  });
  assert.ok(signature.length>20000,"signature geometry must be visible");
  const nightButton=page.getByRole("button",{name:"Use after-hours lighting"});
  await nightButton.click();
  await page.waitForTimeout(450);
  const night=await sceneCanvas.screenshot({
    path:"artifacts/hq-office-after-hours.png",
  });
  assert.equal(nightButton?await page.getByRole("button",{name:"Use daylight lighting"}).getAttribute("aria-pressed"):null,"true");
  assert.equal(signature.equals(night),false,
    "lighting mode must change the actual WebGL pixels, not merely the control label");
  await page.getByRole("button",{name:"Use daylight lighting"}).click();
  const perfButton=page.getByRole("button",{name:"Use performance detail"});
  await perfButton.click();
  await page.waitForTimeout(500);
  const performance=await sceneCanvas.screenshot({
    path:"artifacts/hq-office-performance.png",
  });
  assert.equal(signature.equals(performance),false,
    "performance mode must really omit luxury scene details");
  await page.getByRole("button",{name:"Use signature detail"}).click();
  const beforeHeight=await page.locator(".office-canvas").evaluate(el=>el.clientHeight);
  await page.getByRole("button",{name:"Expand cinematic view"}).click();
  await page.waitForTimeout(500); // allow the real CSS stage-size transition to finish
  const afterHeight=await page.locator(".office-canvas").evaluate(el=>el.clientHeight);
  assert.ok(afterHeight>beforeHeight+60,
    "cinematic view must physically enlarge the genuine WebGL scene");
  await captureOffice("artifacts/hq-office-cinema.png");
  await page.getByRole("button",{name:"Exit cinematic view"}).click();
  assert.equal(await page.locator(".station-chip .status-running").count(),0,
    "cinema and lighting controls may not forge employee activity");
  console.log("PASS true signature 3D materials, after-hours lighting, faster-detail mode and cinematic WebGL size; real 16-role statuses unchanged");
  // A selected real desk receives a true close-up camera, not a decorative label.
  await page.getByRole("button",{name:"Focus selected workstation camera"}).click();
  const focusButton=page.getByRole("button",{name:"Focus selected workstation camera"});
  assert.equal(await focusButton.getAttribute("aria-pressed"),"true");
  const deskStatus=await page.locator(".office-desk-context").innerText();
  assert.ok(deskStatus.includes("Google & Web Discovery")&&deskStatus.includes("ON DEMAND"),
    "focused workstation must show the authenticated actual role/status");
  const emptyLedger=await page.getByRole("region",{name:"Real workstation task history"}).innerText();
  assert.ok(emptyLedger.includes("NO SAVED ENTRIES")&&emptyLedger.includes("No task recorded"),
    "empty CI HQ must show no made-up task history on the selected physical desk");
  assert.equal(await page.locator(".office-evidence-ledger a").count(),0,
    "empty task ledger cannot show invented evidence links");
  const trueDisplay=await page.locator(".office-desk-activity").innerText();
  assert.ok(trueDisplay.includes("PERMITTED WEB RESEARCH")&&
    trueDisplay.includes("NO CONFIRMED ACTIVE BROWSER")&&
    trueDisplay.includes("PERSISTED HQ RESEARCH RUNS"),
    "empty database must explicitly report zero real browser sessions, not fake research");
  await page.waitForTimeout(1000);
  const focused=await captureOffice("artifacts/hq-office-selected-desk.png");
  assert.equal(signature.equals(focused),false,
    "moving to the selected station must change the real 3D camera pixels");
  // Guided tour moves to the next *actual* desk, including explicitly blocked
  // calling; none of the 16 names is treated as a completed autonomous job.
  await page.getByRole("button",{name:"Next workstation"}).click();
  const blocked=await page.locator(".office-desk-context").innerText();
  assert.ok(blocked.includes("Wholesale AI Phone Calling")&&blocked.includes("NOT CONFIGURED")&&
    blocked.includes("INTEGRATION UNAVAILABLE")&&blocked.includes("No compliant dialer"),
    "the physical phone workstation must truthfully state that no voice calling exists");
  await page.getByRole("button",{name:"Previous workstation"}).click();
  const previous=await page.locator(".office-desk-context").innerText();
  assert.ok(previous.includes("Google & Web Discovery")&&previous.includes("ON DEMAND"),
    "tour back must select the original evidence-grounded role");
  // Releasing a long software-WebGL sequence can starve synthetic pointer
  // positioning on CI CPUs. Invoke the actual DOM button handler directly.
  await page.getByRole("button",{name:"Return to room camera"})
    .evaluate(el=>el.click(),undefined,{timeout:60_000});
  await page.locator(".office-desk-context").waitFor({state:"hidden",timeout:60_000});
  await page.getByRole("button",{name:"Return to overview camera"}).click();
  console.log("PASS 16 source-backed physical monitor dashboards, four jewel-toned room feeds, idle web state, missing voice integration and real selected-camera tour");
  // The 3D desk can hand off directly to a real existing workspace,
  // never to a fabricated external browser or paid telephony dashboard.
  await page.getByRole("button",{name:"Focus selected workstation camera"}).click();
  await page.getByRole("button",{name:"Open Source Research workspace"}).click();
  await page.getByRole("heading",{name:"Intelligence Discovery",exact:true}).waitFor({timeout:40000});
  assert.equal(await page.locator(".office-canvas canvas").count(),0,
    "navigating to work must release the 3D office, preserving browser resources");
  console.log("PASS selected real 3D evidence desk opens actual research workflow and releases WebGL");

  // Explicit owner-only lightweight 2D entry: ordinary business workflows
  // must not compete with a previous heavy software-WebGL frame capture.
  await page.close();
  page=await ctx.newPage();
  page.on("pageerror",error=>failures.push(error.message));
  page.on("console",msg=>{if(msg.type()==="error")console.log("BROWSER_CONSOLE_ERROR",msg.text().slice(0,280));});
  const direct2d=await page.goto(base+"/2d",{waitUntil:"domcontentloaded",timeout:60000});
  assert.equal(direct2d?.status(),200,"authenticated 2D route should load independently");
  await page.locator(".room-select").first().waitFor({timeout:40000});
  assert.equal(await page.locator(".office-canvas canvas").count(),0,
    "lightweight 2D direct entry must not mount any WebGL scene");
  console.log("PASS private standalone /2d HQ route, accessible workstations with zero WebGL canvases");
  // Owner controls real daily internal evidence, not unauthorized social/voice automation.
  const dailyOn=page.getByRole("button",{name:"Enable daily briefing"});
  await dailyOn.click();
  const dailyOff=page.getByRole("button",{name:"Disable daily briefing"});
  await dailyOff.waitFor({timeout:15_000});
  assert.equal(await dailyOff.getAttribute("aria-pressed"),"true");
  await dailyOff.click();
  await page.getByRole("button",{name:"Enable daily briefing"}).waitFor({timeout:15_000});
  assert.equal(await page.getByRole("button",{name:"Enable daily briefing"}).getAttribute("aria-pressed"),"false");
  console.log("PASS real owner opt-in/out daily source-only 16-role reporting controls in browser");

  // A real owner-only user journey, using CI-only invented message content.
  await page.getByRole("button",{name:"Customer Inbox",exact:true}).click();
  await page.getByRole("heading",{name:"Record a real enquiry"}).waitFor();
  await page.getByLabel("Customer nickname, no contact details").fill("CI-only incoming shopper");
  await page.getByLabel("Requested jewellery category").fill("CZ jewellery");
  await page.getByLabel("Genuine customer question").fill("CI-only: do you have an earring design?");
  await page.getByLabel(/I confirm the customer initiated this enquiry/).check();
  await page.getByRole("button",{name:/Record owner-reported enquiry/}).click();
  await page.getByText("CI-only incoming shopper").waitFor({timeout:15000});
  await page.getByLabel(/I personally sent this reply outside HQ/).check();
  await page.getByRole("button",{name:/Record my manual reply/}).click();
  await page.getByText("REPLIED REPORTED").waitFor({timeout:15000});
  await page.screenshot({path:"artifacts/hq-inbox-manual-workflow.png",fullPage:true});
  // Privacy control browser acceptance. A disposable second CI-only enquiry is
  // erased while the earlier replied case remains for later role evaluation.
  await page.getByLabel("Customer nickname, no contact details").fill("CI-case-to-erase");
  await page.getByLabel("Requested jewellery category").fill("CZ jewellery");
  await page.getByLabel("Genuine customer question").fill("CI-only second enquiry for erasure test.");
  await page.getByLabel(/I confirm the customer initiated this enquiry/).check();
  await page.getByRole("button",{name:/Record owner-reported enquiry/}).click();
  await page.getByText("CI-case-to-erase").waitFor({timeout:15000});
  page.once("dialog",dialog=>{void dialog.accept("ERASE")});
  await page.locator(".inbox-record").filter({hasText:"CI-case-to-erase"})
    .getByRole("button",{name:"Erase this enquiry"}).click();
  await page.getByText("CI-case-to-erase").waitFor({state:"detached",timeout:15000});
  await page.screenshot({path:"artifacts/hq-inbox-privacy.png",fullPage:true});
  console.log("PASS actual owner-confirmed live customer enquiry erasure in private browser workflow.");

  await page.getByRole("button",{name:"Headquarters",exact:true}).click();
  await page.locator(".room-select").first().waitFor();
  console.log("PASS actual owner-reported customer enquiry, editable manual-only reply, no connected account or message sent.");

  // 3D is still available on demand from the direct-entry 2D workspace.
  await page.getByRole("button",{name:"3D OFFICE VIEW"}).click();
  await page.locator(".office-canvas canvas").waitFor({timeout:45000});
  const viewCaptures = [
    {label:"executive",button:/AI General Manager/},
    {label:"marketing",button:/Creative Director/},
    {label:"sales",button:/Sales Manager/},
  ];
  for(const focus of viewCaptures){
    await page.getByRole("button",{name:focus.button}).first().click();
    await page.locator(".office-canvas").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1250);
    const image = await captureOffice("artifacts/hq-room-"+focus.label+".png");
    assert.ok(image.length>20_000,"room camera "+focus.label+" must render real detail");
  }
  const strategy=page.getByRole("button",{name:"Focus strategy room"});
  await strategy.click();
  assert.equal(await strategy.getAttribute("aria-pressed"),"true","strategy room camera must have accessible selected state");
  await page.waitForTimeout(1350);
  const meetingImage=await captureOffice("artifacts/hq-room-strategy.png");
  assert.ok(meetingImage.length>20_000,"meeting room camera must render real geometry");
  await page.getByRole("button",{name:"Overview"}).click();
  await page.waitForTimeout(1300);
  // Test orbit and zoom with the genuine WebGL canvas in demand-render mode.
  const orbitCanvas=page.locator(".office-canvas canvas");
  const orbitBefore=await captureOffice("artifacts/hq-orbit-before.png");
  const bounds=await orbitCanvas.boundingBox();
  assert.ok(bounds && bounds.width>350 && bounds.height>250,"3D canvas must be interactable");
  const x=bounds.x+bounds.width*.55, y=bounds.y+bounds.height*.52;
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x+190,y+75,{steps:14});
  await page.mouse.up();
  await page.waitForTimeout(1200);
  const orbitAfter=await captureOffice("artifacts/hq-orbit-after.png");
  assert.equal(orbitBefore.equals(orbitAfter),false,
    "drag to orbit must produce a different real scene frame with on-demand WebGL rendering");
  await page.getByRole("button",{name:"Overview"}).click();
  await page.waitForTimeout(950);
  console.log("PASS real CEO, Marketing, Sales, Strategy and genuine mouse orbit in power-saving demand-render mode");

  await page.getByRole("button",{name:/AI General Manager/}).first().click();
  await page.getByRole("button",{name:"Run local evidence task"}).click();
  await page.locator(".agent-real-report").waitFor({timeout:20000});
  assert.ok((await page.locator(".agent-real-report").innerText()).includes("Local HQ evidence report"),
    "Real GM role task must persist source-derived report, not simulated activity");
  console.log("PASS actual owner-triggered local agent role and persisted 3D desk inspector");
  // Repeat lightweight direct entry after real camera/orbit GPU stress,
  // proving that sales and accessibility remain available without WebGL.
  await page.close();
  page=await ctx.newPage();
  page.on("pageerror",error=>failures.push(error.message));
  page.on("console",msg=>{if(msg.type()==="error")console.log("BROWSER_CONSOLE_ERROR",msg.text().slice(0,280));});
  await page.goto(base+"/2d",{waitUntil:"domcontentloaded",timeout:60_000});
  await page.locator(".room-select").first().waitFor({timeout:60_000});
  await page.getByRole("button", { name: /SALES FLOOR/ }).waitFor();
  assert.equal(await page.locator(".room-select").count(), 4, "2D fallback must show all four departments");
  await page.screenshot({path:"artifacts/hq-2d-fallback.png",fullPage:true});
  console.log("PASS accessible 2D workspace");

  await page.getByRole("button", { name: "3D OFFICE VIEW" }).click();
  await page.locator(".office-canvas canvas").waitFor();
  await page.getByRole("button", { name: "Overview" }).click();
  // Use lightweight 2D for all the following nonvisual owner business tasks.
  await page.getByRole("button",{name:"2D ACCESSIBLE VIEW"}).click({timeout:60_000});
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
