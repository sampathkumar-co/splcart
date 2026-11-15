"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Clapperboard, ImagePlus, Play, ShieldCheck, Download, RotateCcw } from "lucide-react";
import { prepareManualCaption } from "@/lib/creative-caption";

type Product = {id:string;title:string;material:string;productUrl:string};
type Asset = {id:string;productId:string;width:number;height:number;createdAt:string;product:{title:string}};
type Reel = {id:string;productId:string;assetId:string;titleSnapshot:string;materialSnapshot:string;
  linkSnapshot:string;status:string;durationSeconds:number;errorCode:string|null;previewUrl:string|null;
  createdAt:string;finishedAt:string|null;approvedAt:string|null};
type StudioData = {reels:Reel[];assets:Asset[]};
function Status({value}:{value:string}){return <span className={"status status-"+value.toLowerCase().replace(/[^a-z]+/g,"-")}>{value.replaceAll("_"," ")}</span>;}
async function imageToBase64(file:File) {
  if(file.size>3*1024*1024 || file.size<100) throw new Error("Upload a JPEG or PNG under 3 MB.");
  if(!["image/png","image/jpeg"].includes(file.type))throw new Error("Only owner-provided JPEG and PNG photos are supported.");
  return await new Promise<string>((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const value=String(reader.result||"");
      if(!value.includes(","))reject(new Error("Cannot read product photo."));
      else resolve(value.split(",")[1]);
    };
    reader.onerror=()=>reject(new Error("Cannot read product photo."));
    reader.readAsDataURL(file);
  });
}
export function CreativeStudio({products}:{products:Product[]}) {
  const [data,setData]=useState<StudioData>({reels:[],assets:[]});
  const [selectedProduct,setSelectedProduct]=useState("");
  const [assetId,setAssetId]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const refresh=useCallback(async()=>{
    try{
      const response=await fetch("/api/creative/reels",{cache:"no-store"});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.error||"Could not load video studio");
      setData(payload);
    }catch(e){setError(e instanceof Error?e.message:"Studio unavailable");}
  },[]);
  useEffect(()=>{void refresh();const interval=setInterval(()=>void refresh(),8000);return()=>clearInterval(interval);},[refresh]);
  useEffect(()=>{if(!selectedProduct && products[0])setSelectedProduct(products[0].id);},[products,selectedProduct]);
  const photos=useMemo(()=>data.assets.filter(a=>a.productId===selectedProduct),[data.assets,selectedProduct]);
  useEffect(()=>{setAssetId(photos[0]?.id||"");},[selectedProduct,photos]);
  const call=async(path:string,payload:Record<string,unknown>)=>{
    setBusy(true);setError("");setNotice("");
    try{
      const response=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||"Action rejected");
      setNotice(result.message||"Saved in the separate HQ only. No social posts or messages sent.");
      await refresh();
    }catch(e){setError(e instanceof Error?e.message:"Studio action failed");}
    finally{setBusy(false);}
  };
  const copyCaption=async(job:Reel,platform:"INSTAGRAM"|"YOUTUBE")=>{
    if(job.status!=="APPROVED"){setError("Approve the actual rendered video before sharing its caption.");return;}
    try{
      const content=prepareManualCaption({productTitle:job.titleSnapshot,material:job.materialSnapshot,
        productUrl:job.linkSnapshot,platform});
      await navigator.clipboard.writeText(content);
      setNotice(platform+" owner-reviewed caption copied. Open your official account manually to publish; no login or message was automated.");
      setError("");
    }catch{setError("Clipboard unavailable. Use a secure HTTPS browser.");}
  };
  const upload=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const input=e.currentTarget.elements.namedItem("owner-photo") as HTMLInputElement|null;
    const file=input?.files?.[0];
    if(!file||!selectedProduct){setError("Select a product and its original photo.");return;}
    try{
      const contentBase64=await imageToBase64(file);
      await call("/api/creative/assets",{productId:selectedProduct,contentBase64});
      if(input)input.value="";
    }catch(e){setError(e instanceof Error?e.message:"Invalid photo");}
  };
  return <section className="studio-section" aria-label="Code-native jewellery Reel studio">
    <div className="studio-banner">
      <div className="studio-eyebrow"><Clapperboard size={18}/> THE CREATIVE DESK · ZERO PAID AI VIDEO CALLS</div>
      <h2>20-second jewellery Reels, rendered locally.</h2>
      <p>Bring your own genuine jewellery photograph. Headquarters produces an original vertical 720 × 1280 MP4 with code-based motion and typography. The video is silent and contains no invented product demonstrations, discounts or AI-generated people.</p>
    </div>
    {error&&<div className="alert danger" role="alert">{error}</div>}
    {notice&&<div className="alert success" role="status">{notice}</div>}
    <div className="studio-grid">
      <div className="studio-card">
        <h3><ImagePlus size={17}/> 01 / Add your product photo</h3>
        <p className="studio-muted">A registered, owner-attested product is required. Uploads stay inside the separate Headquarters media storage.</p>
        {products.length===0?<div className="empty">Add an owner-attested product in Product Intelligence first. No sample jewellery or invented catalogues are inserted.</div>:<>
          <label className="field"><span>Jewellery product</span><select value={selectedProduct} onChange={e=>setSelectedProduct(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
          <form className="form" onSubmit={upload}>
            <label className="field"><span>Original JPEG or PNG photograph, up to 3 MB</span><input name="owner-photo" type="file" accept="image/png,image/jpeg" required/></label>
            <button className="action-secondary" disabled={busy}><ImagePlus size={16}/> Save photo in HQ</button>
          </form>
          <label className="field"><span>Choose the saved source image</span><select value={assetId} onChange={e=>setAssetId(e.target.value)}>
            {photos.length===0&&<option value="">No owner photo uploaded yet</option>}
            {photos.map(a=><option key={a.id} value={a.id}>{a.width}×{a.height} · {new Date(a.createdAt).toLocaleString("en-IN")}</option>)}
          </select></label>
          <button className="action-primary studio-render" disabled={busy||!assetId} onClick={()=>call("/api/creative/reels",{assetId})}><Play size={16}/> Queue original 20-second Reel</button>
        </>}
        <div className="studio-disclosure"><ShieldCheck size={15}/><span>Nothing is automatically posted to Instagram, YouTube, or WhatsApp. Owner approval is required even after a real MP4 exists. No external model/API keys.</span></div>
      </div>
      <div className="studio-card">
        <h3><Clapperboard size={17}/> 02 / Rendering and approval</h3>
        <p className="studio-muted">This is the real FFmpeg job ledger. Queued, rendering, failed and completed are actual database states, not animation.</p>
        <div className="studio-job-list">
          {data.reels.length===0&&<div className="empty">No videos have been rendered yet. The studio starts empty by design.</div>}
          {data.reels.map(job=><div key={job.id} className="studio-job">
            <div className="studio-job-top"><strong>{job.titleSnapshot}</strong><Status value={job.status}/></div>
            <div className="studio-meta">{job.durationSeconds}s · 9:16 · original product photo · created {new Date(job.createdAt).toLocaleString("en-IN")}</div>
            {job.errorCode&&<div className="studio-error">Actual renderer error: {job.errorCode}</div>}
            {job.previewUrl&&<video className="studio-video" controls playsInline preload="metadata" src={job.previewUrl} aria-label={"Preview rendered Reel for "+job.titleSnapshot}/>}
            <div className="studio-actions">
              {job.status==="RENDERED"&&<button disabled={busy} onClick={()=>{
                if(window.confirm("Approve this actual rendered MP4 for manual use? This DOES NOT publish it."))void call("/api/creative/reels/"+job.id,{action:"approve"});
              }}><ShieldCheck size={14}/> Approve video</button>}
              {job.previewUrl&&<a href={job.previewUrl} download={"Prasanth-Jewellers-"+job.id+".mp4"}><Download size={14}/> View / save MP4</a>}
              {job.status==="APPROVED"&&<>
                <button disabled={busy} onClick={()=>copyCaption(job,"INSTAGRAM")}>Copy Instagram caption</button>
                <button disabled={busy} onClick={()=>copyCaption(job,"YOUTUBE")}>Copy YouTube caption</button>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Open Instagram manually</a>
                <a href="https://studio.youtube.com/" target="_blank" rel="noopener noreferrer">Open YouTube Studio</a>
              </>}
              {job.status==="FAILED"&&<button disabled={busy} onClick={()=>call("/api/creative/reels/"+job.id,{action:"retry"})}><RotateCcw size={14}/> Retry locally</button>}
              {["QUEUED","FAILED","RENDERED"].includes(job.status)&&<button disabled={busy} onClick={()=>{if(window.confirm("Void this local draft?"))void call("/api/creative/reels/"+job.id,{action:"void"});}}>Void</button>}
            </div>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
