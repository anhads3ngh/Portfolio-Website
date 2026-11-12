import {RESIDENTIAL_HOMES,MAIN_QUAD} from './world-layout.js?v=17';
export function createCampusNeighbourhood({block,collision,surfaceQuad,registerLight,registerWater,sign}){
 const flat=(x,z,w,d,c,y=.4)=>surfaceQuad([[x-w/2,y,z-d/2],[x-w/2,y,z+d/2],[x+w/2,y,z+d/2],[x+w/2,y,z-d/2]],c,[0,1,0]);
 const light=(x,y,z,w,h,d)=>registerLight({region:'edmonton',x,y,z,width:w,height:h,depth:d,glow:false,pool:false});
 const q=MAIN_QUAD;flat(q.x,q.z,q.w,q.d,'#9cb778',.1);flat(q.x,120,q.w+70,34,'#d5d1ae',.6);flat(550,q.z,32,q.d,'#d5d1ae',.6);flat(200,q.z,25,q.d,'#c6b58e',.6);
 // The fountain and planting leave the home-to-lab path unobstructed.
 block(420,0,20,80,9,68,'#a5ad99');block(420,9,20,68,2,56,'#66a5a8');block(420,11,20,17,36,17,'#b7c5b3');block(420,47,20,38,6,38,'#87bfc0');collision(420,20,80,68);registerWater({x:420,z:20,w:70,d:56});light(420,48,20,24,3,24);
 for(const [x,z]of [[235,35],[520,35],[235,190],[520,190]]){block(x,17,z,63,5,20,'#9c805c');block(x,22,z-7,63,22,5,'#8e7352');for(const a of [-1,1])block(x+a*24,0,z,5,17,15,'#52685b');block(x+44,0,z,22,15,22,'#aaa58b');block(x+44,15,z,31,21,31,'#5e8255');}
 sign('MAIN QUAD','LIBRARY · SCIENCE · COMMUNITY',390,175,67,115);
 for(const x of [210,540]){block(x,0,-10,4,110,4,'#5a7568');block(x+13,65,-10,24,42,3,'#34674d');light(x+13,89,-7,20,7,1);}
 // Residential streets and front gardens turn the west side into a neighbourhood.
 flat(-740,-785,900,850,'#94ad78',0);for(const z of [-937,-652]){flat(-740,z,890,112,'#526067',.5);for(let x=-1145;x<-320;x+=50)flat(x,z,24,3,'#d5cead',.8);}
 flat(-1110,-785,84,820,'#526067',.55);
 for(const [i,h]of RESIDENTIAL_HOMES.entries()){
  flat(h.x,h.z,h.w+44,h.d+55,'#c3c2a6',.25);block(h.x,0,h.z,h.w,h.height,h.d,['#b39a7c','#b7ada0','#a78c74'][i%3]);collision(h.x,h.z,h.w,h.d);
  for(let r=0;r<7;r++)block(h.x,h.height+r*8,h.z,h.w+18-r*20,8,h.d+16,['#41685a','#59696a','#786557'][i%3]);
  for(const yy of [24,64])for(const dx of [-48,45]){block(h.x+dx,yy,h.z+h.d/2+2,28,24,3,'#789b9d');block(h.x+dx,yy,h.z-h.d/2-2,28,24,3,'#789b9d');light(h.x+dx,yy+12,h.z+h.d/2+4,25,21,1);light(h.x+dx,yy+12,h.z-h.d/2-4,25,21,1);}
  block(h.x,0,h.z+h.d/2+3,27,51,4,'#526c60');flat(h.x,h.z+93,26,68,'#d2c3a3',.8);block(h.x-87,0,h.z+77,6,31,6,'#877a5d');block(h.x-87,31,h.z+77,18,12,22,'#47776c');
  for(const a of [-1,1]){block(h.x+a*54,0,h.z+73,42,14,22,'#5c8051');block(h.x+a*54,14,h.z+73,35,7,17,i%2?'#b991ac':'#d2b479');}
  // Full-size parked cars sit parallel to the neighbourhood street.
  const cx=h.x+34,cz=h.z+128;block(cx,13,cz,158,24,62,['#77959b','#a78362','#b4ba9c'][i%3]);block(cx,37,cz,89,23,56,'#53747f');for(const a of [-1,1])for(const side of [-1,1])block(cx+a*52,1,cz+side*27,19,21,10,'#293d3b');
  if(i%3===0){block(h.x-92,0,h.z+125,5,64,5,'#647a6a');block(h.x-92,64,h.z+125,19,5,19,'#e2c88f');registerLight({region:'edmonton',x:h.x-92,y:67,z:h.z+125,width:18,height:4,depth:18});}
 }
 sign('CAMPUS NEIGHBOURHOOD','HOMES · GARDENS · EVENING WALKS',-1110,-405,70,115);
 return {homes:RESIDENTIAL_HOMES,quad:q};
}
