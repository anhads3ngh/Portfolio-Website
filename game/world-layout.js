// Shared travel coordinates. The airports are compressed, fictional game terminals.
export const AIRPORTS={
 edmonton:{id:'edmonton',code:'YEG',city:'Edmonton',x:-2600,z:-800,parking:{x:-2380,z:-800},arrivalParking:{x:-2380,z:-1150},arrival:{x:-2265,z:-950},gate:{x:-2380,z:-650},terminal:{x:-2100,z:-650,w:260,d:220,height:132},curb:{x:-2050,z:-400},bounds:{minX:-2800,maxX:-1700,minZ:-1550,maxZ:-100},airfield:{minX:-2740,maxX:-2250,minZ:-1480,maxZ:-120}},
 toronto:{id:'toronto',code:'YYZ',city:'Toronto',x:5050,z:200,parking:{x:5280,z:450},arrivalParking:{x:5280,z:-150},arrival:{x:5430,z:-50},gate:{x:5430,z:480},terminal:{x:5680,z:200,w:300,d:240,height:142},curb:{x:5680,z:420},bounds:{minX:4850,maxX:6020,minZ:-650,maxZ:1060},airfield:{minX:4900,maxX:5480,minZ:-500,maxZ:880}}
};
export const AIRPORT_DRIVE=[[504,-260],[504,-1240],[-1500,-1240],[-1500,-400],[-2050,-400]];
export const AIRPORT_RETURN_DRIVE=[...AIRPORT_DRIVE].reverse();
export function nearPolyline(x,z,points,radius){for(let i=1;i<points.length;i++){const [ax,az]=points[i-1],[bx,bz]=points[i],dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));if(Math.hypot(x-ax-dx*t,z-az-dz*t)<radius)return true;}return false;}
export function inDriveCorridor(x,z,margin=0){return nearPolyline(x,z,AIRPORT_DRIVE,100+margin);}
export function inAirportLand(x,z,margin=0){return Object.values(AIRPORTS).some(a=>x>a.bounds.minX-margin&&x<a.bounds.maxX+margin&&z>a.bounds.minZ-margin&&z<a.bounds.maxZ+margin);}
export function terminalAt(x,z){return Object.values(AIRPORTS).find(a=>Math.abs(x-a.terminal.x)<a.terminal.w/2&&Math.abs(z-a.terminal.z)<a.terminal.d/2)?.terminal;}
export const RESIDENTIAL_HOMES=Array.from({length:9},(_,i)=>({id:'neighbourhood-'+i,x:-980+(i%3)*235,z:-1080+Math.floor(i/3)*285,w:148,d:112,height:90+(i%3)*12}));
export function inNeighbourhood(x,z){return x>-1160&&x<-320&&z>-1210&&z<-350;}
export const MAIN_QUAD={x:380,z:100,w:420,d:220};
export const PATH_STYLES={home:{color:'#b69973',edge:'#e0caa6',glow:'#f5d693',label:'HOME / GARDEN WALK'},campus:{color:'#d3d3bb',edge:'#8a6856',glow:'#b4f9cc',label:'CAMPUS / STONE WALK'},airport:{color:'#709aa3',edge:'#d6e6d7',glow:'#8dddf4',label:'AIRPORT / BLUE PASSENGER ROUTE'},office:{color:'#aab8b0',edge:'#d2d1bc',glow:'#d9c1f0',label:'OFFICE / INDOOR ROUTE'}};
