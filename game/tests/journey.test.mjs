import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlightPlan} from '../flight-path.js';
import {joinRoute,safeConnector} from '../journey-routes.js';
import {createGuidedTour} from '../guided-tour.js';

for(const back of [false,true])test(`${back?'Return':'Outbound'} aircraft rolls, flies an aligned final and vacates the runway`,()=>{
  const edmonton={x:1050,z:-350},toronto={x:5050,z:200};
  const plan=createFlightPlan({from:back?toronto:edmonton,to:back?edmonton:toronto,fromParking:back?{x:5280,z:450}:{x:1270,z:-350},toParking:back?{x:1270,z:-700}:{x:5280,z:-150}});
  const destination=back?edmonton:toronto;
  for(const phase of plan.phases){
    if(phase.start){const a=plan.sample(phase.start-1e-7).position,b=plan.sample(phase.start+1e-7).position;assert(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.01,phase.name+' is continuous');}
    for(let t=.05;t<1;t+=.1){const sample=plan.sample(phase.start+phase.duration*t);assert(sample.position.y>=30);if(phase.grounded)assert.equal(sample.position.y,30);}
  }
  for(const name of ['FINAL APPROACH','FLARE / TOUCHDOWN','LANDING ROLL']){
    const phase=plan.phases.find(p=>p.name===name),a=plan.sample(phase.start+phase.duration*.1),b=plan.sample(phase.start+phase.duration*.9);
    assert.equal(a.position.x,destination.x);assert.equal(b.position.x,destination.x);assert(b.position.z<a.position.z,'Aircraft travels along runway heading');assert(b.position.y<=a.position.y);assert(Math.abs(a.heading)<1e-7);
  }
  const landing=plan.phases.find(p=>p.name==='LANDING ROLL');assert.equal(plan.sample(landing.start).position.y,30);
  assert(Math.abs(plan.sample(landing.start).position.z-destination.z)<=500);
  const end=plan.sample(plan.duration);assert(end.done&&end.grounded);assert(Math.abs(end.position.x-destination.x)>180,'Aircraft parks off the runway');
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

test('Guided tour visits all chapters, pauses immediately, returns and replays',()=>{
  let room=null,flying=false,riding=false,wait=0,position={x:0,z:0};const spoken=[],flights=[];
  const tour=createGuidedTour({clear(){},notify(){},ui(){},travel(id){room=null;position={x:0,z:0};},exit(){room=null;},enter(id){room=id;},enterLift(){room='lift';},rideLift(floor){riding=true;room=floor===21?'td':'concourse';wait=3;},fly(direction){flights.push(direction);flying=true;wait=3;},speak(id){spoken.push(id);},route(){return [[position.x,position.z],[position.x+60,position.z]];},aim(){},move(x,z){position={x:position.x+x,z:position.z+z};},state:()=>({room,flying,riding,position:{...position}})});
  tour.start();tour.update(.1);tour.update(.1);tour.pause();const paused={...position};for(let i=0;i<20;i++)tour.update(.1);assert.deepEqual(position,paused);tour.resume();
  for(let i=0;i<3000&&tour.state.active;i++){if(wait&&!--wait){flying=false;riding=false;}tour.update(.1);}
  assert(tour.state.completed);assert.deepEqual(spoken,['home','university','td']);assert.deepEqual(flights,['outbound','return']);
  tour.start();assert.equal(tour.state.index,0);tour.stop();assert(!tour.state.active);
});
