const grid=document.querySelector('#projects-grid'),archive=document.querySelector('#project-archive');
if(grid&&archive){
  grid.innerHTML=projects.slice(0,2).map((p,i)=>{const title=i===0?'PulseOps':'Cassandra Log Explorer',description=i===0?'An event-driven reliability lab for worker failures, duplicate messages, retries, and dead-letter queues. Python, AWS, Terraform, and Docker power a simulated delivery workflow.':'A local investigation tool for synthetic logs from three simulated Cassandra nodes. Search by node, severity, or keyword through Python and SQLite, with optional Dockerized OpenSearch.';return `<article class="project-card featured-project" data-category="${p.category}"><div class="project-body"><p class="project-label">${i===0?'CLOUD INFRASTRUCTURE / AUTOMATION':'DISTRIBUTED SYSTEMS / OBSERVABILITY'}</p><div class="project-headline"><h3>${title}</h3><span>0${i+1}</span></div><p>${description}</p><div class="project-tags"><span>${i===0?'PYTHON · AWS · TERRAFORM':'PYTHON · SQLITE · DOCKER'}</span><a href="${p.link}" target="_blank" rel="noopener noreferrer" aria-label="View ${title} on GitHub">View repository ↗</a></div></div></article>`;}).join('');
  archive.innerHTML=projects.slice(2).map((p,i)=>`<article class="project-card archive-project" data-category="${p.category}"><h3><span>${String(i+3).padStart(2,'0')}</span>${p.name}</h3><p>${p.desc}</p>${p.link?`<a class="text-link" href="${p.link}" target="_blank" rel="noopener noreferrer">View repository ↗</a>`:""}</article>`).join('');
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
