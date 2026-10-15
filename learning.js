/* Original Turkish lessons. Learning progress is separate from game scores. */
const LESSONS = [
  {
    id: 'tens', title: 'Onluğa tamamla', subtitle: 'Tanıdık bir sayıya küçük bir adım.',
    prerequisite: 'Ön bilgi: 10’a tamamlayan sayılar ve küçük toplamlar.',
    why: 'Bir toplananı parçalara ayırmak toplamı değiştirmez. İlk parçayla bir sonraki onluğa ulaşır, kalan parçayı sonra eklersin.',
    when: 'Bir sayı onluğa yakınsa ve diğer sayıda onu tamamlayacak kadar birim varsa kullanışlıdır.',
    example: { question: '28 + 7', steps: ['28’i 30’a tamamlamak için 2 gerekir.', '7’yi 2 + 5 olarak ayır. Yalnızca 2’yi kullandık; 5 kaldı.', '28 + 2 = 30. Sonra 30 + 5 = 35.'], rule: '28 + 7 = 28 + (2 + 5) = (28 + 2) + 5 = 35' },
    guided: [
      { question: '47 + 8', prompt: '47’ye kaç ekleyince 50 olur?', answer: 3, hint: '47’den 50’ye doğru say: 48, 49, 50.', feedback: '3 ekledik ve 50’ye ulaştık.', solution: '50 − 47 = 3.' },
      { question: '47 + 8 = 50 + ?', prompt: '8’in 3’ünü kullandık. Geriye kaç kaldı?', answer: 5, hint: '8’i 3 ve kalan parça olarak düşün. 8 − 3 işlemini yap.', feedback: '5 kaldı. 8’in tamamını yeniden eklemiyoruz.', solution: '8 = 3 + 5; kalan parça 5.' },
      { question: '50 + 5', prompt: 'Şimdi toplam kaç?', answer: 55, hint: '50’nin üzerine kalan 5’i ekle.', feedback: '47 + 8 = 55. Parçalar değişti, toplam aynı kaldı.', solution: '50 + 5 = 55.' }
    ],
    practice: [
      { id: 't1', question: '36 + 7', answer: 43, hint: '36’yı 40’a tamamla. 7’nin ne kadarı kalır?', solution: '7 = 4 + 3; 36 + 4 = 40; 40 + 3 = 43.' },
      { id: 't2', question: '58 + 6', answer: 64, hint: '60’a ulaşmak için önce 2 kullan.', solution: '6 = 2 + 4; 58 + 2 = 60; 60 + 4 = 64.' },
      { id: 't3', question: '79 + 5', answer: 84, hint: '80’e yalnızca 1 kaldı. 5’i 1 ve bir parça olarak ayır.', solution: '5 = 1 + 4; 79 + 1 = 80; 80 + 4 = 84.' }
    ]
  },
  {
    id: 'decompose', title: 'Sayıları parçala', subtitle: 'Onluklar ve birliklerle ilerle.',
    prerequisite: 'Ön bilgi: onlar/birler basamağı, toplama ve çıkarma.',
    why: 'Bir sayı onlukları ile birliklerinin toplamıdır. Toplarken parçaları sırayla ekleyebilirsin. Çıkarırken çıkarılan sayının her parçasını da çıkarmalısın.',
    when: 'İki basamaklı sayılarla çalışırken ara işlemleri daha tanıdık hale getirebilir. Örneğin 64 − 23 = 64 − 20 − 3 = 41.',
    example: { question: '42 + 36', steps: ['36’yı 30 + 6 olarak ayır.', 'Önce onlukları ekle: 42 + 30 = 72.', 'Sonra birlikleri ekle: 72 + 6 = 78.'], rule: '42 + (30 + 6) = (42 + 30) + 6 = 78' },
    guided: [
      { question: '53 + 24', prompt: '24 = 20 + ? Eksik parça kaç?', answer: 4, hint: '24’te iki onluk ve dört birlik vardır.', feedback: '24’ü 20 ve 4 olarak ayırdık.', solution: '24 − 20 = 4.' },
      { question: '53 + 20', prompt: 'Önce onlukları ekleyelim. Ara toplam kaç?', answer: 73, hint: '53’e iki onluk ekle. Birler basamağındaki 3 aynı kalır.', feedback: 'Ara toplam 73. Henüz 4 birliği eklemedik.', solution: '53 + 20 = 73.' },
      { question: '73 + 4', prompt: 'Kalan 4 birliği de ekle. Sonuç kaç?', answer: 77, hint: '73’ten dört ileri git.', feedback: '53 + 24 = 77. Her parçayı bir kez ekledik.', solution: '73 + 4 = 77.' }
    ],
    practice: [
      { id: 'd1', question: '32 + 45', answer: 77, hint: '45 = 40 + 5. Önce 40’ı ekle.', solution: '32 + 40 = 72; 72 + 5 = 77.' },
      { id: 'd2', question: '46 + 27', answer: 73, hint: 'Önce 20’yi, sonra 7’yi ekle. Birlikler yeni bir onluk oluşturabilir.', solution: '46 + 20 = 66; 66 + 7 = 73.' },
      { id: 'd3', question: '86 − 32', answer: 54, hint: '32 = 30 + 2. Önce 30’u, sonra 2’yi çıkar; ikinci parçayı ekleme.', solution: '86 − 30 = 56; 56 − 2 = 54.' }
    ]
  },
  {
    id: 'compensate', title: 'Yuvarla ve dengele', subtitle: 'Kolaylaştır, sonra farkı düzelt.',
    prerequisite: 'Ön bilgi: onluklar, toplama/çıkarma ve yuvarlama farkı.',
    why: 'Yuvarlama işlemi değiştirir. Tam sonucu bulmak için bu değişikliği geri alırız. Bu derste yalnızca ikinci sayıyı yuvarlıyoruz.',
    when: 'İkinci sayı bir onluğa yakınken işe yarayabilir. Toplamada fazla eklediğini çıkar, eksik eklediğini ekle. Çıkarmada fazla çıkardığını geri ekle, eksik çıkardığını çıkar.',
    example: { question: '56 + 29  /  83 − 29', steps: ['29’u 30 yapınca 1 artırdık.', 'Toplama: 56 + 30 = 86. Fazladan eklediğimiz 1’i çıkar: 86 − 1 = 85.', 'Çıkarma: 83 − 30 = 53. Fazladan çıkardığımız 1’i geri ekle: 53 + 1 = 54.'], rule: 'Aşağı yuvarlarsan yön tersine döner: 56 + 31 = 56 + 30 + 1 = 87; 83 − 31 = 83 − 30 − 1 = 52.' },
    guided: [
      { question: '46 + 29 → 46 + 30', prompt: 'Önce yuvarlanmış toplamı bul. 46 + 30 kaç?', answer: 76, hint: '46’ya üç onluk ekle.', feedback: '76 bulduk; ancak 29 yerine 30 ekledik.', solution: '46 + 30 = 76.' },
      { question: '46 + 29 = 76 − ?', prompt: 'Fazla eklenen kaç birimi geri çıkarmalıyız?', answer: 1, hint: '30 ile 29 arasındaki farkı bul. Toplamada fazla eklenen çıkarılır.', feedback: '1’i çıkarırız: 76 − 1 = 75.', solution: '30 − 29 = 1; 46 + 29 = 75.' },
      { question: '83 − 29 → 83 − 30', prompt: 'Şimdi çıkarma. 83 − 30 kaç?', answer: 53, hint: '83’ten üç onluk çıkar.', feedback: '53 bulduk. Bu kez 1 fazla çıkardık.', solution: '83 − 30 = 53.' },
      { question: '83 − 29 = 53 + ?', prompt: 'Fazla çıkardığımız kaç birimi geri eklemeliyiz?', answer: 1, hint: '29 yerine 30 çıkardık. Sonucu 1 azalttık; 1 geri ekle.', feedback: '53 + 1 = 54. Çıkarmada fazla çıkan geri eklenir.', solution: '30 − 29 = 1; 83 − 29 = 54.' }
    ],
    practice: [
      { id: 'c1', question: '64 + 19', answer: 83, hint: '19 yerine 20 ekle. Fazla eklediğin 1’i sonra çıkar.', solution: '64 + 20 = 84; 84 − 1 = 83.' },
      { id: 'c2', question: '72 − 39', answer: 33, hint: '39 yerine 40 çıkar. Fazla çıkardığın 1’i geri ekle.', solution: '72 − 40 = 32; 32 + 1 = 33.' },
      { id: 'c3', question: '34 + 21', answer: 55, hint: '21’i 20’ye indirirsen 1 eksik eklersin. Sonra 1 daha ekle.', solution: '34 + 20 = 54; 54 + 1 = 55.' },
      { id: 'c4', question: '72 − 31', answer: 41, hint: '31 yerine 30 çıkarmak 1 eksik çıkarmaktır. Sonra 1 daha çıkar.', solution: '72 − 30 = 42; 42 − 1 = 41.' }
    ]
  }
];

