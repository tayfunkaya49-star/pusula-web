/**
 * PUSULA PRO — İNTERAKTİF SİNEMATİK TANITIM VİDEOSU OYNATICISI
 * 60 FPS HTML5 Canvas + Web Audio Arka Plan Sesi + 5 Bölüm Zaman Çizelgesi
 */
(function () {
  const TOTAL_SEC = 60;
  const SCENES = [
    {
      id: 0, start: 0, end: 12,
      tag: 'BÖLÜM 1 · AKILLI ÇALIŞMA MERKEZİ',
      title: 'Tek Ekranda Yaşam, Finans ve Üretkenlik',
      subtitle: 'Canlı piyasa verileri, haberler, Pomodoro odak sayacı, bütçe yönetimi ve kişisel AI asistan bir arada.',
      accent: '#2dd4bf',
      bg2: '#0f292e'
    },
    {
      id: 1, start: 12, end: 24,
      tag: 'BÖLÜM 2 · YAZILIM & YAPAY ZEKA AKADEMİSİ',
      title: 'Kod Yaz, Test Et ve LLM Mantığını Gör',
      subtitle: 'Tarayıcıda çalışan JS/HTML laboratuvarı, Prompt Analizörü, 3D bilgi kartları ve sıralama simülatörü.',
      accent: '#818cf8',
      bg2: '#1e1b4b'
    },
    {
      id: 2, start: 24, end: 36,
      tag: 'BÖLÜM 3 · MİCROSOFT OFFICE & AI COPILOT',
      title: 'Sıfırdan VBA & Copilot Uzmanlığına',
      subtitle: 'Excel formül simülatörü (=TOPLA, =DÜŞEYARA, =ÇAPRAZARA), Word kurumsal belgeler ve yönetici sunumları.',
      accent: '#34d399',
      bg2: '#064e3b'
    },
    {
      id: 3, start: 36, end: 48,
      tag: 'BÖLÜM 4 · KİŞİSEL BULUT KASASI',
      title: 'Tüm Verileriniz Hesabınıza Özel Güvende',
      subtitle: 'Notlarınız, ders ilerlemeniz, bütçeniz ve CV veriniz bulut hesabınızda ve şahsi JSON kasanızda saklanır.',
      accent: '#38bdf8',
      bg2: '#0c4a6e'
    },
    {
      id: 4, start: 48, end: 60,
      tag: 'BÖLÜM 5 · PUSULA PRO AYRICALIKLARI',
      title: 'Sınırları Kaldırın: Pro Üyelik Gücü',
      subtitle: 'Uzman VBA/Copilot dersleri, AI Belge & Formül Üreticisi, 12 aylık bütçe projeksiyonu ve filigransız PDF.',
      accent: '#fbbf24',
      bg2: '#451a03'
    }
  ];

  let playing = false;
  let elapsed = 0;
  let lastTs = 0;
  let rafId = null;
  let audioEnabled = false;
  let audioCtx = null;
  let lastChimeScene = -1;

  function playSceneChime(sceneIdx) {
    if (!audioEnabled) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const notes = [261.63, 329.63, 392.00, 440.00, 523.25];
      const base = notes[sceneIdx % notes.length];
      [1, 1.25].forEach((mult, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = base * mult;
        const now = audioCtx.currentTime + i * 0.11;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      });
    } catch (e) {}
  }

  function formatSec(sec) {
    const s = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const r = String(s % 60).padStart(2, '0');
    return `${m}:${r}`;
  }

  function getSceneAt(t) {
    return SCENES.find(s => t >= s.start && t < s.end) || SCENES[SCENES.length - 1];
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function renderFrame() {
    const canvas = document.getElementById('pro-video-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const scene = getSceneAt(elapsed);
    const localT = Math.max(0, elapsed - scene.start);
    const ease = Math.min(1, localT / 0.7);

    // Gradient backdrop
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#09111e');
    grad.addColorStop(1, scene.bg2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle animated grid / glow
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    const step = 36;
    const offset = (elapsed * 14) % step;
    for (let x = -step + offset; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    const rad = ctx.createRadialGradient(W * 0.76, H * 0.34, 10, W * 0.76, H * 0.34, 210);
    rad.addColorStop(0, scene.accent + '44');
    rad.addColorStop(1, 'transparent');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Left text block
    ctx.save();
    ctx.globalAlpha = ease;
    const tx = 28;
    const ty = 42 + (1 - ease) * 10;

    // Badge
    ctx.fillStyle = scene.accent + '25';
    drawRoundedRect(ctx, tx, ty - 14, 250, 22, 11);
    ctx.fill();
    ctx.fillStyle = scene.accent;
    ctx.font = 'bold 10px Inter, system-ui, sans-serif';
    ctx.fillText(scene.tag, tx + 10, ty + 1);

    // Title (wrap manually cleanly)
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 21px "Newsreader", Georgia, serif';
    const words = scene.title.split(' ');
    let line1 = '', line2 = '';
    words.forEach(w => {
      if ((line1 + ' ' + w).trim().length <= 24) line1 = (line1 + ' ' + w).trim();
      else line2 = (line2 + ' ' + w).trim();
    });
    ctx.fillText(line1, tx, ty + 36);
    if (line2) ctx.fillText(line2, tx, ty + 62);

    // Bullets
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px Inter, system-ui, sans-serif';
    const subWords = scene.subtitle.split(' ');
    let sLine = '', sy = ty + (line2 ? 92 : 70);
    subWords.forEach(w => {
      if ((sLine + ' ' + w).length <= 42) sLine += (sLine ? ' ' : '') + w;
      else { ctx.fillText(sLine, tx, sy); sy += 17; sLine = w; }
    });
    if (sLine) ctx.fillText(sLine, tx, sy);
    ctx.restore();

    // Right animated mockup window
    ctx.save();
    const mx = W * 0.56, my = 28, mw = W * 0.4, mh = H - 56;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
    ctx.strokeStyle = scene.accent + '66';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, mx, my, mw, mh, 14);
    ctx.fill();
    ctx.stroke();

    // Window dots
    ['#f87171', '#fbbf24', '#34d399'].forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(mx + 14 + idx * 11, my + 13, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Scene-specific live animation inside mockup
    const pulse = (Math.sin(elapsed * 4) + 1) / 2;
    if (scene.id === 0) {
      // Cockpit KPI bars
      const bars = [0.72, 0.88, 0.56, 0.94];
      bars.forEach((b, idx) => {
        const y = my + 36 + idx * 32;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        drawRoundedRect(ctx, mx + 16, y, mw - 32, 18, 6);
        ctx.fill();
        ctx.fillStyle = scene.accent;
        const animW = (mw - 32) * Math.min(1, b * (0.65 + 0.35 * Math.sin(elapsed * 2 + idx) * 0.25 + 0.3));
        drawRoundedRect(ctx, mx + 16, y, Math.max(20, animW), 18, 6);
        ctx.fill();
      });
    } else if (scene.id === 1) {
      // Code lines typing animation
      const codeLines = [
        'async function aiMentor(prompt) {',
        '  const tokens = tokenize(prompt);',
        '  return await gemini.run(tokens);',
        '} // ✓ 3/3 Test Başarılı (+50 XP)'
      ];
      ctx.font = '10.5px "JetBrains Mono", monospace';
      codeLines.forEach((ln, idx) => {
        ctx.fillStyle = idx === 3 ? '#34d399' : '#e2e8f0';
        const showLen = Math.floor(Math.min(ln.length, Math.max(0, (localT - idx * 0.4) * 28)));
        ctx.fillText(ln.slice(0, showLen), mx + 14, my + 48 + idx * 24);
      });
    } else if (scene.id === 2) {
      // Live Excel Grid animation
      const cells = [
        ['Ürün', 'Satış', 'Prim'],
        ['AI Paket', '18.500', '3.700'],
        ['Office Pro', '24.000', '4.800'],
        ['TOPLA:', '=TOPLA(B2:B3)', '42.500']
      ];
      cells.forEach((row, rIdx) => {
        row.forEach((val, cIdx) => {
          const cx = mx + 14 + cIdx * ((mw - 28) / 3);
          const cy = my + 34 + rIdx * 31;
          ctx.fillStyle = rIdx === 3 ? scene.accent + '30' : 'rgba(255,255,255,0.05)';
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.fillRect(cx, cy, (mw - 32) / 3, 25);
          ctx.strokeRect(cx, cy, (mw - 32) / 3, 25);
          ctx.fillStyle = rIdx === 3 ? scene.accent : '#f1f5f9';
          ctx.font = '9.5px "JetBrains Mono", monospace';
          ctx.fillText(val, cx + 5, cy + 16);
        });
      });
    } else if (scene.id === 3) {
      // Cloud Vault Shield animation
      ctx.strokeStyle = scene.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(mx + mw / 2, my + mh / 2 - 4, 34 + pulse * 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BULUT KASASI', mx + mw / 2, my + mh / 2 - 4);
      ctx.fillStyle = scene.accent;
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('Hesaba Özel Şifreli Kayıt ✓', mx + mw / 2, my + mh / 2 + 16);
      ctx.textAlign = 'left';
    } else {
      // Pro Certificate badge
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, mx + 18, my + 34, mw - 36, mh - 54, 10);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px "Newsreader", serif';
      ctx.fillText('PUSULA PRO SERTİFİKASI', mx + mw / 2, my + 68);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10.5px Inter, sans-serif';
      ctx.fillText('AI + Yazılım + MS Office', mx + mw / 2, my + 92);
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText('✓ Tüm Pro Ayrıcalıklar Açık', mx + mw / 2, my + 124);
      ctx.textAlign = 'left';
    }
    ctx.restore();

    // Update DOM controls
    const progEl = document.getElementById('pro-vid-progress');
    const timeEl = document.getElementById('pro-vid-time');
    const capEl = document.getElementById('pro-vid-caption');
    if (progEl) progEl.style.width = `${Math.min(100, (elapsed / TOTAL_SEC) * 100)}%`;
    if (timeEl) timeEl.textContent = `${formatSec(elapsed)} / ${formatSec(TOTAL_SEC)}`;
    if (capEl) capEl.textContent = scene.subtitle;

    document.querySelectorAll('.pro-vid-chapter').forEach(btn => {
      const idx = Number(btn.dataset.scene);
      const active = idx === scene.id;
      btn.className = `pro-vid-chapter px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
        active ? 'bg-forest text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink'
      }`;
    });

    if (playing && lastChimeScene !== scene.id) {
      lastChimeScene = scene.id;
      playSceneChime(scene.id);
    }
  }

  function tick(ts) {
    if (!playing) return;
    if (lastTs) {
      elapsed += Math.min(0.1, (ts - lastTs) / 1000);
      if (elapsed >= TOTAL_SEC) elapsed = 0;
    }
    lastTs = ts;
    renderFrame();
    rafId = requestAnimationFrame(tick);
  }

  function updatePlayButtonUI() {
    const btn = document.getElementById('pro-vid-play-btn');
    if (btn) btn.textContent = playing ? '❚❚ Duraklat' : '▶ Tanıtımı Oynat';
  }

  function play() {
    if (playing) return;
    playing = true;
    lastTs = 0;
    updatePlayButtonUI();
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    updatePlayButtonUI();
  }

  function initPromoVideo() {
    const cfg = window.PUSULA_CONFIG || {};
    const extBox = document.getElementById('pro-vid-external');
    const canvasBox = document.getElementById('pro-vid-builtin');
    if (cfg.PRO_VIDEO_URL && extBox && canvasBox) {
      const url = cfg.PRO_VIDEO_URL.trim();
      if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com')) {
        extBox.innerHTML = `<iframe src="${url}" class="w-full h-56 rounded-xl border border-hairline" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      } else {
        extBox.innerHTML = `<video src="${url}" controls class="w-full h-56 rounded-xl border border-hairline bg-black"></video>`;
      }
      extBox.classList.remove('hidden');
      canvasBox.classList.add('hidden');
      return;
    }

    const playBtn = document.getElementById('pro-vid-play-btn');
    const restartBtn = document.getElementById('pro-vid-restart-btn');
    const muteBtn = document.getElementById('pro-vid-mute-btn');
    const barWrap = document.getElementById('pro-vid-track');

    if (playBtn) playBtn.addEventListener('click', () => (playing ? pause() : play()));
    if (restartBtn) restartBtn.addEventListener('click', () => { elapsed = 0; lastChimeScene = -1; renderFrame(); play(); });
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        muteBtn.textContent = audioEnabled ? '🔊 Ses Açık' : '🔇 Ses Kapalı';
        if (audioEnabled) playSceneChime(getSceneAt(elapsed).id);
      });
    }
    if (barWrap) {
      barWrap.addEventListener('click', (e) => {
        const rect = barWrap.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        elapsed = ratio * TOTAL_SEC;
        lastChimeScene = -1;
        renderFrame();
      });
    }
    document.querySelectorAll('.pro-vid-chapter').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.scene);
        const s = SCENES[idx];
        if (s) {
          elapsed = s.start;
          lastChimeScene = -1;
          renderFrame();
          play();
        }
      });
    });

    renderFrame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPromoVideo);
  } else {
    initPromoVideo();
  }
  window.PusulaPromoVideo = {
    play,
    pause,
    renderFrame,
    openAndPlay() {
      const modal = document.getElementById('pro-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
      renderFrame();
      play();
    }
  };
})();
