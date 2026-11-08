export function createGuidedTour(api){
  let active=false,paused=false,index=0,entered=false,path=[],waypoint=0,elapsed=0,stuck=0,completed=false;
  const action=(label,run)=>({label,run});
  const walk=(label,route,arrival)=>({label,route,arrival});
  const story=(room,label)=>({label,seconds:11,run:()=>api.speak(room)});
  const wait=(label,until)=>({label,until});
  const steps=[
    action('01 · Welcome to my remote workspace',()=>api.travel('home')),
    walk('Follow the garden path into the house','home','home'),
    walk('Come around the desk and see what I’m building','room:home'),
    story('home','Space Copy · working remotely, thinking beyond Earth'),
    walk('Next stop: the University of Alberta','reverse:home'),
    action('A walk from home to campus',()=>api.exit()),
    walk('Follow the connected trail to campus','university','university'),
    walk('Meet me at the front of the computer lab','room:university'),
    story('university','University of Alberta · learn it, build it, explain it'),
    walk('Time to catch the Toronto flight','reverse:university'),
    action('Head to the departure gate',()=>api.exit()),
    walk('Campus → runway → departure apron','flight'),
    action('Boarding · Edmonton → Toronto',()=>api.fly('outbound')),
    wait('Runway takeoff, approach and landing in Toronto',()=>!api.state().flying),
    walk('Arrivals → downtown → TD Terrace','td','concourse'),
    walk('Through the concourse to the lifts','room:concourse'),
    action('The next chapter is on floor 21',()=>api.enterLift(0)),
    action('Going up · floor 21',()=>api.rideLift(21)),
    wait('Enjoy the ride to the office',()=>!api.state().riding&&api.state().room==='td'),
    walk('Meet me at my office workstation','room:td'),
    story('td','TD · build, test, investigate, repeat'),
    walk('One last coffee, then back to the lift','reverse:td'),
    action('Return to the concourse',()=>api.enterLift(21)),
    action('Going down · ground floor',()=>api.rideLift(0)),
    wait('Back to street level',()=>!api.state().riding&&api.state().room==='concourse'),
    action('Follow the trail back to the Toronto airstrip',()=>api.exit()),
    walk('Downtown → airport gate → Edmonton','return-flight'),
    action('Boarding · Toronto → Edmonton',()=>api.fly('return')),
    wait('A runway landing back in Edmonton',()=>!api.state().flying)
  ];
  const publish=()=>api.ui({active,paused,completed,index,total:steps.length,label:active?steps[index]?.label:completed?'Tour complete. Thanks for exploring my story.':'Explore at your own pace, or autoplay the full journey.'});
  function start(){if(api.state().flying||api.state().riding)return;api.clear();active=true;paused=false;completed=false;index=0;entered=false;publish();}
  function pause(){if(!active||paused)return;paused=true;api.clear();publish();}
  function resume(){if(!active||!paused)return;paused=false;api.clear();if(steps[index]?.route){path=api.route(steps[index].route);waypoint=0;stuck=0;}publish();}
  function stop(){active=false;paused=false;api.clear();publish();}
  function advance(){index++;entered=false;elapsed=stuck=0;if(index>=steps.length){active=false;completed=true;api.clear();}publish();}
  function update(dt){
    if(!active||paused)return;
    const step=steps[index];if(!step)return;
    if(!entered){entered=true;elapsed=stuck=0;waypoint=0;api.clear();if(step.route)path=api.route(step.route);step.run?.();publish();}
    if(step.until){if(step.until())advance();return;}
    if(step.seconds){elapsed+=dt;if(elapsed>=step.seconds)advance();return;}
    if(!step.route){advance();return;}
    if(step.arrival&&api.state().room===step.arrival){advance();return;}
    const p=api.state().position;
    while(waypoint<path.length&&Math.hypot(path[waypoint][0]-p.x,path[waypoint][1]-p.z)<10)waypoint++;
    if(waypoint===path.length){if(step.arrival)api.enter(step.arrival);advance();return;}
    const [x,z]=path[waypoint],dx=x-p.x,dz=z-p.z,distance=Math.hypot(dx,dz),speed=api.state().room?155:235;
    api.aim(x,z,dt);api.move(dx/distance*Math.min(distance,speed*dt),dz/distance*Math.min(distance,speed*dt));
    const after=api.state().position;stuck=Math.hypot(after.x-p.x,after.z-p.z)<.01?stuck+dt:0;
    if(stuck>1){pause();api.notify('Tour paused at an obstacle. You can explore, then resume.');}
  }
  return {start,pause,resume,stop,update,get state(){return {active,paused,completed,index,total:steps.length,label:steps[index]?.label};}};
}
