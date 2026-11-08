const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const point=(x,y,z)=>({x,y,z});
function line(a,b,t){return point(lerp(a.x,b.x,t),lerp(a.y,b.y,t),lerp(a.z,b.z,t));}
function bezier(a,b,c,d,t){const v=1-t;return point(v*v*v*a.x+3*v*v*t*b.x+3*v*t*t*c.x+t*t*t*d.x,v*v*v*a.y+3*v*v*t*b.y+3*v*t*t*c.y+t*t*t*d.y,v*v*v*a.z+3*v*v*t*b.z+3*v*t*t*c.z+t*t*t*d.z);}

// Both strips run north/south. Ground roll, rotation, aligned final, flare and
// rollout remain separate phases, so touchdown cannot become a vertical drop.
export function createFlightPlan({from,to,fromParking,toParking,reduced=false}) {
  const ground=30, start=point(fromParking.x,ground,fromParking.z);
  const hold=point(fromParking.x,ground,from.z+460), threshold=point(from.x,ground,from.z+460);
  const rotate=point(from.x,ground,from.z+100), airborne=point(from.x,72,from.z-120);
  const cruise=point(from.x,480,from.z-1050), approach=point(to.x,160,to.z+1400);
  const flare=point(to.x,48,to.z+480), touchdown=point(to.x,ground,to.z+330);
  const rollout=point(to.x,ground,to.z-280), turnoff=point(toParking.x,ground,to.z-280), parked=point(toParking.x,ground,toParking.z);
  const legs=[
    ['TAXI TO RUNWAY',3,t=>line(start,hold,smooth(t)),true],
    ['LINE UP',2,t=>bezier(hold,point(hold.x-70,ground,hold.z),point(threshold.x,ground,threshold.z+55),threshold,smooth(t)),true],
    ['TAKEOFF ROLL',3,t=>line(threshold,rotate,t*t),true],
    ['ROTATE',1.5,t=>line(rotate,airborne,t),false],
    ['CLIMB',3,t=>line(airborne,cruise,t),false],
    ['CRUISE',8,t=>bezier(cruise,point(from.x,570,from.z-2300),point(to.x,420,to.z+2700),approach,t),false],
    ['FINAL APPROACH',4,t=>line(approach,flare,t),false],
    ['FLARE / TOUCHDOWN',1.5,t=>{const p=line(flare,touchdown,t);p.y=lerp(flare.y,ground,1-(1-t)**2);return p;},false],
    ['LANDING ROLL',3,t=>line(touchdown,rollout,1-(1-t)**2),true],
    ['VACATE RUNWAY',2,t=>line(rollout,turnoff,smooth(t)),true],
    ['TAXI TO ARRIVALS',2,t=>line(turnoff,parked,smooth(t)),true]
  ];
  const scale=reduced?.32:1;let duration=0;
  const phases=legs.map(([name,length,path,grounded])=>{const start=duration;duration+=length*scale;return {name,start,duration:length*scale,path,grounded};});
  function sample(seconds){
    const elapsed=Math.max(0,Math.min(duration,seconds)),phase=phases.find(p=>elapsed<p.start+p.duration)||phases.at(-1);
    const t=Math.min(1,(elapsed-phase.start)/phase.duration),position=phase.path(t),a=phase.path(Math.max(0,t-.001)),b=phase.path(Math.min(1,t+.001));
    position.y=phase.grounded?ground:Math.max(ground,position.y);
    const dx=b.x-a.x,dz=b.z-a.z,horizontal=Math.hypot(dx,dz),heading=Math.atan2(-dx,-dz);
    const pitch=phase.grounded?0:Math.max(-.16,Math.min(.18,Math.atan2(b.y-a.y,horizontal)));
    const bank=phase.name==='CRUISE'&&!reduced?Math.sin(t*Math.PI*2)*.09:0;
    return {position,heading,pitch,bank,phase:phase.name,grounded:phase.grounded,progress:elapsed/duration,done:elapsed===duration};
  }
  return {duration,phases:phases.map(({name,start,duration,grounded})=>({name,start,duration,grounded})),sample};
}
