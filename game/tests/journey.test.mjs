import test from 'node:test';
import assert from 'node:assert/strict';
import {AIRPORTS,AIRPORT_DRIVE,inDriveCorridor,inAirportLand,inNeighbourhood,RESIDENTIAL_HOMES} from '../world-layout.js';
import {feedbackMailto,FEEDBACK_EMAIL} from '../game-flow.js';
import * as THREE from '../vendor/three.module.min.js';
import {createAirportTransfer} from '../airport-transfer.js';
import {createFlightPlan} from '../flight-path.js';
import {joinRoute,safeConnector,EXPERIENCE_ROUTES} from '../journey-routes.js';
import {createGuidedTour} from '../guided-tour.js';
import {landscapeHeight,MOUNTAIN_PEAKS} from '../flight-world.js';
import {CITY_CITIZENS,CITY_LANDMARKS,CITY_FLIGHT_OBSTACLES,CITY_TRAFFIC,CAMPUS_BUILDINGS,CAMPUS_ROADS,VEHICLE_DIMENSIONS,cityRiver,inEdmontonCity} from '../city-layout.js';
import {inAirfield,onRunway,routeAvoidsAirfields,trafficPosition,createAirspaceAudit} from '../airspace.js';
import {createPointerLook,createTrackpadOrbit,turnTowards,wrapAngle} from '../camera-controls.js';

for(const back of [false,true])test(`${back?'Return':'Outbound'} aircraft rolls, flies an aligned final and vacates the runway`,()=>{
  const edmonton=AIRPORTS.edmonton,toronto=AIRPORTS.toronto;
  const plan=createFlightPlan({from:back?toronto:edmonton,to:back?edmonton:toronto,fromParking:(back?toronto:edmonton).parking,toParking:(back?edmonton:toronto).arrivalParking});
  const destination=back?edmonton:toronto;
  for(const phase of plan.phases){
    if(phase.start){const a=plan.sample(phase.start-1e-7).position,b=plan.sample(phase.start+1e-7).position;assert(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.01,phase.name+' is continuous');}
    for(let t=.05;t<1;t+=.1){const sample=plan.sample(phase.start+phase.duration*t);assert(sample.position.y>=30);if(phase.grounded)assert.equal(sample.position.y,30);}
  }
  for(const name of ['FINAL APPROACH','FLARE / TOUCHDOWN','LANDING ROLL']){
    const phase=plan.phases.find(p=>p.name===name),a=plan.sample(phase.start+phase.duration*.1),b=plan.sample(phase.start+phase.duration*.9);
    assert.equal(a.position.x,destination.x);assert.equal(b.position.x,destination.x);assert(b.position.z<a.position.z,'Aircraft travels along runway heading');assert(b.position.y<=a.position.y);assert(Math.abs(a.heading)<1e-7);
  }
  for(const name of ['ROTATE','CLIMB','CRUISE','FINAL APPROACH','FLARE / TOUCHDOWN','LANDING ROLL']){const phase=plan.phases.find(p=>p.name===name),a=plan.sample(phase.start-.005),b=plan.sample(phase.start+.005);assert(Math.abs(a.speed-b.speed)/Math.max(a.speed,b.speed)<.25,name+' preserves flight speed across phase boundaries');}
  const landing=plan.phases.find(p=>p.name==='LANDING ROLL');assert.equal(plan.sample(landing.start).position.y,30);
  assert(Math.abs(plan.sample(landing.start).position.z-destination.z)<=500);
  const end=plan.sample(plan.duration);assert(end.done&&end.grounded);assert(Math.abs(end.position.x-destination.x)>180,'Aircraft parks off the runway');
  for(let t=0;t<=plan.duration;t+=.1){const p=plan.sample(t).position;assert(p.x>=-5600&&p.x<=10000&&p.z>=-6000&&p.z<=6000,'Entire flight has terrain beneath it');assert(landscapeHeight(p.x,p.z)<p.y,'Background terrain clears the aircraft');for(const b of CITY_FLIGHT_OBSTACLES)assert(!(Math.abs(p.x-b.x)<b.w/2+95&&Math.abs(p.z-b.z)<b.d/2+75&&p.y<b.height+30&&p.y+30>b.minY),'Aircraft and wing clearance around city towers');}
});

