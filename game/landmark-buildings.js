// Architectural landmarks built from solid, batched voxel geometry.
// The generated illustrations remain gallery references inside each building.
export function createLandmarkBuildings({THREE,block,collision,lamp,addToDistrict,registerLight,registerWater}) {
  const landmarks=[];
  const stone='#d2c3a3', trim='#eee0bb', roofGreen='#234b43', timber='#433a2b';
  const record=(id,x,z,width,depth,height)=>landmarks.push({id,type:'voxel-building',x,z,width,depth,height});
  const b=block;

  function gable(x,y,z,w,d,h,axis='x',color=roofGreen) {
    const steps=Math.ceil(h/7);
    for(let i=0;i<steps;i++) {
      const t=i/steps, ww=axis==='x'?w*(1-t):w, dd=axis==='z'?d*(1-t):d;
      b(x,y+i*7,z,Math.max(8,ww),7,Math.max(8,dd),i%3===0?'#315d4d':color);
      // Pale stone edges make the front gable legible from the path.
      if(axis==='x')for(const s of [-1,1])b(x+s*(ww/2-3),y+i*7,z+d/2+.5,7,7,4,trim);
    }
    b(x,y+steps*7,z,axis==='x'?9:w+4,5,axis==='z'?9:d+4,'#183b35');
  }

  function hip(x,y,z,w,d,h){for(let i=0,n=Math.ceil(h/7);i<n;i++)b(x,y+i*7,z,Math.max(8,w*(1-i/n)),7,Math.max(8,d*(1-i/n)),i%3?'#234b43':'#315d4d');}
  function lantern(x,z){
    b(x,0,z,25,5,25,stone);b(x,5,z,17,28,17,stone);b(x,33,z,22,4,22,timber);b(x,37,z,13,14,13,'#d6b16c');
    for(const dx of [-7,7])for(const dz of [-7,7])b(x+dx,36,z+dz,2,18,2,timber);
    b(x,53,z,24,4,24,timber);b(x,57,z,8,5,8,timber);registerLight({region:x>3500?'toronto':'edmonton',x,y:44,z,floor:0,width:14.2,height:15,depth:14.2});
  }
  function balconyTelescope(x,z){
    b(x,86,z-6,95,7,65,trim);b(x+48,93,z-6,3,25,65,timber);b(x,113,z+27,98,4,3,timber);
    for(let dx=-43;dx<=45;dx+=13)b(x+dx,93,z+27,3,20,3,timber);
    const group=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:'#d5d3bb'}),dark=new THREE.MeshLambertMaterial({color:'#354b4d'});
    for(const [dx,dz]of [[-9,8],[9,8],[0,-11]]){const leg=new THREE.Mesh(new THREE.BoxGeometry(3,28,3),dark);leg.position.set(dx,14,dz);leg.rotation.z=-dx*.03;group.add(leg);}
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(6,4,39,8),m);tube.rotation.x=Math.PI/3;tube.position.set(0,36,0);group.add(tube);
    const lens=new THREE.Mesh(new THREE.CylinderGeometry(5,5,3,8),dark);lens.rotation.x=Math.PI/3;lens.position.set(0,46.5,18.2);group.add(lens);group.position.set(x,94,z);addToDistrict(group,'edmonton');
  }

  function frontWindow(x,y,z,w=27,h=34,glass='#e5ad62',frame=timber,side=1) {
    if(glass){b(x,y-3,z,w+8,h+6,4,frame);b(x,y,z+side*2.5,w,h,2,glass);registerLight({region:x>3500?'toronto':'edmonton',x,y:y+h/2,z:z+side*4,floor:0,width:w,height:h,depth:1,glow:false});}
    b(x,y-5,z+side*5,w+14,4,9,trim);
    for(const s of [-1,1])b(x+s*(w/2+2),y-1,z+side*4,3,h+2,4,trim);
    b(x,y+h/2-1,z+side*5,w,2,3,frame);
    b(x,y,z+side*5,2,h,3,frame);
    b(x,y+h+1,z+side*4,w+10,4,6,trim);
  }

  function sideWindow(x,y,z,w=27,h=34,glass='#d7b16e',side=1) {
    b(x,y-3,z,4,h+6,w+8,timber);
    b(x+side*2.5,y,z,2,h,w,glass);registerLight({region:x>3500?'toronto':'edmonton',x:x+side*4,y:y+h/2,z,floor:0,width:1,height:h,depth:w,glow:false});
    b(x+side*5,y-5,z,9,4,w+14,trim);
    for(const s of [-1,1])b(x+side*4,y-1,z+s*(w/2+2),4,h+2,3,trim);
    b(x+side*5,y,z,3,h,2,timber);
    b(x+side*5,y+h/2-1,z,3,2,w,timber);
  }

  function entrance(x,z,{y=7,w=35,h=65}={}) {
    b(x,y,z,w+14,h+8,9,trim);
    b(x,y,z+6,w,h,5,'#503d2a');
    for(const s of [-1,1]){
      b(x+s*w*.24,y+25,z+9,w*.32,28,2,'#deb975');
      b(x+s*3,y+30,z+11,2,6,2,'#d5b767');
    }
    b(x,y,z+10,2,h,2,timber);
    // The interaction point stays outside the wall and at ground height.
    for(let i=0;i<3;i++)b(x,0,z+11+i*11,w+25+i*12,6-i*2,13,stone);
  }

  function garden(x,z,w=70) {
    b(x,0,z,w,7,22,'#8b8c70');
    b(x,7,z,w-7,14,17,'#416a3c');
    for(let i=0;i<Math.floor(w/11);i++) {
      const xx=x-w/2+8+i*11;
      b(xx,20,z,3,8,3,'#527942');
      b(xx,26,z,7,5,7,['#bd83b3','#b94842','#e9dbad','#a788c2'][i%4]);
    }
  }

  function mansion(x,z) {
    record('home',x,z,320,190,246);
    b(x,-1,z,330,8,205,'#a79e81');
    b(x,7,z-10,294,83,150,stone);b(x-67.5,90,z-10,159,54,150,stone);b(x+79.5,90,z-63,135,54,44,stone);
    for(const yy of [8,67,139])b(x,yy,z-10,302,5,157,trim);
    // Full rear elevation, side windows, and masonry courses are modeled too.
    for(let yy=25;yy<138;yy+=19){b(x,yy,z+66,292,1.5,2,'#b6a88a');b(x,yy,z-86,292,1.5,2,'#b6a88a');}
    for(const xx of [-145,145])for(let yy=8;yy<140;yy+=16)b(x+xx,yy,z-10,10,8,158,trim);
    gable(x,144,z-10,314,169,63,'z');
    // Tall left turret and projecting, glazed study on the right.
    b(x-112,7,z-27,67,190,78,stone);
    b(x-112,147,z-27,74,7,85,trim);
    for(const xx of [-133,-91])b(x+xx,155,z+14,5,40,5,timber);
    frontWindow(x-112,154,z+14,43,36,'#e7ba70');
    sideWindow(x-77,154,z-27,43,36);
    hip(x-112,197,z-27,86,97,45);
    b(x+75,7,z+18,126,83,118,stone);
    b(x+75,90,z+18,126,5,118,trim);b(x+75,95,z-38,126,74,6,stone);
    for(const xx of [15,135])b(x+xx,95,z+18,6,74,118,stone);
    b(x+75,165,z+18,126,4,118,trim);
    for(const xx of [15,135])b(x+xx,7,z+79,9,162,7,trim);
    b(x+75,84,z+81,121,5,7,trim);
    frontWindow(x+75,105,z+80,91,54,null);
    glazedStudy(x+75,z+18);
    // Large study window continues up into its gable.
    for(let i=0;i<5;i++)b(x+75,169+i*8,z+80,88-i*16,8,3,'#d5a65b');
    b(x+75,103,z+85,3,100,3,timber);
    for(const dx of [-30,30])b(x+75+dx,105,z+85,2,54,3,timber);
    gable(x+75,169,z+18,143,132,70,'x');
    // Balcony with a projecting slab, rail and evenly spaced balusters.
    b(x+75,86,z+96,140,7,39,trim);
    b(x+75,113,z+116,144,4,4,timber);
    for(let xx=10;xx<=140;xx+=13)b(x+xx,93,z+115,3,22,3,timber);
    for(const s of [-1,1]){
      b(x+75+s*70,113,z+96,3,4,40,timber);
      for(const zz of [79,96,113])b(x+75+s*70,93,z+zz,3,20,3,timber);
    }
    for(const xx of [27,144])b(x+xx,7,z+110,9,78,9,stone);
    for(const xx of [-106,-55])for(const yy of [23,88])frontWindow(x+xx,yy,z+68,29,39);
    for(const xx of [-105,-45,20,85])for(const yy of [24,91])frontWindow(x+xx,yy,z-89,29,36,'#9eaaa0',timber,-1);
    for(const zz of [-53,8])for(const yy of [23,94])sideWindow(x+149,yy,z+zz,28,36);
    for(const zz of [-53,8])for(const yy of [23,94])sideWindow(x-149,yy,z+zz,28,36,'#d7b16e',-1);
    // Stone infill and glazing sit ahead of the roof's front edge, rather than
    // disappearing behind its solid stepped slabs.
    for(let i=0;i<9;i++)b(x+75,169+i*7,z+86,143*(1-i/10)-16,7,2,stone);
    for(let i=0;i<6;i++){b(x+75,169+i*7,z+88,83-i*14,7,2,'#d5a65b');registerLight({region:'edmonton',x:x+75,y:172.5+i*7,z:z+89.2,floor:0,width:83-i*14,height:7,depth:1,glow:false});}
    b(x+75,169,z+90,3,42,2,timber);
    frontWindow(x+75,23,z+81,74,49);
    // Chimney, chimney crown, porch gable, lanterns and front door.
    b(x-30,145,z-35,21,88,24,'#b8ac91');
    for(let yy=170;yy<230;yy+=13)b(x-30,yy,z-35,23,3,26,'#817c6c');
    b(x-30,233,z-35,29,6,32,'#6b7163');
    for(const s of [-1,1])b(x+s*27,7,z+85,10,72,12,trim);
    b(x,76,z+85,70,5,44,trim);
    gable(x,81,z+85,86,48,36,'x');
    entrance(x,z+78,{w:35,h:61});
    for(const xx of [-54,150])lantern(x+xx,z+125);
    balconyTelescope(x+175,z+90);
    garden(x-108,z+130,88);garden(x+110,z+147,75);
    vines(x-141,z+72,135);vines(x-38,z+72,122);vines(x+139,z+85,156);
    garden(x-202,z+176,75);garden(x+191,z+83,78);pond(x-220,z+125);
    collision(x,z-9,300,155);
    // Warm upper windows use the same instanced night-light pool as the rooms.
    registerLight({region:'edmonton',x:x+123,y:136,z:z+49,floor:95,width:9,height:14,depth:9});
    registerLight({region:'edmonton',x:x-112,y:173,z:z+19,floor:0,width:40,height:31,depth:1});
  }

  function clock(x,y,z,rotation=0) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
    const c=canvas.getContext('2d');c.fillStyle='#eee2bb';c.fillRect(0,0,128,128);
    c.strokeStyle='#3e4e40';c.lineWidth=6;c.strokeRect(5,5,118,118);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;c.beginPath();c.moveTo(64+Math.sin(a)*44,64-Math.cos(a)*44);c.lineTo(64+Math.sin(a)*51,64-Math.cos(a)*51);c.stroke();}
    c.lineWidth=7;c.beginPath();c.moveTo(64,27);c.lineTo(64,64);c.lineTo(89,79);c.stroke();
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=new THREE.Mesh(new THREE.PlaneGeometry(37,37),new THREE.MeshLambertMaterial({map:texture}));
    face.position.set(x,y,z);face.rotation.y=rotation;addToDistrict(face,'edmonton');
  }

  function academy(x,z) {
    record('university',x,z,344,180,336);
    const brick='#925745',darkBrick='#754333';
    b(x,0,z,354,9,184,stone);
    b(x,9,z-5,330,186,156,brick);
    for(const yy of [9,70,130,187])b(x,yy,z-5,338,6,164,trim);
    for(let yy=21;yy<185;yy+=12){b(x,yy,z+74,330,1,2,darkBrick);b(x,yy,z-84,330,1,2,darkBrick);b(x+166,yy,z-5,2,1,156,darkBrick);}
    gable(x,195,z-5,346,173,45,'z');
    for(const s of [-1,1]){
      b(x+s*137,9,z+5,58,194,164,brick);
      gable(x+s*137,203,z+5,72,180,39,'x');
      for(const yy of [12,40,68,96,124,152,180])for(const dx of [-24,24])b(x+s*137+dx,yy,z+89,8,11,4,trim);
      for(const zz of [-48,5,58])for(const yy of [27,87,147])sideWindow(x+s*168,yy,z+zz,25,36,'#8eaaa0',s);
    }
    for(const xx of [-137,-87,-43,43,87,137])for(const yy of [28,88,148])frontWindow(x+xx,yy,z+(Math.abs(xx)>120?90:76),25,34,'#b1c5ae');
    for(const xx of [-135,-81,-27,27,81,135])for(const yy of [27,87,147])frontWindow(x+xx,yy,z-87,25,34,'#95aaa1',timber,-1);
    // The central clock tower has a stone entrance, louvres and a copper roof.
    b(x,9,z+24,66,264,130,brick);
    for(const dx of [-31,31])b(x+dx,9,z+91,8,268,7,trim);
    for(const yy of [78,150,207,268])b(x,yy,z+24,76,7,140,trim);
    frontWindow(x,99,z+92,25,40,'#b1c5ae');
    b(x,220,z+93,44,45,4,'#496150');
    clock(x,242,z+96);clock(x+35,242,z+24,Math.PI/2);
    for(const dx of [-20,0,20])b(x+dx,280,z+66,8,17,7,timber);
    b(x,275,z+24,64,21,84,stone);
    hip(x,295,z+24,91,111,27);
    b(x,323,z+24,7,13,7,'#bca86a');
    frontWindow(x,158,z+92,23,34,'#b7c7a3');
    for(const dx of [-37,37])for(const dz of [-36,84]){b(x+dx,273,z+dz,9,35,9,trim);b(x+dx,309,z+dz,13,5,13,trim);}
    for(const xx of [-82,82]){b(x+xx,195,z+10,40,21,75,brick);gable(x+xx,216,z+10,52,86,25,'x');frontWindow(x+xx,200,z+56,21,24);}
    for(const xx of [-113,-65,65,113])vines(x+xx,z+80,173,true);
    entrance(x,z+93,{w:35,h:65});
    for(const s of [-1,1]){
      b(x+s*43,0,z+130,5,100,5,timber);b(x+s*43,99,z+130,29,3,5,timber);
      b(x+s*43,65,z+130,22,32,3,'#2f6647');for(let i=0;i<5;i++)b(x+s*43-8+i*3,67+i*5,z+132,7,5,2,'#c1a65b');
      lantern(x+s*145,z+132);garden(x+s*92,z+138,60);
      b(x+s*110,0,z+188,62,5,19,'#777e62');
      b(x+s*110,18,z+188,62,5,19,'#836544');
      for(const dx of [-23,23])b(x+s*110+dx,0,z+188,5,18,14,timber);
    }
    collision(x,z-3,336,165);
    registerLight({region:'edmonton',x,y:46,z:z+102,floor:0,width:28,height:48,depth:1});
  }

  function td(x,z) {
    record('td',x,z,326,214,794);
    const metal='#a5babc',glass=['#266b80','#38879a','#4e9bad','#75b5c1'];
    b(x,0,z,336,9,222,'#a1a9a0');b(x,9,z,310,85,182,'#315e68');
    for(const yy of [9,48,91])b(x,yy,z,318,5,190,metal);
    for(let xx=-140;xx<=140;xx+=28){b(x+xx,15,z+93,25,69,2,'#a4b9ac');b(x+xx+13,9,z+96,3,80,5,metal);registerLight({region:'toronto',x:x+xx,y:64,z:z+95,floor:0,width:22,height:4,depth:1,glow:false});}
    for(const side of [-1,1])for(let zz=-65;zz<=65;zz+=26){b(x+side*157,15,z+zz,3,69,23,'#689fac');b(x+side*160,9,z+zz+12,3,80,3,metal);}
    // A stepped west elevation and ten faceted bays describe the reference's
    // narrowing, curved glass facade; these are actual floor volumes.
    for(let floor=0;floor<28;floor++){
      const y=97+floor*24,left=-160+floor*5,right=150,width=right-left,bay=width/10;
      for(let col=0;col<10;col++){
        const xx=left+(col+.5)*bay,u=(col+.5)/10,front=82-Math.max(0,u-.45)**2*180,depth=front+88,zz=(front-88)/2;
        b(x+xx,y,z+zz,bay+.4,23,depth,glass[(floor+col)%4]);b(x+xx,y,z+zz,bay+.8,2,depth+2,'#86a5aa');
        b(x+xx,y+4,z+front+1,bay-2,16,2,glass[(floor+col+1)%4]);b(x+xx+bay/2,y,z+front+2,1.6,24,3,metal);
        b(x+xx,y+4,z-90,bay-2,16,2,glass[(floor+col+2)%4]);
        if((floor+col)%4!==0){registerLight({region:'toronto',x:x+xx,y:y+12,z:z+front+3.5,width:bay-5,height:13,depth:1,glow:false,pool:false});registerLight({region:'toronto',x:x+xx,y:y+12,z:z-91.5,width:bay-5,height:13,depth:1,glow:false,pool:false});}
        if(floor%3===1&&(col===2||col===6||col===8)){b(x+xx,y+5,z+front+2,bay-5,9,2,'#c9b482');registerLight({region:'toronto',x:x+xx,y:y+9.5,z:z+front+3.2,floor:0,width:bay-5,height:9,depth:1,glow:false});}
        if(floor===22){b(x+xx+5,y+20,z+front+21,bay+3,5,55,'#d0d4c4');if(col%2===0)registerLight({region:'toronto',x:x+xx,y:y+18,z:z+front+39,floor:0,width:8,height:2,depth:8});}
      }
      for(let col=0;col<5;col++){const zz=-70+col*25;b(x+152,y+4,z+zz,2,16,22,glass[(floor+col)%4]);b(x+155,y,z+zz+12,3,24,1.5,metal);if((floor+col)%3!==0)registerLight({region:'toronto',x:x+153.5,y:y+12,z:z+zz,width:1,height:13,depth:19,glow:false,pool:false});}
      // West-side stepped fins and exposed stone edges continue around the back.
      b(x+left-2,y,z-3,3,24,172,'#acc3c5');
    }
    b(x+62,769,z-12,194,7,174,'#cbd5ce');
    for(let xx=-22;xx<=145;xx+=22)b(x+xx,776,z-12,6,12,174,'#c4d5d2');
    b(x,57,z+112,112,5,62,'#b9c7bc');for(const side of [-1,1])b(x+side*51,0,z+137,5,57,5,metal);
    b(x,9,z+98,43,46,4,'#b7cfb6');for(const dx of [-22,0,22])b(x+dx,9,z+102,2,46,3,'#314d4c');
    for(const side of [-1,1]){garden(x+side*122,z+146,50);lantern(x+side*180,z+130);}
    registerLight({region:'toronto',x,y:54,z:z+127,floor:0,width:88,height:2,depth:23});collision(x,z-3,318,186);
  }

  function vines(x,z,height,autumn=false){
    for(let y=19;y<height;y+=9){const offset=Math.sin(y*.16)*4;b(x+offset,y,z,3,9,3,'#596d3b');for(const side of [-1,1])if((y+side)%3)b(x+offset+side*5,y+3,z+2,7,6,4,autumn?(y%4?'#b7893b':'#ad5a35'):(y%4?'#5b7b3b':'#749343'));}
  }
  function pond(x,z){
    b(x,-1,z,110,3,117,'#597e7d');b(x,1,z,92,1,99,'#488f98');
    for(const side of [-1,1]){b(x+side*52,0,z,10,11,117,'#929a87');b(x,0,z+side*55,110,11,10,'#929a87');}
    for(const [dx,dz]of [[-22,10],[18,-16],[25,32]]){b(x+dx,2,z+dz,19,1,15,'#648b50');b(x+dx,3,z+dz,5,5,5,'#cf9fb6');}
    for(let i=0;i<3;i++){b(x-31,0,z-35-i*12,31,9+i*8,19,'#919d8b');b(x-18,8+i*8,z-34-i*12,11,2,16,'#73b5b6');}
    collision(x,z,110,117);registerWater?.({x,z,w:110,d:117});lantern(x-66,z+64);
  }
  function glazedStudy(x,z){
    b(x,95,z,112,3,110,'#a98c60');b(x,158,z,112,3,110,'#b79b69');
    b(x-38,98,z-48,27,55,9,'#896f4b');for(let shelf=0;shelf<3;shelf++)for(let i=0;i<5;i++)b(x-48+i*5,105+shelf*16,z-41,4,12,6,['#618470','#b28f55','#795d67'][i%3]);
    b(x+5,111,z+15,83,5,34,'#987950');for(const side of [-1,1])b(x+5+side*35,98,z+15,4,13,28,timber);
    for(const dx of [-15,17]){
      b(x+dx,116,z+9,3,5,4,'#51686d');b(x+dx,121,z+9,28,20,3,'#283b3d');
      const c=document.createElement('canvas');c.width=256;c.height=160;const g=c.getContext('2d');g.fillStyle='#102332';g.fillRect(0,0,256,160);g.fillStyle=dx<0?'#b9dfa2':'#99cddb';g.font='16px monospace';['BUILD / EXPLORE','def next_step():','  test_the_edges()','  keep_learning()'].forEach((v,i)=>g.fillText(v,12,30+i*31));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const panel=new THREE.Mesh(new THREE.PlaneGeometry(25,17),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));panel.position.set(x+dx,131,z+11);addToDistrict(panel,'edmonton');
    }
    b(x+5,101,z+39,21,5,18,'#3c6754');b(x+5,106,z+47,21,23,4,'#3c6754');b(x+5,98,z+39,4,3,4,timber);
    const pane=new THREE.Mesh(new THREE.PlaneGeometry(91,54),new THREE.MeshBasicMaterial({color:'#c5d6b5',transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));pane.position.set(x,132,z+65);addToDistrict(pane,'edmonton');
  }

  return {mansion,academy,td,landmarks};
}
