import {AIRPORTS,AIRPORT_DRIVE,terminalAt} from './world-layout.js?v=17';
export function createAirportScenes({THREE,block,collision,addToDistrict,surfaceQuad,registerLight,boxGeometry}){
 const terminals=[];const flat=(x,z,w,d,c,y=.3)=>surfaceQuad([[x-w/2,y,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y,z-d/2]],c,[0,1,0]);
 function label(title,subtitle,x,y,z,width,region,rotation=0){const c=document.createElement('canvas');c.width=1024;c.height=256;const g=c.getContext('2d');g.fillStyle='#102d32';g.fillRect(0,0,1024,256);g.fillStyle='#d9efd0';g.textAlign='center';g.font='bold 70px monospace';g.fillText(title,512,110);g.fillStyle='#90cee0';g.font='31px monospace';g.fillText(subtitle,512,185);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide,toneMapped:false}));m.position.set(x,y,z);m.rotation.y=rotation;addToDistrict(m,region);}
 function wall(x,z,w,d,h,color){block(x,0,z,w,h,d,color);collision(x,z,w,d);}
 const glow=(region,x,y,z,w,h,d)=>registerLight({region,x,y,z,width:w,height:h,depth:d,glow:false,pool:false});
 for(const a of Object.values(AIRPORTS)){
  const t=a.terminal,region=a.id,ed=region==='edmonton',trim=ed?'#9d805c':'#95b8bf',roof=ed?'#355c50':'#385b74',wallColor=ed?'#c6bea2':'#bfccc9';
  flat((a.bounds.minX+a.bounds.maxX)/2,(a.bounds.minZ+a.bounds.maxZ)/2,a.bounds.maxX-a.bounds.minX,a.bounds.maxZ-a.bounds.minZ,'#aab3a0',0);
  // Concourse: two real door openings and collision walls rather than a solid box.
  block(t.x,-1,t.z,t.w+15,3,t.d+15,'#c7cbbd');block(t.x,t.height,t.z,t.w+28,8,t.d+28,roof);
  wall(t.x,t.z-t.d/2,t.w,7,t.height,wallColor);wall(t.x+t.w/2,t.z,7,t.d,t.height,wallColor);
  const halfFront=(t.w-76)/2;for(const side of [-1,1])wall(t.x+side*(38+halfFront/2),t.z+t.d/2,halfFront,7,t.height,wallColor);
  const gateZ=ed?-620:200,top=t.z-t.d/2,bottom=t.z+t.d/2;for(const [za,zb]of [[top,gateZ-43],[gateZ+43,bottom]])if(zb>za)wall(t.x-t.w/2,(za+zb)/2,7,zb-za,t.height,wallColor);
  block(t.x,t.height-24,t.z+t.d/2,80,24,9,trim);block(t.x-t.w/2,t.height-24,gateZ,9,24,88,trim);
  // Glass façade, canopy and warm interior ceiling fixtures.
  for(let dx=-t.w/2+18;dx<t.w/2;dx+=31){if(Math.abs(dx)<45)continue;block(t.x+dx,34,t.z+t.d/2+4,23,49,2,'#679da5');glow(region,t.x+dx,59,t.z+t.d/2+5.4,20,42,1);block(t.x+dx,t.height-8,t.z,4,8,t.d,trim);}
  block(t.x,t.height-4,t.z+t.d/2+35,t.w+12,8,80,roof);for(const side of [-1,1])block(t.x+side*(t.w/2-12),0,t.z+t.d/2+65,6,t.height-4,6,trim);
  for(const dx of [-75,0,75])for(const dz of [-50,50])registerLight({region,x:t.x+dx,y:t.height-6,z:t.z+dz,floor:0,width:45,height:3,depth:18});
  label(a.code+' · '+a.city.toUpperCase(),'ARRIVALS  /  DEPARTURES',t.x,t.height+28,t.z+t.d/2+5,t.w,region);
  label('CHECK IN →','TORONTO  /  GATE A1',t.x+65,92,t.z+35,105,region);
  label('GATE A1','FOLLOW THE BLUE LINE',t.x-t.w/2+9,92,gateZ,105,region,Math.PI/2);
  // Check-in desks, luggage belt, seats and security occupy the sides of the route.
  for(const dz of [-55,-15]){block(t.x+65,0,t.z+dz,80,34,24,trim);block(t.x+65,34,t.z+dz-5,48,27,4,'#234750');glow(region,t.x+65,48,t.z+dz-2.4,42,19,1);}
  for(const dz of [-85,-50]){block(t.x-70,16,t.z+dz,47,5,18,'#456b6b');block(t.x-70,21,t.z+dz-6,47,23,5,'#456b6b');for(const side of [-1,1])block(t.x-70+side*17,0,t.z+dz,4,16,10,trim);}
  for(const side of [-1,1]){block(t.x+side*29,0,t.z+66,5,88,8,'#61858a');block(t.x,84,t.z+66,63,6,10,'#71989c');}glow(region,t.x,87,t.z+69,35,3,2);
  block(t.x+95,0,t.z+75,43,23,57,'#36545a');block(t.x+95,23,t.z+75,38,3,51,'#263e43');block(t.x+100,26,t.z+80,19,18,24,'#a98e68');
  for(const dz of [-95,95]){block(t.x+110,0,t.z+dz,24,24,24,'#9a8d6b');block(t.x+110,24,t.z+dz,5,42,5,'#557956');block(t.x+110,59,t.z+dz,34,24,31,'#729768');}
  // A landside control tower and stepped hangar stay well outside aircraft movement areas.
  const towerX=t.x+t.w/2+95,towerZ=t.z-190;wall(towerX,towerZ,42,45,170,wallColor);block(towerX,170,towerZ,93,35,85,'#4f8b9a');block(towerX,205,towerZ,105,8,95,roof);glow(region,towerX,188,towerZ+43,86,26,1);glow(region,towerX-47,188,towerZ,1,26,75);
  const hx=t.x,hz=t.z-390;wall(hx,hz,235,150,105,wallColor);for(let i=0;i<5;i++)block(hx,105+i*8,hz,245-i*31,8,160,roof);block(hx,0,hz+77,155,85,3,'#63878d');glow(region,hx,78,hz+79,140,9,1);
  // Directional blue passenger paving is distinct from asphalt and taxi lines.
  const gatePoints=ed?[[-2050,-400],[-2100,-495],[-2100,-620],[-2250,-620],[-2380,-650]]:[[5430,-50],[5430,200],[5500,200],[5680,200],[5680,420],[5680,960]];
  for(let i=1;i<gatePoints.length;i++){const [x,z]=gatePoints[i-1],[xx,zz]=gatePoints[i],len=Math.hypot(xx-x,zz-z),steps=Math.ceil(len/24);for(let j=0;j<steps;j++){const f=(j+.5)/steps;flat(x+(xx-x)*f,z+(zz-z)*f,xx===x?32:len/steps+1,xx===x?len/steps+1:32,'#669ba8',1.1);}}
  // Perimeter rails deliberately leave the airside passenger gate open.
  const edge=a.airfield.maxX+(ed?20:0);for(let z=a.airfield.minZ+25;z<a.airfield.maxZ;z+=65){if(Math.abs(z-gateZ)<100)continue;block(edge,0,z,4,34,4,'#8b9e97');block(edge,24,z,3,3,62,'#9fb2aa');}
  label('PASSENGERS →','BLUE ROUTE / KEEP RUNWAY CLEAR',t.x,t.height-42,t.z+t.d/2+48,145,region);
  terminals.push({...a,footprint:t});
 }
 // A dedicated access road from campus to the western Edmonton terminal.
 for(let i=1;i<AIRPORT_DRIVE.length;i++){if(i===1)continue;const [x,z]=AIRPORT_DRIVE[i-1],[xx,zz]=AIRPORT_DRIVE[i],len=Math.hypot(xx-x,zz-z);flat((x+xx)/2,(z+zz)/2,xx===x?230:len,xx===x?len:230,'#85986f',0);flat((x+xx)/2,(z+zz)/2,xx===x?144:len,xx===x?len:144,'#3d5057',.65);for(let j=25;j<len;j+=48){const f=j/len;flat(x+(xx-x)*f,z+(zz-z)*f,xx===x?3:23,xx===x?23:3,'#e2c887',.9);}}
 label('AIRPORT TRANSFER','CAMPUS PICKUP  /  PRESS E',650,77,-300,130,'edmonton');block(650,0,-300,4,63,4,'#4b7672');
 return {terminals,terminalAt};
}
