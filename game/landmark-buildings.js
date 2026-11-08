// Architectural landmarks built from solid, batched voxel geometry.
// The generated illustrations remain gallery references inside each building.
export function createLandmarkBuildings({THREE,block,collision,lamp,addToDistrict,registerLight}) {
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

  function frontWindow(x,y,z,w=27,h=34,glass='#e5ad62',frame=timber,side=1) {
    b(x,y-3,z,w+8,h+6,4,frame);
    b(x,y,z+side*2.5,w,h,2,glass);
    b(x,y-5,z+side*5,w+14,4,9,trim);
    for(const s of [-1,1])b(x+s*(w/2+2),y-1,z+side*4,3,h+2,4,trim);
    b(x,y+h/2-1,z+side*5,w,2,3,frame);
    b(x,y,z+side*5,2,h,3,frame);
    b(x,y+h+1,z+side*4,w+10,4,6,trim);
  }

  function sideWindow(x,y,z,w=27,h=34,glass='#d7b16e',side=1) {
    b(x,y-3,z,4,h+6,w+8,timber);
    b(x+side*2.5,y,z,2,h,w,glass);
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
      b(xx,26,z,7,5,7,i%2?'#bd83b3':'#e3b768');
    }
  }

  function mansion(x,z) {
    record('home',x,z,320,190,246);
    b(x,-1,z,330,8,205,'#a79e81');
    b(x,7,z-10,294,137,150,stone);
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
    gable(x-112,197,z-27,86,97,45,'x');
    b(x+75,7,z+18,126,162,118,stone);
    for(const xx of [15,135])b(x+xx,7,z+79,9,162,7,trim);
    b(x+75,84,z+81,121,5,7,trim);
    frontWindow(x+75,105,z+80,91,54,'#e9b96f');
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
    for(let i=0;i<6;i++)b(x+75,169+i*7,z+88,83-i*14,7,2,'#d5a65b');
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
    for(const xx of [-54,150])lamp(x+xx,z+125);
    garden(x-108,z+130,88);garden(x+110,z+147,75);
    collision(x,z-9,300,155);
    // Warm upper windows use the same instanced night-light pool as the rooms.
    registerLight({region:'edmonton',x:x+75,y:134,z:z+84,floor:0,width:86,height:50,depth:1});
    registerLight({region:'edmonton',x:x-112,y:173,z:z+19,floor:0,width:40,height:31,depth:1});
  }

  function clock(x,y,z) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
    const c=canvas.getContext('2d');c.fillStyle='#eee2bb';c.fillRect(0,0,128,128);
    c.strokeStyle='#3e4e40';c.lineWidth=6;c.strokeRect(5,5,118,118);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;c.beginPath();c.moveTo(64+Math.sin(a)*44,64-Math.cos(a)*44);c.lineTo(64+Math.sin(a)*51,64-Math.cos(a)*51);c.stroke();}
    c.lineWidth=7;c.beginPath();c.moveTo(64,27);c.lineTo(64,64);c.lineTo(89,79);c.stroke();
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const face=new THREE.Mesh(new THREE.PlaneGeometry(37,37),new THREE.MeshLambertMaterial({map:texture}));
    face.position.set(x,y,z);addToDistrict(face,'edmonton');
  }

  function academy(x,z) {
    record('university',x,z,344,170,281);
    const brick='#925745',darkBrick='#754333';
    b(x,0,z,354,9,184,stone);
    b(x,9,z-5,330,141,156,brick);
    for(const yy of [9,70,142])b(x,yy,z-5,338,6,164,trim);
    for(let yy=21;yy<140;yy+=12){b(x,yy,z+74,330,1,2,darkBrick);b(x,yy,z-84,330,1,2,darkBrick);b(x+166,yy,z-5,2,1,156,darkBrick);}
    gable(x,150,z-5,346,173,45,'z');
    for(const s of [-1,1]){
      b(x+s*137,9,z+5,58,149,164,brick);
      gable(x+s*137,158,z+5,72,180,39,'x');
      for(const yy of [12,40,68,96,124])for(const dx of [-24,24])b(x+s*137+dx,yy,z+89,8,11,4,trim);
      for(const zz of [-48,5,58])for(const yy of [27,92])sideWindow(x+s*168,yy,z+zz,25,36,'#8eaaa0',s);
    }
    for(const xx of [-137,-87,-43,43,87,137])for(const yy of [28,94])frontWindow(x+xx,yy,z+(Math.abs(xx)>120?90:76),25,34,'#b1c5ae');
    for(const xx of [-135,-81,-27,27,81,135])for(const yy of [27,94])frontWindow(x+xx,yy,z-87,25,34,'#95aaa1',timber,-1);
    // The central clock tower has a stone entrance, louvres and a copper roof.
    b(x,9,z+24,66,209,130,brick);
    for(const dx of [-31,31])b(x+dx,9,z+91,8,213,7,trim);
    for(const yy of [78,150,213])b(x,yy,z+24,76,7,140,trim);
    frontWindow(x,99,z+92,25,40,'#b1c5ae');
    b(x,165,z+93,44,45,4,'#496150');
    clock(x,187,z+96);
    for(const dx of [-20,0,20])b(x+dx,225,z+66,8,17,7,timber);
    b(x,220,z+24,64,21,84,stone);
    gable(x,240,z+24,91,111,27,'x');
    b(x,268,z+24,7,13,7,'#bca86a');
    entrance(x,z+93,{w:35,h:65});
    for(const s of [-1,1]){
      b(x+s*43,0,z+130,8,75,8,stone);
      b(x+s*43,59,z+130,22,33,3,s<0?'#2f6647':'#c1a65b');
      lamp(x+s*145,z+132);garden(x+s*92,z+138,60);
      b(x+s*110,0,z+188,62,5,19,'#777e62');
      b(x+s*110,18,z+188,62,5,19,'#836544');
      for(const dx of [-23,23])b(x+s*110+dx,0,z+188,5,18,14,timber);
    }
    collision(x,z-3,336,165);
    registerLight({region:'edmonton',x,y:46,z:z+102,floor:0,width:28,height:48,depth:1});
  }

  function td(x,z) {
    record('td',x,z,326,214,794);
    const metal='#a5babc', glass=['#467984','#578f99','#6a9fa6','#8ab6b7'];
    b(x,0,z,316,9,214,'#a1a9a0');
    b(x,9,z,294,85,178,'#3b5c62');
    for(const yy of [9,48,91])b(x,yy,z,302,5,186,metal);
    // A glazed, two-storey concourse wraps around the podium.
    for(let xx=-126;xx<=126;xx+=28){
      b(x+xx,15,z+91,25,69,2,'#9fbfb1');b(x+xx+13,9,z+94,3,80,5,metal);
      b(x+xx,15,z-91,25,69,2,'#688f92');
    }
    for(const s of [-1,1])for(let zz=-65;zz<=65;zz+=26){b(x+s*149,15,z+zz,3,69,23,'#82a5a6');b(x+s*152,9,z+zz+12,3,80,3,metal);}
    // Successive offset floor plates form a stepped, sculpted glass tower.
    // Window strips and fins are solid geometry, consolidated into instance batches.
    for(let floor=0;floor<28;floor++) {
      const y=97+floor*24, upper=floor>20, width=upper?266:(floor<5?217+floor*5:242), depth=upper?166:158, center=upper?30:0;
      b(x+center,y,z-9,width,23,depth,glass[floor%4]);
      b(x+center,y,z-9,width+4,2,depth+4,'#78989d');
      for(let col=0;col<8;col++) {
        const dx=-width/2+(col+.5)*width/8;
        b(x+center+dx,y+4,z-9+depth/2+1,width/8-3,16,2,glass[(floor+col)%4]);
        b(x+center+dx,y+4,z-9-depth/2-1,width/8-3,16,2,glass[(floor+col+2)%4]);
        b(x+center+dx+width/16,y,z-9+depth/2+3,1.5,24,3,metal);
      }
      for(const s of [-1,1])for(let col=0;col<5;col++) {
        const dz=-depth/2+(col+.5)*depth/5;
        b(x+center+s*(width/2+1),y+4,z-9+dz,2,16,depth/5-3,glass[(floor+col+1)%4]);
        b(x+center+s*(width/2+3),y,z-9+dz+depth/10,3,24,1.5,metal);
      }
      // An inset band at floor 21 makes the office level visible from outside.
      if(floor===20)b(x+center,y+19,z-9+depth/2+3,width,3,4,'#d6c791');
    }
    // Slender side fins and the offset crown distinguish it from the skyline boxes.
    for(const dx of [-116,-67,67,116])b(x+dx,97,z+73,5,504,8,'#b9ccca');
    b(x+30,769,z-9,276,8,178,'#d5ded5');
    b(x+30,777,z-22,196,13,120,'#54767c');
    b(x+30,790,z-22,203,4,126,metal);
    // Human-scale entrance canopy and TD branding.
    b(x,57,z+106,104,5,54,'#bbc7ba');
    for(const s of [-1,1])b(x+s*48,0,z+127,4,57,4,metal);
    b(x,9,z+96,43,46,4,'#c1d3bb');
    for(const dx of [-22,0,22])b(x+dx,9,z+100,2,46,3,'#314d4c');
    b(x-75,56,z+97,34,23,4,'#287548');
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;
    const c=canvas.getContext('2d');c.fillStyle='#fff';c.font='bold 92px sans-serif';c.textAlign='center';c.fillText('TD',128,99);
    const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
    const brand=new THREE.Mesh(new THREE.PlaneGeometry(29,15),new THREE.MeshBasicMaterial({map:texture,transparent:true}));brand.position.set(x-75,68,z+100);addToDistrict(brand,'toronto');
    for(const s of [-1,1]){garden(x+s*115,z+139,49);lamp(x+s*166,z+126);}
    collision(x,z-3,298,178);
    registerLight({region:'toronto',x,y:54,z:z+121,floor:0,width:78,height:2,depth:22});
  }

  return {mansion,academy,td,landmarks};
}
