"use client";
/**
 * Premium jewellery headquarters. Architectural approach and focus transitions
 * adapted from MIT-licensed Hermes3D office scene ideas and CameraAnimator:
 * https://github.com/iamlukethedev/Hermes3D
 * Copyright (c) 2026 Luke The Dev. License retained at
 * docs/third-party/Hermes3D-LICENSE.txt
 *
 * No demo data, fake avatars or fabricated tasks. Every station reads the
 * role status returned by the authenticated headquarters API.
 */
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import {BoxGeometry} from "three";
import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { ROLE_SPECS, type AgentRecord, type AgentRole } from "@/lib/agent-roster";
import { OfficeCamera, type OfficeView } from "./office-camera";
import {OFFICE_ROOMS,DESK_OFFSETS,getStationCameraPose,HQ_BUILDING_YAW,type RoomKey} from "@/lib/office-layout";
import {PavilionArchitecture,StoneFloor,LuxuryRoomDetails} from "./office-luxury";
import {WorkstationScreen,RoomStatusWall} from "./workstation-screen";
import {buildWorkstationScreen,ATELIER_PALETTE,type ScreenTask} from "@/lib/workstation-display";

const gold = "#c7a772";
const SHARED_BLOCK_BOX=new BoxGeometry(1,1,1); // Reuse GPU buffers across static architecture.
const charcoal = "#16191b";
const rooms=OFFICE_ROOMS;
const deskPositions=DESK_OFFSETS;
export type {RoomKey} from "@/lib/office-layout";
type Vec3 = [number,number,number];
function Block({at,size,color=charcoal,metalness=.15,roughness=.43,opacity=1,castShadow=false}:{
  at:Vec3;size:Vec3;color?:string;metalness?:number;roughness?:number;opacity?:number;castShadow?:boolean;
}){
 return <mesh dispose={null} geometry={SHARED_BLOCK_BOX} scale={size} position={at}
   castShadow={castShadow} receiveShadow>
   <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={opacity<1} opacity={opacity}/>
 </mesh>;
}
function Ring({selected}:{selected:boolean}) {
 if(!selected)return null;
 return <mesh position={[0,.045,0]} rotation={[-Math.PI/2,0,0]}>
   <ringGeometry args={[.80,.86,64]}/><meshBasicMaterial color="#edc789" side={2} transparent opacity={.95}/>
 </mesh>;
}
function Station({role,agent,position,selected,onChoose,tasks,executive=false}:{
 role:AgentRole;agent?:AgentRecord;position:Vec3;selected:boolean;onChoose:(id:string,room:RoomKey)=>void;tasks:ScreenTask[];executive?:boolean;
}){
 const status=agent?.status||"NOT_CONFIGURED";
 const live=status==="RUNNING";
 const screenData=useMemo(()=>buildWorkstationScreen(role.id,agent?[agent]:[],tasks),[role.id,agent,tasks]);
 const scale=executive?1.55:1;
 const onOver=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="pointer";};
 const onOut=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="auto";};
 return <group position={position} onClick={e=>{e.stopPropagation();onChoose(role.id,role.room as RoomKey);}} onPointerOver={onOver} onPointerOut={onOut}>
   <group scale={scale}>
     {/* Bronze-trimmed stone worktop over the actual selectable station. */}
     <RoundedBox position={[0,.485,-.035]} args={[1.63,.19,.76]} radius={.055} smoothness={3} castShadow>
      <meshStandardMaterial color="#20292b" metalness={.5} roughness={.24}/>
     </RoundedBox>
     <RoundedBox position={[0,.588,-.035]} args={[1.65,.035,.76]} radius={.012} smoothness={3}>
      <meshStandardMaterial color="#b99a65" metalness={.9} roughness={.17}/>
     </RoundedBox>
     <RoundedBox position={[0,.614,-.035]} args={[1.58,.018,.71]} radius={.012} smoothness={2}>
      <meshStandardMaterial color={executive?"#504a3e":"#303e40"} metalness={.31} roughness={.23}/>
     </RoundedBox>
     <RoundedBox position={[0,.55,0]} args={[1.55,.12,.66]} radius={.045} smoothness={3} castShadow>
       <meshStandardMaterial color={executive?"#574737":"#343b3b"} metalness={.37} roughness={.27}/>
     </RoundedBox>
     {[-.59,.59].map(x=><Block key={x} at={[x,.26,0]} size={[.055,.52,.48]} color="#8c744f" metalness={.9}/>)}
     <Block at={[0,.90,-.08]} size={[.67,.47,.055]} color="#b99a69" metalness={.82}/>
     <Block at={[0,.90,-.05]} size={[.60,.41,.027]} color="#10191b" metalness={.5}/>
     {/* Genuine role/task micro-dashboard, not a fixed "RUNNING" prop. */}
     {screenData&&<WorkstationScreen data={screenData}/>}
     <Block at={[0,.66,-.08]} size={[.025,.13,.035]} color={gold} metalness={.85}/>
     <Block at={[0,.61,.2]} size={[.44,.017,.14]} color="#535b58"/>
     <Block at={[0,.49,-.23]} size={[1.29,.085,.058]} color="#b99b68" metalness={.9}/>
     {/* Screen pixels contain task facts; the metal frame remains geometry. */}
     <RoundedBox args={[.53,.09,.43]} radius={.08} smoothness={3} position={[0,.21,.59]}>
      <meshStandardMaterial color="#495a54" roughness={.80}/>
     </RoundedBox>
     <RoundedBox args={[.55,.43,.09]} radius={.07} smoothness={3} position={[0,.42,.80]}>
      <meshStandardMaterial color="#4d5f5a" roughness={.80}/>
     </RoundedBox>
     <Block at={[0,.17,.58]} size={[.07,.34,.07]} color="#ad946c" metalness={.7}/>
     <Block at={[0,.065,.58]} size={[.49,.045,.44]} color="#252b2c" metalness={.25}/>
     <Block at={[.59,.662,-.26]} size={[.13,.024,.08]} color="#b59b6d" metalness={.89}/>
     <mesh position={[.59,.685,-.26]}><cylinderGeometry args={[.044,.029,.042,12]}/>
      <meshStandardMaterial color="#e4c188" metalness={.88} roughness={.18}/>
     </mesh>
   </group>
   <Ring selected={selected}/>
   <Text position={[0,.08,.79]} rotation={[-Math.PI/2,0,0]} fontSize={.13} letterSpacing={.1} color="#e5cc9b" anchorX="center" maxWidth={1.65}>{role.short}</Text>
   {live&&<mesh position={[.59*scale,1.1*scale,-.12]}><sphereGeometry args={[.085,12,12]}/><meshBasicMaterial color="#82e1a8"/></mesh>}
 </group>;
}
function LightRail({x,z,length=4.25,night=false}:{x:number;z:number;length?:number;night?:boolean}){
 return <group position={[x,2.83,z]}>
   <RoundedBox args={[length,.09,.14]} radius={.038} smoothness={3}>
     <meshStandardMaterial color="#594b39" metalness={.82} roughness={.28}/>
   </RoundedBox>
   <mesh position={[0,-.052,.012]}>
     <boxGeometry args={[length*.93,.014,.09]}/>
     <meshBasicMaterial color={night?"#ffd69a":"#ffecd2"} toneMapped={false}/>
   </mesh>
   <pointLight position={[0,-.3,.58]} color="#ffe4bb" intensity={night?0.80:0.38} distance={5.7}/>
 </group>;
}
function Planter({x,z}:{x:number;z:number}){
 return <group position={[x,0,z]}>
   <mesh position={[0,.27,0]} castShadow><cylinderGeometry args={[.22,.16,.54,10]}/><meshStandardMaterial color="#302d2b" metalness={.48} roughness={.35}/></mesh>
   <mesh position={[0,.535,0]}><cylinderGeometry args={[.21,.21,.025,10]}/><meshStandardMaterial color="#c49d64" metalness={.82}/></mesh>
   <mesh position={[0,.83,0]} castShadow><icosahedronGeometry args={[.34,1]}/><meshStandardMaterial color="#36534a" roughness={.83}/></mesh>
   <mesh position={[-.19,1.03,.04]}><icosahedronGeometry args={[.19,0]}/><meshStandardMaterial color="#4d6b57" roughness={.87}/></mesh>
   <mesh position={[.18,1.08,-.06]}><icosahedronGeometry args={[.20,0]}/><meshStandardMaterial color="#4a6753" roughness={.87}/></mesh>
 </group>;
}
function Walls(){
 return <group>
   {/* A dark stone gallery plinth gives the office the weight of a real luxury space. */}
   <Block at={[0,-.48,.06]} size={[16.75,.36,13.1]} color="#11191b" metalness={.22} roughness={.29}/>
   <Block at={[0,-.285,.06]} size={[16.40,.09,12.75]} color="#c1a06a" metalness={.83} roughness={.25}/>
   <Block at={[0,-.22,.06]} size={[16.1,.12,12.45]} color="#30383a" metalness={.18} roughness={.35}/>
   {Array.from({length:13},(_,i)=><Block key={"floor-"+i} at={[-7.2+i*1.18,-.151,.04]} size={[.009,.007,11.8]} color="#72624a" metalness={.5} opacity={.42}/>)}
   {Array.from({length:10},(_,i)=><Block key={"floor-z-"+i} at={[0,-.151,-5.35+i*1.17]} size={[15.1,.007,.009]} color="#716148" metalness={.5} opacity={.34}/>)}
   {/* Marble, smoked glass, and a warm brass edge. No unlicensed assets. */}
   <Block at={[0,1.38,-5.87]} size={[15.65,3.15,.12]} color="#474d4a" roughness={.63}/>
   <Block at={[0,2.53,-5.79]} size={[15.15,.045,.06]} color="#d2b986" metalness={.85}/>
   <Block at={[0,.26,-5.79]} size={[15.1,.29,.12]} color="#1c2224" metalness={.28}/>
   <Block at={[0,1.12,-5.77]} size={[6.15,1.24,.045]} color="#283235" metalness={.25} roughness={.32}/>
   {[-7.56,7.56].map(x=><Block key={x} at={[x,1.1,.08]} size={[.072,2.28,11.9]} color="#c1ac85" metalness={.68} opacity={.62}/>)}
   <Block at={[0,1.50,5.96]} size={[15.3,2.10,.08]} color="#587076" opacity={.10}/>
   <Block at={[0,.17,5.89]} size={[15.5,.37,.10]} color="#c6ab7c" opacity={.36} metalness={.7}/>
   <Text position={[0,3.21,-5.64]} fontSize={.44} color="#f7e1b6" letterSpacing={.115} anchorX="center">PRASANTH  ·  AI HEADQUARTERS</Text>
   <Text position={[0,2.85,-5.64]} fontSize={.16} color="#c4d0cb" letterSpacing={.19} anchorX="center">JEWELLERY  ·  INTELLIGENCE  ·  EVIDENCE</Text>
   <Block at={[0,.01,.06]} size={[.034,.018,11.9]} color="#b39362" metalness={.84}/>
   <Block at={[0,.01,.06]} size={[15.2,.018,.034]} color="#b39362" metalness={.84}/>
 </group>;
}
function Showcase({x,z}:{x:number;z:number}){
 return <group position={[x,0,z]}>
  <Block at={[0,.35,0]} size={[.6,.70,.6]} color="#25262a" metalness={.62}/>
  <Block at={[0,.725,0]} size={[.64,.055,.64]} color="#b99a67" metalness={.75}/>
  <mesh position={[0,.97,0]}><torusGeometry args={[.19,.026,9,28]}/><meshStandardMaterial color="#f1d3a0" metalness={.86} roughness={.17}/></mesh>
  <pointLight position={[0,1.5,0]} color="#f9ce87" intensity={.24} distance={2.5}/>
 </group>;
}
function MeetingRoom({choose}:{choose:(room:RoomKey)=>void}){
 return <group onClick={e=>{e.stopPropagation();choose("meeting")}}>
  <RoundedBox args={[4.5,.20,1.65]} radius={.18} smoothness={4} position={[0,.69,.18]}>
   <meshStandardMaterial color="#2c2925" metalness={.49} roughness={.24}/>
  </RoundedBox>
  {[-1.65,1.65].map(x=><Block key={x} at={[x,.31,.18]} size={[.10,.67,1.15]} color="#b18d56" metalness={.88}/>)}
  {[-1.35,-.45,.45,1.35].map(x=><group key={x}>
    <Block at={[x,.22,1.38]} size={[.49,.11,.50]} color="#313538"/>
    <Block at={[x,.45,1.68]} size={[.49,.52,.08]} color="#434948"/>
    <Block at={[x,.22,-1.08]} size={[.49,.11,.50]} color="#313538"/>
    <Block at={[x,.45,-1.38]} size={[.49,.52,.08]} color="#434948"/>
  </group>)}
  {/* Strategy wall now shows real current HQ role telemetry, not a slogan. */}
 </group>;
}
function Room({room,chosen,agents,tasks,selectedAgentId,onChooseAgent,onChooseRoom,night=false,detail=true}:{
 room:typeof rooms[number];chosen:boolean;agents:AgentRecord[];tasks:ScreenTask[];selectedAgentId:string|null;
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
 night?:boolean;detail?:boolean;
}){
 const members=ROLE_SPECS.filter(role=>role.room===room.value);
 const accent=room.value==="ceo"?ATELIER_PALETTE.gold:
   room.value==="sales"?ATELIER_PALETTE.emerald:
   room.value==="marketing"?ATELIER_PALETTE.plum:ATELIER_PALETTE.sapphire;
 // Original code-rendered veined stone in each room, not a flat material.
 return <group position={[room.x,0,room.z]}>
  <StoneFloor selected={chosen} room={room.value} onSelect={()=>onChooseRoom(room.value)}/>
  <Block at={[0,.07,-2.32]} size={[6.55,.022,.055]} color={accent} metalness={.79}/>
  <Block at={[0,.065,2.32]} size={[6.55,.022,.055]} color={accent} metalness={.83}/>
  <Block at={[3.25,.055,0]} size={[.04,.013,4.60]} color="#a18b67" metalness={.85}/>
  <Block at={[0,-.085,0]} size={[7.0,.11,4.94]} color="#141c1f" roughness={.35}/>
  <Block at={[-3.25,.66,0]} size={[.052,1.2,4.7]} color="#b89a6b" metalness={.78}/>
  <Block at={[0,1.04,-2.39]} size={[6.55,2.00,.05]} color="#a6b2a9" opacity={.20} metalness={.10}/>
  <Block at={[0,.20,-2.35]} size={[6.3,.32,.07]} color="#65533b" metalness={.60}/>
  <Block at={[0,1.38,-2.36]} size={[6.7,.045,.06]} color="#b9a584" metalness={.65}/>
  <Text position={[0,.09,-1.97]} rotation={[-Math.PI/2,0,0]} fontSize={.23} letterSpacing={.15} color="#e8d3a8" anchorX="center">{room.name}</Text>
  {room.value==="meeting"?<MeetingRoom choose={onChooseRoom}/>:members.map((role,index)=><Station
    key={role.id}
    role={role}
    agent={agents.find(a=>a.id===role.id)}
    tasks={tasks}
    position={deskPositions[room.value as "ceo"|"sales"|"marketing"][index]}
    selected={selectedAgentId===role.id}
    onChoose={onChooseAgent}
    executive={room.value==="ceo"}
  />)}
  {room.value==="ceo"&&<><Showcase x={-2.65} z={.8}/><Showcase x={2.6} z={.8}/><Block at={[2.0,.20,-.94]} size={[1.55,.4,.65]} color="#39342e"/><Block at={[2.0,.54,-1.18]} size={[1.55,.50,.13]} color="#413c35"/></>}
  <RoundedBox position={[0,1.83,-2.30]} args={[3.65,.53,.075]} radius={.08} smoothness={3}>
    <meshStandardMaterial color="#1a2225" metalness={.48} roughness={.26}/>
  </RoundedBox>
  <Text position={[0,1.83,-2.245]} fontSize={.245} letterSpacing={.10} color="#ffe0a7" anchorX="center">{room.name}</Text>
  <RoomStatusWall room={room.value} agents={agents} tasks={tasks}/>
  <Block at={[-3.08,1.28,-2.30]} size={[.040,2.55,.065]} color="#c8ab7c" metalness={.68}/>
  <Block at={[3.08,1.28,-2.30]} size={[.040,2.55,.065]} color="#c8ab7c" metalness={.68}/>
  <Block at={[0,.085,2.16]} size={[5.85,.014,.025]} color="#c9a775" metalness={.78}/>
  <Planter x={2.92} z={1.86}/>
  <LuxuryRoomDetails room={room.value} night={night} detail={detail}/>
  <pointLight position={[-2.85,1.7,-1.25]} color={accent} intensity={night?0.43:0.25} distance={3.9}/>
  <spotLight position={[1.8,4.9,2.2]} angle={.92} penumbra={.9} intensity={night?1.85:1.25} distance={9} color="#ffe9c8"/>
  <LightRail x={0} z={-2.02} length={4.65} night={night}/>
 </group>;
}
function Building({selected,selectedAgentId,agents,tasks,onChooseAgent,onChooseRoom,night=false,detail=true}:{
 selected:RoomKey;selectedAgentId:string|null;agents:AgentRecord[];tasks:ScreenTask[];
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
 night?:boolean;detail?:boolean;
}){
 return <group rotation={[0,HQ_BUILDING_YAW,0]}>
   <Walls/>
   {detail&&<PavilionArchitecture night={night}/>}
   {rooms.map(room=><Room key={room.value} room={room} chosen={selected===room.value} agents={agents} tasks={tasks} selectedAgentId={selectedAgentId} onChooseAgent={onChooseAgent} onChooseRoom={onChooseRoom} night={night} detail={detail}/>)}
   <ambientLight intensity={night?0.56:0.85}/>
   <hemisphereLight intensity={night?1.05:1.42} color={night?"#ffe4cc":"#fff7e9"} groundColor="#243238"/>
   <directionalLight position={[4.5,10,3.5]} intensity={night?2.45:3.1} color={night?"#ffd5a0":"#ffebd2"} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
 </group>;
}
export function Office({selected,onSelect,agents=[],tasks=[],selectedAgentId=null,onAgentSelect}:{
 selected:RoomKey;onSelect:(room:RoomKey)=>void;agents?:AgentRecord[];tasks?:ScreenTask[];
 selectedAgentId?:string|null;onAgentSelect?:(agentId:string)=>void;
}){
 const [view,setView]=useState<OfficeView>("overview");
 const [night,setNight]=useState(false);
 const [detail,setDetail]=useState(true);
 const [cinema,setCinema]=useState(false);
 const [focusId,setFocusId]=useState<string|null>(null);
 const focusPose=useMemo(()=>focusId?getStationCameraPose(focusId):null,[focusId]);
 const focusedAgent=agents.find(a=>a.id===focusId);
 const focusRole=ROLE_SPECS.find(a=>a.id===focusId);
 const focusScreen=useMemo(()=>focusId?
   buildWorkstationScreen(focusId,agents,tasks):null,[focusId,agents,tasks]);
 const canFocusSelected=selectedAgentId?getStationCameraPose(selectedAgentId):null;
 const firstRender=useRef(true);
 useEffect(()=>{if(firstRender.current){firstRender.current=false;return;}setView(selected)},[selected]);
 const chooseRoom=(room:RoomKey)=>{setFocusId(null);setView(room);onSelect(room);};
 const chooseAgent=(id:string,room:RoomKey)=>{
   onAgentSelect?.(id);setView(room);setFocusId(id);onSelect(room);
 };
 const focusSelected=()=>{
   if(!selectedAgentId||!canFocusSelected)return;
   const role=ROLE_SPECS.find(s=>s.id===selectedAgentId);
   if(!role)return;
   setView(role.room as RoomKey);setFocusId(selectedAgentId);onSelect(role.room as RoomKey);
 };
 const tourTo=(offset:number)=>{
   const index=ROLE_SPECS.findIndex(role=>role.id===focusId);
   if(index<0)return;
   const next=ROLE_SPECS[(index+offset+ROLE_SPECS.length)%ROLE_SPECS.length];
   if(!getStationCameraPose(next.id))return; // No imaginary desk.
   onAgentSelect?.(next.id);
   setView(next.room as RoomKey);setFocusId(next.id);onSelect(next.room as RoomKey);
 };
 return <div className={"office-canvas luxury-office"+(cinema?" office-canvas-cinema":"")} role="group" aria-label="Interactive 3D Prasanth Jewellery Headquarters. Sixteen agents have evidence-based statuses.">
   <Canvas shadows frameloop="demand" camera={{position:[10.2,10.8,12.1],fov:40,near:.1,far:90}} dpr={[1,detail?1.5:1.2]} gl={{alpha:false,antialias:true,powerPreference:"high-performance"}}>
    <color attach="background" args={["#111d23"]}/>
    <fog attach="fog" args={["#111d23",42,72]}/>
    <Suspense fallback={null}><Building selected={selected} selectedAgentId={selectedAgentId} agents={agents} tasks={tasks} onChooseAgent={chooseAgent} onChooseRoom={chooseRoom} night={night} detail={detail}/></Suspense>
    <OfficeCamera view={view} focusPose={focusPose}/>
   </Canvas>
   <div className="office-cinema-titling" aria-hidden="true">
    <span>PRASANTH / INTELLIGENCE ATELIER</span>
    <strong>Architecture of ambition.</strong>
    <small>Four rooms · Sixteen evidence-driven workstations</small>
   </div>
   <div className="office-visual-controls" role="group" aria-label="3D presentation preferences">
    <button type="button" aria-pressed={night} onClick={()=>setNight(v=>!v)}
     aria-label={night?"Use daylight lighting":"Use after-hours lighting"}>{night?"Daylight":"After hours"}</button>
    <button type="button" aria-pressed={!detail} onClick={()=>setDetail(v=>!v)}
     aria-label={detail?"Use performance detail":"Use signature detail"}>{detail?"Performance":"Signature"}</button>
    <button type="button" aria-pressed={cinema} onClick={()=>setCinema(v=>!v)}
     aria-label={cinema?"Exit cinematic view":"Expand cinematic view"}>{cinema?"Compact":"Cinema"}</button>
   </div>
   <div className="office-room-navigation" role="group" aria-label="Navigate the four 3D office rooms">
     {rooms.map(room=><button type="button" key={room.value}
       aria-label={"Focus "+room.name.toLowerCase()}
       aria-pressed={view===room.value}
       onClick={()=>chooseRoom(room.value)}>
       <span className="office-room-nav-dot" aria-hidden="true"/>{room.name}
     </button>)}
   </div>
   <button type="button" className="office-reset-camera" onClick={()=>{setFocusId(null);setView("overview")}} aria-label="Return to overview camera">Overview</button>
   {canFocusSelected&&<button type="button" className="office-desk-camera"
      aria-label="Focus selected workstation camera" aria-pressed={focusId===selectedAgentId}
      onClick={focusSelected}>Inspect selected desk</button>}
   {focusId&&<div className="office-desk-context" aria-live="polite" aria-label="Focused workstation information">
     <span>WORKSTATION / SOURCE-GROUNDED</span>
     <strong>{focusedAgent?.name||focusRole?.name||"Unknown role"}</strong>
     <small>{focusScreen?
       focusScreen.statusText+" · "+focusScreen.mainNumber+" recorded evidence":
       "Awaiting authenticated status"}</small>
     {focusScreen&&<div className="office-desk-activity" aria-label="Authenticated workstation screen details">
       <strong>{focusScreen.purpose}</strong>
       <span>{focusScreen.headline}</span>
       <small>{focusScreen.detail}</small>
       <small>Source: {focusScreen.provenance}</small>
     </div>}
     <div className="office-desk-tour" role="group" aria-label="Visit real agent workstations">
       <button type="button" onClick={()=>tourTo(-1)} aria-label="Previous workstation">← Previous</button>
       <button type="button" onClick={()=>tourTo(1)} aria-label="Next workstation">Next →</button>
     </div>
     <button type="button" onClick={()=>{setFocusId(null);setView(view)}}
      aria-label="Return to room camera">Return to room</button>
   </div>}
   <div className="office-overlay"><span className="light-dot"/> LIVE-SOURCE STATUS ONLY <span className="overlay-tip">Actual desk states · Drag to orbit · Scroll to zoom</span></div>
 </div>;
}
