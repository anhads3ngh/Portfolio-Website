export const wrapAngle=angle=>Math.atan2(Math.sin(angle),Math.cos(angle));
export function turnTowards(current,target,dt,maxRate=.85){const delta=wrapAngle(target-current),step=Math.min(Math.abs(delta),Math.max(0,dt)*maxRate);return wrapAngle(current+Math.sign(delta)*step);}

// A cursor gesture has a fixed angular range. Repeated pointer events cannot
// accumulate revolutions, and entering/leaving a panel establishes a new baseline.
export function createPointerLook(){
  let anchor=null;
  return {
    reset(){anchor=null;},
    move({x,y,width,height,yaw,pitch,time}){
      if(!anchor||time-anchor.time>200){anchor={x,y,yaw,pitch,time,lastX:x,lastY:y};return null;}
      if(Math.abs(x-anchor.lastX)>110||Math.abs(y-anchor.lastY)>110){anchor={x,y,yaw,pitch,time,lastX:x,lastY:y};return null;}
      anchor.time=time;anchor.lastX=x;anchor.lastY=y;
      const horizontal=Math.max(-1.2,Math.min(1.2,(x-anchor.x)/Math.max(1,width)*2.2));
      const vertical=Math.max(-.65,Math.min(.65,(y-anchor.y)/Math.max(1,height)*1.2));
      return {yaw:wrapAngle(anchor.yaw-horizontal),pitch:Math.max(-.75,Math.min(.85,anchor.pitch-vertical))};
    }
  };
}

// Horizontal two-finger swipes orbit TPP; Shift lets a vertical swipe orbit too.
// The gesture chooses one axis and has no timer-driven angular momentum.
export function createTrackpadOrbit(){
  let last=-Infinity,axis=null;
  return {
    reset(){last=-Infinity;axis=null;},
    move({deltaX,deltaY,deltaMode=0,shiftKey=false,time,yaw}){
      const factor=deltaMode===1?16:deltaMode===2?300:1,dx=deltaX*factor,dy=deltaY*factor;
      if(time-last>180)axis=null;last=time;
      if(Math.hypot(dx,dy)<.5)return {orbit:false,yaw};
      if(shiftKey)axis='orbit';
      else if(!axis)axis=Math.abs(dx)>Math.abs(dy)*.75?'orbit':'walk';
      if(axis!=='orbit')return {orbit:false,yaw};
      const delta=shiftKey&&Math.abs(dy)>Math.abs(dx)?dy:dx;
      return {orbit:true,yaw:wrapAngle(yaw-Math.max(-55,Math.min(55,delta))*.005)};
    }
  };
}
