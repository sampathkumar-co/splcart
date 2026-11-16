// Pure functions: tested independently of DB and network.
export type SourceProduct = {
  id: string; category: string; material: string; unitDescription: string;
  pricePaise: number; deliveredPricePaise: number | null;
  ownerVerifiedAt: Date; verificationSource: string;
};
export type SourceMatch = {
  product: SourceProduct;
  competitorPricePaise: number | null;
  competitorDeliveredPricePaise: number | null;
  competitorMaterial: string | null;
  competitorUnitDescription: string | null;
  competitorEvidenceUrl: string | null;
  competitorPriceCheckedAt: Date | null;
  equivalentMaterials: boolean;
  equivalentUnits: boolean;
};
export type SourceProspect = {
  category: string; businessSourceUrl: string; businessWebsiteUrl: string | null;
  independentSource: boolean; verifiedBusinessAt: Date | null;
  wholesaleIntentEvidenceUrl: string | null; consentGrantedAt: Date | null;
  contactConsentUrl: string | null;
};
export type Breakdown = { wholesalePotential: number; pricingAdvantage: number; productFit: number; credibility: number; lawfulChannel: number };

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const recent = (value: Date | null, now: Date, days: number) => !!value && now.getTime() >= value.getTime() && now.getTime() - value.getTime() <= days * 86400000;

export function verifiedComparable(match: SourceMatch, now = new Date()) {
  const p = match.product;
  return p.verificationSource === "INDEPENDENT_VERIFIED_SOURCE" &&
    recent(p.ownerVerifiedAt, now, 7) && recent(match.competitorPriceCheckedAt, now, 7) &&
    match.equivalentMaterials && match.equivalentUnits &&
    !!match.competitorEvidenceUrl && same(p.material, match.competitorMaterial || "") &&
    same(p.unitDescription, match.competitorUnitDescription || "") &&
    p.deliveredPricePaise !== null && match.competitorDeliveredPricePaise !== null;
}
export function priceAdvantage(match: SourceMatch, now = new Date()) {
  return verifiedComparable(match, now) ? Math.max(0, match.competitorDeliveredPricePaise! - match.product.deliveredPricePaise!) : null;
}
export function scoreProspect(prospect: SourceProspect, matches: SourceMatch[], now = new Date()) {
  const hasVerifiedBusiness = prospect.independentSource && recent(prospect.verifiedBusinessAt, now, 90);
  const hasIntent = hasVerifiedBusiness && !!prospect.wholesaleIntentEvidenceUrl;
  const matchingCategory = matches.some(m => m.product.category.trim().toLowerCase() === prospect.category.trim().toLowerCase());
  const independentlyVerifiedProductFit = matches.some(m => verifiedComparable(m, now));
  const positiveAdvantage = matches.some(m => (priceAdvantage(m, now) ?? 0) > 0);
  const hasConsent = !!prospect.contactConsentUrl && recent(prospect.consentGrantedAt, now, 365);
  const breakdown: Breakdown = {
    wholesalePotential: hasIntent ? 30 : hasVerifiedBusiness ? 10 : 0,
    pricingAdvantage: positiveAdvantage ? 30 : 0,
    productFit: independentlyVerifiedProductFit ? 20 : matchingCategory ? 10 : 0,
    credibility: hasVerifiedBusiness && !!prospect.businessWebsiteUrl ? 10 : 0,
    lawfulChannel: hasConsent ? 10 : 0
  };
  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const warnings: string[] = [];
  if (!hasVerifiedBusiness) warnings.push("Independent business verification required");
  if (!matches.length) warnings.push("No matching owner-entered product recorded");
  if (!independentlyVerifiedProductFit) warnings.push("No independently price-verified equivalent item; owner-entered price is not independently verified");
  if (!positiveAdvantage) warnings.push("No independently verified delivered-price advantage");
  if (!hasConsent) warnings.push("No recorded contact permission; automated outreach forbidden");
  return { score, breakdown, warnings, qualified: hasVerifiedBusiness && matchingCategory && score >= 30 };
}

export const STAGES = ["DISCOVERED","RESEARCHED","QUALIFIED","APPROVED","CONTACTED","INTERESTED","QUOTATION","NEGOTIATION","WON_REPORTED","WON_VERIFIED","LOST","FOLLOW_UP"] as const;
export type StageName = (typeof STAGES)[number];
export function canMove(from: string, to: string, approved: boolean) {
  const transitions: Record<string, string[]> = {
    DISCOVERED: ["RESEARCHED", "LOST"], RESEARCHED: ["QUALIFIED", "LOST", "FOLLOW_UP"],
    QUALIFIED: ["APPROVED", "LOST", "FOLLOW_UP"], APPROVED: ["CONTACTED", "LOST", "FOLLOW_UP"],
    CONTACTED: ["INTERESTED", "FOLLOW_UP", "LOST"], INTERESTED: ["QUOTATION", "FOLLOW_UP", "LOST"],
    QUOTATION: ["NEGOTIATION", "WON_REPORTED", "FOLLOW_UP", "LOST"],
    NEGOTIATION: ["WON_REPORTED", "FOLLOW_UP", "LOST"], WON_REPORTED: ["WON_VERIFIED", "LOST"],
    WON_VERIFIED: [], LOST: ["FOLLOW_UP"], FOLLOW_UP: ["CONTACTED", "INTERESTED", "LOST"]
  };
  return (transitions[from] || []).includes(to) && (to !== "CONTACTED" || approved);
}
