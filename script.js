const grid=document.querySelector('#projects-grid'),archive=document.querySelector('#project-archive');
if(grid&&archive){
  grid.innerHTML=projects.filter(p=>p.link).map(p=>{const title=p.name.startsWith('PulseOps')?'PulseOps':p.name==='Distributed Cassandra Log Explorer'?'Cassandra Log Explorer':p.name;return `<article class="project-card featured-project ${p.fresh?'new-project':''}" data-category="${p.category}"><div class="project-body"><p class="project-label">${p.fresh?'NEW / ':''}${p.label.replace('FEATURED / ','')}</p><div class="project-headline"><h3>${title}</h3></div><p>${p.desc}</p><div class="project-tags"><span>${p.tags.join(' · ')}</span><a href="${p.link}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} on GitHub">View repository</a></div></div></article>`;}).join('');
  archive.innerHTML=projects.filter(p=>!p.link).map(p=>`<article class="project-card archive-project" data-category="${p.category}"><h3>${p.name}</h3><p>${p.desc}</p></article>`).join('');
}
const filters=[...document.querySelectorAll('.filter')];
filters.forEach(button=>button.addEventListener('click',()=>{
  const category=button.dataset.filter;let visible=0,archived=0;
  filters.forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  document.querySelectorAll('.project-card').forEach(card=>{card.hidden=category!=='all'&&card.dataset.category!==category;if(!card.hidden){visible++;if(card.classList.contains('archive-project'))archived++;card.classList.add('is-visible');}});
  document.querySelector('#filter-count').textContent=`${visible} PROJECT${visible===1?'':'S'}`;document.querySelector('.archive-heading').hidden=archived===0;grid.hidden=![...grid.children].some(card=>!card.hidden);
}));
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('.mobile-nav'),header=document.querySelector('.header');
function closeMenu(){if(!menu||!mobileNav)return;mobileNav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu?.focus({preventScroll:true});}});
document.addEventListener('click',e=>{if(header&&!header.contains(e.target))closeMenu();});
window.addEventListener('resize',()=>{if(innerWidth>850)closeMenu();},{passive:true});
const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)').matches,topButton=document.querySelector('.back-to-top'),progress=document.querySelector('.scroll-progress');let scrollQueued=false;
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;header.classList.toggle('scrolled',scrollY>15);topButton.classList.toggle('visible',scrollY>650);scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});updateScroll();
topButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reducedMotion?'auto':'smooth'}));
if('IntersectionObserver' in window&&!reducedMotion){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 25px 0px'});
  document.querySelectorAll('.play-feature,.featured-project,.archive-project,.experience-card,.section-heading').forEach(el=>{el.classList.add('reveal-ready');observer.observe(el);});
}
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
const pointerMedia=matchMedia('(hover:hover) and (pointer:fine)'),motionMedia=matchMedia('(prefers-reduced-motion:reduce)');
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
