# Time2LearnEU — Specification

> Avrupa Birliği'nin temellerini interaktif quiz oyunlarıyla öğreten, Türkçe eğitim platformu.

## 1. Overview

### 1.1 Time2LearnEU Nedir?

Time2LearnEU, Avrupa Birliği hakkında sınırlı bilgiye sahip öğrencilerin AB'nin tarihini, kurumlarını, antlaşmalarını, kültürel sembollerini ve üye ülkelerini eğlenceli bir şekilde öğrenmelerini sağlayan tarayıcı tabanlı bir quiz oyunudur.

Kullanıcılar farklı kategorilerden ve zorluk seviyelerinden sorularla karşılaşır. Sorular çoktan seçmeli, serbest metin giriş ve eşleştirme (sürükle-bırak) formatlarında sunularak öğrenme deneyimi çeşitlendirilir. Kayıt veya giriş gerektirmeden herkes hemen oynamaya başlayabilir.

Proje, AB hakkında farkındalık yaratmayı amaçlayan eğitim girişiminin dijital ayağıdır. MVP kapsamında, tamamen istemci taraflı çalışan, statik verilerle beslenen ve Vercel'e deploy edilen hafif bir web uygulaması olarak tasarlanmıştır.

### 1.2 Hedef Kitle

- **Birincil**: AB konusunda sınırlı bilgiye sahip üniversite ve lise öğrencileri
- **İkincil**: AB hakkında genel kültür edinmek isteyen yetişkinler
- **Bağlam**: Erasmus+, Jean Monnet ve benzeri AB eğitim projeleri katılımcıları

### 1.3 Temel Farklılaştırıcılar

- **Karma soru formatları**: Tek tip quiz yerine çoktan seçmeli, serbest metin ve eşleştirme formatlarının birlikte kullanımı
- **Zorluk segmentasyonu**: Her kategori için 3 ayrı zorluk seviyesi ile kademeli öğrenme
- **Sıfır-engel erişim**: Kayıt, giriş veya kurulum gerektirmez — tarayıcıda hemen oynanır
- **Türkçe içerik**: AB eğitim materyallerinin Türkçe sunulması
- **AB temalı görsel kimlik**: Resmi ama modern, AB renk paletine uyumlu tasarım

## 2. Temel Kavramlar

| Kavram | Tanım |
|--------|-------|
| **Kategori (Category)** | Soru havuzunun tematik gruplandırması (ör. AB Tarihi, Antlaşmalar) |
| **Zorluk Seviyesi (Difficulty)** | Kolay, Orta, Zor — her soruda belirtilen zorluk derecesi |
| **Soru Tipi (Question Type)** | Sorunun formatı: `multiple-choice`, `free-text`, `matching` |
| **Çoktan Seçmeli (Multiple Choice)** | 4 seçenekten birini seçme formatı |
| **Serbest Metin (Free Text)** | Kullanıcının cevabı yazarak girdiği format; fuzzy matching ile değerlendirilir |
| **Eşleştirme (Matching)** | Sol ve sağ sütundaki öğeleri sürükle-bırak ile eşleştirme formatı |
| **Oyun Oturumu (Game Session)** | Bir kategoride, bir zorluk seviyesinde başlatılan soru seti |
| **Puan (Score)** | Doğru cevaplanan soru başına kazanılan sayısal değer |
| **Fuzzy Matching** | Serbest metin cevaplarda küçük yazım hatalarını tolere eden eşleştirme |

## 3. Fonksiyonel Gereksinimler

### 3.1 Ana Sayfa

#### 3.1.1 Karşılama Ekranı

**Kullanıcı Hikayesi:** Bir öğrenci olarak, siteye girdiğimde projenin ne hakkında olduğunu anlayabilmek ve hemen oynamaya başlayabilmek istiyorum.

**Açıklama:** Ana sayfa, Time2LearnEU'nun amacını kısaca açıklayan bir karşılama mesajı, AB temalı görsel unsurlar ve "Oyuna Başla" butonu içerir.

**Kabul Kriterleri:**
- [ ] Sayfa yüklendiğinde proje adı, kısa açıklama ve CTA butonu görünür
- [ ] "Oyuna Başla" butonuna tıklandığında kategori seçim ekranına yönlendirilir
- [ ] Mobil ve masaüstü cihazlarda responsive görüntülenir

### 3.2 Kategori & Zorluk Seçimi

#### 3.2.1 Kategori Seçim Ekranı

**Kullanıcı Hikayesi:** Bir öğrenci olarak, ilgilendiğim konuyu seçerek o alanda kendimi test etmek istiyorum.

**Açıklama:** Mevcut kategoriler kart veya grid şeklinde listelenir. Her kategorinin adı, kısa açıklaması ve soru sayısı gösterilir.

