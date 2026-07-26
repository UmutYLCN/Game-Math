/**
 * MATH_DECIPHER // Core Game Engine v9.5 (Decimal & Computer Number Systems)
 * Cyber Math Decryption Game
 */

// ==========================================
// 1. GAME DATA & CONFIGURATION
// ==========================================
const LEVELS = [
  {
    level: 1,
    code: '0x01',
    title: 'LEVEL 0x01: TEMEL ERİŞİM',
    sub: 'Sistem pinglemesi alınıyor... Düz toplama ve çıkarma ile paketleri doğrula.',
    required: 5,
    gen: genLevel1
  },
  {
    level: 2,
    code: '0x02',
    title: 'LEVEL 0x02: VERİ SIKIŞTIRMA',
    sub: 'Çarpma ve kalansız bölme algoritması aktif. Veri bloklarını çöz.',
    required: 5,
    gen: genLevel2
  },
  {
    level: 3,
    code: '0x03',
    title: 'LEVEL 0x03: İŞLEM ÖNCELİĞİ',
    sub: 'Parantez ve çarpan önceliklerine dikkat et! Mantıksal veri sırasını koru.',
    required: 5,
    gen: genLevel3
  },
  {
    level: 4,
    code: '0x04',
    title: 'LEVEL 0x04: BİLİNMEYEN DEĞİŞKEN',
    sub: 'Denklem şifrelemesi! Gizlenmiş X değişkeninin değerini hesapla.',
    required: 5,
    gen: genLevel4
  },
  {
    level: 5,
    code: '0x05',
    title: 'LEVEL 0x05: NEGATİF VEKTÖRLER',
    sub: 'Negatif yük dengesizliği. İşaret kurallarına göre vektörleri eşitle.',
    required: 5,
    gen: genLevel5
  },
  {
    level: 6,
    code: '0x06',
    title: 'LEVEL 0x06: ÜSTEL GÜÇ & KAREKÖK',
    sub: 'Üslü ifadeler ve tam kare köklerle çekirdek enerjisini yapılandır.',
    required: 5,
    gen: genLevel6
  },
  {
    level: 7,
    code: '0x07',
    title: 'LEVEL 0x07: MODÜLER KRİPTO',
    sub: 'Mod kasan kalanları hesapla. Kriptografik kalan algoritmasını uygula.',
    required: 5,
    gen: genLevel7
  },
  {
    level: 8,
    code: '0x08',
    title: 'LEVEL 0x08: DİZİLİM ŞİFRESİ',
    sub: 'Dizideki örüntüyü keşfet. Soru işareti [ ? ] yerine gelecek terimi bul.',
    required: 5,
    gen: genLevel8
  },
  {
    level: 9,
    code: '0x09',
    title: 'LEVEL 0x09: İKİLİ & ONALTILI SİSTEM',
    sub: 'Binary (0b) ve Hexadecimal (0x) kodlarını Onluk (Decimal) sisteme dönüştür.',
    required: 5,
    gen: genLevel9
  },
  {
    level: 10,
    code: '0x0A',
    title: 'LEVEL 0x0A: KUANTUM ÇEKİRDEK',
    sub: 'TÜM BİLGİ KATMANLARI KARIŞIK! 5x Kombo bonusu aktif!',
    required: 10,
    gen: genLevel10
  }
];

const BADGES = [
  { id: 'b1', icon: '🐣', title: 'Script Kiddie', desc: 'Seviye 1 paketlerini çözdün.' },
  { id: 'b2', icon: '⚡', title: 'Hızlı Çözücü', desc: '5 üst üste doğru yanıt verdin.' },
  { id: 'b3', icon: '🔒', title: 'Cipher Analyst', desc: 'Seviye 5 erişim yetkisi kazandın.' },
  { id: 'b4', icon: '🧠', title: 'Math Cracker', desc: '10 üst üste kombo serisine ulaştın.' },
  { id: 'b5', icon: '💾', title: 'Binary Wizard', desc: 'Seviye 9 Binary & Hex sorularını çözdün.' },
  { id: 'b6', icon: '👑', title: 'Quantum Master', desc: 'Tüm Seviye 10 Kuantum Çekirdeğini tamamladın!' }
];

// App State
let state = {
  activeMode: 'CAMPAIGN',
  
  multMin: 1,
  multMax: 10,

  multOpModeType: 'rr',
  basesModeType: 'bin', // 'bin' | 'dec2bin' | 'hex' | 'dec2hex' | 'oct' | 'dec2oct' | 'add' | 'mix'
  expModeType: '2n',
  rootModeType: 'basic',
  logModeType: '23',
  triviaModeType: 'angles',
  pctModeType: 'basic',
  geomModeType: 'pyth',
  factModeType: 'basic',
  trigoModeType: 'basic',
  addModeType: 'rr',
  subModeType: 'rr',
  divModeType: 'basit',

  dailyState: {
    dateStr: '',
    completed: false,
    bestScore: 0,
    currentIndex: 0,
    questions: []
  },

  hackerTimerEnabled: false,
  timerSeconds: 60,
  timerInterval: null,

  currentLevelIndex: 0,
  unlockedLevelIndex: 0,
  levelSolvedCount: 0,

  score: 0,
  highScore: 0,
  streak: 0,
  bestStreak: 0,
  totalSolved: 0,
  totalAttempts: 0,
  soundEnabled: true,
  matrixEnabled: true,
  currentQuestion: null,
  startTime: Date.now(),
  badges: []
};

// ==========================================
// 2. KATEX MATH RENDERING ENGINE
// ==========================================
function renderKaTeX() {
  if (window.renderMathInElement) {
    try {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    } catch (e) {
      console.error('KaTeX rendering error:', e);
    }
  }
}

// ==========================================
// 3. AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playSynthTone(freq, type = 'sine', duration = 0.1, gainValue = 0.1) {
  if (!state.soundEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(gainValue, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error(e);
  }
}

function playKeySound() {
  playSynthTone(600 + Math.random() * 200, 'triangle', 0.04, 0.05);
}

function playSuccessSound() {
  if (!state.soundEnabled || !audioCtx) return;
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
    setTimeout(() => {
      playSynthTone(freq, 'sine', 0.15, 0.12);
    }, i * 60);
  });
}

function playErrorSound() {
  if (!state.soundEnabled || !audioCtx) return;
  playSynthTone(150, 'sawtooth', 0.25, 0.2);
}

function playLevelUpSound() {
  if (!state.soundEnabled || !audioCtx) return;
  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playSynthTone(freq, 'square', 0.2, 0.1);
    }, i * 80);
  });
}

// ==========================================
// 4. MATRIX RAIN CANVAS BACKGROUND
// ==========================================
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let columns = 0;
let drops = [];
const katakana = '0123456789ABCDEF+-*=/<>?@#$%&';

function resizeMatrix() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / 18);
  drops = Array(columns).fill(1);
}

