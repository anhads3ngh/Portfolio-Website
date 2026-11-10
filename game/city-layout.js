import {inAirfield} from './airspace.js?v=16';
// Compressed game districts: recognizable landmarks, with protected flight and walking corridors.
export const CITY_LANDMARKS={
 walterdale:{x:370,z:-1740,width:130,length:470,archHeight:165},
 edmontonSkyline:{x:260,z:-2570},
 cnTower:{x:3870,z:-680,height:920},
 unionStation:{x:4750,z:-430,width:210,depth:190},
 rogersCentre:{x:3850,z:-200,width:275,depth:220}
};
export const TORONTO_ROADS=[
 {name:'FRONT ST W',axis:'x',x:4280,z:25,length:1260,width:138},
 {name:'KING ST W',axis:'x',x:4270,z:-720,length:1260,width:138},
 {name:'QUEENS QUAY',axis:'x',x:4250,z:620,length:1080,width:138},
 {name:'UNIVERSITY AVE',axis:'z',x:4170,z:-60,length:1320,width:138},
 {name:'YORK ST',axis:'z',x:4680,z:-60,length:1320,width:138},
 {name:'AIRPORT ACCESS',axis:'z',x:5590,z:350,length:900,width:110}
];
export const CITY_CITIZENS=[
 ...[
  [-340,210,'Neighbour','Hey! The home workspace is just along the garden path.'],
  [620,170,'Computing student','Hi! The computer lab is open. Anhad is teaching at the front.'],
  [830,180,'Campus visitor','Welcome to Edmonton! Look for the river valley after takeoff.'],
  [845,-210,'Airport greeter','Boarding for Toronto? Follow the glowing trail to the plane.'],
  [640,-370,'Library visitor','Hi! The library, engineering pavilion and commons are all around the campus loop.'],
  [640,-880,'Engineering student','Hey! A good place to build something, then try to break it.'],
  [250,-200,'Student ambassador','Welcome to campus! Grab a seat in the commons or follow the trail to the lab.'],
  [410,-1010,'Residence student','Hi! I am heading across campus. Enjoy your visit.'],
  [-450,-2190,'Downtown commuter','Hello! Good day for a river-valley walk before catching the bus.'],
  [1160,-2190,'City visitor','Hey! The skyline looks even better when the windows light up.'],
  [90,200,'Trail walker','Hey there! Those glowing markers connect the whole story.'],
  [440,-1420,'River valley walker','Hey! Across the white arches, the downtown skyline is waiting.'],
  [270,-2160,'Edmonton visitor','Hello! This river valley is my favourite way into the city.'],
  [-710,-800,'Cyclist','Beautiful day for the river valley. Enjoy the view!'],
  [-60,-1050,'Edmonton local','Hello! Look north on your flight: Walterdale Bridge and our skyline.'],
  [630,-1090,'Ground crew','Have a great flight! Both planes park clear of the runway.']
 ].map(([x,z,name,message],i)=>({id:'edmonton-'+i,zone:'edmonton',x,z,name,message})),
 ...[
  [4430,330,'Toronto local','Welcome to Toronto! TD Terrace is straight up the glowing path.'],
  [4570,125,'Front Street commuter','Hey! Union Station, the tower, the office—everything has a story here.'],
  [4625,-75,'Office commuter','Morning! The concourse lift takes you to floor 21.'],
  [4055,140,'City explorer','Hi! That is our take on the CN Tower. Hard to miss, right?'],
  [4240,545,'Waterfront visitor','Hello! Take a moment by the waterfront before your next chapter.'],
  [4500,700,'Waterfront walker','Hey! Follow the glowing trail east for the flight back to Edmonton.'],
  [4770,760,'Airport host','Welcome back to the airstrip. Your Edmonton flight is waiting.'],
  [4790,480,'Arrivals greeter','You made it! Follow the path around the runway to downtown.'],
  [4760,120,'Union Station traveller','Hi there! New city, new chapter. Enjoy Toronto.'],
  [4000,420,'Coffee lover','Hey! Nothing like a coffee and a walk through the city.'],
  [4330,-100,'Neighbourhood guide','Welcome! Front Street is just behind you; TD Terrace is ahead.'],
  [4550,520,'After-work walker','Hi! There is always time for a little scenic detour.']
 ].map(([x,z,name,message],i)=>({id:'toronto-'+i,zone:'toronto',x,z,name,message}))
];
export function inEdmontonCity(x,z){return x>=-1350&&x<=1690&&z>=-3200&&z<=-1550;}
export function inTorontoCity(x,z){return x>=3600&&x<=6200&&z>=-1650&&z<=880;}
export function cityRiver(x,z){return x>=-1350&&x<=1690&&z>-1975&&z<-1505;}
export function runwayClear(x,z,margin=0){return ((Math.abs(x-1050)<240+margin||Math.abs(x-5050)<240+margin)&&Math.abs(z)<3200);}

