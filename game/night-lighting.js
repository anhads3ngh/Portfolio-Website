export function createNightLighting({THREE,scene,boxGeometry,fixtures,addToDistrict}){
  const objects=[],lights=[],canvas=document.createElement('canvas');canvas.width=canvas.height=64;
  const c=canvas.getContext('2d'),gradient=c.createRadialGradient(32,32,0,32,32,32);
  gradient.addColorStop(0,'rgba(255,210,126,.6)');gradient.addColorStop(.4,'rgba(255,190,91,.28)');gradient.addColorStop(1,'rgba(255,190,91,0)');c.fillStyle=gradient;c.fillRect(0,0,64,64);
  const texture=new THREE.CanvasTexture(canvas),bulb=new THREE.MeshBasicMaterial({color:'#ffffff',toneMapped:false});
  const pool=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending});
  // One instanced billboard draw per district gives lamps a warm halo without
  // a full-screen bloom pass or a separate point light for every fixture.
  const glow=new THREE.ShaderMaterial({transparent:true,depthWrite:false,toneMapped:false,blending:THREE.AdditiveBlending,
    vertexShader:'varying vec2 vUv; void main(){ vUv=uv; vec4 center=modelViewMatrix*instanceMatrix*vec4(0.,0.,0.,1.); vec2 size=vec2(length(instanceMatrix[0].xyz),length(instanceMatrix[1].xyz)); center.xy+=position.xy*size; gl_Position=projectionMatrix*center; }',
    fragmentShader:'varying vec2 vUv; void main(){ float r=length(vUv-.5)*2.; float a=pow(max(0.,1.-r),2.)*.6; gl_FragColor=vec4(1.,.67,.27,a); }'});
  const regions=new Map();for(const f of fixtures){if(!regions.has(f.region))regions.set(f.region,[]);regions.get(f.region).push(f);}
  for(const [region,list]of regions){
    const bulbs=new THREE.InstancedMesh(boxGeometry,bulb,list.length),pools=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),pool,list.length);
    const halos=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),glow,list.length),d=new THREE.Object3D();
    list.forEach((f,i)=>{
      d.position.set(f.x,f.y,f.z);d.rotation.set(0,0,0);d.scale.set(f.width,f.height,f.depth);d.updateMatrix();bulbs.setMatrixAt(i,d.matrix);bulbs.setColorAt(i,new THREE.Color(f.color||'#ffe9a5'));
      const size=f.glow===false?0:Math.min(105,Math.max(f.width,f.height,f.depth)*2+38);
      d.scale.set(size,size,1);d.updateMatrix();halos.setMatrixAt(i,d.matrix);
      d.position.set(f.x,(f.floor||0)+.7,f.z);d.rotation.x=-Math.PI/2;d.scale.set(f.glow===false?0:150,f.glow===false?0:150,1);d.updateMatrix();pools.setMatrixAt(i,d.matrix);
    });
    for(const mesh of [bulbs,pools,halos]){mesh.computeBoundingSphere();addToDistrict(mesh,region);objects.push(mesh);}
    // Billboard vertices expand in camera space, beyond their unit geometry.
    halos.frustumCulled=false;
  }
  for(let i=0;i<2;i++){const light=new THREE.PointLight('#ffd69b',0,380,1);scene.add(light);lights.push(light);}
  function update(dark,{room,zone,flying,camera}){
    objects.forEach(o=>o.visible=dark);
    const region=room?room+'-room':zone,p=camera.position;
    const nearest=dark&&!flying?fixtures.filter(f=>f.region===region&&f.pool!==false&&f.glow!==false).sort((a,b)=>((a.x-p.x)**2+(a.z-p.z)**2+.8*(a.y-p.y)**2)-((b.x-p.x)**2+(b.z-p.z)**2+.8*(b.y-p.y)**2)).slice(0,2):[];
    lights.forEach((light,i)=>{const f=nearest[i];light.intensity=f?(room?155:130):0;if(f)light.position.set(f.x,f.y-(room?23:0),f.z);});
  }
  return {objects,lights,update};
}