function drawMatrix() {
  if (!ctx || !state.matrixEnabled) return;

  ctx.fillStyle = 'rgba(6, 9, 14, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#00ff66';
  ctx.font = '14px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
    const x = i * 18;
    const y = drops[i] * 18;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

// ==========================================
// 5. QUESTION GENERATORS (DECIMAL & BASES INCLUDED)
// ==========================================
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// COMPUTER BASES GENERATOR (ONLUK TABAN DÖNÜŞÜMLERİ DAHİL)
function genCustomBases() {
  if (state.basesModeType === 'bin') {
    const num = getRandomInt(1, 31);
    const binStr = '0b' + num.toString(2).padStart(5, '0');
    return { q: `${binStr} (Decimal) = ?`, ans: String(num) };
  } else if (state.basesModeType === 'dec2bin') {
    const num = getRandomInt(1, 31);
    const binStr = num.toString(2);
    return { q: `${num} (Binary) = 0b?`, ans: binStr, altAns: '0b' + binStr };
  } else if (state.basesModeType === 'hex') {
    const num = getRandomInt(5, 255);
    const hexStr = '0x' + num.toString(16).toUpperCase();
    return { q: `${hexStr} (Decimal) = ?`, ans: String(num) };
  } else if (state.basesModeType === 'dec2hex') {
    const num = getRandomInt(5, 255);
    const hexStr = num.toString(16).toUpperCase();
    return { q: `${num} (Hexadecimal) = 0x?`, ans: hexStr, altAns: '0x' + hexStr };
  } else if (state.basesModeType === 'oct') {
    const num = getRandomInt(5, 63);
    const octStr = '0o' + num.toString(8);
    return { q: `${octStr} (Decimal) = ?`, ans: String(num) };
  } else if (state.basesModeType === 'dec2oct') {
    const num = getRandomInt(5, 63);
    const octStr = num.toString(8);
    return { q: `${num} (Octal) = 0o?`, ans: octStr, altAns: '0o' + octStr };
  } else if (state.basesModeType === 'add') {
    const isHex = Math.random() > 0.5;
    if (isHex) {
      const a = getRandomInt(2, 15);
      const b = getRandomInt(2, 15);
      return { q: `0x${a.toString(16).toUpperCase()} + 0x${b.toString(16).toUpperCase()} (Decimal) = ?`, ans: String(a + b) };
    } else {
      const a = getRandomInt(2, 15);
      const b = getRandomInt(2, 15);
      return { q: `0b${a.toString(2)} + 0b${b.toString(2)} (Decimal) = ?`, ans: String(a + b) };
    }
  } else {
    const choice = getRandomInt(1, 6);
    if (choice === 1) return genCustomBases_Bin();
    if (choice === 2) return genCustomBases_Dec2Bin();
    if (choice === 3) return genCustomBases_Hex();
    if (choice === 4) return genCustomBases_Dec2Hex();
    if (choice === 5) return genCustomBases_Oct();
    return genCustomBases_Dec2Oct();
  }
}

function genCustomBases_Bin() {
  const num = getRandomInt(1, 31);
  return { q: `0b${num.toString(2).padStart(5, '0')} (Decimal) = ?`, ans: String(num) };
}
function genCustomBases_Dec2Bin() {
  const num = getRandomInt(1, 31);
  const b = num.toString(2);
  return { q: `${num} (Binary) = 0b?`, ans: b, altAns: '0b' + b };
}
function genCustomBases_Hex() {
  const num = getRandomInt(5, 255);
  return { q: `0x${num.toString(16).toUpperCase()} (Decimal) = ?`, ans: String(num) };
}
function genCustomBases_Dec2Hex() {
  const num = getRandomInt(5, 255);
  const h = num.toString(16).toUpperCase();
  return { q: `${num} (Hexadecimal) = 0x?`, ans: h, altAns: '0x' + h };
}
function genCustomBases_Oct() {
  const num = getRandomInt(5, 63);
  return { q: `0o${num.toString(8)} (Decimal) = ?`, ans: String(num) };
}
function genCustomBases_Dec2Oct() {
  const num = getRandomInt(5, 63);
  const o = num.toString(8);
  return { q: `${num} (Octal) = 0o?`, ans: o, altAns: '0o' + o };
}

// GENERAL MATH TRIVIA GENERATOR
function genCustomMathTrivia() {
  const angleItems = [
    { q: 'Üçgenin iç açıları toplamı kaç derecedir = ?', ans: 180 },
    { q: 'Dörtgenin iç açıları toplamı kaç derecedir = ?', ans: 360 },
    { q: 'Beşgenin iç açıları toplamı kaç derecedir = ?', ans: 540 },
    { q: 'Altıgenin iç açıları toplamı kaç derecedir = ?', ans: 720 },
    { q: 'Bir doğru açının ölçüsü kaç derecedir = ?', ans: 180 },
    { q: 'Bir tam açının ölçüsü kaç derecedir = ?', ans: 360 },
    { q: 'Dik açının ölçüsü kaç derecedir = ?', ans: 90 }
  ];

  const primeItems = [
    { q: 'En küçük asal sayı kaçtır = ?', ans: 2 },
    { q: 'Çift olan tek asal sayı kaçtır = ?', ans: 2 },
    { q: '10\'dan küçük kaç tane asal sayı vardır = ?', ans: 4 },
    { q: '20\'den küçük kaç tane asal sayı vardır = ?', ans: 8 },
    { q: '100\'e kadar toplam kaç tane asal sayı vardır = ?', ans: 25 },
    { q: 'En küçük mükemmel sayı kaçtır (1+2+3) = ?', ans: 6 },
    { q: 'İkinci mükemmel sayı kaçtır (1+2+4+7+14) = ?', ans: 28 }
  ];

  const coreRuleItems = [
    { q: 'Sıfırdan farklı her sayının 0. kuvveti (x⁰) kaçtır = ?', ans: 1 },
    { q: '0! (Sıfır faktöriyel) değeri kaçtır = ?', ans: 1 },
    { q: 'Bir sayının kendisi ile bölümü (x / x) kaçtır = ?', ans: 1 }
  ];

  if (state.triviaModeType === 'angles') {
    return angleItems[Math.floor(Math.random() * angleItems.length)];
  } else if (state.triviaModeType === 'primes') {
    return primeItems[Math.floor(Math.random() * primeItems.length)];
  } else {
    const all = [...angleItems, ...primeItems, ...coreRuleItems];
    return all[Math.floor(Math.random() * all.length)];
  }
}

// LOGARITHM GENERATOR
function genCustomLogarithm() {
  const base23Items = [
    { q: 'log₂(2) = ?', ans: 1 },
    { q: 'log₂(4) = ?', ans: 2 },
    { q: 'log₂(8) = ?', ans: 3 },
    { q: 'log₂(16) = ?', ans: 4 },
    { q: 'log₂(32) = ?', ans: 5 },
    { q: 'log₂(64) = ?', ans: 6 },
    { q: 'log₃(3) = ?', ans: 1 },
    { q: 'log₃(9) = ?', ans: 2 },
    { q: 'log₃(27) = ?', ans: 3 },
    { q: 'log₃(81) = ?', ans: 4 },
    { q: 'log₅(25) = ?', ans: 2 },
    { q: 'log₅(125) = ?', ans: 3 }
  ];

  const base10Items = [
    { q: 'log(10) = ?', ans: 1 },
    { q: 'log(100) = ?', ans: 2 },
    { q: 'log(1000) = ?', ans: 3 },
    { q: 'log(10000) = ?', ans: 4 },
    { q: 'log(100000) = ?', ans: 5 }
  ];

  const ruleItems = [
    { q: 'log₇(7) = ?', ans: 1 },
    { q: 'log₉(1) = ?', ans: 0 },
    { q: 'log₅(1) = ?', ans: 0 },
    { q: 'log₂(8) + log₃(9) = ?', ans: 5 },
    { q: 'log₂(16) - log₂(4) = ?', ans: 2 },
    { q: 'log(100) × log₂(8) = ?', ans: 6 }
  ];

  if (state.logModeType === '23') {
    return base23Items[Math.floor(Math.random() * base23Items.length)];
  } else if (state.logModeType === '10') {
    return base10Items[Math.floor(Math.random() * base10Items.length)];
  } else if (state.logModeType === 'rule') {
    return ruleItems[Math.floor(Math.random() * ruleItems.length)];
  } else {
    const all = [...base23Items, ...base10Items, ...ruleItems];
    return all[Math.floor(Math.random() * all.length)];
  }
}

// YÜZDE VE ORAN MOTORU
function genCustomPercentage() {
  const basicPcts = [10, 20, 25, 50];
  const advPcts = [15, 30, 40, 75, 150];
  let p = 25;
  if (state.pctModeType === 'basic') {
    p = basicPcts[Math.floor(Math.random() * basicPcts.length)];
  } else if (state.pctModeType === 'adv') {
    p = advPcts[Math.floor(Math.random() * advPcts.length)];
  } else {
    const all = [...basicPcts, ...advPcts];
    p = all[Math.floor(Math.random() * all.length)];
  }

  let baseMultiplier = getRandomInt(1, 20);
  let baseNum = (100 / gcd(p, 100)) * baseMultiplier * getRandomInt(1, 4);

  const ans = (baseNum * p) / 100;
  return {
    q: `${baseNum}'in %${p}'i kaçtır = ?`,
    ans: ans
  };
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// GEOMETRİ & ÖZEL ÜÇGENLER MOTORU
function genCustomGeometry() {
  if (state.geomModeType === 'pyth') {
    const triples = [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 9, b: 12, c: 15 },
      { a: 12, b: 16, c: 20 },
      { a: 5, b: 12, c: 13 },
      { a: 10, b: 24, c: 26 },
      { a: 8, b: 15, c: 17 },
      { a: 7, b: 24, c: 25 }
    ];
    const t = triples[Math.floor(Math.random() * triples.length)];
    return {
      q: `Dik kenarları ${t.a} ve ${t.b} olan dik üçgenin hipotenüsü = ?`,
      ans: t.c
    };
  } else if (state.geomModeType === 'area') {
    const isSquare = Math.random() > 0.5;
    if (isSquare) {
      const side = getRandomInt(3, 15);
      const isArea = Math.random() > 0.5;
      if (isArea) {
        return { q: `Bir kenarı ${side} cm olan karenin Alanı = ? cm²`, ans: side * side };
      } else {
        return { q: `Bir kenarı ${side} cm olan karenin Çevresi = ? cm`, ans: side * 4 };
      }
    } else {
      const w = getRandomInt(3, 12);
      const h = getRandomInt(4, 15);
      const isArea = Math.random() > 0.5;
      if (isArea) {
        return { q: `Kenarları ${w} ve ${h} cm olan dikdörtgenin Alanı = ? cm²`, ans: w * h };
      } else {
        return { q: `Kenarları ${w} ve ${h} cm olan dikdörtgenin Çevresi = ? cm`, ans: 2 * (w + h) };
      }
    }
  } else {
    return Math.random() > 0.5 ? genCustomGeometry('pyth') : genCustomGeometry('area');
  }
}

// FAKTÖRİYEL MOTORU
function genCustomFactorial() {
  const factMap = { 0: 1, 1: 1, 2: 2, 3: 6, 4: 24, 5: 120, 6: 720 };
  if (state.factModeType === 'basic') {
    const n = getRandomInt(1, 6);
    return { q: `${n}! = ?`, ans: factMap[n] };
  } else if (state.factModeType === 'ratio') {
    const n = getRandomInt(3, 6);
    const k = getRandomInt(1, n - 1);
    const ans = factMap[n] / factMap[k];
    return { q: `${n}! / ${k}! = ?`, ans: ans };
  } else {
    const n = getRandomInt(2, 5);
    const isAdd = Math.random() > 0.5;
    const ans = isAdd ? (factMap[n] + factMap[n-1]) : (factMap[n] - factMap[n-1]);
    return { q: `${n}! ${isAdd ? '+' : '-'} ${n-1}! = ?`, ans: ans };
  }
}

// SİBER GÜNLÜK MÜCADELE MOTORU (DAILY BOSS)
function getTodayDateString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function generateDailyQuestions() {
  const dateStr = getTodayDateString();
  state.dailyState.dateStr = dateStr;

  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed += dateStr.charCodeAt(i);
  }

  const questions = [];
  const pool = [genLevel1, genLevel2, genLevel3, genCustomExponents, genCustomSquareRoots, genCustomLogarithm, genCustomBases, genCustomMathTrivia, genCustomPercentage, genCustomGeometry, genCustomFactorial, genCustomTrigonometry];

  for (let i = 0; i < 10; i++) {
    const genFunc = pool[(seed + i * 7) % pool.length];
    const qItem = genFunc();
    qItem.q = `[GÜNLÜK GÖREV ${i+1}/10] ` + qItem.q;
    questions.push(qItem);
  }

  state.dailyState.questions = questions;
}

