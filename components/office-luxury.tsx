"use client";
/**
 * Architecturally detailed, code-native jewellery HQ environment.
 * No HDR downloads, third-party 3D models, stock textures, paid APIs,
 * fake working agents, mock sales figures or active simulated telemetry.
 *
 * Everything here is visual architecture / jewellery-inspired ornament.
 * The 16 actual agent desk statuses remain in components/office.tsx.
 */
import {useEffect,useMemo} from "react";
import {RoundedBox,Text} from "@react-three/drei";
import {type ThreeEvent} from "@react-three/fiber";
import * as THREE from "three";

type Vec3=[number,number,number];
export type LuxuryRoom="ceo"|"sales"|"marketing"|"meeting";

function Cuboid({pos,size,color="#272c2c",metalness=.18,roughness=.38,
 opacity=1,emissive,glow=0,cast=false}:{
 pos:Vec3;size:Vec3;color?:string;metalness?:number;roughness?:number;
 opacity?:number;emissive?:string;glow?:number;cast?:boolean;
}){
 return <mesh position={pos} castShadow={cast} receiveShadow>
  <boxGeometry args={size}/>
  <meshStandardMaterial color={color} metalness={metalness} roughness={roughness}
   transparent={opacity<1} opacity={opacity} depthWrite={opacity===1}
   emissive={emissive||"#000000"} emissiveIntensity={glow}/>
 </mesh>;
}
function Line({from,to,color="#b99b6c",r=.018}:{
 from:Vec3;to:Vec3;color?:string;r?:number;
}){
 const start=new THREE.Vector3(...from),end=new THREE.Vector3(...to);
 const direction=end.clone().sub(start);
 const midpoint=start.add(end).multiplyScalar(.5);
 const q=new THREE.Quaternion().setFromUnitVectors(
  new THREE.Vector3(0,1,0),direction.clone().normalize());
 return <mesh position={midpoint.toArray() as Vec3} quaternion={q}>
  <cylinderGeometry args={[r,r,direction.length(),8]}/>
  <meshStandardMaterial color={color} metalness={.86} roughness={.21}/>
 </mesh>;
}

/** Deterministic original mineral veins: zero downloaded textures and small GPU footprint. */
export function createStoneTexture(seed=1){
 const size=256,bytes=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/size,v=y/size;
  const flow=u*13.7+v*9.8+Math.sin(v*12.7+seed)*.47+
   Math.sin(u*17.2-v*8.4)*.19+Math.sin(v*46+u*8.1)*.055;
  const veins=Math.pow(1-Math.abs(Math.sin(flow*3.1)),25);
  const thin=Math.pow(1-Math.abs(Math.sin(flow*7.3+.73)),52);
  const cloud=Math.sin(u*34.9+v*11.4+seed)*Math.sin(v*37-u*13)*2.2;
  const n=(Math.sin(x*127.1+y*311.7+seed*9)*43758.5453)%1;
  const subtle=cloud+n*1.8;
  const brass=Math.min(1,veins*.70+thin*.24);
  const i=(y*size+x)*4;
  bytes[i]=Math.min(255,Math.round(27+subtle+brass*93));
  bytes[i+1]=Math.min(255,Math.round(35+subtle+brass*75));
  bytes[i+2]=Math.min(255,Math.round(39+subtle+brass*48));
  bytes[i+3]=255;
 }
 const texture=new THREE.DataTexture(bytes,size,size,THREE.RGBAFormat);
 texture.colorSpace=THREE.SRGBColorSpace;
 texture.wrapS=THREE.RepeatWrapping;
 texture.wrapT=THREE.RepeatWrapping;
 texture.anisotropy=4;
 texture.needsUpdate=true;
 return texture;
}
export function StoneFloor({selected,onSelect,room}:{
 selected:boolean;onSelect:()=>void;room:LuxuryRoom;
}){
 const tex=useMemo(()=>createStoneTexture(
  room==="ceo"?1:room==="sales"?2:room==="marketing"?3:4),[room]);
 useEffect(()=>()=>tex.dispose(),[tex]);
 return <mesh position={[0,.007,0]} receiveShadow onClick={(e:ThreeEvent<MouseEvent>)=>{
  e.stopPropagation();onSelect();
 }}>
  <boxGeometry args={[6.9,.065,4.86]}/>
  <meshStandardMaterial map={tex} color={selected?"#fcf3dc":"#dfe6e4"}
   metalness={.25} roughness={.24}/>
 </mesh>;
}
function DecoMedallion({position,radius=.5}:{position:Vec3;radius?:number}){
 return <group position={position}>
  <mesh rotation={[-Math.PI/2,0,0]}>
   <torusGeometry args={[radius,.016,8,56]}/>
   <meshStandardMaterial color="#c9ac73" metalness={.88} roughness={.21}/>
  </mesh>
  <mesh rotation={[-Math.PI/2,0,0]}>
   <torusGeometry args={[radius*.77,.008,8,50]}/>
   <meshStandardMaterial color="#73634c" metalness={.84} roughness={.24}/>
  </mesh>
  {Array.from({length:8},(_,i)=>{
   const a=i*Math.PI/4;
   return <mesh key={i} position={[
    Math.cos(a)*radius*.88,.012,Math.sin(a)*radius*.88]}>
    <sphereGeometry args={[.024,8,6]}/>
    <meshStandardMaterial color="#efcf91" metalness={.82} roughness={.17}/>
   </mesh>;
  })}
 </group>;
}