test('A corridor join advances from the visitor’s nearest point',()=>{
  assert.deepEqual(joinRoute({x:60,z:20},[[0,0],[100,0],[100,100]]),[[60,20],[60,0],[100,0],[100,100]]);
});

test('A trail connector routes around a wall and water',()=>{
  const blocked=(x,z)=>(x>40&&x<90&&z> -45&&z<45)||Math.abs(x)>200||Math.abs(z)>150;
  const path=safeConnector([0,0],[140,0],blocked,20);assert(path.length>2);
  for(let i=1;i<path.length;i++)for(let t=0;t<=1;t+=.01)assert(!blocked(path[i-1][0]+(path[i][0]-path[i-1][0])*t,path[i-1][1]+(path[i][1]-path[i-1][1])*t));
  assert.deepEqual(safeConnector([0,0],[100,0],()=>true),[]);
});

function harness(){
  let room=null,flying=false,riding=false,driving=false,wait=0,position={x:0,z:0},lastRoute='',routeEnd;const spoken=[],flights=[],drives=[],exits=[],travels=[];
  const tour=createGuidedTour({clear(){},dismiss(){},notify(){},ui(){},travel(id){travels.push(id);room=null;position={x:0,z:0};},exit(){exits.push(lastRoute);assert(Math.hypot(position.x-routeEnd[0],position.z-routeEnd[1])<10);room=null;},enter(id){room=id;},enterLift(){room='lift';},rideLift(floor){riding=true;room=floor===21?'td':'concourse';wait=3;},fly(direction){flights.push(direction);flying=true;room=null;wait=3;},drive(back){drives.push(back);driving=true;room=null;wait=3;},speak(id,topic){spoken.push({id,topic});},route(id){lastRoute=id;routeEnd=[position.x+60,position.z];return [[position.x,position.z],routeEnd];},aim(){},move(x,z){position={x:position.x+x,z:position.z+z};},state:()=>({room,flying,riding,driving,position:{...position}})});
  const tick=()=>{if(wait&&!--wait){flying=false;riding=false;driving=false;}tour.update(.1);};
  const until=predicate=>{for(let i=0;i<10000&&!predicate();i++)tick();assert(predicate(),'Expected tour state reached');};
  return {tour,tick,until,spoken,flights,drives,exits,travels,get position(){return {...position};}};
}

test('Autoplay visits all three chapters, tells all topics, physically exits, flies home and replays',()=>{
  const h=harness();h.tour.start();h.tick();h.tick();h.tour.pause();const p=h.position;for(let i=0;i<20;i++)h.tick();assert.deepEqual(h.position,p);h.tour.resume();h.until(()=>h.tour.state.completed);
  assert.deepEqual(h.spoken.map(s=>s.id),['home','home','home','university','university','university','td','td','td']);
  for(const id of ['home','university','td'])assert.deepEqual(h.spoken.filter(s=>s.id===id).map(s=>s.topic),['intro','work','lesson']);
  assert.deepEqual(h.flights,['outbound','return']);assert.deepEqual(h.drives,[false,true]);assert.deepEqual(h.exits,['exit:home','exit:university','exit:td','exit:concourse']);assert.deepEqual(h.tour.state.finished,['home','university','td']);
  h.tour.start();assert.equal(h.tour.state.index,0);assert.deepEqual(h.tour.state.finished,[]);h.tour.stop();assert(!h.tour.state.active);
});

test('Done and skip continue to the next chapter without ending the guided session',()=>{
  const h=harness();h.tour.start();h.until(()=>h.tour.state.kind==='story');h.tour.pause('interaction');h.tick();assert(h.tour.state.paused);h.tour.finishChapter();assert(h.tour.state.active&&!h.tour.state.paused);assert.equal(h.tour.state.kind,'leave');
  h.until(()=>h.tour.state.kind==='story'&&h.tour.state.chapter==='university');h.tour.skip();assert.deepEqual(h.tour.state.skipped,['university']);
  h.until(()=>h.tour.state.kind==='story'&&h.tour.state.chapter==='td');h.tour.pause('interaction');h.tour.finishChapter();h.until(()=>h.tour.state.completed);
  assert.deepEqual(h.tour.state.finished,['home','university','td']);assert.deepEqual(h.flights,['outbound','return']);
});

