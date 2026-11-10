import {inEdmontonCity,inTorontoCity,cityRiver} from './city-layout.js?v=15';
const noise=(x,z)=>{const n=Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n);};
const core=(x,z)=>inEdmontonCity(x,z)||inTorontoCity(x,z)||(Math.abs(x)<1690&&Math.abs(z)<1690)||(x>3500&&x<5500&&Math.abs(z)<960);
const water=(x,z)=>cityRiver(x,z)||(x>1700&&x<3500&&Math.abs(z)<1800)||((x+1700)/720)**2+((z-2600)/970)**2<1||((x-6600)/650)**2+((z-2400)/900)**2<1;
export const MOUNTAIN_PEAKS=[{x:1800,z:-3000,height:1000,radius:1050},{x:2800,z:-2500,height:850,radius:900},{x:3650,z:-3100,height:1100,radius:1100},{x:2450,z:2800,height:1000,radius:1100},{x:3950,z:2900,height:900,radius:1000}];
export function landscapeHeight(x,z){
  if(core(x,z))return -60;
  if(water(x,z))return -35;
  if((Math.abs(x-1050)<240||Math.abs(x-5050)<240)&&Math.abs(z)<3200)return -30;
  const hills=35+Math.sin(x*.0013)*48+Math.cos(z*.0016)*34+Math.sin((x+z)*.002)*18;
  let mountains=0;for(const peak of MOUNTAIN_PEAKS){const distance=Math.hypot((x-peak.x)/peak.radius,(z-peak.z)/peak.radius);const ridge=Math.max(0,1-distance);mountains=Math.max(mountains,Math.pow(ridge,1.25)*peak.height);}
  return Math.round((hills+mountains)/18)*18-25;
}

export function createFlightWorld({THREE,addToDistrict,material,boxGeometry}){
  const chunks=new Map(),bits=new Map(),step=240,bounds={minX:-5600,maxX:10000,minZ:-6000,maxZ:6000};
  const groundMaterial=material('#ffffff').clone();groundMaterial.vertexColors=true;groundMaterial.map=null;
  const quad=(points,color)=>{
    const x=points[0][0],z=points[0][2],key=Math.floor(x/2400)+'|'+Math.floor(z/2400);
    if(!chunks.has(key))chunks.set(key,{p:[],c:[],i:[]});const chunk=chunks.get(key),offset=chunk.p.length/3,rgb=new THREE.Color(color).toArray();
    points.forEach(p=>{chunk.p.push(...p);chunk.c.push(...rgb);});chunk.i.push(offset,offset+1,offset+2,offset,offset+2,offset+3);
  };
  for(let x=bounds.minX;x<bounds.maxX;x+=step)for(let z=bounds.minZ;z<bounds.maxZ;z+=step){
    const n=noise(x,z),wet=water(x+step/2,z+step/2);
    const altitude=landscapeHeight(x+step/2,z+step/2),color=wet?'#518d94':altitude>550?'#e3e8e2':altitude>330?'#9aa59f':altitude>180?'#687d70':Math.abs(z)>4000?'#8b9a87':n>.8?'#b1a66a':n>.5?'#8eaa68':n>.25?'#76965c':'#648752';
    quad([[x,landscapeHeight(x,z),z],[x,landscapeHeight(x,z+step),z+step],[x+step,landscapeHeight(x+step,z+step),z+step],[x+step,landscapeHeight(x+step,z),z]],color);
  }
  for(const chunk of chunks.values()){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(chunk.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(chunk.c,3));g.setIndex(chunk.i);g.computeVertexNormals();g.computeBoundingSphere();addToDistrict(new THREE.Mesh(g,groundMaterial),'landscape');
  }
  const surfaceHeight=(x,z)=>{const x0=bounds.minX+Math.floor((x-bounds.minX)/step)*step,z0=bounds.minZ+Math.floor((z-bounds.minZ)/step)*step,u=(x-x0)/step,v=(z-z0)/step,h00=landscapeHeight(x0,z0),h11=landscapeHeight(x0+step,z0+step);return v>=u?(1-v)*h00+(v-u)*landscapeHeight(x0,z0+step)+u*h11:(1-u)*h00+v*h11+(u-v)*landscapeHeight(x0+step,z0);};
  const box=(x,y,z,w,h,d,color)=>{const key=Math.floor(x/1800)+'|'+Math.floor(z/1800);if(!bits.has(key))bits.set(key,[]);bits.get(key).push({x,y:y+h/2,z,w,h,d,color});};
  // Low-detail forest clusters, fields and settlements remain visible beneath
  // the entire flight, while detailed portfolio districts retain their meshes.
  for(let i=0;i<650;i++){
    const x=-3800+noise(i,17)*12600,z=-4500+noise(i,23)*9000;
    if(core(x,z)||water(x,z)||((Math.abs(x-1050)<250||Math.abs(x-5050)<250)&&Math.abs(z)<3000))continue;
    const y=surfaceHeight(x,z),h=38+noise(i,43)*38;if(y>280)continue;
    box(x,y,z,9,h,9,'#776345');box(x,y+h*.6,z,45,h*.7,45,i%2?'#4a714c':'#5d8051');
  }
  for(const [cx,cz]of [[-900,-2300],[1900,-2600],[3900,2700],[6600,-1300],[7200,1900]]){
    for(let i=0;i<15;i++){const x=cx+(i%5-2)*100,z=cz+(Math.floor(i/5)-1)*115,y=surfaceHeight(x,z);if(water(x,z)||y>180)continue;box(x,y,z,60,34,48,'#c6bc9b');box(x,y+34,z,67,9,55,i%2?'#6d6150':'#476b60');}
    for(let i=-8;i<=8;i++){const x=cx+i*55,z=cz+245,y=surfaceHeight(x,z);if(y>140)continue;box(x,y+.4,z,57,2,36,'#827e65');}
  }
  const d=new THREE.Object3D(),palette=new Map();let boxCount=0;
  for(const list of bits.values()){
    const mesh=new THREE.InstancedMesh(boxGeometry,material('#ffffff'),list.length);
    list.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.scale.set(p.w,p.h,p.d);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);if(!palette.has(p.color))palette.set(p.color,new THREE.Color(p.color));mesh.setColorAt(i,palette.get(p.color));});mesh.computeBoundingSphere();addToDistrict(mesh,'landscape');boxCount+=list.length;
  }
  return {bounds,terrainChunks:chunks.size,boxes:boxCount,mountains:MOUNTAIN_PEAKS};
}
