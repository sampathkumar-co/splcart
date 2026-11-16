/**
 * Spatial source of truth for the independently deployed Headquarters office.
 * Pure coordinates: no WebGL required for verification or accessible 2D mode.
 * Only real roster roles get desks; the strategy room is a real collaboration
 * space rather than a fake seventeenth "agent".
 */
import {ROLE_SPECS} from "./agent-roster";
export type RoomKey="ceo"|"sales"|"marketing"|"meeting";
export type Vector3=[number,number,number];
export type CameraPose={position:Vector3;target:Vector3};

export const HQ_BUILDING_YAW=-0.105;
export const OFFICE_ROOMS=[
  {name:"EXECUTIVE SUITE",subtitle:"Owner approvals · decisions",value:"ceo",x:-4.1,z:-2.6},
  {name:"SALES INTELLIGENCE",subtitle:"Evidence · wholesale pipeline",value:"sales",x:3.6,z:-2.6},
  {name:"CREATIVE STUDIO",subtitle:"Owner-approved code-rendered Reels",value:"marketing",x:-4.1,z:3.05},
  {name:"STRATEGY ROOM",subtitle:"Reviews · coordination",value:"meeting",x:3.6,z:3.05},
] as const;
type DeskRoom="ceo"|"sales"|"marketing";
export const DESK_OFFSETS:Record<DeskRoom,Vector3[]>={
  ceo:[[0,0,.35]],
  sales:[[-2.12,0,-1.16],[0,0,-1.16],[2.12,0,-1.16],[-2.12,0,.05],[0,0,.05],[2.12,0,.05],[-2.12,0,1.26],[0,0,1.26],[2.12,0,1.26]],
  marketing:[[-2.12,0,-.84],[0,0,-.84],[2.12,0,-.84],[-2.12,0,.87],[0,0,.87],[2.12,0,.87]],
};

/** A perspective near a real workstation, not a screenshot or simulated agent. */
export function getStationCameraPose(id:string):CameraPose|null {
  const role=ROLE_SPECS.find(r=>r.id===id);
  if(!role)return null; // The current 16-role roster has no fictional meeting-room agent.
  const room=OFFICE_ROOMS.find(r=>r.value===role.room);
  if(!room)return null;
  const index=ROLE_SPECS.filter(r=>r.room===role.room).findIndex(r=>r.id===id);
  const desk=DESK_OFFSETS[role.room as DeskRoom][index];
  if(!desk)return null;
  // The entire scene rotates around the origin, not each room individually.
  const x=room.x+desk[0],z=room.z+desk[2];
  const sin=Math.sin(HQ_BUILDING_YAW),cos=Math.cos(HQ_BUILDING_YAW);
  const wx=x*cos+z*sin,wz=-x*sin+z*cos;
  // High near-overhead lens: keep all outer/front interior signs and light
  // rails BELOW the sightline, so the desk itself is visible on close-up.
  // We tested the original low-angle shot and it was obscured by signage.
  const sign=wx>0?-1:1;
  const target:Vector3=[wx,.82,wz];
  const position:Vector3=[wx+sign*1.55,5.0,wz+1.55];
  return {position,target};
}
