"use client";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Activity, ArrowUpRight, BadgeCheck, Building2, CheckCircle2, CircleDollarSign, Compass, ExternalLink, FileSearch, Gem, LayoutDashboard, Menu, Clapperboard, MessageSquareText, Plus, Radio, RefreshCw, LogOut, Search, ShieldCheck, X, XCircle } from "lucide-react";
import type { RoomKey } from "./office";
import type { AgentRecord } from "@/lib/agent-roster";
import { quoteShareText } from "@/lib/quotation";
import { CreativeStudio } from "./creative-studio";
import { CustomerInbox } from "./customer-inbox";
const Office = lazy(() => import("./office").then(m => ({default:m.Office})));

type Quote = {id:string;productId:string;productTitleSnapshot:string;productUrlSnapshot:string;productSourceSnapshot:string;quantity:number;unitPricePaise:number;deliveryPaise:number;note:string;status:string;validUntil:string|null;approvedAt:string|null;totalRupees:number};
type Prospect = {id:string;name:string;city:string;category:string;businessSourceUrl:string;evidenceSummary:string;verificationEvidenceText:string|null;verificationEvidenceUrl:string|null;score:number;qualified:boolean;breakdown:Record<string,number>;warnings:string[];stage:string;decision:string;matches:{id:string;productId:string;title:string;productUrl:string;source:string;priceRupees:number;competitorPriceRupees:number|null; evidenceUrl:string}[];quotes:Quote[];activities:{id:string;event:string;note:string;createdAt:string;evidenceUrl:string|null}[];conversion:{orderReference:string;grossAmountRupees:number;verifiedAt:string|null}|null};
type Product = {id:string;title:string;category:string;material:string;unitDescription:string;productUrl:string;priceRupees:number;verificationSource:string};
type Run = {id:string;sourceUrl:string;finalUrl:string|null;pageTitle:string|null;excerpt:string|null;status:string;errorCode:string|null;startedAt:string;evidence?:{headings?:string[];description?:string;businessLinks?:{title:string;url:string}[];tabs?:{sourceUrl:string;status:string;evidence?:{title:string;finalUrl:string;excerpt:string};errorCode?:string}[];completed?:number;failed?:number}};
type AgentTask = {id:string;roleId:string;status:string;errorCode:string|null;createdAt:string;
  modelCostPaise:number;result:{summary?:string;items?:{label:string;details:string;sourceUrl?:string}[];computeCost?:string}|null};
