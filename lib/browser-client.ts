import { inspectPublicTabs, type BrowserSessionEvidence } from "./browser";

/** HQ app and browser worker are separate services in production. */
export async function executeResearchSession(urls: string[]): Promise<BrowserSessionEvidence> {
  if (process.env.NODE_ENV !== "production" ||
      (process.env.HQ_TEST_MODE === "1" && process.env.HQ_PUBLIC_ORIGIN === "http://127.0.0.1:3000"))
    return inspectPublicTabs(urls);
  const endpoint = process.env.HQ_BROWSER_WORKER_URL || "";
  const token = process.env.HQ_BROWSER_WORKER_TOKEN || "";
  if (!/^http:\/\/hq-browser:3900$/.test(endpoint) || token.length < 32 ||
      process.env.HQ_BROWSER_EGRESS_VERIFIED !== "1")
    throw new Error("RESEARCH_ISOLATED_WORKER_REQUIRED");
  let response: Response;
  try {
    response = await fetch(endpoint + "/inspect", {
      method:"POST",
      headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
      body:JSON.stringify({urls}),
      signal:AbortSignal.timeout(55_000),
      cache:"no-store",
    });
  } catch { throw new Error("RESEARCH_WORKER_UNAVAILABLE"); }
  if (!response.ok) {
    const data = await response.json().catch(()=>({error:"RESEARCH_WORKER_FAILED"})) as {error?:string};
    throw new Error(data.error?.slice(0,100) || "RESEARCH_WORKER_FAILED");
  }
  const data=await response.json() as BrowserSessionEvidence;
  if (data.provider !== "PLAYWRIGHT" || !Array.isArray(data.tabs) ||
      data.tabs.length !== urls.length || typeof data.completed !== "number")
    throw new Error("RESEARCH_WORKER_INVALID_RESULT");
  return data;
}
