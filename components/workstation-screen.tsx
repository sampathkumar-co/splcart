"use client";
/**
 * Genuinely code-rendered display surfaces (16 role micro-panels and
 * four information walls). Data comes from authenticated HQ agent/task records.
 * No synthetic data waves, activity bars, external textures or model calls.
 *
 * Shared plane geometry; one small CanvasTexture per surface, reclaimed on
 * changes. Office has frameloop="demand", so screens never drive fake work.
 */
import {useEffect,useMemo} from "react";
import * as THREE from "three";
import {
 ATELIER_PALETTE,type WorkstationScreenData,
 buildRoomScreen,type ScreenTask,
} from "@/lib/workstation-display";
import type {AgentRecord} from "@/lib/agent-roster";
import type {RoomKey} from "@/lib/office-layout";
const PLANE=new THREE.PlaneGeometry(1,1);

function surface(width:number,height:number){
 const el=document.createElement("canvas");
 el.width=width;el.height=height;
 const ctx=el.getContext("2d");
 if(!ctx)throw Error("2D rendering context unavailable for workstation");
 return {el,ctx};
}
function text(ctx:CanvasRenderingContext2D,str:string,x:number,y:number,size:number,
 color:string,bold=false,maxWidth?:number){
 ctx.fillStyle=color;
 ctx.font=(bold?"700 ":"500 ")+size+"px Arial, sans-serif";
 ctx.textAlign="left";
 ctx.textBaseline="middle";
 ctx.fillText(str,x,y,maxWidth);
}
function screenBase(ctx:CanvasRenderingContext2D,w:number,h:number,accent:string){
 const grad=ctx.createLinearGradient(0,0,w,h);
 grad.addColorStop(0,"#111A26");grad.addColorStop(.65,"#101822");
 grad.addColorStop(1,"#1B2025");
 ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
 ctx.fillStyle=accent;ctx.fillRect(0,0,8,h);ctx.fillRect(0,0,w,7);
 ctx.fillStyle="rgba(239,225,194,.08)";
 for(let i=0;i<8;i++)ctx.fillRect(25,56+i*39,w-50,1);
 ctx.fillStyle="rgba(239,225,194,.045)";
 for(let i=0;i<11;i++)ctx.fillRect(26+i*53,55,1,h-94);
 // Decorative diamond is a jewellery brand motif, not a fake data indicator.
 ctx.save();ctx.translate(w-58,42);ctx.rotate(Math.PI/4);
 ctx.strokeStyle=accent;ctx.lineWidth=3;ctx.strokeRect(-12,-12,24,24);
 ctx.restore();
}
function isValidStatus(code:string){return ["COMPLETED","RUNNING","BLOCKED","FAILED"].includes(code);}
export function createWorkstationTexture(screen:WorkstationScreenData){
 const {el,ctx}=surface(640,400),accent=screen.accent;
 screenBase(ctx,640,400,accent);
 text(ctx,"PRASANTH  /  AGENT INTELLIGENCE",27,35,16,ATELIER_PALETTE.pearl,true);
 text(ctx,screen.short,29,97,53,ATELIER_PALETTE.ivory,true);
 text(ctx,screen.purpose,142,87,22,accent,true,450);
 text(ctx,screen.statusText,143,119,22,ATELIER_PALETTE.ivory,true,460);
 ctx.fillStyle="rgba(4,11,15,.58)";ctx.fillRect(25,148,590,115);
 ctx.fillStyle="rgba(215,188,135,.18)";ctx.fillRect(26,263,587,2);
 text(ctx,screen.mainNumber,38,198,75,screen.status==="NOT_CONFIGURED"?
  ATELIER_PALETTE.ruby:ATELIER_PALETTE.ivory,true,180);
 text(ctx,screen.numberLabel,225,187,19,ATELIER_PALETTE.pearl,true,370);
 text(ctx,screen.headline,225,225,19,accent,true,370);
 text(ctx,screen.detail,30,295,21,ATELIER_PALETTE.ivory,false,570);
 if(screen.recentTaskStatuses.length){
  text(ctx,"PERSISTED TASK HISTORY",30,334,14,"#A9B6B6",true);
  screen.recentTaskStatuses.filter(isValidStatus).forEach((s,i)=>{
   ctx.fillStyle=s==="COMPLETED"?ATELIER_PALETTE.emerald:
    s==="RUNNING"?ATELIER_PALETTE.sapphire:ATELIER_PALETTE.ruby;
   ctx.fillRect(260+i*57,325,44,13);
  });
 }else{
  text(ctx,"NO RECORDED TASK HISTORY",30,334,14,"#A9B6B6",true);
 }
 const last=screen.lastRecordedAt&&Number.isFinite(Date.parse(screen.lastRecordedAt))?
   "  •  "+screen.lastRecordedAt.slice(0,16).replace("T"," ")+" UTC":"";
 text(ctx,"SOURCE: "+screen.provenance+last,30,376,14,"#B8BEB7",false,585);
 const map=new THREE.CanvasTexture(el);
 map.colorSpace=THREE.SRGBColorSpace;
 map.minFilter=THREE.LinearFilter;
 map.magFilter=THREE.LinearFilter;
 map.generateMipmaps=false;
 map.needsUpdate=true;
 return map;
}
function createRoomTexture(input:ReturnType<typeof buildRoomScreen>){
 const {el,ctx}=surface(768,320);
 screenBase(ctx,768,320,input.accent);
 text(ctx,"PRASANTH JEWELLERS  /  SOURCE-GROUNDED ROOM FEED",32,38,17,ATELIER_PALETTE.pearl,true,680);
 text(ctx,input.title,32,93,39,ATELIER_PALETTE.ivory,true,690);
 text(ctx,input.subtitle.toUpperCase(),32,133,18,input.accent,true,680);
 const stats:[
  {name:"REAL ROLE DESKS",value:input.count},
  {name:"RUNNING NOW",value:input.active},
  {name:"RECENT CHECKS",value:input.reports},
  {name:"NOT CONFIGURED",value:input.blocked},
 ];
 stats.forEach((s,i)=>{
  const x=30+i*184;
  ctx.fillStyle="rgba(3,9,13,.53)";ctx.fillRect(x,163,170,109);
  ctx.fillStyle=input.accent;ctx.fillRect(x,163,170,4);
  text(ctx,String(s.value),x+13,205,47,ATELIER_PALETTE.ivory,true,145);
  text(ctx,s.name,x+11,254,13,ATELIER_PALETTE.pearl,true,155);
 });
 text(ctx,"COUNTED FROM AUTHENTICATED HQ SNAPSHOT  •  NO SIMULATED ACTIVITY",32,301,14,"#B2BBB9",false,695);
 const texture=new THREE.CanvasTexture(el);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.generateMipmaps=false;
 texture.minFilter=THREE.LinearFilter;
 texture.magFilter=THREE.LinearFilter;
 texture.needsUpdate=true;
 return texture;
}
export function WorkstationScreen({data}:{data:WorkstationScreenData}){
 const map=useMemo(()=>typeof document!=="undefined"?createWorkstationTexture(data):null,[data]);
 useEffect(()=>()=>map?.dispose(),[map]);
 return <mesh dispose={null} geometry={PLANE} scale={[.565,.391,1]} position={[0,.908,-.015]}>
  {map?<meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide}/>:
   <meshBasicMaterial color="#111925" toneMapped={false}/>}
 </mesh>;
}
export function RoomStatusWall({room,agents,tasks}:{
 room:RoomKey;agents:AgentRecord[];tasks:ScreenTask[];
}){
 const input=useMemo(()=>buildRoomScreen(room,agents,tasks),[room,agents,tasks]);
 const map=useMemo(()=>typeof document!=="undefined"?createRoomTexture(input):null,[input]);
 useEffect(()=>()=>map?.dispose(),[map]);
 return <group position={[0,1.10,-2.205]}>
  <mesh dispose={null} geometry={PLANE} scale={[3.62,1.52,1]}>
   <meshStandardMaterial color="#232B31" metalness={.67} roughness={.21}/>
  </mesh>
  <mesh dispose={null} geometry={PLANE} scale={[3.52,1.41,1]} position={[0,0,.018]}>
   {map?<meshBasicMaterial map={map} toneMapped={false} side={THREE.DoubleSide}/>:
    <meshBasicMaterial color="#162028"/>}
  </mesh>
  {/* Warm architectural brass edge, no blinking fake-work beacon. */}
  <mesh dispose={null} geometry={PLANE} scale={[3.65,.032,1]} position={[0,-.79,.026]}>
   <meshBasicMaterial color={input.accent} toneMapped={false}/>
  </mesh>
 </group>;
}
