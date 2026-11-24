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

function celebrate(){
const colors = ['#3E8EDE','#4CAF7D','#CE9A25','#E8543E','#8B6FCE','#FFD23F'];
for(let i = 0; i < 60; i++){
const piece = document.createElement('div');
piece.className = 'confetti-piece';
piece.style.left = (Math.random() * 100) + 'vw';
piece.style.background = colors[Math.floor(Math.random() * colors.length)];
const duration = (1.8 + Math.random() * 1.2);
piece.style.animationDuration = duration + 's';
piece.style.animationDelay = (Math.random() * 0.4) + 's';
document.body.appendChild(piece);
setTimeout(() => piece.remove(), (duration + 0.6) * 1000);
}
}

function getBestKey(cls, subj){
return 'lockerNotesBest_' + cls + '_' + subj;
}
function getBestScore(cls, subj){
try{
const v = localStorage.getItem(getBestKey(cls, subj));
return v === null ? null : parseInt(v);
}catch(e){ return null; }
}
function setBestScore(cls, subj, score){
try{ localStorage.setItem(getBestKey(cls, subj), score); }catch(e){}
}

function updateMockProgress(total){
const answered = new Set();
document.querySelectorAll('#mockTestArea input[type=radio]:checked').forEach(input => {
answered.add(input.name);
});
const fill = document.getElementById('mockProgressFill');
if(fill){
fill.style.width = (answered.size / total * 100) + '%';
}
}

function animateScoreCount(el, finalScore, total, prefixText, suffixText){
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduceMotion || finalScore === 0){
el.textContent = prefixText + finalScore + ' / ' + total + suffixText;
return;
}
let current = 0;
const stepTime = Math.max(40, 600 / finalScore);
const interval = setInterval(() => {
current++;
el.textContent = prefixText + current + ' / ' + total;
if(current >= finalScore){
clearInterval(interval);
el.textContent = prefixText + finalScore + ' / ' + total + suffixText;
}
}, stepTime);
}

function submitMockTest(){
const area = document.getElementById('mockTestArea');
const cls = area.dataset.cls;
const subj = area.dataset.subj;
const questions = document.querySelectorAll('.mock-question');
let score = 0;
questions.forEach((qDiv, qi) => {
const correct = parseInt(qDiv.dataset.correct);
const selected = qDiv.querySelector('input[name="mockq' + qi + '"]:checked');
const labels = qDiv.querySelectorAll('.mock-option');
labels.forEach((label, oi) => {
label.classList.remove('correct', 'incorrect');
if(oi === correct){
label.classList.add('correct');
} else if(selected && parseInt(selected.value) === oi){
label.classList.add('incorrect');
}
});
if(selected && parseInt(selected.value) === correct){
score++;
}
});

const prevBest = getBestScore(cls, subj);
const isNewBest = prevBest === null || score > prevBest;
if(isNewBest){
setBestScore(cls, subj, score);
}

const resultBox = document.getElementById('mockResult');
const isPerfect = score === questions.length;
resultBox.className = 'mock-result visible' + (isPerfect ? ' perfect' : '');

let prefixText, suffixText;
if(isPerfect){
prefixText = '🎉 Perfect score! ';
suffixText = '';
celebrate();
} else if(isNewBest){
prefixText = 'You scored ';
suffixText = ' — 🏆 New best!';
} else {
prefixText = 'You scored ';
suffixText = '';
}
animateScoreCount(resultBox, score, questions.length, prefixText, suffixText);
resultBox.scrollIntoView({behavior:'smooth', block:'center'});
}

