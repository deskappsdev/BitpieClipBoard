// BitpieClipBoard — Generators
const byId = (id) => document.getElementById(id);
const toast = (msg) => {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 1500);
};

// Header nav toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Stats
byId('year').textContent = new Date().getFullYear();

// Password generator
const lengthInput = byId('pw-length');
const lengthVal = byId('pw-length-val');
const pwUpper = byId('pw-upper');
const pwLower = byId('pw-lower');
const pwNum = byId('pw-num');
const pwSym = byId('pw-sym');
const pwAmb = byId('pw-amb');
const pwOut = byId('password-output');
const pwStrength = byId('pw-strength');

lengthInput.addEventListener('input', (e)=> lengthVal.textContent = e.target.value);

function generatePassword(){
  const len = parseInt(lengthInput.value, 10) || 16;
  let sets = [];
  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let nums  = '0123456789';
  let syms  = '!@#$%^&*()-_=+[]{};:,.<>/?~';
  if (pwAmb.checked){
    upper = upper.replace(/[OIL]/g,'');
    lower = lower.replace(/[oil]/g,'');
    nums  = nums.replace(/[01]/g,'');
  }
  if (pwUpper.checked) sets.push(upper);
  if (pwLower.checked) sets.push(lower);
  if (pwNum.checked)   sets.push(nums);
  if (pwSym.checked)   sets.push(syms);
  if (sets.length === 0){ sets = [lower]; }

  // Ensure at least one from each selected set
  let chars = [];
  sets.forEach(s => chars.push(s[Math.floor(Math.random()*s.length)]));
  const all = sets.join('');
  while (chars.length < len){
    const idx = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * all.length);
    chars.push(all[idx]);
  }
  // Shuffle
  for (let i = chars.length -1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  const pass = chars.join('').slice(0,len);
  pwOut.value = pass;
  scorePassword(pass);
}

function scorePassword(p){
  let score = 0;
  if (!p) return;
  const letters = {};
  for (let i=0; i<p.length; i++){
    letters[p[i]] = (letters[p[i]] || 0) + 1;
    score += 5.0 / letters[p[i]];
  }
  const variations = {
    digits: /\d/.test(p),
    lower: /[a-z]/.test(p),
    upper: /[A-Z]/.test(p),
    nonWords: /\W/.test(p),
  };
  let variationCount = 0;
  for (let check in variations) variationCount += (variations[check] === true) ? 1 : 0;
  score += (variationCount - 1) * 10;
  const levels = [
    {t: 30, label: 'weak'},
    {t: 60, label: 'okay'},
    {t: 80, label: 'strong'},
    {t: 1000, label: 'beast'},
  ];
  let label = 'weak';
  for (const lvl of levels){
    if (score <= lvl.t){ label = lvl.label; break; }
  }
  pwStrength.textContent = label;
  pwStrength.style.color = label === 'weak' ? '#fca5a5' : (label==='okay' ? '#fde68a' : '#86efac');
}

byId('pw-generate').addEventListener('click', generatePassword);

// Username generator
const userOut = byId('username-output');
const userStyle = byId('user-style');

const sets = {
  clean: { adj: ['Bright','Swift','Calm','Bold','Quiet','Lucky','Neon','Royal','Prime','Urban','Magic','Solar','Crystal','Nova','Aqua','Pixel'], noun: ['River','Sky','Leaf','Cloud','Echo','Stone','Field','Panda','Falcon','Lotus','Comet','Quartz','Maple','Orchid','Zephyr','Atlas'], sep: '' },
  gamer: { adj: ['Shadow','Rogue','Vortex','Phantom','Turbo','Crimson','Toxic','Omega','Blaze','NoScope','Stealth','Glitch','Rapid','Nova','Venom'], noun: ['Wolf','Ninja','Sniper','Drake','Reaper','Dragon','Ghost','Titan','Rider','Raptor','Storm','Knight','Wraith'], sep: '' },
  techy: { adj: ['Binary','Quantum','Neural','Crypto','Matrix','Vector','Dynamic','Static','Async','Turbo','Hyper','Nano','Logic','Circuit'], noun: ['Coder','Stack','Kernel','Packet','Socket','Hub','Array','Buffer','Thread','Module','Driver','Script'], sep: '_' },
  aesthetic: { adj: ['soft','moss','sage','dawn','opal','lilac','amber','hazel','ivory','pearl','violet','mint','linen','dune'], noun: ['studio','notes','fields','room','corner','archive','sketch','canvas','pages','loft','flora','bloom'], sep: '.' },
  random: { adj: ['Cosmic','Fuzzy','Rare','Glassy','Solar','Echo','Lucky','Mint','Velvet','Icy','Azure','Cobalt','Ruby','Onyx','Coral'], noun: ['Otter','Falcon','Bee','Cobra','Lynx','Koala','Fox','Whale','Puma','Yak','Quokka','Hawk','Tiger','Bear'], sep: '' },
};

