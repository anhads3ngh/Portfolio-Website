export function createGuidedTour(api){
  let active=false,paused=false,reason=null,index=0,entered=false,path=[],waypoint=0,elapsed=0,stuck=0,completed=false,storyTopic='';
  const visited=new Set(),finished=new Set(),skipped=new Set(),order=['home','university','td'];
  const action=(label,run)=>({label,run,kind:'action'}),walk=(label,route,arrival)=>({label,route,arrival,kind:'walk'});
  const leave=(label,room)=>({label,route:'exit:'+room,leaving:room,kind:'leave'});
  const story=(room,label)=>({label,seconds:32,story:room,kind:'story',run:()=>{storyTopic='intro';visited.add(room);api.speak(room,'intro');}});
  const wait=(label,until,tag)=>({label,until,tag,kind:'wait'}),chapter=(id,steps)=>steps.map(step=>({...step,chapter:id}));
  const steps=[
    ...chapter('home',[
      action('01 · Welcome to my remote workspace',()=>api.travel('home')),
      walk('Follow the garden path into the house','home','home'),
      walk('Meet me at my workstation','room:home'),
      story('home','Space Copy · a remote internship with an aerospace horizon'),
      leave('Leave through the front door, then walk to campus','home')
    ]),
    ...chapter('university',[
      walk('Home → University of Alberta','university','university'),
      walk('Follow the centre aisle to the teaching desk','room:university'),
      story('university','University of Alberta · learning, teaching and mentoring'),
      leave('Walk out of the lab and head to departures','university'),
      walk('Campus → departure apron','flight'),
      action('Boarding · Edmonton → Toronto',()=>api.fly('outbound')),
      wait('A runway takeoff and a flight through the mountains',()=>!api.state().flying,'outbound-arrival')
    ]),
    ...chapter('td',[
      walk('Toronto arrivals → TD Terrace','td','concourse'),
      walk('Through the concourse to the lifts','room:concourse'),
      action('The office is on floor 21',()=>api.enterLift(0)),
      action('Going up · floor 21',()=>api.rideLift(21)),
      wait('Arriving at the office',()=>!api.state().riding&&api.state().room==='td','office-arrival'),
      walk('Meet me at my office desk','room:td'),
      story('td','TD · automation, investigations and reliable workflows'),
      leave('Leave the office through the lift entrance','td'),
      action('Return to the lift',()=>api.enterLift(21)),
      action('Going down · ground floor',()=>api.rideLift(0)),
      wait('Back to the concourse',()=>!api.state().riding&&api.state().room==='concourse','concourse-arrival'),
      leave('Walk outside and follow the airport trail','concourse'),
      walk('Downtown → Toronto airstrip','return-flight'),
      action('Boarding · Toronto → Edmonton',()=>api.fly('return')),
      wait('Landing back in Edmonton',()=>!api.state().flying,'return-arrival')
    ])
  ];
  const find=predicate=>steps.findIndex(predicate);
  const state=()=>({active,paused,pauseReason:reason,completed,index,total:steps.length,label:steps[index]?.label,chapter:steps[index]?.chapter,kind:steps[index]?.kind,route:steps[index]?.route,visited:[...visited],finished:[...finished],skipped:[...skipped]});
  const publish=()=>api.ui({...state(),label:active?steps[index]?.label:completed?(finished.size===3?'All three chapters explored. Welcome back to Edmonton.':finished.size+' chapter'+(finished.size===1?'':'s')+' explored. Welcome back to Edmonton.'):'Explore freely, or autoplay all three connected experiences.'});
  function go(next){index=next;entered=false;elapsed=stuck=0;path=[];waypoint=0;paused=false;reason=null;api.clear();api.dismiss?.();publish();}
  function start(){if(api.state().flying||api.state().riding)return;active=true;completed=false;visited.clear();finished.clear();skipped.clear();go(0);}
  function pause(why='manual'){if(!active)return;if(paused&&reason==='manual'&&why==='interaction')return;paused=true;reason=why;api.clear();publish();}
  function resume(){if(!active||!paused)return;paused=false;reason=null;api.clear();if(steps[index]?.route){path=api.route(steps[index].route);waypoint=0;stuck=0;}publish();}
  function resumeInteraction(){if(active&&paused&&reason==='interaction')resume();}
  function stop(){active=false;paused=false;reason=null;api.clear();publish();}
  function advance(){index++;entered=false;elapsed=stuck=0;if(index>=steps.length){active=false;completed=true;api.clear();api.dismiss?.();}publish();}
  function finishChapter(wasSkipped=false){
    if(!active||api.state().flying||api.state().riding)return false;
    const room=api.state().room,id=order.includes(room)?room:steps[index]?.chapter;
    if(!id)return false;finished.add(id);if(wasSkipped)skipped.add(id);
    if(order.includes(room)){visited.add(room);go(find(s=>s.leaving===room));}
    else if(room==='concourse')go(find(s=>s.leaving==='concourse'));
    else if(room==='lift'){resume();return false;}
    else if(id==='home')go(find(s=>s.route==='university'));
    else if(id==='university')go(find(s=>s.route==='flight'));
    else go(find(s=>s.route==='return-flight'));
    return true;
  }
  function selectChapter(id){
    if(!order.includes(id)||api.state().flying||api.state().riding)return;
    active=true;completed=false;paused=false;reason=null;api.clear();api.dismiss?.();api.travel(id);
    go(find(s=>s.arrival===(id==='td'?'concourse':id)));
  }
  function board(direction){if(!active||api.state().flying||api.state().riding)return;go(find(s=>s.tag===(direction==='return'?'return-arrival':'outbound-arrival')));api.fly(direction);}
  function rideTo(to){if(!active||api.state().flying||api.state().riding)return;go(find(s=>s.tag===(to===21?'office-arrival':'concourse-arrival')));api.enterLift(to===21?0:21);api.rideLift(to);}
  function arrive(room){if(!active)return;if(order.includes(room))go(find(s=>s.route===(finished.has(room)?'exit:':'room:')+room));else if(room==='concourse')go(find(s=>s.route===(visited.has('td')?'exit:concourse':'room:concourse')));}
  function update(dt){
    if(!active||paused)return;
    const step=steps[index];if(!step)return;
    const current=api.state();if(order.includes(current.room))visited.add(current.room);
    if(!entered){entered=true;elapsed=stuck=0;waypoint=0;api.clear();if(step.route)path=api.route(step.route);step.run?.();publish();}
    if(step.until){if(step.until())advance();return;}
    if(step.seconds){
      elapsed+=dt;const topic=elapsed<6?'intro':elapsed<20?'work':'lesson';if(topic!==storyTopic){storyTopic=topic;api.speak(step.story,topic);}
      if(elapsed>=step.seconds){finished.add(step.story);api.dismiss?.();advance();}return;
    }
    if(!step.route){advance();return;}
    if(step.leaving&&api.state().room!==step.leaving){advance();return;}
    if(step.arrival&&api.state().room===step.arrival){advance();return;}
    if(!path.length){pause('obstacle');api.notify('The route is blocked. Choose a chapter to continue, or explore freely.');return;}
    const p=api.state().position;
    while(waypoint<path.length&&Math.hypot(path[waypoint][0]-p.x,path[waypoint][1]-p.z)<10)waypoint++;
    if(waypoint===path.length){if(step.leaving)api.exit();if(step.arrival)api.enter(step.arrival);advance();return;}
    const [x,z]=path[waypoint],dx=x-p.x,dz=z-p.z,distance=Math.hypot(dx,dz),speed=api.state().room?145:225;
    api.aim(x,z,dt);api.move(dx/distance*Math.min(distance,speed*dt),dz/distance*Math.min(distance,speed*dt));
    const after=api.state().position;stuck=Math.hypot(after.x-p.x,after.z-p.z)<.01?stuck+dt:0;
    if(stuck>1){pause('obstacle');api.notify('Tour paused at an obstacle. Resume or choose the next experience.');}
  }
  return {start,pause,resume,resumeInteraction,stop,update,finishChapter,skip:()=>finishChapter(true),selectChapter,board,rideTo,arrive,get state(){return state();}};
}