// ---------- Quick Answers search ----------
const qaData = [
{tag:"math", q:"How do I add fractions?", a:"Find a common denominator, convert each fraction to it, then add the numerators and keep that denominator.", keywords:["fraction","fractions","denominator","add"]},
{tag:"math", q:"What is the order of operations?", a:"PEMDAS: Parentheses, Exponents, Multiplication/Division (left to right), then Addition/Subtraction (left to right).", keywords:["pemdas","order of operations","bodmas"]},
{tag:"math", q:"How do I solve for x in a simple equation?", a:"Do the same operation to both sides to isolate x — whatever you add, subtract, multiply, or divide on one side, do to the other too.", keywords:["solve for x","algebra","equation","isolate"]},
{tag:"math", q:"What is a prime number?", a:"A number greater than 1 that's only divisible by 1 and itself — like 2, 3, 5, 7, 11.", keywords:["prime number","prime","factors"]},
{tag:"sci", q:"What is photosynthesis?", a:"Plants use sunlight, water, and carbon dioxide to make their own food (glucose), releasing oxygen as a byproduct.", keywords:["photosynthesis","plants","chlorophyll"]},
{tag:"sci", q:"What's the difference between speed and velocity?", a:"Speed is how fast something is moving. Velocity is speed plus direction.", keywords:["speed","velocity","physics"]},
{tag:"sci", q:"What are the states of matter?", a:"Solid, liquid, and gas are the main three — particles are tightly packed in solids, loosely connected in liquids, and spread out in gases.", keywords:["states of matter","solid","liquid","gas"]},
{tag:"sci", q:"What is Newton's third law?", a:"For every action, there's an equal and opposite reaction — when you push on something, it pushes back on you just as hard.", keywords:["newton","third law","physics"]},
{tag:"eng", q:"How do I start an essay introduction?", a:"Hook the reader with a question, fact, or short story, then state your main idea in one clear sentence.", keywords:["essay","introduction","intro","thesis"]},
{tag:"eng", q:"What's the difference between a metaphor and a simile?", a:"A simile compares using 'like' or 'as.' A metaphor says one thing IS another, without 'like' or 'as.'", keywords:["metaphor","simile","figurative language"]},
{tag:"eng", q:"What's the difference between affect and effect?", a:"'Affect' is usually a verb (to influence something). 'Effect' is usually a noun (the result of something).", keywords:["affect","effect","grammar"]},
{tag:"hist", q:"How do I remember historical dates?", a:"Link each date to a story or image, and place events on a timeline instead of memorizing them in isolation.", keywords:["dates","history","memorize","timeline"]},
{tag:"hist", q:"What caused World War I?", a:"A mix of alliances, militarism, and nationalism — the immediate spark was the assassination of Archduke Franz Ferdinand in 1914.", keywords:["world war 1","ww1","causes"]},
{tag:"life", q:"How do I deal with exam stress?", a:"Break your revision into small chunks, take real breaks, and remember that one test doesn't decide everything.", keywords:["stress","exam","anxious","nervous","test anxiety"]},
{tag:"life", q:"How do I make new friends at school?", a:"Start small — ask someone about something they're into, join a club, and give it time. Most friendships build slowly.", keywords:["friends","lonely","shy","social"]},
{tag:"life", q:"How do I manage my time better?", a:"Write down your 3 most important tasks each day before anything else, and tackle the hardest one first while your energy is highest.", keywords:["time management","procrastinate","organize"]},
{tag:"life", q:"How do I stay motivated?", a:"Break big goals into small, specific tasks — motivation usually follows action, not the other way around.", keywords:["motivation","motivated","lazy"]},
{tag:"life", q:"What do I do if I'm being bullied?", a:"Tell a trusted adult right away — a teacher, parent, or counselor. You don't have to handle it alone, and it's not your fault.", keywords:["bully","bullied","bullying"]},
];

const searchInput = document.getElementById('quickSearch');
const qaResults = document.getElementById('qaResults');

function renderQaResults(query){
qaResults.innerHTML = '';
if(!query.trim()){
qaResults.innerHTML = '<p class="qa-empty">Start typing above, or <a href="#ask">ask us directly</a> for anything not listed here.</p>';
return;
}
const q = query.toLowerCase();
const matches = qaData.filter(item =>
item.q.toLowerCase().includes(q) ||
item.keywords.some(k => k.includes(q) || q.includes(k))
).slice(0, 6);

if(matches.length === 0){
qaResults.innerHTML = '<p class="qa-empty">No quick match yet — <a href="#ask">ask us directly</a> and get an instant answer instead.</p>';
return;
}
matches.forEach(item => {
const div = document.createElement('div');
div.className = 'qa-item';
div.setAttribute('data-tag', item.tag);
div.innerHTML = '<p class="q">' + item.q + '</p><p class="a">' + item.a + '</p>';
qaResults.appendChild(div);
});
}

