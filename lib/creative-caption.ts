/**
 * No model/API calls, no invented discounts, stock, reviews, testimonials,
 * quality claims or celebrity images. Only owner-entered product metadata.
 */
export function prepareManualCaption(input:{
  productTitle:string; material:string; productUrl:string; platform:"INSTAGRAM"|"YOUTUBE";
}) {
  const title=input.productTitle.trim().replace(/[\r\n]+/g," ").slice(0,140);
  const material=input.material.trim().replace(/[\r\n]+/g," ").slice(0,100);
  const source=new URL(input.productUrl);
  if(source.protocol!=="https:")throw new Error("INVALID_PRODUCT_REFERENCE");
  if(!title||!material)throw new Error("INVALID_PRODUCT_METADATA");
  const hashtag="#PrasanthJewellers #JewelleryCollection";
  if(input.platform==="INSTAGRAM"){
    return [
      "PRASANTH JEWELLERS ✨",
      title,
      "Material (owner-described): "+material,
      "Discover the product: "+source.toString(),
      "For availability and wholesale enquiries, contact the store directly.",
      hashtag,
      "",
      "OWNER NOTE: Review availability, prices, tags and platform policy before posting.",
    ].join("\n");
  }
  return [
    title+" | Prasanth Jewellers",
    "Product: "+title,
    "Material (owner-described): "+material,
    "Product reference: "+source.toString(),
    "This original 20-second product video uses owner-provided photography and code animation.",
    "Enquiries and availability: contact Prasanth Jewellers.",
    hashtag,
    "",
    "OWNER NOTE: Publish manually after reviewing product facts and music rights.",
  ].join("\n");
}
