import {AIRPORTS} from './world-layout.js?v=18';
export const EXPERIENCE_ROUTES={
 portal:[[0,550],[0,350],[0,210],[210,170]],
 home:[[-450,140],[-450,-30]],
 university:[[-450,20],[-450,120],[750,120],[750,73]],
 pickup:[[750,122],[500,122],[500,-150]],
 flight:[[-2050,-400],[-2100,-495],[-2100,-620],[-2250,-620],[-2380,-650]],
 'quad-return':[[500,-150],[500,120],[380,120]],
 'campus-return':[[-2265,-950],[-2265,-620],[-2250,-620],[-2100,-620],[-2100,-495],[-2050,-400]],
 td:[[5430,-50],[5430,200],[5500,200],[5680,200],[5680,420],[5680,960],[4500,960],[4500,-160]],
 'return-flight':[[4500,-140],[4500,960],[5680,960],[5680,420],[5680,200],[5500,200],[5430,200],[5430,480]]
};
export const ROOM_ROUTES={
  home:[[120,175],[0,150],[-150,120],[-150,100]],
  university:[[0,405],[0,-240]],
  concourse:[[0,275],[0,-230]],
  td:[[110,255],[0,180],[-230,120],[-230,25]]
};

// Join the nearest point on a corridor, rather than sending a visitor back to
// the corridor's beginning after an exit or a journey shortcut.
export function joinRoute(position,points){
  if(!points.length)return [];
  let best={distance:Infinity,index:0,point:points[0]};
  for(let i=0;i<points.length-1;i++){
    const [ax,az]=points[i],[bx,bz]=points[i+1],dx=bx-ax,dz=bz-az,length=dx*dx+dz*dz;
    const t=length?Math.max(0,Math.min(1,((position.x-ax)*dx+(position.z-az)*dz)/length)):0;
    const p=[ax+t*dx,az+t*dz],distance=Math.hypot(position.x-p[0],position.z-p[1]);
    if(distance<best.distance)best={distance,index:i,point:p};
  }
  return [[position.x,position.z],best.point,...points.slice(best.index+1)].filter((p,i,a)=>!i||Math.hypot(p[0]-a[i-1][0],p[1]-a[i-1][1])>1);
}

// A bounded grid search is used only when joining a corridor would cross a
// wall or water. Normal frames and routes incur no pathfinding cost.
export function safeConnector(start,end,blocked,step=24){
  const clear=(a,b)=>{const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/8);for(let i=0;i<=n;i++){const t=n?i/n:0;if(blocked(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t))return false;}return true;};
  if(clear(start,end))return [start,end];
  const origin=start,key=(x,z)=>x+','+z,goal={x:Math.round((end[0]-origin[0])/step),z:Math.round((end[1]-origin[1])/step)};
  const first={x:0,z:0,g:0,h:Math.hypot(goal.x,goal.z),parent:null},open=[first],seen=new Map([[key(0,0),0]]);
  for(let count=0;open.length&&count<7000;count++){
    open.sort((a,b)=>(a.g+a.h)-(b.g+b.h));const node=open.shift(),p=[origin[0]+node.x*step,origin[1]+node.z*step];
    if(Math.hypot(p[0]-end[0],p[1]-end[1])<step*1.6&&clear(p,end)){
      const path=[end];for(let n=node;n;n=n.parent)path.push([origin[0]+n.x*step,origin[1]+n.z*step]);path.reverse();
      const simplified=[path[0]];for(let i=1;i<path.length;){let j=path.length-1;while(j>i&&!clear(simplified.at(-1),path[j]))j--;simplified.push(path[j]);i=j+1;}return simplified;
    }
    for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){
      const x=node.x+dx,z=node.z+dz,g=node.g+1,k=key(x,z),q=[origin[0]+x*step,origin[1]+z*step];
      if(g>180||seen.get(k)<=g||!clear(p,q))continue;
      seen.set(k,g);open.push({x,z,g,h:Math.hypot(goal.x-x,goal.z-z),parent:node});
    }
  }
  return [];
}