**Kabul Kriterleri:**
- [ ] Tüm mevcut kategoriler görsel kartlar halinde listelenir
- [ ] Her kart kategori adı, açıklaması ve soru sayısını gösterir
- [ ] Kategoriye tıklandığında zorluk seviyesi seçim ekranına geçilir

#### 3.2.2 Zorluk Seviyesi Seçimi

**Kullanıcı Hikayesi:** Bir öğrenci olarak, bilgi seviyeme uygun zorlukta oynamak istiyorum.

**Açıklama:** Seçilen kategori için Kolay, Orta, Zor seviyeler sunulur. Her seviyenin ne ifade ettiği kısaca açıklanır.

**Kabul Kriterleri:**
- [ ] 3 zorluk seviyesi (Kolay, Orta, Zor) açıklamalı olarak gösterilir
- [ ] Seviye seçildiğinde ilgili kategorinin o seviyedeki soruları ile oyun başlar
- [ ] Her seviye için soru sayısı gösterilir

### 3.3 Quiz Engine

#### 3.3.1 Çoktan Seçmeli Sorular

**Kullanıcı Hikayesi:** Bir öğrenci olarak, verilen seçenekler arasından doğru cevabı seçmek istiyorum.

**Açıklama:** Soru metni ve 4 seçenek gösterilir. Kullanıcı bir seçeneğe tıklayarak cevaplar.

**Kabul Kriterleri:**
- [ ] Soru metni ve 4 seçenek net şekilde gösterilir
- [ ] Tıklanan seçenek görsel olarak işaretlenir
- [ ] Cevap verildiğinde doğru/yanlış geri bildirimi gösterilir
- [ ] Doğru cevap her zaman vurgulanır (yanlış cevapta bile)
- [ ] Kısa açıklama (explanation) gösterilir

#### 3.3.2 Serbest Metin Sorular

**Kullanıcı Hikayesi:** Bir öğrenci olarak, cevabı kendim yazarak bilgimi test etmek istiyorum.

**Açıklama:** Soru metni ve metin giriş alanı gösterilir. Kullanıcı cevabını yazar ve gönderir. Cevap fuzzy matching ile değerlendirilir.

**Kabul Kriterleri:**
- [ ] Metin giriş alanı ve "Cevapla" butonu gösterilir
- [ ] Fuzzy matching ile küçük yazım hataları tolere edilir (%80+ benzerlik = doğru)
- [ ] Büyük/küçük harf duyarsız karşılaştırma yapılır
- [ ] Doğru/yanlış geri bildirimi ve doğru cevap gösterilir
- [ ] Boş cevap gönderilemez

**Sınır Durumları:**
- Türkçe karakterler (ç, ş, ğ, ü, ö, ı) doğru şekilde karşılaştırılır
- Fazladan boşluk ve noktalama işaretleri göz ardı edilir

#### 3.3.3 Eşleştirme Soruları

**Kullanıcı Hikayesi:** Bir öğrenci olarak, ilgili kavramları birbiriyle eşleştirerek öğrenmek istiyorum.

**Açıklama:** Sol sütunda öğeler (ör. ülke adları), sağ sütunda eşleştirilecek öğeler (ör. başkentler) gösterilir. Kullanıcı sürükle-bırak veya tıklama ile eşleştirme yapar.

**Kabul Kriterleri:**
- [ ] Sol ve sağ sütunlar net şekilde gösterilir
- [ ] Sürükle-bırak ile eşleştirme yapılabilir
- [ ] Mobilde tıklama-tabanlı eşleştirme alternatifi sunulur
- [ ] Tüm eşleştirmeler yapılmadan "Kontrol Et" butonu aktif olmaz
- [ ] Doğru ve yanlış eşleştirmeler renk koduyla gösterilir
- [ ] En az 4, en fazla 6 eşleştirme çifti olur

**Sınır Durumları:**
- Yarım bırakılmış eşleştirmelerde uyarı gösterilir
- Aynı öğe iki kez eşleştirilemez

### 3.4 Puanlama Sistemi

#### 3.4.1 Puan Hesaplama

**Kullanıcı Hikayesi:** Bir öğrenci olarak, ne kadar başarılı olduğumu görmek istiyorum.

**Açıklama:** Her doğru cevap puan kazandırır. Oturum sonunda toplam puan ve başarı yüzdesi gösterilir.

**Kabul Kriterleri:**
- [ ] Çoktan seçmeli doğru cevap: 10 puan
- [ ] Serbest metin doğru cevap: 25 puan (daha zor olduğu için)
- [ ] Eşleştirme: Her doğru çift 5 puan
- [ ] Oturum boyunca toplam puan ekranda gösterilir
- [ ] Puan negatif olmaz (yanlış cevap 0 puan)

### 3.5 Sonuç Ekranı

#### 3.5.1 Oyun Sonu Özeti

