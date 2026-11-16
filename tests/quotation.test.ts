import {describe,expect,it} from "vitest";
import {canApproveQuote,quoteShareText,totalQuotePaise} from "../lib/quotation";
const now=new Date("2026-11-14T11:00:00Z");
const base={decision:"APPROVED",stage:"CONTACTED",contactConsentUrl:"https://retailer.example.com/consent",consentGrantedAt:now};
describe("independent owner-approved wholesale quotes",()=>{
  it("does precise integer paise totals with bounded quantities",()=>{
    expect(totalQuotePaise(3,25500,4500)).toBe(81000);
    expect(()=>totalQuotePaise(0,25500,0)).toThrow("INVALID_QUOTE_AMOUNT");
    expect(()=>totalQuotePaise(5001,25500,0)).toThrow("INVALID_QUOTE_AMOUNT");
    expect(()=>totalQuotePaise(1,-100,0)).toThrow("INVALID_QUOTE_AMOUNT");
    expect(()=>totalQuotePaise(3,25500,-1)).toThrow("INVALID_QUOTE_AMOUNT");
  });
  it("fails closed without approval, contact and permission",()=>{
    expect(canApproveQuote(base,now)).toBe(true);
    expect(canApproveQuote({...base,decision:"PENDING"},now)).toBe(false);
    expect(canApproveQuote({...base,stage:"RESEARCHED"},now)).toBe(false);
    expect(canApproveQuote({...base,contactConsentUrl:null},now)).toBe(false);
    expect(canApproveQuote({...base,consentGrantedAt:null},now)).toBe(false);
    expect(canApproveQuote({...base,consentGrantedAt:new Date("2023-01-01")},now)).toBe(false);
  });
  it("allows only approved, unexpired manual copy and never calls store",()=>{
    const q={id:"CI-QUOTE-1",productTitleSnapshot:"CI ONLY",
      productUrlSnapshot:"https://splcart.in/products/ci-only-fixture",productSourceSnapshot:"OWNER_ATTESTED",
      quantity:3,unitPricePaise:25500,deliveryPaise:4500,note:"CI fake, not a real offer",
      status:"DRAFT",validUntil:"2099-01-01T00:00:00Z"};
    expect(quoteShareText(q)).toBeNull();
    const text=quoteShareText({...q,status:"APPROVED"});
    expect(text).toContain("₹810.00");
    expect(text).toContain("OWNER_ATTESTED");
    expect(text).toContain("not a paid order");
    expect(quoteShareText({...q,status:"APPROVED",validUntil:"2000-01-01T00:00:00Z"})).toBeNull();
  });
});
