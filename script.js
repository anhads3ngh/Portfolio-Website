'use strict';
const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d');
const stations=[
 {name:'Habitat 01',title:'About me',x:-270,y:-120,color:'#a0ae86',type:'habitat'},
 {name:'Engineering lab',title:'Projects',x:40,y:-260,color:'#d8875e',type:'lab'},
 {name:'Mission control',title:'Experience',x:285,y:-15,color:'#b7b99d',type:'control'},
 {name:'Observatory',title:'Toolkit',x:70,y:245,color:'#91a6a4',type:'observatory'},
 {name:'Comms station',title:'Contact',x:-270,y:190,color:'#cfa66d',type:'comms'}
];
const rover={x:0,y:30,angle:0},keys=new Set(),visited=new Set();
let target=null,near=-1,width=0,height=0,scale=1,origin={x:0,y:0},last=0,clock=0,trail=[],lastTrail={x:0,y:30};
const dialog=document.querySelector('dialog'),content=document.querySelector('#station-content');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function project(x,y,z=0){return{x:(x-y)*.86,y:(x+y)*.44-z};}
function polygon(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function line(points,color,size=1,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=size;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function box(x,y,w,d,h,color,side='#aa977a',front='#c9b698',z=0){const a=project(x-w/2,y-d/2,z),b=project(x+w/2,y-d/2,z),c=project(x+w/2,y+d/2,z),d0=project(x-w/2,y+d/2,z);let top=[a,b,c,d0].map(p=>({x:p.x,y:p.y-h}));polygon([b,c,top[2],top[1]],side);polygon([c,d0,top[3],top[2]],front);polygon(top,color);}
function text(t,x,y,size=10,color='#66705c',align='center'){ctx.font=`500 ${size}px "DM Mono", monospace`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(t,x,y);}
let seed=127;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}
const rocks=Array.from({length:100},()=>({x:(random()-.5)*1120,y:(random()-.5)*1050,s:3+random()*9})).filter(r=>Math.hypot(r.x,r.y)>140&&!stations.some(s=>Math.hypot(s.x-r.x,s.y-r.y)<110));
const craters=[[-380,-300,55],[320,240,58],[-50,-400,45],[420,-190,30],[-420,70,28],[190,360,40]];
function terrain(){
 const corners=[project(-610,-540),project(610,-540),project(610,540),project(-610,540)];
 polygon(corners.map(p=>({x:p.x,y:p.y+13})),'#d2b89a');polygon(corners,'#e1cbb0');
 for(let i=-500;i<=500;i+=80){line([project(i,-520),project(i,520)],'#dcc5a8',.5);line([project(-600,i),project(600,i)],'#dcc5a8',.5);}
 craters.forEach(([x,y,r])=>{const p=project(x,y);ellipse(p.x,p.y,r,r*.47,'#d2b596');ellipse(p.x+2,p.y+3,r-5,r*.38,'#d9bea0');line([{x:p.x-r*.8,y:p.y-3},{x:p.x-r*.4,y:p.y-r*.38},{x:p.x+r*.3,y:p.y-r*.4}],'#cbb08e',2);});
 stations.forEach(s=>{const p=project(s.x,s.y),q=project(0,30);line([q,{x:p.x*.5,y:q.y},p],'#cfb592',23);line([q,{x:p.x*.5,y:q.y},p],'#e9d6ba',19);line([q,{x:p.x*.5,y:q.y},p],'#bfa783',1,[4,9]);});
 const p=project(0,30);ellipse(p.x,p.y,68,33,'#c1bba0');ellipse(p.x,p.y,62,29,'#ded8be');ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.48);ctx.beginPath();ctx.arc(0,0,48,0,Math.PI*2);ctx.strokeStyle='#f3edda';ctx.lineWidth=2;ctx.setLineDash([10,8]);ctx.stroke();ctx.restore();text('R',p.x,p.y+7,25,'#f4efde');
 rocks.forEach(r=>{const p=project(r.x,r.y);ellipse(p.x+5,p.y+3,r.s*1.4,r.s*.6,'#bba98b40');polygon([{x:p.x-r.s,y:p.y},{x:p.x-r.s*.6,y:p.y-r.s},{x:p.x+r.s*.3,y:p.y-r.s*1.3},{x:p.x+r.s,y:p.y-r.s*.2},{x:p.x+r.s*.5,y:p.y+r.s*.4}],'#c6ac8c');polygon([{x:p.x-r.s,y:p.y},{x:p.x-r.s*.6,y:p.y-r.s},{x:p.x+r.s*.3,y:p.y-r.s*1.3},{x:p.x,y:p.y}],'#d6bc9c');});
 // Rows of solar panels, a little power garden.
 for(let i=0;i<3;i++)for(let j=0;j<2;j++){const x=170+i*40,y=-170+j*36;box(x,y,31,24,10,'#536d71','#485a5d','#85928a');for(let a=-1;a<2;a++)line([project(x+a*9,y-10,10),project(x+a*9,y+10,10)],'#9fb5ac',.7);}
}
function building(s,i){const p=project(s.x,s.y);ellipse(p.x+12,p.y+10,85,39,'#7f715c20');
 const pad=[project(s.x-67,s.y-58),project(s.x+67,s.y-58),project(s.x+67,s.y+58),project(s.x-67,s.y+58)];polygon(pad,'#c5c3a7','#b5b69a');
 if(s.type==='habitat'){
 box(s.x,s.y,90,66,39,'#f4eedc','#b3b79d','#d2d5bd');box(s.x,s.y,95,70,6,'#b4c0a2','#8d9a7f','#a5b495',39);
 for(let j=0;j<3;j++)box(s.x-28+j*27,s.y+33,17,1,15,'#a6c6c2','#6e8e87','#6e8e87',13);
 box(s.x+10,s.y+38,20,15,10,'#e5dfc9','#b6b89d','#c7cab0');
 }else if(s.type==='lab'){
 box(s.x,s.y,102,76,52,'#ede7d5','#a9aea0','#d5d4bc');box(s.x,s.y,109,81,9,'#df8b60','#b46e48','#c98255',52);
 box(s.x,s.y,70,47,3,'#f0b08a','#d08d67','#e79d73',61);for(let j=0;j<3;j++)box(s.x-32+j*29,s.y+39,19,2,23,'#84a8a7','#658b8c','#789d98',15);
 box(s.x+34,s.y-19,18,18,18,'#d3d9c5','#8c9d8d','#a4b49d',64);
 }else if(s.type==='control'){
 box(s.x,s.y,88,72,54,'#d5dcc5','#a4b19a','#bcc7ae');box(s.x,s.y,95,79,7,'#a3b398','#84957d','#94a58b',54);box(s.x,s.y,64,52,26,'#ebe9d7','#a7b8a7','#c4d0bd',61);box(s.x,s.y,70,58,5,'#bbc9b2','#8fa18a','#a7b89d',87);
 for(let j=0;j<3;j++)box(s.x-27+j*26,s.y+37,18,2,17,'#9db7af','#6d8b86','#6d8b86',22);
 const q=project(s.x+16,s.y-6,94);line([q,{x:q.x,y:q.y-48}],'#68776a',2);ellipse(q.x,q.y-49,3,3,'#d9754e');
 }else if(s.type==='observatory'){
 box(s.x,s.y,85,75,23,'#c7d0c1','#92a69a','#b8c5b5');
 ellipse(p.x,p.y-24,46,25,'#8eaaa7');ctx.beginPath();ctx.ellipse(p.x,p.y-24,46,49,0,Math.PI,0);ctx.fillStyle='#b6cfca';ctx.fill();ctx.strokeStyle='#8ca9a1';ctx.lineWidth=1;ctx.stroke();line([{x:p.x,y:p.y-72},{x:p.x+9,y:p.y-61},{x:p.x+16,y:p.y-24}],'#e0e9d9',5);box(s.x,s.y+39,22,12,17,'#cdd8c7','#91a397','#a8bbab');
 }else{
 box(s.x,s.y,70,62,32,'#e2d8bb','#b6b697','#c8c5a5');box(s.x,s.y,77,69,6,'#b8c1a0','#98a183','#a8b18f',32);
 const a=project(s.x,s.y,38);line([{x:a.x-16,y:a.y},{x:a.x,y:a.y-58},{x:a.x+16,y:a.y}],'#82917d',4);ctx.save();ctx.translate(a.x,a.y-66);ctx.rotate(-.5);ctx.beginPath();ctx.ellipse(0,0,31,14,0,0,Math.PI);ctx.fillStyle='#eae8d3';ctx.fill();ctx.strokeStyle='#a9b59c';ctx.lineWidth=2;ctx.stroke();line([{x:0,y:9},{x:0,y:-17}],'#82917d',2);ellipse(0,-18,3,3,'#d87b52');ctx.restore();
 }
 // Supply crates and beacon.
 box(s.x+60,s.y+26,18,18,15,'#e0b482','#b58c63','#c9a372');box(s.x+60,s.y+48,14,14,11,'#bbc1a4','#929a7f','#a5af8b');
 const beacon=project(s.x-65,s.y+40);line([beacon,{x:beacon.x,y:beacon.y-25}],'#a49e7f',2);ellipse(beacon.x,beacon.y-26,3,3,visited.has(i)?'#819c69':'#edb577');
 const labelY=p.y+80;text(`${String(i+1).padStart(2,'0')} / ${s.title.toUpperCase()}`,p.x,labelY,10,'#586650');text(s.name,p.x,labelY+16,8,'#8e9276');
 if(near===i){ctx.beginPath();ctx.ellipse(p.x,p.y,83,43,0,0,Math.PI*2);ctx.strokeStyle='#e9f2cb';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);}
}
function drawRover(){const p=project(rover.x,rover.y);ellipse(p.x+5,p.y+7,25,12,'#7d70543d');ctx.save();ctx.translate(p.x,p.y-5);ctx.rotate(rover.angle);for(const x of [-16,16])for(const y of [-12,0,12]){ctx.fillStyle='#515c53';ctx.fillRect(x-4,y-5,8,10);ctx.fillStyle='#7b8270';ctx.fillRect(x-4,y-3,2,6);}ctx.fillStyle='#d27c4e';ctx.fillRect(-13,-19,26,37);ctx.fillStyle='#f1bb79';ctx.fillRect(-13,-19,26,9);ctx.fillStyle='#e8dfc5';ctx.fillRect(-9,-8,18,20);ctx.fillStyle='#789c99';ctx.fillRect(-7,-6,14,8);ctx.fillStyle='#d3b684';ctx.fillRect(-6,6,12,5);ctx.fillStyle='#faf4d8';ctx.fillRect(-11,-20,5,3);ctx.fillRect(6,-20,5,3);line([{x:7,y:7},{x:12,y:20}],'#677561',1.5);ellipse(12,20,2,2,'#e9b075');ctx.restore();text('YOU',p.x,p.y-38,8,'#68775f');}
function resize(){width=canvas.clientWidth;height=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
window.addEventListener('resize',resize);resize();
function layout(){if(width<700){scale=.78;const p=project(rover.x*.65,rover.y*.65);origin={x:width*.5-p.x*scale,y:height*.66-p.y*scale};}else{scale=Math.min(width/1420,height/740);origin={x:width*.61,y:height*.58};}}
function update(dt){if(dialog.open)return;let dx=0,dy=0;let sx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),sy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
 if(sx||sy){target=null;dx=sx/.86+sy/.44;dy=sy/.44-sx/.86;}else if(target){dx=target.x-rover.x;dy=target.y-rover.y;if(Math.hypot(dx,dy)<5){target=null;dx=dy=0;}}
 const dist=Math.hypot(dx,dy);if(dist){const step=(sx||sy)?145*dt:Math.min(145*dt,dist);rover.x=Math.max(-540,Math.min(540,rover.x+dx/dist*step));rover.y=Math.max(-480,Math.min(480,rover.y+dy/dist*step));const direction=project(dx,dy);rover.angle=Math.atan2(direction.y,direction.x)+Math.PI/2;if(Math.hypot(rover.x-lastTrail.x,rover.y-lastTrail.y)>10){trail.push({x:rover.x,y:rover.y});lastTrail={x:rover.x,y:rover.y};if(trail.length>180)trail.shift();}}
 near=stations.findIndex(s=>Math.hypot(s.x-rover.x,s.y-rover.y)<110);const prompt=document.querySelector('#nearby');prompt.hidden=near<0;if(near>=0)document.querySelector('#nearby-name').textContent=stations[near].name;document.querySelector('#coords').textContent=`ROVER ${Math.round(rover.x).toString().padStart(3,'0')} : ${Math.round(rover.y).toString().padStart(3,'0')}`;
}
function render(now){let dt=Math.min((now-last)/1000,.04);last=now;clock+=dt;update(dt);layout();ctx.clearRect(0,0,width,height);ctx.save();ctx.translate(origin.x,origin.y);ctx.scale(scale,scale);terrain();trail.forEach((t,i)=>{const p=project(t.x,t.y);ellipse(p.x,p.y,2,1,`rgba(139,117,83,${i/trail.length*.25})`);});if(target){const p=project(target.x,target.y);ctx.beginPath();ctx.ellipse(p.x,p.y,10+(reduced?0:Math.sin(clock*4)*2),5,0,0,Math.PI*2);ctx.strokeStyle='#6d8060';ctx.stroke();}
 const objects=stations.map((s,i)=>({depth:s.x+s.y,draw:()=>building(s,i)}));objects.push({depth:rover.x+rover.y,draw:drawRover});objects.sort((a,b)=>a.depth-b.depth).forEach(o=>o.draw());
 // Outpost flag, a welcome marker at the landing pad.
 const flag=project(-80,-20);line([flag,{x:flag.x,y:flag.y-76}],'#7c8a73',2);polygon([{x:flag.x,y:flag.y-76},{x:flag.x+35,y:flag.y-69},{x:flag.x+35,y:flag.y-49},{x:flag.x,y:flag.y-54}],'#d7794e');text('a.',flag.x+17,flag.y-58,15,'#f5e3c3');
 ctx.restore();requestAnimationFrame(render);}