function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
function pick(arr){ return arr[rand(0, arr.length-1)] }

function generateUsername(){
  const style = sets[userStyle.value] || sets.clean;
  const adj = pick(style.adj);
  const noun = pick(style.noun);
  const num = Math.random() < 0.8 ? rand(1, 99) : rand(100, 999);
  const extras = ['', '', '', '_', '.', 'x', 'X', '', '', ''];
  const extra = extras[rand(0, extras.length-1)];
  const name = `${adj}${style.sep}${noun}${extra}${num}`;
  userOut.value = name;
}

byId('user-generate').addEventListener('click', generateUsername);

// Hashtag generator
const tagTopic = byId('tag-topic');
const tagCount = byId('tag-count');
const tagCountVal = byId('tag-count-val');
const tagOut = byId('hashtags-output');

tagCount.addEventListener('input', (e)=> tagCountVal.textContent = e.target.value);

const genericTags = ['#Viral','#Trending','#Explore','#InstaDaily','#NewPost','#Love','#Life','#Goals','#Inspiration','#Today','#Hustle','#Motivation','#Creator','#Reels','#Follow','#Share','#Like','#Tips','#Guide','#HowTo','#LifeHacks'];

const topicSeeds = {
  fitness: ['#Fitness','#Gym','#Workout','#FitLife','#FitFam','#Cardio','#Strength','#HIIT','#Muscle','#Wellness','#Healthy','#Nutrition','#Protein'],
  ai: ['#AI','#ArtificialIntelligence','#MachineLearning','#DeepLearning','#Tech','#Automation','#DataScience','#NeuralNetworks','#GenAI','#PromptEngineering'],
  travel: ['#Travel','#Wanderlust','#Adventure','#Explore','#BucketList','#Nature','#RoadTrip','#Vacation','#TravelTips','#HiddenGems'],
  coding: ['#Coding','#Programmer','#JavaScript','#Python','#WebDev','#BugFix','#100DaysOfCode','#OpenSource','#DevLife','#Frontend','#Backend'],
  beauty: ['#Beauty','#Skincare','#Makeup','#Glow','#SelfCare','#HairCare','#BeforeAfter','#CleanBeauty','#Routine','#Cosmetics'],
};

function makeHashtags(topic, count){
  topic = (topic||'').toLowerCase().trim();
  const seeds = topicSeeds[topic] || (topic ? [`#${topic.replace(/\s+/g,'')}`] : []);
  const pool = [...seeds, ...genericTags];
  // ensure unique + mix
  const out = new Set();
  while (out.size < count){
    const pick = pool[rand(0, pool.length-1)] || `#${topic}${rand(1,99)}`;
    out.add(pick);
    if (pool.length < count) pool.push(`#${topic}${rand(1,999)}`);
  }
  // soft sort: start with topic tags
  const arr = Array.from(out);
  arr.sort((a,b)=> (a.toLowerCase().includes(topic) ? -1 : 1));
  return arr.slice(0, count);
}

function generateTags(){
  const topic = tagTopic.value;
  const count = parseInt(tagCount.value,10) || 12;
  const tags = makeHashtags(topic, count);
  tagOut.value = tags.join(' ');
}

byId('tag-generate').addEventListener('click', generateTags);

// Copy buttons
document.querySelectorAll('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const target = document.querySelector(btn.getAttribute('data-copy'));
    if (!target) return;
    const text = target.value || target.textContent;
    try{
      await navigator.clipboard.writeText(text);
      toast('Copied to clipboard ✓');
    }catch(err){
      // fallback
      target.select(); document.execCommand('copy');
      toast('Copied ✓');
    }
  });
});

// Initialize defaults
generatePassword();
generateUsername();
generateTags();

// Hero fake stat speed (for vibes only)
(function(){
  const val = (6 + Math.random()).toFixed(2) + 'ms';
  document.getElementById('stat-speed').textContent = val;
})();
