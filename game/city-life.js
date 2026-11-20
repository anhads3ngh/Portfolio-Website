import {CITY_CITIZENS} from './city-layout.js?v=25';
import {citizenPlacement} from './walking-surfaces.js?v=25';
export function createCityLife({THREE,boxGeometry,addToDistrict,groundAt,blocked=()=>false}){
  const dummy=new THREE.Object3D(),material=new THREE.MeshLambertMaterial({color:'#ffffff'}),citizens=[],regions=new Map(),matrix=new THREE.Matrix4();
  for(const [i,source]of CITY_CITIZENS.entries()){
    const data=citizenPlacement(source,{groundAt,blocked});if(!data)continue;
    const parts=[],skin=['#bd8d69','#805b45','#e0b99a','#ad7859'][i%4],shirt=['#5c7d81','#927b9d','#aa7856','#708d63','#3f6178'][i%5],p=(x,y,z,w,h,d,c)=>parts.push({x,y:y+h/2,z,w,h,d,c});
    for(const s of [-1,1]){p(s*6,5,0,9,23,11,'#3c4c5c');p(s*6,0,3,10,6,16,'#293a38');p(s*17,32,0,8,24,10,shirt);p(s*17,27,1,8,8,10,skin);}
    p(0,28,0,26,29,18,shirt);p(0,57,0,20,20,19,skin);p(0,74,-1,22,7,21,i%3?'#343832':'#776246');p(-5,66,10,3,3,2,'#223c3b');p(5,66,10,3,3,2,'#223c3b');p(0,60,10,6,2,1,'#774f43');
    if(i%4===0){p(0,76,0,25,5,24,'#bda875');p(0,80,-1,19,5,17,'#bda875');}if(i%5===0)p(0,35,-12,20,22,8,'#a48a62');
    const group=new THREE.Group();group.position.set(data.x,data.y,data.z);group.rotation.y=(i%4)*Math.PI/2;addToDistrict(group,data.zone);
    if(!regions.has(data.zone))regions.set(data.zone,{citizens:[],count:0});const region=regions.get(data.zone),citizen={...data,group,parts,offset:region.count,region};region.count+=parts.length;region.citizens.push(citizen);citizens.push(citizen);
  }
  function writeCitizen(c){
    c.group.updateMatrix();
    for(const [i,q]of c.parts.entries()){dummy.position.set(q.x,q.y,q.z);dummy.scale.set(c.group.visible?q.w:0,c.group.visible?q.h:0,c.group.visible?q.d:0);dummy.rotation.set(0,0,0);dummy.updateMatrix();matrix.multiplyMatrices(c.group.matrix,dummy.matrix);c.region.mesh.setMatrixAt(c.offset+i,matrix);}
    c.region.mesh.instanceMatrix.needsUpdate=true;
  }
  for(const [zone,region]of regions){const mesh=new THREE.InstancedMesh(boxGeometry,material,region.count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);region.mesh=mesh;for(const c of region.citizens){writeCitizen(c);for(const [i,q]of c.parts.entries())mesh.setColorAt(c.offset+i,new THREE.Color(q.c));}mesh.computeBoundingSphere();mesh.boundingSphere.radius+=100;mesh.matrixAutoUpdate=false;addToDistrict(mesh,zone);}

  let current=null,greetingTime=-100;
  const greeted=new Map();
  function nearest(x,z,zone,radius=115){let best=null,distance=radius;for(const c of citizens){if(c.zone!==zone)continue;const d=Math.hypot(c.x-x,c.z-z);if(d<distance){distance=d;best=c;}}return best;}
  function update({x,z,zone,time,dt,camera=null,hidden=false}){
    for(const c of citizens){const visible=hidden||!camera||Math.hypot(camera.position.x-c.x,camera.position.z-c.z)>105;if(c.group.visible!==visible){c.group.visible=visible;writeCitizen(c);}}
    const next=hidden?null:nearest(x,z,zone,140);
    if(next){const delta=Math.atan2(Math.sin(Math.atan2(x-next.x,z-next.z)-next.group.rotation.y),Math.cos(Math.atan2(x-next.x,z-next.z)-next.group.rotation.y));if(Math.abs(delta)>.002){next.group.rotation.y+=delta*(1-Math.exp(-4*dt));writeCitizen(next);}}
    if(next?.id!==current?.id){current=next;if(next&&time-(greeted.get(next.id)??-100)>18){greeted.set(next.id,time);greetingTime=time;}}
    return next&&time-greetingTime<6?next:null;
  }
  return {citizens,nearest,update,meshes:[...regions.values()].map(r=>r.mesh)};
}
