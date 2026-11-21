/**
 * PUSULA AKADEMİ — MİCROSOFT OFFICE & YAPAY ZEKA COPILOT MÜFREDATI
 * Başlangıç -> Orta -> İleri -> Uzman Seviye Dersler, Canlı Excel Pratikleri, Bilgi Kartları & Sınavlar
 */
window.PUSULA_OFFICE_DATA = {
  TRACKS: [
    {
      id: 'excel',
      group: 'office',
      title: 'Microsoft Excel & AI Copilot',
      subtitle: 'Hücre mantığından TOPLA/EĞER, DÜŞEYARA/ÇAPRAZARA, Pivot Tablo, VBA ve AI formüllerine',
      icon: 'table',
      color: 'forest',
      hours: '6 Saat'
    },
    {
      id: 'word',
      group: 'office',
      title: 'Microsoft Word & Belge Mühendisliği',
      subtitle: 'Temel biçimden Stiller, İçindekiler, Adres-Mektup Birleştirme ve Word Copilot taslaklarına',
      icon: 'file-text',
      color: 'ocean',
      hours: '4 Saat'
    },
    {
      id: 'powerpoint',
      group: 'office',
      title: 'Microsoft PowerPoint & Sunum Sanatı',
      subtitle: 'Görsel hiyerarşi, Slide Master, Morph animasyonu, veri grafikleri ve Copilot Pitch Deck',
      icon: 'presentation',
      color: 'amber',
      hours: '4 Saat'
    },
    {
      id: 'outlook',
      group: 'office',
      title: 'Outlook, Teams & İş Akışı Otomasyonu',
      subtitle: 'Akıllı gelen kutusu kuralları, toplantı yönetimi, Teams/SharePoint ve Copilot otomasyonu',
      icon: 'mail',
      color: 'indigo',
      hours: '3.5 Saat'
    }
  ],

  LESSONS: [
    // ================= MICROSOFT EXCEL =================
    {
      id: 'xl-1',
      track: 'excel',
      group: 'office',
      order: 1,
      title: 'Excel Temelleri: Hücre Adresi, Veri Tipleri & İlk Formüller',
      level: 'Başlangıç',
      isPro: false,
      duration: '12 dk',
      xp: 50,
      summary: 'Satır-sütun koordinatlarını, sayı/tarih/metin biçimlendirmeyi, sabitleme ($) ve TOPLA/ORTALAMA formüllerini öğrenin.',
      objectives: [
        'Hücre adresi (A1, B2) ve aralık (B2:B10) yazımını doğru kurmak',
        'Göreli (A1) ve mutlak ($A$1) hücre referansı farkını bilmek',
        'TOPLA, ORTALAMA, MİN ve MAKS fonksiyonlarını hatasız uygulamak'
      ],
      sections: [
        {
          heading: '1. Hücre Mantığı ve Mutlak Referans ($)',
          body: 'Excel’de her formül "=" işaretiyle başlar. Formülü aşağı sürüklediğinizde B2 hücresi B3’e kayar (göreli referans). Sabit kalmasını istediğiniz KDV oranı gibi bir hücreyi $F$1 şeklinde F4 tuşuyla kilitleyebilirsiniz.',
          tip: 'Hücre düzenlerken F4 tuşuna her bastığınızda $A$1 -> A$1 -> $A1 -> A1 döngüsü çalışır.'
        },
        {
          heading: '2. Temel Özet Fonksiyonları',
          body: 'Bir sayı sütununu hızlıca özetlemek için TOPLA (SUM), ORTALAMA (AVERAGE), MİN ve MAKS kullanılır. Alt+M veya Alt+= kısayolu seçili sütunun hemen altına otomatik TOPLA yazar.',
          code: '=TOPLA(B2:B10)          // B2 ile B10 arası toplam\n=ORTALAMA(C2:C10)       // Sayıların ortalaması\n=B2*$F$1                // Sabit oranla çarpım'
        }
      ],
      aiPrompt: 'Excel’de mutlak ($A$1) ve göreli (A1) hücre referansını maaş KDV hesabı üzerinden örnek formülle anlat.',
      checkpoint: {
        q: 'B2 hücresindeki tutarı sürüklerken G1’deki sabit KDV oranıyla çarpmak için hangi yazım doğrudur?',
        opts: ['=B2*G1', '=B2*$G$1', '=$B$2*G1', '=TOPLA(B2;G1)'],
        ans: 1,
        exp: 'Tutarı tutan B2 kaymalı (göreli), sabit KDV oranını tutan $G$1 kilitlenmelidir (mutlak).'
      }
    },
    {
      id: 'xl-2',
      track: 'excel',
      group: 'office',
      order: 2,
      title: 'Koşullu Mantık & Özetleme: EĞER, EĞERSAY, ETOPLA',
      level: 'Orta',
      isPro: false,
      duration: '15 dk',
      xp: 60,
      summary: 'Karar ağaçları kurun, belirli kritere uyan kayıtları sayın ve koşullu biçimlendirmeyle anomalileri anında yakalayın.',
      objectives: [
        'EĞER (IF) ve iç içe EĞER/VE/YADA ile karar mantığı kurmak',
        'EĞERSAY (COUNTIF) ve ETOPLA (SUMIF) ile kategori raporları çıkarmak',
        'Koşullu Biçimlendirme kurallarıyla kritik değerleri renklendirmek'
      ],
      sections: [
        {
          heading: '1. Karar Fonksiyonu: EĞER (IF)',
          body: 'EĞER fonksiyonu 3 parçadan oluşur: Koşul, Doğruysa Değer, Yanlışsa Değer. Satış hedeflerinde prim hakkı veya stok kritik uyarısı üretmek için idealdir.',
          code: '=EĞER(B2>=50000; "Prim Hak Etti"; "Standart")\n=EĞER(VE(B2>10000; C2="Aktif"); "Öncelikli"; "Normal")'
        },
        {
          heading: '2. Koşullu Sayım ve Toplam',
          body: 'EĞERSAY tek bir koşula uyan hücre sayısını verirken, ETOPLA şarta uyan satırların karşılığındaki tutarları toplar. Çoklu şartlarda ÇOKEĞERSAY / ÇOKETOPLA kullanılır.',
          code: '=EĞERSAY(B2:B50; "<10")             // 10’dan küçük stok adedi\n=ETOPLA(B2:B50; "Yazılım"; C2:C50)   // Yazılım gider toplamı',
          tip: 'Metin kriterlerini mutlaka çift tırnak içinde ("Yazılım") yazın; karşılaştırma operatörleri de ("<10") tırnak içine alınır.'
        }
      ],
      aiPrompt: 'Excel’de 3 farklı kritere göre prim hesaplayan EĞER + VE formülü örneği hazırla.',
      checkpoint: {
        q: 'B2:B20 sütununda "Tamamlandı" yazan satırların C2:C20’deki saat toplamını almak için hangi fonksiyon kullanılır?',
        opts: ['EĞERSAY', 'ETOPLA', 'ORTALAMA', 'BAĞ_DEĞ_SAY'],
        ans: 1,
        exp: 'ETOPLA (SUMIF) belirtilen ölçüt aralığında ("Tamamlandı") eşleşen satırların toplam aralığını (C2:C20) toplar.'
      }
    },
    {
      id: 'xl-3',
      track: 'excel',
      group: 'office',
      order: 3,
      title: 'Veri Arama & Pivot Tablo: DÜŞEYARA, ÇAPRAZARA ve Power Query',
      level: 'İleri',
      isPro: false,
      duration: '18 dk',
      xp: 75,
      summary: 'Büyük tabloları saniyeler içinde birleştirin, dinamik Pivot raporları oluşturun ve Power Query ile kirli veriyi otomatik temizleyin.',
      objectives: [
        'DÜŞEYARA (VLOOKUP) tam eşleşme (0/YANLIŞ) ve ÇAPRAZARA (XLOOKUP) avantajlarını kavramak',
        'Pivot Table (Özet Tablo) ile sürükle-bırak yönetici özetleri hazırlamak',
        'Power Query ile tekrarlayan Excel/CSV temizleme adımlarını tek tıkla yenilemek'
      ],
      sections: [
        {
          heading: '1. DÜŞEYARA’dan ÇAPRAZARA’ya Geçiş',
          body: 'DÜŞEYARA yalnızca aranan değeri ilk sütunda arar ve sağdaki sütunu getirir; 4. argümana mutlaka 0 (Tam Eşleşme) yazılmalıdır. Modern Excel’de ÇAPRAZARA sola doğru arama yapabilir, sütun eklense bile bozulmaz ve bulunamayan değer için varsayılan metin döndürür.',
          code: '=DÜŞEYARA(E2; A2:C100; 3; 0)\n=ÇAPRAZARA(E2; B2:B100; A2:A100; "Kayıt Yok")'
        },
        {
          heading: '2. Pivot Tablo ve Power Query',
          body: 'Verinizi önce Ctrl+T ile resmi Excel Tablosu’na dönüştürün, ardından Ekle -> PivotTable seçin. Farklı dosyalardan gelen dağınık verileri ise Veri -> Verileri Al (Power Query) ile birleştirip her ay "Tümünü Yenile" diyerek otomatik güncelleyebilirsiniz.',
          tip: 'Ctrl+T ile oluşturulan Akıllı Tablo genişledikçe bağlı Pivot Tablo ve formüller otomatik olarak yeni satırları kapsar.'
        }
      ],
      aiPrompt: 'DÜŞEYARA ile ÇAPRAZARA arasındaki 4 kritik farkı ve #YOK hatasını EĞERHATA ile nasıl çözeceğimi göster.',
      checkpoint: {
        q: 'DÜŞEYARA formülünde son parametre olarak 0 (YANLIŞ) yazılmazsa ne risk doğar?',
        opts: ['Sayılar yuvarlanır', 'Sıralanmamış tabloda yanlış veya yaklaşık eşleşme dönebilir', 'Formül sadece ilk satırı okur', 'Dosya salt okunur olur'],
        ans: 1,
        exp: 'Varsayılan değer 1 (DOĞRU) yaklaşık eşleşmedir ve artan sıralı olmayan tablolarda hatalı kayıt döndürür.'
      }
    },
    {
      id: 'xl-4',
      track: 'excel',
      group: 'office',
      order: 4,
      title: 'Uzman Seviye: VBA Makroları, Dinamik Diziler & Excel AI Copilot',
      level: 'Uzman',
      isPro: true,
      duration: '22 dk',
      xp: 100,
      summary: 'FİLTRE/BENZERSİZ dinamik dizileri, VBA makro otomasyonu ve Excel Copilot / Python in Excel ile otonom raporlama sistemleri kurun.',
      objectives: [
        'FİLTRE (FILTER) ve BENZERSİZ (UNIQUE) ile dökülmeli (spill) canlı tablolar kurmak',
        'Tekrarlayan biçimlendirme ve PDF dışa aktarım işlerini VBA makrosuyla tek düğmeye bağlamak',
        'Excel AI Copilot ile doğal dilden formül üretmek, trend anomalisi ve Python analizi istemek'
      ],
      sections: [
        {
          heading: '1. Dinamik Diziler & VBA Otomasyonu',
          body: 'Modern Excel formülleri tek bir hücreye yazılıp komşu hücrelere otomatik "dökülür" (spill). Tekrarlı aylık rapor kapatma adımlarını ise VBA editöründe (Alt+F11) yazdığınız Sub makrolarıyla saniyelere indirebilirsiniz.',
          code: '=SIRALA(BENZERSİZ(FİLTRE(A2:C100; C2:C100>50000)); 2; -1)\n\n\' VBA: Aktif sayfayı otomatik PDF kaydet\nSub AylikRaporPDF()\n  ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:="Rapor.pdf"\nEnd Sub'
        },
        {
          heading: '2. Excel Copilot & AI Prompt Kalıpları',
          body: 'Copilot kenar çubuğunda tablonuz Ctrl+T formatındayken karmaşık formül veya Python görselleştirmesi isteyebilirsiniz. Örn: "Satış büyümesi %15 üzerinde olan müşterileri yeni bir sütunda Yıldız Müşteri olarak etiketle ve çeyrek bazlı Pivot grafiği üret."'
        }
      ],
      aiPrompt: 'Excel’de birden fazla sayfayı tek PDF olarak masaüstüne kaydeden güvenli bir VBA makrosu yaz ve açıkla.',
      checkpoint: {
        q: 'FİLTRE veya BENZERSİZ formülünün sonuçları komşu hücrede dolu bir metin yüzünden yazılamadığında Excel hangi hatayı verir?',
        opts: ['#AD?', '#TAŞMA! (#SPILL!)', '#DEĞER!', '#SAYI/0!'],
        ans: 1,
        exp: 'Dinamik dizi formüllerinin yayılacağı alanda engel varsa #TAŞMA! (#SPILL!) hatası oluşur.'
      }
    },

    // ================= MICROSOFT WORD =================
    {
      id: 'wd-1',
      track: 'word',
      group: 'office',
      order: 1,
      title: 'Word Temelleri: Temiz Sayfa Düzeni, Yazı Tipi & Paragraf Disiplini',
      level: 'Başlangıç',
      isPro: false,
      duration: '10 dk',
      xp: 45,
      summary: 'Boşluk tuşu ve Enter hatalarından kurtulun; cetvel, sekme durakları, sayfa sonu (Ctrl+Enter) ve temel biçim boyacısını öğrenin.',
      objectives: [
        'Yeni sayfaya Enter yerine Ctrl+Enter (Sayfa Sonu) ile temiz geçmek',
        'Biçim Boyacısı (Ctrl+Shift+C / V) ile tutarlı metin formatı sağlamak',
        'Sayfa kenar boşlukları, satır aralığı ve iki yana yaslı tipografi kuralları'
      ],
      sections: [
        {
          heading: '1. Altın Word Alışkanlıkları',
          body: 'Yeni sayfaya geçmek için defalarca Enter basmak üst paragrafa 1 satır eklendiğinde tüm belgeyi kaydırır. Bunun yerine Ctrl+Enter ile Sayfa Sonu koyun. Görünmez biçim işaretlerini açmak için Giriş -> ¶ (Ctrl+*) tuşunu kullanın.',
          tip: 'Ctrl+Shift+V (Biçimi Yapıştır) webden kopyalanan metinlerdeki bozuk font ve arka planı önlemek için "Yalnızca Metni Koru" ile birlikte hayat kurtarır.'
        }
      ],
      aiPrompt: 'Resmi bir iş raporu için Word sayfa kenar boşlukları, font boyutu ve paragraf aralığı standartları neler olmalı?',
      checkpoint: {
        q: 'Word’de önceki sayfalar değiştikçe yeni başlığın kaymasını engellemek için yeni sayfaya nasıl geçilir?',
        opts: ['15 kez Enter basarak', 'Ctrl + Enter ile Sayfa Sonu ekleyerek', 'Boşluk tuşuyla', 'Tablo ekleyerek'],
        ans: 1,
        exp: 'Ctrl+Enter kesin sayfa sonu koyar; üst metin uzasa veya kısalsa da sonraki bölüm yeni sayfadan başlar.'
      }
    },
    {
      id: 'wd-2',
      track: 'word',
      group: 'office',
      order: 2,
      title: 'Stiller, Başlık Hiyerarşisi & Otomatik İçindekiler Tablosu',
      level: 'Orta',
      isPro: false,
      duration: '14 dk',
      xp: 60,
      summary: 'Tez, sözleşme veya kurum raporlarını manuel sayfa numarası yazmadan Başlık 1-2-3 stilleri ve otomatik İçindekiler ile yönetin.',
      objectives: [
        'Başlık 1 / Başlık 2 stilleriyle Gezinti Bölmesi (Ctrl+F) yapısını kurmak',
        'Başvurular -> İçindekiler Tablosunu tek tıkla oluşturmak ve güncellemek',
        'Bölüm Sonu (Section Break) ile aynı belgede hem dikey hem yatay sayfa kullanmak'
      ],
      sections: [
        {
          heading: '1. Stil Tabanlı Belge Mimarisi',
          body: 'Elle kalın ve büyük yaptığınız başlıkları Word bölüm olarak tanımaz. Stiller galerisinden Başlık 1, Başlık 2 seçtiğinizde tüm belgenin rengini Tasarım sekmesinden tek tıkla değiştirebilir ve sayfa numaralarını otomatik güncelleyen İçindekiler Tablosu üretebilirsiniz.',
          tip: 'Aynı belgede tek bir sayfayı (örneğin geniş bir tabloyu) yatay yapmak için önceki ve sonraki sayfaya "Bölüm Sonu -> Sonraki Sayfa" ekleyin.'
        }
      ],
      aiPrompt: '50 sayfalık bir tezde Roma rakamlı ön sayfalar ve normal numaralı ana bölümler için Word Bölüm Sonu adım adım nasıl kurulur?',
      checkpoint: {
        q: 'Word’de otomatik İçindekiler Tablosu oluşturabilmek için bölüm başlıklarına ne uygulanmalıdır?',
        opts: ['Altı çizili kalın yazı', 'Başlık 1 / Başlık 2 stilleri', 'Madde işaretleri', 'Altbilgi kutusu'],
        ans: 1,
        exp: 'Word İçindekiler Tablosu yalnızca Başlık (Heading 1, 2, 3...) stilleri atanmış paragrafları otomatik tarar.'
      }
    },
    {
      id: 'wd-3',
      track: 'word',
      group: 'office',
      order: 3,
      title: 'Adres-Mektup Birleştirme, Değişiklik İzleme & Sözleşme Akışı',
      level: 'İleri',
      isPro: false,
      duration: '16 dk',
      xp: 75,
      summary: 'Excel listesindeki 500 kişiye tek şablondan otomatik kişiselleştirilmiş belge/sertifika üretin ve sözleşmeleri profesyonelce revize edin.',
      objectives: [
        'Postalar -> Adres Mektup Birleştirme ile Excel’den Word’e toplu belge/PDF üretmek',
        'Gözden Geçir -> Değişiklikleri İzle ve Belge Karşılaştır özelliklerini yönetmek',
        'Çapraz Başvuru ve Dinamik Alan (Field Codes) kullanımı'
      ],
      sections: [
        {
          heading: '1. Excel + Word Toplu Belge Otomasyonu',
          body: 'Katılım belgesi, kira hatırlatması veya zam mektubu hazırlarken veriyi Excel’de tutup Word’de Postalar -> Alıcıları Seç ile bağlarsınız. <<Ad_Soyad>> ve <<Tutar>> alanları tek tıkla her kişi için ayrı sayfaya basılır.',
          code: 'Excel Sütunu: Ad_Soyad | Departman | Tarih\nWord Alanı:   Sayın <<Ad_Soyad>>, <<Departman>> birimi için...'
        }
      ],
      aiPrompt: 'Excel’deki müşteri listesinden Word kullanarak kişiye özel sözleşme PDF’leri topluca nasıl oluşturulur?',
      checkpoint: {
        q: 'Bir sözleşmenin iki farklı revizyonu arasındaki tüm kelime farklarını otomatik görmek için hangi özellik kullanılır?',
        opts: ['Gözden Geçir -> Karşılaştır (Compare)', 'Ekle -> Nesne', 'Görünüm -> Böl', 'Postalar -> Zarflar'],
        ans: 0,
        exp: 'Gözden Geçir -> Karşılaştır, Özgün ve Gözden Geçirilmiş iki belgeyi satır satır kıyaslayıp tüm ekleme/silmeleri işaretler.'
      }
    },
    {
      id: 'wd-4',
      track: 'word',
      group: 'office',
      order: 4,
      title: 'Uzman Seviye: Kurumsal Şablon (.dotx), İçerik Denetimleri & Word Copilot',
      level: 'Uzman',
      isPro: true,
      duration: '18 dk',
      xp: 95,
      summary: 'Kilitli form şablonları (.dotx), Geliştirici sekmesi içerik denetimleri ve Word AI Copilot ile saniyeler içinde profesyonel belge üretin.',
      objectives: [
        'Geliştirici sekmesinden açılır liste, tarih seçici ve salt okunur form alanları oluşturmak',
        'Excel özetini veya proje brifingini Word Copilot promptuyla resmi teklife dönüştürmek',
        'Tek tıkla belge temizleme (Belge Denetçisi / Gizli Meta Veri kaldırma)'
      ],
      sections: [
        {
          heading: '1. Word Copilot ile Taslak, Tablo ve Yönetici Özeti',
          body: 'Word Copilot’ta yalnızca "teklif yaz" demek yerine yapılandırılmış brief verin: "Bu toplantı notlarından 1 sayfalık Yönetici Özeti çıkar; riskleri 3 maddelik tabloya koy ve resmi kurumsal tonda sonuç paragrafı yaz."',
          tip: 'Müşteriye veya kuruma sözleşme göndermeden önce Dosya -> Bilgi -> Sorunları Denetle -> Belgeyi Denetle adımıyla gizli yorumları ve yazar geçmişini temizleyin.'
        }
      ],
      aiPrompt: 'Kurumsal bir B2B hizmet sözleşmesi veya SLA eki hazırlamak için Word Copilot’a verilecek en etkili uzman promptu nasıl yazılır?',
      checkpoint: {
        q: 'Bir kurumda personelin yanlışlıkla bozamayacağı, çift tıklandığında kopyası yeni belge olarak açılan şablon uzantısı nedir?',
        opts: ['.docx', '.dotx', '.rtf', '.txt'],
        ans: 1,
        exp: '.dotx (Word Template), üzerine açılan her kullanımda orijinal şablonu koruyarak yeni bir .docx belgesi üretir.'
      }
    },

    // ================= MICROSOFT POWERPOINT =================
    {
      id: 'pp-1',
      track: 'powerpoint',
      group: 'office',
      order: 1,
      title: 'PowerPoint Temelleri: Görsel Hiyerarşi, 6x6 Kuralı & Hizalama',
      level: 'Başlangıç',
      isPro: false,
      duration: '10 dk',
      xp: 45,
      summary: 'Slaytları metin duvarına çevirmekten kurtulun; boşluk, kontrast, ızgara kılavuzları ve otomatik hizalama tekniklerini uygulayın.',
      objectives: [
        'Her slaytta tek ana mesaj ve okunabilir font boyutları (Başlık ≥28pt, Metin ≥16pt)',
        'Nesneleri elle göz kararı yerine Hizala -> Ortala / Yatay Dağıt ile hizalamak',
        'Yüksek kaliteli simge ve SVG grafiklerle görsel anlatımı güçlendirmek'
      ],
      sections: [
        {
          heading: '1. Metin Duvarı Yerine Mesaj Kartları',
          body: 'İzleyici aynı anda hem uzun paragraf okuyup hem sizi dinleyemez. Her slaytta en fazla 3-4 vurucu madde kullanın; detayları "Konuşmacı Notları" alanına yazın ve sunumda Alt+F5 (Sunucu Görünümü) ile yalnızca siz görün.',
          tip: 'Şekilleri seçip Biçim -> Hizala -> Yatay Olarak Dağıt dediğinizde kartlar piksel hassasiyetinde eşit aralıklı dizilir.'
        }
      ],
      aiPrompt: 'Bir ürün tanıtım sunumunda 1 slaytın ideal kelime sayısı, font boyutu ve renk paleti nasıl olmalıdır?',
      checkpoint: {
        q: 'Sunum sırasında seyirciler tam ekran slaytı görürken, sizin kendi ekranınızda konuşmacı notlarınızı ve sonraki slaytı görmenizi sağlayan mod hangisidir?',
        opts: ['Anahat Görünümü', 'Sunucu Görünümü (Presenter View)', 'Slayt Sıralayıcısı', 'Asıl Notlar'],
        ans: 1,
        exp: 'Sunucu Görünümü (Alt+F5), projektörde yalnızca aktif slaytı gösterirken sizin monitörünüzde zamanlayıcı, notlar ve sonraki slaytı gösterir.'
      }
    },
    {
      id: 'pp-2',
      track: 'powerpoint',
      group: 'office',
      order: 2,
      title: 'Asıl Slayt (Slide Master), Kurumsal Tema & Veri Grafikleri',
      level: 'Orta',
      isPro: false,
      duration: '14 dk',
      xp: 60,
      summary: '50 slayda tek tek logo ve renk yerleştirmeyi bırakın; Asıl Slayt ile kurumsal kimliği kilitleyin ve canlı Excel grafikleri bağlayın.',
      objectives: [
        'Görünüm -> Asıl Slayt üzerinden logo, altbilgi ve font temasını tek merkezden yönetmek',
        'Excel’den kopyalanan grafikleri "Bağla ve Kaynak Biçimlendirmesini Koru" ile canlı tutmak',
        'Karmaşık listeleri SmartArt veya ikon destekli sütun kartlarına dönüştürmek'
      ],
      sections: [
        {
          heading: '1. Asıl Slayt ile Zamandan Tasarruf',
          body: 'Görünüm -> Asıl Slayt alanına koyduğunuz logo, sayfa numarası veya marka çizgisi tüm sunum boyunca tek seferde uygulanır ve yanlışlıkla sürüklenip kaydırılamaz.'
        }
      ],
      aiPrompt: 'PowerPoint Asıl Slayt (Slide Master) üzerinde özel 3 sütunlu bir karşılaştırma düzeni nasıl oluşturulur?',
      checkpoint: {
        q: 'Tüm slaytlarda sol üst köşede sabit duran şirket logosunu ve kurumsal fontu tek yerden değiştirmek için nereye girilir?',
        opts: ['Geçişler Sekmesi', 'Görünüm -> Asıl Slayt (Slide Master)', 'Tasarım -> Slayt Boyutu', 'Animasyon Bölmesi'],
        ans: 1,
        exp: 'Asıl Slayt (Slide Master) sunumun ana şablon katmanıdır; yapılan değişiklik tüm düzenlere otomatik yansır.'
      }
    },
    {
      id: 'pp-3',
      track: 'powerpoint',
      group: 'office',
      order: 3,
      title: 'Morph (Dönüşüm) Geçişi, Hikaye Akışı & Sunum Koçu',
      level: 'İleri',
      isPro: false,
      duration: '16 dk',
      xp: 75,
      summary: 'Sinematik Morph slayt geçişleri kurgulayın, grafik verilerini adım adım animasyonlayın ve AI Sunum Koçu ile diksiyon/hız provası yapın.',
      objectives: [
        'Ardışık iki slaytta !!isimlendirme tekniğiyle kusursuz Morph dönüşümleri yapmak',
        'Grafik öğelerini "Seriye Göre" veya "Kategoriye Göre" tek tek animasyonla anlatmak',
        'Slayt Gösterisi -> Koç ile Prova Et (Rehearse with Coach) yapay zeka geri bildirimini kullanmak'
      ],
      sections: [
        {
          heading: '1. Sinematik Morph & !! Nesne Eşleştirme',
          body: '1. slayttaki daireyi 2. slaytı çoğaltıp büyüterek köşeye kaydırıp Geçişler -> Dönüşüm (Morph) seçtiğinizde nesne akıcı şekilde uçar. Farklı iki şekli birbirine dönüştürmek için Seçim Bölmesi’nde ikisine de !!kart gibi aynı "!!" ön ekli adı verin.',
          tip: 'Zoom özelliğiyle ana slayt üzerinden bölümlere tıklayıp yakınlaşan etkileşimli menü slaytları hazırlayabilirsiniz.'
        }
      ],
      aiPrompt: 'PowerPoint Morph geçişiyle dünya haritası veya ürün zaman çizelgesi nasıl sinematik şekilde canlandırılır?',
      checkpoint: {
        q: 'Farklı iki nesneyi (ör. kareyi daireye) Morph geçişiyle birbirine akıcı dönüştürmek için Seçim Bölmesinde nesne adlarının başına ne yazılır?',
        opts: ['@@', '!!', '##', '**'],
        ans: 1,
        exp: 'PowerPoint Morph motoru iki slaytta da çift ünlem (!!) ile başlayan aynı adı taşıyan farklı nesneleri otomatik morflar.'
      }
    },
    {
      id: 'pp-4',
      track: 'powerpoint',
      group: 'office',
      order: 4,
      title: 'Uzman Seviye: Yönetici Pitch Deck Mimarisi & PowerPoint AI Copilot',
      level: 'Uzman',
      isPro: true,
      duration: '18 dk',
      xp: 95,
      summary: 'Word teklif belgesinden saniyeler içinde sunum üretin; McKinsey "Aksiyon Başlığı" prensibiyle yatırımcı ve C-Level sunumları tasarlayın.',
      objectives: [
        'Slayt başlığını konu adı değil "çıkarılan karar/sonuç" cümlesi yapmak (Action Title)',
        'PowerPoint Copilot ile Word dosyasından doğrudan 10 slaytlık taslak oluşturmak',
        'Konuşmacı notlarını ve slayt özetlerini tek komutla çok dilli uyarlamak'
      ],
      sections: [
        {
          heading: '1. Word Belgesinden Tek Komutta Sunum',
          body: 'Copilot paneline "[Teklif.docx] dosyasına dayanarak yatırımcılar için Problem, Çözüm, Pazar Büyüklüğü, Finansal Projeksiyon ve Yol Haritasını içeren 10 slaytlık sunum oluştur" komutu verdiğinizde görselleri ve konuşmacı notlarıyla ilk taslak hazırlanır.'
        }
      ],
      aiPrompt: '10 slaytlık bir SaaS Yatırımcı Pitch Deck sunumu için slayt başlıkları (Action Title) ve içerik taslağı üret.',
      checkpoint: {
        q: 'Yönetici sunumlarında "Q3 Satışları" gibi genel başlık yerine "Q3 Satışları B2B Kanalıyla %24 Arttı" şeklinde sonuç yazma tekniğine ne denir?',
        opts: ['Action Title (Aksiyon Başlığı)', 'Slide Zoom', 'Footer Tag', 'Grid Snap'],
        ans: 0,
        exp: 'Aksiyon Başlığı, yöneticinin yalnızca başlığı okuyarak slaytın ana sonucunu 2 saniyede anlamasını sağlar.'
      }
    },

    // ================= OUTLOOK, TEAMS & COPILOT =================
    {
      id: 'ol-1',
      track: 'outlook',
      group: 'office',
      order: 1,
      title: 'Outlook Temelleri: Sıfır Gelen Kutusu (Inbox Zero) & Takvim Bloklama',
      level: 'Başlangıç',
      isPro: false,
      duration: '10 dk',
      xp: 45,
      summary: 'E-posta yığılmasını durdurun: "Sil / Arşivle / Yanıtla / Göreve Çevir" dörtlüsünü ve renkli takvim zaman bloklamasını uygulayın.',
      objectives: [
        'Gelen e-postaları tek dokunuşla Görev/Takvim öğesine sürüklemek',
        'Konuşma Görünümü ve Odaklanmış Gelen Kutusu ile dikkati korumak',
        'Takvimde derin odak çalışma blokları oluşturmak'
      ],
      sections: [
        {
          heading: '1. 2 Dakika Kuralı ve Göreve Sürükleme',
          body: '2 dakikada yanıtlanabilecek e-postayı hemen yanıtlayıp arşivleyin. Daha uzun iş gerektiren bir e-postayı sol/alt menüdeki Görevler (To Do) veya Takvim simgesinin üzerine sürükleyip bırakarak takvim tarihine kilitleyin.',
          tip: 'Outlook’ta Ctrl+R yanıtla, Ctrl+Shift+R tümüne yanıtla, Alt+S ise doğrudan gönderir.'
        }
      ],
      aiPrompt: 'Günde 100 e-posta alan bir yönetici için Outlook klasör ve kategori renk şeması öner.',
      checkpoint: {
        q: 'Outlook’ta bir e-postayı silmeden gelen kutusundan kaldırıp kolayca aranabilir arşive gönderen tek tuş kısayolu hangisidir?',
        opts: ['Backspace', 'F1', 'Esc', 'Tab'],
        ans: 0,
        exp: 'Seçili e-postada Backspace tuşuna basmak öğeyi anında Arşiv klasörüne taşır.'
      }
    },
    {
      id: 'ol-2',
      track: 'outlook',
      group: 'office',
      order: 2,
      title: 'Otomatik Kurallar (Rules), Hızlı Adımlar & Toplantı Yönetimi',
      level: 'Orta',
      isPro: false,
      duration: '13 dk',
      xp: 60,
      summary: 'Tekrarlayan e-posta yönlendirmelerini Kurallar ve Hızlı Adımlar (Quick Steps) ile otomatikleştirin; Planlama Yardımcısı ile saat bulun.',
      objectives: [
        'Belirli gönderici veya konuları otomatik klasöre/kategoriye taşıyan kurallar yazmak',
        'Hızlı Adımlar (Quick Steps) ile 4 tıklamalık işi tek kısayola indirmek',
        'Çoklu saat dilimlerinde Toplantı Planlama Yardımcısı kullanmak'
      ],
      sections: [
        {
          heading: '1. Hızlı Adımlar ve Kural Otomasyonu',
          body: 'Giriş -> Hızlı Adımlar altında "Ekibe İlet + Okundu İşaretle + Proje Klasörüne Taşı" gibi zincir aksiyonlara Ctrl+Shift+1 kısayolu atayabilirsiniz. Bilgi bültenlerini veya otomatik faturaları ise Kurallar ile gelen kutunuza hiç düşmeden ilgili klasöre yönlendirin.'
        }
      ],
      aiPrompt: 'Fatura ve onay e-postalarını otomatik etiketleyip klasöre ayıran Outlook Kural setini adım adım yaz.',
      checkpoint: {
        q: 'Tek tıklamayla hem e-postayı yöneticinize iletip hem okundu işaretleyip hem de Arşiv klasörüne taşıyan Outlook aracı nedir?',
        opts: ['İmza Yöneticisi', 'Hızlı Adımlar (Quick Steps)', 'Okuma Bölmesi', 'Kişi Kartı'],
        ans: 1,
        exp: 'Hızlı Adımlar (Quick Steps), birden fazla Outlook eylemini zincirleyip tek tıklama veya klavye kısayoluna bağlar.'
      }
    },
    {
      id: 'ol-3',
      track: 'outlook',
      group: 'office',
      order: 3,
      title: 'Teams Kanalları, SharePoint Ortak Çalışma & Power Automate',
      level: 'İleri',
      isPro: false,
      duration: '15 dk',
      xp: 75,
      summary: '"Dosya_Son_v3_GercektenSon.xlsx" karmaşasını bitirin; SharePoint sürüm geçmişi, ortak yazım ve Power Automate akışlarıyla çalışın.',
      objectives: [
        'E-posta eki yerine SharePoint/OneDrive canlı paylaşım linkiyle eşzamanlı düzenleme',
        'Dosya -> Bilgi -> Sürüm Geçmişi ile eski versiyona kayıpsız dönmek',
        'Power Automate mantığı: Tetikleyici (Form/Mail) -> Koşul -> Aksiyon (Teams/Excel)'
      ],
      sections: [
        {
          heading: '1. Sıfır Kod Otomasyonu: Power Automate',
          body: 'Bir müşteri Microsoft Forms anketini doldurduğunda verinin otomatik Excel tablosuna satır olarak yazılmasını ve Teams satış kanalına bildirim düşmesini Power Automate akışlarıyla tek satır kod yazmadan kurabilirsiniz.'
        }
      ],
      aiPrompt: 'Microsoft Forms yanıtını otomatik Excel’e yazıp Teams’e bildirim gönderen Power Automate akış adımlarını anlat.',
      checkpoint: {
        q: 'Ekip arkadaşlarıyla aynı Excel veya Word dosyasını ek olarak göndermek yerine bulutta eşzamanlı düzenlemenin en güvenli avantajı nedir?',
        opts: ['Otomatik sürüm geçmişi ve tek güncel kaynak', 'Dosyayı sadece 1 kişinin açabilmesi', 'İnternetsiz e-posta gönderimi', 'Yazı tipinin küçülmesi'],
        ans: 0,
        exp: 'SharePoint/OneDrive bağlantısı tüm ekibin tek güncel dosya üzerinde çalışmasını ve geçmiş sürümlere dönebilmesini sağlar.'
      }
    },
    {
      id: 'ol-4',
      track: 'outlook',
      group: 'office',
      order: 4,
      title: 'Uzman Seviye: Outlook & Teams AI Copilot ile Otonom Asistanlık',
      level: 'Uzman',
      isPro: true,
      duration: '16 dk',
      xp: 90,
      summary: 'Uzun e-posta zincirlerini özetletin, ses tonu koçluğu alın, Teams toplantı transkriptinden otomatik aksiyon listesi çıkarın.',
      objectives: [
        'Outlook Copilot "Özetle" ve "Copilot ile Taslak Oluştur" (Ton: Resmi/Kısa/Direct)',
        'Teams Copilot ile kaçırılan toplantıda kararları, açık soruları ve kime ne iş düştüğünü çıkarma',
        'Müşteri şikayeti / yöneticiden gelen kritik maile yanıt koçu ile risk kontrolü'
      ],
      sections: [
        {
          heading: '1. Teams Toplantı Sonrası Sıfır Tutanak Yükü',
          body: 'Toplantıda kayıt veya transkript açıkken toplantı bittiğinde Teams Copilot otomatik olarak: Alınan Kararlar, Kişi Bazlı Aksiyon Maddeleri ve Açık Kalan Soruları özetler. Siz yalnızca gözden geçirip ekiple paylaşırsınız.'
        }
      ],
      aiPrompt: 'Geciken bir proje teslimatı için müşteriye güven veren, net yeni tarih içeren profesyonel Outlook e-posta taslağı yaz.',
      checkpoint: {
        q: 'Teams Copilot’un bir toplantı sırasında veya sonunda kimin ne görev aldığını listelemek için dayandığı temel veri kaynağı nedir?',
        opts: ['Katılımcı e-posta imzaları', 'Toplantı konuşma dökümü (Transkript)', 'Bilgisayarın masaüstü duvar kağıdı', 'Tarayıcı yer imleri'],
        ans: 1,
        exp: 'Teams Copilot özet, karar ve aksiyon maddelerini oluşturmak için canlı toplantı transkriptini analiz eder.'
      }
    }
  ],

  // 8 INTERACTIVE LIVE EXCEL FORMULA PRACTICE CHALLENGES
  EXCEL_CHALLENGES: [
    {
      id: 'xl-c1',
      title: 'Görev 1 · Aylık Toplam Ciro (TOPLA / SUM)',
      level: 'Başlangıç',
      isPro: false,
      xp: 40,
      prompt: 'B2:B5 aralığındaki tüm ürün satış tutarlarının toplamını hesaplayan Excel formülünü yazın.',
      headers: ['A (Ürün)', 'B (Satış ₺)', 'C (Bölge)'],
      rows: [
        ['Bulut Paketi', 12000, 'İstanbul'],
        ['AI Modülü', 18500, 'Ankara'],
        ['Eğitim Lisansı', 9500, 'İzmir'],
        ['Destek Paketi', 10000, 'Bursa']
      ],
      targetLabel: 'B6 Toplam Hücresi',
      starter: '=TOPLA(',
      hint: 'Formülünüz "=" ile başlamalı ve B2:B5 aralığını toplamalı. Örnek: =TOPLA(B2:B5) veya =SUM(B2:B5).',
      solution: '=TOPLA(B2:B5)',
      expected: 50000,
      validateFormula: (f) => /TOPLA|SUM/i.test(f) && /B2\s*:\s*B5/i.test(f)
    },
    {
      id: 'xl-c2',
      title: 'Görev 2 · Ortalama Sipariş Tutarı (ORTALAMA / AVERAGE)',
      level: 'Başlangıç',
      isPro: false,
      xp: 40,
      prompt: 'C2:C5 aralığındaki müşteri memnuniyet puanlarının aritmetik ortalamasını hesaplayın.',
      headers: ['A (Müşteri)', 'B (Tutar ₺)', 'C (Puan)'],
      rows: [
        ['Atlas A.Ş.', 4200, 90],
        ['Vega Bilişim', 6800, 80],
        ['Kuzey Lojistik', 5100, 100],
        ['Mavi Teknoloji', 3900, 90]
      ],
      targetLabel: 'C6 Ortalama Puan',
      starter: '=ORTALAMA(',
      hint: 'C2’den C5’e olan aralığın ortalamasını almak için =ORTALAMA(C2:C5) veya =AVERAGE(C2:C5) kullanın.',
      solution: '=ORTALAMA(C2:C5)',
      expected: 90,
      validateFormula: (f) => /ORTALAMA|AVERAGE/i.test(f) && /C2\s*:\s*C5/i.test(f)
    },
    {
      id: 'xl-c3',
      title: 'Görev 3 · Hedef Başarı Durumu (EĞER / IF)',
      level: 'Orta',
      isPro: false,
      xp: 50,
      prompt: 'B2 hücresindeki satış tutarı 15000 veya daha büyükse "Hedef Aşıldı", değilse "Normal" döndüren EĞER formülünü yazın.',
      headers: ['A (Temsilci)', 'B (Satış ₺)', 'C (Kota ₺)'],
      rows: [
        ['Deniz K.', 18500, 15000],
        ['Arda M.', 12400, 15000],
        ['Selin Y.', 21000, 15000]
      ],
      targetLabel: 'D2 Durum (Deniz K.)',
      starter: '=EĞER(B2>=15000; "Hedef Aşıldı"; "")',
      hint: 'Koşul: B2>=15000, doğru ise "Hedef Aşıldı", yanlış ise "Normal". Parametreleri ";" veya "," ile ayırın.',
      solution: '=EĞER(B2>=15000; "Hedef Aşıldı"; "Normal")',
      expected: 'Hedef Aşıldı',
      validateFormula: (f) => /(EĞER|IF)\s*\(/i.test(f) && /B2\s*>=?\s*15000/i.test(f)
    },
    {
      id: 'xl-c4',
      title: 'Görev 4 · Kritik Stok Sayacı (EĞERSAY / COUNTIF)',
      level: 'Orta',
      isPro: false,
      xp: 55,
      prompt: 'B2:B6 aralığında stok adedi 10’dan küçük ("<10") olan kaç adet ürün bulunduğunu sayın.',
      headers: ['A (Ürün)', 'B (Stok Adedi)', 'C (Depo)'],
      rows: [
        ['Klavye', 4, 'Depo-1'],
        ['Monitör', 18, 'Depo-1'],
        ['Mouse', 7, 'Depo-2'],
        ['Kulaklık', 25, 'Depo-1'],
        ['Webcam', 3, 'Depo-2']
      ],
      targetLabel: 'B7 Kritik Ürün Sayısı',
      starter: '=EĞERSAY(B2:B6; )',
      hint: 'Kriteri çift tırnak içinde yazmalısınız: =EĞERSAY(B2:B6; "<10") veya =COUNTIF(B2:B6; "<10").',
      solution: '=EĞERSAY(B2:B6; "<10")',
      expected: 3,
      validateFormula: (f) => /(EĞERSAY|COUNTIF)\s*\(/i.test(f) && /B2\s*:\s*B6/i.test(f)
    },
    {
      id: 'xl-c5',
      title: 'Görev 5 · Departman Bütçesi (ETOPLA / SUMIF)',
      level: 'İleri',
      isPro: false,
      xp: 65,
      prompt: 'B2:B6 aralığı "Yazılım" olan satırların C2:C6 aralığındaki toplam giderini hesaplayın.',
      headers: ['A (Kalem)', 'B (Kategori)', 'C (Gider ₺)'],
      rows: [
        ['Bulut Sunucu', 'Yazılım', 4500],
        ['Kahve & İkram', 'Ofis', 1200],
        ['IDE Lisansı', 'Yazılım', 3000],
        ['Kargo', 'Operasyon', 800],
        ['AI API Kullanımı', 'Yazılım', 2500]
      ],
      targetLabel: 'C7 Yazılım Toplamı',
      starter: '=ETOPLA(B2:B6; "Yazılım"; )',
      hint: 'İlk argüman ölçüt aralığı (B2:B6), ikincisi şart ("Yazılım"), üçüncüsü toplanacak sütun (C2:C6).',
      solution: '=ETOPLA(B2:B6; "Yazılım"; C2:C6)',
      expected: 10000,
      validateFormula: (f) => /(ETOPLA|SUMIF)\s*\(/i.test(f) && /B2\s*:\s*B6/i.test(f) && /C2\s*:\s*C6/i.test(f)
    },
    {
      id: 'xl-c6',
      title: 'Görev 6 · Personel Arama (DÜŞEYARA / VLOOKUP)',
      level: 'İleri',
      isPro: false,
      xp: 75,
      prompt: 'A2:C5 tablosunda sicil kodu "P103" olan personelin Departmanını (2. sütun) tam eşleşmeyle getirin.',
      headers: ['A (Kod)', 'B (Departman)', 'C (Şehir)'],
      rows: [
        ['P101', 'Finans', 'İstanbul'],
        ['P102', 'İnsan Kaynakları', 'Ankara'],
        ['P103', 'Veri Mühendisliği', 'İzmir'],
        ['P104', 'Pazarlama', 'İstanbul']
      ],
      targetLabel: 'Aranan Değer: "P103"',
      starter: '=DÜŞEYARA("P103"; A2:C5; 2; 0)',
      hint: 'DÜŞEYARA("P103"; A2:C5; 2; 0) veya VLOOKUP("P103"; A2:C5; 2; 0) kullanın (4. parametre tam eşleşme 0 olmalı).',
      solution: '=DÜŞEYARA("P103"; A2:C5; 2; 0)',
      expected: 'Veri Mühendisliği',
      validateFormula: (f) => /(DÜŞEYARA|VLOOKUP)\s*\(/i.test(f) && /A2\s*:\s*C5/i.test(f)
    },
    {
      id: 'xl-c7',
      title: 'Görev 7 · Uzman Çapraz Arama (ÇAPRAZARA / XLOOKUP)',
      level: 'Uzman',
      isPro: true,
      xp: 90,
      prompt: 'Pro Laboratuvar: B2:B5 sütununda "Pro Yıllık" paketini arayıp SOLDAKİ A2:A5 sütunundan kodunu döndürün (ÇAPRAZARA).',
      headers: ['A (Paket Kodu)', 'B (Paket Adı)', 'C (Fiyat ₺)'],
      rows: [
        ['SKU-FREE', 'Standart', 0],
        ['SKU-PRO-M', 'Pro Aylık', 149],
        ['SKU-PRO-Y', 'Pro Yıllık', 1340],
        ['SKU-ENT', 'Kurumsal', 4900]
      ],
      targetLabel: 'Aranan: "Pro Yıllık" -> Paket Kodu',
      starter: '=ÇAPRAZARA("Pro Yıllık"; B2:B5; A2:A5)',
      hint: 'DÜŞEYARA sola arayamaz ama ÇAPRAZARA arar: =ÇAPRAZARA("Pro Yıllık"; B2:B5; A2:A5) veya =XLOOKUP(...).',
      solution: '=ÇAPRAZARA("Pro Yıllık"; B2:B5; A2:A5)',
      expected: 'SKU-PRO-Y',
      validateFormula: (f) => /(ÇAPRAZARA|XLOOKUP)\s*\(/i.test(f) && /B2\s*:\s*B5/i.test(f) && /A2\s*:\s*A5/i.test(f)
    },
    {
      id: 'xl-c8',
      title: 'Görev 8 · Uzman KDV Dahil Net Bütçe & Yuvarlama',
      level: 'Uzman',
      isPro: true,
      xp: 100,
      prompt: 'Pro Laboratuvar: B2:B4 kalemlerini toplayıp %20 KDV ekleyerek en yakın tam sayıya yuvarlayın (=YUVARLA(TOPLA(...)*1.2; 0)).',
      headers: ['A (Hizmet)', 'B (Net Fiyat ₺)', 'C (Dönem)'],
      rows: [
        ['Domain & SSL', 412, 'Yıllık'],
        ['Bulut Veritabanı', 840, 'Yıllık'],
        ['AI API Paketi', 1249, 'Yıllık']
      ],
      targetLabel: 'KDV Dahil Yuvarlanmış Toplam',
      starter: '=YUVARLA(TOPLA(B2:B4)*1.2; 0)',
      hint: 'İç içe formül kurun: =YUVARLA(TOPLA(B2:B4)*1.2; 0) veya =ROUND(SUM(B2:B4)*1.2; 0). (2501 * 1.2 = 3001.2 -> 3001)',
      solution: '=YUVARLA(TOPLA(B2:B4)*1.2; 0)',
      expected: 3001,
      validateFormula: (f) => /(YUVARLA|ROUND)\s*\(/i.test(f) && /(TOPLA|SUM)/i.test(f)
    }
  ],

  FLASHCARDS: [
    { id: 'oc-1', cat: 'Microsoft Office', front: 'Excel’de mutlak hücre sabitleme ($) kısayolu nedir?', back: 'Formül düzenlerken imleç hücre adının üzerindeyken F4 tuşuna basılır ($A$1).', code: '$B$2  -> satır ve sütun kilitli' },
    { id: 'oc-2', cat: 'Microsoft Office', front: 'Excel’de DÜŞEYARA (VLOOKUP) yerine modern XLOOKUP/ÇAPRAZARA neden önerilir?', back: 'ÇAPRAZARA sola doğru arama yapabilir, yeni sütun eklendiğinde bozulmaz ve varsayılanı tam eşleşmedir.', code: '=ÇAPRAZARA(aranan; arama_dizisi; sonuç_dizisi)' },
    { id: 'oc-3', cat: 'Microsoft Office', front: 'Excel’de seçili veriyi anında Akıllı Tablo’ya çeviren kısayol nedir?', back: 'Ctrl + T kısayolu dinamik genişleyen ve başlıkları sabitleyen tablo oluşturur.', code: 'Ctrl + T (Table)' },
    { id: 'oc-4', cat: 'Microsoft Office', front: 'Excel’de bir sütunun altına tek tuşla TOPLA (SUM) yazdırma kısayolu?', back: 'Alt + M (Türkçe arayüz) veya Alt + = kısayolu otomatik toplam formülü ekler.', code: '=TOPLA(B2:B20)' },
    { id: 'oc-5', cat: 'Microsoft Office', front: 'Excel #TAŞMA! (#SPILL!) hatası ne zaman oluşur?', back: 'FİLTRE veya BENZERSİZ gibi dinamik dizi formüllerinin yayılacağı hücreler dolu olduğunda.', code: 'Boş hücre açıldığında hata kendiliğinden düzelir.' },
    { id: 'oc-6', cat: 'Microsoft Office', front: 'Excel Power Query ne işe yarar?', back: 'Farklı Excel/CSV kaynaklarını kod yazmadan birleştirip temizler ve tek tıklamayla (Tümünü Yenile) günceller.', code: 'Veri -> Verileri Al -> Dönüştür' },
    { id: 'oc-7', cat: 'Microsoft Office', front: 'Excel’de VBA geliştirici penceresini hangi kısayol açar?', back: 'Alt + F11 kısayolu makroları yazacağınız VBA Editor penceresini açar.', code: 'Alt + F11 -> Insert -> Module' },
    { id: 'oc-8', cat: 'Microsoft Office', front: 'Excel’de Hızlı Doldurma (Flash Fill) kısayolu nedir?', back: 'Ctrl + E: İlk satırda ad-soyad ayırma örneği verip alt hücrede Ctrl+E basınca tüm sütunu akıllıca doldurur.', code: 'Ctrl + E' },
    { id: 'oc-9', cat: 'Microsoft Office', front: 'Word’de Enter’a art arda basmak yerine yeni sayfaya nasıl geçilir?', back: 'Ctrl + Enter ile kesin Sayfa Sonu (Page Break) eklenir.', code: 'Ctrl + Enter' },
    { id: 'oc-10', cat: 'Microsoft Office', front: 'Word’de otomatik İçindekiler Tablosu için ön şart nedir?', back: 'Bölüm başlıklarının kalın büyütülmesi değil, "Başlık 1 / Başlık 2" stilleriyle işaretlenmesi gerekir.', code: 'Giriş -> Stiller -> Başlık 1' },
    { id: 'oc-11', cat: 'Microsoft Office', front: 'Word’de aynı belgede bir sayfayı yatay diğerlerini dikey yapmak için ne eklenir?', back: 'Bölüm Sonu (Sonraki Sayfa) eklenerek sayfa yönlendirmesi o bölümden izole edilir.', code: 'Düzen -> Kesmeler -> Bölüm Sonları' },
    { id: 'oc-12', cat: 'Microsoft Office', front: 'Word .docx ile .dotx dosya uzantısı farkı nedir?', back: '.docx normal belge, .dotx ise her açılışta kopya belge oluşturan kurumsal şablon dosyasıdır.', code: 'Template (.dotx)' },
    { id: 'oc-13', cat: 'Microsoft Office', front: 'Word’de görünmeyen boşluk, sekme ve paragraf işaretlerini gösteren kısayol?', back: 'Ctrl + * (veya Giriş -> ¶ düğmesi) tüm biçim hatalarını görmeyi sağlar.', code: '¶ Göster / Gizle' },
    { id: 'oc-14', cat: 'Microsoft Office', front: 'PowerPoint’te Sunucu Görünümü (notlar sadece sizde) kısayolu nedir?', back: 'Alt + F5 ikinci ekranda slaytı, sizin ekranınızda konuşmacı notlarını ve süreyi açar.', code: 'Alt + F5' },
    { id: 'oc-15', cat: 'Microsoft Office', front: 'PowerPoint’te Asıl Slayt (Slide Master) ne sağlar?', back: 'Logo, kurumsal renk paleti ve font düzenini tüm slaytlarda tek merkezden kilitlemeyi sağlar.', code: 'Görünüm -> Asıl Slayt' },
    { id: 'oc-16', cat: 'Microsoft Office', front: 'PowerPoint Morph geçişinde farklı nesneleri dönüştürme hilesi nedir?', back: 'Seçim Bölmesi’nde iki slayttaki nesnelerin adını "!!" ön ekiyle aynı yapmak (örn. !!ikon).', code: '!!hero-kart' },
    { id: 'oc-17', cat: 'Microsoft Office', front: 'Yönetici sunumlarında "Action Title" (Aksiyon Başlığı) ne demektir?', back: 'Slayt başlığına konu adı ("Satışlar") yerine ana çıkarımı ("Satışlar B2B ile %24 Büyüdü") yazmaktır.', code: '2 saniyede mesaj' },
    { id: 'oc-18', cat: 'Microsoft Office', front: 'Outlook’ta e-postayı silmeden tek tuşla Arşiv klasörüne atan tuş nedir?', back: 'Seçili iletide Backspace tuşu doğrudan Arşive taşır.', code: 'Backspace -> Archive' },
    { id: 'oc-19', cat: 'Microsoft Office', front: 'Outlook "Hızlı Adımlar (Quick Steps)" özelliği ne yapar?', back: 'İletme + okundu işaretleme + klasöre taşıma gibi çoklu işlemleri tek buton veya kısayolda birleştirir.', code: 'Giriş -> Hızlı Adımlar' },
    { id: 'oc-20', cat: 'Microsoft Office', front: 'Microsoft Copilot Office belgelerinde neden Ctrl+T ve Stiller ile daha iyi çalışır?', back: 'Yapılandırılmış Excel Tabloları ve Word Başlık Stilleri yapay zekaya net veri şeması ve hiyerarşi sunar.', code: 'Yapısal Veri = İsabetli Copilot' }
  ],

  QUIZ_BANK: [
    // Başlangıç
    { id: 'oq1', cat: 'Microsoft Office', level: 'Başlangıç', q: 'Excel’de formül yazarken hangi işaretle başlanması zorunludur?', opts: ['=', '#', '$', '@'], ans: 0, exp: 'Excel’deki tüm formül ve fonksiyonlar "=" eşittir işareti ile başlar.' },
    { id: 'oq2', cat: 'Microsoft Office', level: 'Başlangıç', q: 'Excel’de B2:B10 aralığındaki sayıların ortalamasını alan doğru fonksiyon hangisidir?', opts: ['=TOPLA(B2:B10)', '=ORTALAMA(B2:B10)', '=EĞERSAY(B2:B10)', '=BÖL(B2:B10)'], ans: 1, exp: 'Aritmetik ortalama için ORTALAMA (İngilizce AVERAGE) fonksiyonu kullanılır.' },
    { id: 'oq3', cat: 'Microsoft Office', level: 'Başlangıç', q: 'Word’de yeni bir sayfayı önceki sayfa kaymalarından korumak için en doğru yöntem nedir?', opts: ['Boşluk tuşuna basmak', '20 kez Enter’a basmak', 'Ctrl + Enter ile Sayfa Sonu koymak', 'Yazı tipini büyütmek'], ans: 2, exp: 'Ctrl + Enter kesin sayfa sonu ekler; önceki sayfa düzenlense bile başlık yerinde kalır.' },
    { id: 'oq4', cat: 'Microsoft Office', level: 'Başlangıç', q: 'Outlook’ta seçili bir e-postayı silmeden Arşiv’e taşımak için hangi tuşa basılır?', opts: ['Delete', 'Backspace', 'F5', 'Shift'], ans: 1, exp: 'Backspace tuşu seçili e-postayı doğrudan Arşiv klasörüne taşır.' },
    { id: 'oq5', cat: 'Microsoft Office', level: 'Başlangıç', q: 'PowerPoint sunumunda bir slayttaki metin okunurluğu için temel kural nedir?', opts: ['Tüm metni paragraf halinde slayta sığdırmak', 'Anahtar noktaları kısa madde olarak verip detayı Konuşmacı Notuna almak', 'Font boyutunu 8 pt seçmek', 'Her slayta 6 farklı animasyon koymak'], ans: 1, exp: 'İzleyici slaytı hızlıca okumalı, konuşmacı detayları notlarından aktarmalıdır.' },

    // Orta
    { id: 'oq6', cat: 'Microsoft Office', level: 'Orta', q: 'Excel formülünde $D$1 yazımının anlamı nedir?', opts: ['Dolar para birimi ekler', 'D1 hücresini hem satır hem sütun olarak mutlak sabitler', 'D1 hücresini siler', 'Formülü gizler'], ans: 1, exp: '$ işareti referansı kilitler; formül sürüklendiğinde $D$1 değişmez.' },
    { id: 'oq7', cat: 'Microsoft Office', level: 'Orta', q: 'Stok adedinin 10’dan küçük olduğu ürün sayısını bulmak için hangi Excel fonksiyonu kullanılır?', opts: ['TOPLA', 'EĞERSAY', 'DÜŞEYARA', 'SAĞDAN'], ans: 1, exp: 'EĞERSAY(aralık; "<10") şarta uyan hücrelerin sayısını döndürür.' },
    { id: 'oq8', cat: 'Microsoft Office', level: 'Orta', q: 'Word belgesinde otomatik İçindekiler Tablosu hangi öğelerden otomatik üretilir?', opts: ['Başlık 1, Başlık 2 gibi Stil atanmış başlıklardan', 'Kalın (Bold) yapılan tüm kelimelerden', 'Kırmızı renkli satırlardan', 'Dipnotlardan'], ans: 0, exp: 'Başvurular -> İçindekiler Tablosu yalnızca Başlık stillerini algılar.' },
    { id: 'oq9', cat: 'Microsoft Office', level: 'Orta', q: 'PowerPoint’te tüm 40 slaytın arka planındaki şirket logosunu tek noktadan yöneten bölüm hangisidir?', opts: ['Slayt Sıralayıcısı', 'Asıl Slayt (Slide Master)', 'Tasarım Fikirleri', 'Notlar Sayfası'], ans: 1, exp: 'Görünüm -> Asıl Slayt tüm slayt düzenlerinin ana şablonudur.' },
    { id: 'oq10', cat: 'Microsoft Office', level: 'Orta', q: 'Outlook’ta belirlenen bir e-posta geldiğinde birden fazla işlemi (taşı+ileti+okundu) tek tuşta yapan araç?', opts: ['İmza', 'Hızlı Adımlar (Quick Steps)', 'Gelen Kutusu Sıralama', 'Otomatik Yanıt'], ans: 1, exp: 'Hızlı Adımlar çok adımlı Outlook işlemlerini tek kısayola indirger.' },

    // İleri
    { id: 'oq11', cat: 'Microsoft Office', level: 'İleri', q: 'DÜŞEYARA(E2; A2:C100; 3; 0) formülündeki "0" parametresi neyi ifade eder?', opts: ['Hata varsa 0 yaz', 'Tam eşleşme (Exact Match) ara', 'İlk 0 satırı atla', 'Yaklaşık eşleşme'], ans: 1, exp: '0 veya YANLIŞ yalnızca tam eşleşen kaydı getirir; aksi halde hatalı eşleşme riski oluşur.' },
    { id: 'oq12', cat: 'Microsoft Office', level: 'İleri', q: 'Excel’de veri temizleme ve her ay farklı CSV dosyalarını tek tıkla yenileyip birleştirme aracı hangisidir?', opts: ['Hedef Ara', 'Power Query (Verileri Al ve Dönüştür)', 'Yazım Denetimi', 'Sayfa Koruması'], ans: 1, exp: 'Power Query adım kaydeden tekrarlanabilir bir ETL veri dönüşüm motorudur.' },
    { id: 'oq13', cat: 'Microsoft Office', level: 'İleri', q: 'Word’de 300 kişiye Excel listesindeki isim ve maaş bilgileriyle tek şablondan mektup üretme aracı hangisidir?', opts: ['Postalar -> Adres Mektup Birleştirme', 'Makro Kaydedici', 'Sayfa Kenarlıkları', 'İzleme Modu'], ans: 0, exp: 'Adres-Mektup Birleştirme (Mail Merge) Excel satırlarını tek Word şablonuyla birleştirir.' },
    { id: 'oq14', cat: 'Microsoft Office', level: 'İleri', q: 'PowerPoint’te iki farklı geometrik şekli Morph geçişiyle birbirine dönüştürmek için Seçim Bölmesinde nesne adlarına ne yazılır?', opts: ['##isim', '!!isim', '$$isim', '//isim'], ans: 1, exp: 'Çift ünlem (!!) ön eki aynı olan nesneler Morph geçişinde birbirine dönüşür.' },
    { id: 'oq15', cat: 'Microsoft Office', level: 'İleri', q: 'SharePoint/Teams üzerinde paylaşılan bir belgede yanlışlıkla silinen dünkü tabloyu geri getirmenin en temiz yolu nedir?', opts: ['Yeniden yazmak', 'Dosya -> Sürüm Geçmişi (Version History) ile önceki sürümü yüklemek', 'Farklı Kaydetmek', 'PDF’e çevirmek'], ans: 1, exp: 'Bulut sürüm geçmişi önceki tüm kayıtlı anları saklar ve geri yüklemeye imkan verir.' },

    // Uzman
    { id: 'oq16', cat: 'Microsoft Office', level: 'Uzman', q: 'Aşağıdakilerden hangisi ÇAPRAZARA (XLOOKUP) fonksiyonunun DÜŞEYARA’ya göre üstünlüklerinden biridir?', opts: ['Sola doğru arama yapabilmesi ve araya sütun eklense bile bozulmaması', 'Yalnızca sayı arayabilmesi', 'Tabloyu A-Z sıralama zorunluluğu', 'Yalnızca ilk 100 satırda çalışması'], ans: 0, exp: 'ÇAPRAZARA arama ve dönüş dizisini ayrı seçtiği için hem sağa hem sola arar, sütun eklemeden etkilenmez.' },
    { id: 'oq17', cat: 'Microsoft Office', level: 'Uzman', q: 'Dinamik dizi formülü (ör. =FİLTRE(...)) komşu hücre dolu olduğu için aşağı doğru yazılamazsa hangi hata çıkar?', opts: ['#BAŞV!', '#TAŞMA! (#SPILL!)', '#YOK', '#AD?'], ans: 1, exp: 'Dökülecek aralıkta veri varsa Excel #TAŞMA! (#SPILL!) hatası verir.' },
    { id: 'oq18', cat: 'Microsoft Office', level: 'Uzman', q: 'Bir şirkette tüm personelin ortak açıp yalnızca form alanlarını dolduracağı Word şablonu hangi formatta kaydedilmelidir?', opts: ['.docm / .dotx', '.txt', '.csv', '.pdf'], ans: 0, exp: 'Kurumsal şablonlar .dotx (makro varsa .dotm / .docm) formatında saklanır.' },
    { id: 'oq19', cat: 'Microsoft Office', level: 'Uzman', q: 'PowerPoint Copilot ve Excel Copilot’un belgeleri çok daha hatasız analiz etmesi için kullanıcı önce ne yapmalıdır?', opts: ['Metinleri kalın boyamak', 'Veriyi Ctrl+T Akıllı Tablo ve Word’ü Başlık Stilleri ile yapılandırmak', 'Dosyayı masaüstüne kopyalamak', 'Sayfa yakınlaştırmasını %50 yapmak'], ans: 1, exp: 'Yapısal Tablo (Ctrl+T) ve Başlık Stilleri yapay zekanın şema ve hiyerarşiyi doğru okumasını sağlar.' },
    { id: 'oq20', cat: 'Microsoft Office', level: 'Uzman', q: 'Microsoft Teams Copilot’un toplantı sonunda otomatik "Aksiyon Maddeleri" çıkarması için toplantıda ne aktif olmalıdır?', opts: ['Arka plan bulanıklaştırma', 'Konuşma dökümü (Transkript / Kayıt)', 'Ekran çerçevesi', 'Sohbet emojileri'], ans: 1, exp: 'Teams Copilot özet, karar ve aksiyon maddelerini oluşturmak için canlı toplantı transkriptini kullanır.' }
  ],

  COPILOT_SCENARIOS: [
    {
      id: 'excel-formula',
      program: 'Microsoft Excel',
      title: 'Karmaşık Formül Üreticisi',
      level: 'Orta-İleri',
      isPro: false,
      promptSample: 'Müşteri satış tutarı B sütununda, şehri C sütununda; İstanbul içi 25.000 TL üstüne %8, diğerlerine %3 prim hesaplayan formül yaz.',
      templateOutput: `📊 Önerilen Excel Formülü:\n=EĞER(VE(C2="İstanbul"; B2>25000); B2*0,08; B2*0,03)\n\n💡 İngilizce Excel Karşılığı:\n=IF(AND(C2="İstanbul", B2>25000), B2*0.08, B2*0.03)\n\n⚡ İpucu: B2:B100 sütununu Ctrl+T ile Akıllı Tablo yaparsanız yeni eklenen satırlarda formül otomatik aşağı uzanır.`
    },
    {
      id: 'word-draft',
      program: 'Microsoft Word',
      title: 'Kurumsal Belge & Sözleşme Taslağı',
      level: 'Orta',
      isPro: false,
      promptSample: 'Yazılım bakım ve destek hizmeti için 4 maddelik profesyonel yönetici özeti ve teslim şartları taslağı oluştur.',
      templateOutput: `📄 WORD COPILOT TASLAĞI (Başlık Stillerine Uyumlu)\n\n[Başlık 1] 1. Hizmet Kapsamı ve Amaç\nBu protokol kapsamında yüklenici; web platformu bakım, performans izleme ve güvenlik yamalarını aylık SLA takvimine uygun sunar.\n\n[Başlık 2] 2. Hizmet Seviyesi Taahhütleri (SLA)\n• Kritik Kesintiler: 2 saat içinde müdahale\n• Planlı Bakım: Aylık 20 saat geliştirme ve yedekleme\n\n[Başlık 2] 3. Gizlilik ve Fikri Mülkiyet\nTaraflar çalışma süresince paylaşılan ticari ve teknik verileri üçüncü kişilerle paylaşmaz.`
    },
    {
      id: 'ppt-deck',
      program: 'Microsoft PowerPoint',
      title: 'Yönetici Pitch Deck Slayt İskeleti',
      level: 'İleri',
      isPro: false,
      promptSample: 'Yeni yapay zeka tabanlı ofis otomasyon projemiz için 5 slaytlık yönetim kurulu sunumu planı çıkar.',
      templateOutput: `🎯 POWERPOINT SUNUM İSKELETİ (Action Title Formatı)\n\nSlayt 1 (Kapak): Akıllı Ofis Otomasyonu — Operasyonel Hızda %40 Artış\nSlayt 2 (Sorun): Manuel Excel/Word Raporları Haftada 14 Saat Kaybettiriyor\nSlayt 3 (Çözüm): Copilot + Power Query ile Tek Tıklamalı Günlük Kokpit\nSlayt 4 (Finansal Etki): 6 Ayda Kendini Amorti Eden Lisans ve İşgücü Tasarrufu\nSlayt 5 (Yol Haritası): 1. Ay Pilot Ekip -> 2. Ay Tüm Birimler -> 3. Ay API Entegrasyonu`
    },
    {
      id: 'vba-auto',
      program: 'Excel VBA / Otomasyon (Pro)',
      title: 'Uzman Makro & Copilot İş Akışı Üreticisi',
      level: 'Uzman',
      isPro: true,
      promptSample: 'Tüm çalışma sayfalarındaki boş satırları temizleyip aktif raporu tarihli PDF olarak kaydeden profesyonel VBA makrosu yaz.',
      templateOutput: `⚡ PUSULA PRO — VBA OTOMASYON MAKROSU (Alt+F11)\n\nSub ProfesyonelRaporCiktisi()\n    Dim dosyaAdi As String\n    Application.ScreenUpdating = False\n    ActiveSheet.UsedRange.Columns.AutoFit\n    dosyaAdi = ThisWorkbook.Path & "\\Pusula_Rapor_" & Format(Date, "yyyy-mm-dd") & ".pdf"\n    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:=dosyaAdi, OpenAfterPublish:=True\n    Application.ScreenUpdating = True\n    MsgBox "Rapor başarıyla PDF olarak kaydedildi!", vbInformation\nEnd Sub\n\n🛡️ Not: Dosyayı .xlsm (Makro Etkin) olarak kaydetmeyi unutmayın.`
    }
  ]
};