type Dashboard = {stats:{researched:number;qualified:number;awaitingReview:number;approved:number;interested:number;ownerReportedOrders:number;verifiedRevenueRupees:number};prospects:Prospect[];products:Product[];runs:Run[];agents:AgentRecord[];agentTasks:AgentTask[];agentSchedule:{enabled:boolean;lastRunDate:string|null;localTime:string;timeZone:string};control:{researchPaused:boolean;reason:string;updatedAt:string|null;audit:{id:string;event:string;reason:string;createdAt:string}[]};integrations:Record<string,string>};
const fmt = (v:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(v);
const steps = ["DISCOVERED","RESEARCHED","QUALIFIED","APPROVED","CONTACTED","INTERESTED","QUOTATION","NEGOTIATION"];
const emptyStats = ["researched","qualified","awaitingReview","verifiedRevenueRupees"] as const;

function Field({name,label,placeholder,type="text",required=true,defaultValue}: {name:string;label:string;placeholder?:string;type?:string;required?:boolean;defaultValue?:string}) {return <label className="field"><span>{label}</span><input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue}/></label>}
function Panel({title,eyebrow,children,actions}:{title:string;eyebrow?:string;children:React.ReactNode;actions?:React.ReactNode}) {return <section className="panel"><div className="panel-heading"><div><div className="eyebrow">{eyebrow||"WORKSTATION"}</div><h2>{title}</h2></div>{actions}</div>{children}</section>}
function Badge({value}:{value:string}) {return <span className={`status status-${value.toLowerCase().replace(/[^a-z]+/g,"-")}`}>{value.replaceAll("_"," ")}</span>}
export function Headquarters(){
 const [data,setData]=useState<Dashboard|null>(null);const [selected,setSelected]=useState<RoomKey>("sales");const [selectedAgentId,setSelectedAgentId]=useState<string|null>("web-discovery");const [tab,setTab]=useState<"overview"|"leads"|"research"|"products"|"creative"|"inbox">("overview");const [visual,setVisual]=useState(true);const [leadId,setLeadId]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [notice,setNotice]=useState("");const [mobileOpen,setMobileOpen]=useState(false);const [readiness,setReadiness]=useState<{completed:number;blocked:number;batchId:string}|null>(null);
 const refresh=useCallback(async()=>{try {const r=await fetch("/api/dashboard",{cache:"no-store"});const j=await r.json();if(!r.ok)throw new Error(j.error||"Unable to load dashboard");setData(j);setError("")}catch(e){setError((e as Error).message)}},[]);
 useEffect(()=>{refresh();const interval=setInterval(refresh,15000);return ()=>clearInterval(interval)},[refresh]);
 const act=async(payload:Record<string,unknown>)=>{setBusy(true);setError("");setNotice("");try{const r=await fetch("/api/actions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const j=await r.json();if(!r.ok)throw new Error((j.error||"Action failed")+(j.details?": "+j.details.join(", "):""));setNotice("Saved with audit evidence. No external message was sent.");await refresh();return true;}catch(e){setError((e as Error).message);return false;}finally{setBusy(false)}};
 const runAgent=async(roleId:string)=>{
   setBusy(true);setError("");setNotice("");
   try{
    const response=await fetch("/api/agents/run",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({roleId})});
    const outcome=await response.json();
    if(!response.ok)throw new Error(outcome.error||"Local report failed");
    setNotice(outcome.message||"Local role task recorded, no external action.");
    await refresh();
   }catch(e){setError(e instanceof Error?e.message:"Agent task failed");}
   finally{setBusy(false);}
 };
 const runReadiness=async()=>{
   setBusy(true);setError("");setNotice("");
   try{
    const response=await fetch("/api/agents/briefing",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
    const outcome=await response.json();
    if(!response.ok)throw new Error(outcome.error||"Readiness check failed");
    setReadiness({completed:outcome.completed,blocked:outcome.blocked,batchId:outcome.batchId});
    setNotice("Recorded all sixteen role assessments. "+outcome.blocked+" are blocked by missing evidence or external permissions. No message, post, call or paid AI request.");
    await refresh();
   }catch(e){setError(e instanceof Error?e.message:"Readiness check failed");}
   finally{setBusy(false);}
 };
 const toggleDailyAgentBriefing=async()=>{
   if(!data||busy)return;
   setBusy(true);setError("");setNotice("");
   try{
     const response=await fetch("/api/agents/schedule",{
       method:"POST",headers:{"Content-Type":"application/json"},
       body:JSON.stringify({enabled:!data.agentSchedule.enabled}),
     });
     const result=await response.json();
     if(!response.ok)throw new Error(result.error||"Unable to update briefing schedule");
     setNotice(result.message||"Internal role schedule saved.");
     await refresh();
   }catch(error){setError(error instanceof Error?error.message:"Schedule update failed");}
   finally{setBusy(false);}
 };
 const submit=(action:string)=>async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const form=e.currentTarget;const val=Object.fromEntries(new FormData(form));const body:Record<string,unknown>={action,...val};if(action==="add_match"){body.equivalentMaterials=val.equivalentMaterials==="on";body.equivalentUnits=val.equivalentUnits==="on";for(const key of ["competitorMaterial","competitorUnitDescription","competitorPriceRupees","competitorEvidenceUrl"]){if(body[key]==="")delete body[key];}}if(await act(body)){form.reset();}};
 const research=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();const form=e.currentTarget;const formData=new FormData(form);const url=String(formData.get("url")||"");const extraUrls=["url2","url3"].map(name=>String(formData.get(name)||"").trim()).filter(Boolean);setBusy(true);setNotice("");setError("");try{const r=await fetch("/api/research",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url,extraUrls})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Browser inspection failed");setNotice(`Real Chromium session captured ${j.finding.completed} successful tab(s) and ${j.finding.failed} failure(s). Register the lead when evidence is sufficient.`);await refresh();}catch(e){setError((e as Error).message);await refresh()}finally{setBusy(false)}};
 const prospect=data?.prospects.find(p=>p.id===leadId)||data?.prospects[0];
 const copyQuote=async(q:Quote)=>{const message=quoteShareText(q);if(!message){setError("Only current owner-approved quotes can be copied");return;}try{await navigator.clipboard.writeText(message);setNotice("Owner-approved quote copied. Nothing was sent automatically.");}catch{setError("Clipboard unavailable. Use an HTTPS browser or a supported device.");}};
 const focusedAgent=data?.agents.find(a=>a.id===selectedAgentId);
 const focusedTask=data?.agentTasks?.find(t=>t.roleId===selectedAgentId);
 return <div className="app-shell">
  <aside className={`sidebar ${mobileOpen?"sidebar-open":""}`}>
   <div className="brand"><div className="brand-mark"><Gem size={25}/></div><div><strong>PRASANTH</strong><small>INTELLIGENCE HQ</small></div></div>
   <div className="workspace-caption">COMMAND CENTER <span className="workspace-live"><span/> SECURE</span></div>
   <nav className="nav">
    {([ ["overview",<LayoutDashboard size={18}/>,"Headquarters"],["research",<Compass size={18}/>,"Web Discovery"],["leads",<Building2 size={18}/>,"Wholesale Pipeline"],["products",<Gem size={18}/>,"Product Intelligence"],["creative",<Clapperboard size={18}/>,"Creative Studio"],["inbox",<MessageSquareText size={18}/>,"Customer Inbox"]] as const).map(([key,ico,title])=><button key={key} type="button" className={tab===key?"nav-link active":"nav-link"} onClick={()=>{setTab(key);setMobileOpen(false)}}>{ico}<span>{title}</span>{tab===key&&<span className="nav-indicator"/>}</button>)}
   </nav>
   <div className="sidebar-bottom"><div className="sidebar-kicker">SYSTEM CONTROL</div><div className="integration-line"><span className="yellow-dot"/>SPLCART shopping references <Badge value="REFERENCE_ONLY"/></div><div className="integration-line"><span className="green-dot"/>Owner-controlled browser</div><div className="integration-line"><span className="yellow-dot"/>Outbound messaging <Badge value="MANUAL"/></div><p>Operations and Finance stay under owner control.</p></div>
  </aside>
  <main className="main-content">
   <header className="topbar"><div className="top-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={()=>setMobileOpen(!mobileOpen)}><Menu size={20}/></button><span className="breadcrumb">WORKSPACE / {tab.toUpperCase()}</span><span className="topbar-divider"/><span className="topbar-secondary">Prasanth Jewellers</span></div><div className="top-right"><span className="system-label"><Radio size={14}/> LIVE DATA ONLY</span><button className="icon-button" aria-label="Refresh data" onClick={refresh}><RefreshCw size={17}/></button><div className="avatar">PJ</div><button type="button" className="hq-signout" title="End Headquarters owner session" onClick={async()=>{try{await fetch("/api/auth/logout",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});}finally{window.location.replace("/login");}}}><LogOut size={14}/> Sign out</button></div></header>
   <div className="content-inner">
    <div className="hero-heading"><div><div className="eyebrow eyebrow-gold"><span className="tiny-line"/> AUTONOMOUS GROWTH DIVISION</div><h1>{tab==="overview"?"The Headquarters":tab==="research"?"Intelligence Discovery":tab==="leads"?"Wholesale Opportunities":tab==="creative"?"Creative Studio":tab==="inbox"?"Customer Inbox":"Catalogue Intelligence"}</h1><p>{tab==="overview"?"A beautifully controlled workplace built around verifiable commercial progress.":tab==="research"?"Inspect up to three explicitly approved pages on one independent retailer website.":tab==="leads"?"Every opportunity has a source, score, owner decision, and sales history.":tab==="creative"?"Original code-rendered jewellery videos from actual owner-uploaded product photos.":tab==="inbox"?"Owner-reported genuine incoming messages, source-bounded jewellery suggestions, and manual replies only.":"Only authentic product records. No invented prices or catalogue availability."}</p></div><div className="date-stamp">PRASANTH <span> / </span> SALES INTELLIGENCE <span> · </span> V0.1</div></div>
    {error&&<div role="alert" className="alert danger"><XCircle size={18}/>{error}<button aria-label="Dismiss error" onClick={()=>setError("")}><X size={16}/></button></div>}
    {notice&&<div role="status" className="alert success"><CheckCircle2 size={18}/>{notice}<button aria-label="Dismiss message" onClick={()=>setNotice("")}><X size={16}/></button></div>}
    {tab==="overview"&&<>
     <div className="stat-grid">
       {([ ["Researched leads","researched",<Search size={19}/>],["Qualified opportunities","qualified",<BadgeCheck size={19}/>],["Awaiting owner review","awaitingReview",<ShieldCheck size={19}/>],["Verified sales revenue","verifiedRevenueRupees",<CircleDollarSign size={19}/>]] as const).map(([title,key,ico])=><div className="stat-card" key={key}><div className="stat-top"><span>{title}</span>{ico}</div><div className="stat-value">{!data?"—":key==="verifiedRevenueRupees"?fmt(data.stats[key]):data.stats[key]}</div><span className="stat-bottom">{key==="verifiedRevenueRupees"?"Payment-reconciled only":"Persisted records · Not a forecast"}</span></div>)}
     </div>
     <section className="hq-visual"><div className="visual-top"><div><div className="eyebrow">THE VIRTUAL WORKSPACE</div><h2>Your AI headquarters</h2><p>Click any workstation to inspect its purpose and current operational state.</p></div><div className="visual-actions"><button className="tiny-button" onClick={()=>setVisual(v=>!v)}>{visual?"2D ACCESSIBLE VIEW":"3D OFFICE VIEW"}</button></div></div>
       {visual?<Suspense fallback={<div className="canvas-loading">Preparing 3D office...</div>}><Office selected={selected} onSelect={setSelected} agents={data?.agents||[]} selectedAgentId={selectedAgentId} onAgentSelect={setSelectedAgentId}/></Suspense>:<div className="room-grid">{([ ["ceo","CEO OFFICE","Owner approvals and revenue"],["sales","SALES FLOOR","Real research and evidence"],["marketing","MARKETING STUDIO","Not configured yet"],["meeting","MEETING ROOM","Strategy and reviews"]] as const).map(([room,title,desc])=><button key={room} onClick={()=>setSelected(room)} className={selected===room?"room-select selected":"room-select"}><Building2 size={25}/><strong>{title}</strong><span>{desc}</span></button>)}</div>}
       <div className="station-console" aria-label="All sixteen configured organizational roles">
        <div className="station-console-head"><span>THE 16 AGENT WORKSTATIONS</span><div className="station-console-utilities"><small>Real source-backed outcomes only. Blocked roles are not operational.</small><button type="button" className="agent-run-button" disabled={busy||!data} onClick={runReadiness}>{busy?"Checking…":"Assess all 16 roles"}</button></div></div>
        <div className="agent-daily-opt-in" role="group" aria-label="Daily local agent evidence report">
          <div><strong>Daily local evidence briefing</strong>
            <p>08:30 India time. All 16 role checks use saved HQ evidence; unsupported
             calls, DMs and external integrations stay blocked. No paid model calls.</p>
            <small>{data?.agentSchedule.lastRunDate?
              "Last completed India-local date: "+data.agentSchedule.lastRunDate:
              "No scheduled briefing completed yet"}</small>
          </div>
          <button className="agent-run-button" type="button"
            aria-pressed={data?.agentSchedule.enabled??false}
            disabled={busy||!data} onClick={toggleDailyAgentBriefing}>
            {data?.agentSchedule.enabled?"Disable daily briefing":"Enable daily briefing"}
          </button>
        </div>
        {readiness&&<div className="readiness-summary" role="status"><strong>{readiness.completed} locally completed</strong><span>{readiness.blocked} blocked</span><small>Owner-triggered readiness batch. No external AI, calls, messages or posts. Batch {readiness.batchId.slice(0,8)}.</small></div>}
        <div className="station-console-grid">
         {(data?.agents||[]).map(agent=><button type="button" key={agent.id} className={selectedAgentId===agent.id?"station-chip selected":"station-chip"} onClick={()=>{setSelectedAgentId(agent.id);setSelected(agent.room)}} aria-pressed={selectedAgentId===agent.id}>
          <span className="station-chip-code">{agent.short}</span><span className="station-chip-name">{agent.name}</span><Badge value={agent.status}/>
         </button>)}
        </div>
        {focusedAgent&&<>
          <div className="station-details" role="status"><strong>{focusedAgent.name}</strong><Badge value={focusedAgent.status}/><span>{focusedAgent.description}</span>
            {focusedAgent.evidenceCount>0&&<small>{focusedAgent.evidenceCount} actual completed reports/inspections</small>}
            {focusedAgent.id==="customer-conversation"&&<button type="button" className="agent-run-button" onClick={()=>setTab("inbox")}>Open Customer Inbox</button>}
            {focusedAgent.status==="ON_DEMAND"&&<button type="button" className="agent-run-button" disabled={busy} onClick={()=>runAgent(focusedAgent.id)}>{busy?"Evaluating HQ evidence…":"Run local evidence task"}</button>}
          </div>
          {focusedTask&&<div className="agent-real-report" aria-label="Actual persisted agent outcome">
            <div className="agent-report-head"><strong>Latest real task</strong><Badge value={focusedTask.status}/><small>{new Date(focusedTask.createdAt).toLocaleString("en-IN")}</small></div>
            <p>{focusedTask.result?.summary||focusedTask.errorCode||"No task report recorded"}</p>
            {(focusedTask.result?.items||[]).map((item,index)=><div key={index} className="agent-report-item"><strong>{item.label}</strong><span>{item.details}</span>
              {item.sourceUrl&&<a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Source <ExternalLink size={11}/></a>}</div>)}
            <small>Paid model charges: ₹{(focusedTask.modelCostPaise/100).toFixed(2)}; local computing/electricity not metered.</small>
          </div>}
        </>}
       </div>
       <div className="room-inspector"><div className="room-inspector-heading"><span className="eyebrow">SELECTED WORKSTATION</span><h3>{selected==="ceo"?"Executive Suite":selected==="sales"?"Sales Intelligence":selected==="marketing"?"Creative Studio":"Strategy Room"}</h3></div><p>{selected==="sales"?`${data?.runs.filter(r=>r.status==="COMPLETED").length||0} completed browser inspections. Research, matching, approval and outreach are owner-controlled.`:selected==="ceo"?`${data?.stats.awaitingReview||0} leads awaiting review. Verified revenue is strictly payment-reconciled.`:selected==="marketing"?"Real local FFmpeg code-rendered Reels, opt-in daily scheduling, owner-approved manual publishing only.":"Plan reviews, audit trail and bounded agent work. No background agents run without authorization."}</p><button onClick={()=>setTab(selected==="sales"?"research":selected==="ceo"?"leads":selected==="marketing"?"creative":"overview")}>Open workspace <ArrowUpRight size={16}/></button></div>
     </section>
     <div className="split-grid"><Panel title="Recent Research" eyebrow="EXECUTION EVIDENCE" actions={<button className="text-button" onClick={()=>setTab("research")}>View all <ArrowUpRight size={15}/></button>}><ResearchList runs={data?.runs.slice(0,4)||[]}/></Panel><Panel title="Agent Operations" eyebrow="REAL STATUS ONLY"><div className="agent-list">{(data?.agents||[]).map(a=><div key={a.name} className="agent-row"><span className="agent-icon"><Activity size={17}/></span><span>{a.name}</span><Badge value={a.status}/></div>)}</div></Panel></div>
    </>}
    {tab==="research"&&<div className="split-grid"><Panel title="Browser Research" eyebrow="PLAYWRIGHT · DIRECT BROWSER"><p className="panel-copy">Open up to three public pages on the same independent retailer site in one real Chromium session. Each tab reports its own result or failure. No Google scraping or automatic crawling.</p><div className="research-control-panel" role="group" aria-label="Owner controls for new website research">
 <div><strong>{data?.control.researchPaused?"New research paused":"Manual research enabled"}</strong>
 <p>{data?.control.researchPaused ? data.control.reason : "Only the owner can start browser research. Pausing prevents NEW sessions; a session already running may finish."}</p></div>
 <button className={data?.control.researchPaused?"research-control-resume":"research-control-pause"} disabled={busy} onClick={()=>{
  const paused=!data?.control.researchPaused;
  const reason=window.prompt(paused?"Why pause new website inspections?":"Reason for re-enabling permitted website inspections?");
  if(!reason||reason.trim().length<3)return;
  act({action:"set_research_pause",paused,reason:reason.trim()});
 }}>{data?.control.researchPaused?"Resume new research":"Pause new research"}</button>
</div>{data&&data.control.audit.length>0&&<p className="fineprint">Latest owner control: {data.control.audit[0].event.replaceAll("_"," ")} · {data.control.audit[0].reason} · {new Date(data.control.audit[0].createdAt).toLocaleString("en-IN")}</p>}
<form className="form" onSubmit={research}><Field name="url" label="Retailer website: primary tab" type="url" placeholder="https://retailer.example/"/><Field name="url2" label="Optional second page (same retailer)" type="url" required={false} placeholder="https://retailer.example/wholesale"/><Field name="url3" label="Optional third page (same retailer)" type="url" required={false} placeholder="https://retailer.example/collections"/><button className="action-primary" disabled={busy||data?.control.researchPaused}>{data?.control.researchPaused?"Research paused":busy?"Inspecting page…":"Inspect in real browser"}<ExternalLink size={16}/></button></form><div className="instruction"><ShieldCheck size={16}/> Open <a href="https://www.google.com/search?q=artificial+jewellery+retailers+Visakhapatnam" target="_blank" rel="noreferrer">Google Search</a> manually, choose a business's independent website, then inspect its URL here. Results from the website are evidence, not proof of permission to contact.</div></Panel><Panel title="Browser History" eyebrow="EVIDENCE ARCHIVE"><ResearchList runs={data?.runs||[]}/></Panel></div>}
    {tab==="leads"&&<div className="leads-layout"><div><Panel title="Wholesale Lead Register" eyebrow="OWNED WORKFLOW"><p className="panel-copy">Add a retailer with a valid source. To mark browser verification, select a completed inspection. Otherwise it remains unverified until independently researched.</p><form className="form" onSubmit={submit("add_prospect")}><Field name="name" label="Retailer / business name" placeholder="Business legal or trading name"/><div className="form-row"><Field name="city" label="City" placeholder="Visakhapatnam"/><Field name="category" label="Jewellery category" placeholder="CZ jewellery"/></div><Field name="businessSourceUrl" label="Independent source link" type="url" placeholder="https://retailer.example"/><Field name="evidenceSummary" label="Source evidence summary" placeholder="What the site actually confirms"/><label className="field"><span>Verified browser inspection</span><select name="researchRunId" defaultValue=""><option value="">None, mark unverified</option>{data?.runs.filter(r=>r.status==="COMPLETED").map(r=><option key={r.id} value={r.id}>{r.pageTitle||r.sourceUrl}</option>)}</select></label><button className="action-primary" disabled={busy}>Register source-backed lead <Plus size={16}/></button></form></Panel></div><div><Panel title="Opportunity Pipeline" eyebrow="SCORE & OWNER CONTROL"><div className="lead-list">{!data?.prospects.length&&<div className="empty">No leads yet. Start with a permitted public business source, then register verified evidence.</div>}{data?.prospects.map(p=><button key={p.id} className={prospect?.id===p.id?"lead-item selected":"lead-item"} onClick={()=>setLeadId(p.id)}><div className="lead-item-header"><strong>{p.name}</strong><span className="score">{p.score}<small>/100</small></span></div><div className="lead-sub">{p.city} · {p.category}</div><div className="lead-footer"><Badge value={p.stage}/><Badge value={p.decision}/></div></button>)}</div></Panel>{prospect&&<Panel title={prospect.name} eyebrow="EVIDENCE & REVIEW"><div className="detail-top"><div className="detail-score">{prospect.score}<span> / 100</span></div><div><Badge value={prospect.stage}/><p className="fineprint">{prospect.qualified?"Threshold reached with independent evidence":"Needs more evidence before qualification"}</p></div></div><p className="panel-copy">{prospect.evidenceSummary}</p>
{prospect.verificationEvidenceText
 ? <p className="fineprint">Owner-reviewed captured business evidence: <a href={prospect.verificationEvidenceUrl||prospect.businessSourceUrl} target="_blank" rel="noreferrer">{prospect.verificationEvidenceText}</a></p>
 : <div className="verification-note">Unverified business. A successful browser visit is not proof of a jewellery retailer.</div>}
<form className="form verification-form" onSubmit={submit("verify_business")}>
 <input type="hidden" name="prospectId" value={prospect.id}/>
 <label className="field"><span>Completed browser inspection of this retailer</span><select required name="researchRunId" defaultValue=""><option value="" disabled>Choose inspected source</option>
 {(data?.runs||[]).filter(r=>r.status==="COMPLETED"&&new URL(r.finalUrl||r.sourceUrl).hostname.replace(/^www\./,"")===new URL(prospect.businessSourceUrl).hostname.replace(/^www\./,"")).map(r=><option key={r.id} value={r.id}>{r.pageTitle||r.sourceUrl}</option>)}
 </select></label>
 <Field name="evidenceText" label="Exact captured category/business excerpt (16+ characters)" placeholder="Paste a phrase from the actual site inspection"/>
 <button type="submit" className="action-secondary" disabled={busy}>Confirm reviewed website evidence</button>
</form><a className="source-link" href={prospect.businessSourceUrl} target="_blank" rel="noopener noreferrer">Open evidence source <ExternalLink size={14}/></a><div className="score-lines">{Object.entries(prospect.breakdown).map(([key,v])=><div key={key}><span>{key.replace(/([A-Z])/g," $1")}</span><b>{v}</b></div>)}</div>{prospect.warnings.map((w,i)=><p key={i} className="warning-line">• {w}</p>)}<div className="section-divider"/><h3>Evidence of wholesale buying intent</h3>
<p className="fineprint">Record an authentic source showing wholesale interest or buying potential. This is an owner assertion and is kept separate from outreach consent.</p>
<form className="form" onSubmit={submit("record_wholesale_intent")}>
 <input type="hidden" name="prospectId" value={prospect.id}/>
 <Field name="evidenceUrl" label="Public independent source supporting wholesale intent" type="url"/>
 <Field name="note" label="What the source actually confirms" placeholder="Retailer seeks a specific CZ jewellery category"/>
 <button className="action-secondary" disabled={busy}>Record intent evidence</button>
</form>
<div className="section-divider"/><h3>Document outreach permission</h3><p className="fineprint">Record an opted-in enquiry, requested callback or other genuinely permitted basis. A public contact number alone is not enough. The owner remains responsible for applicable channel rules.</p><form className="form" onSubmit={submit("record_permission")}><input type="hidden" name="prospectId" value={prospect.id}/><Field name="consentEvidenceUrl" label="HTTPS proof of contact eligibility" type="url"/><Field name="consentNote" label="Reason contact is allowed" placeholder="Opted in through wholesale form"/><button className="action-secondary" disabled={busy}>Record owner-attested permission</button></form><div className="approval-buttons"><button disabled={busy||!prospect.qualified} onClick={()=>act({action:"review",prospectId:prospect.id,decision:"APPROVED",note:"Owner reviewed the evidence and approved manual contact evaluation"})}><CheckCircle2 size={16}/> Approve</button><button disabled={busy} onClick={()=>act({action:"review",prospectId:prospect.id,decision:"REJECTED",note:"Owner rejected the opportunity after review"})}><XCircle size={16}/> Reject</button></div><div className="field"><span>Move to next pipeline stage</span><div className="stage-buttons">{steps.filter(s=>s!==prospect.stage).filter(s=>["RESEARCHED","QUALIFIED","APPROVED","CONTACTED","INTERESTED","QUOTATION","NEGOTIATION"].includes(s)).map(s=><button key={s} disabled={busy} onClick={()=>{const note=window.prompt(s==="CONTACTED"?"What manual outreach was done? Include an evidence URL in the next prompt.":`Evidence/reason to move to ${s}`);if(!note)return;if(s==="CONTACTED"){const evidenceUrl=window.prompt("HTTPS evidence URL of actual owner-performed outreach (required)");if(!evidenceUrl)return;act({action:"advance",prospectId:prospect.id,to:s,note,evidenceUrl});}else act({action:"advance",prospectId:prospect.id,to:s,note})}}>{s.replaceAll("_"," ")}</button>)}</div></div><div className="section-divider"/><h3>Match jewellery to this retailer</h3><p className="fineprint">Select a relevant owner-entered product. Competitor prices are optional. Do not claim a price advantage without independent comparable evidence.</p><form className="form" onSubmit={submit("add_match")}><input type="hidden" name="prospectId" value={prospect.id}/><label className="field"><span>Owner-entered product reference</span><select name="productId" required defaultValue=""><option value="" disabled>Choose product</option>{data?.products.map(p=><option key={p.id} value={p.id}>{p.title} · {fmt(p.priceRupees)}</option>)}</select></label><Field name="competitorMaterial" label="Competitor material (optional)" required={false} placeholder="Only if independently observed"/><Field name="competitorUnitDescription" label="Competitor units (optional)" required={false} placeholder="Only if independently observed"/><Field name="competitorPriceRupees" label="Observed competitor price (optional, ₹)" type="number" required={false}/><Field name="competitorEvidenceUrl" label="Independent price evidence link (if price entered)" type="url" required={false}/><label className="checkline"><input type="checkbox" name="equivalentMaterials"/>Same verified materials</label><label className="checkline"><input type="checkbox" name="equivalentUnits"/>Same verified quantity / units</label><button className="action-secondary" disabled={busy}>Save product relevance match</button></form>{prospect.matches.map(m=><div className="match-row" key={m.id}><div><a href={m.productUrl} target="_blank" rel="noreferrer">{m.title}</a><span>{m.source}</span></div><strong>{fmt(m.priceRupees)}</strong></div>)}<div className="section-divider"/>
<h3>Wholesale quotation desk</h3>
<p className="fineprint">Draft an independent Headquarters quotation using a matched owner-entered product reference. Prices, stock and delivery are not fetched from SPLCART. Approval prepares text for manual sending only.</p>
<form className="form" onSubmit={submit("create_quote")}>
 <input type="hidden" name="prospectId" value={prospect.id}/>
 <label className="field"><span>Previously matched product</span><select name="productId" required defaultValue=""><option value="" disabled>Choose matched product</option>{prospect.matches.map(m=><option key={m.productId} value={m.productId}>{m.title} · {m.source} · reference {fmt(m.priceRupees)}</option>)}</select></label>
 <div className="form-row"><Field name="quantity" label="Quantity" type="number" defaultValue="1"/><Field name="unitPriceRupees" label="Proposed unit price (₹)" type="number"/></div>
 <Field name="deliveryRupees" label="Delivery estimate (₹, 0 if none)" type="number" defaultValue="0"/>
 <label className="field"><span>Quote conditions (optional)</span><input name="note" maxLength={600} placeholder="Requested colors, shipping terms, expiry conditions" /></label>
 <button className="action-secondary" disabled={busy||!prospect.matches.length}>Save quote draft <Plus size={15}/></button>
</form>
<div className="quote-list">
 {prospect.quotes.length===0&&<p className="fineprint">No quote drafted. Pipeline cannot advance to QUOTATION without an approved, unexpired quote.</p>}
 {prospect.quotes.map(q=><section key={q.id} className="quote-card" aria-label={"Quote "+q.id}>
  <div className="quote-card-head"><strong>{q.productTitleSnapshot}</strong><Badge value={q.status}/></div>
  <p>{q.quantity} × {fmt(q.unitPricePaise/100)} + delivery {fmt(q.deliveryPaise/100)} = <strong>{fmt(q.totalRupees)}</strong></p>
  <p className="fineprint">Product: <a href={q.productUrlSnapshot} target="_blank" rel="noreferrer">external shopping reference</a> · {q.productSourceSnapshot}. {q.approvedAt?"Owner approved "+new Date(q.approvedAt).toLocaleDateString("en-IN"):"Awaiting owner review"}</p>
  {q.validUntil&&<p className="fineprint">Valid until: {new Date(q.validUntil).toLocaleDateString("en-IN")}</p>}
  <div className="quote-actions">
   {q.status==="DRAFT"&&<button disabled={busy} onClick={()=>{if(window.confirm("Confirm that YOU checked the proposed quote price and current product availability. This approves the quotation for MANUAL sharing only and sends nothing automatically.")){act({action:"approve_quote",quoteId:q.id,priceConfirmed:true,availabilityConfirmed:true})}}}>Approve for manual sharing</button>}
   {q.status==="APPROVED"&&<button disabled={busy||!q.validUntil||new Date(q.validUntil).getTime()<Date.now()} onClick={()=>copyQuote(q)}>Copy approved quotation</button>}
   {q.status!=="VOID"&&<button disabled={busy} onClick={()=>{if(window.confirm("Void this quote?"))act({action:"void_quote",quoteId:q.id})}}>Void</button>}
  </div>
 </section>)}
</div>
<div className="section-divider"/><h3>Record owner-reported wholesale sale</h3><p className="fineprint">Only after an approved quotation. Reporting is not payment verification and never inflates verified revenue.</p><form className="form" onSubmit={submit("record_order")}><input type="hidden" name="prospectId" value={prospect.id}/><Field name="orderReference" label="Actual order reference"/><Field name="amountRupees" label="Order amount in ₹" type="number"/><Field name="evidenceUrl" label="Order evidence URL (HTTPS)" type="url"/><button className="action-secondary" disabled={busy}>Log unverified order</button></form><div className="audit"><h3>Audit history</h3>{prospect.activities.map(a=><div className="audit-item" key={a.id}><span>{new Date(a.createdAt).toLocaleString("en-IN")}</span><strong>{a.event}</strong><p>{a.note}</p></div>)}</div></Panel>}</div></div>}
    {tab==="products"&&<div className="split-grid"><Panel title="Register Product Reference" eyebrow="SOURCE-ATTRIBUTED CATALOGUE"><p className="panel-copy">Add only authentic product records checked by the owner against a public source. These are labelled OWNER_ATTESTED, not automatically verified. Headquarters stores only owner-entered product snapshots. The storefront is separate and is not connected or modified.</p><form className="form" onSubmit={submit("add_product")}><Field name="splcartProductId" label="Owner reference SKU / source product ID"/><Field name="title" label="Product title"/><div className="form-row"><Field name="category" label="Category" placeholder="CZ Jewellery"/><Field name="material" label="Material" placeholder="Gold-plated alloy"/></div><Field name="unitDescription" label="Sale quantity" placeholder="Single piece"/><Field name="priceRupees" label="Current listing price (₹)" type="number"/><Field name="productUrl" label="Public product reference URL" type="url" placeholder="https://splcart.in/products/..."/><button disabled={busy} className="action-primary">Add owner-attested product <Plus size={16}/></button></form></Panel><Panel title="Verified Catalogue Register" eyebrow="SOURCE LABELS"><div className="product-list">{!data?.products.length&&<div className="empty">No products registered. The catalogue is empty until the owner enters records.</div>}{data?.products.map(p=><a key={p.id} href={p.productUrl} target="_blank" rel="noreferrer" className="product-item"><div className="product-icon"><Gem size={18}/></div><div><strong>{p.title}</strong><small>{p.material} · {p.unitDescription}</small><Badge value={p.verificationSource}/></div><b>{fmt(p.priceRupees)}</b><ExternalLink size={14}/></a>)}</div></Panel></div>}
    {tab==="creative"&&<CreativeStudio products={data?.products||[]}/>}
     {tab==="inbox"&&<CustomerInbox products={data?.products||[]} onUpdated={refresh}/>}
    <footer className="page-footer"><span>PRASANTH INTELLIGENCE SYSTEMS</span><span>REAL EXECUTION · REAL EVIDENCE · OWNER CONTROL</span></footer>
   </div>
  </main>
 </div>
}
function ResearchList({runs}:{runs:Run[]}) {return <div className="research-list">{!runs.length&&<div className="empty">No browser research has been executed. The activity log is empty by design.</div>}{runs.map(r=><div className="research-item" key={r.id}><span className="research-symbol"><FileSearch size={17}/></span><div className="research-body"><div className="research-title"><strong>{r.pageTitle||new URL(r.sourceUrl).hostname}</strong><Badge value={r.status}/></div><a href={r.finalUrl||r.sourceUrl} target="_blank" rel="noopener noreferrer">{r.sourceUrl} <ExternalLink size={12}/></a><p>{r.errorCode||r.excerpt?.slice(0,200)||"Evidence not yet available"}</p>{(r.evidence?.tabs||[]).length>0&&<div className="research-tabs" aria-label="Actual browser tabs">{r.evidence!.tabs!.map((t,i)=><div className="research-tab" key={i}><Badge value={t.status}/>{t.status==="COMPLETED"?<a href={t.evidence?.finalUrl||t.sourceUrl} target="_blank" rel="noopener noreferrer">{t.evidence?.title||new URL(t.sourceUrl).hostname}</a>:<span>{t.errorCode||"Tab failed"}</span>}</div>)}</div>}<small>{new Date(r.startedAt).toLocaleString("en-IN")} · Playwright Chromium</small></div></div>)}</div>}
