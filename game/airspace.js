import {AIRPORTS} from './world-layout.js?v=17';
// Local aircraft components use the same dimensions as the rendered mesh.
export const AIRCRAFT_PARTS=[
 [0,0,0,27,27,140],[0,1,-65,23,21,30],[0,-3,5,180,6,40],
 [0,18,58,6,40,35],[0,5,55,75,5,25],[-31,-14,6,16,17,35],[31,-14,6,16,17,35],
 [-11,-23,27,7,10,12],[11,-23,27,7,10,12],[0,-23,-45,7,10,12]
];
export const AIRFIELDS=Object.values(AIRPORTS).map(a=>({id:a.id,...a.airfield}));
export const RUNWAYS=Object.values(AIRPORTS).map(a=>({x:a.x,z:a.z,width:210,length:1020}));
export function onRunway(x,z,radius=0){return RUNWAYS.some(a=>Math.abs(x-a.x)<a.width/2+radius&&Math.abs(z-a.z)<a.length/2+radius);}
export function inAirfield(x,z,halfX=0,halfZ=halfX){return AIRFIELDS.some(a=>x+halfX>a.minX&&x-halfX<a.maxX&&z+halfZ>a.minZ&&z-halfZ<a.maxZ);}
export function inApproachCorridor(x,z,margin=0){return Object.values(AIRPORTS).some(a=>Math.abs(x-a.x)<420+margin&&z>a.z-3200-margin&&z<a.z+2300+margin);}
export function trafficPosition(route,time){const offset=((route.phase+(time*route.speed))%route.length+route.length)%route.length-route.length/2;return {x:route.x+(route.axis==='x'?offset:0),z:route.z+(route.axis==='z'?offset:0)};}
export function routeAvoidsAirfields(route){
 const half=route.dimensions.length/2,width=route.dimensions.width/2;
 for(let i=0;i<=60;i++){const p=trafficPosition(route,route.speed?i*route.length/Math.abs(route.speed)/60:0);if(inAirfield(p.x,p.z,route.axis==='x'?half:width,route.axis==='x'?width:half))return false;}return true;
}
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export function aircraftBounds(sample,parts=AIRCRAFT_PARTS){
 const cy=Math.cos(sample.heading),sy=Math.sin(sample.heading),cp=Math.cos(sample.pitch),sp=Math.sin(sample.pitch),cb=Math.cos(sample.bank),sb=Math.sin(sample.bank),p=sample.position;
 return parts.map(([x,y,z,w,h,d])=>{
  const bounds={minX:Infinity,minY:Infinity,minZ:Infinity,maxX:-Infinity,maxY:-Infinity,maxZ:-Infinity};
  for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
   const xx=x+a*w/2,yy=y+b*h/2,zz=z+c*d/2,rx=cb*xx-sb*yy,ry=sb*xx+cb*yy,py=cp*ry-sp*zz,pz=sp*ry+cp*zz;
   const wx=p.x+cy*rx+sy*pz,wy=p.y+py,wz=p.z-sy*rx+cy*pz;
   bounds.minX=Math.min(bounds.minX,wx-2);bounds.maxX=Math.max(bounds.maxX,wx+2);bounds.minY=Math.min(bounds.minY,wy-2);bounds.maxY=Math.max(bounds.maxY,wy+2);bounds.minZ=Math.min(bounds.minZ,wz-2);bounds.maxZ=Math.max(bounds.maxZ,wz+2);
  }return bounds;
 });
}
export function createAirspaceAudit(boxes,parts=AIRCRAFT_PARTS){
 const cells=new Map(),step=220;
 for(const [index,b]of boxes.entries()){
  if(b[0]<-4000||b[1]+b[4]/2<4.5)continue;
  for(let x=Math.floor((b[0]-b[3]/2)/step);x<=Math.floor((b[0]+b[3]/2)/step);x++)for(let z=Math.floor((b[2]-b[5]/2)/step);z<=Math.floor((b[2]+b[5]/2)/step);z++){const key=x+','+z;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(index);}
 }
 return function audit(plan){
  let heading,pitch,bank;const hits=[];
  for(let t=0;t<=plan.duration;t+=.045){const sample=plan.sample(t),blend=1-Math.exp(-5*.045);heading=heading===undefined?sample.heading:heading+wrap(sample.heading-heading)*blend;pitch=pitch===undefined?sample.pitch:pitch+(sample.pitch-pitch)*blend;bank=bank===undefined?sample.bank:bank+(sample.bank-bank)*blend;
   for(const part of aircraftBounds({...sample,heading,pitch,bank},parts)){
    const nearby=new Set();for(let x=Math.floor(part.minX/step);x<=Math.floor(part.maxX/step);x++)for(let z=Math.floor(part.minZ/step);z<=Math.floor(part.maxZ/step);z++)for(const index of cells.get(x+','+z)||[])nearby.add(index);
    for(const index of nearby){const b=boxes[index];if(part.minX<b[0]+b[3]/2&&part.maxX>b[0]-b[3]/2&&part.minY<b[1]+b[4]/2&&part.maxY>b[1]-b[4]/2&&part.minZ<b[2]+b[5]/2&&part.maxZ>b[2]-b[5]/2){if(!hits.some(h=>h.index===index))hits.push({index,time:t,phase:sample.phase,box:b.slice(0,6),position:sample.position});if(hits.length===12)return hits;}}
   }
  }return hits;
 };
}
