/**
 * PUSULA — CANLI AYAR DOSYASI
 * ---------------------------
 * Sitenizi internete aldığınızda, Supabase (üyelik + bulut veritabanı) ve
 * ödeme bağlantınızı (iyzico / Lemon Squeezy / Stripe) yalnızca bu dosyaya
 * yapıştırmanız yeterlidir. index.html dosyasına dokunmanıza gerek yoktur.
 */
window.PUSULA_CONFIG = {
  // 1) Supabase Proje Bilgileri (supabase.com -> Project Settings -> API)
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",

  // 2) Pusula Pro Ödeme Sayfası Linki (iyzico Link, Lemon Squeezy veya Stripe Checkout)
  PRO_CHECKOUT_URL: "",

  // 3) Otomatik Canlı Yenileme Süreleri (milisaniye)
  MARKET_REFRESH_MS: 15000, // 15 saniye
  NEWS_REFRESH_MS: 60000    // 60 saniye
};