/** Open-roof Art Deco architecture, leaving all workstations clickable. */
export function PavilionArchitecture({night=false}:{night?:boolean}){
 return <group>
  {/* Exterior black granite pedestal and front exhibition landing. */}
  <Cuboid pos={[0,-.74,.05]} size={[17.7,.24,14.0]} color="#080f13" roughness={.32}/>
  <Cuboid pos={[0,-.601,.05]} size={[17.43,.035,13.72]} color="#bfa06a" metalness={.90} roughness={.24}/>
  <Cuboid pos={[0,-.579,.05]} size={[17.29,.022,13.56]} color="#20292b" roughness={.3}/>
  {/* Vertical chamfer rhythm reads as crafted brass and glass, not just boxes. */}
  {[-8.37,8.37].map(x=><group key={x}>
   <Cuboid pos={[x,1.02,0]} size={[.085,2.62,12.8]} color="#b49a70" metalness={.85}/>
   <Cuboid pos={[x,2.47,0]} size={[.1,.13,12.93]} color="#d0b788" metalness={.80}/>
   {[-5.55,-2.75,0,2.75,5.55].map(z=><Cuboid key={z}
     pos={[x,1.14,z]} size={[.22,2.40,.17]} color="#c0ae8d" metalness={.81}/>)}
  </group>)}
  {[-6.14,6.14].map(z=><group key={z}>
   <Cuboid pos={[0,2.47,z]} size={[16.63,.11,.14]} color="#c8a977" metalness={.81}/>
   <Cuboid pos={[0,2.32,z]} size={[16.65,.034,.055]} color="#ffdaa0"
     emissive="#edbf73" glow={night?1.1:.42}/>
  </group>)}
  {/* Deliberate frame mullions; no roof that hides the interactive office. */}
  {[-5.88,-3.08,0,3.08,5.88].map(x=><group key={x}>
   <Cuboid pos={[x,1.2,-6.0]} size={[.065,2.26,.05]} color="#9d8663" metalness={.78}/>
   <Cuboid pos={[x,1.2,6.03]} size={[.058,2.27,.045]} color="#9d8663" metalness={.78}/>
  </group>)}
  {/* A jewellery-museum entrance in front, fully ornamental and non-interactive. */}
  <group position={[0,0,6.23]}>
   <Cuboid pos={[0,-.18,0]} size={[3.45,.13,.52]} color="#ae976d" metalness={.77}/>
   <Cuboid pos={[0,-.11,.03]} size={[3.13,.04,.43]} color="#141c20"/>
   <DecoMedallion position={[0,-.078,.02]} radius={.175}/>
   {[-1.64,1.64].map(x=><Cuboid key={x} pos={[x,.08,0]}
      size={[.055,.40,.35]} color="#ab946d" metalness={.85}/>)}
  </group>
  {/* Exterior gallery lighting is static: no false agent activity. */}
  {[-6.7,6.7].map(x=><group key={x} position={[x,2.68,-5.83]}>
   <Cuboid pos={[0,0,0]} size={[1.1,.09,.24]} color="#a28b67" metalness={.8}/>
   <Cuboid pos={[0,-.08,.015]} size={[.98,.045,.18]} color="#ffdb9b"
     emissive="#f3ca89" glow={night?1.7:.65}/>
  </group>)}
 </group>;
}
function Pendant({x=0,z=0,size=.68,night=false}:{x?:number;z?:number;size?:number;night?:boolean}){
 return <group position={[x,0,z]}>
  <Line from={[0,2.90,0]} to={[0,2.50,0]} r={.012} color="#a68e64"/>
  <mesh position={[0,2.49,0]} rotation={[-Math.PI/2,0,0]}>
   <torusGeometry args={[size,.038,10,60]}/>
   <meshStandardMaterial color="#d5b77e" metalness={.93} roughness={.2}/>
  </mesh>
  <mesh position={[0,2.455,0]} rotation={[-Math.PI/2,0,0]}>
   <torusGeometry args={[size*.87,.015,8,48]}/>
   <meshBasicMaterial color="#f9dda3" toneMapped={false}/>
  </mesh>
  {/* Visual light source only; no expensive extra cast-shadow passes. */}
  {night&&<pointLight position={[0,2.28,0]} color="#f4c991" distance={3.3} intensity={.44}/>}
 </group>;
}
function WallArt({x,z,title,subtitle}:{x:number;z:number;title:string;subtitle:string}){
 return <group position={[x,0,z]}>
  <RoundedBox args={[1.64,1.10,.12]} radius={.06} smoothness={3}
    position={[0,1.25,0]}>
   <meshStandardMaterial color="#1c2326" metalness={.55} roughness={.28}/>
  </RoundedBox>
  <Cuboid pos={[0,1.26,.085]} size={[1.48,.90,.012]} color="#243033" metalness={.46}/>
  {[-.74,.74].map(u=><Cuboid key={u} pos={[u,1.25,.11]} size={[.012,1.0,.012]}
   color="#c5a775" metalness={.89}/>)}
  <Text position={[0,1.36,.102]} fontSize={.14} maxWidth={1.32} color="#eecb91" anchorX="center">{title}</Text>
  <Text position={[0,1.05,.103]} fontSize={.074} maxWidth={1.4} color="#a6b9b2" anchorX="center">{subtitle}</Text>
 </group>;
}
function Sculpture({pos=[0,1.1,0],scale=1}:{pos?:Vec3;scale?:number}){
 return <group position={pos} scale={scale}>
  <mesh rotation={[.38,.16,.20]}>
   <torusGeometry args={[.26,.028,10,60]}/>
   <meshStandardMaterial color="#e2c58d" roughness={.12} metalness={.98}/>
  </mesh>
  <mesh rotation={[-.48,1.24,.3]}>
   <torusGeometry args={[.21,.017,9,50]}/>
   <meshStandardMaterial color="#b99e6a" roughness={.16} metalness={.95}/>
  </mesh>
  <mesh position={[0,0,0]}>
   <octahedronGeometry args={[.083,0]}/>
   <meshPhysicalMaterial color="#e7f7f3" metalness={.13} roughness={.06}
      transmission={.45} thickness={.32} ior={1.52}/>
  </mesh>
 </group>;
}
function VelvetLounge({x,z,rotation=0}:{x:number;z:number;rotation?:number}){
 return <group position={[x,0,z]} rotation={[0,rotation,0]}>
   <RoundedBox position={[0,.29,0]} args={[1.24,.21,.57]} radius={.11} smoothness={4}>
    <meshStandardMaterial color="#58635c" metalness={.13} roughness={.69}/>
   </RoundedBox>
   <RoundedBox position={[0,.53,-.27]} args={[1.24,.55,.15]} radius={.08} smoothness={3}>
    <meshStandardMaterial color="#4b5752" roughness={.82}/>
   </RoundedBox>
   {[-.51,.51].map(x0=><Cuboid key={x0} pos={[x0,.40,0]}
     size={[.12,.32,.59]} color="#857354" metalness={.6}/>)}
   {[-.45,.45].map(x0=><Cuboid key={x0} pos={[x0,.115,0]}
     size={[.065,.23,.07]} color="#c1a575" metalness={.87}/>)}
 </group>;
}
function JewelleryPlinth({x,z}:{x:number;z:number}){
 return <group position={[x,0,z]}>
  <Cuboid pos={[0,.27,0]} size={[.42,.54,.42]} color="#1b2327" metalness={.61}/>
  <Cuboid pos={[0,.57,0]} size={[.48,.052,.48]} color="#cbae7c" metalness={.90}/>
  <Cuboid pos={[0,.73,0]} size={[.42,.29,.42]} color="#a6aaa3" opacity={.13} metalness={.2}/>
  <Sculpture pos={[0,.78,0]} scale={.58}/>
 </group>;
}
function ProductionRingLight(){
 return <group position={[-2.89,0,-1.55]}>
  <Line from={[0,.16,0]} to={[0,1.25,0]} color="#9d927a" r={.028}/>
  {[-.18,.18].map(x=><Line key={x} from={[0,.23,0]} to={[x,.06,.28]}
   color="#948268" r={.019}/>)}
  <mesh position={[0,1.57,0]}>
   <torusGeometry args={[.34,.04,10,48]}/>
   <meshStandardMaterial color="#dbbf8c" emissive="#ddb77b" emissiveIntensity={.45} metalness={.62}/>
  </mesh>
  <mesh position={[0,1.57,0]}>
   <torusGeometry args={[.285,.012,8,48]}/>
   <meshBasicMaterial color="#ffe3b3"/>
  </mesh>
 </group>;
}
function VideoSet(){
 return <group position={[2.85,0,-.14]}>
  <Cuboid pos={[0,1.18,0]} size={[.20,1.7,.11]} color="#3a4040" metalness={.56}/>
  <Cuboid pos={[-.06,1.23,0]} size={[.035,1.49,.12]} color="#c6a877" metalness={.8}/>
  <RoundedBox position={[-.12,1.26,.08]} args={[.81,1.48,.08]}
   radius={.06} smoothness={3}>
   <meshStandardMaterial color="#171e22" metalness={.43}/>
  </RoundedBox>
  <Cuboid pos={[-.12,1.25,.13]} size={[.63,1.23,.02]} color="#394a4d" emissive="#4c665d" glow={.2}/>
  <Text position={[-.12,1.54,.149]} fontSize={.15} color="#f7dfac">9:16</Text>
  <Text position={[-.12,1.02,.149]} fontSize={.08} color="#c1d3c9">LOCAL VIDEO</Text>
 </group>;
}
function LoungeArt({room}:{room:LuxuryRoom}){
 switch(room){
 case "ceo":return <>
  <WallArt x={-2.17} z={-2.20} title="THE ATELIER" subtitle="DESIGN · CRAFT · TRUST"/>
  <WallArt x={2.12} z={-2.20} title="PRASANTH" subtitle="EVIDENCE BEFORE ACTION"/>
  <VelvetLounge x={-2.22} z={1.65} rotation={-.24}/>
  <JewelleryPlinth x={2.80} z={-1.02}/>
  <Sculpture pos={[0,1.24,-1.55]} scale={.55}/>
 </>;
 case "marketing":return <>
  <ProductionRingLight/>
  <VideoSet/>
  <WallArt x={0} z={-2.20} title="CREATIVE / 20 SEC" subtitle="CODE · MOTION · REVIEW"/>
  <JewelleryPlinth x={-2.89} z={1.91}/>
 </>;
 case "sales":return <>
  <JewelleryPlinth x={-3.06} z={-1.85}/>
  <JewelleryPlinth x={3.06} z={1.86}/>
  <WallArt x={0} z={-2.20} title="SOURCE VERIFIED?" subtitle="REVIEW · APPROVE · ACT"/>
 </>;
 case "meeting":return <>
  <Sculpture pos={[0,.92,.19]} scale={1.1}/>
  <JewelleryPlinth x={-2.84} z={1.93}/>
  <JewelleryPlinth x={2.84} z={1.93}/>
 </>;
 }
}
export function LuxuryRoomDetails({room,night=false,detail=true}:{
 room:LuxuryRoom;night?:boolean;detail?:boolean;
}){
 return <group>
  {/* Slim architectural perimeter and fluted wall panels. */}
  {[-3.35,3.35].map(x=><group key={x}>
   {[-2.39,2.39].map(z=><group key={z}>
    <Cuboid pos={[x,1.39,z]} size={[.093,2.73,.10]} color="#bdaa84" metalness={.75}/>
    <Cuboid pos={[x,2.74,z]} size={[.18,.11,.18]} color="#f0cfa0" metalness={.84}/>
   </group>)}
   <Cuboid pos={[x,2.76,0]} size={[.10,.078,4.83]} color="#ccb185" metalness={.86}/>
  </group>)}
  {[-2.37,2.37].map(z=><Cuboid key={z} pos={[0,2.75,z]}
   size={[6.75,.09,.095]} color="#d6b889" metalness={.82}/>)}
  {[-2.63,-1.88,1.88,2.63].map(x=><group key={x}>
   <Cuboid pos={[x,1.06,-2.34]} size={[.035,2.12,.045]} color="#bc9e6b" metalness={.89}/>
   <Cuboid pos={[x,1.08,-2.38]} size={[.18,1.55,.03]} color="#45515a" opacity={.34}/>
  </group>)}
  <Cuboid pos={[0,.13,2.37]} size={[6.25,.02,.06]} color="#efcb8d" emissive="#a98a50" glow={night?0.8:0.22}/>
  {[-2.8,2.8].map(x=><Cuboid key={x} pos={[x,.17,0]} size={[.025,.014,4.2]} color="#bfa579" metalness={.8}/>)}
  {/* Visible open sky-frame; ceiling is absent so camera can still orbit over desks. */}
  <Pendant x={0} z={room==="meeting"?0:-.06} size={room==="meeting"?.88:.54} night={night}/>
  {detail&&<LoungeArt room={room}/>}
 </group>;
}