// TRIGONOMETRY GENERATOR
function genCustomTrigonometry() {
  const basicQuestions = [
    { q: 'sin(0°) = ?', ans: 0 },
    { q: 'sin(30°) = ? (Ondalık: 0.5)', ans: 0.5 },
    { q: 'sin(90°) = ?', ans: 1 },
    { q: 'cos(0°) = ?', ans: 1 },
    { q: 'cos(60°) = ? (Ondalık: 0.5)', ans: 0.5 },
    { q: 'cos(90°) = ?', ans: 0 },
    { q: 'tan(45°) = ?', ans: 1 },
    { q: 'cot(45°) = ?', ans: 1 },
    { q: 'sin(45°) × cos(45°) = ? (0.5)', ans: 0.5 }
  ];

  const quadQuestions = [
    { q: 'sin(180°) = ?', ans: 0 },
    { q: 'cos(180°) = ?', ans: -1 },
    { q: 'sin(270°) = ?', ans: -1 },
    { q: 'cos(270°) = ?', ans: 0 },
    { q: 'cos(360°) = ?', ans: 1 },
    { q: 'sin(360°) = ?', ans: 0 },
    { q: 'tan(180°) = ?', ans: 0 }
  ];

  const identQuestions = [
    { q: 'sin²(x) + cos²(x) = ?', ans: 1 },
    { q: 'tan(x) × cot(x) = ?', ans: 1 },
    { q: 'sin(60°) = cos(x°) ➔ x = ?', ans: 30 },
    { q: 'cos(40°) = sin(x°) ➔ x = ?', ans: 50 },
    { q: 'sin²(45°) + cos²(45°) = ?', ans: 1 }
  ];

  if (state.trigoModeType === 'basic') {
    return basicQuestions[Math.floor(Math.random() * basicQuestions.length)];
  } else if (state.trigoModeType === 'quad') {
    return quadQuestions[Math.floor(Math.random() * quadQuestions.length)];
  } else if (state.trigoModeType === 'ident') {
    return identQuestions[Math.floor(Math.random() * identQuestions.length)];
  } else {
    const all = [...basicQuestions, ...quadQuestions, ...identQuestions];
    return all[Math.floor(Math.random() * all.length)];
  }
}

// SQUARE ROOTS GENERATOR
function genCustomSquareRoots() {
  if (state.rootModeType === 'basic') {
    const root = getRandomInt(2, 25);
    const sq = root * root;
    return { q: `√${sq} = ?`, ans: root };
  } else if (state.rootModeType === 'addsub') {
    const r1 = getRandomInt(2, 15);
    const r2 = getRandomInt(2, 15);
    const isAdd = Math.random() > 0.4;
    let val1 = r1 * r1;
    let val2 = r2 * r2;
    if (!isAdd && r1 < r2) {
      return { q: `√${val2} - √${val1} = ?`, ans: r2 - r1 };
    }
    return {
      q: `√${val1} ${isAdd ? '+' : '-'} √${val2} = ?`,
      ans: isAdd ? (r1 + r2) : (r1 - r2)
    };
  } else if (state.rootModeType === 'mult') {
    const a = getRandomInt(2, 8);
    const b = getRandomInt(2, 8);
    return { q: `√${a*a} × √${b*b} = ?`, ans: a * b };
  } else {
    const r = getRandomInt(3, 30);
    return { q: `√${r * r} = ?`, ans: r };
  }
}

// EXPONENTS GENERATOR
function genCustomExponents() {
  let base = 2, exp = 1;
  if (state.expModeType === '2n') {
    base = 2;
    exp = getRandomInt(1, 10);
  } else if (state.expModeType === '35n') {
    if (Math.random() > 0.5) {
      base = 3;
      exp = getRandomInt(1, 5);
    } else {
      base = 5;
      exp = getRandomInt(1, 4);
    }
  } else if (state.expModeType === 'sq') {
    base = getRandomInt(1, 25);
    exp = 2;
  } else if (state.expModeType === 'cube') {
    base = getRandomInt(1, 10);
    exp = 3;
  } else if (state.expModeType === '10n') {
    base = 10;
    exp = getRandomInt(1, 6);
  } else if (state.expModeType === 'mix') {
    base = getRandomInt(2, 9);
    exp = getRandomInt(2, 4);
  }

  const ans = Math.pow(base, exp);
  return {
    q: `${base}${toSuperscript(exp)} = ?`,
    ans: ans
  };
}

function toSuperscript(num) {
  const supers = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };
  return String(num).split('').map(d => supers[d] || d).join('');
}

// MULTIPLICATION TABLE GENERATOR
function genCustomMultiplicationTable() {
  const min = Math.min(state.multMin, state.multMax);
  const max = Math.max(state.multMin, state.multMax);

  const a = getRandomInt(min, max);
  const b = getRandomInt(1, 10);

  return {
    q: `${a} × ${b} = ?`,
    ans: a * b
  };
}

// MULTIPLICATION OPERATION GENERATOR
function genCustomMultiplicationOp() {
  let a = 0, b = 0;
  if (state.multOpModeType === 'rr') {
    a = getRandomInt(2, 9);
    b = getRandomInt(2, 9);
  } else if (state.multOpModeType === 'sr') {
    a = getRandomInt(10, 99);
    b = getRandomInt(2, 9);
  } else if (state.multOpModeType === 'ss') {
    a = getRandomInt(11, 99);
    b = getRandomInt(11, 99);
  } else if (state.multOpModeType === '3r') {
    a = getRandomInt(100, 999);
    b = getRandomInt(2, 9);
  } else if (state.multOpModeType === '3s') {
    a = getRandomInt(100, 999);
    b = getRandomInt(10, 99);
  } else if (state.multOpModeType === '4r') {
    a = getRandomInt(1000, 9999);
    b = getRandomInt(2, 9);
  } else if (state.multOpModeType === '4s') {
    a = getRandomInt(1000, 9999);
    b = getRandomInt(10, 99);
  } else if (state.multOpModeType === '10s') {
    const baseA = getRandomInt(2, 9);
    const baseB = getRandomInt(2, 9);
    const multA = Math.pow(10, getRandomInt(1, 2));
    const multB = Math.pow(10, getRandomInt(1, 2));
    a = baseA * multA;
    b = baseB * multB;
  }

  return {
    q: `${a} × ${b} = ?`,
    ans: a * b
  };
}

// ADDITION TRAINER GENERATOR
function genCustomAddition() {
  let a = 0, b = 0;
  if (state.addModeType === 'rr') {
    a = getRandomInt(1, 9);
    b = getRandomInt(1, 9);
  } else if (state.addModeType === 'sr') {
    a = getRandomInt(10, 99);
    b = getRandomInt(1, 9);
  } else if (state.addModeType === 'ss') {
    a = getRandomInt(10, 99);
    b = getRandomInt(10, 99);
  } else if (state.addModeType === '33') {
    a = getRandomInt(100, 999);
    b = getRandomInt(100, 999);
  } else if (state.addModeType === '44') {
    a = getRandomInt(1000, 9999);
    b = getRandomInt(1000, 9999);
  }

  return { q: `${a} + ${b} = ?`, ans: a + b };
}