test('Choosing a later chapter continues the remaining journey instead of restarting home',()=>{
  const h=harness();h.tour.start();h.tour.selectChapter('university');h.until(()=>h.tour.state.completed);assert.deepEqual(h.travels,['university']);assert.deepEqual(h.tour.state.finished,['university','td']);assert.deepEqual(h.flights,['outbound','return']);
});

test('Interaction pause can resume; an explicit manual pause stays paused',()=>{
  const h=harness();h.tour.start();h.tour.pause('interaction');h.tour.resumeInteraction();assert(!h.tour.state.paused);h.tour.pause('manual');h.tour.pause('interaction');h.tour.resumeInteraction();assert(h.tour.state.paused);assert.equal(h.tour.state.pauseReason,'manual');
});

test('Pointer look stays bounded through repeated events, resets safely, and never accumulates a revolution',()=>{
  const controls=createPointerLook(),base={width:1000,height:800,yaw:2.9,pitch:0};let angle=base.yaw;
  controls.move({...base,x:500,y:400,time:0});
  for(let i=1;i<5000;i++){const view=controls.move({...base,yaw:angle,x:500+Math.sin(i*.03)*480,y:400+Math.sin(i*.02)*300,time:i*8});if(view){angle=view.yaw;assert(Math.abs(wrapAngle(angle-base.yaw))<=1.20001);assert(Math.abs(view.pitch)<=.65);}}
  controls.reset();assert.equal(controls.move({...base,x:20,y:40,time:50000}),null);assert.equal(controls.move({...base,x:900,y:700,time:50008}),null,'Pointer warps establish a baseline without rotation');
  const turn=turnTowards(Math.PI-.02,-Math.PI+.02,.1,1);assert(Math.abs(wrapAngle(turn-(Math.PI-.02)))<.05,'Tour uses the short turn across angle wrap');
});

test('Mountain ranges have snowy-height peaks beyond the protected runway corridors',()=>{
  assert(MOUNTAIN_PEAKS.length>=5);for(const peak of MOUNTAIN_PEAKS)assert(landscapeHeight(peak.x,peak.z)>600);assert.equal(landscapeHeight(5050,1600),-30);
});


test('Deliberate TPP trackpad gestures can orbit through full revolutions without a position command',()=>{
  const control=createTrackpadOrbit();let yaw=0,total=0;
  for(let i=0;i<120;i++){const result=control.move({deltaX:12,deltaY:.4,time:i*8,yaw});assert(result.orbit);total+=wrapAngle(result.yaw-yaw);yaw=result.yaw;}
  assert(Math.abs(total)>Math.PI*2,'Intentional horizontal swipes complete a full 360 turn');
  const walk=control.move({deltaX:.1,deltaY:20,time:2000,yaw});assert(!walk.orbit);assert.equal(walk.yaw,yaw,'Vertical gestures preserve walking');
  const shifted=control.move({deltaX:0,deltaY:25,shiftKey:true,time:2300,yaw});assert(shifted.orbit);assert.notEqual(shifted.yaw,yaw,'Shift enables orbit using a vertical swipe');
  control.reset();const zero=control.move({deltaX:0,deltaY:0,time:3000,yaw});assert(!zero.orbit);assert.equal(zero.yaw,yaw,'There is no autonomous rotation');
});

test('City landmarks and stationary citizens stay in their intended districts',()=>{
  assert.equal(CITY_CITIZENS.length,35);assert.equal(new Set(CITY_CITIZENS.map(c=>c.id)).size,35);
  for(const c of CITY_CITIZENS){assert(c.message&&c.name);assert(c.zone==='toronto'?c.x>=3700&&c.x<=6020&&Math.abs(c.z)<1060:Math.abs(c.x)<=1450&&Math.abs(c.z)<=1450||inEdmontonCity(c.x,c.z)||inAirportLand(c.x,c.z)||inNeighbourhood(c.x,c.z));assert(!cityRiver(c.x,c.z),'Citizens are not in the river');}
  const b=CITY_LANDMARKS.walterdale;assert(cityRiver(b.x,b.z));assert(b.length>400&&b.archHeight>100);assert(CITY_LANDMARKS.cnTower.height>800);
});