export const CITY_TOWERS=[
 ...[
    [4400,-910,150,150,690,'#bfc9c5','steps'],[4630,-1240,140,155,610,'#3d5057','spire'],[4830,-1240,130,140,560,'#9b9266','gold'],
    [4100,-1300,125,135,445,'#5c7880','steps'],[3930,-1350,115,140,385,'#718d92','flat'],
    [5520,-820,135,130,540,'#6b8b98','steps'],[5750,-1040,150,155,665,'#4c6b78','spire'],[5990,-720,130,150,490,'#76949c','flat'],
    [5590,-360,120,125,395,'#b4a776','gold'],[5780,-300,140,140,435,'#748f96','flat'],[5960,-20,115,130,330,'#617f8a','steps'],
    [4050,-430,110,115,330,'#718989','flat'],[4340,-500,100,110,415,'#445e66','steps'],[4740,-850,120,125,350,'#4c6671','flat']
  ].map(a=>({...towerData(a),zone:'toronto'})),
 ...[[-180,-2630,145,150,620,'#5a8997','steps'],[40,-2730,130,145,500,'#7e9fa8','spire'],[290,-2700,125,135,390,'#a4b5ad','flat'],[560,-2630,135,145,445,'#63848d','steps'],[820,-2800,125,150,335,'#8b9c9b','flat'],[-480,-2790,145,140,315,'#9ba9a0','steps'],[-710,-2570,95,115,260,'#779595','flat'],[1320,-2750,140,145,390,'#7c999a','spire']].map(a=>({...towerData(a),zone:'edmonton'}))
];
function towerData([x,z,w,d,height,color,style]){return {x,z,w,d,height,color,style};}

export const CITY_FLIGHT_OBSTACLES=[
 ...CITY_TOWERS.map(t=>({x:t.x,z:t.z,w:t.w,d:t.d,minY:0,height:t.height+85})),
 {x:3870,z:-680,w:65,d:65,minY:0,height:646},
 {x:3870,z:-680,w:126,d:126,minY:646,height:707},
 {x:3870,z:-680,w:28,d:28,minY:707,height:920},
 {x:4750,z:-430,w:210,d:190,minY:0,height:95},
 {x:3850,z:-200,w:275,d:220,minY:0,height:80},
 {x:650,z:-2455,w:135,d:90,minY:0,height:110},
 {x:370,z:-1740,w:200,d:470,minY:0,height:190}
];

export const CAMPUS_BUILDINGS=[
 {id:'library',name:'CAMPUS LIBRARY',x:350,z:-470,w:210,d:170,height:147,color:'#b4aa8d',style:'library'},
 {id:'engineering',name:'ENGINEERING PAVILION',x:750,z:-720,w:235,d:180,height:180,color:'#8d9c99',style:'engineering'},
 {id:'commons',name:'STUDENT COMMONS',x:300,z:-80,w:190,d:140,height:103,color:'#ad8365',style:'commons'},
 {id:'residence',name:'CAMPUS RESIDENCE',x:280,z:-1050,w:175,d:155,height:215,color:'#96735d',style:'residence'}
];
export const CAMPUS_ROADS=[
 {name:'CAMPUS LOOP',axis:'z',x:540,z:-650,length:1000,width:130},
 {name:'CAMPUS AVENUE',axis:'x',x:300,z:-235,length:1050,width:110}
];
export function inCampus(x,z,margin=0){return x>150-margin&&x<890+margin&&z>-1200-margin&&z<0+margin;}
export const VEHICLE_DIMENSIONS={car:{length:168,width:66,height:62},bus:{length:290,width:78,height:96},streetcar:{length:390,width:76,height:125},bicycle:{length:76,width:28,height:92}};
export const CITY_TRAFFIC=[
 {id:'toronto-streetcar',type:'streetcar',x:4260,z:-720,axis:'x',length:1120,speed:42,phase:0,color:'#b94d42',region:'toronto'},
 ...Array.from({length:7},(_,i)=>({id:'toronto-car-'+i,type:'car',x:4270,z:25+(i%2?35:-35),axis:'x',length:1030,speed:i%2?-32:37,phase:i%2?Math.floor(i/2)*(1030/3):Math.floor(i/2)*(1030/4),color:['#ded9b8','#557383','#a46e57','#c9b56c'][i%4],region:'toronto'})),
 {id:'waterfront-car',type:'car',x:4250,z:655,axis:'x',length:790,speed:27,phase:200,color:'#8caaa1',region:'toronto'},
 ...Array.from({length:5},(_,i)=>({id:'edmonton-car-'+i,type:'car',x:170,z:-2320+(i%2?36:-36),axis:'x',length:2500,speed:i%2?-39:40,phase:i*380,color:['#cad1ba','#a56f54','#6f8b9e'][i%3],region:'edmonton'})),
 {id:'edmonton-downtown-bus',type:'bus',x:170,z:-2965,axis:'x',length:2370,speed:29,phase:420,color:'#ceba7a',region:'edmonton'},
 {id:'campus-bus',type:'bus',x:540,z:-650,axis:'z',length:650,speed:25,phase:150,color:'#7aaba4',region:'edmonton'},
 ...Array.from({length:3},(_,i)=>({id:'river-cyclist-'+i,type:'bicycle',x:170,z:-2140+(i%2?18:-18),axis:'x',length:2400,speed:i%2?-26:23,phase:i*760,color:['#8d6b9a','#d19c64','#6f8e9a'][i],region:'edmonton'}))
].map(r=>({...r,dimensions:VEHICLE_DIMENSIONS[r.type]}));
if(CITY_CITIZENS.some(c=>inAirfield(c.x,c.z,20)))throw new Error('A citizen is inside the airfield boundary.');
