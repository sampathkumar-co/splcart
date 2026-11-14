"use client";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text, Environment } from "@react-three/drei";
import { Suspense, useState } from "react";
import * as THREE from "three";

const brass = "#ba9a60";
const rooms = [
  { name: "EXECUTIVE SUITE", subtitle: "CEO · Approvals", x: -4.1, z: -2.6, value: "ceo" },
  { name: "SALES INTELLIGENCE", subtitle: "Browser · Wholesale", x: 3.6, z: -2.6, value: "sales" },
  { name: "CREATIVE STUDIO", subtitle: "Marketing · Future", x: -4.1, z: 3.05, value: "marketing" },
  { name: "STRATEGY ROOM", subtitle: "Plans · Evidence", x: 3.6, z: 3.05, value: "meeting" },
] as const;
export type RoomKey = typeof rooms[number]["value"];

function Desk({ position, selected, onClick, status }: { position: [number, number, number], selected?: boolean, onClick?: () => void, status?: "running" | "idle" | "blocked" }) {
  return <group position={position} onClick={onClick}>
    <RoundedBox args={[2.35, 0.14, 0.95]} radius={0.06} smoothness={4} position={[0, .72, 0]}>
      <meshPhysicalMaterial color={selected ? "#877047" : "#24272b"} metalness={0.64} roughness={0.24} />
    </RoundedBox>
    {[-0.94, 0.94].map(x => <mesh key={x} position={[x, .36, 0]}><boxGeometry args={[.07,.7,.75]}/><meshStandardMaterial color={brass} metalness={.88} roughness={.24}/></mesh>)}
    <group position={[0, 1.12, -.12]}>
      <mesh><boxGeometry args={[.88,.6,.045]}/><meshStandardMaterial color="#080c14" metalness={.54} roughness={.24} /></mesh>
      <mesh position={[0,0,.026]}><planeGeometry args={[.80,.52]}/><meshBasicMaterial color={status === "running" ? "#4b9a81" : status === "blocked" ? "#453329" : "#263743"} /></mesh>
      <mesh position={[0,-.38,0]}><boxGeometry args={[.045,.17,.04]}/><meshStandardMaterial color={brass} metalness={.86} roughness={.24}/></mesh>
    </group>
    <mesh position={[0,.19,1.07]}><boxGeometry args={[.75,.11,.67]}/><meshStandardMaterial color="#393b3b" metalness={.24}/></mesh>
    <mesh position={[0,.51,1.35]}><boxGeometry args={[.75,.62,.11]}/><meshStandardMaterial color="#313536" metalness={.24}/></mesh>
    <mesh position={[0,.83,1.31]}><boxGeometry args={[.50,.12,.1]}/><meshStandardMaterial color="#5c5e5c" metalness={.3}/></mesh>
    {selected && <mesh position={[0,.018,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[1.18,1.25,56]}/><meshBasicMaterial color="#e6c790" transparent opacity={.9}/></mesh>}
  </group>;
}
function Room({room, chosen, select, running}: {room:typeof rooms[number], chosen:boolean, select: (value:RoomKey)=>void, running: boolean}) {
  return <group position={[room.x,0,room.z]}>
    <mesh position={[0,.02,0]} receiveShadow><boxGeometry args={[6.7,.08,4.55]}/><meshStandardMaterial color={chosen ? "#222528" : "#171b1e"} roughness={.44} metalness={.36} /></mesh>
    <mesh position={[-3.3,.46,0]}><boxGeometry args={[.065,.9,4.5]}/><meshStandardMaterial color="#a5834f" metalness={.78} roughness={.33}/></mesh>
    <mesh position={[0,.46,-2.22]}><boxGeometry args={[6.65,.9,.055]}/><meshStandardMaterial color="#77746c" metalness={.36} roughness={.4} transparent opacity={.45}/></mesh>
    <mesh position={[0,.13,1.92]}><boxGeometry args={[5.5,.025,.015]}/><meshBasicMaterial color={brass}/></mesh>
    <Text position={[0,.08,-1.9]} rotation={[-Math.PI/2,0,0]} fontSize={.29} letterSpacing={.15} color="#d9bf8d" anchorX="center">{room.name}</Text>
    <Desk position={[0,0,.1]} selected={chosen} onClick={()=>select(room.value)} status={room.value==="sales" && running ? "running" : room.value==="marketing" ? "blocked" : "idle"}/>
    <mesh position={[-1.65,.06,-.3]} onClick={()=>select(room.value)}><cylinderGeometry args={[.12,.12,.08,24]}/><meshStandardMaterial color="#a78a56" metalness={.7} /></mesh>
    <pointLight position={[-1.4,2.1,.1]} color="#ffcf87" intensity={1.2} distance={6}/>
  </group>;
}
function Building({selected, onSelect, running}: {selected:RoomKey, onSelect:(x:RoomKey)=>void, running:boolean}) {
  const [hover, setHover] = useState(false);
  const onEnter = (e:ThreeEvent<PointerEvent>) => {e.stopPropagation(); document.body.style.cursor="pointer";setHover(true)};
  const onLeave = () => {document.body.style.cursor="auto";setHover(false)};
  return <group rotation={[0,-.13,0]}>
    <mesh position={[0,-.12,.1]} receiveShadow><boxGeometry args={[15.4,.20,11.75]}/><meshStandardMaterial color="#111719" metalness={.48} roughness={.33}/></mesh>
    <mesh position={[0,.15,.1]}><boxGeometry args={[.08,.02,11.4]}/><meshBasicMaterial color="#a78852"/></mesh>
    <mesh position={[0,.15,.1]} rotation={[0,Math.PI/2,0]}><boxGeometry args={[.08,.02,15.1]}/><meshBasicMaterial color="#a78852"/></mesh>
    {rooms.map(room=><group key={room.value} onPointerOver={onEnter} onPointerOut={onLeave}>
      <Room room={room} chosen={selected===room.value} select={onSelect} running={running}/>
    </group>)}
    <mesh position={[0,4.1,-5.95]}><boxGeometry args={[15.4,.16,.22]}/><meshStandardMaterial color="#918477" metalness={.4}/></mesh>
    {[[-7.5,-5.75],[7.5,-5.75],[-7.5,5.9],[7.5,5.9]].map(([x,z],i)=><mesh key={i} position={[x,2,z]}><boxGeometry args={[.22,4,.22]}/><meshStandardMaterial color="#98754e" metalness={.8} roughness={.28}/></mesh>)}
    <Text position={[0,3.92,-5.65]} fontSize={.42} letterSpacing={.19} color="#f0e2c4">PRASANTH · AI HEADQUARTERS</Text>
    <ambientLight intensity={.7} />
    <directionalLight position={[3,8,4]} intensity={2} color="#fff2da" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
    {hover && <pointLight position={[0,2,0]} color="#f9cc78" intensity={.4} distance={13}/>} 
  </group>;
}
export function Office({selected,onSelect,running}:{selected:RoomKey,onSelect:(x:RoomKey)=>void,running:boolean}) {
  return <div className="office-canvas" role="img" aria-label="Interactive 3D AI Headquarters with executive, sales, marketing, and strategy rooms">
    <Canvas shadows camera={{ position:[13.5,13.5,16.5],fov:42,near:.1,far:100 }} dpr={[1,1.5]} gl={{alpha:true,antialias:true,powerPreference:"high-performance"}}>
      <color attach="background" args={["#11171b"]}/>
      <fog attach="fog" args={["#11171b",29,46]}/>
      <Suspense fallback={null}><Building selected={selected} onSelect={onSelect} running={running}/></Suspense>
      <OrbitControls target={[0,.4,0]} enablePan={false} minDistance={12} maxDistance={35} maxPolarAngle={Math.PI/2.22} minPolarAngle={.3} enableDamping dampingFactor={.08}/>
    </Canvas>
    <div className="office-overlay"><span className="light-dot"/> REAL-TIME WORKSPACE <span className="overlay-tip">Drag to orbit · Scroll to zoom · Click a workstation</span></div>
  </div>;
}