let lessonSession = { index: 0, stage: 'example', guidedIndex: 0, practiceIndex: 0, answered: false };

function lessonProgress(lesson) {
  const existing = state.learningProgress[lesson.id];
  if (!existing || typeof existing !== 'object' || Array.isArray(existing)) state.learningProgress[lesson.id] = {};
  const progress = state.learningProgress[lesson.id];
  if (!Array.isArray(progress.practiceCorrect)) progress.practiceCorrect = [];
  return progress;
}

function isLessonComplete(lesson) {
  const progress = lessonProgress(lesson);
  return !!progress.exampleSeen && !!progress.guidedComplete && lesson.practice.every(q => progress.practiceCorrect.includes(q.id));
}

function renderLessonList() {
  document.getElementById('learning-progress').textContent = `${LESSONS.filter(isLessonComplete).length} / 3 ders tamamlandı`;
  document.getElementById('lesson-list').innerHTML = LESSONS.map((lesson, index) => {
    const progress = lessonProgress(lesson);
    const solved = lesson.practice.filter(q => progress.practiceCorrect.includes(q.id)).length;
    const status = isLessonComplete(lesson) ? 'Tamamlandı · Tekrar çalışabilirsin' : `${solved} / ${lesson.practice.length} pratik sorusu`;
    return `<button class="lesson-link" data-lesson="${index}" ${lessonSession.index === index ? 'aria-current="step"' : ''}>
      <span class="lesson-number">0${index + 1}</span><strong>${lesson.title}</strong><small>${status}</small></button>`;
  }).join('');
}

