"use client";
/**
 * Accessible source-backed task timeline for the selected 3D workstation.
 * Owner-only data comes from the same signed HQ dashboard as the real screens.
 */
import {useMemo} from "react";
import type {AgentStatus} from "@/lib/agent-roster";
import type {ScreenTask} from "@/lib/workstation-display";
import {
 latestWorkstationActivity,workstationWorkspace,WORKSPACE_NAMES,
 type HeadquartersWorkspace,
} from "@/lib/workstation-activity";

function timestamp(value:string){
 const time=new Date(value);
 return Number.isFinite(time.getTime())?
  time.toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit",
    timeZone:"Asia/Kolkata"})+" IST":"Time unavailable";
}
export function OfficeTaskLedger({roleId,status,tasks,onOpenWorkspace,onRunRole,busy=false}:{
 roleId:string;status:AgentStatus;tasks:readonly ScreenTask[];
 onOpenWorkspace?:(workspace:HeadquartersWorkspace)=>void;
 onRunRole?:(roleId:string)=>void;
 busy?:boolean;
}){
 const items=useMemo(()=>latestWorkstationActivity(roleId,tasks,status,3),
  [roleId,tasks,status]);
 const workspace=workstationWorkspace(roleId);
 return <section className="office-evidence-ledger" aria-label="Real workstation task history">
  <div className="office-ledger-heading">
   <strong>RECORDED WORK LOG</strong>
   <span>{items.length?items.length+" recent entries":"NO SAVED ENTRIES"}</span>
  </div>
  <small className="office-ledger-scope">Latest 25 HQ tasks, not a complete history</small>
  {items.length===0?
   <p className="office-ledger-empty">No task recorded for this desk in the currently loaded HQ history. No activity is inferred.</p>:
   <ol className="office-ledger-list">
    {items.map(item=><li key={item.id}>
      <div className="office-ledger-meta">
       <span data-task-state={item.state} className={
        item.state==="COMPLETED"?"is-completed":
        item.state==="RUNNING"?"is-running":"is-blocked"}>{item.state}</span>
       <time dateTime={item.createdAt}>{timestamp(item.createdAt)}</time>
      </div>
      <p>{item.summary}</p>
      {item.sourceUrl&&<a href={item.sourceUrl} target="_blank"
       rel="noopener noreferrer" aria-label={"Open recorded source "+(item.sourceLabel||"evidence")}>
        Inspect source: {item.sourceLabel||"Evidence"}
      </a>}
    </li>)}
   </ol>}
  {status==="ON_DEMAND"&&onRunRole&&<button type="button" className="office-ledger-run"
    aria-label="Run selected local evidence task" disabled={busy}
    onClick={()=>onRunRole(roleId)}>
    {busy?"Evaluating saved HQ evidence…":"Run local evidence check"}
   </button>}
  {workspace&&onOpenWorkspace&&<button type="button" className="office-ledger-open"
    aria-label={"Open "+WORKSPACE_NAMES[workspace]+" workspace"}
    onClick={()=>onOpenWorkspace(workspace)}>
    Open {WORKSPACE_NAMES[workspace]} workspace <span aria-hidden="true">↗</span>
   </button>}
 </section>;
}
