const lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>t*t*(3-2*t),point=(x,y,z)=>({x,y,z});
function line(a,b,t){return point(lerp(a.x,b.x,t),lerp(a.y,b.y,t),lerp(a.z,b.z,t));}
function bezier(a,b,c,d,t){const v=1-t;return point(v*v*v*a.x+3*v*v*t*b.x+3*v*t*t*c.x+t*t*t*d.x,v*v*v*a.y+3*v*v*t*b.y+3*v*t*t*c.y+t*t*t*d.y,v*v*v*a.z+3*v*v*t*b.z+3*v*t*t*c.z+t*t*t*d.z);}
function hermite(a,b,startVelocity,endVelocity,duration,t){const t2=t*t,t3=t2*t;return (2*t3-3*t2+1)*a+(t3-2*t2+t)*startVelocity*duration+(-2*t3+3*t2)*b+(t3-t2)*endVelocity*duration;}
function arcPath(path,startSpeed,endSpeed,duration){
  const points=Array.from({length:301},(_,i)=>path(i/300)),lengths=[0];
  for(let i=1;i<points.length;i++)lengths.push(lengths.at(-1)+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y,points[i].z-points[i-1].z));
  const length=lengths.at(-1);
  return t=>{const distance=Math.max(0,Math.min(length,hermite(0,length,startSpeed,endSpeed,duration,t)));let lo=0,hi=300;while(lo+1<hi){const mid=(lo+hi)>>1;if(lengths[mid]<distance)lo=mid;else hi=mid;}const u=(distance-lengths[lo])/Math.max(.00001,lengths[hi]-lengths[lo]);return path((lo+u)/300);};
}

export function createFlightPlan({from,to,fromParking,toParking,reduced=false}){
  const ground=30,start=point(fromParking.x,ground,fromParking.z),hold=point(fromParking.x,ground,from.z+460),threshold=point(from.x,ground,from.z+460);
  const rotate=point(from.x,ground,from.z+100),airborne=point(from.x,72,from.z-120),cruise=point(from.x,650,from.z-1800),approach=point(to.x,160,to.z+1400);
  const flare=point(to.x,48,to.z+480),touchdown=point(to.x,ground,to.z+330),rollout=point(to.x,ground,to.z-280),turnoff=point(toParking.x,ground,to.z-280),parked=point(toParking.x,ground,toParking.z);
  const cruisePath=arcPath(t=>bezier(cruise,point(from.x,650,from.z-2700),point(to.x,294,to.z+2500),approach,t),250,232,18);
  const legs=[
    ['TAXI TO RUNWAY',3,t=>line(start,hold,smooth(t)),true],
    ['LINE UP',2,t=>bezier(hold,point(hold.x-70,ground,hold.z),point(threshold.x,ground,threshold.z+55),threshold,smooth(t)),true],
    ['TAKEOFF ROLL',3.2,t=>line(threshold,rotate,t*t),true],
    ['ROTATE',1.2,t=>point(from.x,hermite(30,72,0,60,1.2,t),hermite(rotate.z,airborne.z,-225,-220,1.2,t)),false],
    ['CLIMB',7,t=>point(from.x,hermite(72,650,60,0,7,t),hermite(airborne.z,cruise.z,-220,-250,7,t)),false],
    ['CRUISE',18,cruisePath,false],
    ['FINAL APPROACH',4,t=>line(approach,flare,t),false],
    ['FLARE / TOUCHDOWN',1,t=>point(to.x,hermite(48,30,-28,0,1,t),hermite(flare.z,touchdown.z,-230,-160,1,t)),false],
    ['LANDING ROLL',6,t=>point(to.x,30,hermite(touchdown.z,rollout.z,-160,0,6,t)),true],
    ['VACATE RUNWAY',2,t=>line(rollout,turnoff,smooth(t)),true],
    ['TAXI TO ARRIVALS',2,t=>line(turnoff,parked,smooth(t)),true]
  ];
  const scale=reduced?.27:1;let duration=0;
  const phases=legs.map(([name,length,path,grounded])=>{const start=duration;duration+=length*scale;return {name,start,duration:length*scale,path,grounded};});
  function sample(seconds){
    const elapsed=Math.max(0,Math.min(duration,seconds)),phase=phases.find(p=>elapsed<p.start+p.duration)||phases.at(-1),t=Math.min(1,(elapsed-phase.start)/phase.duration);
    const ta=Math.max(0,t-.0005),tb=Math.min(1,t+.0005),position=phase.path(t),a=phase.path(ta),b=phase.path(tb),span=Math.max(.000001,(tb-ta)*phase.duration);
    position.y=phase.grounded?ground:Math.max(ground,position.y);
    const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,speed=Math.hypot(dx,dy,dz)/span,heading=Math.atan2(-dx,-dz);
    const pitch=phase.grounded?0:Math.max(-.2,Math.min(.32,Math.atan2(dy,Math.hypot(dx,dz))));
    const before=phase.path(Math.max(0,t-.002)),after=phase.path(Math.min(1,t+.002)),headingA=Math.atan2(-(position.x-before.x),-(position.z-before.z)),headingB=Math.atan2(-(after.x-position.x),-(after.z-position.z));
    const turn=Math.atan2(Math.sin(headingB-headingA),Math.cos(headingB-headingA));
    const bank=phase.name==='CRUISE'&&!reduced?Math.max(-.14,Math.min(.14,-Math.atan(speed*turn/Math.max(.01,phase.duration*.002)/580))):0;
    return {position,heading,pitch,bank,speed,phase:phase.name,grounded:phase.grounded,progress:elapsed/duration,done:elapsed===duration};
  }
  return {duration,phases:phases.map(({name,start,duration,grounded})=>({name,start,duration,grounded})),sample};
}
