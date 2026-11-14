import { describe, expect, it } from "vitest";
import { canMove, priceAdvantage, scoreProspect, verifiedComparable, type SourceMatch, type SourceProspect } from "../lib/domain";
const now = new Date("2026-11-14T10:00:00Z");
const business: SourceProspect = { category:"CZ jewellery", businessSourceUrl:"https://jewels.example", businessWebsiteUrl:"https://jewels.example", independentSource:true,
  verifiedBusinessAt:now, wholesaleIntentEvidenceUrl:null, contactConsentUrl:null, consentGrantedAt:null };
const match: SourceMatch = { product: {id:"sku",category:"CZ jewellery",material:"alloy",unitDescription:"piece",pricePaise:25000,deliveredPricePaise:null,
  ownerVerifiedAt:now,verificationSource:"OWNER_ATTESTED"}, competitorPricePaise:45000,competitorDeliveredPricePaise:50000,competitorMaterial:"alloy", competitorUnitDescription:"piece",
  competitorEvidenceUrl:"https://retailer.example/product",competitorPriceCheckedAt:now,equivalentMaterials:true,equivalentUnits:true };
describe("conservative wholesale logic",()=>{
  it("never calls an owner-attested catalogue price a verified advantage",()=>{expect(verifiedComparable(match,now)).toBe(false);expect(priceAdvantage(match,now)).toBeNull();expect(scoreProspect(business,[match],now).breakdown.pricingAdvantage).toBe(0)});
  it("scores absent consent as zero and doesn't invent a contact right",()=>{const score=scoreProspect(business,[match],now);expect(score.breakdown.lawfulChannel).toBe(0);expect(score.score).toBe(30);expect(score.qualified).toBe(true)});
  it("fails closed when business isn't verified",()=>{expect(scoreProspect({...business,independentSource:false},[match],now).qualified).toBe(false)});
  it("requires true equivalent products and fresh, API-reconciled delivered prices",()=>{const verified={...match,product:{...match.product,verificationSource:"LIVE_SPLCART_API",deliveredPricePaise:27000}};expect(priceAdvantage(verified,now)).toBe(23000);expect(priceAdvantage({...verified,equivalentUnits:false},now)).toBeNull();expect(priceAdvantage(verified,new Date("2026-12-14"))).toBeNull()});
  it("disallows contact before approval and blocks skipping stages",()=>{expect(canMove("APPROVED","CONTACTED",false)).toBe(false);expect(canMove("RESEARCHED","CONTACTED",true)).toBe(false);expect(canMove("APPROVED","CONTACTED",true)).toBe(true)});
});