// SUBTRACTION TRAINER GENERATOR
function genCustomSubtraction() {
  let a = 0, b = 0;
  if (state.subModeType === 'rr') {
    a = getRandomInt(2, 9);
    b = getRandomInt(1, a);
  } else if (state.subModeType === 'sr') {
    a = getRandomInt(12, 99);
    b = getRandomInt(1, 9);
  } else if (state.subModeType === 'ss') {
    a = getRandomInt(20, 99);
    b = getRandomInt(10, a);
  } else if (state.subModeType === '33') {
    a = getRandomInt(200, 999);
    b = getRandomInt(100, a);
  } else if (state.subModeType === '44') {
    a = getRandomInt(2000, 9999);
    b = getRandomInt(1000, a);
  }

  return { q: `${a} - ${b} = ?`, ans: a - b };
}

// DIVISION TRAINER GENERATOR
function genCustomDivision() {
  let quotient = 0, divisor = 0;
  if (state.divModeType === 'basit') {
    divisor = getRandomInt(2, 10);
    quotient = getRandomInt(1, 10);
  } else if (state.divModeType === 'sr') {
    divisor = getRandomInt(3, 9);
    quotient = getRandomInt(10, 30);
  } else if (state.divModeType === 'ss') {
    divisor = getRandomInt(11, 25);
    quotient = getRandomInt(10, 25);
  } else if (state.divModeType === '3s') {
    divisor = getRandomInt(5, 35);
    quotient = getRandomInt(10, 45);
  } else if (state.divModeType === '4s') {
    divisor = getRandomInt(12, 99);
    quotient = getRandomInt(20, 99);
  }

  let dividend = divisor * quotient;
  return { q: `${dividend} ÷ ${divisor} = ?`, ans: quotient };
}

// Campaign Generators
function genLevel1() {
  const isAdd = Math.random() > 0.4;
  let a = getRandomInt(5, 50), b = getRandomInt(5, 50);
  if (!isAdd && a < b) [a, b] = [b, a];
  return { q: `${a} ${isAdd ? '+' : '-'} ${b} = ?`, ans: isAdd ? a + b : a - b };
}

function genLevel2() {
  const isMult = Math.random() > 0.4;
  let a = getRandomInt(2, 12), b = getRandomInt(3, 15);
  if (isMult) return { q: `${a} × ${b} = ?`, ans: a * b };
  let product = a * b;
  return { q: `${product} ÷ ${a} = ?`, ans: b };
}

function genLevel3() {
  const type = getRandomInt(1, 3);
  let a = getRandomInt(2, 15), b = getRandomInt(2, 12), c = getRandomInt(2, 10);
  if (type === 1) return { q: `${a} + ${b} × ${c} = ?`, ans: a + (b * c) };
  if (type === 2) return { q: `(${a} + ${b}) × ${c} = ?`, ans: (a + b) * c };
  let mult = a * b;
  if (mult < c) c = getRandomInt(1, mult);
  return { q: `${a} × ${b} - ${c} = ?`, ans: mult - c };
}

function genLevel4() {
  const type = getRandomInt(1, 3);
  let x = getRandomInt(2, 25);
  if (type === 1) {
    let a = getRandomInt(5, 40);
    return { q: `x + ${a} = ${x + a}  ➔  x = ?`, ans: x };
  } else if (type === 2) {
    let k = getRandomInt(2, 6), a = getRandomInt(2, 20);
    return { q: `${k}x - ${a} = ${(k * x) - a}  ➔  x = ?`, ans: x };
  } else {
    let k = getRandomInt(2, 5), a = getRandomInt(5, 30);
    let totalX = x * k;
    return { q: `${totalX} / x + ${a} = ${x + a}  ➔  x = ?`, ans: k };
  }
}

function genLevel5() {
  const type = getRandomInt(1, 3);
  let a = getRandomInt(-20, 20), b = getRandomInt(-20, 20);
  if (a === 0) a = -5; if (b === 0) b = 7;
  let bStr = b < 0 ? `(${b})` : `${b}`;
  if (type === 1) return { q: `${a} + ${bStr} = ?`, ans: a + b };
  if (type === 2) return { q: `${a} - ${bStr} = ?`, ans: a - b };
  return { q: `${a} × ${bStr} = ?`, ans: a * b };
}

function genLevel6() {
  const type = getRandomInt(1, 3);
  if (type === 1) {
    let a = getRandomInt(3, 15);
    return { q: `${a}² = ?`, ans: a * a };
  } else if (type === 2) {
    let root = getRandomInt(3, 16), b = getRandomInt(2, 20);
    return { q: `√${root * root} + ${b} = ?`, ans: root + b };
  } else {
    let a = getRandomInt(2, 6);
    return { q: `${a}³ = ?`, ans: Math.pow(a, 3) };
  }
}

function genLevel7() {
  const isSingle = Math.random() > 0.5;
  let mod = getRandomInt(3, 11);
  if (isSingle) {
    let num = getRandomInt(15, 150);
    return { q: `${num} mod ${mod} = ?`, ans: num % mod };
  } else {
    let a = getRandomInt(4, 15), b = getRandomInt(4, 15);
    return { q: `(${a} × ${b}) mod ${mod} = ?`, ans: (a * b) % mod };
  }
}

function genLevel8() {
  const type = getRandomInt(1, 3);
  if (type === 1) {
    let start = getRandomInt(2, 20), diff = getRandomInt(3, 12);
    let s = [start, start + diff, start + 2 * diff, start + 3 * diff];
    return { q: `Dizi: ${s.join(', ')}, [ ? ]`, ans: start + 4 * diff };
  } else if (type === 2) {
    let start = getRandomInt(1, 5), r = getRandomInt(2, 4);
    let s = [start, start * r, start * r * r];
    return { q: `Dizi: ${s.join(', ')}, [ ? ]`, ans: start * r * r * r };
  } else {
    let a = getRandomInt(1, 4), b = getRandomInt(2, 6);
    let c = a + b, d = b + c;
    return { q: `Dizi: ${a}, ${b}, ${c}, ${d}, [ ? ]`, ans: c + d };
  }
}

function genLevel9() {
  const type = getRandomInt(1, 3);
  if (type === 1) {
    let num = getRandomInt(5, 63);
    return { q: `0b${num.toString(2).padStart(6, '0')} (Decimal) = ?`, ans: num };
  } else if (type === 2) {
    let a = getRandomInt(4, 25), b = getRandomInt(4, 25);
    return { q: `0x${a.toString(16).toUpperCase()} + 0x${b.toString(16).toUpperCase()} (Decimal) = ?`, ans: a + b };
  } else {
    let num = getRandomInt(8, 31);
    return { q: `${num} (Binary) = 0b?`, ans: num.toString(2) };
  }
}

function genLevel10() {
  const gens = [genLevel3, genLevel4, genLevel6, genLevel7, genLevel8, genLevel9];
  const item = gens[Math.floor(Math.random() * gens.length)]();
  item.q = `[QUANTUM] ` + item.q;
  return item;
}

// ==========================================
// 6. DOM ELEMENTS & STATE MANAGEMENT
// ==========================================
const scoreDisplay = document.getElementById('score-display');
const streakDisplay = document.getElementById('streak-display');
const highscoreDisplay = document.getElementById('highscore-display');
const timerBox = document.getElementById('timer-box');
const timerDisplay = document.getElementById('timer-display');

const soundBtn = document.getElementById('sound-btn');
const soundIcon = document.getElementById('sound-icon');
const matrixToggleBtn = document.getElementById('matrix-toggle-btn');
const statsBtn = document.getElementById('stats-btn');
const modeBtn = document.getElementById('mode-btn');
const docsBtn = document.getElementById('docs-btn');
const dailyBtn = document.getElementById('daily-btn');

const levelBadge = document.getElementById('level-badge');
const levelTitle = document.getElementById('level-title');
const levelSub = document.getElementById('level-desc');
const levelProgressText = document.getElementById('level-progress-text');
const levelProgressFill = document.getElementById('level-progress-fill');
const modeStatusIndicator = document.getElementById('mode-status-indicator');

const cipherGlitchText = document.getElementById('cipher-glitch-text');
const questionText = document.getElementById('question-text');
const feedbackBanner = document.getElementById('feedback-banner');
const feedbackText = document.getElementById('feedback-text');

const answerForm = document.getElementById('answer-form');
const answerInput = document.getElementById('answer-input');
const logContent = document.getElementById('log-content');
const logClock = document.getElementById('log-clock');

const campaignLevelNav = document.getElementById('campaign-level-nav');
const levelButtonsContainer = document.getElementById('level-buttons-container');

// Modals
const modeModal = document.getElementById('mode-modal');
const closeModeBtn = document.getElementById('close-mode-btn');
const docsModal = document.getElementById('docs-modal');
const closeDocsBtn = document.getElementById('close-docs-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats-btn');
const levelupModal = document.getElementById('levelup-modal');
const levelupLevelTitle = document.getElementById('levelup-level-title');
const levelupDesc = document.getElementById('levelup-desc');
const nextLevelBtn = document.getElementById('next-level-btn');