function selectLesson(index) {
  const lesson = LESSONS[index];
  const progress = lessonProgress(lesson);
  let stage = 'example';
  if (progress.exampleSeen && !isLessonComplete(lesson)) stage = progress.guidedComplete ? 'practice' : 'guided';
  const missing = lesson.practice.findIndex(q => !progress.practiceCorrect.includes(q.id));
  lessonSession = {
    index, stage, guidedIndex: Math.min(progress.guidedStep || 0, lesson.guided.length - 1),
    practiceIndex: Math.max(0, missing), answered: false
  };
  renderLesson();
}

function renderLesson(focus = true) {
  const lesson = LESSONS[lessonSession.index];
  const { stage } = lessonSession;
  renderLessonList();
  const workspace = document.getElementById('lesson-workspace');
  workspace.innerHTML = `<p class="eyebrow">DERS 0${lessonSession.index + 1} · SÜRESİZ ÖĞRENME</p>
    <h3 id="lesson-title" tabindex="-1">${lesson.title}</h3>
    <p class="lesson-meta">${lesson.prerequisite}</p>
    <ol class="lesson-steps" aria-label="Ders aşamaları">
      ${[['example', '1 · Öğren'], ['guided', '2 · Birlikte çöz'], ['practice', '3 · Kendin dene']].map(([id, label]) => `<li ${stage === id || (stage === 'complete' && id === 'practice') ? 'aria-current="step"' : ''}>${label}</li>`).join('')}
    </ol><div id="lesson-body"></div>`;
  const body = document.getElementById('lesson-body');
  if (stage === 'example') {
    body.innerHTML = `<p>${lesson.why}</p><p class="lesson-rule"><strong>Ne zaman?</strong> ${lesson.when}</p>
      <div class="lesson-example"><h4>ÇÖZÜMLÜ ÖRNEK</h4><div class="math-line">${lesson.example.question}</div>
      <ol class="worked-steps">${lesson.example.steps.map(step => `<li>${step}</li>`).join('')}</ol></div>
      <p class="lesson-rule">${lesson.example.rule}</p>
      <div class="lesson-actions"><button class="cyber-btn primary" data-lesson-action="guided">Birlikte çözelim →</button></div>`;
  } else if (stage === 'complete') {
    body.innerHTML = `<div class="lesson-example"><h4>BU DERSİ TAMAMLADIN</h4><p>Örneği inceledin, ara adımları ve ${lesson.practice.length} pratik sorusunu tamamladın.</p></div>
      <p>Bu yöntem bir seçenektir. Hangi sayılarda işini kolaylaştırdığını fark etmeye çalış. Tekrar çalışmak ilerlemeni silmez.</p>
      <div class="lesson-actions"><button class="cyber-btn" data-lesson-action="example">Dersi tekrar et</button>
      ${lessonSession.index < LESSONS.length - 1 ? '<button class="cyber-btn primary" data-lesson-action="next-lesson">Sonraki ders →</button>' : '<button class="cyber-btn primary" data-lesson-action="practice-area">Pratik alanına dön →</button>'}</div>`;
  } else {
    const guided = stage === 'guided';
    const index = guided ? lessonSession.guidedIndex : lessonSession.practiceIndex;
    const items = guided ? lesson.guided : lesson.practice;
    const question = items[index];
    body.innerHTML = `<p class="lesson-meta">${guided ? 'Birlikte çöz · Adım' : 'Kendin dene · Soru'} ${index + 1} / ${items.length}</p>
      <div class="lesson-example"><div class="practice-question">${question.question}</div></div>
      <form class="lesson-form" id="lesson-form" autocomplete="off">
        <label for="lesson-answer">${guided ? question.prompt : 'Sonuç kaç? Yöntemi zihninde adım adım uygula.'}</label>
        <div class="lesson-answer-row"><input id="lesson-answer" type="text" inputmode="numeric" autocomplete="off" aria-describedby="lesson-feedback" required>
        <button id="lesson-check" class="cyber-btn primary" type="submit">Kontrol et ↵</button></div>
      </form>
      <div id="lesson-feedback" class="lesson-feedback" role="status" aria-live="polite"></div>
      <details class="lesson-hint"><summary>Bir ipucu al</summary><p>${question.hint}</p></details>
      <details class="lesson-hint"><summary>Çözüm yolunu incele</summary><p>${question.solution}</p><p>Adımları inceleyip yanıtını yeniden deneyebilirsin.</p></details>
      <div class="lesson-actions"><button class="cyber-btn" data-lesson-action="example">Örneğe dön</button><button id="lesson-next" class="cyber-btn primary hidden" data-lesson-action="next">Devam et →</button></div>`;
    document.getElementById('lesson-form').addEventListener('submit', checkLessonAnswer);
  }
  if (focus) document.getElementById('lesson-title').focus({ preventScroll: true });
}

