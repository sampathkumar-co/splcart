"use client";
import {useState,useEffect,useCallback,type FormEvent} from "react";
import {MessageSquareText,Plus,ClipboardCopy,CheckCircle2} from "lucide-react";
import {categoryMatches,manualInquiryReply,type InquiryProduct} from "@/lib/customer-inquiry";
type Inquiry={
 id:string;channel:string;customerAlias:string;category:string;message:string;
 status:"OPEN"|"REPLIED_REPORTED"|"CLOSED";sourceLabel:string;receivedAt:string;
 replyText:string|null;closeNote:string|null;
};
/** These messages are transcribed by the owner. No external chat/API connection. */
export function CustomerInbox({products,onUpdated}:{products:InquiryProduct[];onUpdated:()=>Promise<void>}){
 const [inquiries,setInquiries]=useState<Inquiry[]>([]);
 const [openCount,setOpenCount]=useState(0);
 const [loading,setLoading]=useState(true);
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const reload=useCallback(async()=>{
   const response=await fetch("/api/customer-inquiries",{cache:"no-store"});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Cannot read HQ inbox");
   setInquiries(result.inquiries||[]);setOpenCount(result.openCount||0);
 },[]);
 useEffect(()=>{let mounted=true;
   void reload().catch(e=>{if(mounted)setError(String(e.message||e));}).finally(()=>{if(mounted)setLoading(false);});
   return ()=>{mounted=false;};
 },[reload]);
 const save=async(body:Record<string,unknown>)=>{
  if(busy)return false;
  setBusy(true);setError("");setNotice("");
  try{
   const response=await fetch("/api/customer-inquiries",{
    method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body),
   });
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"Could not save");
   setNotice(result.message);await reload();await onUpdated();return true;
  }catch(e){setError(e instanceof Error?e.message:"Unable to save");return false;}
  finally{setBusy(false);}
 };
 const record=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();const form=e.currentTarget;const values=new FormData(form);
  const success=await save({action:"record_inbound",channel:String(values.get("channel")),
   customerAlias:String(values.get("customerAlias")),category:String(values.get("category")),
   message:String(values.get("message")),customerInitiated:values.get("customerInitiated")==="on"});
  if(success)form.reset();
 };
 const reply=async(e:FormEvent<HTMLFormElement>,id:string)=>{
  e.preventDefault();const values=new FormData(e.currentTarget);
  await save({action:"record_manual_reply",inquiryId:id,
   replyText:String(values.get("replyText")),ownerConfirmedSent:values.get("ownerConfirmedSent")==="on"});
 };
 const close=async(id:string)=>{
  const note=window.prompt("Why close this enquiry? Nothing will be sent.");
  if(note)await save({action:"close",inquiryId:id,note:note.trim()});
 };
 const copy=async(draft:string)=>{
  try{await navigator.clipboard.writeText(draft);
   setNotice("Reply draft copied. No message was sent; use the original customer channel manually.");
  }catch{setError("Clipboard unavailable. Copy the editable draft manually.");}
 };
 return <div className="inbox-layout">
  <section className="panel">
   <div className="panel-heading"><div><div className="eyebrow">MANUAL INBOUND · NO ACCOUNT ACCESS</div><h2>Record a real enquiry</h2></div><MessageSquareText size={20}/></div>
   <p className="panel-copy">Only transcribe an enquiry a customer actually sent you first. No phone numbers, account secrets or payment details. These records are owner-reported, never verified by WhatsApp or Instagram.</p>
   <form className="form" aria-label="Record actual incoming enquiry" onSubmit={record}>
    <label className="field"><span>Original channel</span><select name="channel" defaultValue="WHATSAPP" required>
      <option value="WHATSAPP">WhatsApp (manual)</option>
      <option value="INSTAGRAM">Instagram (manual)</option>
      <option value="WEBSITE">Website (manual)</option>
      <option value="OTHER">Other</option>
    </select></label>
    <label className="field"><span>Customer nickname, no contact details</span><input name="customerAlias" required minLength={2} maxLength={80} placeholder="Example: customer at exhibition"/></label>
    <label className="field"><span>Requested jewellery category</span><input name="category" required minLength={2} maxLength={80} placeholder="CZ jewellery"/></label>
    <label className="field"><span>Genuine customer question</span><textarea name="message" rows={4} required minLength={6} maxLength={1200} placeholder="Transcribe the actual incoming jewellery enquiry."/></label>
    <label className="checkline"><input name="customerInitiated" type="checkbox" required/> I confirm the customer initiated this enquiry; it is not a scraped or invented prospect.</label>
    <button type="submit" className="action-primary" disabled={busy}>{busy?"Saving…":"Record owner-reported enquiry"}<Plus size={16}/></button>
   </form>
  </section>
  <section className="panel">
   <div className="panel-heading"><div><div className="eyebrow">SOURCE-ATTRIBUTED CUSTOMER DESK</div><h2>Customer inbox · {openCount} open</h2></div></div>
   <p className="fineprint">Suggested replies use only owner-entered matching jewellery references. Current price, stock and delivery are unverified. Copy and send manually outside Headquarters.</p>
   {loading?<div className="empty">Loading genuine HQ records…</div>:!inquiries.length?<div className="empty">No customer enquiries recorded. No invented messages or leads.</div>:
    <div className="inbox-list">{inquiries.map(q=><article key={q.id} className="inbox-record">
     <div className="inbox-record-head"><strong>{q.customerAlias}</strong><span>{q.status.replaceAll("_"," ")}</span></div>
     <small>{q.channel} · {new Date(q.receivedAt).toLocaleString("en-IN")} · {q.sourceLabel}</small>
     <p className="inbox-message">{q.message}</p>
     <small>Requested category: {q.category} · Not independently platform-verified</small>
     {q.status==="OPEN"&&<>
      <div className="inbox-products">
       {categoryMatches(q.category,products).map(p=><a key={p.id} href={p.productUrl} target="_blank" rel="noopener noreferrer">{p.title} · OWNER_ATTESTED</a>)}
       {!categoryMatches(q.category,products).length&&<small>No relevant owner product record, so none is suggested.</small>}
      </div>
      <form className="form inbox-reply" onSubmit={e=>reply(e,q.id)}>
       <label className="field"><span>Editable suggested reply (not sent)</span>
        <textarea name="replyText" rows={5} required minLength={12} maxLength={900} defaultValue={manualInquiryReply(q.category,products)}/></label>
       <button type="button" className="action-secondary" onClick={()=>copy(manualInquiryReply(q.category,products))}><ClipboardCopy size={15}/> Copy suggested reply</button>
       <label className="checkline"><input type="checkbox" name="ownerConfirmedSent" required/> I personally sent this reply outside HQ and am recording that action.</label>
       <button type="submit" className="action-secondary" disabled={busy}>Record my manual reply <CheckCircle2 size={15}/></button>
      </form>
     </>}
     {q.replyText&&<p className="inbox-message">Owner-reported reply: {q.replyText}</p>}
     {q.status!=="CLOSED"&&<button type="button" className="inbox-close" disabled={busy} onClick={()=>close(q.id)}>Close enquiry</button>}
     {q.status==="CLOSED"&&<small>Owner closure: {q.closeNote}</small>}
    </article>)}</div>}
  </section>
  {error&&<p role="alert" className="alert danger">{error}</p>}
  {notice&&<p role="status" className="alert success">{notice}</p>}
 </div>;
}