const dailyModal = document.getElementById('daily-modal');
const closeDailyBtn = document.getElementById('close-daily-btn');
const startDailyBtn = document.getElementById('start-daily-btn');
const dailyDateTitle = document.getElementById('daily-date-title');
const dailyStatusText = document.getElementById('daily-status-text');
const dailyBestScore = document.getElementById('daily-best-score');

const timeupModal = document.getElementById('timeup-modal');
const timeupSolvedCount = document.getElementById('timeup-solved-count');
const timeupFinalScore = document.getElementById('timeup-final-score');
const timeupBestStreak = document.getElementById('timeup-best-streak');
const restartTimerBtn = document.getElementById('restart-timer-btn');
const hackerTimerCheckbox = document.getElementById('hacker-timer-checkbox');

function loadSavedData() {
  try {
    const saved = localStorage.getItem('MATH_DECIPHER_SAVE_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      state.highScore = parsed.highScore || 0;
      state.unlockedLevelIndex = parsed.unlockedLevelIndex || 0;
      state.totalSolved = parsed.totalSolved || 0;
      state.totalAttempts = parsed.totalAttempts || 0;
      state.bestStreak = parsed.bestStreak || 0;
      state.badges = parsed.badges || [];
      if (parsed.dailyState && parsed.dailyState.dateStr === getTodayDateString()) {
        state.dailyState = parsed.dailyState;
      }
    }
  } catch (e) {
    console.error('Save loading error:', e);
  }
}

function saveData() {
  try {
    const toSave = {
      highScore: state.highScore,
      unlockedLevelIndex: state.unlockedLevelIndex,
      totalSolved: state.totalSolved,
      totalAttempts: state.totalAttempts,
      bestStreak: state.bestStreak,
      badges: state.badges,
      dailyState: state.dailyState
    };
    localStorage.setItem('MATH_DECIPHER_SAVE_v3', JSON.stringify(toSave));
  } catch (e) {
    console.error('Save writing error:', e);
  }
}

function initApp() {
  loadSavedData();
  generateDailyQuestions();
  resizeMatrix();
  window.addEventListener('resize', resizeMatrix);

  setInterval(drawMatrix, 45);
  setInterval(updateClock, 1000);
  updateClock();

  renderLevelButtons();
  initModeModalEvents();
  initDocsModalEvents();

  updateHUD();
  loadQuestion();

  setTimeout(renderKaTeX, 300);

  soundBtn.addEventListener('click', toggleSound);
  if (matrixToggleBtn) matrixToggleBtn.addEventListener('click', toggleMatrix);
  statsBtn.addEventListener('click', openStatsModal);
  closeStatsBtn.addEventListener('click', closeStatsModal);
  modeBtn.addEventListener('click', openModeModal);
  closeModeBtn.addEventListener('click', closeModeModal);
  docsBtn.addEventListener('click', openDocsModal);
  closeDocsBtn.addEventListener('click', closeDocsModal);

  if (dailyBtn) dailyBtn.addEventListener('click', openDailyModal);
  if (closeDailyBtn) closeDailyBtn.addEventListener('click', closeDailyModal);
  if (startDailyBtn) startDailyBtn.addEventListener('click', startDailyChallengeRun);

  nextLevelBtn.addEventListener('click', closeLevelupModal);
  if (restartTimerBtn) restartTimerBtn.addEventListener('click', restartHackerTimerRun);

  answerForm.addEventListener('submit', handleAnswerSubmit);

  document.querySelectorAll('.numpad-btn').forEach(btn => {
    btn.addEventListener('click', handleNumpadClick);
  });

  document.addEventListener('keydown', (e) => {
    initAudio();
    if (e.key === 'Escape') {
      answerInput.value = '';
      closeStatsModal();
      closeModeModal();
      closeDocsModal();
      closeDailyModal();
      closeLevelupModal();
      if (timeupModal) timeupModal.classList.add('hidden');
    }
  });

  document.addEventListener('click', () => initAudio());
}

function updateClock() {
  const d = new Date();
  logClock.textContent = d.toTimeString().split(' ')[0];
}

// DAILY CHALLENGE MODAL LOGIC
function openDailyModal() {
  playKeySound();
  dailyDateTitle.textContent = `TARIH: ${getTodayDateString()}`;
  if (state.dailyState.completed) {
    dailyStatusText.textContent = '✅ BUGÜNKÜ GÖREV TAMAMLANTI!';
    dailyStatusText.className = 'text-green';
    startDailyBtn.textContent = '🔄 RE-PLAY GÜNLÜK MÜCADELE';
  } else {
    dailyStatusText.textContent = '⏳ TAMAMLATILMADI (10/10 GÖREV)';
    dailyStatusText.className = 'text-gold';
    startDailyBtn.textContent = '🚀 GÜNLÜK MÜCADELEYİ BAŞLAT (10 SORU)';
  }
  dailyBestScore.textContent = `${state.dailyState.bestScore} PTS`;
  dailyModal.classList.remove('hidden');
}

function closeDailyModal() {
  playKeySound();
  dailyModal.classList.add('hidden');
}

function startDailyChallengeRun() {
  playKeySound();
  closeDailyModal();
  state.activeMode = 'DAILY_CHALLENGE';
  state.dailyState.currentIndex = 0;
  addLog(`[MOD] 🏆 Günlük Siber Mücadele Başlatıldı! (10 Soru)`, 'levelup');
  updateHUD();
  loadQuestion();
}

// HACKER TIMER LOGIC
function startHackerTimer() {
  stopHackerTimer();
  state.timerSeconds = 60;
  timerBox.classList.remove('hidden');
  timerDisplay.textContent = `${state.timerSeconds}s`;

  state.timerInterval = setInterval(() => {
    state.timerSeconds--;
    if (state.timerSeconds < 0) state.timerSeconds = 0;
    timerDisplay.textContent = `${state.timerSeconds}s`;

    if (state.timerSeconds <= 0) {
      stopHackerTimer();
      triggerTimeUpModal();
    }
  }, 1000);
}

function stopHackerTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function triggerTimeUpModal() {
  playErrorSound();
  timeupSolvedCount.textContent = state.totalSolved;
  timeupFinalScore.textContent = state.score;
  timeupBestStreak.textContent = state.bestStreak;
  timeupModal.classList.remove('hidden');
  addLog(`[TIME_OUT] Süreniz doldu! Toplam Skor: ${state.score}`, 'error');
}

function restartHackerTimerRun() {
  playKeySound();
  timeupModal.classList.add('hidden');
  state.score = 0;
  state.streak = 0;
  startHackerTimer();
  updateHUD();
  loadQuestion();
}

