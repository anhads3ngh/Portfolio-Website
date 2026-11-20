const grid=document.querySelector('#projects-grid'),archive=document.querySelector('#project-archive');
if(grid&&archive){
  grid.innerHTML=projects.filter(p=>p.link).map(p=>{const title=p.name.startsWith('PulseOps')?'PulseOps':p.name==='Distributed Cassandra Log Explorer'?'Cassandra Log Explorer':p.name;return `<article class="project-card featured-project ${p.fresh?'new-project':''}" data-category="${p.category}"><div class="project-body"><p class="project-label">${p.fresh?'NEW / ':''}${p.label.replace('FEATURED / ','')}</p><div class="project-headline"><h3>${title}</h3></div><p>${p.desc}</p><div class="project-tags"><span>${p.tags.join(' · ')}</span><a href="${p.link}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} on GitHub">View repository</a></div></div></article>`;}).join('');
  archive.innerHTML=projects.filter(p=>!p.link).map(p=>`<article class="project-card archive-project" data-category="${p.category}"><h3>${p.name}</h3><p>${p.desc}</p></article>`).join('');
}
const filters=[...document.querySelectorAll('.filter')];
filters.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;let visible=0,archived=0;
  filters.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  document.querySelectorAll('.project-card').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden){visible++;if(card.classList.contains('archive-project'))archived++;}});
  document.querySelector('#filter-count').textContent=`${visible} PROJECT${visible===1?'':'S'}`;document.querySelector('.archive-heading').hidden=archived===0;grid.hidden=![...grid.children].some(card=>!card.hidden);refreshScrollScenes();
}));
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('.mobile-nav'),header=document.querySelector('.header');
function closeMenu(){if(!menu||!mobileNav)return;mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu?.focus({preventScroll:true});}});
document.addEventListener('click',e=>{if(header&&!header.contains(e.target))closeMenu();});
window.addEventListener('resize',()=>{if(innerWidth>850)closeMenu();},{passive:true});
const scrollMotionPreference=matchMedia('(prefers-reduced-motion:reduce)'),topButton=document.querySelector('.back-to-top'),progress=document.querySelector('.scroll-progress');let scrollQueued=false;
const hero=document.querySelector('.hero'),heroContent=document.querySelector('.hero-content'),heroAtmosphere=document.querySelector('.hero-atmosphere');
let heroHeight=hero?.offsetHeight||1;
const easeScroll=value=>{const t=Math.max(0,Math.min(1,value));return t*t*(3-2*t);};
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight,y=Math.max(0,scrollY);
  progress.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;header.classList.toggle('scrolled',y>15);topButton.classList.toggle('visible',y>650);
  if(heroContent&&!scrollMotionPreference.matches&&y<heroHeight+innerHeight){
    const amount=Math.min(1,y/heroHeight),mobile=innerWidth<=650;
    const fade=easeScroll(amount/.72);heroContent.style.translate=`0 ${-fade*(mobile?24:74)}px`;heroContent.style.opacity=String(1-fade);heroContent.style.scale=String(1-fade*.045);
    heroAtmosphere.style.translate=`0 ${amount*(mobile?25:100)}px`;
  }
  updateScrollScenes();scrollQueued=false;
}
document.addEventListener('scroll',queueScrollUpdate,{passive:true,capture:true});
window.addEventListener('resize',()=>{heroHeight=hero?.offsetHeight||1;if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});
topButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:scrollMotionPreference.matches?'auto':'smooth'}));

