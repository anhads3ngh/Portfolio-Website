export function createNightLighting({THREE,scene,boxGeometry,fixtures,addToDistrict}){
  const objects=[],lights=[],canvas=document.createElement('canvas');canvas.width=canvas.height=64;
  const c=canvas.getContext('2d'),gradient=c.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,210,126,.6)');gradient.addColorStop(.4,'rgba(255,190,91,.28)');gradient.addColorStop(1,'rgba(255,190,91,0)');c.fillStyle=gradient;c.fillRect(0,0,64,64);
  const texture=new THREE.CanvasTexture(canvas),bulb=new THREE.MeshBasicMaterial({color:'#ffffff',toneMapped:false});
  const pool=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending});
  const glow=new THREE.ShaderMaterial({transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending,
    vertexShader:'varying vec2 vUv; void main(){ vUv=uv; vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.); vec2 size=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz)); center.xy+=position.xy*size; gl_Position=projectionMatrix*center; }',
    fragmentShader:'varying vec2 vUv; void main(){ float r=length(vUv-.5)*2.; float a=pow(max(0.,1.-r),2.)*.6; gl_FragColor=vec4(1.,.67,.27,a); }'});
  const cells=new Map(),lampRegions=new Map(),candidates=new Map(),stats={bulbs:fixtures.length,halos:0,pools:0,selectionPasses:0};
  // Cull window batches spatially; only real lamps need soft halos and pools.
  for(const f of fixtures){const key=[f.region,Math.floor(f.x/1024),Math.floor(f.y/512),Math.floor(f.z/1024)].join('|');if(!cells.has(key))cells.set(key,{region:f.region,list:[]});cells.get(key).list.push(f);if(f.pool!==false&&f.glow!==false){if(!candidates.has(f.region))candidates.set(f.region,[]);candidates.get(f.region).push(f);}}
  const d=new THREE.Object3D(),color=new THREE.Color(),plane=new THREE.PlaneGeometry(1,1);
  function add(mesh,region){mesh.computeBoundingSphere();addToDistrict(mesh,region);mesh.visible=false;objects.push(mesh);}
  for(const {region,list}of cells.values()){
    const bulbs=new THREE.InstancedMesh(boxGeometry,bulb,list.length);
    list.forEach((f,i)=>{d.position.set(f.x,f.y,f.z);d.rotation.set(0,0,0);d.scale.set(f.width,f.height,f.depth);d.updateMatrix();bulbs.setMatrixAt(i,d.matrix);bulbs.setColorAt(i,color.set(f.color||'#ffe9a5'));});add(bulbs,region);
    const lamps=list.filter(f=>f.glow!==false);if(!lampRegions.has(region))lampRegions.set(region,[]);lampRegions.get(region).push(...lamps);
  }
  // The small lamp population shares district batches to keep draw calls low.
  for(const [region,lamps]of lampRegions){
    const groundLamps=lamps.filter(f=>f.pool!==false);
    if(lamps.length){const halos=new THREE.InstancedMesh(plane,glow,lamps.length);lamps.forEach((f,i)=>{const size=Math.min(105,Math.max(f.width,f.height,f.depth)*2+38);d.position.set(f.x,f.y,f.z);d.rotation.set(0,0,0);d.scale.set(size,size,1);d.updateMatrix();halos.setMatrixAt(i,d.matrix);});add(halos,region);halos.boundingSphere.radius+=105;stats.halos+=lamps.length;}
    if(groundLamps.length){const pools=new THREE.InstancedMesh(plane,pool,groundLamps.length);groundLamps.forEach((f,i)=>{d.position.set(f.x,(f.floor||0)+.7,f.z);d.rotation.set(-Math.PI/2,0,0);d.scale.set(150,150,1);d.updateMatrix();pools.setMatrixAt(i,d.matrix);});add(pools,region);stats.pools+=groundLamps.length;}
  }
  for(let i=0;i<2;i++){const light=new THREE.PointLight('#ffd69b',0,380,1);scene.add(light);lights.push(light);}
  let wasDark=false,lastRegion=null,lastSelection=-Infinity,lastX=Infinity,lastY=Infinity,lastZ=Infinity;
  function update(dark,{room,zone,flying,camera}){
    if(dark!==wasDark){for(const object of objects)object.visible=dark;wasDark=dark;lastSelection=-Infinity;}
    if(!dark||flying){for(const light of lights)light.intensity=0;lastRegion=null;return;}
    const region=room?room+'-room':zone,p=camera.position,now=performance.now();
    if(region===lastRegion&&now-lastSelection<120&&Math.hypot(p.x-lastX,p.y-lastY,p.z-lastZ)<40)return;
    lastRegion=region;lastSelection=now;lastX=p.x;lastY=p.y;lastZ=p.z;stats.selectionPasses++;
    let first=null,second=null,d1=Infinity,d2=Infinity;
    for(const f of candidates.get(region)||[]){const distance=(f.x-p.x)**2+(f.z-p.z)**2+.8*(f.y-p.y)**2;if(distance<d1){second=first;d2=d1;first=f;d1=distance;}else if(distance<d2){second=f;d2=distance;}}
    for(let i=0;i<lights.length;i++){const f=i===0?first:second,light=lights[i];light.intensity=f?(room?155:130):0;if(f)light.position.set(f.x,f.y-(room?23:0),f.z);}
  }
  return {objects,lights,update,stats};
}
