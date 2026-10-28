'use strict';
const data=window.DCMUN;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const safeUrl=value=>{if(!value)return null;try{const u=new URL(value,location.href);return ['https:','http:'].includes(u.protocol)||u.origin===location.origin?u.href:null;}catch{return null;}};
const link=(text,url,cls)=>{const a=el('a',cls,text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;};
document.querySelector('#welcome').textContent=data.welcome;
document.querySelector('#theme').textContent=data.theme||'To be announced.';
const themeMessage=data.themeMessage||{};
document.querySelector('#theme-message-copy').textContent=themeMessage.message?.trim()||'A message about our conference theme will be shared here soon.';
const themeAuthor=document.querySelector('#theme-message-author');
if(themeMessage.name?.trim()){themeAuthor.textContent=`${themeMessage.name.trim()} · President of the General Assembly`;themeAuthor.hidden=false;}
const list=document.querySelector('#committee-list');
for(const c of data.committees){
 const resources=c.guides||c.issues;
 const resourceType=c.guides?'guide':'issue';
 const d=el('details','committee');
 const summary=el('summary');summary.append(el('span','code',c.code),el('span','committee-name',c.name),el('span','issue-count',`${resources.length} ${resourceType}${resources.length===1?'':'s'}`),el('span','plus','＋'));
 const body=el('div','committee-body');
 const deputies=(c.deputyChairs||[]).filter(name=>name.trim());
 const chairs=el('dl','chairs');
 const chairRow=(label,value)=>{const row=el('div','chair-row');row.append(el('dt','',label),el('dd','',value));chairs.append(row);};
 chairRow('Head Chair',c.headChair?.trim()||'To be announced.');
 chairRow(deputies.length===1?'Deputy Chair':'Deputy Chairs',deputies.length?deputies.join(' · '):'To be announced.');
 if(c.room)chairRow('Room',c.room);body.append(chairs);
 if(c.guides){
  c.issues.forEach(issue=>body.append(el('h3','',issue.title)));
 }
 resources.forEach((resource,i)=>{
  const row=el('div','issue');row.append(el('span','',String(i+1).padStart(2,'0')));
  const copy=el('div');copy.append(el('h3','',resource.title));
  if(c.guides)copy.append(el('p','',`Prepared by all ${c.name} chairs.`));
  else if(resource.chair)copy.append(el('p','',`Report by ${resource.chair}`));
  const url=safeUrl(resource.pdf);
  const label=c.guides?resource.title.toLowerCase():'research report';
  copy.append(url?link(`Read ${label} · PDF ↗`,url,'pdf-link'):el('span','pending',c.guides?`${resource.title} not yet available`:'Report not yet available'));
  row.append(copy);body.append(row);
 });
 d.append(summary,body);d.dataset.search=[c.code,c.name,c.headChair||'',...deputies,...c.issues.map(i=>i.title+' '+(i.chair||'')),...(c.guides||[]).map(guide=>guide.title)].join(' ').toLowerCase();list.append(d);
}
const count=document.querySelector('#count');const search=document.querySelector('#search');
function filter(){const q=search.value.trim().toLowerCase();let total=0;for(const row of list.children){row.hidden=!row.dataset.search.includes(q);if(!row.hidden)total++;}count.textContent=`${total} of ${data.committees.length} committees`;document.querySelector('#no-results').hidden=total!==0;}
search.addEventListener('input',filter);filter();
data.schedule.forEach((day,i)=>{const card=el('article','day');const top=el('div','day-top');const t=el('div');t.append(el('small','',`DAY 0${i+1}`),el('h3','',day.day),el('small','',day.date+' 2026'));top.append(t,el('span','day-num',day.date.split(' ')[0].padStart(2,'0')));card.append(top);day.events.forEach(e=>{const r=el('div','event');r.append(el('time','',e.time),el('h4','',e.title),el('p','',e.venue));card.append(r);});document.querySelector('#schedule-grid').append(card);});
const mapImage=safeUrl(data.map.image);if(mapImage){const panel=document.querySelector('#map-panel');panel.replaceChildren();const a=link('',mapImage);const img=el('img');img.src=mapImage;img.alt='Official Doha College campus map showing conference locations';a.append(img);panel.append(a);}const mapPdf=safeUrl(data.map.pdf);if(mapPdf)document.querySelector('#map-links').append(link('Open campus map · PDF ↗',mapPdf,'pdf-link'));
const menu=document.querySelector('#menu'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();}});

