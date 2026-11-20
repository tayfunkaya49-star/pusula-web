# Pusula — Gerçek Üyelik (Supabase) ve Ödeme (iyzico / Lemon Squeezy) Kurulumu

## 1. Supabase ile Gerçek Üyelik ve Bulut Kaydı (5 dk)
1. `supabase.com` adresinde ücretsiz hesap açın ve **New Project** diyerek `pusula` adında proje oluşturun (bölge: Frankfurt veya en yakın Avrupa).
2. Sol menüden **SQL Editor → New query** açın, `supabase-kurulum.sql` dosyasının içeriğini yapıştırıp **Run** düğmesine basın.
3. Sol menüden **Project Settings → API** sayfasına gidin ve **Project URL** ile **anon public** anahtarını kopyalayın.
4. `config.js` dosyasını açıp `SUPABASE_URL` ve `SUPABASE_ANON_KEY` alanlarına yapıştırın.

## 2. Ödeme Linki Bağlama (Gelir Modeli)
- **Türkiye için:** `iyzico.com` panelinde **iyziLink** ile "Pusula Pro (Aylık 149 TL)" ve isterseniz "Pusula Pro (Yıllık 1.340 TL)" ödeme linkleri oluşturun.
- **Yurt dışı / Global için:** `lemonsqueezy.com` veya `stripe.com` üzerinde abonelik ürünü oluşturup Checkout linkini alın.
- Bu linkleri `config.js` içindeki `PRO_CHECKOUT_URL` ve `PRO_CHECKOUT_URL_YEARLY` alanlarına yapıştırın.

## 3. GitHub ve Vercel'i Güncelleme
1. GitHub'daki `pusula-web` deponuzda `pusula-projesi` klasörüne girin.
2. Bu paketteki güncel `index.html` ve doldurduğunuz `config.js` dosyasını **Add file → Upload files** ile yükleyip **Commit changes** deyin.
3. Vercel değişikliği otomatik algılar ve 15 saniye içinde canlı siteniz gerçek üyelik + ödeme akışıyla güncellenir!
