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
import { Suspense, useState, useEffect, useRef } from "react";
import { ROLE_SPECS, type AgentRecord, type AgentRole } from "@/lib/agent-roster";
import { OfficeCamera, type OfficeView } from "./office-camera";
import {PavilionArchitecture,StoneFloor,LuxuryRoomDetails} from "./office-luxury";

const gold = "#c7a772";
const charcoal = "#16191b";
const rooms = [
  { name:"EXECUTIVE SUITE", subtitle:"Owner approvals · decisions", value:"ceo", x:-4.1, z:-2.6 },
  { name:"SALES INTELLIGENCE", subtitle:"Evidence · wholesale pipeline", value:"sales", x:3.6, z:-2.6 },
  { name:"CREATIVE STUDIO", subtitle:"Owner-approved code-rendered Reels", value:"marketing", x:-4.1, z:3.05 },
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
 const screen=status==="RUNNING"?"#66d5ac":status==="ON_DEMAND"?"#c4a776":status==="MANUAL_ONLY"?"#807868":"#394547";
 const scale=executive?1.55:1;
 const onOver=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="pointer";};
 const onOut=(e:ThreeEvent<PointerEvent>)=>{e.stopPropagation();document.body.style.cursor="auto";};
 return <group position={position} onClick={e=>{e.stopPropagation();onChoose(role.id,role.room as RoomKey);}} onPointerOver={onOver} onPointerOut={onOut}>
   <group scale={scale}>
     <RoundedBox position={[0,.55,0]} args={[1.55,.12,.66]} radius={.045} smoothness={3} castShadow>
       <meshStandardMaterial color={executive?"#574737":"#343b3b"} metalness={.37} roughness={.27}/>
     </RoundedBox>
     {[-.59,.59].map(x=><Block key={x} at={[x,.26,0]} size={[.055,.52,.48]} color="#8c744f" metalness={.9}/>)}
     <Block at={[0,.90,-.08]} size={[.54,.37,.045]} color="#111619" metalness={.5}/>
     <mesh position={[0,.90,-.051]}><boxGeometry args={[.47,.30,.008]}/><meshBasicMaterial color={screen} toneMapped={false}/></mesh>
     <Block at={[0,.66,-.08]} size={[.025,.13,.035]} color={gold} metalness={.85}/>
     <Block at={[0,.61,.2]} size={[.44,.017,.14]} color="#535b58"/>
     <Block at={[0,.49,-.23]} size={[1.29,.085,.058]} color="#b99b68" metalness={.9}/>
     <mesh position={[0,.907,-.018]}><boxGeometry args={[.40,.012,.009]}/><meshBasicMaterial color="#e7c894" toneMapped={false}/></mesh>
     <mesh position={[-.15,.83,-.018]}><boxGeometry args={[.095,.01,.008]}/><meshBasicMaterial color="#7e9c92" toneMapped={false}/></mesh>
     <Block at={[0,.20,.59]} size={[.50,.08,.42]} color="#444643" />
     <Block at={[0,.40,.79]} size={[.50,.40,.06]} color="#4b5755"/>
     <Block at={[0,.17,.58]} size={[.07,.34,.07]} color="#ad946c" metalness={.7}/>
     <Block at={[0,.065,.58]} size={[.49,.045,.44]} color="#252b2c" metalness={.25}/>
   </group>
   <Ring selected={selected}/>
   <Text position={[0,.08,.79]} rotation={[-Math.PI/2,0,0]} fontSize={.13} letterSpacing={.1} color="#e5cc9b" anchorX="center" maxWidth={1.65}>{role.short}</Text>
   {live&&<mesh position={[.59*scale,1.1*scale,-.12]}><sphereGeometry args={[.085,12,12]}/><meshBasicMaterial color="#82e1a8"/></mesh>}
 </group>;
}
function LightRail({x,z,length=4.25}:{x:number;z:number;length?:number}){
 return <group position={[x,2.83,z]}>
   <RoundedBox args={[length,.09,.14]} radius={.038} smoothness={3}>
     <meshStandardMaterial color="#594b39" metalness={.82} roughness={.28}/>
   </RoundedBox>
   <mesh position={[0,-.052,.012]}>
     <boxGeometry args={[length*.93,.014,.09]}/>
     <meshBasicMaterial color="#ffdc9a" toneMapped={false}/>
   </mesh>
   <pointLight position={[0,-.3,.58]} color="#ffe4bb" intensity={.88} distance={5.7}/>
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
  <Block at={[0,1.73,-2.17]} size={[3.0,1.22,.065]} color="#1e272c" metalness={.4}/>
  <Text position={[0,1.80,-2.115]} fontSize={.25} color="#dbbd86" letterSpacing={.15}>EVIDENCE FIRST</Text>
  <Text position={[0,1.45,-2.105]} fontSize={.13} color="#909b98" letterSpacing={.07}>REVIEW · APPROVE · TRACK</Text>
 </group>;
}
function Room({room,chosen,agents,selectedAgentId,onChooseAgent,onChooseRoom,night=false,detail=true}:{
 room:typeof rooms[number];chosen:boolean;agents:AgentRecord[];selectedAgentId:string|null;
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
 night?:boolean;detail?:boolean;
}){
 const members=ROLE_SPECS.filter(role=>role.room===room.value);
 // Original code-rendered veined stone in each room, not a flat material.
 return <group position={[room.x,0,room.z]}>
  <StoneFloor selected={chosen} room={room.value} onSelect={()=>onChooseRoom(room.value)}/>
  <Block at={[0,.07,-2.32]} size={[6.55,.022,.055]} color={gold} metalness={.88}/>
  <Block at={[0,.065,2.32]} size={[6.55,.022,.055]} color={gold} metalness={.88}/>
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
  <Block at={[-3.08,1.28,-2.30]} size={[.040,2.55,.065]} color="#c8ab7c" metalness={.68}/>
  <Block at={[3.08,1.28,-2.30]} size={[.040,2.55,.065]} color="#c8ab7c" metalness={.68}/>
  <Block at={[0,.085,2.16]} size={[5.85,.014,.025]} color="#c9a775" metalness={.78}/>
  <Planter x={2.92} z={1.86}/>
  <LuxuryRoomDetails room={room.value} night={night} detail={detail}/>
  <spotLight position={[1.8,4.9,2.2]} angle={.92} penumbra={.9} intensity={night?1.85:1.25} distance={9} color="#ffe9c8"/>
  <LightRail x={0} z={-2.02} length={4.65}/>
 </group>;
}
function Building({selected,selectedAgentId,agents,onChooseAgent,onChooseRoom,night=false,detail=true}:{
 selected:RoomKey;selectedAgentId:string|null;agents:AgentRecord[];
 onChooseAgent:(id:string,room:RoomKey)=>void;onChooseRoom:(room:RoomKey)=>void;
 night?:boolean;detail?:boolean;
}){
 return <group rotation={[0,-.105,0]}>
   <Walls/>
   {detail&&<PavilionArchitecture night={night}/>}
   {rooms.map(room=><Room key={room.value} room={room} chosen={selected===room.value} agents={agents} selectedAgentId={selectedAgentId} onChooseAgent={onChooseAgent} onChooseRoom={onChooseRoom} night={night} detail={detail}/>)}
   <ambientLight intensity={night?0.56:0.85}/>
   <hemisphereLight intensity={night?1.05:1.42} color={night?"#ffe4cc":"#fff7e9"} groundColor="#243238"/>
   <directionalLight position={[4.5,10,3.5]} intensity={night?2.45:3.1} color={night?"#ffd5a0":"#ffebd2"} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
 </group>;
}
export function Office({selected,onSelect,agents=[],selectedAgentId=null,onAgentSelect}:{
 selected:RoomKey;onSelect:(room:RoomKey)=>void;agents?:AgentRecord[];
 selectedAgentId?:string|null;onAgentSelect?:(agentId:string)=>void;
}){
 const [view,setView]=useState<OfficeView>("overview");
 const firstRender=useRef(true);
 useEffect(()=>{if(firstRender.current){firstRender.current=false;return;}setView(selected)},[selected]);
 const chooseRoom=(room:RoomKey)=>{setView(room);onSelect(room);};
 const chooseAgent=(id:string,room:RoomKey)=>{onAgentSelect?.(id);chooseRoom(room);};
 return <div className="office-canvas" role="group" aria-label="Interactive 3D Prasanth Jewellery Headquarters. Sixteen agents have evidence-based statuses.">
   <Canvas shadows frameloop="demand" camera={{position:[10.2,10.8,12.1],fov:40,near:.1,far:90}} dpr={[1,1.5]} gl={{alpha:false,antialias:true,powerPreference:"high-performance"}}>
    <color attach="background" args={["#111d23"]}/>
    <fog attach="fog" args={["#111d23",42,72]}/>
    <Suspense fallback={null}><Building selected={selected} selectedAgentId={selectedAgentId} agents={agents} onChooseAgent={chooseAgent} onChooseRoom={chooseRoom}/></Suspense>
    <OfficeCamera view={view}/>
   </Canvas>
   <div className="office-room-navigation" role="group" aria-label="Navigate the four 3D office rooms">
     {rooms.map(room=><button type="button" key={room.value}
       aria-label={"Focus "+room.name.toLowerCase()}
       aria-pressed={view===room.value}
       onClick={()=>chooseRoom(room.value)}>
       <span className="office-room-nav-dot" aria-hidden="true"/>{room.name}
     </button>)}
   </div>
   <button type="button" className="office-reset-camera" onClick={()=>setView("overview")} aria-label="Return to overview camera">Overview</button>
   <div className="office-overlay"><span className="light-dot"/> LIVE-SOURCE STATUS ONLY <span className="overlay-tip">Select a workstation · Drag to orbit · Scroll to zoom</span></div>
 </div>;
}
