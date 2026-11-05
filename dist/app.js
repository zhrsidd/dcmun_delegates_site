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
data.schedule.forEach((day,i)=>{const card=el('details','day');const top=el('summary','day-top');const ranges=day.events.map(e=>e.time.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/)).filter(Boolean).map(m=>m.slice(1).map(time=>{const [hour,minute]=time.split(':').map(Number);return hour*60+minute;}));const formatTime=minutes=>`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;const first=Math.min(...ranges.map(range=>range[0]));const last=Math.max(...ranges.map(range=>range[1]));const t=el('span','day-meta');t.append(el('span','day-label',`DAY 0${i+1}`),el('span','day-name',day.day),el('span','day-date',day.date+' 2026'));if(ranges.length)t.append(el('span','day-hours',`Schedule: ${formatTime(first)}–${formatTime(last)}`));const chevron=el('span','day-chevron','⌄');chevron.setAttribute('aria-hidden','true');top.append(chevron,t);card.append(top);const events=el('div','day-events');day.events.forEach(e=>{const r=el('div','event');r.append(el('time','',e.time),el('h4','',e.title),el('p','',e.venue));events.append(r);});card.append(events);document.querySelector('#schedule-grid').append(card);});
const mapImage=safeUrl(data.map.image);const mapPdf=safeUrl(data.map.pdf);if(mapPdf)document.querySelector('#map-links').append(link('Open campus map · PDF ↗',mapPdf,'pdf-link'));
const mapPanel=document.querySelector('#map-panel'),mapTools=document.querySelector('#map-tools'),mapSearch=document.querySelector('#map-search'),mapContent=document.querySelector('#map-content');
const mapPlans={
 S2:{width:1240,height:1608,rooms:[
  ['G16',52,289,248,190],['G17',301,289,144,190],['G18',446,289,248,190],['G19',693,289,251,190],['G20',943,289,149,190],
  ['G23',448,553,249,190],['G22',696,553,250,190],['G21',945,553,147,190],
  ['G11',448,1098,258,191],['G10',704,1098,241,191],['G09',944,1098,148,191],
  ['G04',52,1367,253,188],['G05',305,1367,144,188],['G06',448,1367,258,188],['G07',704,1367,246,188],['G08',949,1367,143,188]
 ],zones:[
  ['corridor',50,479,1154,72],['corridor',447,744,138,354],['atrium',51,745,396,350],['void',585,744,619,354],['corridor',51,1289,1153,77],
  ['restroom',51,551,294,194],['restroom',51,1098,397,191],['exit',1092,289,112,190],['exit',1092,1367,112,188]
 ]},
 S4:{width:1152,height:1598,rooms:[
  ['G19',174,244,147,204],['G18',321,244,254,204],['G17',575,244,255,204],['G16',830,244,257,204],
  ['G20',55,521,267,207],['G21',322,521,253,207],
  ['G08',55,1087,267,200],['G09',322,1087,254,200],
  ['G07',174,1367,148,185],['G06',322,1367,254,185],['G05',576,1367,254,185],['G04',830,1367,257,185]
 ],zones:[
  ['corridor',54,449,1034,72],['corridor',575,521,114,207],['restroom',785,521,303,207],['atrium',689,728,399,358],
  ['corridor',54,1287,1034,79],['corridor',576,1087,113,200],['restroom',689,1087,399,200],['exit',54,244,120,204],['exit',54,1367,120,185]
 ]}
};
const svgNode=(name,attrs={},text)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',name);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,value);if(text!==undefined)n.textContent=text;return n;};
const assignedByRoom=new Map();for(const c of data.committees){const m=(c.room||'').match(/^(S2|S4)\s+(G\d+)$/i);if(m)assignedByRoom.set(`${m[1].toUpperCase()} ${m[2].toUpperCase()}`,c);}
const committeeOption=document.querySelector('#map-committee-options');for(const c of data.committees){if(c.room){const option=el('option');option.value=`${c.code} · ${c.name}`;committeeOption.append(option);}}
const pressOption=el('option');pressOption.value='Press';committeeOption.append(pressOption);
function committeeFor(building,room){return assignedByRoom.get(`${building} ${room}`);}
function clearSelected(){mapPanel.querySelectorAll('.map-room.is-selected').forEach(node=>node.classList.remove('is-selected'));}
function drawPlan(building){const plan=mapPlans[building],svg=svgNode('svg',{viewBox:`0 200 ${plan.width} ${plan.height-180}`,role:'img','aria-labelledby':`map-title-${building}`,'preserveAspectRatio':'xMidYMid meet','data-building':building});svg.append(svgNode('title',{id:`map-title-${building}`},`${building} building floor plan`));
 const flipRectX=(x,w)=>plan.width-x-w,flipX=x=>plan.width-x;
 svg.append(svgNode('rect',{x:0,y:0,width:plan.width,height:plan.height,class:'plan-background'}));
 for(const [kind,x,y,w,h] of plan.zones)svg.append(svgNode('rect',{x:flipRectX(x,w),y,width:w,height:h,class:`plan-zone ${kind}`}));
 for(const [room,x,y,w,h] of plan.rooms){const c=committeeFor(building,room),rx=flipRectX(x,w),g=svgNode('g',{class:'map-room'+(c?' has-committee':''),'data-room':room,'data-building':building});g.append(svgNode('rect',{x:rx,y,width:w,height:h,class:'room-shape'}),svgNode('text',{x:rx+24,y:y+47,class:'room-number'},room));if(c){const words=c.code.split(' '),fontSize=c.code.length>10?29:c.code.length>6?36:43,center=y+h*.58;words.forEach((word,i)=>g.append(svgNode('text',{x:rx+w/2,y:center+(i-(words.length-1)/2)*fontSize*1.48,class:'room-committee',style:`font-size:${fontSize}px`},word)));}svg.append(g);}
 const title=svgNode('text',{x:plan.width/2,y:68,class:'plan-title'},building);svg.append(title);
 if(building==='S2'){
  const ax=flipX(73),ex1=flipX(1145),ex2=flipX(1145);svg.append(svgNode('text',{x:ax,y:798,class:'atrium-label','text-anchor':'end'},'ATRIUM'),svgNode('text',{x:ex1,y:485,class:'exit-label',transform:`rotate(-90 ${ex1} 485)`},'EXIT'),svgNode('text',{x:ex2,y:1370,class:'exit-label',transform:`rotate(-90 ${ex2} 1370)`},'EXIT'));
  addFacilityDetails(svg,'S2',plan.width);addRestroomSymbols(svg,flipX(210),1180,1.05,true);
 }else{
  const ax=flipX(925),ex1=flipX(95),ex2=flipX(95);svg.append(svgNode('text',{x:ax,y:772,class:'atrium-label','text-anchor':'end'},'ATRIUM'),svgNode('text',{x:ex1,y:355,class:'exit-label',transform:`rotate(-90 ${ex1} 355)`},'EXIT'),svgNode('text',{x:ex2,y:1460,class:'exit-label',transform:`rotate(-90 ${ex2} 1460)`},'EXIT'));
  addFacilityDetails(svg,'S4',plan.width);addRestroomSymbols(svg,flipX(890),1190,.9,true);
 }
 return svg;
}
function addRestroomSymbols(svg,cx,cy,scale,mirrored=false){const group=svgNode('g',{class:'restroom-symbols',transform:`translate(${cx} ${cy}) scale(${scale})`});const people=mirrored?[[48,'#256e87'],[-48,'#78563f']]:[[-48,'#256e87'],[48,'#78563f']];for(const [x,color] of people){group.append(svgNode('circle',{cx:x,cy:-35,r:13,fill:'none',stroke:color,'stroke-width':8}),svgNode('path',{d:`M ${x} -19 L ${x} 19 M ${x} -5 L ${x-22} 14 M ${x} -5 L ${x+22} 14 M ${x} 19 L ${x-18} 51 M ${x} 19 L ${x+18} 51`,fill:'none',stroke:color,'stroke-width':8,'stroke-linecap':'round'}));}svg.append(group);}
function addFacilityDetails(svg,building,width){const line=(x1,y1,x2,y2)=>svg.append(svgNode('line',{x1:width-x1,y1,x2:width-x2,y2,class:'facility-wall'}));const label=(x,y)=>svg.append(svgNode('text',{x:width-x,y,class:'facility-label'},'RESTROOMS'));if(building==='S2'){line(137,553,137,744);line(51,625,137,625);line(137,1110,137,1288);line(350,1100,350,1288);label(157,605);label(151,1130);}else{line(866,522,866,727);line(948,522,948,727);line(1025,522,1025,727);line(785,617,1088,617);line(785,1160,1088,1160);line(1002,1087,1002,1287);label(869,574);label(718,1128);}}
function drawCombinedLayout(){
 const layout=el('div','combined-layout');
 for(const building of ['S2','S3','S4']){
  const card=el('section',`combined-building building-${building.toLowerCase()}`);
  card.dataset.building=building;
  const heading=el('div','building-heading');
  heading.append(el('h3','',building),el('span','',building==='S3'?'Press location':'Ground floor'));
  card.append(heading);
  if(building==='S3'){
   const press=el('div','press-location');
   press.append(el('span','press-mark','P'),el('strong','','Press'),el('p','','Between S2 and S4 on the campus overview.'));
   card.append(press);
  }else card.append(drawPlan(building));
  const directory=el('ul','building-directory');
  const occupants=building==='S3'?[{code:'Press',name:'Press team',room:'S3'}]:data.committees.filter(c=>(c.room||'').startsWith(building));
  for(const c of occupants){
   const row=el('li','');row.dataset.committee=c.code;
   row.append(el('strong','',c.code),el('span','',c.name),el('span','directory-room',c.room));
   directory.append(row);
  }
  card.append(directory);layout.append(card);
 }
 mapPanel.replaceChildren(layout);
}
let activeMapView='overview',mapExpanded=true;
function renderMap(view){clearSelected();if(view==='overview'){mapPanel.className='map-panel map-overview';if(mapImage){const img=el('img');img.src=mapImage;img.alt='Doha College Al Wajba campus overview map';mapPanel.replaceChildren(img);}else mapPanel.innerHTML='<div class="map-caption"><span class="map-popup-kicker">DOHA COLLEGE · AL WAJBA CAMPUS</span><strong>Campus overview</strong><p>General campus map to be added.</p></div>';return;}mapPanel.className='map-panel map-floorplan';drawCombinedLayout();}
function syncMapView(){document.querySelector('#map-guide').hidden=!mapExpanded||activeMapView!=='layout';mapContent.hidden=!mapExpanded;mapTools.hidden=!mapExpanded||activeMapView!=='layout';document.querySelectorAll('.map-view-toggle').forEach(button=>{const active=button.dataset.mapView===activeMapView;button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-expanded',String(active&&mapExpanded));});}
function setMapView(view){if(view===activeMapView){mapExpanded=!mapExpanded;}else{activeMapView=view;mapExpanded=true;renderMap(view);}syncMapView();}
function openMapView(view){if(activeMapView!==view){activeMapView=view;renderMap(view);}mapExpanded=true;syncMapView();}
document.querySelectorAll('.map-view-toggle').forEach(button=>button.addEventListener('click',()=>setMapView(button.dataset.mapView)));
function searchCommittee(value){
 const q=value.trim().toLowerCase();
 const status=document.querySelector('#map-search-status');
 mapPanel.querySelectorAll('.is-selected').forEach(node=>node.classList.remove('is-selected'));
 if(!q){status.textContent='Choose a committee to highlight its room below.';return;}
 const c=q==='press'?{code:'Press',room:'S3'}:data.committees.find(item=>item.room&&(item.code.toLowerCase()===q||item.name.toLowerCase()===q||`${item.code} · ${item.name}`.toLowerCase()===q));
 if(!c){status.textContent='No matching committee. Choose a name or code from the suggestions.';return;}
 openMapView('layout');
 const m=c.room.match(/^(S2|S4)\s+(G\d+)$/i);
 if(m)mapPanel.querySelector(`.map-room[data-building="${m[1].toUpperCase()}"][data-room="${m[2].toUpperCase()}"]`)?.classList.add('is-selected');
 const row=[...mapPanel.querySelectorAll('[data-committee]')].find(node=>node.dataset.committee===c.code);
 row?.classList.add('is-selected');
 status.textContent=`${c.code} · ${c.room}. Highlighted below.`;
 const card=row?.closest('.combined-building');
 card?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
mapSearch.addEventListener('change',()=>searchCommittee(mapSearch.value));
mapSearch.addEventListener('input',()=>{if(!mapSearch.value)searchCommittee('');});
renderMap('overview');syncMapView();
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
 if(photoUrl){const image=el('img');image.alt=`Headshot of ${person.name}`;image.loading='lazy';image.decoding='async';image.addEventListener('load',()=>photo.classList.add('is-loaded'),{once:true});photo.append(image);image.src=photoUrl;}
 else{photo.setAttribute('aria-label',`Headshot placeholder for ${person.name}`);photo.append(el('span','', 'Add headshot'));photo.classList.add('is-loaded');}
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
