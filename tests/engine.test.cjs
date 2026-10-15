const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Execute the browser script without starting the DOM-ready app. These lightweight
// adapters cover engine/storage contracts, not browser layout or accessibility.
function engine(saved) {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) {
      const classes = new Set();
      elements.set(id, {
        value: '', textContent: '', style: {}, children: [],
        classList: {
          add: name => classes.add(name), remove: name => classes.delete(name),
          contains: name => classes.has(name),
          toggle: (name, on = !classes.has(name)) => on ? classes.add(name) : classes.delete(name)
        },
        setAttribute() {}, focus() {}, appendChild(child) { this.children.push(child); }
      });
    }
    return elements.get(id);
  };
  const storage = new Map(saved === undefined ? [] : [['MATH_DECIPHER_SAVE_v3', saved]]);
  const sandbox = {
    document: {
      getElementById: id => id === 'matrix-canvas' ? null : element(id),
      addEventListener() {}, querySelector: () => null,
      createElement: () => element(Symbol())
    },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    console: { error() {} }, setTimeout: () => 1, clearTimeout() {},
    setInterval: () => 1, clearInterval() {},
    window: { matchMedia: () => ({ matches: true }) }
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(process.env.GAME_MATH_TEST_APP || path.join(__dirname, '..', 'app.js'), 'utf8'), context);
  return { run: code => vm.runInContext(code, context), storage, element };
}

for (const branch of [0.25, 0.75]) {
  test(`mixed geometry terminates with correct arithmetic (random ${branch})`, () => {
    const app = engine();
    app.run(`state.geomModeType = 'mix'; Math.random = () => ${branch}`);
    const question = app.run('genCustomGeometry()');
    if (branch === 0.25) {
      assert.equal(question.q, 'Kenarları 5 ve 7 cm olan dikdörtgenin Çevresi = ? cm');
      assert.equal(question.ans, 24);
    } else {
      assert.equal(question.q, 'Dik kenarları 8 ve 15 olan dik üçgenin hipotenüsü = ?');
      assert.equal(question.ans, 17);
    }
    assert.equal(app.run('state.geomModeType'), 'mix', 'mixed mode must stay selected');
  });
}

test('adding lesson progress round-trips legacy progress and unknown fields', () => {
  const legacy = {
    highScore: 14500, unlockedLevelIndex: 4, totalSolved: 48, totalAttempts: 52,
    bestStreak: 14, badges: ['b1', 'b2'], theme: 'clean', futureField: { keep: true },
    dailyState: { dateStr: new Date().toISOString().split('T')[0], completed: false,
      bestScore: 1200, currentIndex: 3, questions: [{ q: '3 + 5 = ?', ans: 8 }] }
  };
  const app = engine(JSON.stringify(legacy));
  app.run("loadSavedData(); state.learningProgress.tens = { exampleSeen: true, guidedStep: 1, practiceCorrect: [] }; saveData()");
  const result = JSON.parse(app.storage.get('MATH_DECIPHER_SAVE_v3'));
  for (const [key, value] of Object.entries(legacy)) assert.deepEqual(result[key], value, key);
  assert.equal(result.learningProgress.tens.guidedStep, 1);
  const reloaded = engine(JSON.stringify(result));
  reloaded.run('loadSavedData(); saveData()');
  assert.deepEqual(JSON.parse(reloaded.storage.get('MATH_DECIPHER_SAVE_v3')), result);
});

test('unreadable existing storage is preserved instead of overwritten', () => {
  const app = engine('{broken');
  app.run('loadSavedData(); state.totalSolved = 7; saveData()');
  assert.equal(app.storage.get('MATH_DECIPHER_SAVE_v3'), '{broken');
  assert.match(app.element('storage-notice').textContent, /Eski kaydın değiştirilmedi/);
});

test('keypad can compose decimal and hexadecimal answers and edit them', () => {
  const app = engine();
  function press(key) {
    app.run(`handleNumpadClick({ currentTarget: { getAttribute: () => ${JSON.stringify(key)} } })`);
  }
  press('.'); press('5');
  assert.equal(app.element('answer-input').value, '0.5');
  press('.');
  assert.equal(app.element('answer-input').value, '0.5');
  press('clear'); press('A'); press('F');
  assert.equal(app.element('answer-input').value, 'AF');
  press('backspace'); press('B');
  assert.equal(app.element('answer-input').value, 'AB');
  press('clear'); press('minus'); press('.'); press('5');
  assert.equal(app.element('answer-input').value, '-0.5');
});

test('correct answer keeps scoring and timer bonus but cannot score twice during transition', () => {
  const app = engine();
  app.run("state.activeMode = 'ADDITION'; state.currentQuestion = { q: '2 + 3', ans: 5 }; state.hackerTimerEnabled = true; state.timerSeconds = 40");
  app.element('answer-input').value = '5';
  app.run('handleAnswerSubmit({ preventDefault() {} }); handleAnswerSubmit({ preventDefault() {} })');
  assert.equal(app.run('state.score'), 100);
  assert.equal(app.run('state.timerSeconds'), 42);
  assert.equal(app.run('state.totalSolved'), 1);
  assert.equal(app.run('state.totalAttempts'), 1);
});

test('unlock and daily index are saved after successful answer transitions', () => {
  const app = engine();
  app.run('state.levelSolvedCount = 4; handleCorrectAnswer()');
  assert.equal(JSON.parse(app.storage.get('MATH_DECIPHER_SAVE_v3')).unlockedLevelIndex, 1);
  app.run("state.activeMode = 'DAILY_CHALLENGE'; state.dailyState.currentIndex = 2; handleCorrectAnswer()");
  assert.equal(JSON.parse(app.storage.get('MATH_DECIPHER_SAVE_v3')).dailyState.currentIndex, 3);
});