function updateHUD() {
  scoreDisplay.textContent = String(state.score).padStart(5, '0');
  highscoreDisplay.textContent = String(state.highScore).padStart(5, '0');

  const mult = Math.min(5, 1 + Math.floor(state.streak / 3));
  streakDisplay.textContent = `x${mult} (${state.streak})`;

  let timerTag = state.hackerTimerEnabled ? ' [⚡ TIMER 60s]' : '';

  if (state.activeMode === 'CAMPAIGN') {
    campaignLevelNav.style.display = 'flex';
    const level = LEVELS[state.currentLevelIndex];
    levelBadge.textContent = `CLEARANCE: ${level.code}`;
    levelTitle.textContent = level.title + timerTag;
    levelSub.textContent = level.sub;
    modeStatusIndicator.textContent = `● KARİYER KATMANI: ${level.code}${timerTag}`;

    levelProgressText.textContent = `ÇÖZÜLEN: ${state.levelSolvedCount} / ${level.required}`;
    const pct = Math.min(100, (state.levelSolvedCount / level.required) * 100);
    levelProgressFill.style.width = `${pct}%`;
  } else if (state.activeMode === 'DAILY_CHALLENGE') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: GÜNLÜK MÜCADELE`;
    levelTitle.textContent = `🏆 GÜNLÜK SİBER GÖREV (${state.dailyState.currentIndex + 1} / 10)${timerTag}`;
    levelSub.textContent = `Bugünün özel 10 soruluk siber görev pakedi. 10/10 yaparak liderliğe tırman!`;
    modeStatusIndicator.textContent = `● GÜNLÜK MÜCADELE: [${state.dailyState.currentIndex + 1}/10]${timerTag}`;

    levelProgressText.textContent = `GÖREV: ${state.dailyState.currentIndex + 1} / 10`;
    const pct = Math.min(100, (state.dailyState.currentIndex / 10) * 100);
    levelProgressFill.style.width = `${pct}%`;
  } else if (state.activeMode === 'COMPUTER_BASES') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: SAYI SİSTEMLERİ`;

    let typeTitle = 'Binary ➔ Onluk';
    if (state.basesModeType === 'dec2bin') typeTitle = 'Onluk ➔ Binary';
    if (state.basesModeType === 'hex') typeTitle = 'Hexadecimal ➔ Onluk';
    if (state.basesModeType === 'dec2hex') typeTitle = 'Onluk ➔ Hexadecimal';
    if (state.basesModeType === 'oct') typeTitle = 'Octal ➔ Onluk';
    if (state.basesModeType === 'dec2oct') typeTitle = 'Onluk ➔ Octal';
    if (state.basesModeType === 'add') typeTitle = 'Hex & Binary Toplama';
    if (state.basesModeType === 'mix') typeTitle = '🔥 Karışık Siber Dönüşüm';

    levelTitle.textContent = `💾 SAYI SİSTEMLERİ DÖNÜŞÜMÜ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Binary, Hexadecimal, Octal ve Onluk (Decimal) çift yönlü dönüştürme modu.`;
    modeStatusIndicator.textContent = `● SAYI SİSTEMLERİ: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'MATH_TRIVIA') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: MATEMATİK EZBERİ`;

    let typeTitle = 'Açı & Sabit Ezberi';
    if (state.triviaModeType === 'primes') typeTitle = 'Asal & Mükemmel Sayılar';
    if (state.triviaModeType === 'mix') typeTitle = '🔥 Karışık Ezber Testi';

    levelTitle.textContent = `🧠 GENEL MATEMATİK EZBERİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Matematiksel sabitler, açılar ve asal sayı bilgisi ezberleştirme modu.`;
    modeStatusIndicator.textContent = `● MATEMATİK EZBERİ: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'LOGARITHM') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: LOGARİTMA`;

    let typeTitle = '2 ve 3 Tabanlı';
    if (state.logModeType === '10') typeTitle = 'Onluk Taban (log₁₀)';
    if (state.logModeType === 'rule') typeTitle = 'Özdeşlik Kuralları';
    if (state.logModeType === 'mix') typeTitle = '🔥 Karışık Logaritma';

    levelTitle.textContent = `🪵 LOGARİTMA HESAPLAMA (${typeTitle})${timerTag}`;
    levelSub.textContent = `Zihinsel logaritma ve taban kuvveti bulma alıştırma modu.`;
    modeStatusIndicator.textContent = `● LOGARİTMA MODU: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'PERCENTAGE') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: YÜZDE HESABI`;
    levelTitle.textContent = `📊 YÜZDE VE ORAN HESAPLAMA${timerTag}`;
    levelSub.textContent = `Zihinsel yüzde alma ve pratik oran hesaplama alıştırma modu.`;
    modeStatusIndicator.textContent = `● YÜZDE HESAPLAMA MODU${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'GEOMETRY') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: GEOMETRİ`;
    levelTitle.textContent = `📏 GEOMETRİ & ÖZEL ÜÇGENLER${timerTag}`;
    levelSub.textContent = `Zihinsel 3-4-5 dik üçgen hipotenüsü, kare/dikdörtgen alan ve çevre modu.`;
    modeStatusIndicator.textContent = `● GEOMETRİ VE ALAN HESABI${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'FACTORIAL') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: FAKTÖRİYEL`;
    levelTitle.textContent = `🎲 FAKTÖRİYEL HESAPLAMA (n!)${timerTag}`;
    levelSub.textContent = `Faktöriyel değerleri ve sadeleştirmeli bölme hesabı modu.`;
    modeStatusIndicator.textContent = `● FAKTÖRİYEL VE ORANLAR${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'MULTIPLICATION_TABLE') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: ÇARPIM TABLOSU`;
    levelTitle.textContent = `✖️ ÇARPIM TABLOSU (${state.multMin} - ${state.multMax})${timerTag}`;
    levelSub.textContent = `Çarpan Aralığı: ${state.multMin} ile ${state.multMax} arası sayılar. Kodları çöz!`;
    modeStatusIndicator.textContent = `● ÇARPIM ARALIĞI: [${state.multMin} - ${state.multMax}]${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'MULTIPLICATION_OP') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: ÇARPIM İŞLEMİ`;

    let typeTitle = 'Rakam × Rakam';
    if (state.multOpModeType === 'sr') typeTitle = 'Sayı × Rakam';
    if (state.multOpModeType === 'ss') typeTitle = 'Sayı × Sayı';
    if (state.multOpModeType === '3r') typeTitle = '3 Basamak × Rakam';
    if (state.multOpModeType === '3s') typeTitle = '🔥 3 Basamak × Sayı';
    if (state.multOpModeType === '4r') typeTitle = '🔥 4 Basamak × Rakam';
    if (state.multOpModeType === '4s') typeTitle = '🔥 4 Basamak × Sayı';
    if (state.multOpModeType === '10s') typeTitle = "10'un Katları";

    levelTitle.textContent = `✖️ ÇARPIM İŞLEMİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `İleri düzey zihinsel çarpma alıştırma modu.`;
    modeStatusIndicator.textContent = `● ÇARPIM İŞLEMİ: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'EXPONENTS') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: ÜSLÜ SAYILAR`;

    let typeTitle = "2'nin Kuvvetleri (2ⁿ)";
    if (state.expModeType === '35n') typeTitle = "3 & 5'in Kuvvetleri";
    if (state.expModeType === 'sq') typeTitle = 'Tam Kareler (x²)';
    if (state.expModeType === 'cube') typeTitle = 'Küp İfadeler (x³)';
    if (state.expModeType === '10n') typeTitle = "10'un Kuvvetleri (10ⁿ)";
    if (state.expModeType === 'mix') typeTitle = '🔥 Karışık Üslü Sayılar';

    levelTitle.textContent = `⚡ ÜSLÜ SAYILAR (${typeTitle})${timerTag}`;
    levelSub.textContent = `Zihinsel üslü ifade ve hafıza kuvvetlendirme modu.`;
    modeStatusIndicator.textContent = `● ÜSLÜ SAYILAR: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'SQUARE_ROOTS') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: KAREKÖK`;

    let typeTitle = 'Tam Kare Kökler';
    if (state.rootModeType === 'addsub') typeTitle = 'Köklü Toplama/Çıkarma';
    if (state.rootModeType === 'mult') typeTitle = 'Köklü Çarpma';
    if (state.rootModeType === 'mix') typeTitle = '🔥 Karışık Karekök';

    levelTitle.textContent = `√ KAREKÖK İFADELER (${typeTitle})${timerTag}`;
    levelSub.textContent = `Köklü ifadeler ve zihinsel tam kare hesabı alıştırma modu.`;
    modeStatusIndicator.textContent = `● KAREKÖK İFADELER: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'TRIGONOMETRY') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: TRİGONOMETRİ`;

    let typeTitle = 'Temel Açılar';
    if (state.trigoModeType === 'quad') typeTitle = 'Eksen Açıları';
    if (state.trigoModeType === 'ident') typeTitle = 'Özdeşlikler';
    if (state.trigoModeType === 'mix') typeTitle = '🔥 Karışık Trigonometri';

    levelTitle.textContent = `📐 TRİGONOMETRİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Trigonometrik özel açı değerleri ve özdeşlik ezberleme modu.`;
    modeStatusIndicator.textContent = `● TRİGONOMETRİ: (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'ADDITION') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: TOPLAMA`;

    let typeTitle = 'Rakam + Rakam';
    if (state.addModeType === 'sr') typeTitle = 'Sayı + Rakam';
    if (state.addModeType === 'ss') typeTitle = 'Sayı + Sayı';
    if (state.addModeType === '33') typeTitle = '🔥 3 Basamaklı';
    if (state.addModeType === '44') typeTitle = '🔥 4 Basamaklı';

    levelTitle.textContent = `➕ TOPLAMA İŞLEMİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Toplama zihinsel işlem hızlandırma modu. Soruları yanıtla.`;
    modeStatusIndicator.textContent = `● TOPLAMA MODU (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'SUBTRACTION') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: ÇIKARMA`;

    let typeTitle = 'Rakam - Rakam';
    if (state.subModeType === 'sr') typeTitle = 'Sayı - Rakam';
    if (state.subModeType === 'ss') typeTitle = 'Sayı - Sayı';
    if (state.subModeType === '33') typeTitle = '🔥 3 Basamaklı';
    if (state.subModeType === '44') typeTitle = '🔥 4 Basamaklı';

    levelTitle.textContent = `➖ ÇIKARMA İŞLEMİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Zihinsel çıkarma ve hızlı refleks geliştirme modu.`;
    modeStatusIndicator.textContent = `● ÇIKARMA MODU (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  } else if (state.activeMode === 'DIVISION') {
    campaignLevelNav.style.display = 'none';
    levelBadge.textContent = `MODE: BÖLME`;

    let typeTitle = 'Basit Kalansız';
    if (state.divModeType === 'sr') typeTitle = 'Sayı ÷ Rakam';
    if (state.divModeType === 'ss') typeTitle = 'Sayı ÷ Sayı';
    if (state.divModeType === '3s') typeTitle = '🔥 3 Basamak ÷ Sayı';
    if (state.divModeType === '4s') typeTitle = '🔥 4 Basamak ÷ Sayı';

    levelTitle.textContent = `➗ BÖLME İŞLEMİ (${typeTitle})${timerTag}`;
    levelSub.textContent = `Kalansız bölme ve zihinsel çarpan mantığı çalıştırma modu.`;
    modeStatusIndicator.textContent = `● BÖLME MODU (${typeTitle})${timerTag}`;

    levelProgressText.textContent = `SERİ: ${state.streak}`;
    levelProgressFill.style.width = `100%`;
  }
}

