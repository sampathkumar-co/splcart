/**
 * Manual customer reply assist. Uses only owner-recorded category and product
 * references. Does NOT infer stock, discounts, price, conversation consent,
 * a verified social account or a message actually being delivered.
 */
export type InquiryProduct={id:string;title:string;category:string;material:string;productUrl:string};
export function categoryMatches(category:string,products:readonly InquiryProduct[]){
 const key=category.trim().toLocaleLowerCase("en-IN");
 if(!key)return [];
 return products.filter(p=>p.category.trim().toLocaleLowerCase("en-IN")===key).slice(0,5);
}
export function manualInquiryReply(category:string,products:readonly InquiryProduct[]){
 const found=categoryMatches(category,products);
 if(found.length){
  return "Thank you for enquiring about "+category.trim()+
   ". We have a product reference you may want to review: "+found[0].title+
   ". Please tell us your preferred quantity and style. We will confirm current availability, specifications, price and delivery before offering a quotation. - Prasanth Jewellers";
 }
 return "Thank you for your enquiry about "+category.trim()+
  ". Please share the design, preferred quantity and requirements you have in mind. We will check actual options, availability and pricing before offering any quotation. - Prasanth Jewellers";
}