**Kullanıcı Hikayesi:** Bir öğrenci olarak, oyun sonunda performansımı görmek ve tekrar oynamak istiyorum.

**Açıklama:** Oturum tamamlandığında toplam puan, doğru/yanlış sayısı, başarı yüzdesi ve motivasyonel mesaj gösterilir.

**Kabul Kriterleri:**
- [ ] Toplam puan, doğru sayısı, yanlış sayısı ve başarı yüzdesi gösterilir
- [ ] Başarı yüzdesine göre motivasyonel mesaj değişir (%80+ tebrik, %50-79 cesaretlendirme, <%50 tekrar deneme)
- [ ] "Tekrar Oyna" butonu aynı kategori/zorlukta yeni oyun başlatır
- [ ] "Ana Sayfa" butonu ana sayfaya döndürür
- [ ] "Başka Kategori Seç" butonu kategori seçimine döndürür

## 4. Mimari Genel Bakış

### 4.1 Sistem Bileşenleri

| Bileşen | Açıklama |
|---------|----------|
| **Landing Page** | Karşılama ekranı ve navigasyon |
| **Category Selector** | Kategori ve zorluk seçim arayüzü |
| **Quiz Engine** | Soru gösterimi, cevap toplama ve değerlendirme mantığı |
| **Score Manager** | Oturum içi puan hesaplama ve takip |
| **Question Store** | Statik JSON dosyalarından soru verisi okuma |
| **Result Screen** | Oyun sonu özet ve aksiyonlar |

### 4.2 Bileşen Etkileşimleri

```
[Landing] → [Category Selector] → [Quiz Engine] → [Result Screen]
                                        ↑                ↓
                                   [Question Store]  [Category Selector]
                                        ↑
                                   [Score Manager]
```

- Tüm mantık istemci taraflıdır (client-side)
- Soru verileri build time'da statik JSON'dan okunur
- Sayfa geçişleri Next.js routing ile yönetilir
- Sunucu taraflı API gerekliliği yoktur

### 4.3 Dış Entegrasyonlar

Yok. MVP tamamen bağımsız çalışır — dış API, veritabanı veya servis bağımlılığı yoktur.

## 5. Veri Modeli

### 5.1 Temel Varlıklar

#### Category

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| id | string | Evet | Benzersiz kategori kimliği (ör. "eu-history") |
| name | string | Evet | Görünen kategori adı (ör. "AB Tarihi") |
| description | string | Evet | Kısa açıklama |
| icon | string | Evet | Kategori ikonu (emoji veya SVG referansı) |
| questionCount | object | Evet | Zorluk seviyelerine göre soru sayıları |

#### Question (Multiple Choice)

| Alan | Tip | Zorunlu | Açıklama | Kısıtlamalar |
|------|-----|---------|----------|--------------|
| id | string | Evet | Benzersiz soru kimliği | UUID veya slug |
| category | string | Evet | Kategori referansı | Geçerli kategori ID |
| type | string | Evet | Soru tipi | "multiple-choice" |
| difficulty | string | Evet | Zorluk seviyesi | "easy" \| "medium" \| "hard" |
| question | string | Evet | Soru metni | Max 500 karakter |
| options | string[] | Evet | Seçenekler | Tam 4 seçenek |
| correctAnswer | string | Evet | Doğru cevap | options dizisinde bulunmalı |
| explanation | string | Evet | Açıklama | Max 300 karakter |

#### Question (Free Text)

| Alan | Tip | Zorunlu | Açıklama | Kısıtlamalar |
|------|-----|---------|----------|--------------|
| id | string | Evet | Benzersiz soru kimliği | UUID veya slug |
| category | string | Evet | Kategori referansı | Geçerli kategori ID |
| type | string | Evet | Soru tipi | "free-text" |
| difficulty | string | Evet | Zorluk seviyesi | "easy" \| "medium" \| "hard" |
| question | string | Evet | Soru metni | Max 500 karakter |
| correctAnswer | string | Evet | Doğru cevap | Fuzzy matching referansı |
| acceptableAnswers | string[] | Hayır | Alternatif doğru cevaplar | |
| explanation | string | Evet | Açıklama | Max 300 karakter |

#### Question (Matching)

| Alan | Tip | Zorunlu | Açıklama | Kısıtlamalar |
|------|-----|---------|----------|--------------|
| id | string | Evet | Benzersiz soru kimliği | UUID veya slug |
| category | string | Evet | Kategori referansı | Geçerli kategori ID |
| type | string | Evet | Soru tipi | "matching" |
| difficulty | string | Evet | Zorluk seviyesi | "easy" \| "medium" \| "hard" |
| question | string | Evet | Talimat metni | Max 500 karakter |
| pairs | {left: string, right: string}[] | Evet | Eşleştirme çiftleri | 4-6 çift |
| explanation | string | Evet | Açıklama | Max 300 karakter |

