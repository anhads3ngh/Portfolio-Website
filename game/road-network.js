import {AIRPORT_DRIVE} from './world-layout.js?v=19';
import {TORONTO_ROADS,CAMPUS_ROADS,CITY_LANDMARKS} from './city-layout.js?v=19';

const accessRoads=AIRPORT_DRIVE.slice(1).map(([x,z],i)=>{const [ax,az]=AIRPORT_DRIVE[i];return {name:'AIRPORT TRANSFER',x:(ax+x)/2,z:(az+z)/2,length:Math.hypot(x-ax,z-az),width:144,cap:72,axis:ax===x?'z':'x'};});
export const ROAD_NETWORK=[
 ...TORONTO_ROADS.map(r=>({...r,region:'toronto'})),
 ...CAMPUS_ROADS.map(r=>({...r,region:'edmonton'})),
 ...[
  {x:370,z:-2220,length:480,width:100,axis:'z'}, {x:370,z:-1360,length:300,width:100,axis:'z'},
  {x:170,z:-2320,length:2750,width:145,axis:'x'}, {x:170,z:-2930,length:2750,width:145,axis:'x'},
  {x:-850,z:-2600,length:1050,width:90,axis:'z'}, {x:1580,z:-995,length:1000,width:110,axis:'z'},
  {x:-740,z:-937,length:890,width:112,axis:'x'}, {x:-740,z:-652,length:890,width:112,axis:'x'},
  {x:-1110,z:-785,length:820,width:84,axis:'z'}, ...accessRoads
 ].map(r=>({...r,region:'edmonton'}))
];
export const ROAD_LEVELS={asphalt:1.2,markings:1.6,sidewalk:2.4};
export function roadRectangle(r,padding=0){const length=r.length+2*(r.cap||0),w=(r.axis==='x'?length:r.width)+padding*2,d=(r.axis==='x'?r.width:length)+padding*2;return {minX:r.x-w/2,maxX:r.x+w/2,minZ:r.z-d/2,maxZ:r.z+d/2};}
export function inRoadCorridor(x,z,margin=0){return ROAD_NETWORK.some(r=>Math.abs(x-r.x)<(r.axis==='x'?r.length+2*(r.cap||0):r.width)/2+margin&&Math.abs(z-r.z)<(r.axis==='x'?r.width:r.length+2*(r.cap||0))/2+margin);}
// Split overlapping rectangles into disjoint pieces. Road junctions are drawn
// once, and raised sidewalks never stretch across another road's asphalt.
export function subtractRectangle(a,b){
 const x0=Math.max(a.minX,b.minX),x1=Math.min(a.maxX,b.maxX),z0=Math.max(a.minZ,b.minZ),z1=Math.min(a.maxZ,b.maxZ);
 if(x0>=x1||z0>=z1)return [a];
 return [
  {minX:a.minX,maxX:x0,minZ:a.minZ,maxZ:a.maxZ}, {minX:x1,maxX:a.maxX,minZ:a.minZ,maxZ:a.maxZ},
  {minX:x0,maxX:x1,minZ:a.minZ,maxZ:z0}, {minX:x0,maxX:x1,minZ:z1,maxZ:a.maxZ}
 ].filter(r=>r.maxX>r.minX&&r.maxZ>r.minZ);
}
function union(rectangles){const result=[];for(const rectangle of rectangles){let pieces=[rectangle];for(const previous of result){pieces=pieces.flatMap(p=>subtractRectangle(p,previous));if(!pieces.length)break;}result.push(...pieces);}return result;}
export function buildRoadSurfaces(network=ROAD_NETWORK){
 const surfaces=[];
 for(const region of new Set(network.map(r=>r.region))){
  const roads=network.filter(r=>r.region===region),rectangles=roads.map(r=>roadRectangle(r)),asphalt=union(rectangles);
  const sidewalks=union(roads.map(r=>roadRectangle(r,18))).flatMap(r=>{let pieces=[r];for(const road of asphalt)pieces=pieces.flatMap(p=>subtractRectangle(p,road));return pieces;});
  for(const [rects,kind,color]of [[asphalt,'asphalt','#465158'],[sidewalks,'sidewalk','#b7b8ae']])for(const rectangle of rects)surfaces.push({...rectangle,region,kind,y:ROAD_LEVELS[kind],color});
  for(const [i,road]of roads.entries())for(let n=-road.length/2+20;n<road.length/2-10;n+=46){
   const horizontal=road.axis==='x',x=road.x+(horizontal?n:0),z=road.z+(horizontal?0:n),dash={minX:x-(horizontal?11.5:1.5),maxX:x+(horizontal?11.5:1.5),minZ:z-(horizontal?1.5:11.5),maxZ:z+(horizontal?1.5:11.5)};
   let pieces=[dash];for(let j=0;j<roads.length;j++)if(j!==i&&(roads[j].axis!==road.axis||j<i))pieces=pieces.flatMap(p=>subtractRectangle(p,rectangles[j]));
   for(const rectangle of pieces)surfaces.push({...rectangle,region,kind:'markings',y:ROAD_LEVELS.markings,color:'#ddd1a2'});
  }
 }
 return surfaces;
}
export function createRoadNetwork({surfaceQuad}){const surfaces=buildRoadSurfaces();for(const r of surfaces)surfaceQuad([[r.minX,r.y,r.minZ],[r.minX,r.y,r.maxZ],[r.maxX,r.y,r.maxZ],[r.maxX,r.y,r.minZ]],r.color,[0,1,0]);return {roads:ROAD_NETWORK,surfaces};}

export const BRIDGE_DECK=9.2;
export function bridgeRoadHeight(x,z){const b=CITY_LANDMARKS.walterdale,distance=Math.abs(z-b.z),half=b.length/2;if(Math.abs(x-b.x)>94||distance>half+80)return null;return distance<=half?BRIDGE_DECK:ROAD_LEVELS.asphalt+(BRIDGE_DECK-ROAD_LEVELS.asphalt)*(1-(distance-half)/80);}
