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
import { Suspense, useState, useEffect } from "react";
import { ROLE_SPECS, type AgentRecord, type AgentRole } from "@/lib/agent-roster";
import { OfficeCamera, type OfficeView } from "./office-camera";

const gold = "#c7a772";
const charcoal = "#16191b";
const rooms = [
  { name:"EXECUTIVE SUITE", subtitle:"Owner approvals · decisions", value:"ceo", x:-4.1, z:-2.6 },
  { name:"SALES INTELLIGENCE", subtitle:"Evidence · wholesale pipeline", value:"sales", x:3.6, z:-2.6 },
  { name:"CREATIVE STUDIO", subtitle:"Reserved · not configured", value:"marketing", x:-4.1, z:3.05 },
  { name:"STRATEGY ROOM", subtitle:"Reviews · coordination", value:"meeting", x:3.6, z:3.05 },
] as const;
export type RoomKey = typeof rooms[number]["value"];
const deskPositions: Record<"ceo"|"sales"|"marketing",[number,number,number][]> = {
  ceo:[[0,0,.35]],
  sales:[[-2.12,0,-1.16],[0,0,-1.16],[2.12,0,-1.16],[-2.12,0,.05],[0,0,.05],[2.12,0,.05],[-2.12,0,1.26],[0,0,1.26],[2.12,0,1.26]],
  marketing:[[-2.12,0,-.84],[0,0,-.84],[2.12,0,-.84],[-2.12,0,.87],[0,0,.87],[2.12,0,.87]],
};
type Vec3 = [number,number,number];
function Block({at,size,color=charcoal,metalness=.15,roughness=.43,opacity=1,castShadow=false}:{
  at:Vec3;size:Vec3;color?:string;metalness?:number;roughness?:number;opacity?:number;castShadow?:boolean;
}){
 return <mesh position={at} castShadow={castShadow} receiveShadow>
   <boxGeometry args={size}/>
   <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} transparent={opacity<1} opacity={opacity}/>
 </mesh>;
}
function Ring({selected}:{selected:boolean}) {
 if(!selected)return null;
 return <mesh position={[0,.045,0]} rotation={[-Math.PI/2,0,0]}>
   <ringGeometry args={[.80,.86,64]}/><meshBasicMaterial color="#edc789" side={2} transparent opacity={.95}/>
 </mesh>;
}
function Station({role,agent,position,selected,onChoose,executive=false}:{
 role:AgentRole;agent?:AgentRecord;position:Vec3;selected:boolean;onChoose:(id:string,room:RoomKey)=>void;executive?:boolean;
}){
 const status=agent?.status||"NOT_CONFIGURED";
 const live=status==="RUNNING";
 const screen=status==="RUNNING"?"#3a886e":status==="ON_DEMAND"?"#8e7950":status==="MANUAL_ONLY"?"#6c6252":"#323b42";
 const scale=executive?1.55:1;
 const onOver=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="pointer";};
 const onOut=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="auto";};
 return <group position={position} onClick={e=>{e.stopPropagation();onChoose(role.id,role.room as RoomKey);}} onPointerOver={onOver} onPointerOut={onOut}>
   <group scale={scale}>
     <RoundedBox position={[0,.55,0]} args={[1.55,.12,.66]} radius={.045} smoothness={3} castShadow>
       <meshStandardMaterial color={executive?"#312d28":"#292d30"} metalness={.48} roughness={.28}/>
     </RoundedBox>
     {[-.59,.59].map(x=><Block key={x} at={[x,.26,0]} size={[.055,.52,.48]} color="#8c744f" metalness={.9}/>)}
     <Block at={[0,.90,-.08]} size={[.54,.37,.045]} color="#111619" metalness={.5}/>
     <Block at={[0,.90,-.051]} size={[.47,.30,.008]} color={screen}/>
     <Block at={[0,.66,-.08]} size={[.025,.13,.035]} color={gold} metalness={.85}/>
     <Block at={[0,.61,.2]} size={[.44,.017,.14]} color="#4f5352"/>
     <Block at={[0,.20,.59]} size={[.50,.08,.42]} color="#444643" />
     <Block at={[0,.40,.79]} size={[.50,.40,.06]} color="#454947"/>
   </group>
   <Ring selected={selected}/>
   <Text position={[0,.08,.79]} rotation={[-Math.PI/2,0,0]} fontSize={.13} letterSpacing={.1} color="#e5cc9b" anchorX="center" maxWidth={1.65}>{role.short}</Text>
   {live&&<mesh position={[.59*scale,1.1*scale,-.12]}><sphereGeometry args={[.085,12,12]}/><meshBasicMaterial color="#82e1a8"/></mesh>}
 </group>;
}
function LightRail({x,z,length=5.7}:{x:number;z:number;length?:number}){
 return <group position={[x,3.55,z]}>
  <Block at={[0,0,0]} size={[length,.045,.075]} color="#977952" metalness={.9}/>
  <Block at={[0,-.04,0]} size={[length*.91,.018,.044]} color="#efdbaf" metalness={.04}/>
  <pointLight position={[0,-.25,0]} color="#e8bc79" intensity={.75} distance={7}/>
 </group>;
}
function Walls(){
 return <group>
  <Block at={[0,-.24,.08]} size={[15.85,.38,12.3]} color="#0d1114" metalness={.38} roughness={.26} />
  {Array.from({length:15},(_,i)=><Block key={i} at={[-7.25+i*1.02,-.035,.1]} size={[.012,.012,11.7]} color="#725e42" metalness={.86}/>)}
  {[-7.55,7.55].map(x=><Block key={x} at={[x,1.55,.08]} size={[.095,3.3,11.9]} color="#81705b" metalness={.72}/>)}
  {[-5.83,5.88].map(z=><Block key={z} at={[0,1.55,z]} size={[15.18,3.3,.09]} color="#7c6950" metalness={.64} opacity={.40}/>)}
  {[-7.5,0,7.5].map(x=><Block key={x} at={[x,3.35,.1]} size={[.11,.15,11.9]} color="#b09872" metalness={.79}/>)}
  <Block at={[0,3.37,-5.85]} size={[15.4,.24,.14]} color="#d1bb90" metalness={.6}/>
  <Text position={[0,3.72,-5.53]} fontSize={.36} color="#f7e1ae" letterSpacing={.15}>PRASANTH · AI HEADQUARTERS</Text>
  <Block at={[0,.05,.08]} size={[.052,.015,11.7]} color={gold} metalness={.85}/>
  <Block at={[0,.05,.08]} size={[15.0,.015,.052]} color={gold} metalness={.85}/>
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
  <Block at={[0,1.73,-2.17]} size={[3.0,1.22,.065]} color="#1e272c" metalness={.4}/>
  <Text position={[0,1.80,-2.115]} fontSize={.25} color="#dbbd86" letterSpacing={.15}>EVIDENCE FIRST</Text>
  <Text position={[0,1.45,-2.105]} fontSize={.13} color="#909b98" letterSpacing={.07}>REVIEW · APPROVE · TRACK</Text>
 </group>;
}
function Room({room,chosen,agents,selectedAgentId,onChooseAgent,onChooseRoom}:{
 room:typeof rooms[number];chosen:boolean;agents:AgentRecord[];selectedAgentId:string|null;
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
}){
 const members=ROLE_SPECS.filter(role=>role.room===room.value);
 const floor="#161b1e";
 return <group position={[room.x,0,room.z]}>
  <mesh position={[0,.007,0]} receiveShadow onClick={e=>{e.stopPropagation();onChooseRoom(room.value);}}>
   <boxGeometry args={[6.9,.065,4.86]}/><meshStandardMaterial color={chosen?"#23282a":floor} roughness={.27} metalness={.41}/>
  </mesh>
  <Block at={[0,.07,-2.32]} size={[6.55,.018,.055]} color={gold} metalness={.88}/>
  <Block at={[-3.25,.55,0]} size={[.07,1.0,4.7]} color="#af936b" metalness={.8}/>
  <Block at={[0,.65,-2.39]} size={[6.55,1.24,.08]} color="#938777" opacity={.28} metalness={.2}/>
  <Block at={[0,1.38,-2.36]} size={[6.7,.065,.12]} color="#b9a584" metalness={.8}/>
  <Text position={[0,.09,-1.97]} rotation={[-Math.PI/2,0,0]} fontSize={.23} letterSpacing={.15} color="#e8d3a8" anchorX="center">{room.name}</Text>
  {room.value==="meeting"?<MeetingRoom choose={onChooseRoom}/>:members.map((role,index)=><Station
    key={role.id}
    role={role}
    agent={agents.find(a=>a.id===role.id)}
    position={deskPositions[room.value as "ceo"|"sales"|"marketing"][index]}
    selected={selectedAgentId===role.id}
    onChoose={onChooseAgent}
    executive={room.value==="ceo"}
  />)}
  {room.value==="ceo"&&<><Showcase x={-2.65} z={.8}/><Showcase x={2.6} z={.8}/><Block at={[2.0,.20,-.94]} size={[1.55,.4,.65]} color="#39342e"/><Block at={[2.0,.54,-1.18]} size={[1.55,.50,.13]} color="#413c35"/></>}
  <LightRail x={0} z={0} length={5.7}/>
  <Block at={[0,3.59,-2.35]} size={[6.7,.14,.13]} color="#c1aa82" metalness={.76}/>
  <Block at={[0,3.59,2.35]} size={[6.7,.14,.13]} color="#c1aa82" metalness={.76}/>
 </group>;
}
function Building({selected,selectedAgentId,agents,onChooseAgent,onChooseRoom}:{
 selected:RoomKey;selectedAgentId:string|null;agents:AgentRecord[];
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
}){
 return <group rotation={[0,-.105,0]}>
   <Walls/>
   {rooms.map(room=><Room key={room.value} room={room} chosen={selected===room.value} agents={agents} selectedAgentId={selectedAgentId} onChooseAgent={onChooseAgent} onChooseRoom={onChooseRoom}/>)}
   <ambientLight intensity={.78}/>
   <hemisphereLight intensity={.65} color="#fff0d9" groundColor="#17181b"/>
   <directionalLight position={[4.5,10,3.5]} intensity={1.6} color="#ffe4bb" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
 </group>;
}
export function Office({selected,onSelect,agents=[],selectedAgentId=null,onAgentSelect}:{
 selected:RoomKey;onSelect:(room:RoomKey)=>void;agents?:AgentRecord[];
 selectedAgentId?:string|null;onAgentSelect?:(agentId:string)=>void;
}){
 const [view,setView]=useState<OfficeView>("overview");
 useEffect(()=>{setView(selected)},[selected]);
 const chooseRoom=(room:RoomKey)=>{setView(room);onSelect(room);};
 const chooseAgent=(id:string,room:RoomKey)=>{onAgentSelect?.(id);chooseRoom(room);};
 return <div className="office-canvas" role="group" aria-label="Interactive 3D Prasanth Jewellery Headquarters. Sixteen agents have evidence-based statuses.">
   <Canvas shadows camera={{position:[13.5,13.5,16.5],fov:42,near:.1,far:90}} dpr={[1,1.5]} gl={{alpha:false,antialias:true,powerPreference:"high-performance"}}>
    <color attach="background" args={["#10171b"]}/>
    <fog attach="fog" args={["#10171b",33,58]}/>
    <Suspense fallback={null}><Building selected={selected} selectedAgentId={selectedAgentId} agents={agents} onChooseAgent={chooseAgent} onChooseRoom={chooseRoom}/></Suspense>
    <OfficeCamera view={view}/>
   </Canvas>
   <button type="button" className="office-reset-camera" onClick={()=>setView("overview")} aria-label="Return to overview camera">Overview</button>
   <div className="office-overlay"><span className="light-dot"/> LIVE-SOURCE STATUS ONLY <span className="overlay-tip">Select a workstation · Drag to orbit · Scroll to zoom</span></div>
 </div>;
}
