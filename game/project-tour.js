export function createProjectTour({projects,ui=()=>{},onComplete=()=>{},seconds=12}){
 let active=false,completed=false,index=0,elapsed=0;
 const state=()=>({active,completed,index,total:projects.length,project:projects[index],remaining:Math.max(0,Math.ceil(seconds-elapsed))});
 const publish=()=>ui(state());
 function finish(){if(!active)return;active=false;completed=true;publish();onComplete();}
 function next(){if(!active)return;if(index===projects.length-1){finish();return;}index++;elapsed=0;publish();}
 return {start(){index=0;elapsed=0;completed=false;active=projects.length>0;publish();if(!active){completed=true;onComplete();}},next,previous(){if(!active)return;index=Math.max(0,index-1);elapsed=0;publish();},finish,close(){active=false;completed=false;publish();},update(dt,paused=false){if(!active||paused)return;const before=Math.ceil(seconds-elapsed);elapsed+=Math.max(0,dt);if(elapsed>=seconds)next();else if(before!==Math.ceil(seconds-elapsed))publish();},get state(){return state();}};
}