// Native horizontal scrolling supports touch swipes, trackpads and timed rotation.
const executiveTrack=document.querySelector('#executive-track');
const executives=(data.executives||[]).filter(person=>person.name?.trim());
const executiveControls=document.querySelector('#executive-controls');
const executiveStatus=document.querySelector('#executive-status');
const previousExecutive=document.querySelector('#executive-previous');
const nextExecutive=document.querySelector('#executive-next');
document.querySelector('#executive-empty').hidden=executives.length>0;
executiveTrack.hidden=executives.length===0;
executiveControls.hidden=executives.length<2;
executives.forEach((person,i)=>{
 const card=el('article','executive-card');
 card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');
 card.setAttribute('aria-label',`${i+1} of ${executives.length}: ${person.name}`);
 const photo=el('div','executive-photo');
 const photoUrl=safeUrl(person.photo);
 if(photoUrl){const image=el('img');image.src=photoUrl;image.alt=`Headshot of ${person.name}`;image.loading='lazy';photo.append(image);}
 else{photo.setAttribute('aria-label',`Headshot placeholder for ${person.name}`);photo.append(el('span','', 'Add headshot'));}
 const copy=el('div','executive-copy');
 copy.append(el('p','executive-role',person.role||'Executive team'),el('h3','',person.name));
 if(person.message)copy.append(el('p','executive-message',`“${person.message}”`));
 card.append(copy,photo);
 executiveTrack.append(card);
});
if(executives.length){
 let active=0;
 const carousel=document.querySelector('#executives');
 const rotationButton=document.querySelector('#executive-rotation');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=reducedMotion.matches,hovered=false,focused=false,timer;
 const syncRotation=()=>{
  clearTimeout(timer);
  const rotating=!paused&&!hovered&&!focused&&!document.hidden&&executives.length>1;
  rotationButton.textContent=paused?'Play':'Pause';
  rotationButton.setAttribute('aria-label',paused?'Start automatic rotation':'Pause automatic rotation');
  executiveStatus.setAttribute('aria-live',rotating?'off':'polite');
  if(rotating)timer=setTimeout(()=>{moveExecutive(1,true);syncRotation();},5000);
 };
 const updateExecutive=()=>{
  const left=executiveTrack.getBoundingClientRect().left;
  const cards=[...executiveTrack.children];
  active=cards.reduce((best,card,i)=>Math.abs(card.getBoundingClientRect().left-left)<Math.abs(cards[best].getBoundingClientRect().left-left)?i:best,0);
  previousExecutive.disabled=active===0;nextExecutive.disabled=active===executives.length-1;
  executiveStatus.textContent=`${active+1} / ${executives.length}`;
 };
 const moveExecutive=(direction,wrap=false)=>{
  const index=wrap?(active+direction+executives.length)%executives.length:Math.max(0,Math.min(executives.length-1,active+direction));
  const card=executiveTrack.children[index];
  executiveTrack.scrollTo({left:executiveTrack.scrollLeft+card.getBoundingClientRect().left-executiveTrack.getBoundingClientRect().left,behavior:reducedMotion.matches?'instant':'smooth'});
 };
 previousExecutive.addEventListener('click',()=>moveExecutive(-1));
 nextExecutive.addEventListener('click',()=>moveExecutive(1));
 executiveTrack.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveExecutive(event.key==='ArrowRight'?1:-1);}
 });
 executiveTrack.addEventListener('scroll',updateExecutive,{passive:true});
 rotationButton.addEventListener('click',()=>{paused=!paused;syncRotation();});
 carousel.addEventListener('mouseenter',()=>{hovered=true;syncRotation();});
 carousel.addEventListener('mouseleave',()=>{hovered=false;syncRotation();});
 carousel.addEventListener('focusin',()=>{focused=true;syncRotation();});
 carousel.addEventListener('focusout',event=>{focused=carousel.contains(event.relatedTarget);syncRotation();});
 executiveTrack.addEventListener('pointerdown',()=>{paused=true;syncRotation();});
 document.addEventListener('visibilitychange',syncRotation);
 reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches)paused=true;syncRotation();});
 window.addEventListener('resize',updateExecutive);updateExecutive();syncRotation();
}