function checkLessonAnswer(event) {
  event.preventDefault();
  if (lessonSession.answered) return;
  const input = document.getElementById('lesson-answer');
  const raw = input.value.trim();
  const lesson = LESSONS[lessonSession.index];
  const guided = lessonSession.stage === 'guided';
  const question = guided ? lesson.guided[lessonSession.guidedIndex] : lesson.practice[lessonSession.practiceIndex];
  const feedback = document.getElementById('lesson-feedback');
  if (!/^\d+$/.test(raw)) {
    feedback.classList.add('error');
    feedback.textContent = 'Yanıtını bir tam sayı olarak yaz. Örneğin: 12.';
    input.setAttribute('aria-invalid', 'true');
    return;
  }
  const progress = lessonProgress(lesson);
  progress.attempts = (Number.isFinite(progress.attempts) ? progress.attempts : 0) + 1;
  if (Number(raw) !== question.answer) {
    feedback.classList.add('error');
    feedback.textContent = `Henüz olmadı. ${question.hint} Yeniden dene veya çözüm yolunu aç.`;
    input.setAttribute('aria-invalid', 'true');
    input.select();
  } else {
    lessonSession.answered = true;
    feedback.classList.remove('error');
    feedback.textContent = `Doğru. ${guided ? question.feedback : question.solution}`;
    input.removeAttribute('aria-invalid');
    input.readOnly = true;
    document.getElementById('lesson-check').disabled = true;
    const next = document.getElementById('lesson-next');
    next.classList.remove('hidden');
    next.focus({ preventScroll: true });
    if (guided) {
      progress.guidedStep = Math.max(progress.guidedStep || 0, lessonSession.guidedIndex + 1);
      if (lessonSession.guidedIndex === lesson.guided.length - 1) progress.guidedComplete = true;
    } else if (!progress.practiceCorrect.includes(question.id)) {
      progress.practiceCorrect.push(question.id);
    }
    renderLessonList();
  }
  saveData();
}

function handleLessonAction(action) {
  const lesson = LESSONS[lessonSession.index];
  const progress = lessonProgress(lesson);
  if (action === 'guided') {
    progress.exampleSeen = true;
    lessonSession.stage = 'guided';
    lessonSession.guidedIndex = 0;
    saveData();
  } else if (action === 'example') {
    lessonSession.stage = 'example';
  } else if (action === 'next' && lessonSession.answered) {
    if (lessonSession.stage === 'guided') {
      lessonSession.guidedIndex++;
      if (lessonSession.guidedIndex === lesson.guided.length) {
        lessonSession.stage = 'practice';
        const missing = lesson.practice.findIndex(q => !progress.practiceCorrect.includes(q.id));
        lessonSession.practiceIndex = Math.max(0, missing);
      }
    } else {
      lessonSession.practiceIndex++;
      if (lessonSession.practiceIndex === lesson.practice.length) lessonSession.stage = 'complete';
    }
  } else if (action === 'next-lesson') {
    selectLesson(lessonSession.index + 1);
    return;
  } else if (action === 'practice-area') {
    showArea('practice');
    return;
  }
  lessonSession.answered = false;
  renderLesson();
}

function initLearning() {
  document.getElementById('lesson-list').addEventListener('click', event => {
    const button = event.target.closest('[data-lesson]');
    if (button) selectLesson(Number(button.dataset.lesson));
  });
  document.getElementById('lesson-workspace').addEventListener('click', event => {
    const button = event.target.closest('[data-lesson-action]');
    if (button) handleLessonAction(button.dataset.lessonAction);
  });
  renderLesson(false);
}