// Fade out the previous content and scale in the next as the viewport moves.
// Cache layout positions separately from transforms to avoid feedback or layout
// reads on every scroll frame. Only nearby scenes need updating while scrolling.
const sceneUnits=[...document.querySelectorAll('.hero-footer,.intro-strip>.wrap,.section-heading,.section-intro,.work-toolbar,.featured-project,.archive-heading,.archive-project,.about-grid>div,.experience-card,.toolkit-layout>div,.contact-top,#contact-title,.contact-bottom,.footer')];
const scenePositions=new Map(),nearbyScenes=new Set();let sceneObserver=null,sceneHeaderHeight=header.offsetHeight;
function queueScrollUpdate(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}}
function resetScene(el){el.style.removeProperty('opacity');el.style.removeProperty('translate');el.style.removeProperty('scale');}
function refreshScrollScenes(){
  sceneHeaderHeight=header.offsetHeight;
  // offsetTop/offsetHeight describe the untransformed layout, including when a
  // card currently has a hover tilt or is scaling during an entrance.
  for(const el of sceneUnits){let top=0,node=el;while(node){top+=node.offsetTop;node=node.offsetParent;}scenePositions.set(el,{top,height:el.offsetHeight});}
  for(const el of sceneUnits)paintScrollScene(el);
  queueScrollUpdate();
}
function paintScrollScene(el){
  if(!sceneObserver||scrollMotionPreference.matches||el.hidden||el.contains(document.activeElement)){resetScene(el);return;}
  const box=scenePositions.get(el);if(!box||!box.height)return;
  const top=box.top-scrollY,bottom=top+box.height,entry=easeScroll((innerHeight-top)/Math.min(innerHeight*.28,box.height*.65)),exit=easeScroll((bottom-sceneHeaderHeight-12)/Math.min(innerHeight*.25,box.height*.55));
  const visibility=Math.min(entry,exit),mobile=innerWidth<=650;
  el.style.opacity=visibility.toFixed(3);el.style.translate=`0 ${((1-entry)*(mobile?18:34)-(1-exit)*(mobile?12:24)).toFixed(2)}px`;el.style.scale=(1-(1-visibility)*(mobile?.025:.065)).toFixed(4);
}
function updateScrollScenes(){for(const el of nearbyScenes)paintScrollScene(el);}
if('IntersectionObserver' in window){
  sceneUnits.forEach(el=>el.classList.add('scroll-scene'));
  sceneObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)nearbyScenes.add(entry.target);else{nearbyScenes.delete(entry.target);paintScrollScene(entry.target);}}queueScrollUpdate();},{rootMargin:'120px 0px',threshold:0});
  sceneUnits.forEach(el=>sceneObserver.observe(el));
  if('ResizeObserver' in window)new ResizeObserver(refreshScrollScenes).observe(document.querySelector('main'));
  window.addEventListener('resize',refreshScrollScenes,{passive:true});
  document.fonts?.ready.then(refreshScrollScenes);refreshScrollScenes();
}
function settleScrollMotion(){
  if(scrollMotionPreference.matches){sceneUnits.forEach(resetScene);heroContent?.style.removeProperty('translate');heroContent?.style.removeProperty('opacity');heroContent?.style.removeProperty('scale');heroAtmosphere?.style.removeProperty('translate');}
  else refreshScrollScenes();
}
scrollMotionPreference.addEventListener('change',settleScrollMotion);
document.addEventListener('focusin',event=>{const scene=event.target.closest?.('.scroll-scene');if(scene)resetScene(scene);queueScrollUpdate();});
document.addEventListener('focusout',queueScrollUpdate);updateScroll();
if('IntersectionObserver' in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.desktop-nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+entry.target.id));}),{rootMargin:'-15% 0px -65% 0px',threshold:0});document.querySelectorAll('section[id]').forEach(section=>navObserver.observe(section));}
const copyButton=document.querySelector('#copy-email'),copyStatus=document.querySelector('#copy-status');
copyButton?.addEventListener('click',async()=>{
  const email=copyButton.dataset.email;let copied=false;
  try{if(navigator.clipboard){await navigator.clipboard.writeText(email);copied=true;}}catch{}
  if(!copied){const field=document.createElement('textarea');field.value=email;field.setAttribute('readonly','');field.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(field);field.select();try{copied=document.execCommand('copy');}catch{}field.remove();copyButton.focus({preventScroll:true});}
  copyStatus.textContent=copied?'Copied. Say hello whenever you’re ready.':'You can email me at '+email;copyButton.setAttribute('aria-label',copied?'Email address copied':'Copy email address');
});
const year=document.querySelector('#current-year');if(year)year.textContent=String(new Date().getFullYear());

document.querySelectorAll('[data-project-total],[data-project-stat]').forEach(el=>el.textContent=String(projects.length));
document.querySelector('#filter-count').textContent=projects.length+' PROJECTS';

