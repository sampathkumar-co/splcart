/**
 * Honest business-verification source gate.
 * A reachable web page is NOT proof of a jewellery business.
 * Only allow a human reviewer to attest an excerpt actually present in a
 * successfully captured independent website page, with category context.
 */
type Snapshot = { excerpt?: unknown; description?: unknown; headings?: unknown;
  tabs?: {status?: unknown; evidence?: Snapshot}[] };
const normalize=(value:string) => value.replace(/\s+/g," ").trim().toLowerCase();
function words(value:Snapshot):string[] {
  const tokens=[value.excerpt,value.description,...(Array.isArray(value.headings)?value.headings:[])];
  return tokens.filter((v):v is string=>typeof v==="string" && v.length>0);
}
export function verifyCapturedBusinessClaim(snapshot:unknown, excerpt:string, category:string):boolean {
  if(!snapshot || typeof snapshot!=="object")return false;
  const data=snapshot as Snapshot;
  const captured=(Array.isArray(data.tabs)
    ? data.tabs.filter(tab=>tab.status==="COMPLETED" && tab.evidence).flatMap(tab=>words(tab.evidence!))
    : words(data)).map(normalize).join(" ");
  const claim=normalize(excerpt);
  const categoryWords=normalize(category).split(/[^\p{L}\p{N}]+/u).filter(v=>v.length>=3);
  return claim.length>=16 && captured.includes(claim) &&
    categoryWords.length>0 && categoryWords.some(word=>captured.includes(word));
}