requestAnimationFrame(render);
canvas.addEventListener('pointerdown',e=>{if(dialog.open)return;canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect(),px=(e.clientX-r.left-origin.x)/scale,py=(e.clientY-r.top-origin.y)/scale;const hit=stations.findIndex(s=>{const p=project(s.x,s.y);return Math.hypot((px-p.x)/1.1,py-p.y+20)<70;});if(hit>=0){openStation(hit);return;}target={x:Math.max(-540,Math.min(540,(px/.86+py/.44)/2)),y:Math.max(-480,Math.min(480,(py/.44-px/.86)/2))};});
window.addEventListener('keydown',e=>{if(dialog.open)return;const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e'].includes(k)&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();keys.add(k);if(k==='e'&&near>=0)openStation(near);}});window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();target=null;});
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});
document.querySelector('#reset').onclick=()=>{rover.x=0;rover.y=30;target=null;trail=[];keys.clear();};document.querySelector('#interact').onclick=()=>{if(near>=0)openStation(near);};
document.querySelectorAll('[data-station]').forEach(b=>b.onclick=()=>openStation(Number(b.dataset.station)));
const tags=a=>`<div class="tags">${a.map(t=>`<span>${t}</span>`).join('')}</div>`;
const card=(title,desc,tech=[],label='')=>`<article class="detail-card">${label?`<span class="eyebrow">${label}</span>`:''}<h3>${title}</h3><p>${desc}</p>${tags(tech)}</article>`;
function projectCards(category='all'){document.querySelector('#project-list').innerHTML=projects.filter(p=>category==='all'||p.category===category).map(p=>`<article class="detail-card"><h3>${p.name}</h3><p>${p.desc}</p>${p.link?`<a class="project-link" href="${p.link}" target="_blank" rel="noopener noreferrer">View on GitHub ↗</a>`:''}</article>`).join('');}
function openStation(i){keys.clear();target=null;visited.add(i);const s=stations[i];let body='';
 if(i===0)body=`<p>I’m Anhad Singh Sarna, a Computer Science student at the University of Alberta, specializing in AI and fascinated by the infrastructure that makes great products possible.</p><p>I work across software engineering, DevOps, distributed systems, and AI. I like asking “What happens when this fails?” just as much as “Can I build this?”</p><div class="stats"><div><strong>3.87</strong><small>GPA / 4.00</small></div><div><strong>2027</strong><small>GRADUATION</small></div><div><strong>11</strong><small>PROJECTS</small></div></div><div class="detail-links"><a href="assets/Anhad_Singh_Sarna_Resume.pdf" download>Download résumé ↓</a><a href="classic/">Read the classic portfolio ↗</a></div>`;
 if(i===1)body=`<p>A collection of systems built, ideas explored, and lessons learned. Select a research area below.</p><div class="filters"><button class="active" data-filter="all">All projects</button><button data-filter="devops">DevOps & systems</button><button data-filter="ai">AI & algorithms</button><button data-filter="creative">Creative</button></div><div id="project-list"></div>`;
 if(i===2)body=`<p>Learning by building, and by helping others build.</p>${card('Software Engineering Intern · TD Bank','Built Python-driven automated workflows, worked with Jenkins and Git-based CI processes, investigated backend issues using APIs, SQL and logs, and collaborated in Agile delivery cycles.',['PYTHON','JENKINS','GIT','REST APIs'],'JAN — AUG 2026')}${card('Computing Science Teaching Assistant','Teach Python and algorithmic problem solving at the University of Alberta, review code and edge cases, and mentor students. Previously served as Head TA for CMPUT 174.',['PYTHON','MENTORING','DEBUGGING'],'2024 — PRESENT')}${card('Software Development Intern · Space Copy','Worked on software in an aerospace-focused environment, translating challenging technical needs into practical development work.',['SOFTWARE','AEROSPACE'],'2025')}`;
 if(i===3)body=`<p>The tools I use to turn an idea into something that works, across professional experience, coursework, and portfolio projects.</p>${card('Write it',['Python, Java, C / C++, C#, SQL, JavaScript.'].join(''),['LANGUAGES'])}${card('Ship it','AWS, Docker, Terraform, Linux, GitHub Actions, Jenkins. Infrastructure deployments are demonstrated as configured lab projects unless otherwise noted.',['INFRASTRUCTURE'])}${card('Make it reliable','REST APIs, Git, Bitbucket, automated testing, logging, CI/CD.',['ENGINEERING'])}${card('Keep learning','PyTorch, TensorFlow, Scikit-learn, Pandas, NumPy, reinforcement learning.',['INTELLIGENCE'])}`;
 if(i===4)body=`<p>Have an idea, a role, or a good engineering problem? Let’s make it real.</p><p>Based in Edmonton, Canada. Open to 2027 opportunities in software engineering, DevOps, and intelligent systems.</p><div class="detail-links"><a href="mailto:assarna@ualberta.ca">Send a transmission ↗</a><a href="https://www.linkedin.com/in/anhad-singh-sarna-578a11255/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://github.com/anhads3ngh" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div><p>assarna@ualberta.ca</p>`;
 content.innerHTML=`<span class="eyebrow">STATION ${String(i+1).padStart(2,'0')} / ${s.name.toUpperCase()}</span><h2>${s.title}${i===4?' · Hello, Earth.':'.'}</h2>${body}`;
 if(i===1){projectCards();content.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{content.querySelectorAll('[data-filter]').forEach(f=>f.classList.toggle('active',f===b));projectCards(b.dataset.filter);});}
 document.querySelector('#progress-fill').style.width=`${visited.size/5*100}%`;document.querySelector('#progress').textContent=`${visited.size} / 5 STATIONS DISCOVERED`;document.querySelector('#mission-text').textContent=visited.size===5?'Mission complete. Let’s build something.':'A curious mind goes a long way.';document.querySelectorAll('[data-station]').forEach(b=>b.classList.toggle('visited',visited.has(Number(b.dataset.station))));document.querySelector('#nearby').hidden=true;
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
}
document.querySelector('#close-dialog').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
