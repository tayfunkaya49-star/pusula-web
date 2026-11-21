/**
 * PUSULA — CANLI ÜYELİK, YAPAY ZEKA VE ÖDEME AYAR DOSYASI
 * ------------------------------------------------------
 * Bu dosyadaki ayarları doldurduğunuzda:
 * 1) Gerçek e-posta/şifre üyeliği ve bulut veritabanı (Supabase) devreye girer.
 * 2) Pusula AI Asistan ve Office Copilot isteğe bağlı olarak kendi Gemini API anahtarınızla çalışır.
 * 3) "Pusula Pro'ya Geç" düğmesi doğrudan ödeme sayfanıza yönlendirir.
 */
window.PUSULA_CONFIG = {
  // Kurucu ve İletişim Bilgileri
  FOUNDER_NAME: "Tayfun KAYA",
  FOUNDER_EMAIL: "tayfunkaya49@gmail.com",

  // Supabase -> Project Settings -> API
  SUPABASE_URL: "https://nvdnhvsicxtvxhocsowm.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_j8CHJLtgQqebVlhrBI58OQ_0Pm6oOJa",

  // İsteğe Bağlı: Google Gemini API Anahtarı (AI Asistan, Prompt Lab & Office Copilot için)
  GEMINI_API_KEY: "",

  // İsteğe Bağlı: Harici Tanıtım Videosu (MP4 veya YouTube Embed URL'si; boşsa dahili interaktif sinematik video oynar)
  PRO_VIDEO_URL: "",

  // Ödeme Linkleri (iyziLink, Lemon Squeezy veya Stripe Checkout)
  PRO_CHECKOUT_URL: "",        // Aylık 149 TL plan ödeme linki
  PRO_CHECKOUT_URL_YEARLY: "", // Yıllık 1.340 TL plan ödeme linki (opsiyonel)

  // İsteğe Bağlı: Havale / EFT & Dekont Bildirimi
  IBAN_HOLDER: "Tayfun KAYA",
  IBAN_NUMBER: "",
  WHATSAPP_PHONE: "",
  RECEIPT_EMAIL: "tayfunkaya49@gmail.com",

  // İsteğe Bağlı: Android APK İndirme Bağlantısı
  ANDROID_APK_URL: "",

  // Otomatik Canlı Veri Yenileme (ms)
  MARKET_REFRESH_MS: 15000,
  NEWS_REFRESH_MS: 60000
};
