/**
 * PUSULA AKADEMİ — İNTERAKTİF EĞİTİM SEKMELERİ MOTORU
 * 7 İşlevsel Sekme: Müfredat, MS Office Pratik & AI, Kod & Prompt Lab, Bilgi Kartları, Sınav, AI/Algoritma Simülatörü, Yol Haritası
 */
(function () {
  'use strict';

  const TECH_DATA = window.PUSULA_ACADEMY_DATA;
  const OFFICE_DATA = window.PUSULA_OFFICE_DATA || { TRACKS: [], LESSONS: [], EXCEL_CHALLENGES: [], FLASHCARDS: [], QUIZ_BANK: [], COPILOT_SCENARIOS: [] };
  if (!TECH_DATA) return;

  const DATA = {
    TRACKS: [...TECH_DATA.TRACKS.map(t => ({ ...t, group: t.group || 'tech' })), ...OFFICE_DATA.TRACKS],
    LESSONS: [...TECH_DATA.LESSONS.map(l => ({ ...l, group: l.group || 'tech' })), ...OFFICE_DATA.LESSONS],
    CODE_CHALLENGES: TECH_DATA.CODE_CHALLENGES,
    EXCEL_CHALLENGES: OFFICE_DATA.EXCEL_CHALLENGES || [],
    COPILOT_SCENARIOS: OFFICE_DATA.COPILOT_SCENARIOS || [],
    HTML_PRESETS: TECH_DATA.HTML_PRESETS,
    FLASHCARDS: [...TECH_DATA.FLASHCARDS, ...OFFICE_DATA.FLASHCARDS],
    QUIZ_BANK: [...TECH_DATA.QUIZ_BANK, ...OFFICE_DATA.QUIZ_BANK],
    ALGO_SPECS: TECH_DATA.ALGO_SPECS
  };

  function getStorageKey() {
    if (typeof window.pusulaGetUserKey === 'function') {
      return window.pusulaGetUserKey('pusula_academy_v2');
    }
    return 'pusula_academy_v2';
  }

  function isProActive() {
    if (typeof window.pusulaIsPro === 'function') return window.pusulaIsPro();
    try { return localStorage.getItem('pusula_pro') === '1'; } catch (e) { return false; }
  }

  function openProShowcase() {
    if (typeof window.pusulaOpenProModal === 'function') {
      window.pusulaOpenProModal();
    } else {
      const m = document.getElementById('pro-modal');
      if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
    }
  }

  const defaultAcademyState = () => ({
    activeTab: 'lessons',
    xp: 0,
    completedLessons: [],
    lessonNotes: {},
    solvedChallenges: [],
    solvedExcel: [],
    masteredCards: [],
    customCards: [],
    quizStats: {
      totalAnswered: 0,
      totalCorrect: 0,
      wrongIds: [],
      byCat: {}
    },
    weeklyGoalXP: 300,
    streakDays: 1,
    lastStudyDate: new Date().toISOString().slice(0, 10)
  });

  function loadAcademyState() {
    const base = defaultAcademyState();
    try {
      const raw = localStorage.getItem(getStorageKey());
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      return {
        ...base,
        ...parsed,
        lessonNotes: parsed.lessonNotes || {},
        solvedExcel: Array.isArray(parsed.solvedExcel) ? parsed.solvedExcel : [],
        customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
        quizStats: {
          ...base.quizStats,
          ...(parsed.quizStats || {}),
          byCat: (parsed.quizStats && parsed.quizStats.byCat) || {},
          wrongIds: Array.isArray(parsed.quizStats && parsed.quizStats.wrongIds) ? parsed.quizStats.wrongIds : []
        }
      };
    } catch (e) {
      return base;
    }
  }

  let acState = loadAcademyState();

  function saveAcademyState() {
    const today = new Date().toISOString().slice(0, 10);
    if (acState.lastStudyDate !== today) {
      const prev = new Date(acState.lastStudyDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr - prev) / 86400000);
      acState.streakDays = diffDays === 1 ? acState.streakDays + 1 : 1;
      acState.lastStudyDate = today;
    }
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(acState));
    } catch (e) {}
    renderAcademyHud();
    renderOverviewAcademyWidget();
    if (typeof window.pusulaScheduleCloudSync === 'function') {
      window.pusulaScheduleCloudSync();
    }
  }

  function toast(msg) {
    if (typeof window.pusulaToast === 'function') window.pusulaToast(msg);
  }

  function esc(str) {
    return String(str ?? '').replace(/[&<>"']/g, s => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
  }

  function getLevelInfo(xp) {
    const levels = [
      { min: 0, lvl: 1, title: 'Teknoloji Kaşifi' },
      { min: 150, lvl: 2, title: 'Kod Çırağı' },
      { min: 350, lvl: 3, title: 'Algoritma Ustası' },
      { min: 650, lvl: 4, title: 'Full-Stack Mimar' },
      { min: 1000, lvl: 5, title: 'Yapay Zeka Mühendisi' }
    ];
    let current = levels[0];
    let next = levels[1];
    for (let i = 0; i < levels.length; i++) {
      if (xp >= levels[i].min) {
        current = levels[i];
        next = levels[i + 1] || null;
      }
    }
    const pct = next ? Math.min(100, Math.round(((xp - current.min) / (next.min - current.min)) * 100)) : 100;
    return { ...current, nextMin: next ? next.min : current.min, pct };
  }

  function awardXP(amount, reason) {
    acState.xp += amount;
    saveAcademyState();
    if (reason) toast(`+${amount} XP · ${reason}`);
  }

  // =========================================================
  // HUD & TAB SWITCHING
  // =========================================================
  function renderAcademyHud() {
    const lvl = getLevelInfo(acState.xp);
    const totalLessons = DATA.LESSONS.length;
    const doneLessons = acState.completedLessons.length;
    const totalCards = DATA.FLASHCARDS.length + acState.customCards.length;
    const doneCards = acState.masteredCards.length;
    const acc = acState.quizStats.totalAnswered
      ? Math.round((acState.quizStats.totalCorrect / acState.quizStats.totalAnswered) * 100)
      : 0;

    const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setTxt('ac-hud-level', `Seviye ${lvl.lvl} · ${lvl.title}`);
    setTxt('ac-hud-xp', `${acState.xp} XP`);
    setTxt('ac-hud-lessons', `${doneLessons} / ${totalLessons}`);
    setTxt('ac-hud-cards', `${doneCards} / ${totalCards}`);
    setTxt('ac-hud-quiz', acState.quizStats.totalAnswered ? `%${acc}` : '--');
    setTxt('ac-hud-streak', `${acState.streakDays} Gün`);

    const xpBar = document.getElementById('ac-hud-xp-bar');
    if (xpBar) xpBar.style.width = lvl.pct + '%';
  }

  function renderOverviewAcademyWidget() {
    const totalLessons = DATA.LESSONS.length;
    const done = acState.completedLessons.length;
    const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
    const lvl = getLevelInfo(acState.xp);
    const nextLesson = DATA.LESSONS.find(l => !acState.completedLessons.includes(l.id)) || DATA.LESSONS[0];

    const xpEl = document.getElementById('ov-ac-xp');
    const progEl = document.getElementById('ov-ac-progress');
    const barEl = document.getElementById('ov-ac-bar');
    const nextEl = document.getElementById('ov-ac-next-title');
    const lvlEl = document.getElementById('ov-ac-level');
    if (xpEl) xpEl.textContent = `${acState.xp} XP`;
    if (progEl) progEl.textContent = `${done} / ${totalLessons} Ders (%${pct})`;
    if (barEl) barEl.style.width = pct + '%';
    if (nextEl && nextLesson) nextEl.textContent = nextLesson.title;
    if (lvlEl) lvlEl.textContent = `Seviye ${lvl.lvl} · ${lvl.title}`;
  }

  function switchEduTab(tabId) {
    const valid = ['lessons', 'officelab', 'codelab', 'flashcards', 'quiz', 'visualizer', 'roadmap'];
    if (!valid.includes(tabId)) return;
    acState.activeTab = tabId;

    document.querySelectorAll('.edu-tab-btn').forEach(btn => {
      const isAct = btn.dataset.eduTab === tabId;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
    });
    document.querySelectorAll('.edu-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'edu-panel-' + tabId);
    });
    document.querySelectorAll('[data-jump-edu]').forEach(el => {
      el.classList.toggle('active', el.dataset.jumpEdu === tabId);
    });

    if (tabId === 'roadmap') renderRoadmapView();
    if (tabId === 'codelab' && codelabMode === 'html') updateHtmlPreview();
    saveAcademyState();
  }

  document.querySelectorAll('.edu-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchEduTab(btn.dataset.eduTab));
  });

  // =========================================================
  // TAB 1: LESSONS & CURRICULUM (AI/TECH + MICROSOFT OFFICE)
  // =========================================================
  let activeGroupFilter = 'all';
  let activeTrackFilter = 'all';
  let activeLevelFilter = 'all';
  let lessonSearchQuery = '';
  let activeLessonId = DATA.LESSONS[0].id;
  let checkpointAnswered = {};

  function trackColorBadge(color) {
    if (color === 'indigo') return 'bg-plumLight text-plum';
    if (color === 'forest') return 'bg-forestLight text-forest';
    if (color === 'ocean') return 'bg-oceanLight text-ocean';
    return 'bg-amberLight text-amberwarm';
  }

  function renderLessonsPanel() {
    const visibleTracks = DATA.TRACKS.filter(tr => activeGroupFilter === 'all' || tr.group === activeGroupFilter);
    const tracksBox = document.getElementById('ac-tracks-grid');
    if (tracksBox) {
      tracksBox.innerHTML = visibleTracks.map(tr => {
        const trLessons = DATA.LESSONS.filter(l => l.track === tr.id);
        const doneCount = trLessons.filter(l => acState.completedLessons.includes(l.id)).length;
        const pct = Math.round((doneCount / trLessons.length) * 100);
        const isSel = activeTrackFilter === tr.id;
        return `
          <button type="button" data-filter-track="${tr.id}" class="text-left editorial-card p-4 transition ${isSel ? 'ring-2 ring-forest border-forest' : ''}">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2.5 py-1 rounded-lg text-[11px] font-semibold ${trackColorBadge(tr.color)}">${esc(tr.hours)}</span>
              <span class="text-xs font-semibold tabular text-forest">${doneCount}/${trLessons.length}</span>
            </div>
            <h4 class="font-editorial text-sm text-ink leading-snug">${esc(tr.title)}</h4>
            <p class="text-[11px] text-muted mt-1 line-clamp-2">${esc(tr.subtitle)}</p>
            <div class="mt-3 h-1.5 rounded-full bg-stonewarm overflow-hidden">
              <div class="h-full bg-forest rounded-full transition-all duration-300" style="width:${pct}%"></div>
            </div>
          </button>
        `;
      }).join('');
    }

    const q = lessonSearchQuery.trim().toLowerCase();
    const list = DATA.LESSONS.filter(l => {
      const mGroup = activeGroupFilter === 'all' || l.group === activeGroupFilter;
      const mTrack = activeTrackFilter === 'all' || l.track === activeTrackFilter;
      const mLevel = activeLevelFilter === 'all' || l.level === activeLevelFilter;
      const mQ = !q || l.title.toLowerCase().includes(q) || l.summary.toLowerCase().includes(q);
      return mGroup && mTrack && mLevel && mQ;
    });

    const listBox = document.getElementById('ac-lessons-list');
    if (listBox) {
      if (!list.length) {
        listBox.innerHTML = '<p class="text-xs text-muted p-6 text-center">Aramanızla eşleşen ders bulunamadı.</p>';
      } else {
        listBox.innerHTML = list.map(l => {
          const isDone = acState.completedLessons.includes(l.id);
          const isAct = l.id === activeLessonId;
          const locked = !!l.isPro && !isProActive();
          const tr = DATA.TRACKS.find(t => t.id === l.track);
          return `
            <button type="button" data-open-lesson="${l.id}" class="w-full text-left p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
              isAct ? 'border-forest bg-forestLight/70' : 'border-hairline bg-surface hover:border-forest/40'
            }">
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span class="px-2 py-0.5 rounded font-semibold ${trackColorBadge(tr ? tr.color : 'forest')}">${esc(tr ? tr.title.split('&')[0].trim() : l.track)}</span>
                  <span class="text-muted">${esc(l.level)} · ${esc(l.duration)}</span>
                  <span class="text-forest font-semibold">+${l.xp} XP</span>
                  ${l.isPro ? `<span class="pro-badge-pill">${locked ? '🔒 PRO' : 'PRO ✓'}</span>` : ''}
                </div>
                <p class="text-xs font-semibold text-ink leading-snug">${esc(l.title)}</p>
              </div>
              <span class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? 'bg-forest text-paper' : 'bg-paper border border-hairline text-muted'}">
                <i data-lucide="${isDone ? 'check' : (locked ? 'lock' : 'book-open')}" class="w-3.5 h-3.5"></i>
              </span>
            </button>
          `;
        }).join('');
      }
    }

    renderLessonReader();
    if (window.lucide) window.lucide.createIcons();
  }

  function renderLessonReader() {
    const lesson = DATA.LESSONS.find(l => l.id === activeLessonId) || DATA.LESSONS[0];
    const reader = document.getElementById('ac-lesson-reader');
    if (!reader || !lesson) return;

    const isDone = acState.completedLessons.includes(lesson.id);
    const locked = !!lesson.isPro && !isProActive();
    const tr = DATA.TRACKS.find(t => t.id === lesson.track);
    const noteVal = acState.lessonNotes[lesson.id] || '';
    const idx = DATA.LESSONS.findIndex(l => l.id === lesson.id);
    const prevL = idx > 0 ? DATA.LESSONS[idx - 1] : null;
    const nextL = idx < DATA.LESSONS.length - 1 ? DATA.LESSONS[idx + 1] : null;
    const cpDone = checkpointAnswered[lesson.id];

    const sectionCodeHtml = (sec) => sec.code ? `<pre class="code-block-pre p-3.5 text-xs"><code>${esc(sec.code)}</code></pre>` : '';
    const topCodeBlock = lesson.code ? `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-semibold text-ink">${esc(lesson.codeTitle || 'Örnek Kod & Uygulama')}</span>
          <div class="flex items-center gap-2">
            <button type="button" id="ac-copy-lesson-code" class="px-2.5 py-1 rounded-lg border border-hairline bg-surface hover:border-forest text-[11px] font-medium text-ink transition">Kodu Kopyala</button>
            ${lesson.runnableInLab ? `<button type="button" id="ac-send-to-lab" class="px-3 py-1 rounded-lg bg-plum text-paper text-[11px] font-medium hover:bg-plum/90 transition flex items-center gap-1"><i data-lucide="play" class="w-3 h-3"></i> Kod Lab’da Dene →</button>` : ''}
          </div>
        </div>
        <pre class="code-block-pre p-4"><code>${esc(lesson.code)}</code></pre>
      </div>` : '';

    reader.innerHTML = `
      <div class="space-y-5">
        <div class="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-hairline">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="px-2.5 py-0.5 rounded-full font-semibold ${trackColorBadge(tr ? tr.color : 'forest')}">${esc(tr ? tr.title : '')}</span>
              <span class="text-muted">${esc(lesson.level)} · ${esc(lesson.duration)}</span>
              <span class="text-forest font-semibold">+${lesson.xp} XP</span>
              ${lesson.isPro ? `<span class="pro-badge-pill">${locked ? '🔒 PRO UZMAN' : 'PRO AÇIK ✓'}</span>` : ''}
            </div>
            <h3 class="font-editorial text-2xl text-ink">${esc(lesson.title)}</h3>
            <p class="text-xs text-muted leading-relaxed">${esc(lesson.summary)}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            ${lesson.group === 'office' ? `<button type="button" id="ac-open-officelab-btn" class="px-3 py-2 rounded-xl border border-forest/40 bg-forestLight text-forest text-xs font-semibold hover:opacity-90">Office Pratik Lab →</button>` : ''}
            ${lesson.aiPrompt ? `<button type="button" id="ac-ask-lesson-ai" class="px-3 py-2 rounded-xl border border-plum/40 bg-plumLight text-plum text-xs font-semibold hover:opacity-90">AI Koçuna Sor ✨</button>` : ''}
            <button type="button" id="ac-toggle-complete-btn" data-lesson-id="${lesson.id}" class="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
              isDone ? 'bg-forestLight text-forest border border-forest/40' : 'bg-forest hover:bg-forest/90 text-paper'
            }">
              <i data-lucide="${isDone ? 'check-circle-2' : (locked ? 'lock' : 'award')}" class="w-4 h-4"></i>
              ${locked ? 'Pro ile Aç' : (isDone ? 'Tamamlandı ✓' : `Dersi Tamamla (+${lesson.xp} XP)`)}
            </button>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-paper border border-hairline space-y-2">
          <p class="text-[11px] uppercase tracking-wider font-semibold text-forest">Kazanım Hedefleri</p>
          <ul class="space-y-1.5 text-xs text-ink/90">
            ${lesson.objectives.map(o => `<li class="flex items-start gap-2"><span class="text-forest font-bold">•</span><span>${esc(o)}</span></li>`).join('')}
          </ul>
        </div>

        ${locked ? `
          <div class="p-6 rounded-2xl border-2 border-plum/40 bg-plumLight/40 text-center space-y-3">
            <span class="pro-badge-pill">PUSULA PRO UZMAN SEVİYE MODÜLÜ</span>
            <h4 class="font-editorial text-xl text-ink">Bu Uzman Modülü ve VBA / AI Copilot Pratikleri Pusula Pro Üyelerine Özeldir</h4>
            <p class="text-xs text-muted max-w-lg mx-auto leading-relaxed">Başlangıç, Orta ve İleri tüm dersler ücretsizdir. VBA makro otomasyonu, Python in Excel ve AI Copilot masterclass içeriklerini açmak için Pro tanıtımını izleyip etkinleştirebilirsiniz.</p>
            <button type="button" id="ac-unlock-pro-lesson-btn" class="px-5 py-2.5 rounded-xl bg-forest text-paper text-xs font-semibold hover:bg-forest/90 transition">▶ Pro Tanıtım Filmini İzle &amp; Kilidi Aç</button>
          </div>
        ` : `
          <div class="space-y-4">
            ${lesson.sections.map(sec => `
              <div class="space-y-2">
                <h4 class="font-editorial text-base text-ink">${esc(sec.heading)}</h4>
                <p class="text-xs sm:text-sm text-ink/85 leading-relaxed">${esc(sec.body)}</p>
                ${sectionCodeHtml(sec)}
                ${sec.tip ? `<div class="p-3 rounded-xl bg-amberLight/70 border border-amberwarm/25 text-xs text-ink flex items-start gap-2"><span class="font-semibold text-amberwarm shrink-0">İpucu:</span><span>${esc(sec.tip)}</span></div>` : ''}
              </div>
            `).join('')}
          </div>

          ${topCodeBlock}

          ${lesson.checkpoint ? `
            <div class="p-4 rounded-xl bg-plumLight/60 border border-plum/25 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[11px] uppercase tracking-wider font-semibold text-plum">Konu Kontrolü (Mini Quiz)</span>
                <span class="text-[11px] font-semibold text-plum">+15 Bonus XP</span>
              </div>
              <p class="text-xs sm:text-sm font-medium text-ink">${esc(lesson.checkpoint.q)}</p>
              <div class="space-y-2">
                ${lesson.checkpoint.opts.map((opt, i) => {
                  let cls = 'border-hairline bg-surface hover:border-plum text-ink';
                  if (cpDone !== undefined) {
                    if (i === lesson.checkpoint.ans) cls = 'border-forest bg-forestLight text-forest font-semibold';
                    else if (i === cpDone) cls = 'border-terracotta bg-terracottaLight text-terracotta';
                  }
                  return `<button type="button" data-cp-opt="${i}" class="w-full text-left px-3 py-2 rounded-lg border text-xs transition ${cls}">${esc(opt)}</button>`;
                }).join('')}
              </div>
              ${cpDone !== undefined ? `<p class="text-xs font-medium ${cpDone === lesson.checkpoint.ans ? 'text-forest' : 'text-terracotta'}">${cpDone === lesson.checkpoint.ans ? 'Doğru! ' : 'Tekrar inceleyin: '}${esc(lesson.checkpoint.exp)}</p>` : ''}
            </div>
          ` : ''}
        `}

        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <label for="ac-lesson-note-input" class="font-semibold text-ink">Kişisel Ders Notum</label>
            <span id="ac-note-status" class="text-[11px] text-muted">Otomatik tarayıcıya kaydedilir</span>
          </div>
          <textarea id="ac-lesson-note-input" rows="3" placeholder="Bu dersten çıkardığınız önemli notları veya soruları yazın..." class="w-full bg-paper border border-hairline rounded-xl p-3 text-xs text-ink focus:outline-none focus:border-forest resize-y">${esc(noteVal)}</textarea>
        </div>

        <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2 text-xs">
          ${prevL ? `<button type="button" data-open-lesson="${prevL.id}" class="px-3 py-2 rounded-lg border border-hairline bg-surface hover:border-ink text-ink font-medium">← Önceki Ders</button>` : '<span></span>'}
          ${nextL ? `<button type="button" data-open-lesson="${nextL.id}" class="px-3.5 py-2 rounded-lg bg-ink hover:bg-ink/90 text-paper font-medium">Sonraki Ders →</button>` : ''}
        </div>
      </div>
    `;
  }

  document.addEventListener('click', (e) => {
    const trBtn = e.target.closest('[data-filter-track]');
    if (trBtn) {
      const id = trBtn.dataset.filterTrack;
      activeTrackFilter = activeTrackFilter === id ? 'all' : id;
      const sel = document.getElementById('ac-track-filter-select');
      if (sel) sel.value = activeTrackFilter;
      renderLessonsPanel();
      return;
    }

    const openL = e.target.closest('[data-open-lesson]');
    if (openL) {
      activeLessonId = openL.dataset.openLesson;
      renderLessonsPanel();
      if (window.innerWidth < 1024) {
        const reader = document.getElementById('ac-lesson-reader');
        if (reader) reader.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (e.target.closest('#ac-toggle-complete-btn')) {
      const lesson = DATA.LESSONS.find(l => l.id === activeLessonId);
      if (!lesson) return;
      if (lesson.isPro && !isProActive()) {
        openProShowcase();
        if (window.PusulaPromoVideo) window.PusulaPromoVideo.play();
        toast('Bu uzman dersini tamamlamak için Pusula Pro önizlemeyi veya üyeliği açın.');
        return;
      }
      const idx = acState.completedLessons.indexOf(lesson.id);
      if (idx === -1) {
        acState.completedLessons.push(lesson.id);
        awardXP(lesson.xp, `${lesson.title} tamamlandı!`);
      } else {
        acState.completedLessons.splice(idx, 1);
        acState.xp = Math.max(0, acState.xp - lesson.xp);
        saveAcademyState();
        toast('Ders tamamlanma işareti kaldırıldı.');
      }
      renderLessonsPanel();
      return;
    }

    if (e.target.closest('#ac-unlock-pro-lesson-btn')) {
      if (window.PusulaPromoVideo) window.PusulaPromoVideo.openAndPlay();
      else openProShowcase();
      return;
    }

    if (e.target.closest('#ac-open-officelab-btn')) {
      switchEduTab('officelab');
      return;
    }

    if (e.target.closest('#ac-ask-lesson-ai')) {
      const lesson = DATA.LESSONS.find(l => l.id === activeLessonId);
      if (lesson && lesson.aiPrompt && typeof window.pusulaAskAssistant === 'function') {
        window.pusulaAskAssistant(lesson.aiPrompt, true);
      }
      return;
    }

    const grpBtn = e.target.closest('[data-ac-group]');
    if (grpBtn) {
      activeGroupFilter = grpBtn.dataset.acGroup;
      activeTrackFilter = 'all';
      const sel = document.getElementById('ac-track-filter-select');
      if (sel) sel.value = 'all';
      document.querySelectorAll('.ac-group-btn').forEach(b => {
        const act = b === grpBtn;
        b.className = 'ac-group-btn px-3.5 py-1.5 rounded-full text-xs font-semibold ' +
          (act ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      renderLessonsPanel();
      return;
    }

    if (e.target.closest('#ac-copy-lesson-code')) {
      const lesson = DATA.LESSONS.find(l => l.id === activeLessonId);
      if (lesson && navigator.clipboard) {
        navigator.clipboard.writeText(lesson.code).then(() => toast('Kod panoya kopyalandı!'));
      }
      return;
    }

    if (e.target.closest('#ac-send-to-lab')) {
      const lesson = DATA.LESSONS.find(l => l.id === activeLessonId);
      if (lesson && lesson.runnableInLab) {
        switchEduTab('codelab');
        setCodelabMode(lesson.runnableInLab.mode);
        if (lesson.runnableInLab.mode === 'js') {
          document.getElementById('cl-js-editor').value = lesson.runnableInLab.starter;
          runJsSandbox();
        } else if (lesson.runnableInLab.mode === 'html') {
          document.getElementById('cl-html-editor').value = lesson.runnableInLab.starter;
          updateHtmlPreview();
        } else if (lesson.runnableInLab.mode === 'prompt') {
          document.getElementById('cl-prompt-freeform').value = lesson.runnableInLab.starter;
          analyzePromptQuality();
        }
        toast('Ders kodu laboratuvara yüklendi!');
      }
      return;
    }

    const cpBtn = e.target.closest('[data-cp-opt]');
    if (cpBtn) {
      const lesson = DATA.LESSONS.find(l => l.id === activeLessonId);
      if (!lesson || !lesson.checkpoint) return;
      const prev = checkpointAnswered[lesson.id];
      const chosen = Number(cpBtn.dataset.cpOpt);
      checkpointAnswered[lesson.id] = chosen;
      if (prev === undefined && chosen === lesson.checkpoint.ans) {
        awardXP(15, 'Konu kontrolü doğru!');
      }
      renderLessonReader();
      lucide.createIcons();
    }
  });

  document.addEventListener('input', (e) => {
    if (e.target.id === 'ac-lesson-note-input') {
      acState.lessonNotes[activeLessonId] = e.target.value;
      saveAcademyState();
      const st = document.getElementById('ac-note-status');
      if (st) st.textContent = 'Not kaydedildi ✓';
    }
    if (e.target.id === 'ac-lesson-search') {
      lessonSearchQuery = e.target.value;
      renderLessonsPanel();
    }
  });

  const trackSelEl = document.getElementById('ac-track-filter-select');
  if (trackSelEl) {
    trackSelEl.addEventListener('change', (e) => {
      activeTrackFilter = e.target.value;
      renderLessonsPanel();
    });
  }

  const levelSelEl = document.getElementById('ac-level-filter-select');
  if (levelSelEl) {
    levelSelEl.addEventListener('change', (e) => {
      activeLevelFilter = e.target.value;
      renderLessonsPanel();
    });
  }

  // =========================================================
  // TAB 2: CODE LAB (JS SANDBOX + HTML STUDIO + PROMPT LAB)
  // =========================================================
  let codelabMode = 'js';
  let activeChallengeId = DATA.CODE_CHALLENGES[0].id;

  function setCodelabMode(mode) {
    codelabMode = mode;
    document.querySelectorAll('.cl-mode-btn').forEach(b => {
      const act = b.dataset.clMode === mode;
      b.className = 'cl-mode-btn px-3.5 py-2 rounded-xl text-xs font-semibold transition ' +
        (act ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
    });
    ['js', 'html', 'prompt'].forEach(m => {
      const box = document.getElementById('cl-box-' + m);
      if (box) box.classList.toggle('hidden', m !== mode);
    });
    if (mode === 'html') updateHtmlPreview();
    if (mode === 'prompt') analyzePromptQuality();
  }

  function renderChallengeSelect() {
    const sel = document.getElementById('cl-challenge-select');
    if (!sel) return;
    sel.innerHTML = DATA.CODE_CHALLENGES.map(ch => {
      const solved = acState.solvedChallenges.includes(ch.id);
      return `<option value="${ch.id}">${solved ? '✓ ' : ''}${esc(ch.title)} (${ch.difficulty} · +${ch.xp} XP)</option>`;
    }).join('');
    sel.value = activeChallengeId;
    loadChallengeInfo();
  }

  function loadChallengeInfo(loadStarter = false) {
    const ch = DATA.CODE_CHALLENGES.find(c => c.id === activeChallengeId) || DATA.CODE_CHALLENGES[0];
    const solved = acState.solvedChallenges.includes(ch.id);
    const descEl = document.getElementById('cl-challenge-desc');
    const badgeEl = document.getElementById('cl-challenge-badge');
    const ed = document.getElementById('cl-js-editor');
    if (descEl) descEl.textContent = ch.desc;
    if (badgeEl) {
      badgeEl.textContent = solved ? `Çözüldü ✓ (+${ch.xp} XP)` : `${ch.category} · ${ch.difficulty} · +${ch.xp} XP`;
      badgeEl.className = 'text-[11px] px-2.5 py-1 rounded-full font-semibold ' + (solved ? 'bg-forestLight text-forest' : 'bg-plumLight text-plum');
    }
    if (ed && (loadStarter || !ed.value.trim())) {
      ed.value = ch.starter;
    }
  }

  function formatConsoleArg(arg) {
    if (typeof arg === 'string') return arg;
    try { return JSON.stringify(arg); } catch (e) { return String(arg); }
  }

  function runJsSandbox() {
    const code = document.getElementById('cl-js-editor').value;
    const outEl = document.getElementById('cl-js-output');
    const timeEl = document.getElementById('cl-js-time');
    const logs = [];
    const customConsole = {
      log: (...args) => logs.push({ type: 'log', text: args.map(formatConsoleArg).join(' ') }),
      warn: (...args) => logs.push({ type: 'warn', text: '⚠ ' + args.map(formatConsoleArg).join(' ') }),
      error: (...args) => logs.push({ type: 'err', text: '✖ ' + args.map(formatConsoleArg).join(' ') }),
      info: (...args) => logs.push({ type: 'log', text: args.map(formatConsoleArg).join(' ') })
    };
    const t0 = performance.now();
    try {
      const runner = new Function('console', '"use strict";\n' + code);
      const ret = runner(customConsole);
      const dt = (performance.now() - t0).toFixed(2);
      if (timeEl) timeEl.textContent = `${dt} ms · Başarılı`;
      if (ret !== undefined) logs.push({ type: 'ret', text: '→ Dönüş: ' + formatConsoleArg(ret) });
      if (!logs.length) logs.push({ type: 'muted', text: '(Çıktı üretilmedi — sonuç görmek için console.log() kullanın)' });
      outEl.innerHTML = logs.map(l => {
        const c = l.type === 'err' ? 'text-rose-400' : l.type === 'warn' ? 'text-amber-300' : l.type === 'ret' ? 'text-teal-300' : l.type === 'muted' ? 'text-slate-400' : 'text-slate-100';
        return `<div class="${c}">${esc(l.text)}</div>`;
      }).join('');
    } catch (err) {
      const dt = (performance.now() - t0).toFixed(2);
      if (timeEl) timeEl.textContent = `${dt} ms · Hata`;
      outEl.innerHTML = `<div class="text-rose-400 font-semibold">Çalışma Hatası: ${esc(err.name)}: ${esc(err.message)}</div>`;
    }
  }

  function verifyChallengeTests() {
    const ch = DATA.CODE_CHALLENGES.find(c => c.id === activeChallengeId);
    const outEl = document.getElementById('cl-js-output');
    const timeEl = document.getElementById('cl-js-time');
    if (!ch) return;
    const code = document.getElementById('cl-js-editor').value;

    try {
      const factory = new Function('console', `"use strict";\n${code}\n; return typeof solve === 'function' ? solve : null;`);
      const solveFn = factory({ log: () => {}, warn: () => {}, error: () => {}, info: () => {} });
      if (typeof solveFn !== 'function') {
        outEl.innerHTML = '<div class="text-rose-400">Test Hatası: Kodunuzda `function solve(...)` tanımlı olmalıdır.</div>';
        return;
      }

      let passedCount = 0;
      const lines = ch.tests.map(t => {
        let ok = false;
        let actualStr = '';
        try {
          ok = !!t.run(solveFn);
          if (!ok && t.got) actualStr = ` (Gelen: ${formatConsoleArg(t.got(solveFn))})`;
        } catch (err) {
          actualStr = ` (Hata: ${err.message})`;
        }
        if (ok) passedCount++;
        return `<div class="${ok ? 'text-emerald-400' : 'text-rose-400'}">${ok ? '✓' : '✗'} ${esc(t.label)}${esc(actualStr)}</div>`;
      });

      const allPass = passedCount === ch.tests.length;
      if (timeEl) timeEl.textContent = `Testler: ${passedCount}/${ch.tests.length}`;
      if (allPass && !acState.solvedChallenges.includes(ch.id)) {
        acState.solvedChallenges.push(ch.id);
        awardXP(ch.xp, `${ch.title} testleri geçti!`);
        renderChallengeSelect();
      } else if (allPass) {
        toast('Tüm testler başarıyla geçti ✓');
      }
      outEl.innerHTML = lines.join('') + (allPass
        ? '<div class="mt-2 pt-2 border-t border-slate-700 text-teal-300 font-semibold">Tebrikler! Tüm birim testler başarıyla geçti.</div>'
        : '<div class="mt-2 pt-2 border-t border-slate-700 text-amber-300">Bazı testler başarısız. Mantığınızı gözden geçirip tekrar deneyin.</div>');
    } catch (err) {
      outEl.innerHTML = `<div class="text-rose-400">Sözdizimi Hatası: ${esc(err.message)}</div>`;
    }
  }

  // HTML/CSS Live Preview
  function updateHtmlPreview() {
    const ed = document.getElementById('cl-html-editor');
    const frame = document.getElementById('cl-html-preview');
    if (!ed || !frame) return;
    frame.srcdoc = ed.value;
  }

  function initHtmlStudio() {
    const sel = document.getElementById('cl-html-preset');
    const ed = document.getElementById('cl-html-editor');
    if (sel && ed) {
      sel.innerHTML = DATA.HTML_PRESETS.map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join('');
      ed.value = DATA.HTML_PRESETS[0].code;
      sel.addEventListener('change', () => {
        const p = DATA.HTML_PRESETS.find(x => x.id === sel.value);
        if (p) { ed.value = p.code; updateHtmlPreview(); }
      });
      ed.addEventListener('input', updateHtmlPreview);
    }
  }

  // Prompt Lab Analyzer
  function buildStructuredPrompt() {
    const role = document.getElementById('pm-role').value.trim();
    const ctx = document.getElementById('pm-context').value.trim();
    const task = document.getElementById('pm-task').value.trim();
    const guard = document.getElementById('pm-constraints').value.trim();
    const fmt = document.getElementById('pm-format').value;
    const parts = [];
    if (role) parts.push(`ROL: ${role}`);
    if (ctx) parts.push(`BAĞLAM: ${ctx}`);
    if (task) parts.push(`GÖREV: ${task}`);
    if (guard) parts.push(`KISITLAMALAR: ${guard}`);
    if (fmt) parts.push(`ÇIKTI FORMATI: ${fmt}`);
    document.getElementById('cl-prompt-freeform').value = parts.join('\n\n');
    analyzePromptQuality();
  }

  function analyzePromptQuality() {
    const txt = (document.getElementById('cl-prompt-freeform').value || '').trim();
    const lower = txt.toLowerCase();
    const checks = [
      { label: 'Rol veya Uzmanlık Tanımı', ok: /(rol:|sen bir|uzman|mühendis|mimar|asistan)/i.test(lower) },
      { label: 'Yeterli Bağlam & Detay (40+ karakter)', ok: txt.length >= 40 },
      { label: 'Net Görev Fiili', ok: /(oluştur|analiz|listele|yaz|düzelt|açıkla|karşılaştır|çevir|görev:)/i.test(lower) },
      { label: 'Kısıt veya Halüsinasyon Koruması', ok: /(kısıt|varsayım yapma|sadece|yalnızca|bilmiyorsan|en fazla|adım)/i.test(lower) },
      { label: 'Yapılandırılmış Çıktı Formatı', ok: /(json|madde|tablo|kod|format|şema|markdown)/i.test(lower) }
    ];
    const score = checks.reduce((s, c) => s + (c.ok ? 20 : 0), 0);
    const scoreEl = document.getElementById('pm-score-val');
    const barEl = document.getElementById('pm-score-bar');
    const listEl = document.getElementById('pm-checks-list');
    if (scoreEl) scoreEl.textContent = `${score} / 100`;
    if (barEl) {
      barEl.style.width = score + '%';
      barEl.className = 'h-full rounded-full transition-all duration-300 ' + (score >= 80 ? 'bg-forest' : score >= 50 ? 'bg-amberwarm' : 'bg-terracotta');
    }
    if (listEl) {
      listEl.innerHTML = checks.map(c => `
        <div class="flex items-center justify-between text-xs py-1">
          <span class="${c.ok ? 'text-ink' : 'text-muted'}">${esc(c.label)}</span>
          <span class="font-semibold ${c.ok ? 'text-forest' : 'text-terracotta'}">${c.ok ? '✓ Var' : 'Eksik'}</span>
        </div>
      `).join('');
    }
  }

  // Event bindings for Code Lab
  document.querySelectorAll('.cl-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setCodelabMode(btn.dataset.clMode));
  });
  const chSel = document.getElementById('cl-challenge-select');
  if (chSel) {
    chSel.addEventListener('change', () => {
      activeChallengeId = chSel.value;
      loadChallengeInfo(true);
    });
  }
  const jsEd = document.getElementById('cl-js-editor');
  if (jsEd) {
    jsEd.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = jsEd.selectionStart;
        const end = jsEd.selectionEnd;
        jsEd.value = jsEd.value.substring(0, s) + '  ' + jsEd.value.substring(end);
        jsEd.selectionStart = jsEd.selectionEnd = s + 2;
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runJsSandbox();
      }
    });
  }
  const bindClick = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  bindClick('cl-run-js-btn', runJsSandbox);
  bindClick('cl-test-js-btn', verifyChallengeTests);
  bindClick('cl-reset-js-btn', () => loadChallengeInfo(true));
  bindClick('cl-solution-js-btn', () => {
    const ch = DATA.CODE_CHALLENGES.find(c => c.id === activeChallengeId);
    if (ch) { document.getElementById('cl-js-editor').value = ch.solution; toast('Örnek çözüm editöre yüklendi.'); }
  });
  bindClick('cl-download-html-btn', () => {
    const html = document.getElementById('cl-html-editor').value;
    const blob = new Blob([`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"></head><body>${html}</body></html>`], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pusula-tasarim.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 400);
    toast('HTML dosyası indirildi.');
  });
  bindClick('pm-build-btn', buildStructuredPrompt);
  bindClick('pm-copy-btn', () => {
    const val = document.getElementById('cl-prompt-freeform').value;
    if (navigator.clipboard && val) navigator.clipboard.writeText(val).then(() => toast('Prompt kopyalandı!'));
  });
  bindClick('pm-test-ai-btn', () => {
    const val = document.getElementById('cl-prompt-freeform').value.trim();
    if (!val) return;
    if (typeof window.pusulaAskAssistant === 'function') {
      window.pusulaAskAssistant(val, true);
    }
  });
  const pfEl = document.getElementById('cl-prompt-freeform');
  if (pfEl) pfEl.addEventListener('input', analyzePromptQuality);

  // =========================================================
  // TAB 2B: MICROSOFT OFFICE PRACTICE & AI COPILOT STUDIO
  // =========================================================
  let activeExcelId = (DATA.EXCEL_CHALLENGES[0] && DATA.EXCEL_CHALLENGES[0].id) || 'xl-c1';

  function colToIndex(colStr) {
    let idx = 0;
    for (let i = 0; i < colStr.length; i++) idx = idx * 26 + (colStr.charCodeAt(i) - 64);
    return idx - 1;
  }

  function getTableCell(ref, rows) {
    const m = String(ref).replace(/\$/g, '').trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
    if (!m) return undefined;
    const col = colToIndex(m[1]);
    const row = Number(m[2]) - 2; // Header = Row 1, rows[0] = Row 2
    if (row < 0 || row >= rows.length || col < 0 || col >= rows[row].length) return '';
    return rows[row][col];
  }

  function getTableRange(rangeStr, rows) {
    const clean = String(rangeStr).replace(/\$/g, '').trim().toUpperCase();
    if (!clean.includes(':')) {
      const v = getTableCell(clean, rows);
      return v === undefined ? [] : [[v]];
    }
    const [p1, p2] = clean.split(':');
    const m1 = p1.match(/^([A-Z]+)(\d+)$/);
    const m2 = p2.match(/^([A-Z]+)(\d+)$/);
    if (!m1 || !m2) return [];
    const c1 = colToIndex(m1[1]), r1 = Number(m1[2]) - 2;
    const c2 = colToIndex(m2[1]), r2 = Number(m2[2]) - 2;
    const matrix = [];
    for (let r = Math.min(r1, r2); r <= Math.max(r1, r2); r++) {
      const line = [];
      for (let c = Math.min(c1, c2); c <= Math.max(c1, c2); c++) {
        line.push(rows[r] && rows[r][c] !== undefined ? rows[r][c] : '');
      }
      matrix.push(line);
    }
    return matrix;
  }

  function splitExcelArgs(inner) {
    let inQ = false, depth = 0, hasSemi = false;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (ch === '"') inQ = !inQ;
      else if (!inQ) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ';' && depth === 0) hasSemi = true;
      }
    }
    const sep = hasSemi ? ';' : ',';
    const args = [];
    let cur = '';
    inQ = false; depth = 0;
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (ch === '"') inQ = !inQ;
      else if (!inQ) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
      }
      if (ch === sep && !inQ && depth === 0) {
        args.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim() !== '') args.push(cur.trim());
    return args;
  }

  function matchExcelCriteria(val, crit) {
    const cStr = String(crit ?? '').trim();
    const opM = cStr.match(/^(>=|<=|<>|!=|=|>|<)\s*(.+)$/);
    if (opM) {
      const op = opM[1];
      const rhsRaw = opM[2].trim();
      const nVal = Number(val), nRhs = Number(rhsRaw.replace(',', '.'));
      if (!Number.isNaN(nVal) && !Number.isNaN(nRhs)) {
        if (op === '>=') return nVal >= nRhs;
        if (op === '<=') return nVal <= nRhs;
        if (op === '<>' || op === '!=') return nVal !== nRhs;
        if (op === '=') return nVal === nRhs;
        if (op === '>') return nVal > nRhs;
        if (op === '<') return nVal < nRhs;
      }
      const sVal = String(val).toLowerCase(), sRhs = rhsRaw.toLowerCase();
      if (op === '=') return sVal === sRhs;
      if (op === '<>' || op === '!=') return sVal !== sRhs;
      return false;
    }
    if (!Number.isNaN(Number(val)) && !Number.isNaN(Number(cStr.replace(',', '.'))) && cStr !== '') {
      return Number(val) === Number(cStr.replace(',', '.'));
    }
    return String(val).trim().toLowerCase() === cStr.toLowerCase();
  }

  function findTopLevelOp(expr, ops) {
    let inQ = false, depth = 0;
    for (let i = expr.length - 1; i >= 0; i--) {
      const ch = expr[i];
      if (ch === '"') inQ = !inQ;
      else if (!inQ) {
        if (ch === ')') depth++;
        else if (ch === '(') depth--;
        else if (depth === 0) {
          for (const op of ops) {
            if (expr.slice(i - op.length + 1, i + 1) === op && i > 0) {
              return { idx: i - op.length + 1, op };
            }
          }
        }
      }
    }
    return null;
  }

  function evalExcelExpr(raw, rows) {
    let expr = String(raw || '').trim();
    if (expr.startsWith('=')) expr = expr.slice(1).trim();
    if (!expr) throw new Error('Boş formül.');

    // Strip outer wrapping parens if enclosing whole expression
    if (expr.startsWith('(') && expr.endsWith(')')) {
      let d = 0, inQ = false, wraps = true;
      for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '"') inQ = !inQ;
        else if (!inQ) {
          if (expr[i] === '(') d++;
          else if (expr[i] === ')') d--;
          if (d === 0 && i < expr.length - 1) { wraps = false; break; }
        }
      }
      if (wraps) return evalExcelExpr(expr.slice(1, -1), rows);
    }

    // String literal
    if (/^"[^"]*"$/.test(expr)) return expr.slice(1, -1);

    // Numeric literal (accept decimal dot or comma)
    const numLit = expr.replace(',', '.');
    if (/^-?\d+(\.\d+)?$/.test(numLit)) return Number(numLit);

    // Boolean literals
    const up = expr.toUpperCase();
    if (up === 'DOĞRU' || up === 'TRUE') return true;
    if (up === 'YANLIŞ' || up === 'FALSE') return false;

    // Single cell reference
    if (/^\$?[A-Za-z]+\$?\d+$/.test(expr)) {
      const v = getTableCell(expr, rows);
      if (v === undefined) throw new Error('Geçersiz hücre: ' + expr);
      return v;
    }

    // Top-level comparison (for IF / EĞER conditions)
    const cmpMatch = findTopLevelOp(expr, ['>=', '<=', '<>', '!=', '=', '>', '<']);
    if (cmpMatch) {
      const lhs = evalExcelExpr(expr.slice(0, cmpMatch.idx), rows);
      const rhs = evalExcelExpr(expr.slice(cmpMatch.idx + cmpMatch.op.length), rows);
      const nl = Number(lhs), nr = Number(rhs);
      const bothNum = typeof lhs === 'number' || (!Number.isNaN(nl) && lhs !== '');
      const rhsNum = typeof rhs === 'number' || (!Number.isNaN(nr) && rhs !== '');
      if (cmpMatch.op === '>=') return bothNum && rhsNum ? nl >= nr : String(lhs) >= String(rhs);
      if (cmpMatch.op === '<=') return bothNum && rhsNum ? nl <= nr : String(lhs) <= String(rhs);
      if (cmpMatch.op === '>') return bothNum && rhsNum ? nl > nr : String(lhs) > String(rhs);
      if (cmpMatch.op === '<') return bothNum && rhsNum ? nl < nr : String(lhs) < String(rhs);
      if (cmpMatch.op === '=') return (bothNum && rhsNum) ? nl === nr : String(lhs).toLowerCase() === String(rhs).toLowerCase();
      return (bothNum && rhsNum) ? nl !== nr : String(lhs).toLowerCase() !== String(rhs).toLowerCase();
    }

    // Top-level + or -
    const addMatch = findTopLevelOp(expr, ['+', '-']);
    if (addMatch) {
      const l = Number(evalExcelExpr(expr.slice(0, addMatch.idx), rows));
      const r = Number(evalExcelExpr(expr.slice(addMatch.idx + 1), rows));
      return addMatch.op === '+' ? l + r : l - r;
    }

    // Top-level * or /
    const mulMatch = findTopLevelOp(expr, ['*', '/']);
    if (mulMatch) {
      const l = Number(evalExcelExpr(expr.slice(0, mulMatch.idx), rows));
      const r = Number(evalExcelExpr(expr.slice(mulMatch.idx + 1), rows));
      if (mulMatch.op === '/' && r === 0) throw new Error('#SAYI/0!');
      return mulMatch.op === '*' ? l * r : l / r;
    }

    // Function Call
    const fnM = expr.match(/^([A-Za-zÇĞİÖŞÜçğıöşü_]+)\(([\s\S]*)\)$/);
    if (!fnM) throw new Error('#AD? Tanınmayan ifade: ' + expr);

    const fn = fnM[1].toLocaleUpperCase('tr-TR').replace('İ', 'İ');
    const args = splitExcelArgs(fnM[2]);

    const collectNums = (argList) => {
      const out = [];
      for (const a of argList) {
        if (/^\$?[A-Za-z]+\$?\d+:\$?[A-Za-z]+\$?\d+$/.test(a)) {
          getTableRange(a, rows).flat().forEach(v => { if (typeof v === 'number') out.push(v); else if (v !== '' && !Number.isNaN(Number(v))) out.push(Number(v)); });
        } else {
          const val = evalExcelExpr(a, rows);
          if (typeof val === 'number') out.push(val);
        }
      }
      return out;
    };

    if (fn === 'TOPLA' || fn === 'SUM') {
      return collectNums(args).reduce((s, x) => s + x, 0);
    }
    if (fn === 'ORTALAMA' || fn === 'AVERAGE') {
      const nums = collectNums(args);
      if (!nums.length) throw new Error('#SAYI/0!');
      return nums.reduce((s, x) => s + x, 0) / nums.length;
    }
    if (fn === 'MAKS' || fn === 'MAX') {
      const nums = collectNums(args);
      return nums.length ? Math.max(...nums) : 0;
    }
    if (fn === 'MİN' || fn === 'MIN') {
      const nums = collectNums(args);
      return nums.length ? Math.min(...nums) : 0;
    }
    if (fn === 'BAĞ_DEĞ_SAY' || fn === 'BAG_DEG_SAY' || fn === 'COUNT') {
      return collectNums(args).length;
    }
    if (fn === 'YUVARLA' || fn === 'ROUND') {
      const val = Number(evalExcelExpr(args[0], rows));
      const digits = Number(evalExcelExpr(args[1] ?? '0', rows));
      const f = Math.pow(10, digits);
      return Math.round(val * f) / f;
    }
    if (fn === 'EĞER' || fn === 'EGER' || fn === 'IF') {
      const cond = !!evalExcelExpr(args[0], rows);
      return evalExcelExpr(cond ? args[1] : (args[2] ?? 'FALSE'), rows);
    }
    if (fn === 'VE' || fn === 'AND') {
      return args.every(a => !!evalExcelExpr(a, rows));
    }
    if (fn === 'YADA' || fn === 'OR') {
      return args.some(a => !!evalExcelExpr(a, rows));
    }
    if (fn === 'EĞERSAY' || fn === 'EGERSAY' || fn === 'COUNTIF') {
      const vals = getTableRange(args[0], rows).flat();
      const crit = evalExcelExpr(args[1], rows);
      return vals.filter(v => matchExcelCriteria(v, crit)).length;
    }
    if (fn === 'ETOPLA' || fn === 'SUMIF') {
      const critArr = getTableRange(args[0], rows).flat();
      const crit = evalExcelExpr(args[1], rows);
      const sumArr = args[2] ? getTableRange(args[2], rows).flat() : critArr;
      let total = 0;
      for (let i = 0; i < critArr.length; i++) {
        if (matchExcelCriteria(critArr[i], crit)) total += Number(sumArr[i]) || 0;
      }
      return total;
    }
    if (fn === 'DÜŞEYARA' || fn === 'DUSEYARA' || fn === 'VLOOKUP') {
      const key = evalExcelExpr(args[0], rows);
      const matrix = getTableRange(args[1], rows);
      const colIdx = Number(evalExcelExpr(args[2], rows));
      if (colIdx < 1 || !matrix.length || colIdx > matrix[0].length) throw new Error('#BAŞV!');
      for (const r of matrix) {
        if (String(r[0]).trim().toLowerCase() === String(key).trim().toLowerCase()) {
          return r[colIdx - 1];
        }
      }
      throw new Error('#YOK');
    }
    if (fn === 'ÇAPRAZARA' || fn === 'CAPRAZARA' || fn === 'XLOOKUP') {
      const key = evalExcelExpr(args[0], rows);
      const lookupArr = getTableRange(args[1], rows).flat();
      const returnArr = getTableRange(args[2], rows).flat();
      const idx = lookupArr.findIndex(v => String(v).trim().toLowerCase() === String(key).trim().toLowerCase());
      if (idx !== -1) return returnArr[idx];
      if (args[3] !== undefined) return evalExcelExpr(args[3], rows);
      throw new Error('#YOK');
    }
    if (fn === 'EĞERHATA' || fn === 'EGERHATA' || fn === 'IFERROR') {
      try { return evalExcelExpr(args[0], rows); } catch (e) { return evalExcelExpr(args[1] ?? '""', rows); }
    }
    throw new Error('#AD? Desteklenmeyen fonksiyon: ' + fnM[1]);
  }

  function renderOfficeLab() {
    const sel = document.getElementById('ol-challenge-select');
    if (sel && DATA.EXCEL_CHALLENGES.length) {
      sel.innerHTML = DATA.EXCEL_CHALLENGES.map(c => {
        const solved = acState.solvedExcel.includes(c.id);
        const lock = c.isPro && !isProActive() ? ' 🔒' : '';
        return `<option value="${c.id}">${solved ? '✓ ' : ''}${c.title} (${c.level})${lock}</option>`;
      }).join('');
      sel.value = activeExcelId;
    }
    const progPill = document.getElementById('ol-progress-pill');
    if (progPill) progPill.textContent = `${acState.solvedExcel.length} / ${DATA.EXCEL_CHALLENGES.length} Görev`;

    const ch = DATA.EXCEL_CHALLENGES.find(c => c.id === activeExcelId) || DATA.EXCEL_CHALLENGES[0];
    if (!ch) return;

    const locked = !!ch.isPro && !isProActive();
    const badge = document.getElementById('ol-level-badge');
    const desc = document.getElementById('ol-challenge-desc');
    const tgt = document.getElementById('ol-target-label');
    const inp = document.getElementById('ol-formula-input');
    const tableWrap = document.getElementById('ol-table-wrap');

    if (badge) {
      badge.textContent = ch.isPro ? `${ch.level} · PRO (+${ch.xp} XP)` : `${ch.level} (+${ch.xp} XP)`;
      badge.className = `px-2.5 py-1 rounded-full text-[11px] font-semibold ${ch.isPro ? 'bg-plumLight text-plum' : 'bg-forestLight text-forest'}`;
    }
    if (desc) desc.textContent = ch.prompt;
    if (tgt) tgt.textContent = ch.targetLabel;
    if (inp) inp.value = locked ? '(Bu Uzman Görev Pusula Pro ile açılır)' : ch.starter;

    if (tableWrap) {
      tableWrap.innerHTML = `
        <table class="excel-sim-table">
          <thead>
            <tr>
              <th class="xl-row-num">1</th>
              ${ch.headers.map(h => `<th>${esc(h)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${ch.rows.map((r, rIdx) => `
              <tr>
                <td class="xl-row-num">${rIdx + 2}</td>
                ${r.map(cell => `<td>${esc(typeof cell === 'number' ? cell.toLocaleString('tr-TR') : cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    const resBox = document.getElementById('ol-result-box');
    if (resBox) {
      if (locked) {
        resBox.className = 'p-3.5 rounded-xl bg-plumLight/60 border border-plum/30 text-xs text-ink flex items-center justify-between gap-3';
        resBox.innerHTML = `<span>Bu <strong>Uzman</strong> seviye ÇAPRAZARA / KDV görevi Pusula Pro üyelerine özeldir.</span><button type="button" id="ol-pro-unlock-inline" class="px-3 py-1.5 rounded-lg bg-forest text-paper font-semibold shrink-0">Pro ile Aç →</button>`;
      } else {
        resBox.className = 'p-3.5 rounded-xl bg-paper border border-hairline text-xs text-muted';
        resBox.textContent = 'Formülünüzü yazıp "Hesapla & Test Et" düğmesine basın.';
      }
    }
  }

  function runExcelPractice() {
    const ch = DATA.EXCEL_CHALLENGES.find(c => c.id === activeExcelId);
    const inp = document.getElementById('ol-formula-input');
    const resBox = document.getElementById('ol-result-box');
    if (!ch || !inp || !resBox) return;

    if (ch.isPro && !isProActive()) {
      openProShowcase();
      if (window.PusulaPromoVideo) window.PusulaPromoVideo.play();
      return;
    }

    const raw = inp.value.trim();
    if (!raw.startsWith('=')) {
      resBox.className = 'p-3.5 rounded-xl bg-terracottaLight border border-terracotta/40 text-xs text-terracotta font-medium';
      resBox.textContent = 'Hata: Excel formülleri mutlaka "=" işareti ile başlamalıdır.';
      return;
    }

    try {
      const val = evalExcelExpr(raw, ch.rows);
      const formattedVal = typeof val === 'number' ? (Number.isInteger(val) ? val.toLocaleString('tr-TR') : Number(val.toFixed(2)).toLocaleString('tr-TR')) : String(val);
      const valueMatch = typeof ch.expected === 'number'
        ? Math.abs(Number(val) - ch.expected) < 0.01
        : String(val).trim().toLowerCase() === String(ch.expected).trim().toLowerCase();
      const formulaMatch = ch.validateFormula ? ch.validateFormula(raw) : true;

      if (valueMatch && formulaMatch) {
        let firstTime = false;
        if (!acState.solvedExcel.includes(ch.id)) {
          acState.solvedExcel.push(ch.id);
          firstTime = true;
          awardXP(ch.xp, `${ch.title} formülü doğrulandı!`);
        }
        resBox.className = 'p-3.5 rounded-xl bg-forestLight border border-forest/40 text-xs text-forest font-semibold';
        resBox.textContent = `✓ Doğru Sonuç: ${formattedVal}${firstTime ? ` (+${ch.xp} XP kazanıldı!)` : ' (Tamamlandı ✓)'}`;
        updateOfficeLabStatusOnly();
      } else if (valueMatch && !formulaMatch) {
        resBox.className = 'p-3.5 rounded-xl bg-amberLight border border-amberwarm/40 text-xs text-ink font-medium';
        resBox.textContent = `Hesaplanan değer (${formattedVal}) yakın ancak görevde istenen Excel fonksiyonunu ve aralığı kullanmalısınız.`;
      } else {
        resBox.className = 'p-3.5 rounded-xl bg-terracottaLight border border-terracotta/40 text-xs text-terracotta font-medium';
        resBox.textContent = `Hesaplanan Değer: ${formattedVal} — Beklenen sonuca henüz ulaşmadı. İpucu için "İpucu Göster" düğmesini kullanabilirsiniz.`;
      }
    } catch (err) {
      resBox.className = 'p-3.5 rounded-xl bg-terracottaLight border border-terracotta/40 text-xs text-terracotta font-medium';
      resBox.textContent = `Formül Hatası: ${err.message}`;
    }
  }

  function updateOfficeLabStatusOnly() {
    const sel = document.getElementById('ol-challenge-select');
    if (sel && DATA.EXCEL_CHALLENGES.length) {
      sel.innerHTML = DATA.EXCEL_CHALLENGES.map(c => {
        const solved = acState.solvedExcel.includes(c.id);
        const lock = c.isPro && !isProActive() ? ' 🔒' : '';
        return `<option value="${c.id}">${solved ? '✓ ' : ''}${c.title} (${c.level})${lock}</option>`;
      }).join('');
      sel.value = activeExcelId;
    }
    const progPill = document.getElementById('ol-progress-pill');
    if (progPill) progPill.textContent = `${acState.solvedExcel.length} / ${DATA.EXCEL_CHALLENGES.length} Görev`;
  }

  function initOfficeCopilotStudio() {
    const presetsBox = document.getElementById('ol-copilot-presets');
    if (presetsBox && DATA.COPILOT_SCENARIOS.length) {
      const proOn = isProActive();
      presetsBox.innerHTML = DATA.COPILOT_SCENARIOS.map(sc => `
        <button type="button" data-copilot-preset="${sc.id}" class="px-2.5 py-1.5 rounded-lg border border-hairline bg-paper hover:border-plum text-[11px] font-medium text-ink transition">
          ${esc(sc.title)}${sc.isPro ? (proOn ? ' ✓' : ' 🔒') : ''}
        </button>
      `).join('');
    }
  }

  function runOfficeCopilotGenerator() {
    const app = document.getElementById('ol-copilot-app')?.value || 'excel';
    const tone = document.getElementById('ol-copilot-tone')?.value || 'pratik';
    const promptVal = (document.getElementById('ol-copilot-prompt')?.value || '').trim();
    const out = document.getElementById('ol-copilot-output');
    if (!out) return;

    if (app === 'vba' && !isProActive()) {
      out.textContent = '🔒 Excel VBA Makro & Kurumsal Otomasyon Üreticisi Pusula Pro üyelerine özeldir.\n"Pusula Pro" penceresinden tanıtım filmini izleyip Pro önizlemeyi anında açabilirsiniz.';
      openProShowcase();
      return;
    }

    if (!promptVal) {
      toast('Lütfen ne üretmek istediğinizi kısaca yazın.');
      return;
    }

    const q = promptVal.toLowerCase();
    const toneLabel = tone === 'kurumsal' ? 'Kurumsal Resmi Dil' : tone === 'ozet' ? 'Yönetici Özeti' : 'Doğrudan Uygulanabilir Çıktı';

    let result = '';
    const presetHit = DATA.COPILOT_SCENARIOS.find(sc => q.includes(sc.promptSample.slice(0, 20).toLowerCase()));
    if (presetHit) {
      result = presetHit.templateOutput;
    } else if (app === 'vba') {
      result = `⚡ PUSULA PRO — VBA OTOMASYON ÇIKTISI (${toneLabel})\nİstek: "${promptVal}"\n\nSub PusulaOtomasyon()\n    Application.ScreenUpdating = False\n    Dim ws As Worksheet\n    For Each ws In ThisWorkbook.Worksheets\n        ws.UsedRange.Columns.AutoFit\n    Next ws\n    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:=ThisWorkbook.Path & "\\Cikti.pdf"\n    Application.ScreenUpdating = True\n    MsgBox "İşlem tamamlandı!", vbInformation\nEnd Sub`;
    } else if (app === 'excel') {
      const suggestedFormula = q.includes('ara') || q.includes('bul') || q.includes('eşleş')
        ? '=ÇAPRAZARA(E2; A2:A100; C2:C100; "Bulunamadı")'
        : q.includes('şart') || q.includes('prim') || q.includes('eğer') || q.includes('gecik') || q.includes('vade')
          ? '=EĞER(B2>0; "Gecikme: " & B2 & " Gün"; "Zamanında")'
          : '=TOPLA.ÇARPIM((B2:B50="Aktif")*(C2:C50))';
      result = `📊 EXCEL AI COPILOT ÖNERİSİ (${toneLabel})\nTalep: "${promptVal}"\n\nÖnerilen Formül:\n${suggestedFormula}\n\nUygulama Adımları:\n1. Tabloyu seçip Ctrl+T ile Akıllı Tablo yapın.\n2. Formülü ilk veri satırına yapıştırıp Enter’a basın.\n3. Canlı test etmek için soldaki "Excel Formül Simülatörü"nü kullanabilirsiniz.`;
    } else if (app === 'word') {
      result = `📄 WORD COPILOT BELGE TASLAĞI (${toneLabel})\nKonu: "${promptVal}"\n\n[Başlık 1] Amaç ve Kapsam\nBu belge, talep edilen çerçevede resmi/kurumsal standartlara uygun olarak hazırlanmıştır.\n\n[Başlık 2] Temel Maddeler ve Teslimatlar\n• Madde 1: Süreç tanımı ve sorumluluk paylaşımı\n• Madde 2: Zaman planı ve doğrulama ölçütleri\n• Madde 3: Onay ve yürürlük tarihi\n\n💡 İpucu: Oluşan taslağı "Ofis, Excel & PDF" sekmesindeki Word editörüne kopyalayıp .doc olarak indirebilirsiniz.`;
    } else if (app === 'powerpoint') {
      result = `🎯 POWERPOINT COPILOT SUNUM PLANI (${toneLabel})\nKonu: "${promptVal}"\n\nSlayt 1 (Kapak): Ana Vizyon & Değer Önerisi\nSlayt 2 (Mevcut Durum): Çözülen Problem ve Sayısal Veriler\nSlayt 3 (Çözüm Mimarisi): 3 Adımlı Uygulama Akışı\nSlayt 4 (KPI & Etki): Beklenen Süre/Maliyet Tasarrufu\nSlayt 5 (Sonraki Adım): Takvim ve Sorumlular`;
    } else {
      result = `✉️ OUTLOOK & TEAMS COPILOT ÇIKTISI (${toneLabel})\nKonu: "${promptVal}"\n\nKonu Satırı: Güncelleme ve Aksiyon Planı Hakkında\n\nMerhaba,\n\nGörüşmemiz doğrultusunda temel kararlar ve sıradaki adımlar aşağıdadır:\n1) İlgili dosya SharePoint üzerinden paylaşıldı.\n2) Son kontrol tarihi Cuma 17:00 olarak belirlendi.\n\nBilgilerinize sunarım.`;
    }

    out.textContent = result;

    // If user configured Gemini API Key, enhance live in place too!
    const apiKey = (window.PUSULA_CONFIG && window.PUSULA_CONFIG.GEMINI_API_KEY) || (() => { try { return localStorage.getItem('pusula_gemini_key') || ''; } catch (e) { return ''; } })();
    if (apiKey) {
      out.textContent = result + '\n\n⏳ Gemini AI ile zenginleştirilmiş yanıt alınıyor...';
      fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Sen bir Microsoft Office uzmanısın. Program: ${app}. Stil: ${toneLabel}. Türkçe olarak net formül, kod veya belge taslağı üret: ${promptVal}` }] }]
        })
      }).then(r => r.ok ? r.json() : null).then(d => {
        const liveTxt = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (liveTxt) out.textContent = liveTxt;
      }).catch(() => {});
    }
  }

  const olSel = document.getElementById('ol-challenge-select');
  if (olSel) {
    olSel.addEventListener('change', (e) => {
      activeExcelId = e.target.value;
      renderOfficeLab();
    });
  }
  bindClick('ol-run-btn', runExcelPractice);
  const olInpEl = document.getElementById('ol-formula-input');
  if (olInpEl) {
    olInpEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); runExcelPractice(); }
    });
  }
  bindClick('ol-hint-btn', () => {
    const ch = DATA.EXCEL_CHALLENGES.find(c => c.id === activeExcelId);
    const resBox = document.getElementById('ol-result-box');
    if (ch && resBox) {
      resBox.className = 'p-3.5 rounded-xl bg-amberLight border border-amberwarm/35 text-xs text-ink font-medium';
      resBox.textContent = '💡 İpucu: ' + ch.hint;
    }
  });
  bindClick('ol-solution-btn', () => {
    const ch = DATA.EXCEL_CHALLENGES.find(c => c.id === activeExcelId);
    const inp = document.getElementById('ol-formula-input');
    if (!ch || !inp) return;
    if (ch.isPro && !isProActive()) { openProShowcase(); return; }
    inp.value = ch.solution;
    toast('Örnek çözüm formülü yüklendi.');
  });
  bindClick('ol-ai-coach-btn', () => {
    const ch = DATA.EXCEL_CHALLENGES.find(c => c.id === activeExcelId);
    if (ch && typeof window.pusulaAskAssistant === 'function') {
      window.pusulaAskAssistant(`Microsoft Excel pratiğinde şu görevi adım adım anlat: ${ch.prompt} (Örnek çözüm mantığı: ${ch.solution})`, true);
    }
  });
  bindClick('ol-copilot-gen-btn', runOfficeCopilotGenerator);
  bindClick('ol-copilot-copy-btn', () => {
    const out = document.getElementById('ol-copilot-output');
    if (out && navigator.clipboard) navigator.clipboard.writeText(out.textContent).then(() => toast('Copilot çıktısı kopyalandı!'));
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#ol-pro-unlock-inline')) {
      if (window.PusulaPromoVideo) window.PusulaPromoVideo.openAndPlay();
      else openProShowcase();
      return;
    }
    const pBtn = e.target.closest('[data-copilot-preset]');
    if (pBtn) {
      const sc = DATA.COPILOT_SCENARIOS.find(s => s.id === pBtn.dataset.copilotPreset);
      if (!sc) return;
      if (sc.isPro && !isProActive()) {
        if (window.PusulaPromoVideo) window.PusulaPromoVideo.openAndPlay();
        else openProShowcase();
        toast('VBA Otomasyon Üreticisi Pusula Pro ayrıcalığıdır.');
        return;
      }
      const appSel = document.getElementById('ol-copilot-app');
      const pArea = document.getElementById('ol-copilot-prompt');
      const outEl = document.getElementById('ol-copilot-output');
      if (appSel) appSel.value = sc.id.includes('vba') ? 'vba' : sc.id.split('-')[0];
      if (pArea) pArea.value = sc.promptSample;
      if (outEl) outEl.textContent = sc.templateOutput;
    }
  });

  // =========================================================
  // TAB 3: FLASHCARDS (3D FLIP + ACTIVE RECALL + CUSTOM CARDS)
  // =========================================================
  let fcCat = 'Tümü';
  let fcQueue = [];
  let fcIndex = 0;
  let fcFlipped = false;

  function getAllFlashcards() {
    return [...DATA.FLASHCARDS, ...acState.customCards];
  }

  function rebuildFlashcardQueue(onlyUnmastered = false) {
    const all = getAllFlashcards().filter(c => {
      if (fcCat === 'Özel') return c.custom;
      return fcCat === 'Tümü' || c.cat === fcCat;
    });
    const list = onlyUnmastered ? all.filter(c => !acState.masteredCards.includes(c.id)) : all;
    fcQueue = list.length ? list.slice() : all.slice();
    fcIndex = 0;
    fcFlipped = false;
    renderFlashcardDeck();
  }

  function renderFlashcardDeck() {
    const all = getAllFlashcards();
    const filtered = all.filter(c => fcCat === 'Tümü' ? true : fcCat === 'Özel' ? c.custom : c.cat === fcCat);
    const masteredInCat = filtered.filter(c => acState.masteredCards.includes(c.id)).length;

    const statsEl = document.getElementById('fc-stats-label');
    if (statsEl) statsEl.textContent = `${masteredInCat} / ${filtered.length} Öğrenildi`;

    const cardEl = document.getElementById('fc-3d-card');
    if (cardEl) cardEl.classList.toggle('is-flipped', fcFlipped);

    if (!fcQueue.length) {
      document.getElementById('fc-front-cat').textContent = fcCat;
      document.getElementById('fc-front-text').textContent = 'Bu kategoride henüz kart yok. Sağdaki formdan ekleyebilirsiniz.';
      document.getElementById('fc-back-text').textContent = '';
      document.getElementById('fc-back-code').classList.add('hidden');
      document.getElementById('fc-pos-label').textContent = '0 / 0';
      return;
    }

    if (fcIndex >= fcQueue.length) fcIndex = 0;
    const card = fcQueue[fcIndex];
    const isMastered = acState.masteredCards.includes(card.id);

    document.getElementById('fc-front-cat').textContent = `${card.cat}${isMastered ? ' · Öğrenildi ✓' : ''}`;
    document.getElementById('fc-front-text').textContent = card.front;
    document.getElementById('fc-back-cat').textContent = card.cat;
    document.getElementById('fc-back-text').textContent = card.back;
    const codePre = document.getElementById('fc-back-code');
    if (card.code) {
      codePre.textContent = card.code;
      codePre.classList.remove('hidden');
    } else {
      codePre.classList.add('hidden');
    }
    document.getElementById('fc-pos-label').textContent = `Kart ${fcIndex + 1} / ${fcQueue.length}`;

    const delBtn = document.getElementById('fc-delete-custom-btn');
    if (delBtn) delBtn.classList.toggle('hidden', !card.custom);
  }

  bindClick('fc-3d-card', () => {
    if (!fcQueue.length) return;
    fcFlipped = !fcFlipped;
    document.getElementById('fc-3d-card').classList.toggle('is-flipped', fcFlipped);
  });

  bindClick('fc-rate-hard', () => {
    if (!fcQueue.length) return;
    const curr = fcQueue.splice(fcIndex, 1)[0];
    fcQueue.push(curr); // Requeue at end
    fcFlipped = false;
    renderFlashcardDeck();
    toast('Kart tekrar sırasına alındı.');
  });

  bindClick('fc-rate-good', () => {
    if (!fcQueue.length) return;
    fcIndex = (fcIndex + 1) % fcQueue.length;
    fcFlipped = false;
    awardXP(10, 'Bilgi kartı çalışıldı');
    renderFlashcardDeck();
  });

  bindClick('fc-rate-master', () => {
    if (!fcQueue.length) return;
    const card = fcQueue[fcIndex];
    if (!acState.masteredCards.includes(card.id)) {
      acState.masteredCards.push(card.id);
      awardXP(20, 'Kart tamamen öğrenildi!');
    }
    fcIndex = (fcIndex + 1) % fcQueue.length;
    fcFlipped = false;
    renderFlashcardDeck();
  });

  bindClick('fc-shuffle-btn', () => {
    for (let i = fcQueue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [fcQueue[i], fcQueue[j]] = [fcQueue[j], fcQueue[i]];
    }
    fcIndex = 0;
    fcFlipped = false;
    renderFlashcardDeck();
    toast('Kart destesi karıştırıldı.');
  });

  bindClick('fc-delete-custom-btn', () => {
    const card = fcQueue[fcIndex];
    if (!card || !card.custom) return;
    acState.customCards = acState.customCards.filter(c => c.id !== card.id);
    acState.masteredCards = acState.masteredCards.filter(id => id !== card.id);
    saveAcademyState();
    rebuildFlashcardQueue();
    toast('Özel kart silindi.');
  });

  document.querySelectorAll('.fc-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      fcCat = btn.dataset.fcCat;
      document.querySelectorAll('.fc-cat-btn').forEach(b => {
        const act = b === btn;
        b.className = 'fc-cat-btn px-3 py-1.5 rounded-full text-xs font-medium ' +
          (act ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      rebuildFlashcardQueue();
    });
  });

  const fcAddForm = document.getElementById('fc-add-form');
  if (fcAddForm) {
    fcAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isProActive() && acState.customCards.length >= 5) {
        openProShowcase();
        toast('Ücretsiz planda en fazla 5 özel kart ekleyebilirsiniz. Sınırsız kart için Pusula Pro’yu açın.');
        return;
      }
      const cat = document.getElementById('fc-new-cat').value;
      const front = document.getElementById('fc-new-front').value.trim();
      const back = document.getElementById('fc-new-back').value.trim();
      const code = document.getElementById('fc-new-code').value.trim();
      if (!front || !back) return;
      acState.customCards.unshift({ id: 'cfc-' + Date.now(), cat, front, back, code, custom: true });
      saveAcademyState();
      e.target.reset();
      rebuildFlashcardQueue();
      toast('Yeni bilgi kartı destenize eklendi!');
    });
  }

  // =========================================================
  // TAB 4: TECHNICAL QUIZ & TIMED EXAM SIMULATOR
  // =========================================================
  let qCat = 'Tümü';
  let qLevel = 'Tümü';
  let qMode = 'practice'; // practice | exam
  let qDeck = [];
  let qIdx = 0;
  let qScore = 0;
  let qSessionWrong = [];
  let qAnswered = false;
  let qTimerInt = null;
  let qRemainSec = 300;

  function shuffleCopy(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function stopQuizTimer() {
    clearInterval(qTimerInt);
    qTimerInt = null;
  }

  function startTechnicalQuiz(onlyWrongIds = null) {
    stopQuizTimer();
    let pool = DATA.QUIZ_BANK.filter(q => {
      const mCat = qCat === 'Tümü' || q.cat === qCat;
      const qLvl = q.level || (q.diff === 'Temel' ? 'Başlangıç' : q.diff) || 'Başlangıç';
      const mLvl = qLevel === 'Tümü' || qLvl === qLevel;
      return mCat && mLvl;
    });
    if (Array.isArray(onlyWrongIds) && onlyWrongIds.length) {
      pool = DATA.QUIZ_BANK.filter(q => onlyWrongIds.includes(q.id));
    }
    qDeck = shuffleCopy(pool);
    if (qMode === 'exam' && qDeck.length > 10) qDeck = qDeck.slice(0, 10);

    qIdx = 0;
    qScore = 0;
    qSessionWrong = [];
    qAnswered = false;

    document.getElementById('ac-quiz-summary-box').classList.add('hidden');
    document.getElementById('ac-quiz-active-box').classList.remove('hidden');

    const timerBadge = document.getElementById('ac-quiz-timer');
    if (qMode === 'exam') {
      qRemainSec = 300;
      timerBadge.classList.remove('hidden');
      const updTimer = () => {
        const m = String(Math.floor(qRemainSec / 60)).padStart(2, '0');
        const s = String(qRemainSec % 60).padStart(2, '0');
        timerBadge.textContent = `⏱ ${m}:${s}`;
      };
      updTimer();
      qTimerInt = setInterval(() => {
        qRemainSec--;
        updTimer();
        if (qRemainSec <= 0) {
          stopQuizTimer();
          finishTechnicalQuiz();
        }
      }, 1000);
    } else {
      timerBadge.classList.add('hidden');
    }

    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    if (!qDeck.length || qIdx >= qDeck.length) {
      finishTechnicalQuiz();
      return;
    }
    const q = qDeck[qIdx];
    qAnswered = false;

    document.getElementById('ac-quiz-progress').textContent = `Soru ${qIdx + 1} / ${qDeck.length}`;
    document.getElementById('ac-quiz-cat-badge').textContent = `${q.cat} · ${q.level || q.diff || 'Genel'}`;
    document.getElementById('ac-quiz-bar').style.width = `${Math.round((qIdx / qDeck.length) * 100)}%`;
    document.getElementById('ac-quiz-q').textContent = q.q;

    const codeEl = document.getElementById('ac-quiz-code');
    if (q.code) {
      codeEl.textContent = q.code;
      codeEl.classList.remove('hidden');
    } else {
      codeEl.classList.add('hidden');
    }

    document.getElementById('ac-quiz-exp').classList.add('hidden');
    document.getElementById('ac-quiz-next-btn').classList.add('hidden');

    document.getElementById('ac-quiz-opts').innerHTML = q.opts.map((opt, i) => `
      <button type="button" data-ac-qopt="${i}" class="w-full text-left px-4 py-3 rounded-xl border border-hairline bg-surface hover:border-forest text-xs sm:text-sm text-ink transition flex items-start gap-2.5">
        <span class="w-5 h-5 rounded-md bg-paper border border-hairline text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">${String.fromCharCode(65 + i)}</span>
        <span>${esc(opt)}</span>
      </button>
    `).join('');
  }

  function finishTechnicalQuiz() {
    stopQuizTimer();
    document.getElementById('ac-quiz-active-box').classList.add('hidden');
    const sumBox = document.getElementById('ac-quiz-summary-box');
    sumBox.classList.remove('hidden');

    const total = qDeck.length || 1;
    const pct = Math.round((qScore / total) * 100);
    document.getElementById('ac-quiz-final-score').textContent = `${qScore} / ${total} (%${pct})`;
    document.getElementById('ac-quiz-final-msg').textContent =
      pct >= 80 ? 'Harika performans! Mühendislik kavramlarına hakimsiniz.'
      : pct >= 50 ? 'İyi başlangıç! Yanlış yaptığınız soruların açıklamalarını tekrar edebilirsiniz.'
      : 'Konuları Müfredat sekmesinden tekrar gözden geçirip yeniden deneyebilirsiniz.';

    const retryBtn = document.getElementById('ac-quiz-retry-wrong');
    if (retryBtn) retryBtn.classList.toggle('hidden', qSessionWrong.length === 0);
  }

  document.addEventListener('click', (e) => {
    const optBtn = e.target.closest('[data-ac-qopt]');
    if (!optBtn || qAnswered) return;
    const q = qDeck[qIdx];
    if (!q) return;

    qAnswered = true;
    const chosen = Number(optBtn.dataset.acQopt);
    const isCorrect = chosen === q.ans;

    acState.quizStats.totalAnswered++;
    if (!acState.quizStats.byCat[q.cat]) acState.quizStats.byCat[q.cat] = { total: 0, correct: 0 };
    acState.quizStats.byCat[q.cat].total++;

    if (isCorrect) {
      qScore++;
      acState.quizStats.totalCorrect++;
      acState.quizStats.byCat[q.cat].correct++;
      acState.quizStats.wrongIds = acState.quizStats.wrongIds.filter(id => id !== q.id);
      awardXP(15);
    } else {
      qSessionWrong.push(q.id);
      if (!acState.quizStats.wrongIds.includes(q.id)) acState.quizStats.wrongIds.push(q.id);
      saveAcademyState();
    }

    document.querySelectorAll('[data-ac-qopt]').forEach((b, i) => {
      b.disabled = true;
      if (i === q.ans) {
        b.className = 'w-full text-left px-4 py-3 rounded-xl border-2 border-forest bg-forestLight text-forest font-semibold text-xs sm:text-sm flex items-start gap-2.5';
      } else if (i === chosen) {
        b.className = 'w-full text-left px-4 py-3 rounded-xl border-2 border-terracotta bg-terracottaLight text-terracotta text-xs sm:text-sm flex items-start gap-2.5';
      }
    });

    const expBox = document.getElementById('ac-quiz-exp');
    expBox.textContent = (isCorrect ? '✓ Doğru! ' : '✗ Yanlış. ') + q.exp;
    expBox.className = 'p-3.5 rounded-xl text-xs font-medium ' + (isCorrect ? 'bg-forestLight text-forest' : 'bg-terracottaLight text-terracotta');
    expBox.classList.remove('hidden');

    const nextBtn = document.getElementById('ac-quiz-next-btn');
    nextBtn.textContent = qIdx + 1 >= qDeck.length ? 'Sonucu Gör →' : 'Sonraki Soru →';
    nextBtn.classList.remove('hidden');
  });

  bindClick('ac-quiz-next-btn', () => { qIdx++; renderQuizQuestion(); });
  bindClick('ac-quiz-restart-btn', () => startTechnicalQuiz());
  bindClick('ac-quiz-retry-wrong', () => startTechnicalQuiz(qSessionWrong.slice()));
  bindClick('ac-quiz-wrong-bank-btn', () => {
    if (!acState.quizStats.wrongIds.length) { toast('Yanlış defteriniz tertemiz!'); return; }
    startTechnicalQuiz(acState.quizStats.wrongIds.slice());
  });

  document.querySelectorAll('.ac-quiz-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      qCat = btn.dataset.quizCat;
      document.querySelectorAll('.ac-quiz-cat-btn').forEach(b => {
        const act = b === btn;
        b.className = 'ac-quiz-cat-btn px-3 py-1.5 rounded-full text-xs font-medium ' +
          (act ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      startTechnicalQuiz();
    });
  });

  const qModeSel = document.getElementById('ac-quiz-mode-select');
  if (qModeSel) {
    qModeSel.addEventListener('change', (e) => {
      qMode = e.target.value;
      startTechnicalQuiz();
    });
  }

  const qLevelSel = document.getElementById('ac-quiz-level-select');
  if (qLevelSel) {
    qLevelSel.addEventListener('change', (e) => {
      qLevel = e.target.value;
      startTechnicalQuiz();
    });
  }

  // =========================================================
  // TAB 5: INTERACTIVE AI & ALGORITHM VISUALIZERS
  // =========================================================
  // 5A. LLM Tokenizer & Context Window Simulator
  const TOKEN_COLORS = [
    'bg-forestLight text-forest border-forest/20',
    'bg-oceanLight text-ocean border-ocean/20',
    'bg-plumLight text-plum border-plum/20',
    'bg-amberLight text-amberwarm border-amberwarm/20',
    'bg-terracottaLight text-terracotta border-terracotta/20'
  ];

  function tokenizeApprox(text) {
    if (!text) return [];
    const tokens = [];
    const pieces = text.match(/\s+|[.,!?;:()\[\]{}"'`]+|[^\s.,!?;:()\[\]{}"'`]+/g) || [];
    for (const p of pieces) {
      if (/^\s+$/.test(p)) continue;
      if (p.length <= 4) {
        tokens.push(p);
      } else {
        // Approximate BPE subword chunks (3-4 chars)
        for (let i = 0; i < p.length; i += 4) {
          tokens.push(p.slice(i, i + 4));
        }
      }
    }
    return tokens;
  }

  function updateTokenizerViz() {
    const inp = document.getElementById('viz-tok-input');
    const winSel = document.getElementById('viz-tok-window');
    if (!inp || !winSel) return;
    const txt = inp.value;
    const tokens = tokenizeApprox(txt);
    const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    const maxCtx = Number(winSel.value) || 128000;
    const pct = Math.min(100, (tokens.length / maxCtx) * 100);
    const cost = (tokens.length / 1_000_000) * 0.30;

    document.getElementById('viz-tok-count').textContent = tokens.length;
    document.getElementById('viz-tok-words').textContent = words;
    document.getElementById('viz-tok-chars').textContent = txt.length;
    document.getElementById('viz-tok-cost').textContent = '$' + cost.toFixed(6);
    document.getElementById('viz-tok-ctx-pct').textContent = `%${pct.toFixed(4)} dolu`;

    const chips = document.getElementById('viz-tok-chips');
    chips.innerHTML = tokens.slice(0, 120).map((t, i) =>
      `<span class="token-chip ${TOKEN_COLORS[i % TOKEN_COLORS.length]}">${esc(t)}</span>`
    ).join('') + (tokens.length > 120 ? `<span class="text-xs text-muted ml-2">+${tokens.length - 120} token daha</span>` : '');
  }

  const tokInp = document.getElementById('viz-tok-input');
  const tokWin = document.getElementById('viz-tok-window');
  if (tokInp) tokInp.addEventListener('input', updateTokenizerViz);
  if (tokWin) tokWin.addEventListener('change', updateTokenizerViz);
  document.querySelectorAll('[data-tok-sample]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (tokInp) { tokInp.value = btn.dataset.tokSample; updateTokenizerViz(); }
    });
  });

  // 5B. Softmax Temperature & Top-P Simulator
  const SAMPLING_PROMPTS = {
    code: {
      prompt: 'Python’da bir listeyi sıralamak için kullanılan yerleşik fonksiyon:',
      candidates: [
        { token: 'sorted()', logit: 5.4 },
        { token: 'list.sort()', logit: 4.8 },
        { token: 'heapq', logit: 2.3 },
        { token: 'numpy.sort', logit: 1.9 },
        { token: 'bubble_sort', logit: 0.9 },
        { token: 'print()', logit: -0.6 }
      ]
    },
    story: {
      prompt: 'Yağmurlu bir İstanbul akşamında eski sahaftan aldığım kitabın içinden...',
      candidates: [
        { token: 'sararmış', logit: 4.2 },
        { token: 'gizemli', logit: 3.9 },
        { token: 'el yazısı', logit: 3.6 },
        { token: 'unutulmuş', logit: 3.1 },
        { token: 'kuantum', logit: 0.7 },
        { token: 'uzay gemisi', logit: 0.2 }
      ]
    }
  };

  function updateTemperatureViz() {
    const scenario = document.getElementById('viz-temp-scenario')?.value || 'code';
    const temp = Math.max(0.05, Number(document.getElementById('viz-temp-slider')?.value || 0.7));
    const topP = Number(document.getElementById('viz-topp-slider')?.value || 0.9);

    document.getElementById('viz-temp-val').textContent = temp.toFixed(2);
    document.getElementById('viz-topp-val').textContent = topP.toFixed(2);

    const data = SAMPLING_PROMPTS[scenario];
    document.getElementById('viz-temp-prompt-text').textContent = data.prompt;

    const exps = data.candidates.map(c => Math.exp(c.logit / temp));
    const sumExp = exps.reduce((a, b) => a + b, 0);
    const probs = data.candidates.map((c, i) => ({
      token: c.token,
      prob: exps[i] / sumExp
    })).sort((a, b) => b.prob - a.prob);

    let cum = 0;
    const barsHtml = probs.map((item, idx) => {
      const inNucleus = idx === 0 || cum < topP;
      cum += item.prob;
      const pct = (item.prob * 100).toFixed(1);
      return `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono-code font-medium ${inNucleus ? 'text-ink' : 'text-muted line-through'}">${esc(item.token)}</span>
            <span class="tabular font-semibold ${inNucleus ? 'text-forest' : 'text-muted'}">%${pct} ${inNucleus ? '' : '· Elendi (Top-P)'}</span>
          </div>
          <div class="h-2.5 rounded-full bg-paper border border-hairline overflow-hidden">
            <div class="h-full rounded-full transition-all duration-200 ${inNucleus ? 'bg-forest' : 'bg-stonewarm'}" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
    document.getElementById('viz-temp-bars').innerHTML = barsHtml;
  }

  ['viz-temp-scenario', 'viz-temp-slider', 'viz-topp-slider'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateTemperatureViz);
  });

  // 5C. Sorting Algorithm Step Visualizer
  let algoBaseArr = [];
  let algoFrames = [];
  let algoFrameIdx = 0;
  let algoTimer = null;
  let algoPlaying = false;

  function generateRandomArray(n) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(12 + Math.floor(Math.random() * 88));
    return arr;
  }

  function recordSortFrames(type, input) {
    const a = input.slice();
    const frames = [];
    let comps = 0, swaps = 0;
    const snap = (active = [], sorted = []) => frames.push({ arr: a.slice(), active, sorted: sorted.slice(), comps, swaps });
    snap([], []);

    if (type === 'bubble') {
      const sorted = [];
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
          comps++;
          snap([j, j + 1], sorted);
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            swaps++;
            snap([j, j + 1], sorted);
          }
        }
        sorted.push(a.length - i - 1);
      }
      snap([], a.map((_, i) => i));
    } else if (type === 'selection') {
      const sorted = [];
      for (let i = 0; i < a.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < a.length; j++) {
          comps++;
          snap([minIdx, j], sorted);
          if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          swaps++;
        }
        sorted.push(i);
        snap([i], sorted);
      }
      snap([], a.map((_, i) => i));
    } else if (type === 'insertion') {
      for (let i = 1; i < a.length; i++) {
        let key = a[i];
        let j = i - 1;
        while (j >= 0) {
          comps++;
          snap([j, j + 1], []);
          if (a[j] > key) {
            a[j + 1] = a[j];
            swaps++;
            j--;
            snap([j + 1], []);
          } else break;
        }
        a[j + 1] = key;
      }
      snap([], a.map((_, i) => i));
    } else {
      // quick sort
      function qs(lo, hi) {
        if (lo >= hi) return;
        const pivot = a[hi];
        let i = lo;
        for (let j = lo; j < hi; j++) {
          comps++;
          snap([j, hi], []);
          if (a[j] < pivot) {
            [a[i], a[j]] = [a[j], a[i]];
            swaps++;
            i++;
            snap([i, j], []);
          }
        }
        [a[i], a[hi]] = [a[hi], a[i]];
        swaps++;
        snap([i], []);
        qs(lo, i - 1);
        qs(i + 1, hi);
      }
      qs(0, a.length - 1);
      snap([], a.map((_, i) => i));
    }
    return frames;
  }

  function renderAlgoFrame() {
    const f = algoFrames[algoFrameIdx] || { arr: algoBaseArr, active: [], sorted: [], comps: 0, swaps: 0 };
    const box = document.getElementById('viz-algo-bars');
    if (!box) return;
    box.innerHTML = f.arr.map((val, idx) => {
      const isAct = f.active.includes(idx);
      const isDone = f.sorted.includes(idx);
      const bg = isDone ? 'bg-forest' : isAct ? 'bg-terracotta' : 'bg-ocean';
      return `<div class="flex-1 flex flex-col items-center justify-end h-full gap-1">
        <span class="text-[9px] tabular text-muted hidden sm:inline">${val}</span>
        <div class="w-full rounded-t-md transition-all duration-100 ${bg}" style="height:${val}%"></div>
      </div>`;
    }).join('');
    document.getElementById('viz-algo-comps').textContent = f.comps;
    document.getElementById('viz-algo-swaps').textContent = f.swaps;
    document.getElementById('viz-algo-step-label').textContent = `Adım ${algoFrameIdx} / ${Math.max(0, algoFrames.length - 1)}`;
  }

  function stopAlgoPlay() {
    clearInterval(algoTimer);
    algoTimer = null;
    algoPlaying = false;
    const btn = document.getElementById('viz-algo-play-btn');
    if (btn) btn.textContent = 'Başlat';
  }

  function initAlgoVisualizer(newRandom = true) {
    stopAlgoPlay();
    const type = document.getElementById('viz-algo-select')?.value || 'quick';
    const size = Number(document.getElementById('viz-algo-size')?.value || 16);
    if (newRandom || !algoBaseArr.length) algoBaseArr = generateRandomArray(size);
    algoFrames = recordSortFrames(type, algoBaseArr);
    algoFrameIdx = 0;

    const spec = DATA.ALGO_SPECS[type];
    if (spec) {
      document.getElementById('viz-algo-desc').textContent = spec.desc;
      document.getElementById('viz-algo-bigo').textContent = `En İyi: ${spec.best} · Ort: ${spec.avg} · Bellek: ${spec.space}`;
    }
    renderAlgoFrame();
  }

  bindClick('viz-algo-play-btn', () => {
    if (algoPlaying) { stopAlgoPlay(); return; }
    if (algoFrameIdx >= algoFrames.length - 1) algoFrameIdx = 0;
    algoPlaying = true;
    document.getElementById('viz-algo-play-btn').textContent = 'Duraklat';
    const delay = Number(document.getElementById('viz-algo-speed')?.value || 90);
    algoTimer = setInterval(() => {
      if (algoFrameIdx < algoFrames.length - 1) {
        algoFrameIdx++;
        renderAlgoFrame();
      } else {
        stopAlgoPlay();
      }
    }, delay);
  });
  bindClick('viz-algo-step-btn', () => {
    stopAlgoPlay();
    if (algoFrameIdx < algoFrames.length - 1) { algoFrameIdx++; renderAlgoFrame(); }
  });
  bindClick('viz-algo-shuffle-btn', () => initAlgoVisualizer(true));
  const algoSel = document.getElementById('viz-algo-select');
  const algoSize = document.getElementById('viz-algo-size');
  if (algoSel) algoSel.addEventListener('change', () => initAlgoVisualizer(false));
  if (algoSize) algoSize.addEventListener('input', () => initAlgoVisualizer(true));

  // =========================================================
  // TAB 6: ROADMAP, ANALYTICS & PRINTABLE CERTIFICATE
  // =========================================================
  let acSkillChart = null;

  function renderRoadmapView() {
    const listEl = document.getElementById('ac-roadmap-tracks');
    if (listEl) {
      listEl.innerHTML = DATA.TRACKS.map(tr => {
        const lessons = DATA.LESSONS.filter(l => l.track === tr.id);
        const done = lessons.filter(l => acState.completedLessons.includes(l.id)).length;
        const pct = Math.round((done / lessons.length) * 100);
        return `
          <div class="p-4 rounded-xl bg-paper border border-hairline space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-ink">${esc(tr.title)}</span>
              <span class="font-semibold tabular text-forest">%${pct} (${done}/${lessons.length})</span>
            </div>
            <div class="h-2 rounded-full bg-surface border border-hairline overflow-hidden">
              <div class="h-full bg-forest rounded-full transition-all" style="width:${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    const goalPct = Math.min(100, Math.round((acState.xp / Math.max(50, acState.weeklyGoalXP)) * 100));
    const goalEl = document.getElementById('ac-goal-label');
    const goalBar = document.getElementById('ac-goal-bar');
    const goalInput = document.getElementById('ac-weekly-goal-input');
    if (goalEl) goalEl.textContent = `${acState.xp} / ${acState.weeklyGoalXP} XP (%${goalPct})`;
    if (goalBar) goalBar.style.width = goalPct + '%';
    if (goalInput) goalInput.value = acState.weeklyGoalXP;

    // Certificate preview fields
    const lvl = getLevelInfo(acState.xp);
    const certLvl = document.getElementById('ac-cert-level');
    const certMeta = document.getElementById('ac-cert-meta');
    if (certLvl) certLvl.textContent = `Seviye ${lvl.lvl} · ${lvl.title} (${acState.xp} XP)`;
    if (certMeta) {
      certMeta.textContent = `${acState.completedLessons.length}/${DATA.LESSONS.length} Ders · ${acState.solvedChallenges.length}/${DATA.CODE_CHALLENGES.length} Kod · ${acState.solvedExcel.length}/${DATA.EXCEL_CHALLENGES.length} Excel Pratiği · ${new Date().toLocaleDateString('tr-TR')}`;
    }

    // Chart.js Category Accuracy & Progress
    const ctx = document.getElementById('acSkillChart');
    if (ctx && typeof Chart !== 'undefined') {
      const dark = document.body.classList.contains('theme-evening');
      const tickCol = dark ? '#94A3B8' : '#526075';
      const gridCol = dark ? '#1E293B' : '#E2E8F0';
      const labels = DATA.TRACKS.map(t => t.title.replace('Microsoft ', 'MS ').split('&')[0].trim());
      const vals = DATA.TRACKS.map(t => {
        const ls = DATA.LESSONS.filter(l => l.track === t.id);
        const d = ls.filter(l => acState.completedLessons.includes(l.id)).length;
        return Math.round((d / ls.length) * 100);
      });
      if (!acSkillChart) {
        acSkillChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Müfredat Tamamlama (%)',
              data: vals,
              backgroundColor: ['#4F46E5', '#0D9488', '#2563EB', '#D97706', '#10B981', '#0EA5E9', '#F59E0B', '#6366F1'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { min: 0, max: 100, grid: { color: gridCol }, ticks: { color: tickCol, callback: v => '%' + v } },
              x: { grid: { display: false }, ticks: { color: tickCol } }
            },
            plugins: { legend: { display: false } }
          }
        });
      } else {
        acSkillChart.data.datasets[0].data = vals;
        acSkillChart.options.scales.y.grid.color = gridCol;
        acSkillChart.options.scales.y.ticks.color = tickCol;
        acSkillChart.options.scales.x.ticks.color = tickCol;
        acSkillChart.update();
      }
    }
  }

  const goalInp = document.getElementById('ac-weekly-goal-input');
  if (goalInp) {
    goalInp.addEventListener('change', () => {
      acState.weeklyGoalXP = Math.max(50, Number(goalInp.value) || 300);
      saveAcademyState();
      renderRoadmapView();
      toast('Haftalık öğrenme hedefiniz güncellendi.');
    });
  }

  bindClick('ac-print-cert-btn', () => {
    const name = (document.getElementById('ac-cert-name-input')?.value || 'Pusula Öğrencisi').trim();
    const lvl = getLevelInfo(acState.xp);
    const proOn = isProActive();
    const founder = (window.PUSULA_CONFIG && window.PUSULA_CONFIG.FOUNDER_NAME) || 'Tayfun KAYA';
    const win = window.open('', '_blank', 'width=900,height=650');
    if (!win) { toast('Lütfen açılır pencerelere izin verin.'); return; }
    win.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Pusula Akademi Başarı Belgesi</title>
    <style>
      body{font-family:Georgia,serif;background:#f4f6fa;padding:40px;color:#0f172a;}
      .cert{background:#fff;border:8px double ${proOn ? '#4f46e5' : '#0d9488'};padding:48px;max-width:760px;margin:0 auto;text-align:center;position:relative;}
      h1{font-size:30px;margin:10px 0;color:#0f172a;}
      .badge{display:inline-block;background:${proOn ? '#e0e7ff' : '#ccfbf1'};color:${proOn ? '#4f46e5' : '#0d9488'};padding:6px 14px;border-radius:99px;font-family:sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;}
      .name{font-size:36px;color:#0d9488;margin:22px 0;border-bottom:1px solid #cbd5e1;display:inline-block;padding:0 24px 8px;}
      .meta{font-family:sans-serif;font-size:13px;color:#526075;margin-top:20px;}
      .sign{font-family:sans-serif;font-size:12px;color:#0f172a;margin-top:28px;}
      .wm{font-family:sans-serif;font-size:11px;color:#94a3b8;margin-top:16px;}
    </style></head><body>
      <div class="cert">
        <span class="badge">${proOn ? 'Pusula Pro Resmi Başarı Sertifikası' : 'Pusula Akademi · Katılım Sertifikası'}</span>
        <h1>Yapay Zeka, Yazılım &amp; Microsoft Office</h1>
        <p>Bu belge, aşağıda adı yer alan katılımcının Pusula Akademi interaktif eğitim ve uygulama modüllerindeki başarısını onaylar:</p>
        <div class="name">${esc(name)}</div>
        <p><strong>${esc(`Seviye ${lvl.lvl} — ${lvl.title}`)}</strong> · <strong>${acState.xp} XP</strong></p>
        <p class="meta">Tamamlanan Ders: ${acState.completedLessons.length}/${DATA.LESSONS.length} · Kod Görevi: ${acState.solvedChallenges.length}/${DATA.CODE_CHALLENGES.length} · Excel Pratiği: ${acState.solvedExcel.length}/${DATA.EXCEL_CHALLENGES.length} · Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
        <p class="sign">Platform Kurucusu &amp; Onay: <strong>${esc(founder)}</strong></p>
        ${proOn ? '' : '<p class="wm">Önizleme Sertifikası · Filigransız Resmi Pro Sertifikası için Pusula Pro önerilir.</p>'}
      </div>
      <script>window.onload=function(){window.print();}<\/script>
    </body></html>`);
    win.document.close();
  });

  bindClick('ac-export-json-btn', () => {
    const blob = new Blob([JSON.stringify(acState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pusula-akademi-ilerleme.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 400);
    toast('Akademi ilerlemeniz JSON olarak indirildi.');
  });

  const importInp = document.getElementById('ac-import-json-input');
  if (importInp) {
    importInp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(String(ev.target.result || '{}'));
          if (typeof parsed.xp !== 'number' || !Array.isArray(parsed.completedLessons)) {
            toast('Geçersiz Pusula Akademi yedek dosyası.');
            return;
          }
          acState = { ...defaultAcademyState(), ...parsed };
          saveAcademyState();
          renderLessonsPanel();
          renderChallengeSelect();
          rebuildFlashcardQueue();
          startTechnicalQuiz();
          renderRoadmapView();
          toast('Akademi ilerlemeniz başarıyla geri yüklendi!');
        } catch (err) {
          toast('JSON dosyası okunamadı.');
        }
      };
      reader.readAsText(file, 'UTF-8');
      e.target.value = '';
    });
  }

  bindClick('ac-reset-progress-btn', () => {
    if (!confirm('Tüm ders ilerlemeniz, XP ve sınav istatistikleriniz sıfırlanacak. Emin misiniz?')) return;
    acState = defaultAcademyState();
    saveAcademyState();
    renderLessonsPanel();
    renderChallengeSelect();
    rebuildFlashcardQueue();
    startTechnicalQuiz();
    renderRoadmapView();
    toast('Akademi ilerlemesi sıfırlandı.');
  });

  // =========================================================
  // INITIALIZE ACADEMY & EXPOSE BRIDGE
  // =========================================================
  window.PusulaAcademy = {
    openTab(tabId) {
      switchEduTab(tabId);
    },
    refreshChartsTheme() {
      if (acState.activeTab === 'roadmap') renderRoadmapView();
    },
    renderOverviewWidget: renderOverviewAcademyWidget,
    refreshProLocks() {
      renderLessonsPanel();
      renderOfficeLab();
      initOfficeCopilotStudio();
      renderRoadmapView();
    },
    exportState() {
      return JSON.parse(JSON.stringify(acState));
    },
    importState(parsed) {
      if (!parsed || typeof parsed !== 'object') return;
      acState = {
        ...defaultAcademyState(),
        ...parsed,
        lessonNotes: parsed.lessonNotes || {},
        solvedExcel: Array.isArray(parsed.solvedExcel) ? parsed.solvedExcel : [],
        customCards: Array.isArray(parsed.customCards) ? parsed.customCards : [],
        quizStats: {
          ...defaultAcademyState().quizStats,
          ...(parsed.quizStats || {})
        }
      };
      try { localStorage.setItem(getStorageKey(), JSON.stringify(acState)); } catch (e) {}
      renderAcademyHud();
      renderOverviewAcademyWidget();
      renderLessonsPanel();
      renderOfficeLab();
      renderChallengeSelect();
      rebuildFlashcardQueue();
      startTechnicalQuiz();
      if (acState.activeTab === 'roadmap') renderRoadmapView();
    },
    reloadForUser() {
      acState = loadAcademyState();
      renderAcademyHud();
      renderOverviewAcademyWidget();
      renderLessonsPanel();
      renderOfficeLab();
      renderChallengeSelect();
      rebuildFlashcardQueue();
      startTechnicalQuiz();
      if (acState.activeTab === 'roadmap') renderRoadmapView();
    },
    evalExcelFormula(formula, rows) {
      return evalExcelExpr(formula, rows);
    }
  };

  renderAcademyHud();
  renderOverviewAcademyWidget();
  renderLessonsPanel();
  renderOfficeLab();
  initOfficeCopilotStudio();
  renderChallengeSelect();
  initHtmlStudio();
  analyzePromptQuality();
  rebuildFlashcardQueue();
  startTechnicalQuiz();
  updateTokenizerViz();
  updateTemperatureViz();
  initAlgoVisualizer(true);
  switchEduTab(acState.activeTab || 'lessons');
})();
