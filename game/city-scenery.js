import {inDriveCorridor} from './world-layout.js?v=18';
import {inAirfield,routeAvoidsAirfields,trafficPosition} from './airspace.js?v=18';
import {CITY_LANDMARKS,TORONTO_ROADS,CITY_TOWERS,CAMPUS_BUILDINGS,CAMPUS_ROADS,CITY_TRAFFIC} from './city-layout.js?v=18';

export function createCityScenery({THREE,block,collision,surfaceQuad,addToDistrict,boxGeometry,registerLight,lamp}){
  const beams=[],traffic=[],landmarks=[],footprints=[];
  const solid=(x,z,w,d,h)=>{collision(x,z,w,d);footprints.push({x,z,w,d,h});};const cream='#c8c5b5',glass='#628f9d',dark='#263f49';
  const flat=(x,z,w,d,color,y=.25)=>surfaceQuad([[x-w/2,y,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y,z-d/2]],color,[0,1,0]);
  const beam=(a,b,width,color)=>beams.push({a,b,width,color});
  const light=(x,y,z,region,size=6)=>registerLight({region,x,y,z,floor:0,width:size,height:3,depth:size});
  const buildingLights=new Map();
  function windowLight(id,x,y,z,w,h,d,region){registerLight({region,x,y,z,width:w,height:h,depth:d,glow:false,pool:false,color:(Math.round(x+y+z)%3)?'#ffe1a0':'#c5e6eb'});buildingLights.set(id,(buildingLights.get(id)||0)+1);}
  function facadeLights(id,x,z,w,d,h,region,base=33){for(let y=base;y<h;y+=32){for(let dx=-w/2+18;dx<w/2-8;dx+=28)for(const side of [-1,1])windowLight(id,x+dx,y+7,z+side*(d/2+2.5),20,12,1,region);for(let dz=-d/2+18;dz<d/2-8;dz+=28)for(const side of [-1,1])windowLight(id,x+side*(w/2+2.5),y+7,z+dz,1,12,20,region);}}
  function road({x,z,length,width,axis},region){
    const horizontal=axis==='x',w=horizontal?length:width,d=horizontal?width:length;
    flat(x,z,w+36,d+36,'#b7b8ae',.35);flat(x,z,w,d,'#465158',.65);
    for(let n=-length/2+20;n<length/2-10;n+=46)flat(x+(horizontal?n:0),z+(horizontal?0:n),horizontal?23:3,horizontal?3:23,'#ddd1a2',.8);
    for(const side of [-1,1])flat(x+(horizontal?0:side*(width/2-6)),z+(horizontal?side*(width/2-6):0),horizontal?length:2,horizontal?2:length,'#c9d5cb',.82);
    for(let n=-length/2+75;n<length/2;n+=220){const px=x+(horizontal?n:width/2+19),pz=z+(horizontal?width/2+19:n);if(inAirfield(px,pz,15)||inDriveCorridor(px,pz,20))continue;block(px,0,pz,4,70,4,'#46575a');block(px,70,pz,24,4,9,'#ced5c9');light(px,73,pz,region,18);}
  }
  function crosswalk(x,z,axis='x',width=88){for(let n=-width/2;n<width/2;n+=13)flat(x+(axis==='x'?n:0),z+(axis==='x'?0:n),axis==='x'?7:35,axis==='x'?35:7,'#e5e5d5',1.05);}
  function streetLabel(text,x,z,angle=0){
    const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.fillStyle='#244b42';g.fillRect(0,0,512,96);g.strokeStyle='#c9d9c7';g.lineWidth=5;g.strokeRect(3,3,506,90);g.fillStyle='#edf3e5';g.font='bold 34px monospace';g.textAlign='center';g.fillText(text,256,60);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(95,18),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));mesh.position.set(x,79,z);mesh.rotation.y=angle;addToDistrict(mesh,x>3500?'toronto':'edmonton');block(x,0,z,4,72,4,'#56686a');
  }
  function tower(x,z,w,d,h,color,style='flat',region='toronto'){
    block(x,0,z,w+15,18,d+15,'#a3ada8');block(x,18,z,w,h,d,color);solid(x,z,w,d,h+85);
    for(let y=33;y<h;y+=32){block(x,y,z+d/2+1,w-10,14,2,glass);block(x-w/2-1,y,z,2,14,d-10,glass);block(x+w/2+1,y,z,2,14,d-10,'#497384');block(x,y,z-d/2-1,w-10,14,2,glass);}
    for(let dx=-w/2+16;dx<w/2;dx+=27)block(x+dx,18,z+d/2+3,3,h,3,color);
    if(style==='steps')for(let i=0;i<4;i++)block(x,h+18+i*13,z,w-i*18,13,d-i*15,cream);
    if(style==='spire'){block(x,h+18,z,w*.7,25,d*.7,'#afb9b6');block(x,h+43,z,6,65,6,'#cbd1c8');}
    if(style==='gold'){for(let dx=-w/2+12;dx<w/2;dx+=18)block(x+dx,18,z+d/2+4,4,h,3,'#c6aa65');}
    facadeLights('tower:'+x+','+z,x,z,w,d,h,region);light(x,h+30,z,region,8);
  }
  function planter(x,z){block(x,0,z,45,16,45,'#a7a797');block(x,16,z,6,54,6,'#71624e');block(x,60,z,48,32,48,'#5f8459');block(x,87,z,32,19,32,'#7a9c65');}
  function bench(x,z){block(x,14,z,52,5,19,'#8d7654');block(x,19,z-7,52,19,4,'#8d7654');for(const a of [-1,1])block(x+a*19,0,z,4,14,15,'#485b59');}
  function signal(x,z){block(x,0,z,4,90,4,'#485658');block(x,76,z,12,30,10,'#233d3c');block(x,95,z+6,5,5,2,'#d88465');block(x,80,z+6,5,5,2,'#b8e29b');light(x,82,z+7,'toronto',5);}
  function vehicle(route){
    const {x,z,axis,length,speed,phase,color,region,type,dimensions}=route;
    if(!routeAvoidsAirfields(route))throw new Error('Traffic route enters an airfield: '+route.id);
    const group=new THREE.Group(),parts=[],part=(x,y,z,w,h,d,c)=>parts.push({x,y:y+h/2,z,w,h,d,c}),long=dimensions.length,wide=dimensions.width;
    if(type==='bicycle'){
      for(const a of [-1,1]){part(a*25,1,0,22,22,7,'#263b3d');part(a*25,9,0,11,6,9,'#b6c2b8');}part(0,15,0,53,5,5,color);part(-3,18,0,5,25,5,color);part(-12,44,0,18,24,17,color);part(-2,68,0,18,20,18,'#bd916e');part(-2,86,0,22,6,22,color);part(19,29,0,4,24,4,'#7a918c');part(20,50,0,4,4,28,'#7a918c');
    }else{
      const bus=type==='bus',tram=type==='streetcar';
      part(0,17,0,long,tram||bus?50:22,wide,color);part(0,39,0,tram||bus?long-12:93,tram?54:bus?49:23,wide-5,tram||bus?'#c8d3ca':'#91a7ab');
      for(const side of [-1,1]){part(0,tram||bus?63:43,side*(wide/2+.2),tram||bus?long-28:86,tram||bus?23:15,1,'#284b59');for(let a=-long/2+30;a<long/2;a+=tram?70:bus?long-60:long-60)part(a,1,side*(wide/2-6),20,21,11,'#263736');}
      part(long/2-4,tram||bus?61:42,0,2,tram||bus?24:16,wide-15,'#345663');
      if(tram){part(0,96,0,70,4,40,'#5e7474');part(0,100,0,6,21,6,'#657b7a');part(0,120,0,70,4,7,'#657b7a');for(let a=-long/2+30;a<long/2;a+=48)part(a,42,wide/2+1,4,49,2,'#a6483e');}
      if(bus){part(-long/2+15,54,wide/2+1,24,38,2,'#768d84');part(long/2-24,54,wide/2+1,28,38,2,'#768d84');part(long/2-23,85,0,37,10,wide-18,'#314c4c');}
    }
    const mesh=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),parts.length),dummy=new THREE.Object3D();parts.forEach((p,i)=>{dummy.position.set(p.x,p.y,p.z);dummy.scale.set(p.w,p.h,p.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(p.c));});mesh.computeBoundingSphere();group.add(mesh);
    const lamps=new THREE.Group();if(type!=='bicycle')for(const side of [-1,1]){const bulb=new THREE.Mesh(boxGeometry,new THREE.MeshBasicMaterial({color:'#ffe4a8',toneMapped:false}));bulb.position.set(long/2+1,26,side*(wide/2-11));bulb.scale.set(2,8,12);lamps.add(bulb);const rear=bulb.clone();rear.material=new THREE.MeshBasicMaterial({color:'#e67c5f',toneMapped:false});rear.position.x=-long/2-1;lamps.add(rear);}group.add(lamps);
    group.rotation.y=(axis==='z'?-Math.PI/2:0)+(speed<0?Math.PI:0);addToDistrict(group,region);traffic.push({...route,group,lamps});
  }


  // Toronto: street grid, station colonnade, rail corridor and a layered skyline.
  flat(4900,-385,2600,2530,'#a3aea8',0);flat(4900,970,2600,220,'#a9b2a2',0);
  for(const r of TORONTO_ROADS)road(r,'toronto');
  for(const x of [4170,4680])for(const z of [25,620,-720]){crosswalk(x-87,z,'z',130);crosswalk(x+87,z,'z',130);crosswalk(x,z-85,'x',130);crosswalk(x,z+85,'x',130);signal(x+88,z+88);}
  streetLabel('FRONT STREET WEST',4420,92);streetLabel('YORK STREET',4735,130,Math.PI/2);streetLabel('KING STREET WEST',4240,-665);streetLabel('QUEENS QUAY',4360,680);
  for(const x of [4000,4240,4410,4595,4780])for(const z of [145,535]){planter(x,z);bench(x+55,z);}
  const u=CITY_LANDMARKS.unionStation;block(u.x,0,u.z,u.width,82,u.depth,'#c7b99a');solid(u.x,u.z,u.width,u.depth,95);block(u.x,82,u.z,u.width+15,13,u.depth+10,'#9b9e93');
  for(let x=u.x-u.width/2+14;x<u.x+u.width/2;x+=24){block(x,8,u.z+u.depth/2+9,9,65,11,'#e0d6bd');block(x,70,u.z+u.depth/2+9,15,7,15,'#e0d6bd');block(x,26,u.z+u.depth/2+1,14,37,3,'#3b555b');}streetLabel('UNION STATION',u.x,u.z+u.depth/2+27);facadeLights('union-station',u.x,u.z,u.width,u.depth,82,'toronto',25);
  for(const z of [-1040,-1090,-1140]){flat(4640,z,1600,26,'#6b726e',.6);for(const a of [-1,1])flat(4640,z+a*8,1600,2,'#b2beb7',.9);for(let x=3850;x<5450;x+=22)flat(x,z,4,22,'#8c7a5a',.8);}
  const cn=CITY_LANDMARKS.cnTower;block(cn.x,0,cn.z,65,26,65,'#b8bcb0');block(cn.x,26,cn.z,24,620,24,'#c1c6bc');block(cn.x,646,cn.z,112,18,112,'#afb8b3');block(cn.x,664,cn.z,126,22,126,'#638c9a');block(cn.x,686,cn.z,95,21,95,'#bcc7c2');block(cn.x,707,cn.z,28,90,28,'#a4b7b4');block(cn.x,797,cn.z,8,123,8,'#d9dfd6');solid(cn.x,cn.z,65,65,646);footprints.push({x:cn.x,z:cn.z,w:126,d:126,h:707,minY:646},{x:cn.x,z:cn.z,w:28,d:28,h:920,minY:707});light(cn.x,700,cn.z,'toronto',18);for(const side of [-1,1]){windowLight('cn-tower',cn.x,675,cn.z+side*64,116,15,2,'toronto');windowLight('cn-tower',cn.x+side*64,675,cn.z,2,15,116,'toronto');}
  const dome=CITY_LANDMARKS.rogersCentre;for(let i=0;i<8;i++)block(dome.x,8+i*8,dome.z,dome.width-i*25,8,dome.depth-i*16,'#d8dfd7');block(dome.x,0,dome.z,dome.width,16,dome.depth,'#84979a');solid(dome.x,dome.z,dome.width,dome.depth,80);facadeLights('rogers-centre',dome.x,dome.z,dome.width,dome.depth,34,'toronto',12);
  for(const t of CITY_TOWERS.filter(t=>t.zone==='toronto'))tower(t.x,t.z,t.w,t.d,t.height,t.color,t.style,t.zone);
  for(const [x,z]of [[3990,285],[4330,315],[4790,330],[5950,530]]){block(x,0,z,125,70,95,'#ad8b6c');block(x,70,z,132,10,105,'#506e6d');solid(x,z,125,95,80);for(let a=-45;a<=45;a+=30){block(x+a,18,z+49,22,35,3,'#537987');block(x+a,54,z+51,27,10,3,'#e7cda0');windowLight('shop:'+x,x+a,35,z+50,20,32,1,'toronto');}}
  flat(4420,805,1620,115,'#b8b6a0',.4);for(let x=3670;x<4850;x+=70)block(x,0,870,48,8,20,'#aab1a5');
  for(const z of [-742,-698])flat(4260,z,1200,2,'#c0cbc6',1);


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
  road({x:170,z:-2320,length:2750,width:145,axis:'x'},'edmonton');road({x:170,z:-2930,length:2750,width:145,axis:'x'},'edmonton');road({x:-850,z:-2600,length:1050,width:90,axis:'z'},'edmonton');road({x:1580,z:-995,length:1000,width:110,axis:'z'},'edmonton');
  for(const t of CITY_TOWERS.filter(t=>t.zone==='edmonton'))tower(t.x,t.z,t.w,t.d,t.height,t.color,t.style,t.zone);
  // A glass pyramid silhouette for the City Hall area.
  block(650,0,-2455,135,35,90,'#bab9a5');for(let i=0;i<8;i++)block(650,35+i*9,-2455,110-i*12,9,78-i*8,'#8fb1b1');solid(650,-2455,135,90,110);facadeLights('edmonton-city-hall',650,-2455,135,90,35,'edmonton',12);for(let i=0;i<8;i++)windowLight('edmonton-city-hall',650,39+i*9,-2455+40-i*4,106-i*12,5,1,'edmonton');
  for(let i=0;i<20;i++){const x=-1250+i*140;for(const z of [-2070,-3070]){block(x,0,z,8,42,8,'#75654a');block(x,42,z,46,38,46,'#5c8257');}}
  streetLabel('WALTERDALE BRIDGE',b.x+145,-1430);streetLabel('DOWNTOWN EDMONTON',b.x+150,-2210);
  // A campus precinct around the original teaching building.
  for(const r of CAMPUS_ROADS)road(r,'edmonton');
  for(const c of CAMPUS_BUILDINGS){
    block(c.x,0,c.z,c.w+16,8,c.d+16,'#b9b89e');block(c.x,8,c.z,c.w,c.height,c.d,c.color);solid(c.x,c.z,c.w,c.d,c.height+28);
    for(let y=28;y<c.height;y+=32){for(const side of [-1,1]){block(c.x,y,c.z+side*(c.d/2+1),c.w-24,16,2,'#719d9d');block(c.x+side*(c.w/2+1),y,c.z,2,16,c.d-24,'#719d9d');}block(c.x,y+19,c.z,c.w+5,3,c.d+5,'#d7d2b9');}
    block(c.x,c.height+8,c.z,c.w+14,10,c.d+14,c.style==='engineering'?'#426b69':'#536f5c');
    if(c.style==='library'){for(let a=-c.w/2+18;a<c.w/2;a+=30)block(c.x+a,8,c.z+c.d/2+7,7,64,12,'#d9d0b4');for(let i=0;i<4;i++)block(c.x,c.height+18+i*7,c.z,c.w-25-i*28,7,c.d-22-i*20,'#50776a');}
    if(c.style==='engineering'){for(let dx=-65;dx<=65;dx+=65)block(c.x+dx,c.height+18,c.z-25,37,14,45,'#d0c7a9');}
    block(c.x,8,c.z+c.d/2+3,40,57,5,'#5e918f');block(c.x,5,c.z+c.d/2+26,68,4,44,'#c5c5ac');
    facadeLights(c.id,c.x,c.z,c.w,c.d,c.height,'edmonton',28);streetLabel(c.name,c.x,c.z+c.d/2+45);
    for(const side of [-1,1]){planter(c.x+side*(c.w/2-20),c.z+c.d/2+30);bench(c.x+side*50,c.z+c.d/2+60);}
  }
  // Bus shelters and café seating keep the activity on the campus streets.
  for(const [x,z]of [[675,-270],[675,-1040],[-570,-2220]]){block(x,0,z,75,4,35,'#b6b9a5');for(const a of [-1,1])block(x+a*34,0,z,4,63,4,'#59756c');block(x,63,z,85,5,43,'#456b64');block(x,9,z-13,65,43,2,'#7caaa2');bench(x,z);light(x,60,z,'edmonton',26);}
  for(const [x,z]of [[225,-210],[360,-280],[120,-2210],[-100,-2210]]){block(x,0,z,45,32,45,'#a58c63');block(x,32,z,60,5,60,'#d3bf89');bench(x-60,z);bench(x+60,z);}
  for(const route of CITY_TRAFFIC)vehicle(route);
  // Repeated angled bridge members share one draw call.
  const members=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),beams.length),dummy=new THREE.Object3D(),up=new THREE.Vector3(0,1,0);
  beams.forEach((p,i)=>{const a=new THREE.Vector3(...p.a),b=new THREE.Vector3(...p.b),v=b.clone().sub(a);dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,v.clone().normalize());dummy.scale.set(p.width,v.length(),p.width);dummy.updateMatrix();members.setMatrixAt(i,dummy.matrix);members.setColorAt(i,new THREE.Color(p.color));});members.computeBoundingSphere();addToDistrict(members,'edmonton');
  landmarks.push(...Object.entries(CITY_LANDMARKS).map(([id,p])=>({id,...p})));
  function animate(t,reduced,night=false){for(const v of traffic){const p=trafficPosition(v,reduced?0:t);v.group.position.set(p.x,1,p.z);v.lamps.visible=night;}}
  animate(0,false);return {animate,landmarks,traffic,footprints,buildingLights,campus:CAMPUS_BUILDINGS,roads:[...TORONTO_ROADS,...CAMPUS_ROADS]};
}
