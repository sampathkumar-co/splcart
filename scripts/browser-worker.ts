/**
 * Independent browser-only worker. Run inside a dedicated, network-restricted
 * container with NO DB credentials and NO SPLCART credentials.
 *
 * Production must configure exact allowed retailer hosts and verified egress
 * firewall rules. The attestation flag alone does not provide isolation.
 */
import { createServer } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { inspectPublicTabs } from "../lib/browser";

const secret = process.env.HQ_BROWSER_WORKER_TOKEN || "";
const hosts = process.env.HQ_ALLOWED_RESEARCH_HOSTS || "";
if (process.env.HQ_BROWSER_WORKER_PROCESS !== "1" ||
    process.env.HQ_BROWSER_EGRESS_VERIFIED !== "1" ||
    (secret.length < 32 || secret.includes("REPLACE_WITH") || (process.env.HQ_TEST_MODE !== "1" && secret.startsWith("ci-only-"))) || !hosts.trim() ||
    process.env.DATABASE_URL || process.env.OWNER_PASSWORD) {
  throw new Error("WORKER_SECURITY_CONFIG_INVALID");
}
const port=3900;
let active=false;
function constantTimeToken(value:string) {
 const a=Buffer.from(value),b=Buffer.from("Bearer "+secret);
 return a.length===b.length && timingSafeEqual(a,b);
}
const server=createServer(async(req,res)=>{
  res.setHeader("Content-Type","application/json");
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if (req.url==="/healthz"&&req.method==="GET") {
    res.statusCode=200;res.end(JSON.stringify({status:"ready"}));return;
  }
  if(req.url!=="/inspect"||req.method!=="POST"){
    res.statusCode=404;res.end(JSON.stringify({error:"NOT_FOUND"}));return;
  }
  if(!constantTimeToken(req.headers.authorization||"")){
    res.statusCode=401;res.end(JSON.stringify({error:"WORKER_UNAUTHORIZED"}));return;
  }
  if(active){res.statusCode=409;res.end(JSON.stringify({error:"RESEARCH_ALREADY_RUNNING"}));return;}
  let raw="";
  try {
    for await (const chunk of req) {
      raw+=chunk.toString("utf8");
      if(raw.length>4096)throw new Error("RESEARCH_REQUEST_TOO_LARGE");
    }
    const input=JSON.parse(raw) as {urls?:unknown};
    if(!Array.isArray(input.urls)||input.urls.length<1||input.urls.length>3||
      input.urls.some(url=>typeof url!=="string"||url.length>1000))
      throw new Error("INVALID_RESEARCH_URLS");
    active=true;
    const result=await inspectPublicTabs(input.urls as string[]);
    res.statusCode=200;res.end(JSON.stringify(result));
  }catch(e){
    const error=e instanceof Error?e.message:"RESEARCH_WORKER_FAILED";
    const safe=/^(INVALID_|RESEARCH_|ROBOTS_|PRIVATE_|HTTPS_|SOURCE_POLICY_|CHROMIUM_|BROWSER_)/.test(error)
      ?error.slice(0,100):"RESEARCH_WORKER_FAILED";
    res.statusCode=422;res.end(JSON.stringify({error:safe}));
  } finally {active=false;}
});
server.requestTimeout=60_000;
server.headersTimeout=10_000;
server.listen(port,"0.0.0.0",()=>console.log("Independent HQ browser worker listening on internal port "+port));
