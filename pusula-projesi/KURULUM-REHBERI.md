# Pusula — Sıfırdan Canlı Yayına, Üyeliğe ve Ödemeye Geçiş Rehberi

Bu klasör, **Pusula** web uygulamanızı kendi bilgisayarınızda (VS Code) açmanız, ücretsiz olarak internette yayınlamanız (Vercel), gerçek kullanıcı üyeliği eklemeniz (Supabase) ve gelir elde etmeniz (iyzico / Lemon Squeezy / Stripe) için gereken tüm dosyaları içerir.

## Klasördeki Dosyalar
- `index.html` — Pusula ana web uygulaması ve arayüz iskeleti.
- `styles.css` — Gündüz/Gece stüdyo teması, 3D kart ve kod editörü stilleri.
- `academy-data.js` — Yazılım, Teknoloji ve Yapay Zeka akademisi müfredat, kod görevi, bilgi kartı ve sınav bankası.
- `office-data.js` — Başlangıçtan uzman seviyeye Microsoft Office (Excel, Word, PowerPoint, Outlook) & AI Copilot dersleri, canlı Excel formül görevleri, bilgi kartları ve sınav bankası.
- `promo-video.js` — Pusula Pro 60 saniyelik interaktif sinematik tanıtım videosu oynatıcısı.
- `academy.js` — 7 işlevsel eğitim sekmesinin (Dersler, MS Office Pratik & AI, Kod & Prompt Lab, Bilgi Kartları, Sınav, AI/Algoritma Simülatörü, Yol Haritası) etkileşim motoru.
- `app.js` — Canlı piyasa, haber akışı, günlük plan, bütçe, radyo/TV ve ofis araçları motoru.
- `config.js` — Supabase, Gemini AI (opsiyonel) ve ödeme bağlantınızı yapıştıracağınız tek ayar dosyası.
- `manifest.json`, `sw.js`, `icon.svg` — Mobil PWA kurulum ve çevrimdışı önbellek dosyaları.
- `supabase-kurulum.sql` — Kullanıcı hesapları ve bulut kaydı için hazır veritabanı şeması.
- `vercel.json` — Vercel yayın ve güvenlik ayar dosyası.

---

## Adım 1 — Bilgisayarınızda VS Code ile Açma
1. İndirdiğiniz `pusula-web-projesi.zip` dosyasını sağ tıklayıp **Tümünü Ayıkla (Extract All)** diyerek masaüstüne çıkarın.
2. **Visual Studio Code**'u açın → **File → Open Folder** diyerek çıkardığınız `pusula-projesi` klasörünü seçin.
3. Sol menüdeki **Extensions** (`Ctrl + Shift + X`) bölümünden **Live Server** eklentisini kurun.
4. `index.html` dosyasına sağ tıklayıp **Open with Live Server** deyin. Siteniz tarayıcıda açılacaktır.

---

## Adım 2 — Ücretsiz Canlı Yayın (GitHub + Vercel)
1. **GitHub** (`github.com`) üzerinde ücretsiz hesap açın ve `pusula-web` adında yeni bir depo (**New Repository**) oluşturun.
2. `pusula-projesi` klasöründeki 5 dosyayı GitHub deposuna yükleyin (**Add file → Upload files**).
3. **Vercel** (`vercel.com`) sitesine GitHub hesabınızla giriş yapın.
4. **Add New → Project** deyin, `pusula-web` deponuzu seçin ve **Deploy** düğmesine basın.
5. Yaklaşık 30 saniye içinde siteniz `https://pusula-web.vercel.app` benzeri kalıcı bir adreste yayına girer. İleride özel alan adınızı (ör. `pusula.app`) Vercel → **Settings → Domains** bölümünden bağlayabilirsiniz.

---

## Adım 3 — Gerçek Üyelik ve Bulut Kayıt (Supabase)
1. **Supabase** (`supabase.com`) üzerinde ücretsiz bir proje oluşturun.
2. Sol menüden **SQL Editor → New query** açın, bu klasördeki `supabase-kurulum.sql` dosyasının içindeki tüm kodu yapıştırıp **Run** düğmesine basın.
3. Sol menüden **Project Settings → API** sayfasına gidin ve şu iki bilgiyi kopyalayın:
   - `Project URL`
   - `anon public` anahtarı
4. VS Code'da `config.js` dosyasını açıp bu iki bilgiyi `SUPABASE_URL` ve `SUPABASE_ANON_KEY` alanlarına yapıştırın ve kaydedin.

---

## Adım 4 — Pusula Pro ile Ödeme Alma (Para Kazanma)
- **Türkiye için (iyzico):** iyzico hesabınızda **iyziLink** veya abonelik ödeme linki oluşturun.
- **Global / Yurt dışı için (Lemon Squeezy veya Stripe):** Aylık/Yıllık "Pusula Pro" ürünü oluşturup ödeme sayfası (Checkout) linkini kopyalayın.
- Kopyaladığınız ödeme linkini `config.js` içindeki `PRO_CHECKOUT_URL` alanına yapıştırın.
- Ödeme tamamlandığında kullanıcının `profiles.is_pro` değerini otomatik `true` yapmak için ödeme sağlayıcınızın Webhook ayarını Supabase Edge Function'a bağlayabilirsiniz.
