/**
 * PUSULA — CANLI ÜYELİK VE ÖDEME AYAR DOSYASI
 * ------------------------------------------
 * Yalnızca tırnak içindeki 4 alanı doldurup GitHub'a yüklediğinizde:
 * 1) Gerçek e-posta/şifre üyeliği ve bulut veritabanı (Supabase) devreye girer.
 * 2) "Pusula Pro'ya Geç" düğmesi doğrudan ödeme sayfanıza (iyzico / Lemon Squeezy) yönlendirir.
 */
window.PUSULA_CONFIG = {
  // Supabase -> Project Settings -> API
 SUPABASE_URL: "https://nvdnhvsicxtvxhocsowm.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_j8CHJLtgQqebVlhrBI58OQ_0Pm6oOJa",

  // Ödeme Linkleri (iyziLink, Lemon Squeezy veya Stripe Checkout)
  PRO_CHECKOUT_URL: "",        // Aylık 149 TL plan ödeme linki
  PRO_CHECKOUT_URL_YEARLY: "", // Yıllık 1.340 TL plan ödeme linki (opsiyonel)
IBAN_HOLDER: "TAYFUN KAYA",
  IBAN_NUMBER: "TR88 0001 5001 5800 7306 8238 64",
  RECEIPT_EMAIL: "tayfunkaya49@gmail.com",
  ANDROID_APK_URL: "https://pusula-web-opal.vercel.app/pusula.apk",
  // Otomatik Canlı Veri Yenileme (ms)
  MARKET_REFRESH_MS: 15000,
  NEWS_REFRESH_MS: 60000
};
