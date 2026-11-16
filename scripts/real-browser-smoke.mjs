/** Production build + real Chromium + live public example.com research, ephemeral CI DB only.
 * IANA example.com is a neutral connectivity fixture; NEVER a real wholesale lead.
 */
import assert from "node:assert/strict";
import { authenticateOwner, authHeaders, base } from "./ci-auth.mjs";
const cookie=await authenticateOwner();
const response=await fetch(base+"/api/research", {
 method:"POST",headers:authHeaders(cookie,true),
 body:JSON.stringify({url:"https://example.com/",extraUrls:["https://example.com/?tab=2"]}),
});
const payload=await response.json();
assert.equal(response.status,201,JSON.stringify(payload));
assert.equal(payload.status,"COMPLETED");
assert.equal(payload.finding.provider,"PLAYWRIGHT");
assert.equal(payload.finding.tabs.length,2);
assert.equal(payload.finding.completed,2);
assert.equal(payload.finding.failed,0);
for(const tab of payload.finding.tabs){
 assert.equal(tab.status,"COMPLETED");
 assert.ok(tab.evidence?.title);
 assert.equal(new URL(tab.evidence.finalUrl).hostname,"example.com");
}
console.log("PASS real two-tab browser visit, source capture, and database persistence. IANA example.com only; zero leads or revenue created.");
