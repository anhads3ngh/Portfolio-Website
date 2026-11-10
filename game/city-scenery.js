import {CITY_LANDMARKS,TORONTO_ROADS,CITY_TOWERS} from './city-layout.js?v=15';

export function createCityScenery({THREE,block,collision,surfaceQuad,addToDistrict,boxGeometry,registerLight,lamp}){
  const beams=[],traffic=[],landmarks=[],footprints=[];
  const solid=(x,z,w,d,h)=>{collision(x,z,w,d);footprints.push({x,z,w,d,h});};const cream='#c8c5b5',glass='#628f9d',dark='#263f49';
  const flat=(x,z,w,d,color,y=.25)=>surfaceQuad([[x-w/2,y,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y,z-d/2]],color,[0,1,0]);
  const beam=(a,b,width,color)=>beams.push({a,b,width,color});
  const light=(x,y,z,region,size=6)=>registerLight({region,x,y,z,floor:0,width:size,height:3,depth:size});
  function road({x,z,length,width,axis},region){
    const horizontal=axis==='x',w=horizontal?length:width,d=horizontal?width:length;
    flat(x,z,w+36,d+36,'#b7b8ae',.35);flat(x,z,w,d,'#465158',.65);
    for(let n=-length/2+20;n<length/2-10;n+=46)flat(x+(horizontal?n:0),z+(horizontal?0:n),horizontal?23:3,horizontal?3:23,'#ddd1a2',.8);
    for(const side of [-1,1])flat(x+(horizontal?0:side*(width/2-6)),z+(horizontal?side*(width/2-6):0),horizontal?length:2,horizontal?2:length,'#c9d5cb',.82);
    for(let n=-length/2+75;n<length/2;n+=220){const px=x+(horizontal?n:width/2+19),pz=z+(horizontal?width/2+19:n);block(px,0,pz,4,70,4,'#46575a');block(px,70,pz,24,4,9,'#ced5c9');light(px,73,pz,region,18);}
  }
  function crosswalk(x,z,axis='x',width=88){for(let n=-width/2;n<width/2;n+=13)flat(x+(axis==='x'?n:0),z+(axis==='x'?0:n),axis==='x'?7:35,axis==='x'?35:7,'#e5e5d5',1.05);}
  function streetLabel(text,x,z,angle=0){
    const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#244b42';g.fillRect(0,0,512,96);g.strokeStyle='#c9d9c7';g.lineWidth=5;g.strokeRect(3,3,506,90);g.fillStyle='#edf3e5';g.font='bold 34px monospace';g.textAlign='center';g.fillText(text,256,60);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(95,18),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));mesh.position.set(x,79,z);mesh.rotation.y=angle;addToDistrict(mesh,x>3500?'toronto':'edmonton');block(x,0,z,4,72,4,'#56686a');
  }
  function tower(x,z,w,d,h,color,style='flat',region='toronto'){
    block(x,0,z,w+15,18,d+15,'#a3ada8');block(x,18,z,w,h,d,color);solid(x,z,w,d,h+85);
    for(let y=33;y<h;y+=32){block(x,y,z+d/2+1,w-10,14,2,glass);block(x-w/2-1,y,z,2,14,d-10,glass);block(x+w/2+1,y,z,2,14,d-10,'#497384');}
    for(let dx=-w/2+16;dx<w/2;dx+=27)block(x+dx,18,z+d/2+3,3,h,3,color);
    if(style==='steps')for(let i=0;i<4;i++)block(x,h+18+i*13,z,w-i*18,13,d-i*15,cream);
    if(style==='spire'){block(x,h+18,z,w*.7,25,d*.7,'#afb9b6');block(x,h+43,z,6,65,6,'#cbd1c8');}
    if(style==='gold'){for(let dx=-w/2+12;dx<w/2;dx+=18)block(x+dx,18,z+d/2+4,4,h,3,'#c6aa65');}
    for(let i=0;i<3;i++)light(x-w/3+i*w/3,60+(i*71)%(h-50),z+d/2+5,region,11);
  }
  function planter(x,z){block(x,0,z,45,16,45,'#a7a797');block(x,16,z,6,54,6,'#71624e');block(x,60,z,48,32,48,'#5f8459');block(x,87,z,32,19,32,'#7a9c65');}
  function bench(x,z){block(x,14,z,52,5,19,'#8d7654');block(x,19,z-7,52,19,4,'#8d7654');for(const a of [-1,1])block(x+a*19,0,z,4,14,15,'#485b59');}
  function signal(x,z){block(x,0,z,4,90,4,'#485658');block(x,76,z,12,30,10,'#233d3c');block(x,95,z+6,5,5,2,'#d88465');block(x,80,z+6,5,5,2,'#b8e29b');light(x,82,z+7,'toronto',5);}
  function vehicle({x,z,axis='x',length=1100,speed=35,phase=0,color='#d4c7a4',streetcar=false,region='toronto'}){
    const group=new THREE.Group(),parts=[],part=(x,y,z,w,h,d,c)=>parts.push({x,y:y+h/2,z,w,h,d,c});
    const long=streetcar?140:50;part(0,8,0,long,streetcar?28:15,streetcar?28:24,color);part(0,23,0,streetcar?132:30,streetcar?25:13,streetcar?26:22,streetcar?'#d5d6ce':'#9daeb0');
    for(const side of [-1,1]){part(0,streetcar?31:27,side*(streetcar?14:12),streetcar?124:27,streetcar?12:9,1,'#34505c');for(const a of [-1,1])part(a*(long/2-9),2,side*12,9,10,5,'#263736');}
    if(streetcar){part(0,48,0,45,3,20,'#58696a');part(0,51,0,5,20,4,'#697a79');part(0,70,0,60,3,6,'#697a79');for(let a=-55;a<60;a+=28)part(a,25,14,3,29,2,'#b14f43');}
    else for(const a of [-1,1])part(long/2+1,13,a*7,2,5,5,'#e8d59b');
    const mesh=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),parts.length),dummy=new THREE.Object3D();parts.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(p.c));});mesh.computeBoundingSphere();group.add(mesh);group.rotation.y=(axis==='z'?-Math.PI/2:0)+(speed<0?Math.PI:0);addToDistrict(group,region);traffic.push({group,x,z,axis,length,speed,phase});
  }

  // Toronto: street grid, station colonnade, rail corridor and a layered skyline.
  flat(4900,-385,2600,2530,'#a3aea8',0);
  for(const r of TORONTO_ROADS)road(r,'toronto');
  for(const x of [4170,4680])for(const z of [25,620,-720]){crosswalk(x-57,z,'z');crosswalk(x+57,z,'z');crosswalk(x,z-55);crosswalk(x,z+55);signal(x+64,z+63);}
  streetLabel('FRONT STREET WEST',4420,92);streetLabel('YORK STREET',4735,130,Math.PI/2);streetLabel('KING STREET WEST',4240,-665);streetLabel('QUEENS QUAY',4360,680);
  for(const x of [4000,4240,4410,4595,4780])for(const z of [145,535]){planter(x,z);bench(x+55,z);}
  const u=CITY_LANDMARKS.unionStation;block(u.x,0,u.z,u.width,82,u.depth,'#c7b99a');solid(u.x,u.z,u.width,u.depth,95);block(u.x,82,u.z,u.width+15,13,u.depth+10,'#9b9e93');
  for(let x=u.x-u.width/2+14;x<u.x+u.width/2;x+=24){block(x,8,u.z+u.depth/2+9,9,65,11,'#e0d6bd');block(x,70,u.z+u.depth/2+9,15,7,15,'#e0d6bd');block(x,26,u.z+u.depth/2+1,14,37,3,'#3b555b');}streetLabel('UNION STATION',u.x,u.z+u.depth/2+27);
  for(const z of [-1040,-1090,-1140]){flat(4640,z,1600,26,'#6b726e',.6);for(const a of [-1,1])flat(4640,z+a*8,1600,2,'#b2beb7',.9);for(let x=3850;x<5450;x+=22)flat(x,z,4,22,'#8c7a5a',.8);}
  const cn=CITY_LANDMARKS.cnTower;block(cn.x,0,cn.z,65,26,65,'#b8bcb0');block(cn.x,26,cn.z,24,620,24,'#c1c6bc');block(cn.x,646,cn.z,112,18,112,'#afb8b3');block(cn.x,664,cn.z,126,22,126,'#638c9a');block(cn.x,686,cn.z,95,21,95,'#bcc7c2');block(cn.x,707,cn.z,28,90,28,'#a4b7b4');block(cn.x,797,cn.z,8,123,8,'#d9dfd6');solid(cn.x,cn.z,65,65,646);footprints.push({x:cn.x,z:cn.z,w:126,d:126,h:707,minY:646},{x:cn.x,z:cn.z,w:28,d:28,h:920,minY:707});light(cn.x,700,cn.z,'toronto',18);
  const dome=CITY_LANDMARKS.rogersCentre;for(let i=0;i<8;i++)block(dome.x,8+i*8,dome.z,dome.width-i*25,8,dome.depth-i*16,'#d8dfd7');block(dome.x,0,dome.z,dome.width,16,dome.depth,'#84979a');solid(dome.x,dome.z,dome.width,dome.depth,80);
  for(const t of CITY_TOWERS.filter(t=>t.zone==='toronto'))tower(t.x,t.z,t.w,t.d,t.height,t.color,t.style,t.zone);
  for(const [x,z]of [[3990,285],[4330,315],[4790,330],[5480,300]]){block(x,0,z,125,70,95,'#ad8b6c');block(x,70,z,132,10,105,'#506e6d');solid(x,z,125,95,80);for(let a=-45;a<=45;a+=30){block(x+a,18,z+49,22,35,3,'#537987');block(x+a,54,z+51,27,10,3,'#e7cda0');}}
  flat(4420,805,1620,115,'#b8b6a0',.4);for(let x=3670;x<4850;x+=70)block(x,0,870,48,8,20,'#aab1a5');
  for(const z of [-729,-711])flat(4260,z,1200,2,'#c0cbc6',1);vehicle({x:4260,z:-720,length:1140,speed:42,phase:0,color:'#b94d42',streetcar:true});
  for(let i=0;i<7;i++)vehicle({x:4270,z:25+(i%2?22:-22),length:1130,speed:i%2?-32:37,phase:i*171,color:['#ded9b8','#557383','#a46e57','#c9b56c'][i%4]});
  vehicle({x:4760,z:620,length:1220,speed:27,phase:200,color:'#8caaa1'});

  // Edmonton's river valley is north of the playable campus, visible during climb-out.
  flat(170,-2588,3040,1225,'#779463',0);flat(170,-1440,3040,130,'#73945d',0);
  flat(170,-1740,3040,470,'#497f8b',-12);flat(170,-1996,3040,40,'#99a87b',-.2);flat(170,-1484,3040,40,'#96a879',-.2);
  const b=CITY_LANDMARKS.walterdale;
  flat(b.x,b.z,b.width,b.length,'#586361',8);for(const a of [-1,1]){flat(b.x+a*81,b.z,22,b.length+65,'#bfba9c',8);for(let z=b.z-b.length/2;z<=b.z+b.length/2;z+=45)beam([b.x+a*94,10,z],[b.x+a*94,23,z],3,'#d8dfd4');}
  for(const side of [-1,1])for(let i=0;i<28;i++){
    const t0=i/28,t1=(i+1)/28,z0=b.z-b.length/2+t0*b.length,z1=b.z-b.length/2+t1*b.length,y0=14+Math.sin(t0*Math.PI)*b.archHeight,y1=14+Math.sin(t1*Math.PI)*b.archHeight;
    beam([b.x+side*68,y0,z0],[b.x+side*68,y1,z1],11,'#e4e9dc');if(i%2===0)beam([b.x+side*68,10,z0],[b.x+side*68,y0,z0],2.5,'#c8d3c8');
  }
  for(let z=b.z-210;z<=b.z+210;z+=50){flat(b.x,z,3,24,'#e3d9b3',8.5);for(const a of [-1,1])light(b.x+a*84,15,z,'edmonton',7);}
  road({x:b.x,z:-2220,length:480,width:100,axis:'z'},'edmonton');road({x:b.x,z:-1360,length:300,width:100,axis:'z'},'edmonton');
  road({x:170,z:-2320,length:2750,width:110,axis:'x'},'edmonton');road({x:170,z:-2930,length:2750,width:95,axis:'x'},'edmonton');road({x:-850,z:-2600,length:1050,width:90,axis:'z'},'edmonton');road({x:1420,z:-995,length:1000,width:70,axis:'z'},'edmonton');
  for(const t of CITY_TOWERS.filter(t=>t.zone==='edmonton'))tower(t.x,t.z,t.w,t.d,t.height,t.color,t.style,t.zone);
  // A glass pyramid silhouette for the City Hall area.
  block(650,0,-2420,135,35,90,'#bab9a5');for(let i=0;i<8;i++)block(650,35+i*9,-2420,110-i*12,9,78-i*8,'#8fb1b1');solid(650,-2420,135,90,110);
  for(let i=0;i<20;i++){const x=-1250+i*140;for(const z of [-2070,-3070]){block(x,0,z,8,42,8,'#75654a');block(x,42,z,46,38,46,'#5c8257');}}
  streetLabel('WALTERDALE BRIDGE',b.x+145,-1430);streetLabel('DOWNTOWN EDMONTON',b.x+150,-2210);
  vehicle({x:170,z:-2320,length:2550,speed:40,color:'#cad1ba',region:'edmonton'});vehicle({x:-850,z:-2650,length:800,speed:30,axis:'z',color:'#d3b67a',region:'edmonton'});
  // Repeated angled bridge members share one draw call.
  const members=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),beams.length),dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
  beams.forEach((p,i)=>{const a=new THREE.Vector3(...p.a),b=new THREE.Vector3(...p.b),v=b.clone().sub(a);dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,v.clone().normalize());dummy.scale.set(p.width,v.length(),p.width);dummy.updateMatrix();members.setMatrixAt(i,dummy.matrix);members.setColorAt(i,new THREE.Color(p.color));});members.computeBoundingSphere();addToDistrict(members,'edmonton');
  landmarks.push(...Object.entries(CITY_LANDMARKS).map(([id,p])=>({id,...p})));
  function animate(t,reduced){for(const v of traffic){const offset=((v.phase+(reduced?0:t*v.speed))%v.length+v.length)%v.length-v.length/2;v.group.position.set(v.x+(v.axis==='x'?offset:0),0,v.z+(v.axis==='z'?offset:0));}}
  animate(0,false);return {animate,landmarks,traffic,footprints,roads:TORONTO_ROADS};
}
