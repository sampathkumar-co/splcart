/** CI-only tests with ephemeral PostgreSQL and invented fixtures. Never run against production. */
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
const base = 'http://127.0.0.1:3000';
const auth = 'Basic ' + Buffer.from('ci-owner:ci-not-a-real-secret').toString('base64');
async function send(path, body, authorized = true) {
  const response = await fetch(base + path, { method: body ? 'POST' : 'GET',
    headers: { ...(authorized ? { Authorization: auth } : {}), ...(body ? { 'Content-Type':'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined, cache:'no-store' });
  const value = await response.json().catch(()=>({}));
  return { status: response.status, value };
}
const checked = (title, ok) => { assert.ok(ok,title); console.log('PASS', title); };
try {
  const health = await send('/api/health'); checked('health endpoint',health.status===200);
  const noAuth = await send('/api/dashboard',null,false); checked('dashboard requires owner auth',noAuth.status===401);
  const blank = await send('/api/dashboard'); checked('dashboard responds to authorized owner',blank.status===200 && blank.value.stats.researched===0);
  const product = await send('/api/actions',{action:'add_product',splcartProductId:'CI-ONLY-CZ-1',title:'CI-only jewellery fixture',category:'CZ jewellery',material:'alloy',unitDescription:'one piece',priceRupees:250,productUrl:'https://splcart.in/products/ci-only-fixture'});
  checked('owner-attested product persists',product.status===201 && product.value.id);
  const evidence=await db.researchRun.create({ data:{provider:'CI_FIXTURE',sourceUrl:'https://ci-retailer.example.org',finalUrl:'https://ci-retailer.example.org',status:'COMPLETED',pageTitle:'CI ONLY retailer fixture',finishedAt:new Date()} });
  const lead=await send('/api/actions',{action:'add_prospect',name:'CI-only jewellery retailer',city:'Visakhapatnam',category:'CZ jewellery',businessSourceUrl:'https://ci-retailer.example.org',evidenceSummary:'CI fixture for transactional API contract',researchRunId:evidence.id});
  checked('source-backed prospect persists',lead.status===201 && lead.value.id);
  const rejected=await send('/api/actions',{action:'review',prospectId:lead.value.id,decision:'APPROVED',note:'should be blocked before evidence'});
  checked('premature approval denied',rejected.status===400);
  const match=await send('/api/actions',{action:'add_match',prospectId:lead.value.id,productId:product.value.id,competitorMaterial:'alloy',competitorUnitDescription:'one piece',competitorPriceRupees:450,competitorEvidenceUrl:'https://ci-retailer.example.org/product/1',equivalentMaterials:true,equivalentUnits:true});
  checked('evidenced product match persists',match.status===200 && match.value.id);
  let dash=await send('/api/dashboard');const p=dash.value.prospects.find(p=>p.id===lead.value.id);
  checked('conservative scoring: qualification but no invented price advantage',p.score===30 && p.qualified && p.breakdown.pricingAdvantage===0);
  const approve=await send('/api/actions',{action:'review',prospectId:lead.value.id,decision:'APPROVED',note:'CI-only owner approval'});
  checked('owner review is recorded',approve.status===200);
  const qualified=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'QUALIFIED',note:'CI fixture evidence'});
  checked('qualified stage recorded',qualified.status===200);
  const approved=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'APPROVED',note:'CI fixture owner approval'});
  checked('approved stage recorded',approved.status===200);
  const contactDenied=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'CONTACTED',note:'CI should fail until permission',evidenceUrl:'https://ci-retailer.example.org/receipt'});
  checked('contact blocked without permission',contactDenied.status===400);
  const consent=await send('/api/actions',{action:'record_permission',prospectId:lead.value.id,consentEvidenceUrl:'https://ci-retailer.example.org/opt-in',consentNote:'CI fixture approved callback'});
  checked('contact eligibility evidence recorded',consent.status===200);
  const contacted=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'CONTACTED',note:'Owner manually sent requested reply, CI fixture only',evidenceUrl:'https://ci-retailer.example.org/receipt'});
  checked('manual contact recorded after permission',contacted.status===200);
  const interested=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'INTERESTED',note:'CI fixture interested'});
  const quote=await send('/api/actions',{action:'advance',prospectId:lead.value.id,to:'QUOTATION',note:'CI fixture wholesale quotation'});
  checked('interest and quotation transitions',interested.status===200 && quote.status===200);
  const order=await send('/api/actions',{action:'record_order',prospectId:lead.value.id,orderReference:'CI-ONLY-ORDER-1',amountRupees:1100,evidenceUrl:'https://ci-retailer.example.org/order'});
  checked('owner-reported order recorded as UNVERIFIED',order.status===200 && order.value.status==='OWNER_REPORTED_UNVERIFIED');
  dash=await send('/api/dashboard');
  checked('never count unverified order as verified revenue',dash.value.stats.verifiedRevenueRupees===0 && dash.value.stats.ownerReportedOrders===1);
  console.log('All API smoke checks passed using CI-only fake records in ephemeral database.');
} finally { await db.$disconnect(); }
