import {cityRiver,CITY_LANDMARKS} from './city-layout.js?v=25';

export const streamWater=(x,z)=>Math.abs(z-(350+Math.sin(x*.0032)*105))<80;
export function walkingBridge(x,z){
 return cityRiver(x,z)&&Math.abs(x-CITY_LANDMARKS.walterdale.x)<94||streamWater(x,z)&&(Math.abs(x)<85||Math.abs(x+700)<85||(x>1110&&x<1320&&Math.abs(z-220)<40));
}
export function waterAt(x,z,ponds=[],margin=0){
 return ((streamWater(x,z)||cityRiver(x,z))&&!walkingBridge(x,z))||ponds.some(p=>Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin);
}

// Validate the whole pedestrian footprint, including shorelines and pond edges.
// Relocation runs once at creation; no searching takes place during animation.
export function citizenPlacement(data,{groundAt,blocked}){
 const valid=(x,z)=>{
  const y=groundAt(x,z,data.zone);
  return Number.isFinite(y)&&[[0,0],[-16,0],[16,0],[0,-16],[0,16]].every(([dx,dz])=>!blocked(x+dx,z+dz,data.zone)&&Math.abs(groundAt(x+dx,z+dz,data.zone)-y)<4);
 };
 if(valid(data.x,data.z))return {...data,y:groundAt(data.x,data.z,data.zone)};
 for(let radius=24;radius<=288;radius+=24)for(let i=0;i<24;i++){
  const angle=i*Math.PI/12,x=data.x+Math.cos(angle)*radius,z=data.z+Math.sin(angle)*radius;
  if(valid(x,z))return {...data,x,z,y:groundAt(x,z,data.zone)};
 }
 return null;
}