// Cursor effects only animate in response to input and settle when the pointer stops.
const pointerMedia=matchMedia('(hover:hover) and (pointer:fine)'),motionMedia=scrollMotionPreference;
const cursorRing=document.createElement('div'),cursorAura=document.createElement('div');cursorRing.className='cursor-ring';cursorAura.className='cursor-aura';cursorRing.setAttribute('aria-hidden','true');cursorAura.setAttribute('aria-hidden','true');document.body.append(cursorAura,cursorRing);
let effectsEnabled=false,pointerFrame=0,pointerTarget=null,pointerCurrent=null,activeCard=null,lastSpark=0,lastSparkPoint=null;const sparks=new Set();
function resetCard(){if(activeCard){activeCard.style.removeProperty('--tilt-x');activeCard.style.removeProperty('--tilt-y');activeCard=null;}}
function stopPointerEffects(){if(pointerFrame)cancelAnimationFrame(pointerFrame);pointerFrame=0;pointerTarget=pointerCurrent=null;lastSparkPoint=null;resetCard();document.body.classList.remove('pointer-visible');for(const spark of sparks)spark.remove();sparks.clear();}
function updatePointerPreference(){effectsEnabled=pointerMedia.matches&&!motionMedia.matches;document.body.classList.toggle('effects-enabled',effectsEnabled);if(!effectsEnabled)stopPointerEffects();}
function addSpark(x,y,now){if(now-lastSpark<42||lastSparkPoint&&Math.hypot(x-lastSparkPoint.x,y-lastSparkPoint.y)<10)return;lastSpark=now;lastSparkPoint={x,y};if(sparks.size>=10){const oldest=sparks.values().next().value;oldest.remove();sparks.delete(oldest);}const spark=document.createElement('span');spark.className='cursor-spark';spark.setAttribute('aria-hidden','true');spark.style.left=x+'px';spark.style.top=y+'px';spark.addEventListener('animationend',()=>{spark.remove();sparks.delete(spark);},{once:true});sparks.add(spark);document.body.append(spark);}
function drawPointer(now){pointerFrame=0;if(!effectsEnabled||!pointerTarget||document.hidden)return;const dx=pointerTarget.x-pointerCurrent.x,dy=pointerTarget.y-pointerCurrent.y,settled=Math.hypot(dx,dy)<.1;if(settled){pointerCurrent.x=pointerTarget.x;pointerCurrent.y=pointerTarget.y;}else{pointerCurrent.x+=dx*.23;pointerCurrent.y+=dy*.23;}
 cursorRing.style.transform=`translate3d(${pointerCurrent.x}px,${pointerCurrent.y}px,0) translate(-50%,-50%)`;cursorAura.style.transform=`translate3d(${pointerTarget.x-230}px,${pointerTarget.y-230}px,0)`;
 if(activeCard){const rect=activeCard.getBoundingClientRect(),x=Math.max(0,Math.min(rect.width,pointerTarget.x-rect.left)),y=Math.max(0,Math.min(rect.height,pointerTarget.y-rect.top));activeCard.style.setProperty('--card-x',x+'px');activeCard.style.setProperty('--card-y',y+'px');activeCard.style.setProperty('--tilt-x',((.5-y/rect.height)*3).toFixed(2)+'deg');activeCard.style.setProperty('--tilt-y',((x/rect.width-.5)*3).toFixed(2)+'deg');}
 addSpark(pointerTarget.x,pointerTarget.y,now);if(!settled)pointerFrame=requestAnimationFrame(drawPointer);
}
window.addEventListener('pointermove',event=>{if(!effectsEnabled||event.pointerType==='touch')return;pointerTarget={x:event.clientX,y:event.clientY};if(!pointerCurrent)pointerCurrent={...pointerTarget};document.body.classList.add('pointer-visible');cursorRing.classList.toggle('is-link',!!event.target.closest?.('a,button,input,textarea,select'));const card=event.target.closest?.('.featured-project')||null;if(card!==activeCard){resetCard();activeCard=card;}if(!pointerFrame)pointerFrame=requestAnimationFrame(drawPointer);},{passive:true});
document.addEventListener('pointerleave',stopPointerEffects);window.addEventListener('blur',stopPointerEffects);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopPointerEffects();});pointerMedia.addEventListener('change',updatePointerPreference);motionMedia.addEventListener('change',updatePointerPreference);updatePointerPreference();
window.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')stopPointerEffects();},{passive:true});
