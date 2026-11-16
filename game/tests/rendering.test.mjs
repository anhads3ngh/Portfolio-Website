import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {ROAD_NETWORK,ROAD_LEVELS,buildRoadSurfaces,roadRectangle,subtractRectangle,inRoadCorridor,bridgeRoadHeight,BRIDGE_DECK} from '../road-network.js';
import {createCollisionIndex} from '../collision-index.js';
import {createFrameQuality} from '../frame-quality.js';
import {OFFICE_LOUNGE,createExperienceScenes} from '../experience-scenes.js';
import {createAirportTransfer} from '../airport-transfer.js';
const area=r=>(r.maxX-r.minX)*(r.maxZ-r.minZ),overlap=(a,b)=>Math.max(0,Math.min(a.maxX,b.maxX)-Math.max(a.minX,b.minX))*Math.max(0,Math.min(a.maxZ,b.maxZ)-Math.max(a.minZ,b.minZ));
const includes=(r,x,z)=>x>=r.minX-1e-7&&x<=r.maxX+1e-7&&z>=r.minZ-1e-7&&z<=r.maxZ+1e-7;

test('Crossroads have one asphalt surface and no sidewalk across either road',()=>{
 const roads=[{x:0,z:0,length:200,width:40,axis:'x',region:'test'},{x:0,z:0,length:200,width:40,axis:'z',region:'test'}],surfaces=buildRoadSurfaces(roads),asphalt=surfaces.filter(r=>r.kind==='asphalt'),sidewalks=surfaces.filter(r=>r.kind==='sidewalk');
 assert.equal(asphalt.reduce((n,r)=>n+area(r),0),14400);
 for(let i=0;i<asphalt.length;i++)for(let j=i+1;j<asphalt.length;j++)assert.equal(overlap(asphalt[i],asphalt[j]),0);
 for(const r of sidewalks)for(const road of asphalt)assert.equal(overlap(r,road),0);
 assert(ROAD_LEVELS.markings>ROAD_LEVELS.asphalt);assert(ROAD_LEVELS.sidewalk>ROAD_LEVELS.asphalt);
 for(let n=-90;n<=90;n+=10){assert(asphalt.some(r=>includes(r,n,0)));assert(asphalt.some(r=>includes(r,0,n)));}
});

test('Road subtraction preserves area outside an overlapping rectangle',()=>{
 const a={minX:-100,maxX:100,minZ:-80,maxZ:80},b={minX:-30,maxX:70,minZ:-150,maxZ:15},pieces=subtractRectangle(a,b);
 assert.equal(pieces.reduce((n,r)=>n+area(r),0),area(a)-overlap(a,b));for(const p of pieces)assert.equal(overlap(p,b),0);
});

test('The complete road network covers every centreline, including the old airport gap',()=>{
 const surfaces=buildRoadSurfaces().filter(r=>r.kind==='asphalt');
 for(const road of ROAD_NETWORK)for(let n=-road.length/2;n<=road.length/2;n+=17){const x=road.x+(road.axis==='x'?n:0),z=road.z+(road.axis==='z'?n:0);assert(surfaces.some(r=>r.region===road.region&&includes(r,x,z)),JSON.stringify({road,x,z}));}
 assert(surfaces.some(r=>includes(r,504,-1190)));assert(inRoadCorridor(1580,-1100,40));
 for(let i=0;i<surfaces.length;i++)for(let j=i+1;j<surfaces.length;j++)if(surfaces[i].region===surfaces[j].region)assert.equal(overlap(surfaces[i],surfaces[j]),0);
});

test('Both rounded airport drives keep all four wheels on the paved network',()=>{
 const asphalt=buildRoadSurfaces().filter(r=>r.region==='edmonton'&&r.kind==='asphalt'),trip=createAirportTransfer({THREE,boxGeometry:new THREE.BoxGeometry(1,1,1),addToDistrict(){}});
 for(const back of [false,true]){const {duration}=trip.start(back,false);for(let t=0;t<=duration;t+=.04){const s=trip.sampleAt(t);for(const side of [-28,28])for(const forward of [-54,54]){const x=s.position.x+side*Math.cos(s.heading)+forward*Math.sin(s.heading),z=s.position.z-side*Math.sin(s.heading)+forward*Math.cos(s.heading);assert(asphalt.some(r=>includes(r,x,z)),JSON.stringify({back,t,x,z}));}}}
});

