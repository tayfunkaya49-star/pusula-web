/**
 * PUSULA — ANA UYGULAMA MOTORU
 * Canlı Piyasa & Haber, Üretkenlik, Bütçe, Medya, Ofis, Hukuk, Oyunlar & AI Asistan
 */
(function () {
  'use strict';

  // =====================================================
  // GROUNDED BASELINE DATA & LIVE-UPDATING STATE
  // =====================================================
  const MARKET_RATES = {
    USD_TRY: 50.58,
    EUR_TRY: 55.65,
    GOLD_ONS: 3560,
    GOLD_GRAM: 5779.83,
    BTC_USD: 61248,
    BTC_TRY: 3108600,
    BTC_CHG_24H: null
  };

  const BASELINE_NEWS = [
    {
      id: 'n1',
      cat: 'Teknoloji',
      title: 'Yapay Zeka Ajanları ve Tool Calling Standartları Hızla Yaygınlaşıyor',
      summary: 'Modern yazılım ekiplerinde büyük dil modellerini yalnızca sohbet için değil; yapılandırılmış JSON ve araç çağrısı (Tool Calling) ile iş akışlarına bağlama oranı rekor kırdı.',
      source: 'Pusula Teknoloji Özeti',
      date: 'Güncel Rehber',
      url: 'https://www.trthaber.com/bilim-teknoloji/',
      isLive: false
    },
    {
      id: 'n2',
      cat: 'Türkiye',
      title: 'Türkiye’nin "Uygulama COP’u" vizyonu Antalya’da dünya vitrininde',
      summary: 'BM İklim Değişikliği Çerçeve Sözleşmesi’ne taraf ülkelerin katılımıyla Antalya’da düzenlenen COP31 süreci, somut iklim finansmanı ve uygulama başlıklarıyla öne çıkıyor.',
      source: 'TRT Haber',
      date: '20 Kasım 2026',
      url: 'https://www.trthaber.com/haber/gundem/turkiyenin-uygulama-copu-vizyonu-dunya-vitrininde-963930.html',
      isLive: false
    },
    {
      id: 'n3',
      cat: 'Teknoloji',
      title: 'TÜİK: Türkiye’de gençlerde üretken yapay zeka kullanım oranı %63’e ulaştı',
      summary: 'Araştırmaya göre 11-17 yaş grubunda üretken yapay zeka kullanım amaçlarında %88,1 ile eğitim ve öğrenme ilk sırada yer alıyor.',
      source: 'Anadolu Ajansı',
      date: '20 Kasım 2026',
      url: 'https://www.aa.com.tr/tr/bilim-teknoloji/turkiyede-cocuklarin-yuzde-92-7si-internet-kullaniyor-/4131772',
      isLive: false
    },
    {
      id: 'n4',
      cat: 'Ekonomi',
      title: 'Altın, Döviz ve Kripto Piyasalarında Güncel Görünüm',
      summary: 'Küresel merkez bankası beklentileri ve tahvil faizleri doğrultusunda altın, döviz ve kripto varlıklarda canlı fiyat akışları yakından takip ediliyor.',
      source: 'Bloomberg HT',
      date: 'Piyasa Özeti',
      url: 'https://www.bloomberght.com/doviz',
      isLive: false
    },
    {
      id: 'n5',
      cat: 'Dünya',
      title: 'Anthropic, 1,76 trilyon dolar değerlemeyle Nasdaq’ta halka arz edildi',
      summary: 'Küresel teknoloji ve finans piyasalarında yapay zeka altyapı şirketlerine yönelik kurumsal yatırımcı ilgisi güçlü seyrini koruyor.',
      source: 'Cumhuriyet',
      date: '20 Kasım 2026',
      url: 'https://www.cumhuriyet.com.tr/bilim-teknoloji/yapay-zeka-devinden-tarihi-halka-arz-anthropic-1-76-trilyon-dolar-degerlemeyle-borsaya-girdi-2557791',
      isLive: false
    }
  ];

  const SOCIAL_INITIAL = [
    { id: 's1', cat: 'Sahne', title: 'Lucia Di Lammermoor (Opera)', place: 'İstanbul Atatürk Kültür Merkezi (AKM)', date: 'Hafta Sonu Programı', tag: 'Biletli', url: 'https://akmistanbul.gov.tr/tr/etkinlikler', source: 'AKM İstanbul', joined: false },
    { id: 's2', cat: 'Sergi', title: '“Mutluluk Garanti!” Çağdaş Sanat Sergisi', place: 'Taksim Sanat, Beyoğlu', date: 'Güncel Sergi', tag: 'Ücretsiz', url: 'https://kultur.istanbul/', source: 'Kültür.İstanbul', joined: false },
    { id: 's3', cat: 'Sergi', title: 'Dalí Cybernetics — Dijital Deneyim Sergisi', place: 'Dijital Deneyim Merkezi, Sütlüce', date: 'Her Gün · 10:00 - 19:00', tag: 'Satışta', url: 'https://kultur.istanbul/etkinlikler/sergiler/', source: 'Kültür.İstanbul', joined: false },
    { id: 's4', cat: 'Sergi', title: 'Frida Kahlo’nun Günlükleri Sergisi', place: 'Akasya Kültür Sanat (AKS)', date: 'Kasım Takvimi · 11:00', tag: 'Biletli', url: 'https://kultur.istanbul/', source: 'Kültür.İstanbul', joined: false }
  ];

  const MEDIA_INITIAL = [
    { id: 'm1', type: 'Film', title: 'Past Lives (Başka Bir Hayatta)', genre: 'Dram', duration: '106 dk', desc: 'Çocukluk bağları, seçimler ve zaman üzerine sakin, derin bir anlatı.', saved: true },
    { id: 'm2', type: 'Film', title: 'Perfect Days (Mükemmel Günler)', genre: 'Yaşam / Dram', duration: '124 dk', desc: 'Tokyo’da gündelik ritüellerin, müziğin ve küçük anların huzuru.', saved: false },
    { id: 'm3', type: 'Dizi', title: 'Severance', genre: 'Bilimkurgu / Gerilim', duration: '2 Sezon', desc: 'İş ve özel hayat hafızası ayrılmış çalışanların gizemli dünyası.', saved: true },
    { id: 'm4', type: 'Dizi', title: 'The Bear', genre: 'Dram / Mutfak', duration: '3 Sezon', desc: 'Chicago’da bir aile restoranını dönüştürme mücadelesi ve insan ilişkileri.', saved: false },
    { id: 'm5', type: 'Belgesel', title: 'AlphaGo', genre: 'Yapay Zeka & Bilim', duration: '90 dk', desc: 'Derin pekiştirmeli öğrenmenin Go dünya şampiyonuna karşı tarihi mücadelesi.', saved: true },
    { id: 'm6', type: 'Belgesel', title: 'Abstract: The Art of Design', genre: 'Tasarım & Mimari', duration: '45 dk / bölüm', desc: 'Dünyanın önde gelen mimar, tipograf ve tasarımcılarının yaratım süreçleri.', saved: false }
  ];

  const MUSIC_PRESETS = [
    { id: 'coffee', title: 'Sabah Kahvesi — Sıcak Akorlar', desc: 'Yumuşak Rhodes akorları ile sakin çalışma ve kodlama atmosferi.', freqs: [261.63, 329.63, 392.00, 493.88], tempo: 2400 },
    { id: 'focus', title: 'Derin Odak — Minimal Piyano', desc: 'Zihni yormayan, düzenli aralıklı yumuşak piyano tınıları.', freqs: [220.00, 261.63, 329.63, 392.00], tempo: 2800 },
    { id: 'evening', title: 'Akşam Sakinliği — Sıcak Pad', desc: 'Günün yorgunluğunu hafifleten düşük frekanslı armonik akış.', freqs: [174.61, 220.00, 261.63, 329.63], tempo: 3400 },
    { id: 'rain', title: 'Yağmurlu İstanbul — Ortam', desc: 'Yalnızca dingin yağmur ve hafif rüzgar tınısı.', freqs: [196.00, 246.94, 293.66], tempo: 4000 },
    { id: 'gamma', title: 'Pro 40Hz Analiz — Derin Odak', desc: 'Yoğun kodlama ve Excel analizi için yüksek berraklıkta frekans akışı.', freqs: [240.00, 280.00, 320.00, 400.00], tempo: 1850, isPro: true },
    { id: 'alpha', title: 'Pro Alpha Akışı — Sınav Hazırlık', desc: 'Okuma ve bilgi kartı tekrarı için ritmik alfa odak akorları.', freqs: [196.00, 246.94, 293.66, 392.00], tempo: 2200, isPro: true }
  ];

  const DOC_TEMPLATES = {
    meeting: {
      title: 'Toplantı Notu ve Karar Özeti',
      body: `Tarih: ${new Date().toLocaleDateString('tr-TR')}\nKatılımcılar: \n\n1. Gündem Maddeleri\n- Haftalık hedeflerin gözden geçirilmesi\n- Öncelikli teknik ve ürün aksiyonları\n\n2. Alınan Kararlar\n- \n\n3. Sonraki Adımlar ve Sorumlular\n- `
    },
    weekly: {
      title: 'Haftalık Yaşam ve Çalışma Planı',
      body: 'Haftanın Ana Odağı:\n\nPazartesi - Salı:\n- \n\nÇarşamba - Perşembe:\n- \n\nCuma - Hafta Sonu:\n- Dinlenme, eğitim tekrarı ve kişisel zaman'
    },
    problem: {
      title: 'Problem Çözme ve Karar Analizi',
      body: 'Tanımlanan Sorun:\n\nKök Nedenler:\n1. \n2. \n\nAlternatif Çözüm Önerileri:\n- Seçenek A:\n- Seçenek B:\n\nSeçilen Aksiyon ve Hedef Tarih:\n'
    },
    proposal: {
      title: 'Proje ve İş Birliği Teklifi',
      body: '1. Özet ve Amaç\nBu belge, önerilen çalışmanın kapsamını, teslimat takvimini ve beklenen çıktıları özetler.\n\n2. Kapsam ve Teslimatlar\n- Faz 1: Planlama ve Tasarım\n- Faz 2: Uygulama ve Yayına Alma\n\n3. Bütçe ve Zaman Planı\n- Hedef Başlangıç:\n- Tahmini Süre:\n'
    },
    blank: { title: 'Adsız Belge', body: '' }
  };

  const state = {
    activeView: 'overview',
    isPro: false,
    eveningTheme: false,
    newsList: JSON.parse(JSON.stringify(BASELINE_NEWS)),
    habits: [
      { id: 'h1', label: '20 dk Teknik Okuma', done: true, streak: 6 },
      { id: 'h2', label: '1 AI/Kod Modülü', done: false, streak: 4 },
      { id: 'h3', label: '30 dk Yürüyüş', done: false, streak: 5 },
      { id: 'h4', label: 'Bütçe & Su Takibi', done: true, streak: 8 }
    ],
    monthlyIncome: 65000,
    subscriptions: [
      { id: 'sub1', name: 'Fiber İnternet', cat: 'Fatura', price: 650, active: true },
      { id: 'sub2', name: 'Spor Salonu Üyeliği', cat: 'Sağlık', price: 1200, active: true },
      { id: 'sub3', name: 'Film & Dizi Platformu', cat: 'Eğlence', price: 320, active: true },
      { id: 'sub4', name: 'AI & Bulut Araçları', cat: 'Yazılım', price: 450, active: true }
    ],
    tasks: [
      { id: 't1', title: 'Pusula Akademi: LLM & Prompt Mühendisliği dersini tamamla', cat: 'İş', done: false },
      { id: 't2', title: 'Kod Laboratuvarında 2 JavaScript algoritması çöz', cat: 'İş', done: false },
      { id: 't3', title: 'Haftalık bütçe tablosunu Ofis Stüdyosunda güncelle', cat: 'Kişisel', done: true },
      { id: 't4', title: 'AKM hafta sonu programını kontrol et', cat: 'Sosyal', done: false }
    ],
    taskFilter: 'all',
    ideas: [
      { id: 'i1', problem: 'Günlük öğrenme düzeni kurmak', options: 'Sabah 25 dk Pomodoro ile 1 Akademi dersi + 5 bilgi kartı tekrar etmek', step: 'Akademi sekmesinden ilk dersi aç' },
      { id: 'i2', problem: 'Hafta sonu dinlenme ve sosyal denge', options: 'Cumartesi kültür-sanat etkinliği, Pazar doğa yürüyüşü ve kitap', step: 'Sosyal rehberden bir sergi seçip plana ekle' }
    ],
    savedNewsIds: new Set(['n1']),
    newsCat: 'Tümü',
    newsQuery: '',
    media: JSON.parse(JSON.stringify(MEDIA_INITIAL)),
    mediaCat: 'Tümü',
    social: JSON.parse(JSON.stringify(SOCIAL_INITIAL)),
    socialCat: 'Tümü',
    playlists: [
      { id: 'p1', name: 'TRT Radyo 3 (Klasik & Caz)', url: 'https://www.trtdinle.com/radyolar/radyo-3' },
      { id: 'p2', name: 'Lo-Fi Çalışma Akışı', url: 'https://www.youtube.com/results?search_query=lofi+study+music' }
    ],
    sheetRows: [
      { id: 'r1', item: 'Aylık Mutfak & Market', cat: 'Yaşam', qty: 1, price: 14500 },
      { id: 'r2', item: 'Ulaşım ve Yakıt', cat: 'Ulaşım', qty: 1, price: 4200 },
      { id: 'r3', item: 'Kültür, Kitap & Etkinlik', cat: 'Sosyal', qty: 3, price: 650 },
      { id: 'r4', item: 'Dijital & AI Abonelikler', cat: 'Teknoloji', qty: 2, price: 450 }
    ],
    btcSeriesLabels: ['5 Kas', '14 Kas', '17 Kas', '19 Kas'],
    btcSeriesValues: [3808003, 3461366, 3271524, 3108600],
    hiddenWidgets: [],
    audioPlaying: false,
    activePresetId: 'coffee',
    rainEnabled: false,
    volume: 0.55,
    pomoTotalSec: 25 * 60,
    pomoRemainingSec: 25 * 60,
    pomoRunning: false,
    pomoInterval: null
  };

  // =====================================================
  // USER-ISOLATED LOCAL & CLOUD PERSISTENCE ENGINE
  // =====================================================
  const WORKSPACE_STORAGE_KEY = 'pusula_workspace_v2';
  let activeUserKeySuffix = '';

  function hashUserEmail(email) {
    let h = 5381;
    const s = String(email || '').trim().toLowerCase();
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
    return 'u_' + (h >>> 0).toString(36);
  }

  window.pusulaGetUserKey = (base) => (activeUserKeySuffix ? `${base}_${activeUserKeySuffix}` : base);
  window.pusulaIsPro = () => !!state.isPro;

  function buildWorkspacePayload() {
    return {
      habits: state.habits,
      tasks: state.tasks,
      ideas: state.ideas,
      subscriptions: state.subscriptions,
      monthlyIncome: state.monthlyIncome,
      sheetRows: state.sheetRows,
      playlists: state.playlists,
      savedNewsIds: Array.from(state.savedNewsIds),
      eveningTheme: state.eveningTheme,
      hiddenWidgets: state.hiddenWidgets,
      cvExecStyle: !!state.cvExecStyle
    };
  }

  function saveWorkspaceLocal() {
    try {
      const key = window.pusulaGetUserKey(WORKSPACE_STORAGE_KEY);
      localStorage.setItem(key, JSON.stringify(buildWorkspacePayload()));
    } catch (e) {}
  }

  function loadWorkspaceLocal() {
    try {
      const spKey = window.pusulaGetUserKey('pusula_scratchpad');
      const savedNote = localStorage.getItem(spKey);
      if (savedNote !== null) document.getElementById('quick-scratchpad').value = savedNote;
      if (localStorage.getItem('pusula_pro') === '1' || localStorage.getItem(window.pusulaGetUserKey('pusula_pro')) === '1') {
        state.isPro = true;
      }

      const raw = localStorage.getItem(window.pusulaGetUserKey(WORKSPACE_STORAGE_KEY)) || localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (Array.isArray(p.habits)) state.habits = p.habits;
      if (Array.isArray(p.tasks)) state.tasks = p.tasks;
      if (Array.isArray(p.ideas)) state.ideas = p.ideas;
      if (Array.isArray(p.subscriptions)) state.subscriptions = p.subscriptions;
      if (typeof p.monthlyIncome === 'number') state.monthlyIncome = p.monthlyIncome;
      if (Array.isArray(p.sheetRows)) state.sheetRows = p.sheetRows;
      if (Array.isArray(p.playlists)) state.playlists = p.playlists;
      if (Array.isArray(p.savedNewsIds)) state.savedNewsIds = new Set(p.savedNewsIds);
      if (Array.isArray(p.hiddenWidgets)) state.hiddenWidgets = p.hiddenWidgets;
      if (typeof p.eveningTheme === 'boolean') state.eveningTheme = p.eveningTheme;
      if (typeof p.cvExecStyle === 'boolean') state.cvExecStyle = p.cvExecStyle;
    } catch (e) {}
  }

  loadWorkspaceLocal();

  // =====================================================
  // HELPERS & TOAST
  // =====================================================
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
  }
  window.pusulaToast = showToast;

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
  }

  function formatTR(num, dec = 0) {
    return Number(num || 0).toLocaleString('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }

  function flashEl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('flash-update');
    void el.offsetWidth;
    el.classList.add('flash-update');
  }

  function timeStampHMS() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':');
  }

  function triggerDownload(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  // =====================================================
  // AUTOMATIC LIVE DATA POLLING (MARKETS + NEWS)
  // =====================================================
  async function fetchLiveMarkets() {
    let updatedAny = false;
    const ts = timeStampHMS();

    // 1. Live FX (USD/TRY & EUR/TRY)
    try {
      const fxRes = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
      if (fxRes.ok) {
        const fxData = await fxRes.json();
        if (fxData && fxData.rates && fxData.rates.TRY && fxData.rates.EUR) {
          const usdTry = Number(fxData.rates.TRY);
          const eurTry = usdTry / Number(fxData.rates.EUR);
          if (usdTry > 1 && eurTry > 1) {
            MARKET_RATES.USD_TRY = usdTry;
            MARKET_RATES.EUR_TRY = eurTry;
            document.getElementById('ov-usd-val').textContent = formatTR(usdTry, 2) + ' ₺';
            document.getElementById('mkt-usd-val').textContent = formatTR(usdTry, 2) + ' ₺';
            document.getElementById('mkt-eur-val').textContent = formatTR(eurTry, 2) + ' ₺';
            document.getElementById('ov-usd-chg').textContent = 'Canlı · ' + ts;
            flashEl('ov-usd-val');
            flashEl('card-usd');
            flashEl('card-eur');
            updatedAny = true;
          }
        }
      }
    } catch (err) {}

    // 2. Live Bitcoin & Spot Gold Proxy (PAXGUSDT ~ 1 troy oz Gold) via Binance Public API
    try {
      const [btcUsdRes, btcTryRes, paxgRes] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT', { cache: 'no-store' }),
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCTRY', { cache: 'no-store' }),
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=PAXGUSDT', { cache: 'no-store' })
      ]);

      if (btcUsdRes.ok) {
        const dUsd = await btcUsdRes.json();
        const priceUsd = Number(dUsd.lastPrice);
        const chgPct = Number(dUsd.priceChangePercent);
        if (priceUsd > 1000) {
          MARKET_RATES.BTC_USD = priceUsd;
          MARKET_RATES.BTC_CHG_24H = chgPct;
          const sign = chgPct >= 0 ? '+' : '';
          const chgText = `${sign}%${formatTR(chgPct, 2)} · 24s`;
          document.getElementById('ov-btc-val').textContent = '$' + formatTR(priceUsd, 0);
          document.getElementById('ov-btc-chg').textContent = chgText;
          document.getElementById('ov-btc-chg').className = 'text-xs tabular mt-0.5 ' + (chgPct >= 0 ? 'text-forest' : 'text-terracotta');
          document.getElementById('mkt-btc-val').textContent = '$' + formatTR(priceUsd, 0);
          document.getElementById('mkt-btc-badge').textContent = chgText;
          document.getElementById('mkt-btc-badge').className = 'text-xs font-medium tabular ' + (chgPct >= 0 ? 'text-forest' : 'text-terracotta');
          flashEl('ov-btc-val');
          flashEl('card-btc');
          updatedAny = true;
        }
      }

      if (btcTryRes.ok) {
        const dTry = await btcTryRes.json();
        const priceTry = Number(dTry.lastPrice);
        if (priceTry > 10000) {
          MARKET_RATES.BTC_TRY = priceTry;
          document.getElementById('mkt-btc-sub').textContent = `Canlı: ${formatTR(priceTry, 0)} ₺ · ${ts}`;
          if (state.btcSeriesLabels[state.btcSeriesLabels.length - 1] !== ts) {
            state.btcSeriesLabels.push(ts);
            state.btcSeriesValues.push(Math.round(priceTry));
            if (state.btcSeriesLabels.length > 8) {
              state.btcSeriesLabels.splice(4, 1);
              state.btcSeriesValues.splice(4, 1);
            }
            if (btcChartInstance) {
              btcChartInstance.data.labels = state.btcSeriesLabels;
              btcChartInstance.data.datasets[0].data = state.btcSeriesValues;
              btcChartInstance.update('none');
            }
          }
          updatedAny = true;
        }
      }

      if (paxgRes.ok) {
        const dGold = await paxgRes.json();
        const onsUsd = Number(dGold.lastPrice);
        const goldChg = Number(dGold.priceChangePercent);
        if (onsUsd > 500) {
          MARKET_RATES.GOLD_ONS = onsUsd;
          MARKET_RATES.GOLD_GRAM = (onsUsd * MARKET_RATES.USD_TRY) / 31.1034768;
          const sign = goldChg >= 0 ? '+' : '';
          const badgeTxt = `${sign}%${formatTR(goldChg, 2)} · Spot`;
          document.getElementById('mkt-ons-val').textContent = '$' + formatTR(onsUsd, 0);
          document.getElementById('mkt-ons-badge').textContent = badgeTxt;
          document.getElementById('mkt-ons-badge').className = 'text-xs font-medium tabular ' + (goldChg >= 0 ? 'text-forest' : 'text-terracotta');
          document.getElementById('mkt-gold-val').textContent = formatTR(MARKET_RATES.GOLD_GRAM, 2) + ' ₺';
          document.getElementById('mkt-gold-badge').textContent = 'Canlı (Hesaplanan)';
          document.getElementById('ov-gold-val').textContent = formatTR(MARKET_RATES.GOLD_GRAM, 0) + ' ₺';
          document.getElementById('ov-gold-chg').textContent = `${sign}%${formatTR(goldChg, 2)} · Spot`;
          document.getElementById('ov-gold-chg').className = 'text-xs tabular mt-0.5 ' + (goldChg >= 0 ? 'text-forest' : 'text-terracotta');
          updatedAny = true;
        }
      }
    } catch (err) {}

    computePortfolio();
    const statusMsg = updatedAny
      ? `Canlı akış · Son yenileme ${ts}`
      : `Baz veriler aktif · Otomatik kontrol sürüyor (${ts})`;
    document.getElementById('live-status-text').textContent = statusMsg;
    document.getElementById('strip-sync-time').textContent = updatedAny ? `Canlı · ${ts}` : `Otomatik · ${ts}`;
    document.getElementById('markets-sync-status').textContent = statusMsg;
  }

  async function fetchLiveNews() {
    const ts = timeStampHMS();
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.trthaber.com%2Fsondakika.rss', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'ok' && Array.isArray(data.items) && data.items.length) {
          const liveItems = data.items.slice(0, 6).map((item, idx) => {
            const cleanSummary = String(item.description || '').replace(/<[^>]*>/g, '').trim().slice(0, 210);
            return {
              id: 'live_' + idx + '_' + (item.pubDate || '').slice(-5),
              cat: 'Son Dakika',
              title: item.title || 'Güncel Haber',
              summary: cleanSummary || 'Haberin ayrıntıları için kaynak bağlantısını açabilirsiniz.',
              source: 'TRT Haber (Canlı)',
              date: 'Canlı · ' + ts,
              url: item.link || 'https://www.trthaber.com/',
              isLive: true
            };
          });
          state.newsList = [...liveItems, ...BASELINE_NEWS];
          document.getElementById('news-sync-status').textContent = `Canlı haber akışı güncellendi · ${ts} (60 sn'de bir yenilenir)`;
          renderNews();
          return;
        }
      }
    } catch (err) {}
    document.getElementById('news-sync-status').textContent = `Otomatik kontrol · ${ts} (60 sn'de bir yenilenir)`;
  }

  // =====================================================
  // NAVIGATION, THEME & CLOCK
  // =====================================================
  const VIEW_META = {
    overview: 'Genel Bakış',
    academy: 'Pusula Akademi',
    assistant: 'Pusula AI Asistan',
    daily: 'Günlük Plan & Pomodoro',
    news: 'Haberler & Gündem',
    markets: 'Piyasalar & Analiz',
    budget: 'Bütçe & Abonelikler',
    simulator: 'Finansal Simülatör',
    games: 'Zihin Molası & Oyunlar',
    radio: 'Canlı Radyolar & MP3',
    tv: 'Canlı TV Kanalları',
    music: 'Müzik & Odak',
    media: 'TV, Film & Kültür',
    social: 'Sosyal & Şehir',
    templates: 'Hazır Şablonlar Merkezi',
    law: 'T.C. Kanun & Mevzuat',
    office: 'Ofis, Excel & PDF',
    toolbox: 'Akıllı Araç Kutusu',
    mobile: 'Mobil Uygulama'
  };

  let tvInitialized = false;

  function switchView(viewId) {
    if (!VIEW_META[viewId]) return;
    if (state.activeView === 'tv' && viewId !== 'tv' && !document.pictureInPictureElement) {
      stopTvStreams();
    }
    state.activeView = viewId;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    document.getElementById('breadcrumb-title').textContent = VIEW_META[viewId];
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewId === 'markets') setTimeout(initOrUpdateMarketCharts, 50);
    if (viewId === 'simulator') setTimeout(updateCompoundSim, 50);
    if (viewId === 'academy' && window.PusulaAcademy) window.PusulaAcademy.refreshChartsTheme();
    if (viewId === 'tv' && !tvInitialized) {
      tvInitialized = true;
      playTvChannel(TV_CHANNELS[0]);
    }
  }

  function closeMobileMenu() {
    document.getElementById('sidebar').classList.add('-translate-x-full');
    document.getElementById('sidebar-backdrop').classList.add('hidden');
  }

  document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('-translate-x-full');
    document.getElementById('sidebar-backdrop').classList.remove('hidden');
  });
  document.getElementById('mobile-close-btn').addEventListener('click', closeMobileMenu);
  document.getElementById('sidebar-backdrop').addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.jump));
  });
  document.addEventListener('click', (e) => {
    const eduJump = e.target.closest('[data-jump-edu]');
    if (eduJump) {
      switchView('academy');
      if (window.PusulaAcademy) window.PusulaAcademy.openTab(eduJump.dataset.jumpEdu);
    }
  });

  function applyThemeUI() {
    document.body.classList.toggle('theme-evening', state.eveningTheme);
    const themeIcon = document.getElementById('theme-toggle-icon');
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', state.eveningTheme ? 'sun' : 'moon');
      if (window.lucide) window.lucide.createIcons();
    }
    updateChartsTheme();
  }

  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    state.eveningTheme = !state.eveningTheme;
    saveWorkspaceLocal();
    applyThemeUI();
    showToast(state.eveningTheme ? 'Gece Stüdyo teması açıldı.' : 'Gündüz Stüdyo temasına geçildi.');
  });

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('sidebar-clock').textContent = hh + ':' + mm;
    document.getElementById('sidebar-date').textContent = dateStr;
    const ovDate = document.getElementById('overview-date-label');
    if (ovDate) ovDate.textContent = dateStr;
    const h = now.getHours();
    const greet = h < 12 ? 'Günaydın' : h < 18 ? 'İyi günler' : 'İyi akşamlar';
    document.getElementById('greeting-heading').textContent = greet + ', bugün odağınızda ne var?';
  }
  updateClock();
  setInterval(updateClock, 30000);

  document.getElementById('quick-scratchpad').addEventListener('input', (e) => {
    try { localStorage.setItem(window.pusulaGetUserKey('pusula_scratchpad'), e.target.value); } catch (err) {}
    document.getElementById('scratchpad-status').textContent = 'Kaydedildi ✓';
  });

  // =====================================================
  // HABITS & ROUTINES
  // =====================================================
  function renderHabits() {
    const doneCount = state.habits.filter(h => h.done).length;
    document.getElementById('habit-progress-label').textContent = `${doneCount} / ${state.habits.length} tamamlandı`;
    const grid = document.getElementById('overview-habits-grid');
    grid.innerHTML = state.habits.map(h => `
      <button type="button" data-toggle-habit="${h.id}" class="p-3 rounded-xl border text-left transition ${h.done ? 'bg-forestLight border-forest/40' : 'bg-paper border-hairline hover:border-ink/30'}">
        <div class="flex items-center justify-between gap-1">
          <span class="text-xs font-medium ${h.done ? 'text-forest' : 'text-ink'}">${escapeHtml(h.label)}</span>
          <i data-lucide="${h.done ? 'check-circle-2' : 'circle'}" class="w-4 h-4 shrink-0 ${h.done ? 'text-forest' : 'text-muted'}"></i>
        </div>
        <p class="text-[11px] text-muted mt-1.5 tabular">${h.streak} gün seri</p>
      </button>
    `).join('');
    lucide.createIcons();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle-habit]');
    if (!btn) return;
    const h = state.habits.find(x => x.id === btn.dataset.toggleHabit);
    if (!h) return;
    h.done = !h.done;
    h.streak = h.done ? h.streak + 1 : Math.max(0, h.streak - 1);
    saveWorkspaceLocal();
    scheduleCloudSync();
    renderHabits();
  });

  // =====================================================
  // BUDGET & SUBSCRIPTIONS
  // =====================================================
  function renderSubscriptions() {
    const activeSubs = state.subscriptions.filter(s => s.active);
    const activeMonthly = activeSubs.reduce((a, b) => a + b.price, 0);
    const savedYearly = state.subscriptions.filter(s => !s.active).reduce((a, b) => a + b.price * 12, 0);
    const income = Math.max(0, Number(state.monthlyIncome) || 0);
    const remaining = income - activeMonthly;
    const subRatio = income > 0 ? Math.min(100, Math.round((activeMonthly / income) * 100)) : 0;

    document.getElementById('ov-sub-monthly').textContent = formatTR(activeMonthly, 0) + ' ₺';
    document.getElementById('ov-sub-yearly').textContent = formatTR(activeMonthly * 12, 0) + ' ₺ / yıl';
    document.getElementById('sub-total-monthly').textContent = formatTR(activeMonthly, 0) + ' ₺';
    document.getElementById('sub-total-yearly').textContent = formatTR(activeMonthly * 12, 0) + ' ₺';
    document.getElementById('sub-total-saved').textContent = formatTR(savedYearly, 0) + ' ₺';

    const incInput = document.getElementById('budget-income-input');
    if (incInput && Number(incInput.value) !== state.monthlyIncome) incInput.value = state.monthlyIncome;
    const remEl = document.getElementById('budget-remaining-val');
    const ratioEl = document.getElementById('budget-ratio-label');
    if (remEl) {
      remEl.textContent = formatTR(remaining, 0) + ' ₺';
      remEl.className = 'font-editorial text-3xl tabular mt-1 ' + (remaining >= 0 ? 'text-forest' : 'text-terracotta');
    }
    if (ratioEl) ratioEl.textContent = `Sabit giderler gelirinizin %${subRatio}’ini oluşturuyor`;

    // Category Breakdown Bar
    const catTotals = {};
    activeSubs.forEach(s => { catTotals[s.cat] = (catTotals[s.cat] || 0) + s.price; });
    const breakdownBox = document.getElementById('budget-cat-breakdown');
    if (breakdownBox) {
      const cats = Object.entries(catTotals);
      breakdownBox.innerHTML = cats.length ? cats.map(([cat, val]) => {
        const pct = activeMonthly > 0 ? Math.round((val / activeMonthly) * 100) : 0;
        return `
          <div class="space-y-1 text-xs">
            <div class="flex justify-between"><span class="text-ink font-medium">${escapeHtml(cat)}</span><span class="text-muted tabular">${formatTR(val, 0)} ₺ (%${pct})</span></div>
            <div class="h-1.5 rounded-full bg-paper overflow-hidden"><div class="h-full bg-forest rounded-full" style="width:${pct}%"></div></div>
          </div>
        `;
      }).join('') : '<p class="text-xs text-muted">Aktif abonelik bulunmuyor.</p>';
    }

    const list = document.getElementById('subs-list');
    if (!state.subscriptions.length) {
      list.innerHTML = '<p class="py-6 text-center text-xs text-muted">Henüz kayıtlı abonelik yok.</p>';
    } else {
      list.innerHTML = state.subscriptions.map(s => `
        <div class="py-3.5 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <input type="checkbox" data-toggle-sub="${s.id}" ${s.active ? 'checked' : ''} class="accent-forest w-4 h-4 shrink-0" />
            <div class="min-w-0">
              <p class="text-sm font-medium truncate ${s.active ? 'text-ink' : 'line-through text-muted'}">${escapeHtml(s.name)}</p>
              <p class="text-xs text-muted">${escapeHtml(s.cat)} · Yıllık ${formatTR(s.price * 12, 0)} ₺</p>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span class="text-sm font-medium tabular ${s.active ? 'text-ink' : 'text-muted'}">${formatTR(s.price, 0)} ₺/ay</span>
            <button type="button" data-del-sub="${s.id}" class="text-muted hover:text-terracotta p-1" aria-label="Sil">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    const proAdvSum = document.getElementById('budget-pro-summary');
    const proAdvBtn = document.getElementById('budget-pro-unlock-btn');
    if (proAdvSum && proAdvBtn) {
      if (!state.isPro) {
        proAdvBtn.classList.remove('hidden');
        proAdvSum.innerHTML = 'Pusula Pro aktif edildiğinde en yüksek gider kaleminiz, olası yıllık tasarruf potansiyeliniz ve <strong class="text-ink">12 aylık net birikim projeksiyonunuz</strong> otomatik hesaplanır.';
      } else {
        proAdvBtn.classList.add('hidden');
        const sorted = activeSubs.slice().sort((a, b) => b.price - a.price);
        const topSub = sorted[0];
        const yearlyNetSavings = Math.max(0, remaining) * 12;
        const optGain = topSub ? Math.round(topSub.price * 12) : 0;
        proAdvSum.innerHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div class="p-3 rounded-xl bg-paper border border-hairline">
              <p class="text-[11px] text-muted">12 Aylık Kalan Net Birikim</p>
              <p class="font-editorial text-lg text-forest tabular mt-0.5">${formatTR(yearlyNetSavings, 0)} ₺</p>
            </div>
            <div class="p-3 rounded-xl bg-paper border border-hairline">
              <p class="text-[11px] text-muted">En Yüksek Sabit Kalem</p>
              <p class="font-semibold text-ink truncate mt-0.5">${topSub ? `${escapeHtml(topSub.name)} (${formatTR(topSub.price, 0)} ₺/ay)` : 'Yok'}</p>
            </div>
            <div class="p-3 rounded-xl bg-paper border border-hairline">
              <p class="text-[11px] text-muted">En Büyük Kalem İptal Tasarrufu</p>
              <p class="font-editorial text-lg text-plum tabular mt-0.5">+${formatTR(optGain, 0)} ₺/yıl</p>
            </div>
          </div>
        `;
      }
    }
    lucide.createIcons();
  }

  const budgetIncInp = document.getElementById('budget-income-input');
  if (budgetIncInp) {
    budgetIncInp.addEventListener('input', (e) => {
      state.monthlyIncome = Math.max(0, Number(e.target.value) || 0);
      saveWorkspaceLocal();
      renderSubscriptions();
    });
  }

  document.addEventListener('change', (e) => {
    const id = e.target.dataset.toggleSub;
    if (!id) return;
    const s = state.subscriptions.find(x => x.id === id);
    if (s) {
      s.active = !s.active;
      saveWorkspaceLocal();
      scheduleCloudSync();
      renderSubscriptions();
    }
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del-sub]');
    if (btn) {
      state.subscriptions = state.subscriptions.filter(x => x.id !== btn.dataset.delSub);
      saveWorkspaceLocal();
      scheduleCloudSync();
      renderSubscriptions();
      showToast('Abonelik listeden kaldırıldı.');
    }
  });

  document.getElementById('sub-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('sub-name').value.trim();
    const cat = document.getElementById('sub-cat').value;
    const price = Number(document.getElementById('sub-price').value) || 0;
    if (!name || price <= 0) return;
    state.subscriptions.unshift({ id: 'sub' + Date.now(), name, cat, price, active: true });
    e.target.reset();
    saveWorkspaceLocal();
    renderSubscriptions();
    showToast('Abonelik eklendi.');
  });

  // =====================================================
  // TASKS & IDEAS (OVERVIEW + DAILY)
  // =====================================================
  function renderTasks() {
    const pendingCount = state.tasks.filter(t => !t.done).length;
    const doneCount = state.tasks.length - pendingCount;
    document.getElementById('badge-tasks').textContent = pendingCount;
    document.getElementById('overview-task-stat').textContent = doneCount + ' / ' + state.tasks.length;

    const ovList = document.getElementById('overview-tasks-list');
    ovList.innerHTML = state.tasks.slice(0, 5).map(t => `
      <label class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-paper cursor-pointer">
        <input type="checkbox" data-toggle-task="${t.id}" ${t.done ? 'checked' : ''} class="mt-0.5 accent-forest w-4 h-4 rounded" />
        <span class="text-sm leading-snug ${t.done ? 'line-through text-muted' : 'text-ink'}">${escapeHtml(t.title)}</span>
      </label>
    `).join('');

    const filtered = state.taskFilter === 'all' ? state.tasks : state.tasks.filter(t => t.cat === state.taskFilter);
    const dailyList = document.getElementById('daily-tasks-list');
    if (!filtered.length) {
      dailyList.innerHTML = '<p class="py-6 text-center text-xs text-muted">Bu kategoride henüz görev yok.</p>';
      return;
    }
    dailyList.innerHTML = filtered.map(t => `
      <div class="py-3 flex items-center justify-between gap-3">
        <label class="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
          <input type="checkbox" data-toggle-task="${t.id}" ${t.done ? 'checked' : ''} class="accent-forest w-4 h-4 shrink-0" />
          <span class="text-sm truncate ${t.done ? 'line-through text-muted' : 'text-ink'}">${escapeHtml(t.title)}</span>
        </label>
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-[11px] px-2 py-0.5 rounded bg-paper border border-hairline text-muted">${escapeHtml(t.cat)}</span>
          <button type="button" data-delete-task="${t.id}" class="p-1 text-muted hover:text-terracotta" aria-label="Görevi sil">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  document.addEventListener('change', (e) => {
    const id = e.target.dataset.toggleTask;
    if (!id) return;
    const t = state.tasks.find(x => x.id === id);
    if (t) {
      t.done = !t.done;
      saveWorkspaceLocal();
      scheduleCloudSync();
      renderTasks();
    }
  });

  document.addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-task]');
    if (delBtn) {
      state.tasks = state.tasks.filter(x => x.id !== delBtn.dataset.deleteTask);
      saveWorkspaceLocal();
      scheduleCloudSync();
      renderTasks();
      showToast('Görev silindi.');
    }
  });

  document.getElementById('overview-quick-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = document.getElementById('overview-quick-task-input');
    const val = inp.value.trim();
    if (!val) return;
    state.tasks.unshift({ id: 't' + Date.now(), title: val, cat: 'Kişisel', done: false });
    inp.value = '';
    saveWorkspaceLocal();
    renderTasks();
    showToast('Görev bugünkü plana eklendi.');
  });

  document.getElementById('daily-task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleEl = document.getElementById('daily-task-title');
    const catEl = document.getElementById('daily-task-cat');
    const val = titleEl.value.trim();
    if (!val) return;
    state.tasks.unshift({ id: 't' + Date.now(), title: val, cat: catEl.value, done: false });
    titleEl.value = '';
    saveWorkspaceLocal();
    renderTasks();
    showToast('Yeni aktivite eklendi.');
  });

  document.querySelectorAll('.task-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.taskFilter = btn.dataset.taskFilter;
      document.querySelectorAll('.task-filter-btn').forEach(b => {
        const active = b.dataset.taskFilter === state.taskFilter;
        b.className = 'task-filter-btn px-2.5 py-1 rounded-md ' + (active ? 'bg-ink text-paper font-medium' : 'bg-stonewarm text-muted hover:text-ink');
      });
      renderTasks();
    });
  });

  function renderIdeas() {
    const grid = document.getElementById('ideas-grid');
    grid.innerHTML = state.ideas.map(item => `
      <div class="p-4 rounded-xl bg-paper border border-hairline flex flex-col justify-between space-y-3">
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-editorial text-lg font-medium text-ink">${escapeHtml(item.problem)}</h4>
          <button type="button" data-delete-idea="${item.id}" class="text-muted hover:text-terracotta p-1" aria-label="Fikri sil">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>
        <div class="space-y-1.5 text-xs">
          <p class="text-muted"><strong class="text-ink font-medium">Yaklaşım:</strong> ${escapeHtml(item.options)}</p>
          <p class="text-forest"><strong class="font-medium">İlk Adım:</strong> ${escapeHtml(item.step)}</p>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  document.getElementById('idea-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = document.getElementById('idea-problem').value.trim();
    const o = document.getElementById('idea-options').value.trim();
    const s = document.getElementById('idea-step').value.trim();
    if (!p || !o || !s) return;
    state.ideas.unshift({ id: 'i' + Date.now(), problem: p, options: o, step: s });
    e.target.reset();
    saveWorkspaceLocal();
    renderIdeas();
    showToast('Fikir panoya kaydedildi.');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-delete-idea]');
    if (btn) {
      state.ideas = state.ideas.filter(x => x.id !== btn.dataset.deleteIdea);
      saveWorkspaceLocal();
      scheduleCloudSync();
      renderIdeas();
    }
  });

  // Pomodoro Timer
  function updatePomoDisplay() {
    const m = String(Math.floor(state.pomoRemainingSec / 60)).padStart(2, '0');
    const s = String(state.pomoRemainingSec % 60).padStart(2, '0');
    document.getElementById('pomo-display').textContent = m + ':' + s;
  }

  function stopPomo() {
    clearInterval(state.pomoInterval);
    state.pomoInterval = null;
    state.pomoRunning = false;
    document.getElementById('pomo-start-btn').textContent = 'Başlat';
  }

  document.getElementById('pomo-start-btn').addEventListener('click', () => {
    if (state.pomoRunning) {
      stopPomo();
    } else {
      state.pomoRunning = true;
      document.getElementById('pomo-start-btn').textContent = 'Duraklat';
      state.pomoInterval = setInterval(() => {
        if (state.pomoRemainingSec > 0) {
          state.pomoRemainingSec--;
          updatePomoDisplay();
        } else {
          stopPomo();
          showToast('Odak süresi tamamlandı! Kısa bir mola verebilirsiniz.');
        }
      }, 1000);
    }
  });

  document.getElementById('pomo-reset-btn').addEventListener('click', () => {
    stopPomo();
    state.pomoRemainingSec = state.pomoTotalSec;
    updatePomoDisplay();
  });

  document.querySelectorAll('.pomo-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      stopPomo();
      const mins = Number(btn.dataset.pomoMin);
      state.pomoTotalSec = mins * 60;
      state.pomoRemainingSec = state.pomoTotalSec;
      document.getElementById('pomo-mode-label').textContent = btn.dataset.pomoLabel;
      document.querySelectorAll('.pomo-preset-btn').forEach(b => {
        b.className = 'pomo-preset-btn px-3 py-1.5 rounded-lg text-xs border border-hairline ' +
          (b === btn ? 'bg-stonewarm font-medium text-ink' : 'bg-surface text-muted hover:text-ink');
      });
      updatePomoDisplay();
    });
  });

  // =====================================================
  // NEWS & WORLD AGENDA
  // =====================================================
  function renderNews() {
    document.getElementById('saved-news-count').textContent = state.savedNewsIds.size;

    const ovNews = document.getElementById('overview-news-list');
    ovNews.innerHTML = state.newsList.slice(0, 3).map(n => `
      <div class="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-[11px] text-muted">
            <span class="${n.isLive ? 'text-terracotta' : 'text-forest'} font-medium">${escapeHtml(n.cat)}</span>
            <span>·</span>
            <span>${escapeHtml(n.source)}</span>
          </div>
          <button type="button" data-read-news="${escapeHtml(n.id)}" class="text-left font-editorial text-lg leading-snug text-ink hover:text-forest transition">
            ${escapeHtml(n.title)}
          </button>
        </div>
        <button type="button" data-save-news="${escapeHtml(n.id)}" class="p-1.5 text-muted hover:text-terracotta shrink-0" aria-label="Haberi kaydet">
          <i data-lucide="bookmark" class="w-4 h-4 ${state.savedNewsIds.has(n.id) ? 'fill-current text-terracotta' : ''}"></i>
        </button>
      </div>
    `).join('');

    const q = state.newsQuery.toLowerCase();
    const list = state.newsList.filter(n => {
      const matchCat = state.newsCat === 'Tümü' ? true :
                       state.newsCat === 'Kayıtlı' ? state.savedNewsIds.has(n.id) :
                       n.cat === state.newsCat;
      const matchQ = !q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    const grid = document.getElementById('news-grid');
    if (!list.length) {
      grid.innerHTML = '<div class="col-span-full editorial-card p-8 text-center text-sm text-muted">Aramanıza uygun haber bulunamadı.</div>';
      lucide.createIcons();
      return;
    }
    grid.innerHTML = list.map(n => `
      <article class="editorial-card p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-muted">
            <span class="px-2 py-0.5 rounded ${n.isLive ? 'bg-terracottaLight text-terracotta' : 'bg-forestLight text-forest'} font-medium">${escapeHtml(n.cat)}</span>
            <span>${escapeHtml(n.date)}</span>
          </div>
          <h3 class="font-editorial text-xl leading-snug text-ink">${escapeHtml(n.title)}</h3>
          <p class="text-sm text-muted leading-relaxed">${escapeHtml(n.summary)}</p>
        </div>
        <div class="pt-3 border-t border-hairline flex items-center justify-between text-xs">
          <a href="${escapeHtml(n.url)}" target="_blank" rel="noopener noreferrer" class="text-muted hover:text-forest underline">${escapeHtml(n.source)}</a>
          <div class="flex items-center gap-3">
            <button type="button" data-read-news="${escapeHtml(n.id)}" class="text-forest font-medium hover:underline">Özet Oku</button>
            <button type="button" data-save-news="${escapeHtml(n.id)}" class="text-muted hover:text-terracotta flex items-center gap-1">
              <i data-lucide="bookmark" class="w-3.5 h-3.5 ${state.savedNewsIds.has(n.id) ? 'fill-current text-terracotta' : ''}"></i>
              <span>${state.savedNewsIds.has(n.id) ? 'Kayıtlı' : 'Kaydet'}</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');
    lucide.createIcons();
  }

  document.querySelectorAll('.news-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.newsCat = btn.dataset.newsCat;
      document.querySelectorAll('.news-cat-btn').forEach(b => {
        const active = b.dataset.newsCat === state.newsCat;
        b.className = 'news-cat-btn px-3.5 py-1.5 rounded-full text-xs font-medium ' +
          (active ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      renderNews();
    });
  });

  document.getElementById('news-search').addEventListener('input', (e) => {
    state.newsQuery = e.target.value;
    renderNews();
  });

  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('[data-save-news]');
    if (saveBtn) {
      const id = saveBtn.dataset.saveNews;
      if (state.savedNewsIds.has(id)) {
        state.savedNewsIds.delete(id);
        showToast('Okuma listesinden çıkarıldı.');
      } else {
        state.savedNewsIds.add(id);
        showToast('Okuma listesine eklendi.');
      }
      saveWorkspaceLocal();
      renderNews();
    }
    const readBtn = e.target.closest('[data-read-news]');
    if (readBtn) {
      const n = state.newsList.find(x => x.id === readBtn.dataset.readNews);
      if (!n) return;
      document.getElementById('modal-news-cat').textContent = n.cat + ' · ' + n.date;
      document.getElementById('modal-news-title').textContent = n.title;
      document.getElementById('modal-news-body').textContent = n.summary;
      document.getElementById('modal-news-source').textContent = 'Kaynak: ' + n.source;
      document.getElementById('modal-news-link').href = n.url;
      const modal = document.getElementById('news-modal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  });

  document.getElementById('close-news-modal').addEventListener('click', () => {
    const modal = document.getElementById('news-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  // =====================================================
  // MARKETS CHARTS & PORTFOLIO CALCULATOR
  // =====================================================
  let btcChartInstance = null;
  let portfolioChartInstance = null;
  let compoundChartInstance = null;

  function computePortfolio() {
    const vTry = Math.max(0, Number(document.getElementById('calc-try').value) || 0);
    const vUsd = Math.max(0, Number(document.getElementById('calc-usd').value) || 0) * MARKET_RATES.USD_TRY;
    const vEur = Math.max(0, Number(document.getElementById('calc-eur').value) || 0) * MARKET_RATES.EUR_TRY;
    const vGold = Math.max(0, Number(document.getElementById('calc-gold').value) || 0) * MARKET_RATES.GOLD_GRAM;
    const totalTry = vTry + vUsd + vEur + vGold;
    const totalUsd = MARKET_RATES.USD_TRY > 0 ? totalTry / MARKET_RATES.USD_TRY : 0;

    document.getElementById('calc-total-try').textContent = formatTR(totalTry, 0) + ' ₺';
    document.getElementById('calc-total-usd').textContent = '≈ $' + formatTR(totalUsd, 0);

    if (portfolioChartInstance) {
      portfolioChartInstance.data.datasets[0].data = [vTry, vUsd, vEur, vGold];
      portfolioChartInstance.update();
    }
    return [vTry, vUsd, vEur, vGold];
  }

  ['calc-try', 'calc-usd', 'calc-eur', 'calc-gold'].forEach(id => {
    document.getElementById(id).addEventListener('input', computePortfolio);
  });

  function updateChartsTheme() {
    const dark = state.eveningTheme;
    const gridCol = dark ? '#1E293B' : '#E2E8F0';
    const tickCol = dark ? '#94A3B8' : '#526075';

    if (btcChartInstance) {
      btcChartInstance.options.scales.y.grid.color = gridCol;
      btcChartInstance.options.scales.y.ticks.color = tickCol;
      btcChartInstance.options.scales.x.ticks.color = tickCol;
      btcChartInstance.update();
    }
    if (portfolioChartInstance) {
      portfolioChartInstance.options.plugins.legend.labels.color = tickCol;
      portfolioChartInstance.update();
    }
    if (compoundChartInstance) {
      compoundChartInstance.options.scales.y.grid.color = gridCol;
      compoundChartInstance.options.scales.y.ticks.color = tickCol;
      compoundChartInstance.options.scales.x.ticks.color = tickCol;
      compoundChartInstance.options.plugins.legend.labels.color = tickCol;
      compoundChartInstance.update();
    }
    if (window.PusulaAcademy) window.PusulaAcademy.refreshChartsTheme();
  }

  function initOrUpdateMarketCharts() {
    const dark = state.eveningTheme;
    const gridCol = dark ? '#1E293B' : '#E2E8F0';
    const tickCol = dark ? '#94A3B8' : '#526075';

    const btcCtx = document.getElementById('btcTrendChart');
    if (btcCtx && !btcChartInstance && typeof Chart !== 'undefined') {
      btcChartInstance = new Chart(btcCtx, {
        type: 'line',
        data: {
          labels: state.btcSeriesLabels,
          datasets: [{
            label: 'BTC / TRY (₺)',
            data: state.btcSeriesValues,
            borderColor: '#0D9488',
            backgroundColor: 'rgba(13, 148, 136, 0.12)',
            borderWidth: 2,
            fill: true,
            tension: 0.25,
            pointBackgroundColor: '#0D9488',
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: gridCol }, ticks: { color: tickCol, callback: (v) => (v / 1000000).toFixed(2) + 'M ₺' } },
            x: { grid: { display: false }, ticks: { color: tickCol } }
          }
        }
      });
    }

    const portCtx = document.getElementById('portfolioChart');
    const vals = computePortfolio();
    if (portCtx && !portfolioChartInstance && typeof Chart !== 'undefined') {
      portfolioChartInstance = new Chart(portCtx, {
        type: 'doughnut',
        data: {
          labels: ['Nakit TL', 'Dolar', 'Euro', 'Gram Altın'],
          datasets: [{
            data: vals,
            backgroundColor: ['#0D9488', '#4F46E5', '#2563EB', '#D97706'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '66%',
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 10, color: tickCol, font: { size: 11 } } }
          }
        }
      });
    }
  }

  // =====================================================
  // WEB AUDIO API AMBIENT & FOCUS MUSIC ENGINE
  // =====================================================
  let audioCtx = null;
  let masterGain = null;
  let chordInterval = null;
  let rainNode = null;
  let rainGain = null;

  function ensureAudioCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new Ctx();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = state.volume * 0.28;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function playWarmNote(freq, durSec) {
    if (!audioCtx || !state.audioPlaying) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + durSec + 0.05);
  }

  function startRainNoise() {
    ensureAudioCtx();
    if (rainNode) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8;
    }
    rainNode = audioCtx.createBufferSource();
    rainNode.buffer = buffer;
    rainNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;

    rainGain = audioCtx.createGain();
    rainGain.gain.value = 0.25;

    rainNode.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(masterGain);
    rainNode.start();
  }

  function stopRainNoise() {
    if (rainNode) {
      try { rainNode.stop(); } catch (e) {}
      rainNode.disconnect();
      rainNode = null;
    }
  }

  function startPresetLoop() {
    clearInterval(chordInterval);
    const preset = MUSIC_PRESETS.find(p => p.id === state.activePresetId) || MUSIC_PRESETS[0];
    if (preset.id === 'rain') {
      state.rainEnabled = true;
      startRainNoise();
      updateRainButton();
    }
    let step = 0;
    const tick = () => {
      if (!state.audioPlaying) return;
      const f1 = preset.freqs[step % preset.freqs.length];
      const f2 = preset.freqs[(step + 2) % preset.freqs.length] * 0.5;
      playWarmNote(f1, preset.tempo / 1000 + 0.8);
      playWarmNote(f2, preset.tempo / 1000 + 1.0);
      step++;
    };
    tick();
    chordInterval = setInterval(tick, preset.tempo);
  }

  function updateAudioUI() {
    const preset = MUSIC_PRESETS.find(p => p.id === state.activePresetId) || MUSIC_PRESETS[0];
    document.getElementById('music-active-title').textContent = preset.title;
    document.getElementById('music-active-desc').textContent = preset.desc;
    document.getElementById('overview-track-name').textContent = preset.title;
    document.getElementById('music-play-text').textContent = state.audioPlaying ? 'Duraklat' : 'Dinlemeye Başla';
    document.getElementById('top-audio-label').textContent = state.audioPlaying ? 'Çalıyor...' : 'Odak Müziği';
    document.getElementById('sidebar-audio-dot').classList.toggle('hidden', !state.audioPlaying);

    document.querySelectorAll('.audio-play-icon').forEach(ic => {
      ic.setAttribute('data-lucide', state.audioPlaying ? 'pause' : 'play');
    });
    renderMusicPresets();
    lucide.createIcons();
  }

  function toggleAudio() {
    ensureAudioCtx();
    state.audioPlaying = !state.audioPlaying;
    if (state.audioPlaying) {
      startPresetLoop();
      if (state.rainEnabled) startRainNoise();
      showToast('Odak müziği başlatıldı.');
    } else {
      clearInterval(chordInterval);
      stopRainNoise();
    }
    updateAudioUI();
    updateFloatingMediaBar();
  }

  function updateRainButton() {
    const btn = document.getElementById('music-rain-toggle');
    btn.innerHTML = `<i data-lucide="cloud-rain" class="w-3.5 h-3.5 text-forest"></i> Yağmur Sesi: ${state.rainEnabled ? 'Açık' : 'Kapalı'}`;
    btn.classList.toggle('border-forest', state.rainEnabled);
    lucide.createIcons();
  }

  document.getElementById('music-rain-toggle').addEventListener('click', () => {
    state.rainEnabled = !state.rainEnabled;
    if (state.audioPlaying) {
      if (state.rainEnabled) startRainNoise();
      else stopRainNoise();
    }
    updateRainButton();
  });

  document.getElementById('music-volume').addEventListener('input', (e) => {
    state.volume = Number(e.target.value) / 100;
    if (masterGain && audioCtx) {
      masterGain.gain.setTargetAtTime(state.volume * 0.28, audioCtx.currentTime, 0.08);
    }
  });

  document.getElementById('top-audio-toggle').addEventListener('click', toggleAudio);
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="toggle-audio"]')) toggleAudio();
  });

  function renderMusicPresets() {
    const grid = document.getElementById('music-presets-grid');
    grid.innerHTML = MUSIC_PRESETS.map(p => {
      const active = p.id === state.activePresetId;
      const locked = !!p.isPro && !state.isPro;
      return `
        <button type="button" data-select-preset="${p.id}" class="text-left p-3.5 rounded-xl border transition ${active ? 'border-forest bg-forestLight' : 'border-hairline bg-paper hover:border-ink/30'}">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-medium text-ink">${escapeHtml(p.title.split('—')[0].trim())}</span>
            <div class="flex items-center gap-1.5">
              ${p.isPro ? `<span class="pro-badge-pill">${locked ? '🔒 PRO' : 'PRO ✓'}</span>` : ''}
              ${active && state.audioPlaying ? '<span class="text-[10px] uppercase tracking-wider text-forest font-semibold">Çalıyor</span>' : ''}
            </div>
          </div>
          <p class="text-xs text-muted mt-1 line-clamp-1">${escapeHtml(p.desc)}</p>
        </button>
      `;
    }).join('');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-select-preset]');
    if (!btn) return;
    const picked = MUSIC_PRESETS.find(p => p.id === btn.dataset.selectPreset);
    if (picked && picked.isPro && !state.isPro) {
      openProModal(true);
      showToast('Pro Derin Odak frekansları Pusula Pro üyelerine özeldir.');
      return;
    }
    state.activePresetId = btn.dataset.selectPreset;
    if (!state.audioPlaying) {
      toggleAudio();
    } else {
      startPresetLoop();
      updateAudioUI();
    }
  });

  function renderPlaylists() {
    const el = document.getElementById('custom-playlists-list');
    el.innerHTML = state.playlists.map(p => `
      <div class="py-2.5 flex items-center justify-between gap-2 text-sm">
        <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="text-ink hover:text-forest font-medium truncate flex items-center gap-2">
          <i data-lucide="external-link" class="w-3.5 h-3.5 text-muted shrink-0"></i>
          <span class="truncate">${escapeHtml(p.name)}</span>
        </a>
        <button type="button" data-del-playlist="${p.id}" class="text-muted hover:text-terracotta p-1" aria-label="Sil">
          <i data-lucide="x" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons();
  }

  document.getElementById('playlist-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('playlist-name').value.trim();
    const url = document.getElementById('playlist-url').value.trim();
    if (!name || !url) return;
    state.playlists.unshift({ id: 'p' + Date.now(), name, url });
    e.target.reset();
    saveWorkspaceLocal();
    renderPlaylists();
    showToast('Çalma listesi eklendi.');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del-playlist]');
    if (btn) {
      state.playlists = state.playlists.filter(x => x.id !== btn.dataset.delPlaylist);
      saveWorkspaceLocal();
      renderPlaylists();
    }
  });

  // =====================================================
  // TV, FILM & CULTURE
  // =====================================================
  function renderMedia() {
    const savedCount = state.media.filter(m => m.saved).length;
    document.getElementById('watchlist-count').textContent = savedCount;

    const list = state.media.filter(m => {
      if (state.mediaCat === 'Tümü') return true;
      if (state.mediaCat === 'Listem') return m.saved;
      return m.type === state.mediaCat;
    });

    const grid = document.getElementById('media-grid');
    if (!list.length) {
      grid.innerHTML = '<div class="col-span-full editorial-card p-8 text-center text-sm text-muted">Bu filtrede henüz içerik yok.</div>';
      return;
    }
    grid.innerHTML = list.map(m => `
      <div class="editorial-card p-5 flex flex-col justify-between space-y-3">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-muted">
            <span class="px-2 py-0.5 rounded bg-paper border border-hairline font-medium text-ink">${escapeHtml(m.type)}</span>
            <span>${escapeHtml(m.duration)}</span>
          </div>
          <h4 class="font-editorial text-xl text-ink pt-1">${escapeHtml(m.title)}</h4>
          <p class="text-xs text-muted leading-relaxed">${escapeHtml(m.desc)}</p>
        </div>
        <div class="pt-3 border-t border-hairline flex items-center justify-between text-xs">
          <span class="text-muted">${escapeHtml(m.genre)}</span>
          <button type="button" data-toggle-media="${m.id}" class="font-medium flex items-center gap-1 ${m.saved ? 'text-terracotta' : 'text-forest hover:underline'}">
            <i data-lucide="${m.saved ? 'check' : 'plus'}" class="w-3.5 h-3.5"></i>
            <span>${m.saved ? 'Listemde' : 'Listeye Ekle'}</span>
          </button>
        </div>
      </div>
    `).join('');
    lucide.createIcons();
  }

  document.querySelectorAll('.media-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mediaCat = btn.dataset.mediaCat;
      document.querySelectorAll('.media-cat-btn').forEach(b => {
        const active = b.dataset.mediaCat === state.mediaCat;
        b.className = 'media-cat-btn px-3.5 py-1.5 rounded-full text-xs font-medium ' +
          (active ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      renderMedia();
    });
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-toggle-media]');
    if (!btn) return;
    const item = state.media.find(m => m.id === btn.dataset.toggleMedia);
    if (item) {
      item.saved = !item.saved;
      renderMedia();
      showToast(item.saved ? 'İzlenecekler listesine eklendi.' : 'Listeden çıkarıldı.');
    }
  });

  document.getElementById('random-pick-btn').addEventListener('click', () => {
    const pick = state.media[Math.floor(Math.random() * state.media.length)];
    document.getElementById('featured-pick-badge').textContent = 'Bu Akşam İçin Seçildi';
    document.getElementById('featured-pick-title').textContent = pick.title;
    document.getElementById('featured-pick-desc').textContent = pick.desc;
    document.getElementById('featured-pick-meta').textContent = `${pick.type} · ${pick.genre} · ${pick.duration}`;
    showToast('Yeni akşam önerisi seçildi: ' + pick.title);
  });

  document.getElementById('media-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('media-add-title').value.trim();
    const type = document.getElementById('media-add-type').value;
    if (!title) return;
    state.media.unshift({ id: 'm' + Date.now(), type, title, genre: 'Kişisel Seçki', duration: 'Kendi Listem', desc: 'Kişisel izleme listenize eklendi.', saved: true });
    document.getElementById('media-add-title').value = '';
    renderMedia();
    showToast('İzleme listenize eklendi.');
  });

  // =====================================================
  // SOCIAL & CITY LIFE
  // =====================================================
  function renderSocial() {
    const list = state.social.filter(s => state.socialCat === 'Tümü' || s.cat === state.socialCat);
    const container = document.getElementById('social-list');
    container.innerHTML = list.map(s => `
      <div class="editorial-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2 text-xs">
            <span class="px-2 py-0.5 rounded bg-paper border border-hairline text-ink font-medium">${escapeHtml(s.cat)}</span>
            <span class="text-forest font-medium">${escapeHtml(s.tag)}</span>
          </div>
          <h3 class="font-editorial text-xl text-ink">${escapeHtml(s.title)}</h3>
          <p class="text-xs text-muted">${escapeHtml(s.place)} · ${escapeHtml(s.date)}</p>
          ${s.url ? `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="inline-block text-[11px] text-forest underline pt-0.5">${escapeHtml(s.source)} →</a>` : ''}
        </div>
        <button type="button" data-join-social="${s.id}" class="px-4 py-2 rounded-lg text-xs font-medium shrink-0 transition ${s.joined ? 'bg-forestLight text-forest border border-forest/30' : 'bg-ink text-paper hover:bg-ink/90'}">
          ${s.joined ? 'Planıma Eklendi ✓' : '+ Planıma Ekle'}
        </button>
      </div>
    `).join('');

    const ovSocial = document.getElementById('overview-social-list');
    if (ovSocial) {
      ovSocial.innerHTML = state.social.slice(0, 2).map((s, idx) => `
        <div class="flex items-start justify-between gap-2 ${idx > 0 ? 'pt-2 border-t border-hairline' : ''}">
          <div>
            <p class="font-medium text-ink">${escapeHtml(s.title)}</p>
            <p class="text-xs text-muted">${escapeHtml(s.place)} · ${escapeHtml(s.tag)}</p>
          </div>
          <span class="text-[11px] px-2 py-0.5 rounded bg-forestLight text-forest font-medium shrink-0">${escapeHtml(s.cat)}</span>
        </div>
      `).join('');
    }
  }

  document.querySelectorAll('.social-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.socialCat = btn.dataset.socialCat;
      document.querySelectorAll('.social-cat-btn').forEach(b => {
        const active = b.dataset.socialCat === state.socialCat;
        b.className = 'social-cat-btn px-3 py-1.5 rounded-full text-xs font-medium ' +
          (active ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted');
      });
      renderSocial();
    });
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-join-social]');
    if (!btn) return;
    const item = state.social.find(x => x.id === btn.dataset.joinSocial);
    if (!item) return;
    item.joined = !item.joined;
    if (item.joined) {
      state.tasks.unshift({ id: 'ts' + Date.now(), title: item.title + ' (' + item.date + ')', cat: 'Sosyal', done: false });
      saveWorkspaceLocal();
      renderTasks();
      showToast('Etkinlik günlük planınıza aktarıldı.');
    }
    renderSocial();
  });

  document.getElementById('social-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('social-title').value.trim();
    const place = document.getElementById('social-place').value.trim();
    const date = document.getElementById('social-date').value.trim();
    if (!title || !place || !date) return;
    state.social.unshift({ id: 's' + Date.now(), cat: 'Kişisel', title, place, date, tag: 'Kişisel Plan', url: '', source: '', joined: true });
    state.tasks.unshift({ id: 'ts' + Date.now(), title: title + ' — ' + place, cat: 'Sosyal', done: false });
    e.target.reset();
    saveWorkspaceLocal();
    renderSocial();
    renderTasks();
    showToast('Sosyal planınız eklendi.');
  });

  // =====================================================
  // OFFICE STUDIO: EXCEL / CSV & DOCUMENT / PDF
  // =====================================================
  function renderSheet() {
    const tbody = document.getElementById('spreadsheet-body');
    let sumQty = 0;
    let sumTotal = 0;
    let sumPrice = 0;

    tbody.innerHTML = state.sheetRows.map((r, idx) => {
      const lineTotal = (Number(r.qty) || 0) * (Number(r.price) || 0);
      sumQty += Number(r.qty) || 0;
      sumTotal += lineTotal;
      sumPrice += Number(r.price) || 0;
      return `
        <tr>
          <td class="px-2 py-1.5"><input type="text" data-sheet-idx="${idx}" data-sheet-field="item" value="${escapeHtml(r.item)}" class="w-full bg-transparent px-1.5 py-1 rounded focus:bg-paper focus:outline-none" /></td>
          <td class="px-2 py-1.5"><input type="text" data-sheet-idx="${idx}" data-sheet-field="cat" value="${escapeHtml(r.cat)}" class="w-full bg-transparent px-1.5 py-1 rounded focus:bg-paper focus:outline-none" /></td>
          <td class="px-2 py-1.5"><input type="number" min="0" data-sheet-idx="${idx}" data-sheet-field="qty" value="${r.qty}" class="w-20 ml-auto block text-right tabular bg-transparent px-1.5 py-1 rounded focus:bg-paper focus:outline-none" /></td>
          <td class="px-2 py-1.5"><input type="number" min="0" data-sheet-idx="${idx}" data-sheet-field="price" value="${r.price}" class="w-28 ml-auto block text-right tabular bg-transparent px-1.5 py-1 rounded focus:bg-paper focus:outline-none" /></td>
          <td class="px-3 py-1.5 text-right tabular font-medium text-ink">${formatTR(lineTotal, 0)} ₺</td>
          <td class="px-2 py-1.5 text-center">
            <button type="button" data-del-row="${idx}" class="text-muted hover:text-terracotta p-1" aria-label="Satırı sil">
              <i data-lucide="x" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const avgPrice = state.sheetRows.length ? sumPrice / state.sheetRows.length : 0;
    document.getElementById('sheet-sum-qty').textContent = formatTR(sumQty, 0);
    document.getElementById('sheet-avg-price').textContent = 'Ort: ' + formatTR(avgPrice, 0) + ' ₺';
    document.getElementById('sheet-sum-total').textContent = formatTR(sumTotal, 0) + ' ₺';
    lucide.createIcons();
  }

  document.getElementById('spreadsheet-body').addEventListener('change', (e) => {
    const idx = e.target.dataset.sheetIdx;
    const field = e.target.dataset.sheetField;
    if (idx === undefined || !field) return;
    const row = state.sheetRows[Number(idx)];
    if (!row) return;
    row[field] = (field === 'qty' || field === 'price') ? Number(e.target.value) || 0 : e.target.value;
    saveWorkspaceLocal();
    renderSheet();
  });

  document.getElementById('spreadsheet-body').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-del-row]');
    if (!btn) return;
    state.sheetRows.splice(Number(btn.dataset.delRow), 1);
    saveWorkspaceLocal();
    renderSheet();
  });

  document.getElementById('excel-add-row-btn').addEventListener('click', () => {
    state.sheetRows.push({ id: 'r' + Date.now(), item: 'Yeni Kalem', cat: 'Genel', qty: 1, price: 0 });
    saveWorkspaceLocal();
    renderSheet();
  });

  function exportSheetCSV() {
    const header = 'Kalem;Kategori;Adet;Birim Tutar (TL);Toplam (TL)';
    const rows = state.sheetRows.map(r => `"${String(r.item).replace(/"/g, '""')}";"${String(r.cat).replace(/"/g, '""')}";${r.qty};${r.price};${(Number(r.qty) || 0) * (Number(r.price) || 0)}`);
    triggerDownload('pusula-tablo.csv', '\uFEFF' + [header, ...rows].join('\n'), 'text/csv;charset=utf-8;');
    showToast('CSV dosyası indirildi.');
  }

  function exportSheetXLS() {
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body><table border="1"><tr><th>Kalem</th><th>Kategori</th><th>Adet</th><th>Birim Tutar (TL)</th><th>Toplam (TL)</th></tr>';
    let grand = 0;
    state.sheetRows.forEach(r => {
      const t = (Number(r.qty) || 0) * (Number(r.price) || 0);
      grand += t;
      html += `<tr><td>${escapeHtml(r.item)}</td><td>${escapeHtml(r.cat)}</td><td>${r.qty}</td><td>${r.price}</td><td>${t}</td></tr>`;
    });
    html += `<tr><td colspan="4"><strong>GENEL TOPLAM</strong></td><td><strong>${grand}</strong></td></tr></table></body></html>`;
    triggerDownload('pusula-tablo.xls', html, 'application/vnd.ms-excel;charset=utf-8;');
    showToast('Excel (.xls) dosyası indirildi.');
  }

  document.getElementById('excel-download-csv-btn').addEventListener('click', exportSheetCSV);
  document.getElementById('excel-download-xls-btn').addEventListener('click', exportSheetXLS);

  document.getElementById('csv-import-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = String(ev.target.result).split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { showToast('CSV dosyasında yeterli satır bulunamadı.'); return; }
      const sep = lines[0].includes(';') ? ';' : ',';
      const parsed = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(sep).map(c => c.replace(/^"|"$/g, '').trim());
        if (cols[0]) {
          parsed.push({ id: 'r' + Date.now() + i, item: cols[0], cat: cols[1] || 'Genel', qty: Number(cols[2]) || 1, price: Number(cols[3]) || 0 });
        }
      }
      if (parsed.length) {
        state.sheetRows = parsed;
        saveWorkspaceLocal();
        renderSheet();
        showToast(parsed.length + ' satır CSV dosyasından yüklendi.');
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  });

  function updateDocWordCount() {
    const txt = document.getElementById('doc-body-input').value.trim();
    const words = txt ? txt.split(/\s+/).length : 0;
    document.getElementById('doc-word-count').textContent = `${words} kelime · ${txt.length} karakter`;
  }

  function applyDocTemplate(key) {
    const tpl = DOC_TEMPLATES[key] || DOC_TEMPLATES.blank;
    document.getElementById('doc-title-input').value = tpl.title;
    document.getElementById('doc-body-input').value = tpl.body;
    updateDocWordCount();
  }

  document.getElementById('doc-template-select').addEventListener('change', (e) => applyDocTemplate(e.target.value));
  document.getElementById('doc-body-input').addEventListener('input', updateDocWordCount);

  document.getElementById('doc-download-word-btn').addEventListener('click', () => {
    const title = document.getElementById('doc-title-input').value || 'Pusula Belgesi';
    const body = document.getElementById('doc-body-input').value.replace(/\n/g, '<br>');
    const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head><body style="font-family:Georgia,serif;line-height:1.6;"><h1>${escapeHtml(title)}</h1><p>${body}</p></body></html>`;
    triggerDownload('pusula-belge.doc', docHtml, 'application/msword;charset=utf-8;');
    showToast('Word (.doc) belgesi indirildi.');
  });

  document.getElementById('doc-print-pdf-btn').addEventListener('click', () => {
    document.body.classList.add('printing-doc');
    window.print();
    setTimeout(() => document.body.classList.remove('printing-doc'), 300);
  });

  document.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (!actionBtn) return;
    const act = actionBtn.dataset.action;
    if (act === 'print-active') {
      document.body.classList.remove('printing-doc');
      window.print();
    } else if (act === 'export-quick-csv') {
      exportSheetCSV();
    } else if (act === 'export-tasks-csv') {
      const rows = ['Görev;Kategori;Durum', ...state.tasks.map(t => `"${t.title.replace(/"/g, '""')}";"${t.cat}";"${t.done ? 'Tamamlandı' : 'Bekliyor'}"`)];
      triggerDownload('pusula-gorevler.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8;');
      showToast('Görev listesi Excel (CSV) olarak indirildi.');
    } else if (act === 'export-subs-csv') {
      const rows = ['Hizmet;Kategori;Aylık (TL);Yıllık (TL);Durum', ...state.subscriptions.map(s => `"${s.name.replace(/"/g, '""')}";"${s.cat}";${s.price};${s.price * 12};"${s.active ? 'Aktif' : 'Pasif'}"`)];
      triggerDownload('pusula-abonelikler.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8;');
      showToast('Abonelik tablosu Excel (CSV) olarak indirildi.');
    } else if (act === 'export-markets-csv') {
      const rows = [
        'Gösterge;Değer;Kaynak',
        'BIST 100;11131;Bloomberg HT',
        `USD/TRY;${MARKET_RATES.USD_TRY.toFixed(2)};Canlı Kur Akışı`,
        `EUR/TRY;${MARKET_RATES.EUR_TRY.toFixed(2)};Canlı Kur Akışı`,
        `Gram Altın;${MARKET_RATES.GOLD_GRAM.toFixed(2)};Spot Hesaplama`,
        `Bitcoin (USD);${MARKET_RATES.BTC_USD.toFixed(0)};Canlı Piyasa`
      ];
      triggerDownload('pusula-piyasalar.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8;');
      showToast('Piyasa verileri Excel (CSV) olarak indirildi.');
    } else if (act === 'open-search') {
      openSearchModal();
    }
  });

  // =====================================================
  // QUICK COMMAND SEARCH PALETTE (CTRL+K)
  // =====================================================
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('command-search-input');

  function openSearchModal() {
    searchModal.classList.remove('hidden');
    searchModal.classList.add('flex');
    searchInput.value = '';
    renderSearchResults('');
    setTimeout(() => searchInput.focus(), 40);
  }

  function closeSearchModal() {
    searchModal.classList.add('hidden');
    searchModal.classList.remove('flex');
  }

  function renderSearchResults(q) {
    const term = q.trim().toLowerCase();
    const items = [
      { label: 'Akademi: Müfredat & Dersler', sub: 'AI, Python, Web, Git & Microsoft Office — 32 etkileşimli ders', view: 'academy', eduTab: 'lessons' },
      { label: 'Akademi: MS Office Pratik & AI Lab', sub: 'Canlı Excel formül simülatörü, Word/PPT/VBA Copilot üreticisi', view: 'academy', eduTab: 'officelab' },
      { label: 'Akademi: Canlı Kod & Prompt Lab', sub: 'JS Sandbox, Test Doğrulama, HTML/CSS ve Prompt Puanlama', view: 'academy', eduTab: 'codelab' },
      { label: 'Akademi: Akıllı Bilgi Kartları', sub: '3D Flashcard destesi (Yazılım, AI & Office) ve özel kartlar', view: 'academy', eduTab: 'flashcards' },
      { label: 'Akademi: Teknik Sınav & Mülakat', sub: 'Seviye filtreli (Başlangıç-Uzman) sınav ve yanlış defteri', view: 'academy', eduTab: 'quiz' },
      { label: 'Akademi: AI & Algoritma Simülatörü', sub: 'Tokenizasyon, Temperature/Top-P, Sıralama Animasyonu', view: 'academy', eduTab: 'visualizer' },
      { label: 'Akademi: Yol Haritası & Sertifika', sub: 'Haftalık XP hedefi ve yazdırılabilir başarı belgesi', view: 'academy', eduTab: 'roadmap' },
      { label: 'Pusula Pro Tanıtım Videosu & Üyelik', sub: '60 sn interaktif tanıtım filmi, VBA/AI, bulut kasa ayrıcalıkları', view: 'overview', openPro: true },
      { label: 'Kurucu: Tayfun KAYA · Hakkımda & Kurallar', sub: 'Site amacı, iletişim (tayfunkaya49@gmail.com) ve kurallar', view: 'overview', openLegal: 'about' },
      { label: 'Genel Bakış', sub: 'Ana çalışma ve özet ekranı', view: 'overview' },
      { label: 'Pusula AI Asistan', sub: 'Yazılım, AI, hukuki haklar ve genel sorular', view: 'assistant' },
      { label: 'T.C. Kanun & Mevzuat Arama', sub: 'Anayasa, Kira, Tüketici, İş, TCK, İcra maddeleri', view: 'law' },
      { label: 'Günlük Plan & Pomodoro', sub: 'Görevler, Odak sayacı, Problem panosu', view: 'daily' },
      { label: 'Haberler & Dünya Gündemi', sub: 'Otomatik canlı akış', view: 'news' },
      { label: 'Piyasalar & Analiz', sub: 'Canlı USD, EUR, Altın, Bitcoin ve Portföy Hesaplayıcı', view: 'markets' },
      { label: 'Finansal Özgürlük & Kredi Simülatörü', sub: 'Bileşik birikim, kredi taksit ve enflasyon hesabı', view: 'simulator' },
      { label: 'Zihin Molası & Oyunlar', sub: 'Türkçe Wordle, XOX, Hafıza, Refleks', view: 'games' },
      { label: 'Bütçe & Abonelik Takipçisi', sub: 'Gelir/gider oranı ve abonelik analizi', view: 'budget' },
      { label: 'Canlı Radyolar & MP3 Çalar', sub: 'Türkiye ve dünya radyoları, kişisel MP3', view: 'radio' },
      { label: 'Canlı TV Kanalları', sub: 'TRT, Bloomberg HT, Habertürk, M3U oynatıcı', view: 'tv' },
      { label: 'Müzik & Odak Stüdyosu', sub: 'Sentezlenen ortam sesleri ve yağmur efekti', view: 'music' },
      { label: 'TV, Film & Kültür', sub: 'İzleme listesi ve akşam önerisi', view: 'media' },
      { label: 'Sosyal & Şehir Hayatı', sub: 'İstanbul kültür-sanat etkinlikleri', view: 'social' },
      { label: 'Akıllı Araç Kutusu & Hava Durumu', sub: 'Canlı hava durumu, QR kod, KDV ve şifre üretici', view: 'toolbox' },
      { label: 'Mobil Uygulama (Android & iOS)', sub: 'PWA kurulum rehberi', view: 'mobile' },
      { label: 'Hazır Şablonlar Merkezi', sub: '20+ dilekçe, Word, PDF ve bütçe şablonu', view: 'templates' },
      { label: 'Ofis, Excel & PDF Stüdyosu', sub: 'Canlı tablo, Excel (.xls), Word ve CV oluşturucu', view: 'office' }
    ];
    const filtered = items.filter(i => !term || i.label.toLowerCase().includes(term) || i.sub.toLowerCase().includes(term));
    const resEl = document.getElementById('command-search-results');
    if (!filtered.length) {
      resEl.innerHTML = '<p class="p-4 text-xs text-muted text-center">Eşleşen bölüm bulunamadı.</p>';
      return;
    }
    resEl.innerHTML = filtered.map(i => `
      <button type="button" data-cmd-view="${i.view}" ${i.eduTab ? `data-cmd-edu="${i.eduTab}"` : ''} ${i.openPro ? 'data-cmd-pro="1"' : ''} ${i.openLegal ? `data-cmd-legal="${i.openLegal}"` : ''} class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-paper flex items-center justify-between transition">
        <div>
          <p class="text-sm font-medium text-ink">${escapeHtml(i.label)}</p>
          <p class="text-xs text-muted">${escapeHtml(i.sub)}</p>
        </div>
        <span class="text-xs text-forest font-medium">Git →</span>
      </button>
    `).join('');
  }

  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
  document.getElementById('close-search-modal').addEventListener('click', closeSearchModal);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cmd-view]');
    if (btn) {
      if (btn.dataset.cmdPro) {
        openProModal(true);
      } else if (btn.dataset.cmdLegal) {
        openLegal(btn.dataset.cmdLegal);
      } else {
        switchView(btn.dataset.cmdView);
        if (btn.dataset.cmdEdu && window.PusulaAcademy) {
          window.PusulaAcademy.openTab(btn.dataset.cmdEdu);
        }
      }
      closeSearchModal();
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      closeSearchModal();
      closeCustomize();
      closeProModal();
      closeAuthModal();
      closeShareModal();
      ['news-modal', 'petition-modal', 'feedback-modal', 'legal-modal'].forEach(id => {
        const m = document.getElementById(id);
        if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
      });
    }
  });

  ['search-modal', 'news-modal', 'pro-modal', 'auth-modal', 'share-modal', 'customize-modal', 'petition-modal', 'feedback-modal', 'legal-modal'].forEach(id => {
    const m = document.getElementById(id);
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          if (id === 'pro-modal') closeProModal();
          else { m.classList.add('hidden'); m.classList.remove('flex'); }
        }
      });
    }
  });

  // =====================================================
  // PUSULA PRO MODAL, PROMO VIDEO & CUSTOMIZE MODAL
  // =====================================================
  const proModal = document.getElementById('pro-modal');
  function updateProUI() {
    document.getElementById('pro-member-badge').classList.toggle('hidden', !state.isPro);
    document.getElementById('sidebar-pro-status').textContent = state.isPro ? 'Aktif ✓' : 'Keşfet →';
    renderSubscriptions();
    renderMusicPresets();
    if (window.PusulaAcademy && typeof window.PusulaAcademy.refreshProLocks === 'function') {
      window.PusulaAcademy.refreshProLocks();
    }
  }
  function openProModal(autoplayVideo = false) {
    proModal.classList.remove('hidden');
    proModal.classList.add('flex');
    if (window.PusulaPromoVideo) {
      window.PusulaPromoVideo.renderFrame();
      if (autoplayVideo) window.PusulaPromoVideo.play();
    }
  }
  window.pusulaOpenProModal = () => openProModal(true);

  function closeProModal() {
    proModal.classList.add('hidden');
    proModal.classList.remove('flex');
    if (window.PusulaPromoVideo) window.PusulaPromoVideo.pause();
  }
  document.getElementById('open-pro-btn').addEventListener('click', () => openProModal(false));
  const ovPromoBtn = document.getElementById('ov-watch-promo-btn');
  if (ovPromoBtn) ovPromoBtn.addEventListener('click', () => openProModal(true));
  const budgetUnlockBtn = document.getElementById('budget-pro-unlock-btn');
  if (budgetUnlockBtn) budgetUnlockBtn.addEventListener('click', () => openProModal(true));
  document.getElementById('close-pro-modal').addEventListener('click', closeProModal);
  document.getElementById('pro-signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    state.isPro = true;
    try {
      localStorage.setItem('pusula_pro', '1');
      localStorage.setItem(window.pusulaGetUserKey('pusula_pro'), '1');
    } catch (err) {}
    updateProUI();
    closeProModal();
    showToast('Pusula Pro önizleme etkinleştirildi! Tüm uzman ayrıcalıklar açıldı.');
  });

  const custModal = document.getElementById('customize-modal');
  function applyWidgetVisibility() {
    document.querySelectorAll('#widget-toggles-list input[type="checkbox"]').forEach(cb => {
      const hidden = state.hiddenWidgets.includes(cb.dataset.widget);
      cb.checked = !hidden;
      const target = document.getElementById(cb.dataset.widget);
      if (target) target.classList.toggle('hidden', hidden);
    });
  }

  document.getElementById('open-customize-btn').addEventListener('click', () => {
    applyWidgetVisibility();
    custModal.classList.remove('hidden');
    custModal.classList.add('flex');
  });
  function closeCustomize() {
    custModal.classList.add('hidden');
    custModal.classList.remove('flex');
  }
  document.getElementById('close-customize-modal').addEventListener('click', closeCustomize);
  document.getElementById('save-customize-btn').addEventListener('click', () => {
    closeCustomize();
    showToast('Ana ekran tercihleriniz kaydedildi.');
  });

  document.querySelectorAll('#widget-toggles-list input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.widget;
      if (cb.checked) state.hiddenWidgets = state.hiddenWidgets.filter(w => w !== id);
      else if (!state.hiddenWidgets.includes(id)) state.hiddenWidgets.push(id);
      const target = document.getElementById(id);
      if (target) target.classList.toggle('hidden', !cb.checked);
      saveWorkspaceLocal();
    });
  });

  // =====================================================
  // SUPABASE REAL AUTH, CLOUD SYNC, PRO CHECKOUT & SHARE
  // =====================================================
  const cfg = window.PUSULA_CONFIG || {};
  let sbClient = null;
  let currentUser = null;
  let authMode = 'login';
  let billingCycle = 'monthly';
  let syncDebounce = null;

  if (cfg.SUPABASE_URL && cfg.SUPABASE_URL.startsWith('https://') && cfg.SUPABASE_ANON_KEY && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      sbClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
    } catch (err) { sbClient = null; }
  }

  function updateAuthUI() {
    const loggedIn = !!currentUser;
    document.getElementById('top-auth-label').textContent = loggedIn ? currentUser.email.split('@')[0] : 'Giriş / Üye Ol';
    document.getElementById('sidebar-auth-label').textContent = loggedIn ? currentUser.email : 'Hesap / Bulut Kayıt';
    document.getElementById('cloud-sync-badge').textContent = loggedIn ? (sbClient ? 'Bulut ✓' : 'Demo ✓') : 'Yerel';
    document.getElementById('cloud-sync-badge').className = 'text-[10px] shrink-0 ' + (loggedIn ? 'text-forest font-semibold' : 'text-muted');
    document.getElementById('auth-loggedin-box').classList.toggle('hidden', !loggedIn);
    document.getElementById('auth-form-box').classList.toggle('hidden', loggedIn);
    if (loggedIn) {
      document.getElementById('auth-user-email').textContent = currentUser.email;
      document.getElementById('auth-modal-title').textContent = 'Hesabınız Aktif';
      document.getElementById('auth-sync-note').textContent = sbClient
        ? 'Görevleriniz, notlarınız, alışkanlıklarınız ve abonelikleriniz Supabase bulut hesabınıza kaydediliyor.'
        : 'Demo hesap modundasınız. config.js içine geçerli Supabase bilgilerinizi eklediğinizde gerçek bulut kaydı başlar.';
    } else {
      document.getElementById('auth-modal-title').textContent = authMode === 'login' ? 'Hesabınıza Giriş Yapın' : 'Ücretsiz Pusula Hesabı Oluşturun';
      document.getElementById('auth-submit-btn').textContent = authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol';
      document.getElementById('auth-backend-hint').textContent = sbClient
        ? 'Supabase bulut bağlantısı aktif. E-posta ve şifrenizle gerçek hesap oluşturabilirsiniz.'
        : 'Şu an yerel moddasınız. Gerçek üyelik için proje klasöründeki config.js dosyasını kontrol edin.';
    }
  }

  function applyWorkspaceSnapshot(ws) {
    if (!ws) return;
    if (typeof ws.scratchpad === 'string') document.getElementById('quick-scratchpad').value = ws.scratchpad;
    if (Array.isArray(ws.tasks) && ws.tasks.length) state.tasks = ws.tasks;
    if (Array.isArray(ws.habits) && ws.habits.length) state.habits = ws.habits;
    if (Array.isArray(ws.ideas) && ws.ideas.length) state.ideas = ws.ideas;
    if (Array.isArray(ws.subscriptions) && ws.subscriptions.length) state.subscriptions = ws.subscriptions;
    const ex = ws.extra_data || {};
    if (typeof ex.monthlyIncome === 'number') state.monthlyIncome = ex.monthlyIncome;
    if (Array.isArray(ex.sheetRows)) state.sheetRows = ex.sheetRows;
    if (Array.isArray(ex.playlists)) state.playlists = ex.playlists;
    if (Array.isArray(ex.hiddenWidgets)) state.hiddenWidgets = ex.hiddenWidgets;
    if (typeof ex.eveningTheme === 'boolean') state.eveningTheme = ex.eveningTheme;
    if (ws.academy_state && window.PusulaAcademy && typeof window.PusulaAcademy.importState === 'function') {
      window.PusulaAcademy.importState(ws.academy_state);
    }
    saveWorkspaceLocal();
    applyThemeUI();
    applyWidgetVisibility();
    renderHabits();
    renderSubscriptions();
    renderTasks();
    renderIdeas();
    renderSheet();
    renderPlaylists();
  }

  function switchUserStorageScope(email) {
    activeUserKeySuffix = email ? hashUserEmail(email) : '';
    loadWorkspaceLocal();
    applyThemeUI();
    applyWidgetVisibility();
    renderHabits();
    renderSubscriptions();
    renderTasks();
    renderIdeas();
    renderSheet();
    renderPlaylists();
    updateProUI();
    if (window.PusulaAcademy && typeof window.PusulaAcademy.reloadForUser === 'function') {
      window.PusulaAcademy.reloadForUser();
    }
  }

  async function saveWorkspaceToCloud(silent = true) {
    saveWorkspaceLocal();
    if (!currentUser || !sbClient || currentUser.id === 'local') return;
    try {
      const basePayload = {
        user_id: currentUser.id,
        scratchpad: document.getElementById('quick-scratchpad').value || '',
        tasks: state.tasks,
        habits: state.habits,
        ideas: state.ideas,
        subscriptions: state.subscriptions,
        updated_at: new Date().toISOString()
      };
      const extendedPayload = {
        ...basePayload,
        academy_state: window.PusulaAcademy && typeof window.PusulaAcademy.exportState === 'function' ? window.PusulaAcademy.exportState() : {},
        extra_data: {
          monthlyIncome: state.monthlyIncome,
          sheetRows: state.sheetRows,
          playlists: state.playlists,
          hiddenWidgets: state.hiddenWidgets,
          eveningTheme: state.eveningTheme
        }
      };
      let { error } = await sbClient.from('user_workspace').upsert(extendedPayload, { onConflict: 'user_id' });
      if (error) {
        // Fallback to base columns if remote table hasn't added extended columns yet
        ({ error } = await sbClient.from('user_workspace').upsert(basePayload, { onConflict: 'user_id' }));
      }
      if (!error && !silent) showToast('Tüm verileriniz bulut hesabınıza kaydedildi!');
    } catch (err) {}
  }

  function scheduleCloudSync() {
    clearTimeout(syncDebounce);
    syncDebounce = setTimeout(() => saveWorkspaceToCloud(true), 1500);
  }

  async function loadWorkspaceFromCloud() {
    if (!currentUser || !sbClient || currentUser.id === 'local') return;
    try {
      const { data: ws } = await sbClient.from('user_workspace').select('*').eq('user_id', currentUser.id).maybeSingle();
      if (ws) applyWorkspaceSnapshot(ws);
      const { data: prof } = await sbClient.from('profiles').select('is_pro').eq('id', currentUser.id).maybeSingle();
      if (prof && prof.is_pro) {
        state.isPro = true;
        updateProUI();
      }
    } catch (err) {}
  }

  const authModal = document.getElementById('auth-modal');
  function openAuthModal() {
    updateAuthUI();
    authModal.classList.remove('hidden');
    authModal.classList.add('flex');
  }
  function closeAuthModal() {
    authModal.classList.add('hidden');
    authModal.classList.remove('flex');
  }
  document.getElementById('top-auth-btn').addEventListener('click', openAuthModal);
  document.getElementById('sidebar-auth-btn').addEventListener('click', openAuthModal);
  document.getElementById('close-auth-modal').addEventListener('click', closeAuthModal);

  document.getElementById('tab-login-btn').addEventListener('click', () => {
    authMode = 'login';
    document.getElementById('tab-login-btn').className = 'flex-1 py-1.5 rounded-md bg-ink text-paper font-medium';
    document.getElementById('tab-signup-btn').className = 'flex-1 py-1.5 rounded-md text-muted hover:text-ink font-medium';
    updateAuthUI();
  });
  document.getElementById('tab-signup-btn').addEventListener('click', () => {
    authMode = 'signup';
    document.getElementById('tab-signup-btn').className = 'flex-1 py-1.5 rounded-md bg-ink text-paper font-medium';
    document.getElementById('tab-login-btn').className = 'flex-1 py-1.5 rounded-md text-muted hover:text-ink font-medium';
    updateAuthUI();
  });

  document.getElementById('auth-submit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errEl = document.getElementById('auth-error-msg');
    errEl.classList.add('hidden');

    if (!sbClient) {
      currentUser = { id: 'local', email };
      try { localStorage.setItem('pusula_demo_email', email); } catch (err) {}
      switchUserStorageScope(email);
      updateAuthUI();
      closeAuthModal();
      showToast('Hoş geldiniz! Kişisel veri kasanız açıldı.');
      return;
    }

    try {
      const result = authMode === 'signup'
        ? await sbClient.auth.signUp({ email, password })
        : await sbClient.auth.signInWithPassword({ email, password });
      if (result.error) {
        errEl.textContent = result.error.message;
        errEl.classList.remove('hidden');
        return;
      }
      if (result.data && result.data.user) {
        currentUser = result.data.user;
        switchUserStorageScope(currentUser.email);
        updateAuthUI();
        await loadWorkspaceFromCloud();
        closeAuthModal();
        showToast(authMode === 'signup' ? 'Hesabınız ve bulut veri kasanız oluşturuldu!' : 'Başarıyla giriş yapıldı.');
      }
    } catch (err) {
      errEl.textContent = 'Bağlantı hatası oluştu. Lütfen tekrar deneyin.';
      errEl.classList.remove('hidden');
    }
  });

  document.getElementById('auth-manual-sync-btn').addEventListener('click', () => saveWorkspaceToCloud(false));
  const expVaultBtn = document.getElementById('auth-export-vault-btn');
  if (expVaultBtn) {
    expVaultBtn.addEventListener('click', () => {
      const vault = {
        exportedAt: new Date().toISOString(),
        account: currentUser ? currentUser.email : 'Misafir',
        workspace: buildWorkspacePayload(),
        scratchpad: document.getElementById('quick-scratchpad').value || '',
        academy: window.PusulaAcademy && typeof window.PusulaAcademy.exportState === 'function' ? window.PusulaAcademy.exportState() : null
      };
      const blob = new Blob([JSON.stringify(vault, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'pusula-kisisel-veri-kasasi.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 400);
      showToast('Tüm kişisel verileriniz ve akademi ilerlemeniz JSON kasa dosyası olarak indirildi.');
    });
  }
  const impVaultInp = document.getElementById('auth-import-vault-input');
  if (impVaultInp) {
    impVaultInp.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const v = JSON.parse(String(ev.target.result || '{}'));
          if (!v || !v.workspace) { showToast('Geçersiz Pusula Kasa dosyası.'); return; }
          applyWorkspaceSnapshot({
            ...v.workspace,
            scratchpad: v.scratchpad,
            academy_state: v.academy,
            extra_data: v.workspace
          });
          showToast('Tüm kişisel veri kasanız başarıyla geri yüklendi!');
        } catch (err) {
          showToast('Kasa dosyası okunamadı.');
        }
      };
      reader.readAsText(file, 'UTF-8');
      e.target.value = '';
    });
  }

  document.getElementById('auth-logout-btn').addEventListener('click', async () => {
    if (sbClient) { try { await sbClient.auth.signOut(); } catch (err) {} }
    currentUser = null;
    try { localStorage.removeItem('pusula_demo_email'); } catch (err) {}
    switchUserStorageScope('');
    updateAuthUI();
    closeAuthModal();
    showToast('Hesaptan çıkış yapıldı.');
  });

  if (sbClient) {
    sbClient.auth.getSession().then(({ data }) => {
      if (data && data.session && data.session.user) {
        currentUser = data.session.user;
        switchUserStorageScope(currentUser.email);
        updateAuthUI();
        loadWorkspaceFromCloud();
      }
    });
  } else {
    try {
      const demoEmail = localStorage.getItem('pusula_demo_email');
      if (demoEmail) {
        currentUser = { id: 'local', email: demoEmail };
        switchUserStorageScope(demoEmail);
      }
    } catch (err) {}
  }

  document.getElementById('quick-scratchpad').addEventListener('input', scheduleCloudSync);
  document.addEventListener('submit', (e) => {
    if (['daily-task-form', 'overview-quick-task-form', 'idea-form', 'sub-add-form'].includes(e.target.id)) {
      scheduleCloudSync();
    }
  });

  // Pro Billing Toggle & Checkout
  document.getElementById('bill-monthly-btn').addEventListener('click', () => {
    billingCycle = 'monthly';
    document.getElementById('bill-monthly-btn').className = 'px-3.5 py-1.5 rounded-md bg-ink text-paper font-medium transition';
    document.getElementById('bill-yearly-btn').className = 'px-3.5 py-1.5 rounded-md text-muted hover:text-ink font-medium transition flex items-center gap-1.5';
    document.getElementById('pro-price-display').textContent = '149 ₺';
    document.getElementById('pro-period-display').textContent = '/ ay';
    refreshIbanPanel();
  });
  document.getElementById('bill-yearly-btn').addEventListener('click', () => {
    billingCycle = 'yearly';
    document.getElementById('bill-yearly-btn').className = 'px-3.5 py-1.5 rounded-md bg-ink text-paper font-medium transition flex items-center gap-1.5';
    document.getElementById('bill-monthly-btn').className = 'px-3.5 py-1.5 rounded-md text-muted hover:text-ink font-medium transition';
    document.getElementById('pro-price-display').textContent = '1.340 ₺';
    document.getElementById('pro-period-display').textContent = '/ yıl';
    refreshIbanPanel();
  });
  document.getElementById('pro-free-continue-btn').addEventListener('click', closeProModal);

  function refreshIbanPanel() {
    const amountLabel = billingCycle === 'yearly' ? 'Yıllık · 1.340 ₺' : 'Aylık · 149 ₺';
    document.getElementById('iban-selected-plan-badge').textContent = amountLabel;
    document.getElementById('iban-holder-display').textContent = cfg.IBAN_HOLDER || 'Alıcı adı (config.js içinden ekleyin)';
    document.getElementById('iban-number-display').textContent = cfg.IBAN_NUMBER || 'IBAN henüz eklenmedi (config.js)';
    const userMail = currentUser ? currentUser.email : 'hesap e-postanız';
    document.getElementById('iban-ref-display').textContent = 'Pusula Pro - ' + userMail;
    if (currentUser && !document.getElementById('receipt-email').value) {
      document.getElementById('receipt-email').value = currentUser.email;
    }
    const waBtn = document.getElementById('receipt-whatsapp-btn');
    if (cfg.WHATSAPP_PHONE) {
      const cleanPhone = String(cfg.WHATSAPP_PHONE).replace(/\D/g, '');
      const waText = `Merhaba, Pusula Pro (${amountLabel}) için havale yaptım. Hesap e-postam: ${userMail}.`;
      waBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
      waBtn.classList.remove('hidden');
    } else {
      waBtn.classList.add('hidden');
    }
    const mailBtn = document.getElementById('receipt-email-btn');
    if (cfg.RECEIPT_EMAIL) {
      mailBtn.href = `mailto:${encodeURIComponent(cfg.RECEIPT_EMAIL)}?subject=${encodeURIComponent('Pusula Pro Dekont (' + amountLabel + ')')}`;
      mailBtn.classList.remove('hidden');
    } else {
      mailBtn.classList.add('hidden');
    }
  }

  document.getElementById('pro-checkout-btn').addEventListener('click', () => {
    const url = billingCycle === 'yearly' && cfg.PRO_CHECKOUT_URL_YEARLY ? cfg.PRO_CHECKOUT_URL_YEARLY : cfg.PRO_CHECKOUT_URL;
    if (url && url.startsWith('http')) {
      const sep = url.includes('?') ? '&' : '?';
      const finalUrl = currentUser ? `${url}${sep}email=${encodeURIComponent(currentUser.email)}` : url;
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
    } else {
      refreshIbanPanel();
      const panel = document.getElementById('pro-iban-panel');
      panel.classList.remove('hidden');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      lucide.createIcons();
    }
  });

  document.getElementById('copy-iban-btn').addEventListener('click', () => {
    const iban = cfg.IBAN_NUMBER || document.getElementById('iban-number-display').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(iban).then(() => showToast('IBAN kopyalandı!'));
  });

  document.getElementById('iban-receipt-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const sender = document.getElementById('receipt-sender').value.trim();
    const email = document.getElementById('receipt-email').value.trim();
    const note = document.getElementById('receipt-note').value.trim();
    const plan = billingCycle === 'yearly' ? 'Yıllık (1.340 TL)' : 'Aylık (149 TL)';
    const statusEl = document.getElementById('receipt-status-msg');
    if (sbClient) {
      try {
        await sbClient.from('payment_requests').insert({
          user_id: currentUser && currentUser.id !== 'local' ? currentUser.id : null,
          email, sender_name: sender, plan, note, status: 'bekliyor'
        });
      } catch (err) {}
    }
    statusEl.textContent = 'Ödeme bildiriminiz alındı! Dekont kontrol edilince Pusula Pro aktif edilecektir.';
    statusEl.className = 'text-xs text-forest font-medium';
    statusEl.classList.remove('hidden');
    e.target.reset();
    showToast('Ödeme bildiriminiz başarıyla iletildi.');
  });

  // Share Modal
  const shareModal = document.getElementById('share-modal');
  function openShareModal() {
    const shareUrl = window.location.href.startsWith('http') ? window.location.href : 'https://pusula-web.vercel.app';
    const shareMsg = 'Yazılım & AI Akademisi, günlük plan, canlı piyasa ve ofis araçları tek merkezde — Pusula: ';
    document.getElementById('share-url-input').value = shareUrl;
    document.getElementById('share-whatsapp-link').href = 'https://wa.me/?text=' + encodeURIComponent(shareMsg + shareUrl);
    document.getElementById('share-x-link').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareMsg) + '&url=' + encodeURIComponent(shareUrl);
    shareModal.classList.remove('hidden');
    shareModal.classList.add('flex');
  }
  function closeShareModal() {
    shareModal.classList.add('hidden');
    shareModal.classList.remove('flex');
  }
  document.getElementById('share-site-btn').addEventListener('click', openShareModal);
  document.getElementById('close-share-modal').addEventListener('click', closeShareModal);
  document.getElementById('copy-share-url-btn').addEventListener('click', () => {
    const inp = document.getElementById('share-url-input');
    if (navigator.clipboard) navigator.clipboard.writeText(inp.value).then(() => showToast('Site adresi kopyalandı!'));
  });

  updateAuthUI();

  // =====================================================
  // LIVE RADIO DIRECTORY & MP3 PLAYER
  // =====================================================
  const radioAudio = new Audio();
  radioAudio.crossOrigin = 'anonymous';
  radioAudio.volume = 0.75;

  const mp3Audio = new Audio();
  const radioState = {
    stations: [], activeStation: null, playing: false, tag: '',
    mp3Files: [], mp3Index: -1, mp3Playing: false
  };

  const FALLBACK_RADIOS = [
    { stationuuid: 'f1', name: 'PowerTürk FM', tags: 'turkish,pop', countrycode: 'TR', url_resolved: 'https://live.powerapp.com.tr/powerturk/mpeg/icecast.audio' },
    { stationuuid: 'f2', name: 'Power FM', tags: 'pop,hits', countrycode: 'TR', url_resolved: 'https://live.powerapp.com.tr/powerfm/mpeg/icecast.audio' },
    { stationuuid: 'f3', name: 'Power Love', tags: 'slow,love', countrycode: 'TR', url_resolved: 'https://live.powerapp.com.tr/powerlove/mpeg/icecast.audio' },
    { stationuuid: 'f4', name: 'Power Jazz', tags: 'jazz,lounge', countrycode: 'TR', url_resolved: 'https://live.powerapp.com.tr/powerjazz/mpeg/icecast.audio' }
  ];

  function updateFloatingMediaBar() {
    const bar = document.getElementById('floating-media-bar');
    const topBar = document.getElementById('top-now-playing-bar');
    const topLabel = document.getElementById('top-np-label');
    const label = document.getElementById('floating-media-title');
    const dot = document.getElementById('sidebar-radio-dot');
    let activeText = '';
    if (radioState.playing && radioState.activeStation) activeText = 'Canlı Radyo · ' + radioState.activeStation.name;
    else if (radioState.mp3Playing && radioState.mp3Files[radioState.mp3Index]) activeText = 'MP3 Çalıyor · ' + radioState.mp3Files[radioState.mp3Index].name;
    else if (state.audioPlaying) activeText = 'Odak Müziği Çalıyor';

    if (activeText) {
      if (label) label.textContent = activeText;
      if (topLabel) topLabel.textContent = activeText;
      if (topBar) { topBar.classList.remove('hidden'); topBar.classList.add('flex'); }
      if (bar) { bar.classList.add('hidden'); bar.classList.remove('flex'); }
      if (dot) dot.classList.remove('hidden');
    } else {
      if (topBar) { topBar.classList.add('hidden'); topBar.classList.remove('flex'); }
      if (bar) { bar.classList.add('hidden'); bar.classList.remove('flex'); }
      if (dot) dot.classList.add('hidden');
    }
  }

  function stopAllStreamAudio() {
    radioAudio.pause();
    radioState.playing = false;
    mp3Audio.pause();
    radioState.mp3Playing = false;
    if (state.audioPlaying) toggleAudio();
    document.getElementById('radio-play-text').textContent = 'Oynat';
    document.getElementById('radio-play-icon').setAttribute('data-lucide', 'play');
    document.getElementById('mp3-play-icon').setAttribute('data-lucide', 'play');
    renderRadioStations();
    renderMp3Playlist();
    updateFloatingMediaBar();
    lucide.createIcons();
  }

  document.getElementById('top-np-stop-btn').addEventListener('click', stopAllStreamAudio);
  document.getElementById('floating-media-stop').addEventListener('click', stopAllStreamAudio);

  async function fetchRadioStations(query = '', tag = '') {
    document.getElementById('radio-count-label').textContent = 'Kanallar yükleniyor...';
    const mirrors = ['https://de1.api.radio-browser.info', 'https://nl1.api.radio-browser.info', 'https://at1.api.radio-browser.info'];
    const params = new URLSearchParams({ hidebroken: 'true', order: 'clickcount', reverse: 'true', limit: '30' });
    if (query) params.set('name', query);
    else if (tag) {
      params.set('tag', tag);
      if (tag === 'pop' || tag === 'turkish') params.set('countrycode', 'TR');
    } else params.set('countrycode', 'TR');

    for (const base of mirrors) {
      try {
        const res = await fetch(`${base}/json/stations/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const httpsList = data.filter(st => st.url_resolved && st.url_resolved.startsWith('https://') && !st.url_resolved.endsWith('.m3u8'));
          if (httpsList.length) {
            radioState.stations = httpsList;
            document.getElementById('radio-count-label').textContent = httpsList.length + ' canlı kanal';
            renderRadioStations();
            return;
          }
        }
      } catch (err) {}
    }
    radioState.stations = FALLBACK_RADIOS;
    document.getElementById('radio-count-label').textContent = FALLBACK_RADIOS.length + ' seçili kanal';
    renderRadioStations();
  }

  function renderRadioStations() {
    const grid = document.getElementById('radio-stations-grid');
    if (!radioState.stations.length) {
      grid.innerHTML = '<div class="col-span-full editorial-card p-6 text-center text-xs text-muted">Aramanıza uygun radyo bulunamadı.</div>';
      return;
    }
    grid.innerHTML = radioState.stations.map((st, idx) => {
      const active = radioState.activeStation && radioState.activeStation.stationuuid === st.stationuuid;
      const tagText = (st.tags || st.countrycode || 'Canlı').split(',').slice(0, 2).join(' · ');
      return `
        <button type="button" data-play-radio="${idx}" class="text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${active ? 'border-forest bg-forestLight' : 'border-hairline bg-surface hover:border-ink/30'}">
          <div class="min-w-0">
            <p class="text-sm font-medium text-ink truncate">${escapeHtml(st.name)}</p>
            <p class="text-[11px] text-muted truncate mt-0.5">${escapeHtml(tagText)}</p>
          </div>
          <span class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${active && radioState.playing ? 'bg-forest text-paper' : 'bg-paper border border-hairline text-ink'}">
            <i data-lucide="${active && radioState.playing ? 'pause' : 'play'}" class="w-3.5 h-3.5 fill-current"></i>
          </span>
        </button>
      `;
    }).join('');
    lucide.createIcons();
  }

  function playRadioByIndex(idx) {
    const st = radioState.stations[idx];
    if (!st) return;
    mp3Audio.pause();
    radioState.mp3Playing = false;
    document.getElementById('mp3-play-icon').setAttribute('data-lucide', 'play');
    if (state.audioPlaying) toggleAudio();

    if (radioState.activeStation && radioState.activeStation.stationuuid === st.stationuuid && radioState.playing) {
      radioAudio.pause();
      radioState.playing = false;
      document.getElementById('radio-now-status').textContent = 'Duraklatıldı';
      document.getElementById('radio-play-text').textContent = 'Oynat';
      document.getElementById('radio-play-icon').setAttribute('data-lucide', 'play');
      renderRadioStations();
      updateFloatingMediaBar();
      lucide.createIcons();
      return;
    }

    radioState.activeStation = st;
    document.getElementById('radio-now-title').textContent = st.name;
    document.getElementById('radio-now-status').textContent = 'Bağlanıyor...';
    radioAudio.src = st.url_resolved;
    radioAudio.play().then(() => {
      radioState.playing = true;
      document.getElementById('radio-now-status').textContent = 'Canlı Yayın Çalıyor';
      document.getElementById('radio-play-text').textContent = 'Duraklat';
      document.getElementById('radio-play-icon').setAttribute('data-lucide', 'pause');
      renderRadioStations();
      updateFloatingMediaBar();
      lucide.createIcons();
    }).catch(() => {
      radioState.playing = false;
      document.getElementById('radio-now-status').textContent = 'Bu kanal şu an yanıt vermiyor';
      showToast('Bu radyo yayınına bağlanılamadı, başka bir kanal seçebilirsiniz.');
      renderRadioStations();
      updateFloatingMediaBar();
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-play-radio]');
    if (btn) playRadioByIndex(Number(btn.dataset.playRadio));
  });

  document.getElementById('radio-play-pause-btn').addEventListener('click', () => {
    if (!radioState.activeStation && radioState.stations.length) { playRadioByIndex(0); return; }
    if (radioState.playing) {
      radioAudio.pause();
      radioState.playing = false;
      document.getElementById('radio-now-status').textContent = 'Duraklatıldı';
      document.getElementById('radio-play-text').textContent = 'Oynat';
      document.getElementById('radio-play-icon').setAttribute('data-lucide', 'play');
    } else if (radioState.activeStation) {
      radioAudio.play().then(() => {
        radioState.playing = true;
        document.getElementById('radio-now-status').textContent = 'Canlı Yayın Çalıyor';
        document.getElementById('radio-play-text').textContent = 'Duraklat';
        document.getElementById('radio-play-icon').setAttribute('data-lucide', 'pause');
        updateFloatingMediaBar();
        lucide.createIcons();
      }).catch(() => showToast('Yayın başlatılamadı.'));
    }
    renderRadioStations();
    updateFloatingMediaBar();
    lucide.createIcons();
  });

  document.getElementById('radio-volume').addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    radioAudio.volume = v;
    mp3Audio.volume = v;
  });

  document.querySelectorAll('.radio-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.radio-cat-btn').forEach(b => {
        const active = b === btn;
        b.className = 'radio-cat-btn px-3 py-1 rounded-full text-xs font-medium ' +
          (active ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted hover:text-ink');
      });
      document.getElementById('radio-search-input').value = '';
      fetchRadioStations('', btn.dataset.radioTag);
    });
  });

  document.getElementById('radio-search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    fetchRadioStations(document.getElementById('radio-search-input').value.trim(), '');
  });

  function fmtSec(sec) {
    if (!isFinite(sec)) return '00:00';
    return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(Math.floor(sec % 60)).padStart(2, '0');
  }

  function renderMp3Playlist() {
    const listEl = document.getElementById('mp3-playlist');
    if (!radioState.mp3Files.length) {
      listEl.innerHTML = '<p class="py-4 text-center text-muted">Birden fazla MP3 seçerek kendi çalma listenizi oluşturabilirsiniz.</p>';
      return;
    }
    listEl.innerHTML = radioState.mp3Files.map((f, i) => `
      <button type="button" data-play-mp3="${i}" class="w-full py-2 px-2 flex items-center justify-between gap-2 text-left rounded hover:bg-paper ${i === radioState.mp3Index ? 'text-forest font-medium bg-forestLight' : 'text-ink'}">
        <span class="truncate">${i + 1}. ${escapeHtml(f.name)}</span>
        <span class="text-[11px] text-muted shrink-0">${i === radioState.mp3Index && radioState.mp3Playing ? 'Çalıyor' : 'Oynat'}</span>
      </button>
    `).join('');
  }

  function playMp3At(idx) {
    if (idx < 0 || idx >= radioState.mp3Files.length) return;
    radioAudio.pause();
    radioState.playing = false;
    document.getElementById('radio-play-text').textContent = 'Oynat';
    if (state.audioPlaying) toggleAudio();
    radioState.mp3Index = idx;
    const track = radioState.mp3Files[idx];
    mp3Audio.src = track.url;
    mp3Audio.play().then(() => {
      radioState.mp3Playing = true;
      document.getElementById('mp3-current-title').textContent = track.name;
      document.getElementById('mp3-play-icon').setAttribute('data-lucide', 'pause');
      renderMp3Playlist();
      renderRadioStations();
      updateFloatingMediaBar();
      lucide.createIcons();
    }).catch(() => showToast('Ses dosyası oynatılamadı.'));
  }

  document.getElementById('mp3-file-input').addEventListener('change', (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach(file => radioState.mp3Files.push({ name: file.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(file) }));
    renderMp3Playlist();
    if (radioState.mp3Index === -1) playMp3At(0);
    showToast(files.length + ' ses dosyası listeye eklendi.');
    e.target.value = '';
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-play-mp3]');
    if (btn) playMp3At(Number(btn.dataset.playMp3));
  });

  document.getElementById('mp3-toggle-btn').addEventListener('click', () => {
    if (!radioState.mp3Files.length) { showToast('Önce "+ MP3 Seç" düğmesinden ses dosyası ekleyin.'); return; }
    if (radioState.mp3Index === -1) { playMp3At(0); return; }
    if (radioState.mp3Playing) {
      mp3Audio.pause(); radioState.mp3Playing = false;
      document.getElementById('mp3-play-icon').setAttribute('data-lucide', 'play');
    } else {
      mp3Audio.play(); radioState.mp3Playing = true;
      document.getElementById('mp3-play-icon').setAttribute('data-lucide', 'pause');
    }
    renderMp3Playlist();
    updateFloatingMediaBar();
    lucide.createIcons();
  });

  document.getElementById('mp3-prev-btn').addEventListener('click', () => {
    if (radioState.mp3Files.length) playMp3At((radioState.mp3Index - 1 + radioState.mp3Files.length) % radioState.mp3Files.length);
  });
  document.getElementById('mp3-next-btn').addEventListener('click', () => {
    if (radioState.mp3Files.length) playMp3At((radioState.mp3Index + 1) % radioState.mp3Files.length);
  });
  mp3Audio.addEventListener('timeupdate', () => {
    const pct = mp3Audio.duration ? (mp3Audio.currentTime / mp3Audio.duration) * 100 : 0;
    document.getElementById('mp3-seek').value = pct;
    document.getElementById('mp3-time-label').textContent = fmtSec(mp3Audio.currentTime) + ' / ' + fmtSec(mp3Audio.duration);
  });
  mp3Audio.addEventListener('ended', () => {
    if (radioState.mp3Files.length > 1) playMp3At((radioState.mp3Index + 1) % radioState.mp3Files.length);
  });
  document.getElementById('mp3-seek').addEventListener('input', (e) => {
    if (mp3Audio.duration) mp3Audio.currentTime = (Number(e.target.value) / 100) * mp3Audio.duration;
  });

  // =====================================================
  // LIVE TV CHANNELS
  // =====================================================
  const TV_CHANNELS = [
    { id: 'trt1', name: 'TRT 1', cat: 'Ulusal · HD', type: 'hls', src: 'https://tv-trt1.medya.trt.com.tr/master.m3u8' },
    { id: 'showtv', name: 'Show TV', cat: 'Ulusal · HD', type: 'hls', src: 'https://ciner-live.daioncdn.net/showtv/showtv.m3u8' },
    { id: 'kanald', name: 'Kanal D', cat: 'Ulusal · HD', type: 'hls', src: 'https://demiroren.daioncdn.net/kanald/kanald.m3u8?app=kanald_web&ce=3' },
    { id: 'kanal7', name: 'Kanal 7', cat: 'Ulusal · HD', type: 'hls', src: 'https://live.kanal7.com/live/kanal7LiveDesktop/index.m3u8' },
    { id: 'trthaber', name: 'TRT Haber', cat: 'Haber · HD', type: 'hls', src: 'https://tv-trthaber.medya.trt.com.tr/master.m3u8' },
    { id: 'haberturk', name: 'Habertürk TV', cat: 'Haber · HD', type: 'hls', src: 'https://ensonhaber-live.ercdn.net/haberturk/haberturk.m3u8' },
    { id: 'bloomberght', name: 'Bloomberg HT', cat: 'Haber · Ekonomi HD', type: 'hls', src: 'https://ciner.daioncdn.net/bloomberght/bloomberght.m3u8', altSrc: 'https://ensonhaber-live.ercdn.net/bloomberght/bloomberght.m3u8' },
    { id: 'halktv', name: 'Halk TV', cat: 'Haber · HD', type: 'hls', src: 'https://halktv-live.daioncdn.net/halktv/halktv.m3u8' },
    { id: 'trtspor', name: 'TRT Spor', cat: 'Spor · HD', type: 'hls', src: 'https://tv-trtspor1.medya.trt.com.tr/master.m3u8' },
    { id: 'trt2', name: 'TRT 2', cat: 'Belgesel · Kültür HD', type: 'hls', src: 'https://tv-trt2.medya.trt.com.tr/master.m3u8' },
    { id: 'trtbelgesel', name: 'TRT Belgesel', cat: 'Belgesel · HD', type: 'hls', src: 'https://tv-trtbelgesel.medya.trt.com.tr/master.m3u8' },
    { id: 'trtmuzik', name: 'TRT Müzik', cat: 'Belgesel · Müzik HD', type: 'hls', src: 'https://tv-trtmuzik.medya.trt.com.tr/master.m3u8' }
  ];
  let tvFilterCat = 'Tümü';
  let tvSearchQuery = '';
  let activeTvId = 'trt1';
  let hlsInstance = null;

  function stopTvStreams() {
    const video = document.getElementById('tv-hls-video');
    const iframe = document.getElementById('tv-player-iframe');
    if (hlsInstance) { hlsInstance.destroy(); hlsInstance = null; }
    video.pause();
    video.removeAttribute('src');
    video.load();
    iframe.src = '';
  }

  function playTvChannel(ch) {
    if (!ch) return;
    stopAllStreamAudio();
    stopTvStreams();

    activeTvId = ch.id;
    const video = document.getElementById('tv-hls-video');
    const iframe = document.getElementById('tv-player-iframe');
    document.getElementById('tv-active-title').textContent = ch.name + ' Canlı';
    document.getElementById('tv-active-cat').textContent = ch.cat;

    if (ch.type === 'hls') {
      iframe.classList.add('hidden');
      video.classList.remove('hidden');
      document.getElementById('tv-stream-mode-badge').textContent = 'Site İçi HD Yayın';
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(ch.src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
        hlsInstance.on(window.Hls.Events.ERROR, (ev, data) => {
          if (data.fatal) {
            if (ch.altSrc && ch.src !== ch.altSrc) playTvChannel({ ...ch, src: ch.altSrc, altSrc: '' });
            else {
              document.getElementById('tv-stream-mode-badge').textContent = 'Yayın geçici olarak kapalı';
              showToast(ch.name + ' yayını şu an yanıt vermiyor.');
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = ch.src;
        video.play().catch(() => {});
      }
    } else {
      video.classList.add('hidden');
      iframe.classList.remove('hidden');
      document.getElementById('tv-stream-mode-badge').textContent = 'Site İçi Canlı Oynatıcı';
      iframe.src = ch.src;
    }
    renderTvChannels();
  }

  function renderTvChannels() {
    const listEl = document.getElementById('tv-channels-list');
    const q = tvSearchQuery.trim().toLowerCase();
    const filtered = TV_CHANNELS.filter(c => {
      const mCat = tvFilterCat === 'Tümü' || c.cat.toLowerCase().includes(tvFilterCat.toLowerCase());
      const mQ = !q || c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q);
      return mCat && mQ;
    });
    document.getElementById('tv-channel-count').textContent = filtered.length + ' canlı kanal hazır';
    listEl.innerHTML = filtered.map(ch => {
      const active = ch.id === activeTvId;
      return `
        <button type="button" data-select-tv="${ch.id}" class="w-full text-left p-3 rounded-xl border transition flex items-center justify-between gap-2 ${active ? 'border-forest bg-forestLight' : 'border-hairline bg-paper hover:border-ink/30'}">
          <div>
            <p class="text-sm font-medium text-ink">${escapeHtml(ch.name)}</p>
            <p class="text-[11px] text-muted">${escapeHtml(ch.cat)}</p>
          </div>
          <span class="text-[11px] font-medium ${active ? 'text-terracotta' : 'text-forest'}">${active ? 'İzleniyor' : 'İzle'}</span>
        </button>
      `;
    }).join('');
  }

  const tvSearchEl = document.getElementById('tv-search-input');
  if (tvSearchEl) tvSearchEl.addEventListener('input', (e) => { tvSearchQuery = e.target.value; renderTvChannels(); });
  const tvRetryBtn = document.getElementById('tv-retry-btn');
  if (tvRetryBtn) tvRetryBtn.addEventListener('click', () => {
    const ch = TV_CHANNELS.find(x => x.id === activeTvId) || TV_CHANNELS[0];
    playTvChannel(ch);
    showToast(ch.name + ' yeniden bağlanıyor...');
  });

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-select-tv]');
    if (!btn) return;
    const ch = TV_CHANNELS.find(x => x.id === btn.dataset.selectTv);
    if (ch) playTvChannel(ch);
  });

  document.getElementById('custom-tv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = document.getElementById('custom-tv-url').value.trim();
    if (raw.includes('.m3u8')) {
      playTvChannel({ id: 'custom', name: 'Özel Canlı Yayın', cat: 'HLS Akışı', type: 'hls', src: raw });
      showToast('Canlı yayın site içinde açıldı.');
      return;
    }
    const m = raw.match(/(?:[?&]v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    if (!m) { showToast('Geçerli bir YouTube canlı linki veya .m3u8 adresi girin.'); return; }
    playTvChannel({ id: 'custom', name: 'Özel Yayın', cat: 'Site İçi Oynatıcı', type: 'embed', src: 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1' });
    showToast('Yayın site içinde açıldı.');
  });

  document.querySelectorAll('.tv-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tvFilterCat = btn.dataset.tvCat;
      document.querySelectorAll('.tv-cat-btn').forEach(b => {
        const active = b === btn;
        b.className = 'tv-cat-btn px-2.5 py-1 rounded-full text-[11px] font-medium ' +
          (active ? 'bg-ink text-paper' : 'bg-paper border border-hairline text-muted');
      });
      renderTvChannels();
    });
  });

  document.getElementById('tv-pip-btn').addEventListener('click', async () => {
    const video = document.getElementById('tv-hls-video');
    if (video.classList.contains('hidden')) { showToast('Küçük ekran modu HD (HLS) kanallarda çalışır.'); return; }
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else if (video.requestPictureInPicture) await video.requestPictureInPicture();
      else showToast('Tarayıcınız küçük ekran (PiP) modunu desteklemiyor.');
    } catch (err) { showToast('Önce bir HD kanal başlatın.'); }
  });

  function parseM3uText(text) {
    const lines = text.split(/\r?\n/);
    let currentName = '';
    let added = 0;
    const existingSrcs = new Set(TV_CHANNELS.map(c => c.src));
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('#EXTINF')) {
        const commaIdx = line.lastIndexOf(',');
        currentName = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : 'Canlı Kanal';
      } else if (line.startsWith('https://') && line.includes('.m3u8')) {
        if (!existingSrcs.has(line) && currentName) {
          existingSrcs.add(line);
          const lower = currentName.toLowerCase();
          const cat = lower.includes('spor') ? 'Spor · Canlı' :
                      lower.includes('haber') || lower.includes('news') ? 'Haber · Canlı' :
                      lower.includes('belgesel') || lower.includes('müzik') ? 'Belgesel · Kültür' : 'Ulusal · Canlı';
          TV_CHANNELS.push({ id: 'm3u_' + TV_CHANNELS.length, name: currentName, cat, type: 'hls', src: line });
          added++;
        }
        currentName = '';
      }
    }
    if (added > 0) renderTvChannels();
    return added;
  }

  fetch('https://iptv-org.github.io/iptv/countries/tr.m3u').then(r => r.ok ? r.text() : '').then(txt => { if (txt) parseM3uText(txt); }).catch(() => {});
  document.getElementById('tv-m3u-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const n = parseM3uText(String(ev.target.result || ''));
      showToast(n > 0 ? n + ' canlı kanal listeye eklendi!' : 'Dosyada yeni HTTPS .m3u8 kanalı bulunamadı.');
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  });

  let radioSleepTimer = null;
  document.getElementById('radio-sleep-select').addEventListener('change', (e) => {
    clearTimeout(radioSleepTimer);
    const mins = Number(e.target.value);
    if (mins > 0) {
      radioSleepTimer = setTimeout(() => {
        stopAllStreamAudio();
        showToast('Uyku zamanlayıcısı doldu, yayın durduruldu.');
        document.getElementById('radio-sleep-select').value = '0';
      }, mins * 60 * 1000);
      showToast(mins + ' dakika sonra yayın otomatik kapanacak.');
    }
  });

  fetchRadioStations('', '');
  renderTvChannels();

  // =====================================================
  // FINANCIAL SIMULATOR (COMPOUND, LOAN, INFLATION)
  // =====================================================
  function updateCompoundSim() {
    const initial = Math.max(0, Number(document.getElementById('sim-initial').value) || 0);
    const monthly = Math.max(0, Number(document.getElementById('sim-monthly').value) || 0);
    const annualRate = Math.max(0, Number(document.getElementById('sim-rate').value) || 0) / 100;
    const years = Math.min(30, Math.max(1, Number(document.getElementById('sim-years').value) || 5));
    const rMonth = annualRate / 12;

    const labels = [], principalArr = [], totalArr = [];
    let bal = initial, prin = initial;

    for (let y = 1; y <= years; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + rMonth) + monthly;
        prin += monthly;
      }
      labels.push(y + '. Yıl');
      principalArr.push(Math.round(prin));
      totalArr.push(Math.round(bal));
    }

    const finalTotal = totalArr[totalArr.length - 1] || initial;
    const finalPrin = principalArr[principalArr.length - 1] || initial;
    document.getElementById('sim-out-principal').textContent = formatTR(finalPrin, 0) + ' ₺';
    document.getElementById('sim-out-profit').textContent = '+' + formatTR(Math.max(0, finalTotal - finalPrin), 0) + ' ₺';
    document.getElementById('sim-out-total').textContent = formatTR(finalTotal, 0) + ' ₺';

    const dark = state.eveningTheme;
    const gridCol = dark ? '#1E293B' : '#E2E8F0';
    const tickCol = dark ? '#94A3B8' : '#526075';

    const ctx = document.getElementById('compoundChart');
    if (ctx && typeof Chart !== 'undefined') {
      if (!compoundChartInstance) {
        compoundChartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              { label: 'Yatırılan Ana Para', data: principalArr, backgroundColor: '#94A3B8', borderRadius: 4 },
              { label: 'Bileşik Toplam', data: totalArr, backgroundColor: '#0D9488', borderRadius: 4 }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: tickCol, font: { size: 11 } } } },
            scales: {
              y: { grid: { color: gridCol }, ticks: { color: tickCol, callback: v => formatTR(v, 0) + ' ₺' } },
              x: { grid: { display: false }, ticks: { color: tickCol } }
            }
          }
        });
      } else {
        compoundChartInstance.data.labels = labels;
        compoundChartInstance.data.datasets[0].data = principalArr;
        compoundChartInstance.data.datasets[1].data = totalArr;
        compoundChartInstance.update();
      }
    }
  }

  function updateLoanCalc() {
    const P = Math.max(0, Number(document.getElementById('loan-amount').value) || 0);
    const n = Math.max(1, Number(document.getElementById('loan-months').value) || 1);
    const r = Math.max(0, Number(document.getElementById('loan-rate').value) || 0) / 100;
    let monthly = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    document.getElementById('loan-out-monthly').textContent = formatTR(monthly, 0) + ' ₺';
    document.getElementById('loan-out-total').textContent = formatTR(total, 0) + ' ₺';
    document.getElementById('loan-out-interest').textContent = formatTR(Math.max(0, total - P), 0) + ' ₺';
  }

  function updateInflationCalc() {
    const oldSal = Math.max(1, Number(document.getElementById('inf-old').value) || 1);
    const newSal = Math.max(1, Number(document.getElementById('inf-new').value) || 1);
    const inf = Math.max(0, Number(document.getElementById('inf-rate').value) || 0) / 100;
    const needed = oldSal * (1 + inf);
    const realPct = ((newSal / needed) - 1) * 100;
    const el = document.getElementById('inf-result-text');
    if (realPct >= 0) {
      el.textContent = `Alım gücünüz reel olarak +%${formatTR(realPct, 1)} arttı (gereken: ${formatTR(needed, 0)} ₺).`;
      el.className = 'text-xs p-3 rounded-lg bg-forestLight text-forest font-medium';
    } else {
      el.textContent = `Alım gücünüz reel olarak %${formatTR(Math.abs(realPct), 1)} azaldı (gereken: ${formatTR(needed, 0)} ₺).`;
      el.className = 'text-xs p-3 rounded-lg bg-terracottaLight text-terracotta font-medium';
    }
  }

  ['sim-initial', 'sim-monthly', 'sim-rate', 'sim-years'].forEach(id => document.getElementById(id).addEventListener('input', updateCompoundSim));
  ['loan-amount', 'loan-months', 'loan-rate'].forEach(id => document.getElementById(id).addEventListener('input', updateLoanCalc));
  ['inf-old', 'inf-new', 'inf-rate'].forEach(id => document.getElementById(id).addEventListener('input', updateInflationCalc));

  document.getElementById('sim-export-loan-csv').addEventListener('click', () => {
    const P = Math.max(0, Number(document.getElementById('loan-amount').value) || 0);
    const n = Math.max(1, Number(document.getElementById('loan-months').value) || 1);
    const r = Math.max(0, Number(document.getElementById('loan-rate').value) || 0) / 100;
    const monthly = r === 0 ? P / n : P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    let bal = P;
    const rows = ['Taksit No;Taksit Tutari (TL);Faiz (TL);Anapara (TL);Kalan Borc (TL)'];
    for (let i = 1; i <= n; i++) {
      const interest = bal * r;
      const prin = monthly - interest;
      bal = Math.max(0, bal - prin);
      rows.push(`${i};${monthly.toFixed(2)};${interest.toFixed(2)};${prin.toFixed(2)};${bal.toFixed(2)}`);
    }
    triggerDownload('pusula-kredi-odeme-plani.csv', '\uFEFF' + rows.join('\n'), 'text/csv;charset=utf-8;');
    showToast('Kredi ödeme planı Excel (CSV) olarak indirildi.');
  });

  // =====================================================
  // GAMES (WORDLE, MEMORY SEQUENCE, XOX, QUIZ, CARDS, REFLEX)
  // =====================================================
  const TR_WORDS = [
    'GÜNEŞ','DENİZ','SABAH','KİTAP','MÜZİK','HAYAL','BAHAR','ÇİÇEK','BULUT','KALEM',
    'KAĞIT','KAHVE','ŞEHİR','SOKAK','ZAMAN','HUZUR','SEVGİ','RADYO','EKRAN','BÜTÇE',
    'ALTIN','DOLAR','BORSA','FİKİR','ÇÖZÜM','HEDEF','GÜVEN','DOĞAL','SAHNE','SERGİ',
    'ROMAN','MİRAS','VAKİT','NİSAN','KASIM','EYLÜL','MAYIS','ŞUBAT','PAZAR','AKŞAM',
    'YARIN','BUGÜN','DÜNYA','İNSAN','HAYAT','YAPAY','VERİM','KODLA','BULUT','SİBER'
  ];
  const TR_KEYS = [
    ['E','R','T','Y','U','I','O','P','Ğ','Ü'],
    ['A','S','D','F','G','H','J','K','L','Ş','İ'],
    ['GİR','Z','C','V','B','N','M','Ö','Ç','SİL']
  ];
  const wState = { target: '', guesses: [], current: '', over: false, streak: 0 };
  try { wState.streak = Number(localStorage.getItem('pusula_wordle_streak')) || 0; } catch (e) {}

  function trUpper(ch) {
    return ch === 'i' ? 'İ' : ch === 'ı' ? 'I' : ch.toLocaleUpperCase('tr-TR');
  }

  function initWordle(randomWord = false) {
    const dayIdx = Math.floor(Date.now() / 86400000) % TR_WORDS.length;
    wState.target = randomWord ? TR_WORDS[Math.floor(Math.random() * TR_WORDS.length)] : TR_WORDS[dayIdx];
    wState.guesses = []; wState.current = ''; wState.over = false;
    document.getElementById('wordle-status').textContent = '';
    renderWordle();
  }

  function evalGuess(guess, target) {
    const res = Array(5).fill('absent');
    const tArr = Array.from(target);
    const gArr = Array.from(guess);
    for (let i = 0; i < 5; i++) if (gArr[i] === tArr[i]) { res[i] = 'correct'; tArr[i] = null; }
    for (let i = 0; i < 5; i++) {
      if (res[i] === 'absent') {
        const idx = tArr.indexOf(gArr[i]);
        if (idx !== -1) { res[i] = 'present'; tArr[idx] = null; }
      }
    }
    return res;
  }

  function renderWordle() {
    const board = document.getElementById('wordle-board');
    const keyStates = {};
    let html = '';
    for (let r = 0; r < 6; r++) {
      html += '<div class="grid grid-cols-5 gap-2">';
      const word = r < wState.guesses.length ? wState.guesses[r] : (r === wState.guesses.length ? wState.current : '');
      const chars = Array.from(word);
      const evals = r < wState.guesses.length ? evalGuess(word, wState.target) : null;
      for (let c = 0; c < 5; c++) {
        const ch = chars[c] || '';
        let cls = 'border-hairline bg-paper text-ink';
        if (evals) {
          if (evals[c] === 'correct') { cls = 'border-forest bg-forest text-paper'; keyStates[ch] = 'correct'; }
          else if (evals[c] === 'present') { cls = 'border-terracotta bg-terracotta text-paper'; if (keyStates[ch] !== 'correct') keyStates[ch] = 'present'; }
          else { cls = 'border-stonewarm bg-stonewarm text-muted'; if (!keyStates[ch]) keyStates[ch] = 'absent'; }
        } else if (ch) cls = 'border-ink/40 bg-surface text-ink';
        html += `<div class="h-12 rounded-lg border-2 flex items-center justify-center font-semibold text-lg ${cls}">${escapeHtml(ch)}</div>`;
      }
      html += '</div>';
    }
    board.innerHTML = html;
    document.getElementById('wordle-keyboard').innerHTML = TR_KEYS.map(row => `
      <div class="flex justify-center gap-1">
        ${row.map(k => {
          const st = keyStates[k];
          const cls = st === 'correct' ? 'bg-forest text-paper border-forest' :
                      st === 'present' ? 'bg-terracotta text-paper border-terracotta' :
                      st === 'absent' ? 'bg-stonewarm text-muted border-stonewarm' :
                      'bg-surface text-ink border-hairline hover:border-ink/40';
          const wide = (k === 'GİR' || k === 'SİL') ? 'px-2.5 text-[11px]' : 'w-8 sm:w-9 text-xs';
          return `<button type="button" data-wkey="${k}" class="${wide} h-9 rounded-md border font-medium transition ${cls}">${k}</button>`;
        }).join('')}
      </div>
    `).join('');
    document.getElementById('wordle-streak-badge').textContent = 'Seri: ' + wState.streak;
  }

  function handleWordleKey(key) {
    if (wState.over) return;
    if (key === 'SİL' || key === 'BACKSPACE') {
      const arr = Array.from(wState.current); arr.pop(); wState.current = arr.join(''); renderWordle(); return;
    }
    if (key === 'GİR' || key === 'ENTER') {
      if (Array.from(wState.current).length < 5) { document.getElementById('wordle-status').textContent = 'Lütfen 5 harf girin.'; return; }
      wState.guesses.push(wState.current);
      if (wState.current === wState.target) {
        wState.over = true; wState.streak++;
        try { localStorage.setItem('pusula_wordle_streak', String(wState.streak)); } catch (e) {}
        document.getElementById('wordle-status').textContent = `Harika! ${wState.guesses.length}. denemede bildiniz.`;
      } else if (wState.guesses.length >= 6) {
        wState.over = true; wState.streak = 0;
        try { localStorage.setItem('pusula_wordle_streak', '0'); } catch (e) {}
        document.getElementById('wordle-status').textContent = 'Doğru kelime: ' + wState.target;
      } else { document.getElementById('wordle-status').textContent = ''; }
      wState.current = ''; renderWordle(); return;
    }
    if (Array.from(wState.current).length < 5 && /^[A-ZÇĞİÖŞÜ]$/.test(key)) { wState.current += key; renderWordle(); }
  }

  document.addEventListener('click', (e) => { const k = e.target.closest('[data-wkey]'); if (k) handleWordleKey(k.dataset.wkey); });
  document.addEventListener('keydown', (e) => {
    if (state.activeView !== 'games') return;
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key === 'Backspace') handleWordleKey('SİL');
    else if (e.key === 'Enter') handleWordleKey('GİR');
    else if (e.key.length === 1) handleWordleKey(trUpper(e.key));
  });
  document.getElementById('wordle-new-btn').addEventListener('click', () => initWordle(true));
  document.getElementById('wordle-share-btn').addEventListener('click', () => {
    const gridTxt = wState.guesses.map(g => evalGuess(g, wState.target).map(e => e === 'correct' ? '🟩' : e === 'present' ? '🟧' : '⬜').join('')).join('\n');
    const shareStr = `Pusula Günün Kelimesi (${wState.guesses.length}/6)\n${gridTxt}`;
    if (navigator.clipboard) navigator.clipboard.writeText(shareStr).then(() => showToast('Skorunuz kopyalandı!'));
  });

  // Memory Sequence Game
  const memState = { level: 1, best: 0, seq: '' };
  try { memState.best = Number(localStorage.getItem('pusula_mem_best')) || 0; } catch (e) {}
  document.getElementById('mem-best-badge').textContent = 'Rekor: ' + memState.best;
  let memTimeout = null;
  function startMemoryRound() {
    const digits = memState.level + 2;
    let seq = '';
    for (let i = 0; i < digits; i++) seq += Math.floor(Math.random() * 10);
    memState.seq = seq;
    document.getElementById('mem-level-label').textContent = `Seviye ${memState.level} · ${digits} Basamak`;
    document.getElementById('mem-number-display').textContent = seq;
    document.getElementById('mem-start-btn').classList.add('hidden');
    document.getElementById('mem-answer-form').classList.add('hidden');
    document.getElementById('mem-feedback').textContent = 'Sayıyı aklınızda tutun...';
    clearTimeout(memTimeout);
    memTimeout = setTimeout(() => {
      document.getElementById('mem-number-display').textContent = '•'.repeat(digits);
      document.getElementById('mem-answer-form').classList.remove('hidden');
      document.getElementById('mem-answer-input').value = '';
      document.getElementById('mem-answer-input').focus();
      document.getElementById('mem-feedback').textContent = 'Şimdi gördüğünüz sayıyı yazın.';
    }, Math.min(4000, 1400 + digits * 320));
  }
  document.getElementById('mem-start-btn').addEventListener('click', startMemoryRound);
  document.getElementById('mem-answer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ans = document.getElementById('mem-answer-input').value.trim();
    if (ans === memState.seq) {
      if (memState.level > memState.best) {
        memState.best = memState.level;
        try { localStorage.setItem('pusula_mem_best', String(memState.best)); } catch (err) {}
      }
      document.getElementById('mem-best-badge').textContent = 'Rekor: ' + memState.best;
      memState.level++;
      document.getElementById('mem-feedback').textContent = 'Doğru! Sonraki seviyeye geçiliyor...';
      setTimeout(startMemoryRound, 700);
    } else {
      document.getElementById('mem-feedback').textContent = `Yanlış (Doğrusu: ${memState.seq}).`;
      memState.level = 1;
      document.getElementById('mem-answer-form').classList.add('hidden');
      document.getElementById('mem-start-btn').classList.remove('hidden');
      document.getElementById('mem-start-btn').textContent = 'Yeniden Başlat';
    }
  });

  // =====================================================
  // CV / RESUME LIVE PREVIEW, PRO EXECUTIVE THEME & PDF PRINT
  // =====================================================
  function updateCvPreview() {
    document.getElementById('cv-prev-name').textContent = document.getElementById('cv-name').value || 'Ad Soyad';
    document.getElementById('cv-prev-role').textContent = document.getElementById('cv-role').value || '';
    document.getElementById('cv-prev-contact').textContent = document.getElementById('cv-contact').value || '';
    document.getElementById('cv-prev-summary').textContent = document.getElementById('cv-summary').value || '';
    const expLines = (document.getElementById('cv-exp').value || '').split('\n').filter(l => l.trim());
    document.getElementById('cv-prev-exp').innerHTML = expLines.map(l => `<li>${escapeHtml(l)}</li>`).join('');
    const skills = (document.getElementById('cv-skills').value || '').split(',').map(x => x.trim()).filter(Boolean);
    document.getElementById('cv-prev-skills').innerHTML = skills.map(sk => `<span class="px-2 py-0.5 rounded bg-paper border border-hairline text-[11px] text-ink">${escapeHtml(sk)}</span>`).join('');
    const prevCard = document.getElementById('cv-live-preview');
    if (prevCard) {
      prevCard.classList.toggle('border-plum', !!state.cvExecStyle && !!state.isPro);
      prevCard.classList.toggle('border-2', !!state.cvExecStyle && !!state.isPro);
    }
  }
  ['cv-name', 'cv-role', 'cv-contact', 'cv-summary', 'cv-exp', 'cv-skills'].forEach(id => document.getElementById(id).addEventListener('input', updateCvPreview));
  const cvExecBtn = document.getElementById('cv-exec-style-btn');
  if (cvExecBtn) {
    cvExecBtn.addEventListener('click', () => {
      if (!state.isPro) {
        openProModal(true);
        showToast('Yönetici CV Teması Pusula Pro üyelerine özeldir.');
        return;
      }
      state.cvExecStyle = !state.cvExecStyle;
      saveWorkspaceLocal();
      updateCvPreview();
      showToast(state.cvExecStyle ? 'Yönetici CV teması etkinleştirildi!' : 'Standart CV görünümüne geçildi.');
    });
  }
  const cvAiBtn = document.getElementById('cv-ai-improve-btn');
  if (cvAiBtn) {
    cvAiBtn.addEventListener('click', () => {
      if (!state.isPro) {
        openProModal(true);
        showToast('AI CV Güçlendirme Koçu Pusula Pro ayrıcalığıdır.');
        return;
      }
      const role = document.getElementById('cv-role').value || 'Uzman';
      const summary = document.getElementById('cv-summary').value || '';
      askPusulaAssistant(`Şu ünvan ve özeti ("${role}": "${summary}") ATS sistemlerinden yüksek puan alacak, ölçülebilir başarı ifadeleri içeren profesyonel Türkçe özgeçmiş özetine dönüştür.`, true);
    });
  }
  document.getElementById('cv-export-pdf-btn').addEventListener('click', () => {
    const prevHtml = document.getElementById('cv-live-preview').innerHTML;
    const win = window.open('', '_blank', 'width=820,height=960');
    if (!win) { showToast('Lütfen tarayıcıda açılır pencerelere izin verin.'); return; }
    const wm = state.isPro ? '' : '<p style="margin-top:28px;font-size:11px;color:#94a3b8;font-family:sans-serif;text-align:center;">Pusula Standart Çıktısı · Filigransız Yönetici Tasarımı için Pusula Pro</p>';
    win.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Pusula CV</title><style>body{font-family:Georgia,serif;color:#1D1B18;max-width:740px;margin:40px auto;padding:0 24px;line-height:1.55;}h4{font-size:28px;margin:0 0 4px;}ul{padding-left:18px;}li{margin-bottom:6px;}span{display:inline-block;border:1px solid #DDD;padding:2px 8px;border-radius:4px;margin:2px 4px 2px 0;font-size:12px;font-family:sans-serif;}</style></head><body>${prevHtml}${wm}<script>window.onload=function(){window.print();}<\/script></body></html>`);
    win.document.close();
  });

  // =====================================================
  // PWA INSTALL
  // =====================================================
  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    document.getElementById('pwa-install-status-badge').textContent = 'Tek Tıkla Kuruluma Hazır ✓';
  });
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    document.getElementById('pwa-install-status-badge').textContent = 'Cihazınıza Kuruldu ✓';
    showToast('Pusula cihazınıza uygulama olarak kuruldu!');
  });
  document.getElementById('pwa-android-install-btn').addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
    } else {
      showToast('Chrome sağ üst menüden (⋮) "Uygulamayı Yükle" veya "Ana Ekrana Ekle" seçin.');
    }
  });
  document.getElementById('copy-mobile-link-btn').addEventListener('click', () => {
    const url = window.location.href.startsWith('http') ? window.location.href : 'https://pusula-web-opal.vercel.app';
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => showToast('Mobil kurulum adresi kopyalandı!'));
  });
  if (cfg.ANDROID_APK_URL && cfg.ANDROID_APK_URL.startsWith('http')) {
    const apkBtn = document.getElementById('android-apk-download-btn');
    apkBtn.href = cfg.ANDROID_APK_URL;
    apkBtn.classList.remove('hidden');
  }

  // =====================================================
  // ANIMATED AUDIO WAVEFORM VISUALIZER
  // =====================================================
  let wavePhase = 0;
  function drawWaveOnCanvas(canvasId, isActive, colorHex) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    if (canvas.width !== Math.round(rect.width) || canvas.height !== Math.round(rect.height)) {
      canvas.width = Math.round(rect.width);
      canvas.height = Math.round(rect.height);
    }
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const bars = Math.max(18, Math.floor(W / 8));
    const barW = Math.max(3, (W / bars) * 0.55);
    const gap = W / bars;

    for (let i = 0; i < bars; i++) {
      const norm = i / bars;
      const envelope = Math.sin(norm * Math.PI);
      const amp = isActive
        ? (0.22 + 0.72 * Math.abs(Math.sin(wavePhase * 1.4 + i * 0.42) * Math.cos(wavePhase * 0.7 - i * 0.21))) * envelope
        : (0.12 + 0.08 * Math.sin(wavePhase * 0.35 + i * 0.35)) * envelope;
      const h = Math.max(4, amp * (H - 10));
      const x = i * gap + (gap - barW) / 2;
      const y = (H - h) / 2;
      ctx.fillStyle = isActive ? (i % 3 === 0 ? '#E11D48' : colorHex) : (state.eveningTheme ? '#334155' : '#CBD5E1');
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, h, 3);
      else ctx.rect(x, y, barW, h);
      ctx.fill();
    }
  }

  function animateAudioWaves() {
    const anyPlaying = radioState.playing || radioState.mp3Playing || state.audioPlaying;
    wavePhase += anyPlaying ? 0.085 : 0.02;
    drawWaveOnCanvas('ovWaveCanvas', anyPlaying, '#0D9488');
    drawWaveOnCanvas('radioWaveCanvas', radioState.playing, '#2563EB');
    drawWaveOnCanvas('mp3WaveCanvas', radioState.mp3Playing, '#0D9488');
    drawWaveOnCanvas('topMiniWaveCanvas', anyPlaying, '#FFFFFF');

    const ovIcon = document.getElementById('ov-smart-play-icon');
    const ovStat = document.getElementById('ov-wave-status');
    if (ovIcon && ovStat) {
      const wanted = anyPlaying ? 'pause' : 'play';
      if (ovIcon.getAttribute('data-lucide') !== wanted) {
        ovIcon.setAttribute('data-lucide', wanted);
        lucide.createIcons();
      }
      if (radioState.playing && radioState.activeStation) {
        document.getElementById('overview-track-name').textContent = radioState.activeStation.name;
        ovStat.textContent = 'Canlı radyo çalıyor · Dalgalar aktif';
      } else if (radioState.mp3Playing && radioState.mp3Files[radioState.mp3Index]) {
        document.getElementById('overview-track-name').textContent = radioState.mp3Files[radioState.mp3Index].name;
        ovStat.textContent = 'Kişisel MP3 çalıyor';
      } else if (state.audioPlaying) {
        ovStat.textContent = 'Odak ortam müziği çalıyor';
      } else {
        ovStat.textContent = 'Oynat’a basın, canlı radyo veya odak sesi başlasın';
      }
    }
    requestAnimationFrame(animateAudioWaves);
  }

  document.getElementById('ov-smart-play-btn').addEventListener('click', () => {
    if (radioState.playing || radioState.mp3Playing) { stopAllStreamAudio(); return; }
    if (state.audioPlaying) { toggleAudio(); return; }
    if (radioState.stations.length) playRadioByIndex(0);
    else toggleAudio();
  });

  // =====================================================
  // LIVE WEATHER, WORLD CLOCKS & SMART TOOLS
  // =====================================================
  const TR_CITIES = {
    istanbul: { name: 'İstanbul', lat: 41.0082, lon: 28.9784 },
    ankara: { name: 'Ankara', lat: 39.9334, lon: 32.8597 },
    izmir: { name: 'İzmir', lat: 38.4237, lon: 27.1428 },
    antalya: { name: 'Antalya', lat: 36.8969, lon: 30.7133 },
    bursa: { name: 'Bursa', lat: 40.1885, lon: 29.0610 }
  };

  function weatherCodeToTr(code) {
    if (code === 0) return 'Açık ve Güneşli';
    if (code <= 3) return 'Parçalı Bulutlu';
    if (code <= 48) return 'Sisli';
    if (code <= 67) return 'Yağmurlu';
    if (code <= 77) return 'Kar Yağışlı';
    return 'Sağanak / Değişken';
  }

  async function fetchLiveWeather(cityKey = 'istanbul') {
    const c = TR_CITIES[cityKey] || TR_CITIES.istanbul;
    document.getElementById('tb-weather-city').textContent = c.name + ' · Canlı Hava Durumu';
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FIstanbul&forecast_days=3`;
      const res = await fetch(url);
      if (!res.ok) return;
      const d = await res.json();
      if (d && d.current) {
        const temp = Math.round(d.current.temperature_2m);
        const desc = weatherCodeToTr(d.current.weather_code);
        document.getElementById('tb-weather-temp').textContent = temp + '°C';
        document.getElementById('tb-weather-desc').textContent = desc;
        document.getElementById('tb-weather-wind').textContent = Math.round(d.current.wind_speed_10m) + ' km/s';
        document.getElementById('tb-weather-hum').textContent = d.current.relative_humidity_2m + '%';
        document.getElementById('ov-weather-text').textContent = `${c.name} ${temp}°C · ${desc}`;
      }
      if (d && d.daily && d.daily.time) {
        const dayLabels = ['Bugün', 'Yarın', 'Sonraki Gün'];
        document.getElementById('tb-weather-days').innerHTML = d.daily.time.slice(0, 3).map((t, i) => `
          <div class="p-2.5 rounded-lg bg-paper border border-hairline">
            <p class="text-muted">${dayLabels[i]}</p>
            <p class="font-semibold text-ink tabular mt-1">${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</p>
          </div>
        `).join('');
      }
    } catch (err) {
      document.getElementById('ov-weather-text').textContent = c.name + ' · Hava Durumu';
    }
  }
  document.getElementById('weather-city-select').addEventListener('change', (e) => fetchLiveWeather(e.target.value));

  function updateWorldClocks() {
    const now = new Date();
    const fmt = (tz) => {
      try { return now.toLocaleTimeString('tr-TR', { timeZone: tz, hour: '2-digit', minute: '2-digit' }); }
      catch (e) { return '--:--'; }
    };
    document.getElementById('clk-ist').textContent = fmt('Europe/Istanbul');
    document.getElementById('clk-lon').textContent = fmt('Europe/London');
    document.getElementById('clk-nyc').textContent = fmt('America/New_York');
    document.getElementById('clk-tok').textContent = fmt('Asia/Tokyo');
  }

  function updateKdvCalc() {
    const amt = Math.max(0, Number(document.getElementById('kdv-amount').value) || 0);
    const rate = Number(document.getElementById('kdv-rate').value) || 0;
    const disc = Math.min(99, Math.max(0, Number(document.getElementById('kdv-disc').value) || 0));
    const tax = amt * (rate / 100);
    document.getElementById('kdv-out-tax').textContent = formatTR(tax, 2) + ' ₺';
    document.getElementById('kdv-out-inc').textContent = formatTR(amt + tax, 2) + ' ₺';
    document.getElementById('kdv-out-disc').textContent = formatTR(amt * (1 - disc / 100), 2) + ' ₺';
  }
  ['kdv-amount', 'kdv-rate', 'kdv-disc'].forEach(id => document.getElementById(id).addEventListener('input', updateKdvCalc));

  document.getElementById('qr-generate-btn').addEventListener('click', () => {
    const val = document.getElementById('qr-text-input').value.trim() || 'https://pusula-web-opal.vercel.app';
    document.getElementById('qr-preview-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(val);
    showToast('QR kod güncellendi!');
  });

  function generateStrongPwd() {
    const len = Number(document.getElementById('pwd-len').value) || 16;
    document.getElementById('pwd-len-val').textContent = len;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*?';
    let out = '';
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    document.getElementById('pwd-output').textContent = out;
  }
  document.getElementById('pwd-len').addEventListener('input', generateStrongPwd);
  document.getElementById('pwd-gen-btn').addEventListener('click', generateStrongPwd);
  document.getElementById('pwd-copy-btn').addEventListener('click', () => {
    const val = document.getElementById('pwd-output').textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(val).then(() => showToast('Güçlü şifre kopyalandı!'));
  });

  // =====================================================
  // QUICK BOOKMARKS (SIK KULLANDIKLARIM)
  // =====================================================
  const DEFAULT_BOOKMARKS = [
    { id: 'b1', name: 'Google', url: 'https://www.google.com' },
    { id: 'b2', name: 'GitHub', url: 'https://github.com' },
    { id: 'b3', name: 'e-Devlet', url: 'https://www.turkiye.gov.tr' },
    { id: 'b4', name: 'MDN Docs', url: 'https://developer.mozilla.org/tr/' },
    { id: 'b5', name: 'YouTube', url: 'https://www.youtube.com' },
    { id: 'b6', name: 'TradingView', url: 'https://tr.tradingview.com' }
  ];
  let userBookmarks = DEFAULT_BOOKMARKS;
  try {
    const rawBm = localStorage.getItem('pusula_bookmarks');
    if (rawBm) {
      const parsedBm = JSON.parse(rawBm);
      if (Array.isArray(parsedBm) && parsedBm.length) userBookmarks = parsedBm;
    }
  } catch (e) {}

  function saveBookmarks() {
    try { localStorage.setItem('pusula_bookmarks', JSON.stringify(userBookmarks)); } catch (e) {}
  }

  function renderBookmarks() {
    const bar = document.getElementById('bookmarks-bar');
    bar.innerHTML = userBookmarks.map(b => `
      <div class="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg bg-paper border border-hairline hover:border-ocean/40 transition text-xs">
        <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" class="font-medium text-ink hover:text-ocean">${escapeHtml(b.name)}</a>
        <button type="button" data-del-bm="${escapeHtml(b.id)}" class="p-0.5 text-muted hover:text-terracotta" aria-label="Kısayolu kaldır">
          <i data-lucide="x" class="w-3 h-3"></i>
        </button>
      </div>
    `).join('');
    lucide.createIcons();
  }

  document.getElementById('toggle-add-bm-btn').addEventListener('click', () => {
    document.getElementById('add-bookmark-form').classList.toggle('hidden');
  });
  document.getElementById('add-bookmark-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bm-name-input').value.trim();
    const url = document.getElementById('bm-url-input').value.trim();
    if (!name || !url) return;
    userBookmarks.push({ id: 'b' + Date.now(), name, url });
    saveBookmarks();
    renderBookmarks();
    e.target.reset();
    e.target.classList.add('hidden');
    showToast(name + ' sık kullanılanlara eklendi.');
  });
  document.addEventListener('click', (e) => {
    const delBm = e.target.closest('[data-del-bm]');
    if (delBm) {
      userBookmarks = userBookmarks.filter(x => x.id !== delBm.dataset.delBm);
      saveBookmarks();
      renderBookmarks();
    }
  });

  // =====================================================
  // FEEDBACK & LEGAL MODALS
  // =====================================================
  const fbModal = document.getElementById('feedback-modal');
  const legalModal = document.getElementById('legal-modal');
  document.getElementById('open-feedback-btn').addEventListener('click', () => {
    if (currentUser && !document.getElementById('fb-email').value) document.getElementById('fb-email').value = currentUser.email;
    fbModal.classList.remove('hidden'); fbModal.classList.add('flex');
  });
  document.getElementById('close-feedback-modal').addEventListener('click', () => {
    fbModal.classList.add('hidden'); fbModal.classList.remove('flex');
  });
  document.getElementById('feedback-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('fb-type').value;
    const email = document.getElementById('fb-email').value.trim();
    const msg = document.getElementById('fb-message').value.trim();
    if (!msg) return;
    if (sbClient) {
      try {
        await sbClient.from('payment_requests').insert({
          user_id: currentUser && currentUser.id !== 'local' ? currentUser.id : null,
          email: email || 'anonim@pusula',
          sender_name: 'GERİ BİLDİRİM: ' + type,
          plan: 'Geri Bildirim',
          note: msg,
          status: 'mesaj'
        });
      } catch (err) {}
    }
    e.target.reset();
    fbModal.classList.add('hidden'); fbModal.classList.remove('flex');
    showToast('Geri bildiriminiz iletildi, teşekkür ederiz!');
  });

  function openLegal(type) {
    const titleEl = document.getElementById('legal-modal-title');
    const bodyEl = document.getElementById('legal-modal-body');
    if (type === 'about') {
      titleEl.textContent = 'Kurucu Hakkında & Sitenin Amacı';
      bodyEl.innerHTML = `
        <p><strong>Kurucu &amp; Proje Mimarı:</strong> <strong>Tayfun KAYA</strong></p>
        <p><strong>İletişim E-postası:</strong> <a href="mailto:tayfunkaya49@gmail.com" class="text-ocean underline">tayfunkaya49@gmail.com</a></p>
        <p><strong>Sitenin Amacı:</strong> Pusula; Yapay Zeka &amp; Yazılım eğitimlerini (LLM, Python, ES6+, Git), başlangıçtan uzman VBA/Copilot seviyesine kadar Microsoft Office program eğitimlerini (Excel, Word, PowerPoint, Outlook), canlı finans/haber akışını, bütçe &amp; simülatör araçlarını, T.C. mevzuat rehberini ve kullanıcıya özel bulut veri kasasını tek bir modern merkezde toplamak amacıyla geliştirilmiştir.</p>
        <p><strong>Bilgilendirme Notu:</strong> Platformdaki tüm eğitimler, finansal göstergeler, AI önerileri ve hukuki özetler genel bilgilendirme amaçlıdır; profesyonel yatırım veya hukuki danışmanlık yerine geçmez.</p>
      `;
    } else if (type === 'privacy') {
      titleEl.textContent = 'Gizlilik Politikası';
      bodyEl.innerHTML = `
        <p><strong>1. Kişisel Veri Saklama:</strong> Misafir kullanımda tüm görevleriniz, akademi ilerlemeniz ve ofis çalışmalarınız yalnızca kendi tarayıcınızda saklanır. Hesabınızla giriş yaptığınızda verileriniz hesabınıza özel izole edilir ve Supabase bulut altyapınız üzerinden senkronize edilebilir.</p>
        <p><strong>2. Veri Paylaşımı:</strong> Verileriniz üçüncü taraf reklam ağlarına satılmaz veya paylaşılmaz. İletişim: tayfunkaya49@gmail.com</p>
      `;
    } else {
      titleEl.textContent = 'Site Kuralları & Kullanım Koşulları';
      bodyEl.innerHTML = `
        <p><strong>1. Kurucu &amp; Fikri Mülkiyet:</strong> Pusula platformunun tasarımı, eğitim kurgusu ve araç bütünü kurucusu <strong>Tayfun KAYA</strong> adına korunmaktadır; kaynak kod/içerikler izinsiz ticari dağıtılamaz.</p>
        <p><strong>2. Bilgilendirme Esası:</strong> Platformda yer alan piyasa kurları, kredi/yatırım simülasyonları, yapay zeka yanıtları ve T.C. mevzuat özetleri yalnızca eğitim ve genel bilgilendirme amaçlıdır; bağlayıcı tavsiye niteliği taşımaz.</p>
        <p><strong>3. Hesap &amp; Adil Kullanım:</strong> Her kullanıcı kendi hesabına ait veri kasasından sorumludur; sisteme otomatik saldırı veya yetkisiz erişim girişimleri yasaktır. İletişim: tayfunkaya49@gmail.com</p>
      `;
    }
    legalModal.classList.remove('hidden'); legalModal.classList.add('flex');
  }
  const openAboutBtn = document.getElementById('open-about-btn');
  if (openAboutBtn) openAboutBtn.addEventListener('click', () => openLegal('about'));
  document.getElementById('open-privacy-btn').addEventListener('click', () => openLegal('privacy'));
  document.getElementById('open-terms-btn').addEventListener('click', () => openLegal('terms'));
  document.getElementById('close-legal-modal').addEventListener('click', () => {
    legalModal.classList.add('hidden'); legalModal.classList.remove('flex');
  });

  // =====================================================
  // XOX, GENERAL TRIVIA QUIZ, MEMORY MATCH & REFLEX
  // =====================================================
  let xoxBoard = Array(9).fill(''), xoxOver = false, xoxScoreX = 0, xoxScoreO = 0;
  const XOX_WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function checkXoxWinner(b) {
    for (const [a, c, d] of XOX_WINS) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
    return b.includes('') ? null : 'DRAW';
  }
  function renderXox() {
    document.getElementById('xox-board').innerHTML = xoxBoard.map((cell, idx) => `
      <button type="button" data-xox-cell="${idx}" class="aspect-square rounded-xl border-2 text-3xl font-bold flex items-center justify-center transition ${
        cell === 'X' ? 'border-forest bg-forestLight text-forest' :
        cell === 'O' ? 'border-terracotta bg-terracottaLight text-terracotta' :
        'border-hairline bg-paper hover:border-forest/50 text-ink'
      }">${cell}</button>
    `).join('');
    document.getElementById('xox-score-x').textContent = xoxScoreX;
    document.getElementById('xox-score-o').textContent = xoxScoreO;
  }
  function xoxAiMove() {
    if (xoxOver) return;
    const diff = document.getElementById('xox-difficulty').value;
    const empty = xoxBoard.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
    if (!empty.length) return;
    let pick = -1;
    for (const i of empty) { xoxBoard[i] = 'O'; if (checkXoxWinner(xoxBoard) === 'O') { pick = i; xoxBoard[i] = ''; break; } xoxBoard[i] = ''; }
    if (pick === -1 && (diff === 'hard' || Math.random() < 0.75)) {
      for (const i of empty) { xoxBoard[i] = 'X'; if (checkXoxWinner(xoxBoard) === 'X') { pick = i; xoxBoard[i] = ''; break; } xoxBoard[i] = ''; }
    }
    if (pick === -1 && empty.includes(4) && diff === 'hard') pick = 4;
    if (pick === -1) pick = empty[Math.floor(Math.random() * empty.length)];
    xoxBoard[pick] = 'O';
    const w = checkXoxWinner(xoxBoard);
    const st = document.getElementById('xox-status');
    if (w === 'O') { xoxOver = true; xoxScoreO++; st.textContent = 'Yapay Zeka (O) kazandı!'; st.className = 'text-center text-xs font-semibold text-terracotta min-h-[18px]'; }
    else if (w === 'DRAW') { xoxOver = true; st.textContent = 'Berabere!'; st.className = 'text-center text-xs font-semibold text-muted min-h-[18px]'; }
    else { st.textContent = 'Sıra sizde (X)'; st.className = 'text-center text-xs font-semibold text-forest min-h-[18px]'; }
    renderXox();
  }
  document.addEventListener('click', (e) => {
    const cellBtn = e.target.closest('[data-xox-cell]');
    if (!cellBtn || xoxOver) return;
    const idx = Number(cellBtn.dataset.xoxCell);
    if (xoxBoard[idx] !== '') return;
    xoxBoard[idx] = 'X'; renderXox();
    const w = checkXoxWinner(xoxBoard);
    const st = document.getElementById('xox-status');
    if (w === 'X') { xoxOver = true; xoxScoreX++; st.textContent = 'Tebrikler, siz (X) kazandınız!'; st.className = 'text-center text-xs font-semibold text-forest min-h-[18px]'; renderXox(); }
    else if (w === 'DRAW') { xoxOver = true; st.textContent = 'Berabere!'; st.className = 'text-center text-xs font-semibold text-muted min-h-[18px]'; }
    else { st.textContent = 'Yapay Zeka düşünüyor...'; setTimeout(xoxAiMove, 320); }
  });
  document.getElementById('xox-restart-btn').addEventListener('click', () => {
    xoxBoard = Array(9).fill(''); xoxOver = false;
    document.getElementById('xox-status').textContent = 'Sıra sizde (X)';
    renderXox();
  });

  const LOCAL_TR_QUIZ_BANK = [
    { q: 'Türkiye’nin en uzun kara sınırına sahip olduğu komşu ülke hangisidir?', opts: ['İran', 'Suriye', 'Yunanistan', 'Irak'], ans: 1, exp: 'Türkiye’nin en uzun kara sınırı yaklaşık 911 km ile Suriye iledir.' },
    { q: 'Bir şirketin halka arz edilerek borsada işlem görmeye başlamasına ne ad verilir?', opts: ['Enflasyon', 'IPO (İlk Halka Arz)', 'Deflasyon', 'Arbitraj'], ans: 1, exp: 'IPO, bir şirketin hisselerini ilk kez halka açmasıdır.' },
    { q: '“Kürk Mantolu Madonna” romanının yazarı kimdir?', opts: ['Yaşar Kemal', 'Sabahattin Ali', 'Ahmet Hamdi Tanpınar', 'Oğuz Atay'], ans: 1, exp: 'Sabahattin Ali tarafından 1943 yılında yayımlanmıştır.' },
    { q: 'Türkiye’de mesafeli satışlarda tüketicinin koşulsuz cayma hakkı kaç gündür?', opts: ['3 gün', '7 gün', '14 gün', '30 gün'], ans: 2, exp: '6502 sayılı TKHK m.48 uyarınca cayma süresi 14 gündür.' },
    { q: 'UNESCO Dünya Mirası Listesi’ndeki Göbeklitepe hangi ilimizdedir?', opts: ['Mardin', 'Gaziantep', 'Şanlıurfa', 'Adıyaman'], ans: 2, exp: 'Göbeklitepe Şanlıurfa il sınırları içindedir.' },
    { q: 'Nobel Kimya Ödülü’nü (2015) kazanan Türk bilim insanı kimdir?', opts: ['Cahit Arf', 'Aziz Sancar', 'Oktay Sinanoğlu', 'Fuat Sezgin'], ans: 1, exp: 'Prof. Dr. Aziz Sancar, DNA onarım mekanizması çalışmalarıyla Nobel Kimya Ödülü’nü almıştır.' },
    { q: 'Periyodik tabloda “Au” sembolü hangi elementi ifade eder?', opts: ['Gümüş', 'Altın', 'Alüminyum', 'Bakır'], ans: 1, exp: 'Au (Latince Aurum) altının kimyasal sembolüdür.' },
    { q: 'İstiklal Marşı’nın bestecisi kimdir?', opts: ['Mehmet Akif Ersoy', 'Osman Zeki Üngör', 'Cemal Reşit Rey', 'Ahmet Adnan Saygun'], ans: 1, exp: 'Sözleri Mehmet Akif Ersoy’a, bestesi Osman Zeki Üngör’e aittir.' }
  ];
  let quizPool = [], quizIdx = 0, quizScore = 0, quizAnswered = false, quizTotalAsked = 0;
  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function decodeHtmlEntities(str) { const txt = document.createElement('textarea'); txt.innerHTML = str; return txt.value; }
  async function fetchOnlineTriviaQuestions() {
    const btn = document.getElementById('quiz-online-btn');
    btn.textContent = 'Yükleniyor...';
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      if (res.ok) {
        const data = await res.json();
        if (data?.results?.length) {
          const onlineQs = data.results.map(item => {
            const correct = decodeHtmlEntities(item.correct_answer);
            const opts = shuffleArr([correct, ...item.incorrect_answers.map(decodeHtmlEntities)]);
            return { q: `[Global · ${decodeHtmlEntities(item.category)}] ${decodeHtmlEntities(item.question)}`, opts, ans: opts.indexOf(correct), exp: 'Doğru cevap: ' + correct };
          });
          quizPool = shuffleArr([...onlineQs, ...shuffleArr(LOCAL_TR_QUIZ_BANK)]);
          quizIdx = 0; btn.textContent = 'Yeni Sorular ↻'; renderQuiz();
          showToast('İnternetten yeni sorular yüklendi!'); return;
        }
      }
    } catch (err) {}
    quizPool = shuffleArr(LOCAL_TR_QUIZ_BANK); quizIdx = 0; btn.textContent = 'Yeni Sorular ↻'; renderQuiz();
    showToast('Türkçe soru havuzundan yeni sorular karıştırıldı!');
  }
  function renderQuiz() {
    if (!quizPool.length || quizIdx >= quizPool.length) { quizPool = shuffleArr(LOCAL_TR_QUIZ_BANK); quizIdx = 0; }
    const item = quizPool[quizIdx];
    quizAnswered = false;
    document.getElementById('quiz-progress-badge').textContent = `Soru #${quizTotalAsked + 1}`;
    document.getElementById('quiz-question-text').textContent = item.q;
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next-btn').classList.add('hidden');
    document.getElementById('quiz-score-label').innerHTML = `Doğru: <strong class="text-ink tabular">${quizScore}</strong> / ${quizTotalAsked}`;
    document.getElementById('quiz-options-box').innerHTML = item.opts.map((opt, i) => `
      <button type="button" data-quiz-opt="${i}" class="w-full text-left px-3.5 py-2.5 rounded-lg border border-hairline bg-surface hover:border-plum text-xs font-medium text-ink transition">${escapeHtml(opt)}</button>
    `).join('');
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-quiz-opt]');
    if (!btn || quizAnswered || !quizPool[quizIdx]) return;
    quizAnswered = true; quizTotalAsked++;
    const chosen = Number(btn.dataset.quizOpt), item = quizPool[quizIdx], fb = document.getElementById('quiz-feedback');
    document.querySelectorAll('[data-quiz-opt]').forEach((b, i) => {
      if (i === item.ans) b.className = 'w-full text-left px-3.5 py-2.5 rounded-lg border border-forest bg-forestLight text-forest text-xs font-semibold';
      else if (i === chosen) b.className = 'w-full text-left px-3.5 py-2.5 rounded-lg border border-terracotta bg-terracottaLight text-terracotta text-xs font-medium';
    });
    if (chosen === item.ans) { quizScore++; fb.textContent = 'Doğru! ' + item.exp; fb.className = 'text-xs font-medium text-forest'; }
    else { fb.textContent = 'Yanlış. ' + item.exp; fb.className = 'text-xs font-medium text-terracotta'; }
    document.getElementById('quiz-score-label').innerHTML = `Doğru: <strong class="text-ink tabular">${quizScore}</strong> / ${quizTotalAsked}`;
    document.getElementById('quiz-next-btn').classList.remove('hidden');
  });
  document.getElementById('quiz-next-btn').addEventListener('click', () => { quizIdx++; renderQuiz(); });
  document.getElementById('quiz-online-btn').addEventListener('click', fetchOnlineTriviaQuestions);
  document.getElementById('quiz-restart-btn').addEventListener('click', () => { quizScore = 0; quizTotalAsked = 0; quizPool = shuffleArr(LOCAL_TR_QUIZ_BANK); quizIdx = 0; renderQuiz(); });

  // Memory Cards
  const MC_ICONS = ['🧭','🎵','📺','💡','📚','☕','🌿','⚡'];
  let mcCards = [], mcFlipped = [], mcMatched = 0, mcMoves = 0, mcLock = false;
  function initMemoryCards() {
    mcCards = shuffleArr([...MC_ICONS, ...MC_ICONS]).map((sym, idx) => ({ idx, sym, open: false, done: false }));
    mcFlipped = []; mcMatched = 0; mcMoves = 0; mcLock = false;
    document.getElementById('mc-moves').textContent = '0';
    document.getElementById('mc-status').textContent = 'Aynı iki simgeyi bularak tüm kartları eşleştirin.';
    renderMemoryCards();
  }
  function renderMemoryCards() {
    document.getElementById('mc-board').innerHTML = mcCards.map(c => `
      <button type="button" data-mc-idx="${c.idx}" class="aspect-square rounded-xl border-2 text-2xl flex items-center justify-center transition ${
        c.done ? 'border-forest bg-forestLight' : c.open ? 'border-ocean bg-oceanLight' : 'border-hairline bg-paper hover:border-ocean/50'
      }">${c.open || c.done ? c.sym : '?'}</button>
    `).join('');
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mc-idx]');
    if (!btn || mcLock) return;
    const c = mcCards[Number(btn.dataset.mcIdx)];
    if (!c || c.open || c.done) return;
    c.open = true; mcFlipped.push(c); renderMemoryCards();
    if (mcFlipped.length === 2) {
      mcMoves++; document.getElementById('mc-moves').textContent = mcMoves;
      const [a, b] = mcFlipped;
      if (a.sym === b.sym) {
        a.done = true; b.done = true; mcMatched += 2; mcFlipped = []; renderMemoryCards();
        if (mcMatched === mcCards.length) document.getElementById('mc-status').textContent = `Harika! Tüm kartları ${mcMoves} hamlede eşleştirdiniz.`;
      } else {
        mcLock = true;
        setTimeout(() => { a.open = false; b.open = false; mcFlipped = []; mcLock = false; renderMemoryCards(); }, 650);
      }
    }
  });
  document.getElementById('mc-restart-btn').addEventListener('click', initMemoryCards);

  // Reflex Speed Test
  let rfxState = 'idle', rfxTimer = null, rfxStartTs = 0, rfxBest = null;
  try { const sb = Number(localStorage.getItem('pusula_rfx_best')); if (sb > 50) rfxBest = sb; } catch (e) {}
  if (rfxBest) document.getElementById('rfx-best-badge').textContent = 'En İyi: ' + rfxBest + ' ms';
  document.getElementById('rfx-box').addEventListener('click', () => {
    const box = document.getElementById('rfx-box');
    const mainTxt = document.getElementById('rfx-main-text');
    const subTxt = document.getElementById('rfx-sub-text');
    if (rfxState === 'idle') {
      rfxState = 'wait';
      box.className = 'w-full h-44 rounded-2xl bg-terracotta text-paper flex flex-col items-center justify-center gap-1.5 transition select-none';
      mainTxt.textContent = 'Bekleyin...'; subTxt.textContent = 'Yeşil olunca hemen tıklayın';
      clearTimeout(rfxTimer);
      rfxTimer = setTimeout(() => {
        rfxState = 'go'; rfxStartTs = performance.now();
        box.className = 'w-full h-44 rounded-2xl bg-forest text-paper flex flex-col items-center justify-center gap-1.5 transition select-none';
        mainTxt.textContent = 'ŞİMDİ TIKLA!'; subTxt.textContent = 'Hemen basın!';
      }, 1500 + Math.random() * 2600);
    } else if (rfxState === 'wait') {
      clearTimeout(rfxTimer); rfxState = 'idle';
      box.className = 'w-full h-44 rounded-2xl bg-amberwarm text-paper flex flex-col items-center justify-center gap-1.5 transition select-none';
      mainTxt.textContent = 'Çok Erken Bastınız!'; subTxt.textContent = 'Tekrar denemek için tıklayın';
    } else if (rfxState === 'go') {
      const ms = Math.round(performance.now() - rfxStartTs);
      rfxState = 'idle';
      box.className = 'w-full h-44 rounded-2xl bg-ocean text-paper flex flex-col items-center justify-center gap-1.5 transition select-none';
      mainTxt.textContent = ms + ' ms';
      const rank = ms < 210 ? 'F1 Pilotu Refleksi!' : ms < 270 ? 'Çok Hızlı!' : ms < 340 ? 'İyi Skor' : 'Biraz daha hızlı olabilirsiniz';
      subTxt.textContent = rank + ' · Tekrar için tıklayın';
      document.getElementById('rfx-last-label').textContent = 'Son: ' + ms + ' ms';
      document.getElementById('rfx-rank-label').textContent = rank;
      if (!rfxBest || ms < rfxBest) {
        rfxBest = ms;
        try { localStorage.setItem('pusula_rfx_best', String(rfxBest)); } catch (e) {}
        document.getElementById('rfx-best-badge').textContent = 'En İyi: ' + rfxBest + ' ms';
      }
    }
  });

  // =====================================================
  // TEMPLATES & TR LAWS
  // =====================================================
  const LIFE_TEMPLATES = [
    { id: 'tpl_savci', cat: 'Adliye', mode: 'doc', title: 'Cumhuriyet Başsavcılığına Suç Duyurusu / Şikayet', desc: 'Dolandırıcılık, tehdit, hakaret veya bilişim suçları için savcılık şikayet dilekçesi.', content: '… CUMHURİYET BAŞSAVCILIĞINA\n\nMÜŞTEKİ (ŞİKAYETÇİ): Ad Soyad, T.C. Kimlik No, Adres\nŞÜPHELİ: Ad Soyad / Bilinmiyorsa "Kimliği Meçhul Şüpheli"\nSUÇ: Dolandırıcılık / Tehdit / Hakaret / Bilişim Suçu\n\nAÇIKLAMALAR:\n1. … tarihinde … olayını yaşamış bulunmaktayım.\n2. Olayla ilgili ekran görüntüleri ve dekontlar ekte sunulmuştur.\n\nSONUÇ VE İSTEM: Şüpheli hakkında gerekli soruşturmanın yapılarak kamu davası açılmasını arz ederim.\n\nAd Soyad — İmza' },
    { id: 'tpl_icra', cat: 'Adliye', mode: 'doc', title: 'İcra Müdürlüğüne Borca İtiraz Dilekçesi (7 Gün)', desc: 'Haksız veya zamanaşımına uğramış icra ödeme emrine yasal 7 gün içinde itiraz dilekçesi.', content: '… İCRA MÜDÜRLÜĞÜNE\nDOSYA NO: … E.\n\nBORÇLU (İTİRAZ EDEN): Ad Soyad, T.C. Kimlik No, Adres\nKONU: Ödeme emrine, borca, faize ve tüm fer’ilerine itirazımın sunulmasıdır.\n\nSONUÇ VE İSTEM: İİK m.62 uyarınca borcun tamamına itiraz ediyor, hakkımdaki icra takibinin durdurulmasını talep ederim.\n\nAd Soyad — İmza' },
    { id: 'tpl_veraset', cat: 'Adliye', mode: 'doc', title: 'Veraset İlamı (Mirasçılık Belgesi) Dilekçesi', desc: 'Sulh Hukuk Mahkemesinden mirasçılık belgesi almak için hazır başvuru dilekçesi.', content: '… NÖBETÇİ SULH HUKUK MAHKEMESİNE\n\nDAVACI: Ad Soyad, T.C. Kimlik No, Adres\nKONU: Mirasçılık belgesi verilmesi talebidir.\n\nAd Soyad — İmza' },
    { id: 'tpl_adliyardim', cat: 'Adliye', mode: 'doc', title: 'Adli Yardım (Ücretsiz Avukat / Harç Muafiyeti)', desc: 'Maddi durumu yetersiz vatandaşların yargılama giderlerinden muafiyet talebi.', content: '… MAHKEMESİ SAYIN HAKİMLİĞİNE\n\nTALEP EDEN: Ad Soyad, T.C., Adres\nKONU: HMK m.334 vd. gereğince adli yardım talebimdir.\n\nAd Soyad — İmza' },
    { id: 'tpl4', cat: 'Tüketici', mode: 'doc', title: 'Tüketici Hakem Heyetine Ayıplı Mal İade Dilekçesi', desc: 'Arızalı veya ayıplı çıkan ürünlerde 6502 sayılı kanuna göre bedel iadesi başvurusu.', content: '… TÜKETİCİ HAKEM HEYETİ BAŞKANLIĞINA\n\nBAŞVURAN: Ad Soyad, T.C., Adres, Telefon\nŞİKAYET EDİLEN FİRMA: Firma Ünvanı, Adres\n\nAÇIKLAMALAR:\nSatın aldığım ürün ayıplı çıkmıştır. 6502 sayılı TKHK m.11 kapsamındaki seçimlik hakkımı kullanarak bedel iadesi talep ediyorum.\n\nAd Soyad — İmza' },
    { id: 'tpl_cayma', cat: 'Tüketici', mode: 'doc', title: 'E-Ticaret 14 Gün Cayma Hakkı Bildirimi', desc: 'İnternetten alınan ürünü 14 gün içinde hiçbir gerekçe göstermeden iade bildirimi.', content: '… FİRMASI MÜŞTERİ HİZMETLERİNE\n\n6502 sayılı TKHK m.48 uyarınca 14 günlük yasal cayma hakkımı kullanarak ürünü iade ediyor, ödediğim tutarın iadesini talep ediyorum.\n\nAd Soyad — İletişim' },
    { id: 'tpl1', cat: 'Tüketici', mode: 'doc', title: 'Abonelik İptal Dilekçesi (İnternet / GSM / TV)', desc: 'Taahhütsüz veya süresi dolan abonelikleri tek taraflı sonlandırma.', content: 'İLGİLİ KURUM MÜDÜRLÜĞÜNE,\n\n… numaralı aboneliğimin 6502 sayılı TKHK m.52 uyarınca feshedilmesini arz ederim.\n\nAd Soyad — İmza' },
    { id: 'tpl_cimer', cat: 'Kamu', mode: 'doc', title: 'CİMER / 4982 Bilgi Edinme Başvuru Taslağı', desc: 'Kamu kurumlarından resmi bilgi veya inceleme talep etmek için düzenli başvuru.', content: 'İLGİLİ KAMU KURUMUNA / CİMER BAŞVURUSU\n\n4982 sayılı Bilgi Edinme Hakkı Kanunu ve Anayasa m.74 kapsamında … konusu hakkında güncel durumun tarafıma bildirilmesini arz ederim.\n\nAd Soyad — T.C. — İletişim' },
    { id: 'tpl_kvkk', cat: 'Kamu', mode: 'doc', title: 'KVKK Veri Silme & İstenmeyen SMS İptal Başvurusu', desc: '6698 sayılı KVKK m.11 gereği kişisel verilerinizin silinmesi ve ticari ileti iptali.', content: '… ŞİRKETİ VERİ SORUMLUSUNA\n\n6698 sayılı KVKK m.11 uyarınca kişisel verilerimin silinmesini ve tarafıma ticari ileti gönderilmesinin durdurulmasını talep ederim.\n\nAd Soyad — Telefon' },
    { id: 'tpl2', cat: 'İş', mode: 'doc', title: 'Yıllık İzin Talep Dilekçesi', desc: 'İş yeriniz için hazır, kurumsal yıllık ücretli izin başvuru metni.', content: 'İNSAN KAYNAKLARI MÜDÜRLÜĞÜNE,\n\n4857 sayılı İş Kanunu kapsamında hak kazandığım yıllık ücretli iznimin …/… – …/… tarihleri arasında kullanılması hususunda gereğini arz ederim.\n\nAd Soyad — İmza' },
    { id: 'tpl3', cat: 'İş', mode: 'doc', title: 'İstifa Dilekçesi (Standart)', desc: 'Yasal ihbar süresine uygun, sade işten ayrılma dilekçesi.', content: 'İLGİLİ MAKAMA,\n\nYasal ihbar süresine uygun olarak …/… tarihi itibarıyla iş akdimin sonlandırılmasını arz ederim.\n\nAd Soyad — İmza' },
    { id: 'tpl_kidem', cat: 'İş', mode: 'doc', title: 'Kıdem / Fazla Mesai Alacağı Talep Taslağı', desc: 'Ödenmeyen işçilik alacakları için ön bildirim ve arabuluculuk taslağı.', content: '… ŞİRKETİ YÖNETİMİNE\n\nÖdenmeyen kıdem tazminatı, yıllık izin ve fazla mesai alacaklarımın 7 iş günü içinde hesabıma ödenmesini bildiririm.\n\nAd Soyad — IBAN — İmza' },
    { id: 'tpl6', cat: 'İş', mode: 'doc', title: 'Kira Sözleşmesi Kontrol Özeti', desc: 'Depozito (en fazla 3 kira), TÜFE artış oranı ve demirbaş kontrol listesi.', content: 'KİRA SÖZLEŞMESİ KONTROL LİSTESİ\n• Depozito (TBK m.342 — En fazla 3 kira)\n• Yıllık Artış (TBK m.344 — 12 Aylık TÜFE Ortalaması)\n• Demirbaş Fotoğrafları ve Sayaç Okumaları' },
    { id: 'tpl7', cat: 'Bütçe', mode: 'sheet', title: '50 / 30 / 20 Aylık Bütçe (Excel)', desc: 'Gelirinizi Zorunlu (%50), İstek (%30) ve Birikim (%20) olarak planlayın.', rows: [
      { id: 's1', item: 'Kira / Barınma (%50 Zorunlu)', cat: 'Zorunlu', qty: 1, price: 20000 },
      { id: 's2', item: 'Market & Faturalar (%50 Zorunlu)', cat: 'Zorunlu', qty: 1, price: 12000 },
      { id: 's3', item: 'Sosyal Yaşam & Kültür (%30 İstek)', cat: 'İstek', qty: 1, price: 8000 },
      { id: 's4', item: 'Acil Durum & Yatırım (%20 Birikim)', cat: 'Birikim', qty: 1, price: 10000 }
    ] },
    { id: 'tpl8', cat: 'Bütçe', mode: 'sheet', title: 'Borç Kapatma Planı (Excel)', desc: 'Borçlarınızı önceliklendirip aylık ödeme planınızı Excel’e aktarın.', rows: [
      { id: 'd1', item: '1. Öncelik — Küçük Borç', cat: 'Öncelik 1', qty: 1, price: 5000 },
      { id: 'd2', item: '2. Öncelik — Orta Borç', cat: 'Öncelik 2', qty: 1, price: 15000 },
      { id: 'd3', item: '3. Öncelik — Uzun Vadeli Plan', cat: 'Öncelik 3', qty: 1, price: 35000 }
    ] }
  ];
  let tplFilter = 'Tümü';
  function renderTemplates() {
    const grid = document.getElementById('templates-grid');
    const list = tplFilter === 'Tümü' ? LIFE_TEMPLATES : LIFE_TEMPLATES.filter(t => t.cat === tplFilter);
    grid.innerHTML = list.map(t => `
      <div class="editorial-card ${t.mode === 'sheet' ? 'accent-top-forest' : 'accent-top-plum'} p-5 flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px]">
            <span class="px-2 py-0.5 rounded font-medium ${t.mode === 'sheet' ? 'bg-forestLight text-forest' : 'bg-plumLight text-plum'}">${escapeHtml(t.cat)}</span>
            <span class="text-muted">${t.mode === 'sheet' ? 'Excel / CSV' : 'PDF / Word'}</span>
          </div>
          <h3 class="font-editorial text-lg text-ink">${escapeHtml(t.title)}</h3>
          <p class="text-xs text-muted leading-relaxed">${escapeHtml(t.desc)}</p>
        </div>
        <button type="button" data-use-tpl="${t.id}" class="w-full py-2 rounded-lg text-xs font-medium transition ${t.mode === 'sheet' ? 'bg-forest hover:bg-forest/90 text-paper' : 'bg-plum hover:bg-plum/90 text-paper'}">
          Şablonu Aç &amp; Düzenle →
        </button>
      </div>
    `).join('');
  }
  document.querySelectorAll('.tpl-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tplFilter = btn.dataset.tplCat;
      document.querySelectorAll('.tpl-cat-btn').forEach(b => {
        b.className = 'tpl-cat-btn px-3 py-1.5 rounded-full text-xs font-medium ' + (b === btn ? 'bg-plum text-paper' : 'bg-surface border border-hairline text-muted');
      });
      renderTemplates();
    });
  });

  const petModal = document.getElementById('petition-modal');
  function updatePetWordCount() {
    const txt = document.getElementById('pet-body-input').value.trim();
    document.getElementById('pet-word-stat').textContent = (txt ? txt.split(/\s+/).length : 0) + ' kelime · ' + txt.length + ' karakter';
  }
  function openPetitionStudio(tpl) {
    document.getElementById('pet-modal-heading').textContent = tpl.title;
    document.getElementById('pet-title-input').value = tpl.title;
    document.getElementById('pet-body-input').value = tpl.content;
    updatePetWordCount();
    petModal.classList.remove('hidden'); petModal.classList.add('flex');
    lucide.createIcons();
  }
  document.getElementById('close-petition-modal').addEventListener('click', () => { petModal.classList.add('hidden'); petModal.classList.remove('flex'); });
  document.getElementById('pet-body-input').addEventListener('input', updatePetWordCount);
  document.getElementById('pet-autofill-btn').addEventListener('click', () => {
    const nm = document.getElementById('pet-fill-name').value.trim();
    const tc = document.getElementById('pet-fill-tc').value.trim();
    const ph = document.getElementById('pet-fill-phone').value.trim();
    const area = document.getElementById('pet-body-input');
    let text = area.value;
    if (nm) text = text.replace(/Ad Soyad/g, nm);
    if (tc) text = text.replace(/T\.C\. Kimlik No|T\.C\./g, 'T.C.: ' + tc);
    if (ph) text = text.replace(/Telefon|İletişim/g, ph);
    area.value = text; updatePetWordCount(); showToast('Bilgileriniz dilekçe metnine işlendi!');
  });
  document.getElementById('pet-copy-btn').addEventListener('click', () => {
    const full = document.getElementById('pet-title-input').value + '\n\n' + document.getElementById('pet-body-input').value;
    if (navigator.clipboard) navigator.clipboard.writeText(full).then(() => showToast('Dilekçe metni kopyalandı!'));
  });
  document.getElementById('pet-word-btn').addEventListener('click', () => {
    const title = document.getElementById('pet-title-input').value || 'Dilekce';
    const body = document.getElementById('pet-body-input').value.replace(/\n/g, '<br>');
    const docHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title></head><body style="font-family:Times New Roman,serif;line-height:1.7;margin:40px;"><h2 style="text-align:center;">${escapeHtml(title)}</h2><p>${body}</p></body></html>`;
    triggerDownload('pusula-dilekce.doc', docHtml, 'application/msword;charset=utf-8;');
    showToast('Dilekçe Word (.doc) olarak indirildi.');
  });
  document.getElementById('pet-pdf-btn').addEventListener('click', () => {
    const title = document.getElementById('pet-title-input').value || 'Dilekçe';
    const body = escapeHtml(document.getElementById('pet-body-input').value).replace(/\n/g, '<br>');
    const win = window.open('', '_blank', 'width=820,height=960');
    if (!win) { showToast('Açılır pencereye izin verin.'); return; }
    win.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title><style>body{font-family:Georgia,serif;color:#111;max-width:720px;margin:48px auto;padding:0 28px;line-height:1.8;font-size:15px;}h2{text-align:center;font-size:18px;margin-bottom:28px;text-transform:uppercase;}</style></head><body><h2>${escapeHtml(title)}</h2><div>${body}</div><script>window.onload=function(){window.print();}<\/script></body></html>`);
    win.document.close();
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-use-tpl]');
    if (!btn) return;
    const tpl = LIFE_TEMPLATES.find(x => x.id === btn.dataset.useTpl);
    if (!tpl) return;
    if (tpl.mode === 'sheet' && tpl.rows) {
      switchView('office');
      state.sheetRows = JSON.parse(JSON.stringify(tpl.rows));
      saveWorkspaceLocal();
      renderSheet();
      showToast(tpl.title + ' Excel tablosuna yüklendi!');
    } else openPetitionStudio(tpl);
  });

  const TR_LAWS = [
    { cat: 'Anayasa', code: 'T.C. Anayasası · Madde 36', title: 'Hak Arama Hürriyeti', text: 'Herkes, meşru vasıta ve yollardan faydalanmak suretiyle yargı mercileri önünde davacı veya davalı olarak iddia ve savunma ile adil yargılanma hakkına sahiptir.', tags: 'anayasa yargı dava mahkeme adil yargılanma hak', tplId: 'tpl_adliyardim' },
    { cat: 'Anayasa', code: 'T.C. Anayasası · Madde 74', title: 'Dilekçe, Bilgi Edinme ve Kamu Denetçisine Başvurma Hakkı', text: 'Vatandaşlar kendileriyle veya kamu ile ilgili dilek ve şikayetleri hakkında yetkili makamlara yazı ile başvurma hakkına sahiptir; başvuru sonucu gecikmeksizin yazılı olarak bildirilir.', tags: 'dilekçe şikayet cimer kamu başvuru bilgi edinme', tplId: 'tpl_cimer' },
    { cat: 'Borçlar / Kira', code: 'TBK (6098) · Madde 342', title: 'Kiracının Güvence (Depozito) Vermesi', text: 'Konut ve çatılı işyeri kiralarında güvence (depozito) üç aylık kira bedelini aşamaz ve vadeli tasarruf hesabına yatırılır.', tags: 'kira depozito güvence ev sahibi ev', tplId: 'tpl6' },
    { cat: 'Borçlar / Kira', code: 'TBK (6098) · Madde 344', title: 'Kira Bedelinin Belirlenmesi (TÜFE Sınırı)', text: 'Yenilenen kira dönemlerinde uygulanacak kira artışı bir önceki kira yılında TÜFE oniki aylık ortalamalara göre değişim oranını geçemez.', tags: 'kira artış zam tüfe oran ev sahibi', tplId: 'tpl6' },
    { cat: 'Tüketici', code: 'TKHK (6502) · Madde 11', title: 'Ayıplı Malda Tüketicinin Seçimlik Hakları', text: 'Malın ayıplı olması durumunda tüketici; bedel iadesi, ayıp oranında indirim, ücretsiz onarım veya ayıpsız misli ile değişim haklarından birini seçebilir.', tags: 'ayıplı mal bozuk ürün iade değişim garanti tüketici', tplId: 'tpl4' },
    { cat: 'Tüketici', code: 'TKHK (6502) · Madde 48', title: 'Mesafeli Sözleşmelerde 14 Gün Cayma Hakkı', text: 'Tüketici, internet üzerinden yapılan mesafeli alışverişlerde 14 gün içinde hiçbir gerekçe göstermeksizin sözleşmeden cayma hakkına sahiptir.', tags: 'internet alışveriş e-ticaret cayma 14 gün iade', tplId: 'tpl_cayma' },
    { cat: 'Tüketici', code: 'TKHK (6502) · Madde 52', title: 'Abonelik Sözleşmelerinin Feshi', text: 'Tüketici, belirsiz süreli veya 1 yıl+ süreli abonelik sözleşmesini herhangi bir gerekçe göstermeksizin istediği zaman feshetme hakkına sahiptir.', tags: 'abonelik internet gsm fatura iptal cayma bedeli', tplId: 'tpl1' },
    { cat: 'İş Hukuku', code: 'İş Kanunu (4857) · Madde 41', title: 'Fazla Çalışma (%50 Zamlı Ücret)', text: 'Haftalık 45 saati aşan çalışmalarda her bir saat fazla çalışma ücreti normal saatlik ücretin %50 yükseltilmesi suretiyle ödenir.', tags: 'fazla mesai ücret maaş çalışma saati', tplId: 'tpl_kidem' },
    { cat: 'İş Hukuku', code: 'İş Kanunu (4857) · Madde 53', title: 'Yıllık Ücretli İzin Süreleri', text: '1-5 yıl arası en az 14 gün, 5-15 yıl arası en az 20 gün, 15 yıl+ çalışanlara en az 26 gün yıllık izin verilir.', tags: 'yıllık izin tatil işçi hak', tplId: 'tpl2' },
    { cat: 'Ceza (TCK)', code: 'TCK (5237) · Madde 125 & 157', title: 'Hakaret ve Dolandırıcılık Suçları', text: 'Onur/saygınlığa saldırı veya hileli davranışla aldatma (bilişim/banka araçlı nitelikli dolandırıcılık) halinde savcılığa suç duyurusunda bulunulabilir.', tags: 'hakaret küfür dolandırıcılık bilişim savcılık şikayet', tplId: 'tpl_savci' },
    { cat: 'İcra & KVKK', code: 'İİK (2004) · Madde 62 & 83', title: 'İcra Ödeme Emrine İtiraz (7 Gün) & Maaş Haczi', text: 'İlamsız ödeme emrine tebliğden itibaren 7 gün içinde itiraz takibi durdurur. Maaş haczinde kural olarak en az 1/4 haczedilebilir.', tags: 'icra borç itiraz ödeme emri haciz maaş', tplId: 'tpl_icra' },
    { cat: 'İcra & KVKK', code: 'KVKK (6698) · Madde 11', title: 'Kişisel Verilerde İlgili Kişinin Hakları', text: 'Herkes veri sorumlusuna başvurarak verilerinin işlenip işlenmediğini öğrenme ve silinmesini isteme hakkına sahiptir.', tags: 'kvkk kişisel veri sms iptal gizlilik silme', tplId: 'tpl_kvkk' }
  ];
  let lawCat = 'Tümü', lawQuery = '';
  function renderLaws() {
    const q = lawQuery.trim().toLowerCase();
    const filtered = TR_LAWS.filter(l => (lawCat === 'Tümü' || l.cat === lawCat) && (!q || l.title.toLowerCase().includes(q) || l.text.toLowerCase().includes(q) || l.code.toLowerCase().includes(q) || l.tags.toLowerCase().includes(q)));
    const grid = document.getElementById('law-results-grid');
    if (!filtered.length) {
      grid.innerHTML = '<div class="col-span-full editorial-card p-8 text-center text-xs text-muted">Aradığınız kelimeyle eşleşen madde bulunamadı.</div>';
      return;
    }
    grid.innerHTML = filtered.map(l => `
      <article class="editorial-card accent-top-amber p-5 flex flex-col justify-between space-y-3">
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2 text-[11px]">
            <span class="px-2 py-0.5 rounded bg-amberLight text-amberwarm font-semibold">${escapeHtml(l.code)}</span>
            <span class="text-muted">${escapeHtml(l.cat)}</span>
          </div>
          <h3 class="font-editorial text-lg text-ink">${escapeHtml(l.title)}</h3>
          <p class="text-xs text-ink/85 leading-relaxed">${escapeHtml(l.text)}</p>
        </div>
        <div class="pt-2 border-t border-hairline flex items-center justify-between text-xs">
          <button type="button" data-use-tpl="${l.tplId}" class="text-forest font-medium hover:underline">İlgili Dilekçeyi Aç →</button>
          <button type="button" data-ask-law="${escapeHtml(l.code + ' - ' + l.title + ' hakkında pratik bilgi ver')}" class="text-ocean hover:underline">AI Asistana Sor</button>
        </div>
      </article>
    `).join('');
  }
  document.getElementById('law-search-input').addEventListener('input', (e) => { lawQuery = e.target.value; renderLaws(); });
  document.querySelectorAll('.law-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      lawCat = btn.dataset.lawCat;
      document.querySelectorAll('.law-cat-btn').forEach(b => {
        b.className = 'law-cat-btn px-3 py-1.5 rounded-full text-xs font-medium ' + (b === btn ? 'bg-ink text-paper' : 'bg-surface border border-hairline text-muted');
      });
      renderLaws();
    });
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-ask-law]');
    if (!btn) return;
    switchView('assistant');
    askPusulaAssistant(btn.dataset.askLaw);
  });

  // =====================================================
  // PUSULA AI ASSISTANT (GEMINI + BUILT-IN TECH & LAW ENGINE)
  // =====================================================
  const aiHistory = [
    { role: 'bot', text: 'Merhaba! Ben Pusula Akıllı Asistan.\n\n• **Yazılım, Python, JavaScript, Yapay Zeka & Prompt Mühendisliği** sorularınızı yanıtlayabilir ve sizi ilgili Akademi laboratuvarlarına yönlendirebilirim.\n• **T.C. mevzuatı, tüketici, kira, iş hukuku ve icra** konularında kanun maddesi ve hazır dilekçe taslağı sunabilirim.' }
  ];

  function getActiveGeminiKey() {
    try {
      const localKey = localStorage.getItem('pusula_gemini_key');
      if (localKey && localKey.trim().length > 10) return localKey.trim();
    } catch (e) {}
    return cfg.GEMINI_API_KEY && cfg.GEMINI_API_KEY.length > 10 ? cfg.GEMINI_API_KEY.trim() : '';
  }

  function formatAiTextSafe(raw) {
    let html = escapeHtml(raw);
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-paper border border-hairline font-mono-code text-[11px]">$1</code>');
    return html;
  }

  function renderAiChat() {
    const box = document.getElementById('ai-chat-messages');
    box.innerHTML = aiHistory.map(m => `
      <div class="flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-2.5 ${
          m.role === 'user' ? 'bg-forest text-paper' : 'bg-surface border border-hairline text-ink'
        }">
          <div class="whitespace-pre-line">${m.role === 'user' ? escapeHtml(m.text) : formatAiTextSafe(m.text)}</div>
          <div class="flex flex-wrap gap-2">
            ${m.tplId ? `<button type="button" data-use-tpl="${m.tplId}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forestLight text-forest font-semibold hover:bg-forest hover:text-paper transition">İlgili Dilekçeyi Aç →</button>` : ''}
            ${m.eduTab ? `<button type="button" data-jump-edu="${m.eduTab}" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-plumLight text-plum font-semibold hover:bg-plum hover:text-paper transition">${escapeHtml(m.eduLabel || 'Akademi Sekmesini Aç →')}</button>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    box.scrollTop = box.scrollHeight;
  }

  function builtInAssistantReply(q) {
    const t = q.toLowerCase();
    // Microsoft Office & Copilot Engine
    if (t.includes('excel') || t.includes('word') || t.includes('powerpoint') || t.includes('outlook') || t.includes('topla') || t.includes('düşeyara') || t.includes('çaprazara') || t.includes('vlookup') || t.includes('xlookup') || t.includes('pivot') || t.includes('vba') || t.includes('office') || t.includes('copilot') || t.includes('eğer') || t.includes('formül')) {
      return {
        text: '**Microsoft Office & AI Copilot Rehberi:**\n• **Excel Temel & Orta:** Sabitleme için `$A$1` (`F4`), özet için `=TOPLA(B2:B10)`, koşullu kontrol için `=EĞER(B2>=15000; "Hedef"; "Normal")` ve şartlı toplam için `=ETOPLA(B2:B10; "Yazılım"; C2:C10)` kullanın.\n• **İleri & Uzman:** `DÜŞEYARA` yerine sola arama yapabilen ve sütun eklenince bozulmayan `=ÇAPRAZARA(...)` tercih edin; veriyi önce `Ctrl+T` ile Akıllı Tablo yapın.\n• **Word & PowerPoint:** Word’de otomatik içindekiler için `Başlık 1/2` stilleri, PowerPoint’te tek merkezden kurumsal şablon için `Asıl Slayt (Slide Master)` ve sinematik geçiş için `Morph (!!nesne)` kullanın.\n• Tüm formülleri canlı tablo üzerinde test etmek için **MS Office Pratik & AI Lab** sekmesini açabilirsiniz!',
        eduTab: 'officelab',
        eduLabel: 'MS Office Pratik & AI Lab’ı Aç →'
      };
    }
    // Tech & AI Engine
    if (t.includes('rag') || t.includes('vektör') || t.includes('embedding') || t.includes('halüsinasyon')) {
      return { text: '**RAG (Retrieval-Augmented Generation) Rehberi:**\n• LLM’in güncel veya özel belgelerle konuşması için dokümanlar 400-800 tokenluk parçalara (`chunk`) bölünür ve %15 örtüşme (`overlap`) bırakılır.\n• Her parça Embedding vektörüne dönüştürülüp Cosine Similarity ile aranır.\n• En iyi sonuç için Hibrit Arama (BM25 + Vektör) ve Reranking kullanılır.', eduTab: 'codelab', eduLabel: 'Kod Lab’da Cosine Similarity Dene →' };
    }
    if (t.includes('prompt') || t.includes('llm') || t.includes('temperature') || t.includes('token') || t.includes('yapay zeka') || t.includes('ai')) {
      return { text: '**Profesyonel Prompt & LLM İpuçları:**\n• Etkili bir prompt 5 katmandan oluşur: **Rol + Bağlam + Görev + Kısıtlamalar + Çıktı Formatı**.\n• Kod ve veri çıkarımı için `Temperature = 0.0 - 0.2`, yaratıcı yazarlık için `0.8 - 1.1` kullanın.\n• Akademi bölümümüzdeki **AI Simülatörü** sekmesinde Token ve Temperature dağılımını canlı test edebilirsiniz!', eduTab: 'visualizer', eduLabel: 'AI & Token Simülatörünü Aç →' };
    }
    if (t.includes('python') || t.includes('async') || t.includes('javascript') || t.includes('kod') || t.includes('algoritma') || t.includes('git') || t.includes('sql')) {
      return { text: '**Yazılım & Mühendislik Özeti:**\n• **Python:** Büyük koleksiyon aramalarında `list` yerine `set`/`dict` (`O(1)`) kullanın; ağ isteklerinde `asyncio` ve timeout ekleyin.\n• **JavaScript:** `fetch()` 404 hatasında reject etmez, mutlaka `res.ok` kontrol edin; kullanıcı girdisini `innerHTML` yerine `textContent` ile basın.\n• **Git & SQL:** Supabase/PostgreSQL tablolarında mutlaka RLS (`auth.uid() = user_id`) açın.', eduTab: 'lessons', eduLabel: 'Akademi Derslerini Aç →' };
    }
    // Legal Engine
    if (t.includes('kira') || t.includes('ev sahibi') || t.includes('depozito') || t.includes('tahliye')) {
      return { text: '**Kira Hukuku Haklarınız (6098 TBK):**\n• Kira artışı yasal olarak 12 aylık TÜFE ortalamasını aşamaz (m.344).\n• Depozito en fazla 3 aylık kira bedeli olabilir (m.342).\n• Sözleşme süresi doldu diye tahliye istenemez (10 yıl uzama kuralı, m.347).', tplId: 'tpl6' };
    }
    if (t.includes('ayıplı') || t.includes('iade') || t.includes('cayma') || t.includes('internetten') || t.includes('tüketici')) {
      return { text: '**Tüketici Haklarınız (6502 TKHK):**\n• İnternetten alınan ürünlerde 14 gün içinde koşulsuz cayma hakkınız vardır (m.48).\n• Ayıplı üründe bedel iadesi, onarım, değişim veya indirimden birini seçebilirsiniz (m.11).', tplId: 'tpl4' };
    }
    if (t.includes('icra') || t.includes('haciz') || t.includes('borç') || t.includes('maaş')) {
      return { text: '**İcra ve İflas Kanunu (İİK):**\n• İlamsız ödeme emrine tebliğden itibaren **7 gün** içinde itiraz ederseniz takip durur (m.62).\n• Maaş haczinde kural olarak en az 1/4 haczedilebilir (m.83).', tplId: 'tpl_icra' };
    }
    if (t.includes('işten') || t.includes('kıdem') || t.includes('ihbar') || t.includes('istifa') || t.includes('mesai') || t.includes('izin')) {
      return { text: '**İş Kanunu (4857) Haklarınız:**\n• Haftalık 45 saati aşan çalışmalar %50 zamlı ödenir (m.41).\n• Yıllık izin hakları kıdeme göre 14 / 20 / 26 gündür (m.53).', tplId: 'tpl_kidem' };
    }
    if (t.includes('savcı') || t.includes('dolandır') || t.includes('hakaret') || t.includes('tehdit') || t.includes('şikayet')) {
      return { text: '**Adli Şikayet ve Suç Duyurusu:**\n• Delillerinizi (ekran görüntüsü, dekont) saklayarak Cumhuriyet Başsavcılığına suç duyurusu dilekçesi verebilirsiniz.', tplId: 'tpl_savci' };
    }
    if (t.includes('abonelik') || t.includes('iptal') || t.includes('fatura') || t.includes('gsm')) {
      return { text: '**Abonelik İptali (TKHK m.52):**\n• Belirsiz süreli veya 1 yıl+ abonelikleri dilediğiniz zaman feshedebilirsiniz.', tplId: 'tpl1' };
    }
    return { text: 'Sorunuzu inceledim! Yazılım/AI konularında **Pusula Akademi** modüllerimizi deneyebilir, hukuki konularda **T.C. Kanun Rehberi** veya **Hazır Şablonlar** bölümünü kullanabilirsiniz.\n\n*(İsterseniz sağ üstteki "Gemini API Anahtarı" kutusundan kendi ücretsiz anahtarınızı bağlayarak tüm açık uçlu sorulara canlı yapay zeka yanıtı alabilirsiniz.)*', eduTab: 'lessons', eduLabel: 'Akademi’ye Git →' };
  }

  async function askPusulaAssistant(question, switchToView = false) {
    const q = String(question || '').trim();
    if (!q) return;
    if (switchToView) switchView('assistant');
    aiHistory.push({ role: 'user', text: q });
    renderAiChat();

    const apiKey = getActiveGeminiKey();
    const badge = document.getElementById('ai-engine-badge');
    if (apiKey) {
      if (badge) badge.textContent = 'Gemini 2.5 AI Aktif ✓';
      aiHistory.push({ role: 'bot', text: 'Düşünüyor...' });
      renderAiChat();
      try {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Sen Pusula platformunun Türkçe uzman yapay zeka asistanısın. Hem yazılım/Python/JS/AI mühendisliği hem de T.C. vatandaş/tüketici/hukuk hakları sorularına net, pratik ve maddeli Türkçe yanıtlar ver. Hukuki sorularda bunun genel bilgilendirme olduğunu kısaca belirt. Soru: ' + q }] }]
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            const localMatch = builtInAssistantReply(q);
            aiHistory[aiHistory.length - 1] = { role: 'bot', text: answer, tplId: localMatch.tplId, eduTab: localMatch.eduTab, eduLabel: localMatch.eduLabel };
            renderAiChat();
            return;
          }
        }
      } catch (err) {}
      aiHistory.pop();
    }

    const reply = builtInAssistantReply(q);
    aiHistory.push({ role: 'bot', text: reply.text, tplId: reply.tplId, eduTab: reply.eduTab, eduLabel: reply.eduLabel });
    renderAiChat();
  }
  window.pusulaAskAssistant = askPusulaAssistant;

  document.getElementById('ai-chat-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = document.getElementById('ai-chat-input');
    const q = inp.value.trim();
    if (!q) return;
    inp.value = '';
    askPusulaAssistant(q);
  });
  document.addEventListener('click', (e) => {
    const qbtn = e.target.closest('[data-ai-q]');
    if (qbtn) askPusulaAssistant(qbtn.dataset.aiQ);
  });

  const aiKeyBtn = document.getElementById('ai-save-key-btn');
  const aiKeyInput = document.getElementById('ai-custom-key-input');
  if (aiKeyInput) aiKeyInput.value = getActiveGeminiKey() ? '••••••••••••' : '';
  if (aiKeyBtn && aiKeyInput) {
    aiKeyBtn.addEventListener('click', () => {
      const val = aiKeyInput.value.trim();
      if (!val || val.startsWith('••')) {
        try { localStorage.removeItem('pusula_gemini_key'); } catch (e) {}
        document.getElementById('ai-engine-badge').textContent = 'Akıllı Rehber Aktif';
        showToast('Özel API anahtarı temizlendi; yerleşik rehber aktif.');
        return;
      }
      try { localStorage.setItem('pusula_gemini_key', val); } catch (e) {}
      aiKeyInput.value = '••••••••••••';
      document.getElementById('ai-engine-badge').textContent = 'Gemini 2.5 AI Aktif ✓';
      showToast('Gemini API anahtarınız tarayıcıya kaydedildi!');
    });
  }
  if (getActiveGeminiKey()) document.getElementById('ai-engine-badge').textContent = 'Gemini 2.5 AI Aktif ✓';

  // =====================================================
  // INITIALIZE ALL MODULES
  // =====================================================
  applyThemeUI();
  applyWidgetVisibility();
  renderBookmarks();
  renderHabits();
  renderSubscriptions();
  renderTasks();
  renderIdeas();
  renderNews();
  renderMusicPresets();
  renderPlaylists();
  renderMedia();
  renderSocial();
  renderSheet();
  applyDocTemplate('meeting');
  computePortfolio();
  updateCompoundSim();
  updateLoanCalc();
  updateInflationCalc();
  initWordle(false);
  renderXox();
  quizPool = shuffleArr(LOCAL_TR_QUIZ_BANK);
  renderQuiz();
  initMemoryCards();
  updateCvPreview();
  renderTemplates();
  renderLaws();
  renderAiChat();
  updateProUI();
  fetchLiveWeather('istanbul');
  updateWorldClocks();
  setInterval(updateWorldClocks, 30000);
  updateKdvCalc();
  generateStrongPwd();
  requestAnimationFrame(animateAudioWaves);
  lucide.createIcons();

  // Automatic live polling
  const mktInterval = Math.max(10000, Number(cfg.MARKET_REFRESH_MS) || 15000);
  const newsInterval = Math.max(30000, Number(cfg.NEWS_REFRESH_MS) || 60000);
  fetchLiveMarkets();
  fetchLiveNews();
  setInterval(fetchLiveMarkets, mktInterval);
  setInterval(fetchLiveNews, newsInterval);
})();
