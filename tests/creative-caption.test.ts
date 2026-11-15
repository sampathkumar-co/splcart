import {describe,expect,it} from "vitest";
import {prepareManualCaption} from "../lib/creative-caption";

describe("manual no-key social publishing handoff",()=>{
  const source={productTitle:"Gold plated CZ necklace",material:"Owner-attested alloy",
    productUrl:"https://jewellery-owner.example.com/product/necklace"};
  it("generates authentic-owner-fact-only Instagram copy with no publishing request",()=>{
    const caption=prepareManualCaption({...source,platform:"INSTAGRAM"});
    expect(caption).toContain("Gold plated CZ necklace");
    expect(caption).toContain("Material (owner-described): Owner-attested alloy");
    expect(caption).toContain(source.productUrl);
    expect(caption).not.toMatch(/sale today|limited stock|free shipping|guaranteed discount/i);
    expect(caption).toContain("OWNER NOTE");
  });
  it("produces YouTube manual copy with explicit source and review warnings",()=>{
    const result=prepareManualCaption({...source,platform:"YOUTUBE"});
    expect(result).toContain(source.productUrl);
    expect(result).toContain("owner-provided photography");
    expect(result).toContain("Publish manually");
  });
  it("refuses insecure product links and missing owner-supplied materials",()=>{
    expect(()=>prepareManualCaption({...source,productUrl:"http://example.com",platform:"INSTAGRAM"}))
      .toThrow("INVALID_PRODUCT_REFERENCE");
    expect(()=>prepareManualCaption({...source,material:"  ",platform:"YOUTUBE"}))
      .toThrow("INVALID_PRODUCT_METADATA");
  });
});
