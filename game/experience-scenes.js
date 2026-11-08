export const ROOM_LAYOUT={
 home:{halfX:280,halfZ:230,height:190,exitZ:248,spawn:{x:120,z:175,yaw:.52,pitch:.03},poster:{x:-165,y:112,z:-222,width:175}},
 university:{halfX:490,halfZ:445,height:240,exitZ:460,eye:82,spawn:{x:0,z:405,yaw:0,pitch:.02},poster:{x:-350,y:140,z:-436,width:150}},
 concourse:{halfX:390,halfZ:345,height:220,exitZ:360,spawn:{x:0,z:275,yaw:0,pitch:.06}},
 td:{halfX:370,halfZ:340,height:200,exitZ:355,spawn:{x:110,z:255,yaw:.3,pitch:.02},poster:{x:-260,y:120,z:-328,width:145}},
 lift:{halfX:95,halfZ:115,height:165,exitZ:140,spawn:{x:0,z:55,yaw:0,pitch:.05}}
};

export function createExperienceScenes({THREE,block,addToDistrict,roomOrigins,wallPoster,chapters,boxGeometry,registerLight}){
 const actors=new Map(),animated=[],colorMaterials=new Map();let studentCount=0;
 const mat=(color)=>{if(!colorMaterials.has(color))colorMaterials.set(color,new THREE.MeshLambertMaterial({color}));return colorMaterials.get(color);};
 function cube(group,x,y,z,w,h,d,color){const m=new THREE.Mesh(boxGeometry,mat(color));m.position.set(x,y+h/2,z);m.scale.set(w,h,d);group.add(m);return m;}
 function local(o,x,y,z,w,h,d,color){block(o.x+x,(o.y||0)+y,o.z+z,w,h,d,color);}
 function codeTexture(title,lines,accent='#94e2bb',wide=false){
  const c=document.createElement('canvas');c.width=1024;c.height=wide?256:640;const g=c.getContext('2d');g.fillStyle='#0b1921';g.fillRect(0,0,1024,640);g.fillStyle='#1d303a';g.fillRect(0,0,1024,60);g.fillStyle=accent;g.font=wide?'bold 52px monospace':'bold 25px monospace';g.fillText(title,35,wide?78:40);g.font=wide?'30px monospace':'22px monospace';lines.forEach((line,i)=>{g.fillStyle=i%3===0?accent:i%3===1?'#d2d9cf':'#88b9d3';g.fillText(line,40,(wide?145:110)+i*(wide?43:44));});const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
 }
 function display(o,x,y,z,w,h,title,lines,rotation=0){const backing=new THREE.Mesh(new THREE.BoxGeometry(w+5,h+5,4),mat('#23383b'));backing.position.set(o.x+x,(o.y||0)+y,o.z+z);backing.rotation.y=rotation;addToDistrict(backing,o.id+'-room');const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:codeTexture(title,lines,'#94e2bb',w/h>2.5),toneMapped:false}));panel.position.set(o.x+x+Math.sin(rotation)*2.6,(o.y||0)+y,o.z+z+Math.cos(rotation)*2.6);panel.rotation.y=rotation;addToDistrict(panel,o.id+'-room');return panel;}
 function shell(o,id,wall='#c8bea4'){
  const l=ROOM_LAYOUT[id],x=l.halfX,z=l.halfZ,h=l.height;
  local(o,0,-7,0,x*2,7,z*2,id==='concourse'?'#bdc5bd':'#a79b7e');local(o,0,h,0,x*2,7,z*2,'#c8c2a6');
  local(o,-x,0,0,10,h,z*2,wall);local(o,x,0,0,10,h,z*2,wall);
  if(id!=='td')local(o,0,0,-z,x*2,h,10,wall);
  local(o,-(x+45)/2,0,z,x-45,h,10,wall);local(o,(x+45)/2,0,z,x-45,h,10,wall);local(o,0,125,z,90,h-125,10,wall);
  for(let a=-x+45;a<x;a+=110)for(const z0 of id==='university'?[-280,0,280]:[-95,95]){local(o,a,h-4,z0,65,3,18,'#ece7c9');registerLight({region:id+'-room',x:o.x+a,y:(o.y||0)+h-4,z:o.z+z0,floor:o.y||0,width:65,height:3,depth:18});}
 }
 function chair(o,x,z,color='#435b69',facing=1){local(o,x,24,z,34,5,32,color);local(o,x,29,z-12*facing,34,35,7,color);local(o,x,0,z,6,24,6,'#566364');local(o,x,0,z,34,3,26,'#566364');}
 function desk(o,x,z,w=115){local(o,x,43,z,w,6,52,'#ac9570');for(const a of [-1,1])local(o,x+a*(w/2-10),0,z,6,43,43,'#637275');local(o,x,49,z+14,w*.55,2,13,'#253740');}
 function plant(o,x,z){local(o,x,0,z,23,25,23,'#ac8b60');local(o,x,25,z,9,40,9,'#3b6c4e');local(o,x,48,z,38,22,30,'#608756');local(o,x-6,68,z-3,25,15,23,'#7d9a63');}
 const workstations=new Map(),npcs=[];
 function workArea(o,x,z,angle,owner,triple=false){
  const group=new THREE.Group(),parts=[],shapes=(x,y,z,w,h,d,color)=>parts.push({x,y:y+h/2,z,w,h,d,color});
  shapes(0,43,0,180,6,62,'#ac9570');for(const a of [-1,1])shapes(a*76,0,0,7,43,48,'#637275');shapes(0,49,17,65,2,14,'#263b42');shapes(50,49,20,20,1,21,'#54746d');shapes(50,50,20,7,4,11,'#d1d6c2');
  shapes(0,24,-57,35,5,31,'#405a68');shapes(0,29,-71,35,35,7,'#405a68');shapes(0,0,-57,7,24,7,'#6c7f7c');shapes(0,0,-57,38,3,30,'#6c7f7c');shapes(-65,0,-8,26,39,39,'#2d4245');
  const monitorXs=triple?[-57,0,57]:[-34,34],panels=[];
  for(const [i,mx]of monitorXs.entries()){shapes(mx,49,-11,16,3,13,'#2e4244');shapes(mx,52,-11,5,5,5,'#688179');shapes(mx,57,-11,52,30,4,'#213638');const t=codeTexture(i===0?'PYTHON / AUTOMATION':i===1?'BUILD / DELIVERY':'TERMINAL',i===0?['def build_with_care():','  validate_inputs()','  trace_the_logs()','  test_the_edges()']:['checks: passed','Jenkins · Git','API · SQL · Logs']);const plane=new THREE.Mesh(new THREE.PlaneGeometry(48,26),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));plane.position.set(mx,72,-8.5);group.add(plane);panels.push(plane);}
  const mesh=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),parts.length),d=new THREE.Object3D();parts.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.scale.set(p.w,p.h,p.d);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new THREE.Color(p.color));});mesh.computeBoundingSphere();group.add(mesh);group.position.set(o.x+x,o.y||0,o.z+z);group.rotation.y=angle;addToDistrict(group,o.id+'-room');
  const px=x-Math.sin(angle)*57,pz=z-Math.cos(angle)*57,person=avatar(owner,o,px,pz,{sitting:true,suit:owner==='td'});person.rotation.y=angle;
  workstations.set(owner,{group,person,screens:panels,angle});
 }
 function npcPerson(o,x,z,index,name,message,seated=true,facing=Math.PI){
  const group=new THREE.Group(),parts=[],p=(x,y,z,w,h,d,c)=>parts.push({x,y:y+h/2,z,w,h,d,c}),skin=['#c99a72','#9a684b','#d5b18c','#b88b64'][index%4],shirt=['#547480','#8b756e','#65836d','#7b7189','#a28c64'][index%5];
  for(const a of [-1,1]){p(a*6,5,seated?16:0,9,21,10,'#354c61');p(a*6,0,seated?19:3,10,6,15,'#263937');}p(0,28,0,24,26,16,shirt);p(-17,31,8,8,20,10,shirt);p(17,31,8,8,20,10,shirt);p(-17,27,11,8,7,10,skin);p(17,27,11,8,7,10,skin);
  const mesh=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),parts.length),d=new THREE.Object3D();parts.forEach((q,i)=>{d.position.set(q.x,q.y,q.z);d.scale.set(q.w,q.h,q.d);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new THREE.Color(q.c));});mesh.computeBoundingSphere();group.add(mesh);
  const head=new THREE.Group();cube(head,0,54,0,19,19,19,skin);cube(head,0,70,0,21,6,21,index%3?'#3b3931':'#715642');cube(head,-4,64,10,2,3,1,'#24332d');cube(head,4,64,10,2,3,1,'#24332d');group.add(head);group.position.set(o.x+x,o.y||0,o.z+z);group.rotation.y=facing;addToDistrict(group,o.id+'-room');
  npcs.push({id:o.id+'-'+index,name,message,room:o.id,x:o.x+x,z:o.z+z,head,group,base:facing});return group;
 }
 function nearbyNpc(x,z,room,radius=100){let result=null,best=radius;for(const npc of npcs){if(npc.room!==room)continue;const distance=Math.hypot(npc.x-x,npc.z-z);if(distance<best){best=distance;result=npc;}}return result;}

 function avatar(id,o,x,z,{suit=false,sitting=false,teaching=false}={}){
  const group=new THREE.Group(),parts=[];const part=(x,y,z,w,h,d,color,rz=0)=>parts.push({x,y:y+h/2,z,w,h,d,color,rz});
  const skin='#ba875d',navy='#252d54',cream='#ece4cd';
  for(const a of [-1,1]){if(sitting){part(a*7,23,9,10,9,26,suit?'#27394c':'#4c6378');part(a*7,5,21,9,20,9,suit?'#27394c':'#4c6378');part(a*7,0,24,11,6,15,'#253331');}else{part(a*7,5,0,10,24,12,suit?'#27394c':'#4c6378');part(a*7,0,3,11,6,16,'#253331');}}
  part(0,28,0,28,29,18,suit?'#27394c':navy);
  if(suit){part(0,31,9.5,11,24,1,cream);part(0,33,10.5,3.5,18,1,'#834958');part(-8,44,10,6,13,1,'#3d5162',-.3);part(8,44,10,6,13,1,'#3d5162',.3);part(10,37,10,5,8,1,'#79ad81');}
  else{for(const y of [32,48]){part(0,y,9.2,28,7,1,cream);part(0,y,-9.2,28,7,1,cream);}part(0,54,9.5,9,4,1,cream);}
  part(0,57,0,10,5,10,skin);part(0,61,0,23,23,22,skin);part(0,62,11,23,10,3,'#242b2b');part(0,70,12.5,16,3,2,'#242b2b');part(0,68,14,5,6,4,skin);part(-5,75,11.5,3,3,1,'#1b2726');part(5,75,11.5,3,3,1,'#1b2726');part(-5,79,11.5,6,2,1,'#302e2b');part(5,79,11.5,6,2,1,'#302e2b');part(0,65,13,7,1,1,'#d8b392');
  part(0,83,0,28,10,25,navy);part(0,91,-2,22,6,20,'#333b68');part(-6,84,12,15,4,2,'#424774',-.25);part(6,84,12,15,4,2,'#373f6c',.25);part(0,88,13,6,6,2,'#4b507b');
  const mesh=new THREE.InstancedMesh(boxGeometry,new THREE.MeshLambertMaterial({color:'#ffffff'}),parts.length),d=new THREE.Object3D();parts.forEach((p,i)=>{d.position.set(p.x,p.y,p.z);d.scale.set(p.w,p.h,p.d);d.rotation.z=p.rz;d.updateMatrix();mesh.setMatrixAt(i,d.matrix);mesh.setColorAt(i,new THREE.Color(p.color));});mesh.computeBoundingSphere();group.add(mesh);
  const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*19,53,0);cube(arm,0,-17,0,10,18,12,suit?'#27394c':navy);cube(arm,0,-25,0,9,9,10,suit?cream:skin);arms.push(arm);group.add(arm);}
  let mug=null;if(suit){mug=new THREE.Group();cube(mug,0,0,0,9,10,9,'#e8e6d3');cube(mug,0,9,0,7,1,7,'#604b37');cube(mug,6,2,0,4,6,3,'#e8e6d3');mug.position.set(0,-29,4);arms[1].add(mug);}
  group.position.set(o.x+x,o.y||0,o.z+z);addToDistrict(group,id+'-room');const nameCanvas=document.createElement('canvas');nameCanvas.width=512;nameCanvas.height=100;const ng=nameCanvas.getContext('2d');ng.fillStyle='#112b24';ng.fillRect(0,0,512,100);ng.fillStyle='#d3f4b0';ng.font='bold 29px monospace';ng.textAlign='center';ng.fillText('ANHAD',256,42);ng.font='17px monospace';ng.fillStyle='#c3d8bc';ng.fillText(teaching?'LET’S MAKE IT CLICK':suit?'CODE. COFFEE. REPEAT.':'BUILDING FROM HOME',256,75);const nt=new THREE.CanvasTexture(nameCanvas);nt.colorSpace=THREE.SRGBColorSpace;const nameplate=new THREE.Mesh(new THREE.PlaneGeometry(84,16),new THREE.MeshBasicMaterial({map:nt,side:THREE.DoubleSide,toneMapped:false}));nameplate.position.set(0,114,0);group.add(nameplate);actors.set(id,{group,arms,mug,suit,sitting,teaching});animated.push({id,arms,mug,suit,teaching});return group;
 }
 function buildHome(o){shell(o,'home');
  // Bedroom and workstation are one lived-in room, with space for the visitor to walk.
  local(o,160,0,-130,125,18,180,'#7f735b');local(o,160,18,-130,122,12,174,'#e6dfc7');local(o,160,30,-105,122,6,117,'#374961');local(o,160,30,-187,101,10,40,'#e9e4ce');local(o,160,0,-220,134,65,8,'#806b4b');
  local(o,250,0,-25,40,75,90,'#9a8862');for(let y=10;y<70;y+=20)local(o,228,y,-25,2,2,75,'#d3c19c');
  workArea(o,-85,-20,-.55,'home',true);plant(o,-225,-130);
  local(o,-90,0,-220,130,85,12,'#927b58');for(let h=10;h<85;h+=22)for(let i=0;i<9;i++)local(o,-145+i*13,h,-210,9,18,12,['#6c8f82','#b09464','#6d6082'][i%3]);
  // A window with a simple pixel forest view uses one texture, not another live scene.
  display(o,270,105,80,90,75,'EVENING IN EDMONTON',['  *        .','   /\\   /\\','  /__\\ /__\\','a little space to build'], -Math.PI/2);
 }
 function student(o,x,z,i,npc=false){const skin=['#d1a77c','#ad7952','#e1b993','#8c6247'][i%4],top=['#566c80','#7b8c68','#9c8062','#8a7184','#4b7779'][i%5];
  if(!npc){local(o,x,18,z+27,18,11,22,'#354c60');local(o,x,29,z+24,22,23,15,top);local(o,x,54,z+24,18,18,18,skin);local(o,x,69,z+24,20,6,20,i%3?'#443d34':'#785c42');local(o,x-15,40,z+10,8,8,30,top);local(o,x+15,40,z+10,8,8,30,top);}
  local(o,x,0,z+30,6,20,6,'#4f6265');local(o,x,21,z+30,30,5,25,'#536d76');local(o,x,26,z+42,30,27,6,'#536d76');
 }
 function buildUniversity(o){shell(o,'university','#b8c1af');local(o,0,0,-330,340,7,150,'#84977f');
  const texture=codeTexture('PYTHON LAB',['for student in classroom:','    ask_good_questions()','    trace_the_algorithm()','    test_the_edge_cases()'], '#d9ed91'),screenMat=new THREE.MeshBasicMaterial({map:texture,toneMapped:false}),screens=new THREE.InstancedMesh(new THREE.PlaneGeometry(34,23),screenMat,60),d=new THREE.Object3D();
  let i=0;for(let row=0;row<6;row++)for(let col=0;col<10;col++){const x=col<5?-365+col*75:65+(col-5)*75,z=-210+row*98;desk(o,x,z,58);const isNpc=[4,9,18,27,36,48].includes(i);student(o,x,z,i,isNpc);if(isNpc)npcPerson(o,x,z+24,i,'Computing Science student','I’m tracing this Python example. A small test case makes the edge cases easier to see.');local(o,x,49,z-8,37,27,4,'#293d43');d.position.set(o.x+x,(o.y||0)+63,o.z+z-5.5);d.updateMatrix();screens.setMatrixAt(i,d.matrix);i++;}studentCount=i;screens.computeBoundingSphere();addToDistrict(screens,'university-room');
  display(o,0,150,-435,360,150,'CMPUT / PYTHON · THINK OUT LOUD',['def explain(solution):','    break_it_into_steps()','    check_your_assumptions()','    try_an_edge_case()','    make_it_click()']);
  desk(o,-115,-320,115);display(o,-115,69,-332,57,35,'TEACHING NOTES',['Python · algorithms','Questions welcome','One step at a time']);avatar('university',o,30,-325,{teaching:true});
  for(const a of [-1,1])for(let z=-250;z<350;z+=180){local(o,a*484,70,z,4,100,120,'#7da4a3');local(o,a*481,118,z,4,5,120,'#d8decb');}
 }
 function buildConcourse(o){shell(o,'concourse','#aabbb3');
  for(let x=-300;x<=300;x+=150)for(let z=-240;z<=240;z+=120)local(o,x,.5,z,130,1,100,((x+z)/30)%2?'#c3c9bb':'#a9b8af');
  for(const a of [-1,1])for(let z=-180;z<260;z+=190){local(o,a*270,0,z,26,208,26,'#899f98');local(o,a*270,0,z,38,10,38,'#b8c3b4');}
  local(o,-245,0,-240,170,54,70,'#7c927c');local(o,-245,54,-240,180,5,78,'#d3ccb1');display(o,-245,116,-337,180,55,'COFFEE & CODE',['TAKE A MOMENT.','THEN BUILD SOMETHING.']);plant(o,-325,160);plant(o,325,160);
  for(const x of [-190,190]){local(o,x,0,90,90,24,40,'#596f66');local(o,x,24,108,90,28,8,'#596f66');}
  // A real lift bank at the end of the concourse, with a clear central entrance.
  local(o,0,0,-330,122,145,16,'#50696a');local(o,-29,0,-318,56,130,5,'#a6b7b7');local(o,29,0,-318,56,130,5,'#bdc9c5');local(o,0,132,-313,126,11,8,'#d1d9c1');display(o,0,165,-337,175,35,'LIFT / 21',['SOFTWARE ENGINEERING']);local(o,90,56,-318,17,34,7,'#536d6a');local(o,90,75,-312,8,8,2,'#b7ecb1');
  for(const x of [-110,110]){local(o,x,0,-70,12,55,60,'#829d95');local(o,x,45,-70,14,9,64,'#b2d5bc');}
 }
 function buildOffice(o){shell(o,'td','#acbcb5');
  // Floor 21 looks out across a small, culled skyline backdrop.
  local(o,0,0,-340,740,25,10,'#8b9f96');for(let x=-350;x<360;x+=85){local(o,x,25,-340,5,170,8,'#c3d3c8');local(o,x,190,-340,85,10,8,'#c3d3c8');}
  for(let i=0;i<11;i++){const x=-340+i*65,h=400+(i%4)*90;block(o.x+x,0,o.z-500,45,h,65,i%2?'#68898a':'#8a9c95');for(let y=320;y<h;y+=35)block(o.x+x,y,o.z-466,23,14,2,'#c1cbaa');}
  workArea(o,-155,-100,-.65,'td');
  for(let i=0;i<4;i++){desk(o,180,-170+i*95,110);chair(o,180,-125+i*95,'#51686b',-1);display(o,180,67,-178+i*95,43,28,'ENGINEERING',['build · test · ship']);npcPerson(o,180,-125+i*95,i,'Engineering colleague',['The CI checks passed. Let’s review the logs before shipping.','An API trace and a SQL query can tell two parts of the same story.','A clear code review helps the next engineer understand the change.','Reliable automation starts with a repeatable test.'][i]);}
  local(o,-250,0,65,110,27,44,'#667c71');local(o,-250,27,80,110,30,10,'#667c71');plant(o,315,240);plant(o,-310,-220);
  local(o,265,0,260,140,60,48,'#849a85');local(o,265,60,260,148,6,55,'#d8d2b8');local(o,260,66,260,27,32,24,'#293d43');local(o,260,98,260,25,3,23,'#738e82');npcPerson(o,205,190,4,'Coffee-break colleague','Coffee first, then one more test run.',false,Math.PI/2);npcPerson(o,-250,95,5,'Software engineer','Good handoffs start with clear notes and reproducible steps.',true,0);
 }
 function buildLift(o){shell(o,'lift','#8caaa6');for(const a of [-1,1])local(o,a*90,70,0,4,7,200,'#d3d9ca');local(o,0,0,-109,115,135,5,'#b5c6c2');local(o,0,0,-105,3,135,3,'#617e7b');display(o,0,145,-105,100,26,'LIFT · G → 21',['YOUR NEXT CHAPTER']);}
 function buildRoom(id){const o={...roomOrigins[id],id};if(id==='home')buildHome(o);if(id==='university')buildUniversity(o);if(id==='concourse')buildConcourse(o);if(id==='td')buildOffice(o);if(id==='lift')buildLift(o);if(chapters[id]?.image&&ROOM_LAYOUT[id].poster)wallPoster(o,chapters[id].image,id);}
 function animate(t,room){for(const npc of npcs)if(npc.room===room)npc.head.rotation.y=Math.sin(t*.8+npc.x)*.12;for(const a of animated){if(a.id!==room)continue;if(a.teaching){a.arms[0].rotation.x=-1.3+Math.sin(t*1.5)*.22;a.arms[0].rotation.z=-.3;a.arms[1].rotation.x=-.3;}else{a.arms[0].rotation.x=-1.05+Math.sin(t*7)*.09;const phase=(t%10)/10,sip=a.suit&&phase>.65?Math.sin((phase-.65)/.35*Math.PI):0;a.arms[1].rotation.x=-1.05-sip*1.4+(sip===0?Math.sin(t*6+.8)*.08:0);}}}
 return {buildRoom,animate,actors,workstations,npcs,nearbyNpc,get studentCount(){return studentCount;}};
}