test('Spatial collision probes match full building scans at cell boundaries and camera insets',()=>{
 const colliders=Array.from({length:90},(_,i)=>({x:(i%10)*137-800,z:Math.floor(i/10)*157-700,w:17+(i%6)*31,d:25+(i%7)*23})),index=createCollisionIndex(colliders);
 for(const inset of [0,6])for(let x=-1050;x<=800;x+=13)for(let z=-900;z<=900;z+=19)assert.equal(index.contains(x,z,inset),colliders.some(c=>Math.abs(x-c.x)<c.w-inset&&Math.abs(z-c.z)<c.d-inset));
 for(const c of colliders)assert.equal(index.contains(c.x+c.w,c.z),colliders.some(o=>Math.abs(c.x+c.w-o.x)<o.w&&Math.abs(c.z-o.z)<o.d));
});

test('Render quality responds to sustained slow frames without reacting to a single hitch',()=>{
 const policy=createFrameQuality();assert.equal(policy.update(100),null);for(let i=0;i<30;i++)policy.update(16.7);assert.equal(policy.ratio,.9);
 for(let i=0;i<120;i++)policy.update(35);assert(policy.ratio<.9&&policy.ratio>=.65);const lower=policy.ratio;
 for(let i=0;i<300;i++)policy.update(16.7);assert.equal(policy.ratio,lower,'Resolution recovery waits for sustained headroom');
 for(let i=0;i<400;i++)policy.update(16.7);assert(policy.ratio>lower);
 for(let i=0;i<1000;i++)policy.update(50);assert.equal(policy.ratio,.65);
});

test('The floor-21 colleague sits on the cushion and faces away from the sofa back',()=>{
 const previous=globalThis.document;globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){}})})};
 try{
  const blocks=[],origins={td:{x:-5000,z:2200,y:567}},scenes=createExperienceScenes({THREE,block:(...args)=>blocks.push(args),addToDistrict(){},roomOrigins:origins,wallPoster(){},chapters:{},boxGeometry:new THREE.BoxGeometry(1,1,1),registerLight(){}});scenes.buildRoom('td');
  const person=scenes.npcs.find(n=>n.id==='td-5'),sofa=OFFICE_LOUNGE,localZ=person.z-origins.td.z;
  assert.equal(person.x-origins.td.x,sofa.x);assert(localZ>sofa.z-sofa.depth/2&&localZ<sofa.backZ-5);assert((sofa.backZ-localZ)*Math.cos(person.group.rotation.y)<0,'The backrest is behind the seated character');
  const foot=localZ+Math.cos(person.group.rotation.y)*22;assert(foot<sofa.z-sofa.depth/2,'Feet extend in front of the sofa');
  assert(blocks.some(b=>b[0]===person.x&&b[1]===origins.td.y&&b[2]===origins.td.z+sofa.z&&b[4]===sofa.seatHeight));
 }finally{globalThis.document=previous;}
});


test('Walterdale deck and approach heights meet continuously above the river terrain',()=>{
 assert.equal(bridgeRoadHeight(370,-1740),BRIDGE_DECK);
 for(const sign of [-1,1]){const end=-1740+sign*235;assert.equal(bridgeRoadHeight(370,end),BRIDGE_DECK);assert.equal(bridgeRoadHeight(370,end+sign*80),ROAD_LEVELS.asphalt);assert(Math.abs(bridgeRoadHeight(370,end+sign*.001)-BRIDGE_DECK)<.001);assert.equal(bridgeRoadHeight(370,end+sign*81),null);}
 assert.equal(bridgeRoadHeight(500,-1740),null);
});