function renderLevelButtons() {
  levelButtonsContainer.innerHTML = '';
  const modalCampaignList = document.getElementById('modal-campaign-list');
  if (modalCampaignList) modalCampaignList.innerHTML = '';

  LEVELS.forEach((lvl, idx) => {
    const isUnlocked = idx <= state.unlockedLevelIndex;
    const isActive = idx === state.currentLevelIndex && state.activeMode === 'CAMPAIGN';

    const btn = document.createElement('button');
    btn.className = `lvl-select-btn ${isActive ? 'active' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`;
    btn.textContent = `${lvl.code}`;
    btn.disabled = !isUnlocked;
    btn.addEventListener('click', () => selectCampaignLevel(idx));
    levelButtonsContainer.appendChild(btn);

    if (modalCampaignList) {
      const mBtn = document.createElement('button');
      mBtn.className = `preset-btn ${isActive ? 'active' : ''}`;
      mBtn.innerHTML = `
        <span class="preset-title">${lvl.code}: ${lvl.title}</span>
        <span class="preset-sub">${lvl.sub}</span>
      `;
      mBtn.disabled = !isUnlocked;
      if (!isUnlocked) mBtn.style.opacity = '0.4';
      mBtn.addEventListener('click', () => {
        selectCampaignLevel(idx);
        closeModeModal();
      });
      modalCampaignList.appendChild(mBtn);
    }
  });
}

function selectCampaignLevel(idx) {
  state.activeMode = 'CAMPAIGN';
  state.currentLevelIndex = idx;
  state.levelSolvedCount = 0;
  renderLevelButtons();
  updateHUD();
  loadQuestion();
  addLog(`[MOD] Kariyer Katmanı ${LEVELS[idx].code} aktif edildi.`, 'info');
  playKeySound();
}

// ==========================================
// 7. QUESTION & DECIPHER LOGIC
// ==========================================
function loadQuestion() {
  if (state.activeMode === 'CAMPAIGN') {
    const lvlConfig = LEVELS[state.currentLevelIndex];
    state.currentQuestion = lvlConfig.gen();
  } else if (state.activeMode === 'DAILY_CHALLENGE') {
    if (state.dailyState.currentIndex < state.dailyState.questions.length) {
      state.currentQuestion = state.dailyState.questions[state.dailyState.currentIndex];
    } else {
      state.dailyState.completed = true;
      if (state.score > state.dailyState.bestScore) state.dailyState.bestScore = state.score;
      saveData();
      addLog(`[GÜNLÜK GÖREV] TEBRİKLER! Bugünü 10/10 Tamamladınız! Skor: ${state.score}`, 'levelup');
      openDailyModal();
      return;
    }
  } else if (state.activeMode === 'COMPUTER_BASES') {
    state.currentQuestion = genCustomBases();
  } else if (state.activeMode === 'MATH_TRIVIA') {
    state.currentQuestion = genCustomMathTrivia();
  } else if (state.activeMode === 'LOGARITHM') {
    state.currentQuestion = genCustomLogarithm();
  } else if (state.activeMode === 'PERCENTAGE') {
    state.currentQuestion = genCustomPercentage();
  } else if (state.activeMode === 'GEOMETRY') {
    state.currentQuestion = genCustomGeometry();
  } else if (state.activeMode === 'FACTORIAL') {
    state.currentQuestion = genCustomFactorial();
  } else if (state.activeMode === 'MULTIPLICATION_TABLE') {
    state.currentQuestion = genCustomMultiplicationTable();
  } else if (state.activeMode === 'MULTIPLICATION_OP') {
    state.currentQuestion = genCustomMultiplicationOp();
  } else if (state.activeMode === 'EXPONENTS') {
    state.currentQuestion = genCustomExponents();
  } else if (state.activeMode === 'SQUARE_ROOTS') {
    state.currentQuestion = genCustomSquareRoots();
  } else if (state.activeMode === 'TRIGONOMETRY') {
    state.currentQuestion = genCustomTrigonometry();
  } else if (state.activeMode === 'ADDITION') {
    state.currentQuestion = genCustomAddition();
  } else if (state.activeMode === 'SUBTRACTION') {
    state.currentQuestion = genCustomSubtraction();
  } else if (state.activeMode === 'DIVISION') {
    state.currentQuestion = genCustomDivision();
  }

  let glitchTicks = 0;
  questionText.style.opacity = '0.5';

  const glitchInterval = setInterval(() => {
    let randHex = '';
    for (let i = 0; i < 12; i++) {
      randHex += katakana.charAt(Math.floor(Math.random() * katakana.length));
    }
    cipherGlitchText.textContent = randHex;
    glitchTicks++;

    if (glitchTicks > 5) {
      clearInterval(glitchInterval);
      cipherGlitchText.textContent = `HASH: [0x${Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase()}]`;
      questionText.textContent = state.currentQuestion.q;
      questionText.style.opacity = '1';
    }
  }, 40);

  answerInput.value = '';
  answerInput.focus();
}

function handleAnswerSubmit(e) {
  e.preventDefault();
  const val = answerInput.value.trim().toLowerCase();
  if (val === '') return;

  state.totalAttempts++;
  const userAns = val;
  const targetAns = String(state.currentQuestion.ans).trim().toLowerCase();
  const altAns = state.currentQuestion.altAns ? String(state.currentQuestion.altAns).trim().toLowerCase() : null;

  if (userAns === targetAns || (altAns && userAns === altAns)) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer(userAns, targetAns);
  }
}

function handleCorrectAnswer() {
  playSuccessSound();
  state.streak++;
  state.totalSolved++;
  state.levelSolvedCount++;

  if (state.streak > state.bestStreak) state.bestStreak = state.streak;

  const mult = Math.min(5, 1 + Math.floor(state.streak / 3));
  const points = 100 * (state.currentLevelIndex + 1) * mult;
  state.score += points;

  if (state.score > state.highScore) state.highScore = state.score;

  let extraText = '';
  if (state.hackerTimerEnabled) {
    state.timerSeconds += 2;
    timerDisplay.textContent = `${state.timerSeconds}s`;
    extraText = ' (+2s BONUS!)';
  }

  showFeedback(`[DECRYPTED] +${points} PTS${extraText}`, true);
  addLog(`[OK] Paket çözüldü! (+${points} puan)${extraText}`, 'success');

  checkBadges();
  saveData();

  if (state.activeMode === 'DAILY_CHALLENGE') {
    state.dailyState.currentIndex++;
    setTimeout(loadQuestion, 350);
  } else if (state.activeMode === 'CAMPAIGN') {
    const currentLvlConfig = LEVELS[state.currentLevelIndex];
    if (state.levelSolvedCount >= currentLvlConfig.required) {
      if (state.currentLevelIndex < LEVELS.length - 1) {
        if (state.currentLevelIndex === state.unlockedLevelIndex) {
          state.unlockedLevelIndex++;
        }
        setTimeout(triggerLevelUpModal, 400);
      } else {
        addLog(`[SYSTEM] TEBRİKLER! Tüm Kuantum Katmanları Çözüldü!`, 'levelup');
        setTimeout(loadQuestion, 500);
      }
    } else {
      setTimeout(loadQuestion, 350);
    }
  } else {
    setTimeout(loadQuestion, 350);
  }

  updateHUD();
}

function handleWrongAnswer(userAns, targetAns) {
  playErrorSound();
  state.streak = 0;

  showFeedback(`[HATA] Girilen: ${userAns} | Doğru Şifre: ${targetAns}`, false);
  addLog(`[ERR] Hatalı kod! Paket reddedildi. Doğru yanıt: ${targetAns}`, 'error');

  updateHUD();
  answerInput.value = '';
  answerInput.focus();
}

function showFeedback(msg, isSuccess) {
  feedbackText.textContent = msg;
  feedbackBanner.className = `feedback-banner ${isSuccess ? 'success' : 'error'}`;
  feedbackBanner.classList.remove('hidden');

  setTimeout(() => {
    feedbackBanner.classList.add('hidden');
  }, 2000);
}

function addLog(text, type = 'info') {
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  const timeStr = new Date().toTimeString().split(' ')[0];
  line.textContent = `[${timeStr}] ${text}`;

  logContent.appendChild(line);
  logContent.scrollTop = logContent.scrollHeight;
}

function handleNumpadClick(e) {
  playKeySound();
  const key = e.currentTarget.getAttribute('data-key');
  if (key === 'clear') {
    answerInput.value = '';
  } else if (key === 'backspace') {
    answerInput.value = answerInput.value.slice(0, -1);
  } else if (key === 'submit') {
    answerForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  } else if (key === 'minus') {
    if (!answerInput.value.includes('-')) {
      answerInput.value = '-' + answerInput.value;
    }
  } else {
    answerInput.value += key;
  }
  answerInput.focus();
}