searchInput.addEventListener('input', (e) => renderQaResults(e.target.value));
renderQaResults('');

// ---------- Ask Anything ----------
const WORKER_URL = "https://locker-notes-ai.aditya012345gupta.workers.dev";

function cleanAnswerText(text){
return text
.replace(/^#{1,6}\s*/gm, '')
.replace(/\*\*(.*?)\*\*/g, '$1')
.replace(/\*(.*?)\*/g, '$1')
.replace(/^[-*]\s+/gm, '• ')
.replace(/`([^`]*)`/g, '$1')
.trim();
}

function parseAnswer(text){
const stepsMatch = text.match(/(?:^|\n)\s*STEPS:\s*([\s\S]+)$/i);
let mainText = text;
let steps = [];
if(stepsMatch){
mainText = text.slice(0, stepsMatch.index).trim();
steps = stepsMatch[1].trim().split('||').map(s => s.trim()).filter(Boolean);
}
mainText = mainText.replace(/^ANSWER:\s*/i, '').trim();
return { mainText, steps };
}

let loadingInterval;
function startLoadingAnimation(el){
const phrases = ['Thinking', 'Working on it', 'Almost there'];
let phraseIndex = 0;
let dotCount = 0;
el.textContent = phrases[0];
loadingInterval = setInterval(() => {
dotCount = (dotCount + 1) % 4;
if(dotCount === 0){
phraseIndex = (phraseIndex + 1) % phrases.length;
}
el.textContent = phrases[phraseIndex] + '.'.repeat(dotCount);
}, 500);
}
function stopLoadingAnimation(){
if(loadingInterval) clearInterval(loadingInterval);
}

function renderAnswer(container, rawAnswer){
const cleaned = cleanAnswerText(rawAnswer);
const { mainText, steps } = parseAnswer(cleaned);
container.innerHTML = '';

const mainDiv = document.createElement('div');
mainDiv.className = 'answer-main';
mainDiv.textContent = mainText;
container.appendChild(mainDiv);

if(steps.length > 1){
const flow = document.createElement('div');
flow.className = 'flow-chart';
steps.forEach((step, i) => {
const box = document.createElement('div');
box.className = 'flow-step';
box.textContent = (i + 1) + '. ' + step;
flow.appendChild(box);
if(i < steps.length - 1){
const arrow = document.createElement('div');
arrow.className = 'flow-arrow';
arrow.textContent = '↓';
flow.appendChild(arrow);
}
});
container.appendChild(flow);
}
}

// How long to wait for the AI Teacher before giving up (milliseconds).
const TEACHER_TIMEOUT_MS = 30000;

// Sends a request to the AI Teacher backend (the Cloudflare Worker).
// Returns {status, data}; data is null if the reply wasn't valid JSON.
async function callTeacher(payload){
const controller = new AbortController();
const timer = setTimeout(function(){ controller.abort(); }, TEACHER_TIMEOUT_MS);
try{
const res = await fetch(WORKER_URL, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
signal: controller.signal
});
let data = null;
try{ data = await res.json(); }catch(e){ data = null; }
return { status: res.status, data: data };
} finally {
clearTimeout(timer);
}
}

function teacherErrorMessage(result, fallback){
if(result && result.data && typeof result.data.error === 'string' && result.data.error) return result.data.error;
if(result && result.status === 429) return 'The AI Teacher is very busy right now. Please wait a minute and try again.';
return fallback;
}

function teacherCatchMessage(err){
if(err && err.name === 'AbortError') return 'That took too long. Please try again.';
return 'Something went wrong. Check your connection and try again.';
}

async function askQuestion(){
const input = document.getElementById('questionInput');
const answerBox = document.getElementById('answerBox');
const askBtn = document.getElementById('askBtn');
const question = input.value.trim();

if(!question){
answerBox.className = 'answer-box visible error';
answerBox.textContent = 'Type a question first!';
return;
}

askBtn.disabled = true;
answerBox.className = 'answer-box visible loading';
startLoadingAnimation(answerBox);

try{
const result = await callTeacher({ question: question, context: levelName(country, level, currentStream) });
stopLoadingAnimation();

if(result.data && result.data.answer){
answerBox.className = 'answer-box visible';
renderAnswer(answerBox, result.data.answer);
} else {
answerBox.className = 'answer-box visible error';
answerBox.textContent = teacherErrorMessage(result, 'The AI Teacher is taking a break right now. Please try again in a little while.');
}
} catch(err){
stopLoadingAnimation();
answerBox.className = 'answer-box visible error';
answerBox.textContent = teacherCatchMessage(err);
} finally {
askBtn.disabled = false;
stopLoadingAnimation();
}
}

// ---------- AI Teacher: tabs + Essay & Email Coach ----------
function switchTeacherTab(which){
const tabs = document.querySelectorAll('#teacherTabbar .tab-btn');
const askPanel = document.getElementById('teacherPanelAsk');
const coachPanel = document.getElementById('teacherPanelCoach');
const showAsk = which === 'ask';
tabs[0].setAttribute('aria-selected', showAsk ? 'true' : 'false');
tabs[1].setAttribute('aria-selected', showAsk ? 'false' : 'true');
askPanel.classList.toggle('active', showAsk);
coachPanel.classList.toggle('active', !showAsk);
}

// Shows coaching notes as plain text (never as HTML), under a small heading.
function setCoachNotes(box, notes){
box.textContent = '';
if(!notes) return;
const heading = document.createElement('strong');
heading.textContent = 'Coach Notes';
box.appendChild(heading);
box.appendChild(document.createTextNode(String(notes)));
}

async function generateDraft(){
const typeSel = document.getElementById('coachType');
const topicInput = document.getElementById('coachTopic');
const coachBtn = document.getElementById('coachBtn');
const output = document.getElementById('coachOutput');
const draftBox = document.getElementById('coachDraft');
const notesBox = document.getElementById('coachNotesBox');
const writingType = typeSel.value;
const topic = topicInput.value.trim();

if(!topic){
output.className = 'coach-output visible';
draftBox.textContent = 'Type a topic first!';
setCoachNotes(notesBox, '');
return;
}

coachBtn.disabled = true;
output.className = 'coach-output visible';
draftBox.textContent = 'Writing a draft...';
setCoachNotes(notesBox, '');

try{
const result = await callTeacher({
mode: 'essay',
writingType: writingType,
topic: topic,
context: levelName(country, level, currentStream)
});
const data = result.data;

if(data && data.draft){
draftBox.textContent = data.draft;
setCoachNotes(notesBox, data.notes);
} else if(data && data.answer){
// An older backend that doesn't know about essay mode sends a plain answer instead.
draftBox.textContent = cleanAnswerText(data.answer);
setCoachNotes(notesBox, '');
} else {
draftBox.textContent = teacherErrorMessage(result, "Couldn't generate a draft right now. Please try again in a little while.");
setCoachNotes(notesBox, '');
}
} catch(err){
draftBox.textContent = teacherCatchMessage(err);
setCoachNotes(notesBox, '');
} finally {
coachBtn.disabled = false;
}
}

const params = new URLSearchParams(window.location.search);
let country = params.get('country') || 'general';
let level = params.get('level') || null;
let currentStream = params.get('stream') || 'science';
if(!COUNTRIES[country]) country = 'general';
if(country !== 'general' && (!level || COUNTRIES[country].levels.indexOf(parseInt(level)) === -1)){
country = 'general'; level = null;
}
const SUBJECT_COLORS = ['var(--blue)','var(--green)','var(--coral)','var(--mustard)'];

function hasStreams(){
const meta = COUNTRIES[country];
return !!(meta && meta.streams && meta.streams.indexOf(parseInt(level,10)) !== -1);
}

function renderContext(){
document.getElementById('ctxTitle').textContent = levelName(country, level, currentStream);
const meta = COUNTRIES[country];
document.getElementById('ctxSub').textContent = country === 'general'
? 'Advice and study help that works for any class, in any country'
: meta.name + ' \u00b7 ' + meta.sub;
document.title = 'Locker Notes \u2014 ' + levelName(country, level, currentStream);
document.getElementById('hwSub').textContent = country === 'general'
? 'Universal study strategies that work at any level.'
: 'Study strategies for ' + levelName(country, level, currentStream) + '.';
}

function renderStreamPicker(){
const area = document.getElementById('streamPickerArea');
area.innerHTML = '';
if(!hasStreams()) return;
const row = document.createElement('div');
row.className = 'stream-row';
[['science','Science'],['commerce','Commerce'],['arts','Arts']].forEach(function(p){
const b = document.createElement('button');
b.className = 'class-btn stream-btn' + (currentStream === p[0] ? ' active' : '');
b.textContent = p[1];
b.onclick = function(){
currentStream = p[0];
const u = new URL(window.location);
u.searchParams.set('stream', p[0]);
history.replaceState({}, '', u);
renderStreamPicker(); renderContext(); renderHomework(); renderAdvice(); renderMockControls();
};
row.appendChild(b);
});
area.appendChild(row);
}

function renderHomework(){
const subjects = getHomework(country, level, currentStream);
const tabbar = document.getElementById('hwTabbar');
const wrap = document.getElementById('hwPanelWrap');
tabbar.innerHTML = ''; wrap.innerHTML = '';
if(!subjects) return;
subjects.forEach(function(subj, i){
const btn = document.createElement('button');
btn.className = 'tab-btn';
btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
btn.textContent = subj.label;
if(i === 0) btn.style.borderTop = '4px solid ' + SUBJECT_COLORS[i % 4];
btn.onclick = function(){
tabbar.querySelectorAll('.tab-btn').forEach(function(b){
b.setAttribute('aria-selected','false'); b.style.borderTop = '';
});
btn.setAttribute('aria-selected','true');
btn.style.borderTop = '4px solid ' + SUBJECT_COLORS[i % 4];
wrap.querySelectorAll('.panel').forEach(function(p){ p.classList.remove('active'); });
wrap.querySelector('.panel[data-p="' + subj.key + '"]').classList.add('active');
};
tabbar.appendChild(btn);

const panel = document.createElement('div');
panel.className = 'panel' + (i === 0 ? ' active' : '');
panel.dataset.p = subj.key;
const h3 = document.createElement('h3'); h3.textContent = subj.label; panel.appendChild(h3);
const ul = document.createElement('ul'); ul.className = 'tip-list';
subj.tips.forEach(function(tip){
const li = document.createElement('li');
li.style.setProperty('--tip-color', SUBJECT_COLORS[i % 4]);
const s = document.createElement('strong'); s.textContent = tip.h;
li.appendChild(s); li.appendChild(document.createTextNode(tip.b));
ul.appendChild(li);
});
panel.appendChild(ul);
wrap.appendChild(panel);
});
}

function renderAdvice(){
const data = getAdvice(country, level, currentStream);
if(!data) return;
document.getElementById('adviceTierLabel').textContent = data.label;
const board = document.getElementById('adviceCorkboard');
board.innerHTML = '';
data.notes.forEach(function(n){
const div = document.createElement('div'); div.className = 'note';
const s = document.createElement('strong'); s.textContent = n.t;
const p = document.createElement('p'); p.textContent = n.x;
div.appendChild(s); div.appendChild(p); board.appendChild(div);
});
}

const SUBJECT_LABELS = {math:'Math', science:'Science', english:'English', history:'History', geography:'Geography', computer:'Computer Basics', evs:'EVS', gk:'General Knowledge', sst:'Social Studies', socialstudies:'Social Studies', humanities:'Humanities', phy:'Physics', chem:'Chemistry', acc:'Accountancy', bst:'Business Studies', eco:'Economics', hist:'History', pol:'Political Science', geo:'Geography', eng:'English'};
let activeMockSet = null;

function renderMockControls(){
const area = document.getElementById('mockControlsArea');
const testArea = document.getElementById('mockTestArea');
area.innerHTML = ''; testArea.innerHTML = '';
activeMockSet = country === 'general' ? null : getMockSet(country, level, currentStream);

if(!activeMockSet){
const soon = document.createElement('div');
soon.className = 'mock-soon';
const p = document.createElement('p');
p.textContent = country === 'general'
? 'Pick your country and class on the home page to get practice tests matched to your level.'
: 'Mock tests for this level are coming soon. More are being added over time.';
soon.appendChild(p);
testArea.appendChild(soon);
return;
}

const controls = document.createElement('div'); controls.className = 'mock-controls';
const sel = document.createElement('select'); sel.id = 'mockSubject';
Object.keys(activeMockSet).forEach(function(k){
const o = document.createElement('option');
o.value = k; o.textContent = SUBJECT_LABELS[k] || k;
sel.appendChild(o);
});
controls.appendChild(sel);
const btn = document.createElement('button');
btn.className = 'btn btn-solid'; btn.textContent = 'Start Test'; btn.onclick = loadMockTest;
controls.appendChild(btn);
area.appendChild(controls);
const note = document.createElement('p'); note.className = 'mock-note';
note.textContent = '5 quick questions for ' + levelName(country, level, currentStream) + '.';
area.appendChild(note);
}

function loadMockTest(){
const subj = document.getElementById('mockSubject').value;
const questions = activeMockSet[subj];
const area = document.getElementById('mockTestArea');
area.innerHTML = '';
area.dataset.cls = country + '_' + level;
area.dataset.subj = subj;

const resultBox = document.createElement('div');
resultBox.id = 'mockResult'; resultBox.className = 'mock-result';
area.appendChild(resultBox);

const best = getBestScore(area.dataset.cls, subj);
const bestInfo = document.createElement('p'); bestInfo.className = 'mock-best-info';
bestInfo.textContent = best !== null
? ('Your best on this test: ' + best + ' / ' + questions.length)
: 'You have not attempted this test yet.';
area.appendChild(bestInfo);

const track = document.createElement('div'); track.className = 'mock-progress-track';
const fill = document.createElement('div'); fill.className = 'mock-progress-fill'; fill.id = 'mockProgressFill';
track.appendChild(fill); area.appendChild(track);

questions.forEach(function(q, qi){
const qDiv = document.createElement('div'); qDiv.className = 'mock-question';
qDiv.dataset.correct = q.correct;
const qt = document.createElement('p'); qt.className = 'mock-q-text';
qt.textContent = (qi + 1) + '. ' + q.q; qDiv.appendChild(qt);
q.options.forEach(function(opt, oi){
const label = document.createElement('label'); label.className = 'mock-option';
const radio = document.createElement('input');
radio.type = 'radio'; radio.name = 'mockq' + qi; radio.value = oi;
radio.addEventListener('change', function(){ updateMockProgress(questions.length); });
label.appendChild(radio); label.appendChild(document.createTextNode(opt));
qDiv.appendChild(label);
});
area.appendChild(qDiv);
});

const submit = document.createElement('button');
submit.className = 'btn btn-solid'; submit.textContent = 'Submit Test'; submit.onclick = submitMockTest;
area.appendChild(submit);
area.scrollIntoView({behavior:'smooth', block:'nearest'});
}

function copyLink(){
navigator.clipboard.writeText(window.location.href).then(function(){
const fb = document.getElementById('copyFeedback');
fb.textContent = 'Copied!'; setTimeout(function(){ fb.textContent = ''; }, 2000);
});
}

renderContext();
renderStreamPicker();
renderHomework();
renderAdvice();
renderMockControls();