test('Pedestrians and every traffic route remain outside runway, taxiway and apron bounds',()=>{
 for(const c of CITY_CITIZENS)assert(!inAirfield(c.x,c.z,20),c.id);
 for(const route of CITY_TRAFFIC){assert(routeAvoidsAirfields(route),route.id);for(let t=0;t<500;t+=.37){const p=trafficPosition(route,t);assert(!inAirfield(p.x,p.z,route.axis==='x'?route.dimensions.length/2:route.dimensions.width/2,route.axis==='x'?route.dimensions.width/2:route.dimensions.length/2),route.id);}}
 assert(!routeAvoidsAirfields({...CITY_TRAFFIC[0],x:5050,z:620,length:400}),'A route crossing a runway must fail validation');
});

test('Cars have passenger-car proportions relative to the 75.7-unit explorer',()=>{
 const c=VEHICLE_DIMENSIONS.car;assert(c.length>75.7*2);assert(c.width>21.9*2.5);assert(c.height>75.7*.75&&c.height<75.7);assert(VEHICLE_DIMENSIONS.bus.height>75.7);
});

test('Seven campus buildings leave the airfield and connected journey corridors clear',()=>{
 assert.equal(CAMPUS_BUILDINGS.length,7);for(const b of CAMPUS_BUILDINGS){assert(!inAirfield(b.x,b.z,b.w/2,b.d/2));assert(b.z+b.d/2<0);assert(b.height>100);}
 assert.equal(CAMPUS_ROADS.length,2);
});

test('Flight audit catches actual mesh-sized obstacles and respects the aircraft component shapes',()=>{
 const plan={duration:1,sample(){return {position:{x:0,y:30,z:0},heading:0,pitch:0,bank:0,phase:'TAXI TO RUNWAY'};}};
 assert(createAirspaceAudit([[0,30,0,15,60,15]])(plan).length>0,'Fuselage hitting a building is detected');
 assert(createAirspaceAudit([[80,27,5,10,8,10]])(plan).length>0,'Wing clearance is checked');
 assert.equal(createAirspaceAudit([[80,4,5,5,6,5]])(plan).length,0,'A low light beneath a wing is not a tall obstacle');
 assert.equal(createAirspaceAudit([[0,1,0,500,2,1000]])(plan).length,0,'Runway contact is permitted');
});


test('Passenger trails go around runway thresholds instead of crossing the active strip',()=>{
 for(const id of ['flight','campus-return','td','return-flight']){const points=EXPERIENCE_ROUTES[id];for(let i=1;i<points.length;i++)for(let t=0;t<=1;t+=.01){const x=points[i-1][0]+(points[i][0]-points[i-1][0])*t,z=points[i-1][1]+(points[i][1]-points[i-1][1])*t;assert(!onRunway(x,z,12),id+' crosses a runway');}}
});


test('The airport is separated from campus and the car follows the access road in both directions',()=>{
 assert(Math.hypot(AIRPORTS.edmonton.x-750,AIRPORTS.edmonton.z+37.5)>3000);assert.equal(RESIDENTIAL_HOMES.length,9);
 const trip=createAirportTransfer({THREE,boxGeometry:new THREE.BoxGeometry(1,1,1),addToDistrict(){}});
 for(const back of [false,true]){trip.start(back,true);let sample;for(let t=0;t<9;t+=.04){sample=trip.update(.04);assert(inDriveCorridor(sample.position.x,sample.position.z,2));if(sample.done)break;}assert(sample.done);const end=back?AIRPORT_DRIVE[0]:AIRPORT_DRIVE.at(-1);assert(Math.hypot(sample.position.x-end[0],sample.position.z-end[1])<.1);trip.finish();}
});

test('Feedback drafts preserve the sender email and message and target the portfolio email',()=>{
 const uri=feedbackMailto('visitor@example.com','More paths, please! & a café.');assert(uri.startsWith('mailto:'+FEEDBACK_EMAIL+'?'));const query=new URLSearchParams(uri.split('?')[1]);assert.equal(query.get('subject'),'Anhad’s World — visitor feedback');assert(query.get('body').includes('Sender email: visitor@example.com'));assert(query.get('body').includes('More paths, please! & a café.'));
});
