import {describe,expect,it} from "vitest";
import {ROLE_SPECS} from "../lib/agent-roster";
import {DESK_OFFSETS,OFFICE_ROOMS,HQ_BUILDING_YAW,getStationCameraPose} from "../lib/office-layout";

describe("code-native office workstation camera geometry",()=>{
 it("places all 16 real roles at unique existing workstations, with no fake desks",()=>{
   expect(ROLE_SPECS).toHaveLength(16);
   const poses=ROLE_SPECS.map(r=>getStationCameraPose(r.id));
   expect(poses.every(Boolean)).toBe(true);
   const unique=new Set(poses.map(p=>p!.target.map(v=>v.toFixed(4)).join(",")));
   expect(unique.size).toBe(16);
   expect(DESK_OFFSETS.ceo.length+DESK_OFFSETS.sales.length+DESK_OFFSETS.marketing.length).toBe(16);
   expect(OFFICE_ROOMS).toHaveLength(4);
   expect(HQ_BUILDING_YAW).toBeLessThan(0);
 });
 it("is deterministic and always in bounds of the genuine building",()=>{
   for(const r of ROLE_SPECS){
     const pose=getStationCameraPose(r.id)!;
     const [x,y,z]=pose.target;
     expect(Number.isFinite(x+y+z)).toBe(true);
     expect(Math.abs(x)).toBeLessThan(8.5);
     expect(Math.abs(z)).toBeLessThan(6.7);
     expect(y).toBeCloseTo(.82,3);
     const distance=Math.hypot(...pose.position.map((v,i)=>v-pose.target[i]));
     expect(distance).toBeGreaterThan(4);
     expect(distance).toBeLessThan(6);
     expect(getStationCameraPose(r.id)).toEqual(pose);
   }
 });
 it("never invents camera positions for unrecognized or imaginary roles",()=>{
   for(const fake of ["","finance-director","operations-manager","fake-ai-17","__proto__"]){
     expect(getStationCameraPose(fake)).toBeNull();
   }
 });
 it("correctly rotates every desk inside the shared architectural scene",()=>{
   for(const room of ["ceo","sales","marketing"] as const){
     const base=OFFICE_ROOMS.find(r=>r.value===room)!;
     const roles=ROLE_SPECS.filter(r=>r.room===room);
     for(let i=0;i<roles.length;i++){
       const desk=DESK_OFFSETS[room][i];
       const cos=Math.cos(HQ_BUILDING_YAW),sin=Math.sin(HQ_BUILDING_YAW);
       const x=base.x+desk[0],z=base.z+desk[2];
       const pose=getStationCameraPose(roles[i].id)!;
       expect(pose.target[0]).toBeCloseTo(x*cos+z*sin,7);
       expect(pose.target[2]).toBeCloseTo(-x*sin+z*cos,7);
     }
   }
 });
});