#### GameSession (Runtime — bellekte tutulur)

| Alan | Tip | Açıklama |
|------|-----|----------|
| category | string | Seçilen kategori ID |
| difficulty | string | Seçilen zorluk seviyesi |
| questions | Question[] | Oturumdaki sorular (karıştırılmış) |
| currentIndex | number | Şu anki soru indeksi |
| answers | Answer[] | Verilen cevaplar |
| score | number | Toplam puan |
| status | string | "playing" \| "completed" |

### 5.2 İlişkiler

- Category → has many → Questions (one-to-many)
- GameSession → references → Category (many-to-one)
- GameSession → contains → Questions subset (filtered by difficulty)

### 5.3 Veri Yaşam Döngüsü

- **Sorular**: Build time'da statik JSON dosyalarından okunur, değişmez
- **GameSession**: Tarayıcıda bellekte oluşturulur, sayfa kapatıldığında kaybolur
- **Kalıcılık**: MVP'de veri kalıcılığı yoktur — her oturum bağımsızdır

## 6. Kullanıcı Arayüzü

### 6.1 Arayüz Tipi

Web UI — tarayıcı tabanlı, responsive single-page application tarzında deneyim.

### 6.2 Ana Ekranlar

| Ekran | Amaç | Temel Öğeler | Navigasyon |
|-------|------|-------------|------------|
| **Ana Sayfa** | Karşılama ve yönlendirme | Logo, açıklama, "Oyuna Başla" CTA | → Kategori Seçimi |
| **Kategori Seçimi** | Konu seçimi | Kategori kartları (grid) | → Zorluk Seçimi |
| **Zorluk Seçimi** | Seviye seçimi | 3 seviye kartı | → Oyun Ekranı |
| **Oyun Ekranı** | Quiz oyunu | Soru, cevap alanı, ilerleme, puan | → Sonuç Ekranı |
| **Sonuç Ekranı** | Performans özeti | Puan, istatistik, aksiyonlar | → Ana Sayfa / Kategori |

### 6.3 Responsive Gereksinimler

- **Mobil**: 320px+ — tek sütun, dokunmatik optimize
- **Tablet**: 768px+ — iki sütun kartlar
- **Masaüstü**: 1024px+ — tam genişlik, hover efektleri
- Eşleştirme soruları mobilde tıklama-tabanlı alternatif sunar
- Minimum erişilebilirlik: temel klavye navigasyonu, yeterli kontrast oranları

## 7. Deployment Modeli

### 7.1 Hedef Ortam

- **Production**: Vercel (otomatik deploy, edge CDN)
- **Development**: Localhost (Next.js dev server)

### 7.2 Dağıtım Yöntemi

- Git push → Vercel otomatik build & deploy
- Statik/SSG sayfalar + client-side interaksiyon
- Sunucu taraflı API gerekliliği yok

### 7.3 Konfigürasyon

Minimal — ortam değişkeni gerekliliği yok. Tüm konfigürasyon build-time sabitlerinde.

## 8. Kısıtlamalar & Kapsam Dışı

### 8.1 Teknik Kısıtlamalar

- Next.js 16 + TailwindCSS + TypeScript zorunlu (mevcut kurulum)
- Vercel ücretsiz plan limitleri geçerli
- Tüm soru verileri statik JSON — runtime'da değiştirilemez

### 8.2 Kapsam Dışı (Non-Goals)

- **Kullanıcı hesapları / kimlik doğrulama**: MVP'de yok, v2'de değerlendirilebilir
- **Leaderboard / sıralama tablosu**: Veritabanı gerektirir, MVP kapsamında değil
- **Admin paneli / soru yönetimi**: Sorular JSON dosyalarında elle düzenlenir
- **Çoklu dil desteği**: Sadece Türkçe — i18n altyapısı MVP'de yok
- **Zamanlı sorular**: Timer/geri sayım MVP kapsamında değil
- **Sosyal paylaşım**: Sonuç paylaşma özelliği MVP sonrası
- **Offline çalışma (PWA)**: Service worker / offline cache MVP'de yok
- **Analytics / telemetri**: Kullanıcı izleme MVP'de yok

### 8.3 Varsayımlar

- Kullanıcılar modern tarayıcı kullanır (Chrome 90+, Firefox 90+, Safari 15+, Edge 90+)
- İnternet bağlantısı mevcuttur
- Soru sayısı MVP'de kategori başına 10-20 soru yeterlidir
- Türkçe karakter desteği tüm hedef cihazlarda mevcuttur

## 9. Gelecek Planları

- **v1.1**: Zamanlı mod (soru başına geri sayım), skor geçmişi (localStorage)
- **v1.2**: Leaderboard (basit backend ile), sosyal paylaşım
- **v2.0**: Çoklu dil desteği, admin paneli, kullanıcı hesapları, ilerleme takibi
