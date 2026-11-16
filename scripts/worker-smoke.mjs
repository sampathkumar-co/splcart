/** Isolated CI-only HTTP verification for the independently started browser worker. */
import assert from "node:assert/strict";
const base="http://127.0.0.1:3900";
if(process.env.HQ_TEST_MODE!=="1") throw new Error("WORKER_CI_TEST_ONLY");
const token="ci-only-browser-worker-token-for-an-ephemeral-ci-container";
const payload={urls:["https://example.com/","https://example.com/?worker-tab=2"]};
const bad=await fetch(base+"/inspect",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer wrong"},body:JSON.stringify(payload)});
assert.equal(bad.status,401,"worker rejects invalid credentials");
const response=await fetch(base+"/inspect",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+token},body:JSON.stringify(payload)});
const data=await response.json();
assert.equal(response.status,200,JSON.stringify(data));
assert.equal(data.provider,"PLAYWRIGHT");
assert.equal(data.tabs.length,2);
assert.equal(data.sourcePolicy.checkedUrls,2);
assert.equal(data.completed,2);
assert.ok(data.tabs.every(tab=>tab.status==="COMPLETED" && tab.evidence?.title));
console.log("PASS separate browser-only HTTP worker, bearer authentication, RFC 9309 source check and two genuine HTTPS tabs. CI fixture only.");