// ==========================================
// 8. DOCS MODAL & MODE SELECTION EVENTS
// ==========================================
function initDocsModalEvents() {
  const docsTabBtns = document.querySelectorAll('.docs-tab-btn');
  docsTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      docsTabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.docs-tab-content').forEach(tc => tc.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.getAttribute('data-docstab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.classList.add('active');
        renderKaTeX();
      }
    });
  });
}

function openDocsModal() {
  playKeySound();
  docsModal.classList.remove('hidden');
  setTimeout(renderKaTeX, 50);
}

function closeDocsModal() {
  playKeySound();
  docsModal.classList.add('hidden');
}

function initModeModalEvents() {
  // Modal Tabs
  const tabBtns = document.querySelectorAll('.mode-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

      e.currentTarget.classList.add('active');
      const targetId = e.currentTarget.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Hacker Timer Checkbox Toggle
  if (hackerTimerCheckbox) {
    hackerTimerCheckbox.addEventListener('change', (e) => {
      playKeySound();
      state.hackerTimerEnabled = e.target.checked;
      if (state.hackerTimerEnabled) {
        startHackerTimer();
        addLog(`[MOD] ⚡ Zamana Karşı Hacker Modu Etkinleştirildi! (60s)`, 'levelup');
      } else {
        stopHackerTimer();
        timerBox.classList.add('hidden');
        addLog(`[MOD] Zamana Karşı Mod Devre Dışı Bırakıldı.`, 'info');
      }
      updateHUD();
    });
  }

  // Quick Chips logic for Multiplication Table
  document.querySelectorAll('.chip-btn[data-min]').forEach(chip => {
    chip.addEventListener('click', (e) => {
      playKeySound();
      const min = e.currentTarget.getAttribute('data-min');
      const max = e.currentTarget.getAttribute('data-max');
      document.getElementById('mult-min').value = min;
      document.getElementById('mult-max').value = max;
    });
  });

  // Apply Direct Multiplication Range Button
  const applyMultBtn = document.getElementById('apply-custom-mult-btn');
  if (applyMultBtn) {
    applyMultBtn.addEventListener('click', () => {
      playKeySound();
      const minInput = parseInt(document.getElementById('mult-min').value, 10) || 1;
      const maxInput = parseInt(document.getElementById('mult-max').value, 10) || 10;
      
      state.activeMode = 'MULTIPLICATION_TABLE';
      state.multMin = Math.min(minInput, maxInput);
      state.multMax = Math.max(minInput, maxInput);

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Çarpım Tablosu [${state.multMin}-${state.multMax}] başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  }

  // Multiplication Operation Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="mult-op-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const opKind = type.replace('mult-op-', '');
      state.activeMode = 'MULTIPLICATION_OP';
      state.multOpModeType = opKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Çarpım İşlemi Modu (${opKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Computer Number Systems Preset Buttons (ONLUK TABAN DAHİL)
  document.querySelectorAll('.preset-btn[data-type^="bases-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const basesKind = type.replace('bases-', '');
      state.activeMode = 'COMPUTER_BASES';
      state.basesModeType = basesKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Sayı Sistemleri Modu (${basesKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Exponents Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="exp-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const expKind = type.replace('exp-', '');
      state.activeMode = 'EXPONENTS';
      state.expModeType = expKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Üslü Sayılar Modu (${expKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Square Roots Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="root-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const rootKind = type.replace('root-', '');
      state.activeMode = 'SQUARE_ROOTS';
      state.rootModeType = rootKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Karekök İfadeler Modu (${rootKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Logarithm Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="log-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const logKind = type.replace('log-', '');
      state.activeMode = 'LOGARITHM';
      state.logModeType = logKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Logaritma Modu (${logKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // General Math Trivia Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="trivia-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const triviaKind = type.replace('trivia-', '');
      state.activeMode = 'MATH_TRIVIA';
      state.triviaModeType = triviaKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Matematik Ezberi Modu (${triviaKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Percentage Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="pct-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const pctKind = type.replace('pct-', '');
      state.activeMode = 'PERCENTAGE';
      state.pctModeType = pctKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Yüzde Hesabı Modu (${pctKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Geometry Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="geom-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const geomKind = type.replace('geom-', '');
      state.activeMode = 'GEOMETRY';
      state.geomModeType = geomKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Geometri Modu (${geomKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Factorial Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="fact-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const factKind = type.replace('fact-', '');
      state.activeMode = 'FACTORIAL';
      state.factModeType = factKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Faktöriyel Modu (${factKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Trigonometry Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="trigo-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const trigoKind = type.replace('trigo-', '');
      state.activeMode = 'TRIGONOMETRY';
      state.trigoModeType = trigoKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Trigonometri Modu (${trigoKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Addition Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="add-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const addKind = type.replace('add-', '');
      state.activeMode = 'ADDITION';
      state.addModeType = addKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Toplama İşlemi Modu (${addKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Subtraction Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="sub-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const subKind = type.replace('sub-', '');
      state.activeMode = 'SUBTRACTION';
      state.subModeType = subKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Çıkarma İşlemi Modu (${subKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });

  // Division Preset Buttons
  document.querySelectorAll('.preset-btn[data-type^="div-"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      playKeySound();
      const type = e.currentTarget.getAttribute('data-type');
      const divKind = type.replace('div-', '');
      state.activeMode = 'DIVISION';
      state.divModeType = divKind;

      if (state.hackerTimerEnabled) startHackerTimer();

      addLog(`[MOD] Bölme İşlemi Modu (${divKind}) başlatıldı.`, 'info');
      updateHUD();
      loadQuestion();
      closeModeModal();
    });
  });
}

function openModeModal() {
  playKeySound();
  modeModal.classList.remove('hidden');
}

function closeModeModal() {
  playKeySound();
  modeModal.classList.add('hidden');
}

// ==========================================
// 9. LEVEL UP & BADGES & STATS
// ==========================================
function triggerLevelUpModal() {
  playLevelUpSound();
  const nextLvlIndex = state.currentLevelIndex + 1;
  const nextLvl = LEVELS[nextLvlIndex];

  levelupLevelTitle.textContent = `SEVİYE YÜKSELTİLDİ: ${nextLvl.code}`;
  levelupDesc.textContent = `${nextLvl.title} açıldı! ${nextLvl.sub}`;
  levelupModal.classList.remove('hidden');

  renderLevelButtons();
}

function closeLevelupModal() {
  levelupModal.classList.add('hidden');
  state.currentLevelIndex++;
  state.levelSolvedCount = 0;
  renderLevelButtons();
  updateHUD();
  loadQuestion();
}

function checkBadges() {
  if (!state.badges.includes('b1') && state.totalSolved >= 1) unlockBadge('b1');
  if (!state.badges.includes('b2') && state.streak >= 5) unlockBadge('b2');
  if (!state.badges.includes('b3') && state.unlockedLevelIndex >= 4) unlockBadge('b3');
  if (!state.badges.includes('b4') && state.bestStreak >= 10) unlockBadge('b4');
  if (!state.badges.includes('b5') && state.unlockedLevelIndex >= 8) unlockBadge('b5');
  if (!state.badges.includes('b6') && state.unlockedLevelIndex >= 9 && state.levelSolvedCount >= 10) unlockBadge('b6');
}

function unlockBadge(id) {
  state.badges.push(id);
  const badge = BADGES.find(b => b.id === id);
  if (badge) {
    addLog(`[ROZET KAZANILDI!] ${badge.icon} ${badge.title}: ${badge.desc}`, 'levelup');
  }
}

function openStatsModal() {
  playKeySound();
  document.getElementById('stat-total-solved').textContent = state.totalSolved;

  const acc = state.totalAttempts > 0 ? Math.round((state.totalSolved / state.totalAttempts) * 100) : 100;
  document.getElementById('stat-accuracy').textContent = `${acc}%`;
  document.getElementById('stat-best-streak').textContent = state.bestStreak;

  const elapsedMins = (Date.now() - state.startTime) / 60000;
  const opm = elapsedMins > 0 ? Math.round(state.totalSolved / elapsedMins) : 0;
  document.getElementById('stat-opm').textContent = opm;

  const container = document.getElementById('badges-container');
  container.innerHTML = '';

  BADGES.forEach(b => {
    const isUnlocked = state.badges.includes(b.id);
    const div = document.createElement('div');
    div.className = `badge-item ${isUnlocked ? 'unlocked' : ''}`;
    div.innerHTML = `
      <span class="badge-icon">${isUnlocked ? b.icon : '🔒'}</span>
      <span class="badge-title">${b.title}</span>
    `;
    div.title = b.desc;
    container.appendChild(div);
  });

  statsModal.classList.remove('hidden');
}

function closeStatsModal() {
  playKeySound();
  statsModal.classList.add('hidden');
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  soundBtn.textContent = state.soundEnabled ? '🔊 SES' : '🔇 MUTE';
}

function toggleMatrix() {
  state.matrixEnabled = !state.matrixEnabled;
  if (matrixToggleBtn) matrixToggleBtn.textContent = state.matrixEnabled ? 'MATRIX' : 'NO-MATRIX';
  if (!state.matrixEnabled && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', initApp);
