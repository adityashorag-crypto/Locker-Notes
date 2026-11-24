function getMockSet(country, level, stream){
  if(country === 'general') return null;
  const c = MOCK[country];
  if(!c) return null;
  const s = c[String(level)];
  if(!s) return null;
  if(s.__streams__) return s.__streams__[stream] || null;
  return s;
}
function hasStreamsFor(country, level){
  const meta = COUNTRIES[country];
  return !!(meta && meta.streams && meta.streams.indexOf(parseInt(level,10)) !== -1);
}
function getHomework(country, level, stream){
  const c = CONTENT[country];
  if(!c) return null;
  if(country === 'general') return c.hw['all'];
  if(hasStreamsFor(country, level)) return c.hwStream[String(level)][stream];
  return c.hw[String(level)] || null;
}
function getAdvice(country, level, stream){
  const c = CONTENT[country];
  if(!c) return null;
  if(country === 'general') return c.advice['all'];
  if(hasStreamsFor(country, level)) return c.adviceStream[String(level)][stream];
  return c.advice[String(level)] || null;
}
function levelName(country, level, stream){
  const meta = COUNTRIES[country];
  if(country === 'general') return 'General \u00b7 For everyone';
  let t = levelText(meta, level);
  if(hasStreamsFor(country, level) && stream){
    const names = {science:'Science', commerce:'Commerce', arts:'Arts / Humanities'};
    t += ' \u00b7 ' + names[stream];
  }
  return t;
}


function toggleTheme(){
const cur = document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
const next = cur==='dark'?'light':'dark';
document.documentElement.setAttribute('data-theme',next);
const b=document.getElementById('themeToggleBtn');
if(b) b.textContent = next==='dark'?'\u2600\ufe0f':'\ud83c\udf19';
try{localStorage.setItem('lockerNotesTheme',next);}catch(e){}
}
(function(){const cur=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
const b=document.getElementById('themeToggleBtn'); if(b) b.textContent = cur==='dark'?'\u2600\ufe0f':'\ud83c\udf19';})();
if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});}
function initReveal(){
const els=document.querySelectorAll('.reveal:not(.in-view)');
if('IntersectionObserver' in window){
const io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target);}});},{threshold:0.15});
els.forEach(function(el){io.observe(el);});
}else{els.forEach(function(el){el.classList.add('in-view');});}
}
initReveal();

let selectedCountry = null;
let selectedBoard = null;

function renderCountries(){
const grid = document.getElementById('countryGrid');
grid.innerHTML = '';
['general','india','usa','uk','canada','ib','cambridge'].forEach(function(key){
const meta = COUNTRIES[key];
const card = document.createElement('button');
card.className = 'country-card' + (key==='general' ? ' general-card' : '') + (selectedCountry===key ? ' active' : '');
const flag = document.createElement('span');
flag.className='country-flag'; flag.textContent = meta.flag;
const nm = document.createElement('span');
nm.className='country-name';
nm.textContent = key==='general' ? 'General (For Everyone)' : meta.name;
const sub = document.createElement('span');
sub.className='country-sub';
sub.textContent = key==='general' ? 'Works for any class or country' : meta.sub;
card.appendChild(flag); card.appendChild(nm); card.appendChild(sub);
card.onclick = function(){ selectCountry(key); };
grid.appendChild(card);
});
}

function selectCountry(key){
selectedCountry = key;
selectedBoard = null;
renderCountries();
if(key === 'general'){
window.location.href = 'class.html?country=general';
return;
}
if(key === 'india'){
renderBoardPicker();
} else {
renderLevels(key, document.getElementById('levelArea'), true);
}
document.getElementById('levelArea').scrollIntoView({behavior:'smooth', block:'nearest'});
}

function renderBoardPicker(){
const area = document.getElementById('levelArea');
area.innerHTML = '';

const lbl = document.createElement('p');
lbl.className = 'step-label';
lbl.style.marginTop = '26px';
lbl.textContent = 'Step 2 \u2014 Your board';
area.appendChild(lbl);

const grid = document.createElement('div');
grid.className = 'level-grid';
[['india','CBSE / State Boards'],['icse','ICSE / ISC']].forEach(function(b){
const btn = document.createElement('a');
btn.className = 'level-btn' + (selectedBoard===b[0] ? ' active' : '');
btn.href = 'javascript:void(0)';
btn.textContent = b[1];
btn.onclick = function(){ selectedBoard = b[0]; renderBoardPicker(); };
grid.appendChild(btn);
});
area.appendChild(grid);

if(selectedBoard){
const sub = document.createElement('div');
sub.id = 'boardLevelArea';
area.appendChild(sub);
renderLevels(selectedBoard, sub, false);
}
}

function renderLevels(dataKey, area, isTopLevel){
const meta = COUNTRIES[dataKey];
if(isTopLevel) area.innerHTML = '';

const lbl = document.createElement('p');
lbl.className = 'step-label';
lbl.style.marginTop = '26px';
lbl.textContent = (isTopLevel ? 'Step 2' : 'Step 3') + ' \u2014 Your ' + meta.levelLabel.toLowerCase();
area.appendChild(lbl);

const grid = document.createElement('div');
grid.className = 'level-grid';
meta.levels.forEach(function(lv){
const a = document.createElement('a');
a.className = 'level-btn';
a.textContent = levelText(meta, lv);
a.href = 'class.html?country=' + dataKey + '&level=' + lv;
grid.appendChild(a);
});
if(isTopLevel){
const gen = document.createElement('a');
gen.className = 'level-btn general-btn';
gen.textContent = '\u2728 General (For Everyone) \u2014 not sure? Start here';
gen.href = 'class.html?country=general';
grid.appendChild(gen);
}
area.appendChild(grid);
}

function copyLink(){
navigator.clipboard.writeText('https://adityashorag-crypto.github.io/Locker-Notes/').then(function(){
const fb=document.getElementById('copyFeedback');
fb.textContent='Copied!'; setTimeout(function(){fb.textContent='';},2000);
});
}

renderCountries();

// "Continue studying": a button back to the last class page opened on this device.
(function(){
try{
const r = JSON.parse(localStorage.getItem('lockerRecent') || 'null');
const grid = document.getElementById('countryGrid');
if(!r || !grid || typeof r.href !== 'string' || !/^class\.html\?/.test(r.href)) return;
const box = document.createElement('p');
const a = document.createElement('a'); a.className = 'btn btn-solid'; a.href = r.href; a.textContent = 'Continue studying: ' + String(r.name).slice(0, 60);
box.appendChild(a); grid.parentNode.insertBefore(box, grid);
}catch(e){}
})();
