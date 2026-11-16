import {Headquarters} from "@/components/headquarters";
export const dynamic="force-dynamic";
/** Protected by the same HQ proxy: owner-only lightweight direct-entry route. */
export default function AccessibleHeadquarters(){
 return <Headquarters initialVisual={false}/>;
}
