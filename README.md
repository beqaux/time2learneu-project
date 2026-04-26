# Time2LearnEU

Vibecoding ile sıfırdan inşa edilmiş bir Next.js öğrenme/quiz oyunu.

Bu repo iki amaca hizmet eder:

1. Hiç kod yazmamış birinin "vibecoding" akışını adım adım öğrenmesi için **örnek proje**
2. Hazır temeli indirip üstünde kendi denemelerini yapmak isteyenler için **başlangıç noktası**

> Not: Hiçbir programlama bilgisi gerekmiyor. Aşağıdaki adımları sırayla takip etmen yeterli.

---

## 1. Tek seferlik kurulum

Bu beş şeyi sırayla hallet (zaten varsa atla):

1. **Node.js** — https://nodejs.org/en/download
2. **Git** — https://git-scm.com/install/
3. **Antigravity** (Google'ın AI editörü) — https://antigravity.google/download
4. **GitHub hesabı** — https://github.com/
5. **Vercel** — https://vercel.com adresine git ve **GitHub hesabınla giriş yap**

Bittiyse hazırsın.

---

## Yöntem A — Sıfırdan kendi projeni yap

Kendi yeni projeni kurmak istiyorsan bu yolu izle. (Bu repoyu indirmek istiyorsan **Yöntem B**'ye geç.)

### 1) Proje klasörünü aç

- Antigravity'i aç
- Yeni bir klasör oluştur ve aç
- Üstten **yeni terminal** aç (Terminal → New Terminal)

### 2) Next.js'i kur

Terminale şunu yaz:

```bash
npx create-next-app@latest
```

- Tüm soruların varsayılan cevabını seç (Enter)
- `What is your project named?` sorusunda **`.` (nokta)** yaz ve devam et — bu "mevcut klasörü kullan" demek

### 3) Project Architect skill'ini kur

```bash
npx skills add ersinkoc/project-architect
```

- **openclaw**'u seç
- Diğer ayarlarda Enter'a basarak varsayılanlarla devam et

### 4) Referans dosyalarını AI'a tanıt

Sol taraftaki dosya menüsünde şu dosyaları bul:

- `references/`
- `README.md`
- `skill.md`

Bu üçünü **sağdaki agent paneline tek tek sürükle**.

> **Önemli:** Sağdaki panelde **Opus 4.6**'nın seçili olduğundan emin ol.

### 5) Projeyi planlat

Sağdaki panele şöyle yaz:

```
plan my project: [yapmak istediğin web sitesini detaylı anlat]
```

İki ipucu:

- Mesajın sonuna **"her adımda dur ve onayımı al"** eklersen dosyaları okuma ve istemediklerini düzeltme şansın olur.
- Next.js'in zaten kurulu olduğunu söyleyebilirsin (kendisi de fark edecek).

AI sana netleştirici sorular soracak — cevapla. Birkaç tur sonra elinde **`docs/PROMPT.MD`** adında bir dosya olacak.

### 6) Kodu yazdır

- Sağ üst köşedeki **+** simgesine tıkla → yeni chat aç
- Bu yeni chat'te modeli **Claude Sonnet** seç
- `docs/PROMPT.MD` dosyasını yeni chat'in içine sürükle
- Yaz: `bu prompt'a göre uygulamayı geliştir`

AI dosya oluştururken sana onay soracak — onayla. Proje hazır.

---

## Yöntem B — Bu repoyu indirip üstünde oyna

Sıfırdan başlamak istemiyorsan, bu hazır quiz oyununu indirip değiştirebilirsin.

### 1) Repoyu indir

Antigravity'i aç → terminal aç → şunu yaz:

```bash
git clone https://github.com/beqaux/time2learneu-project.git
cd time2learneu-project
npm install
```

`npm install` ilk seferde birkaç dakika sürebilir, sabırlı ol.

### 2) Projeyi çalıştır

```bash
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini aç — proje karşında.

### 3) Üstünde değişiklik yap

- **Küçük değişiklikler** (renk, metin, küçük tweakler): sağdaki AI paneline ne istediğini yaz, AI ilgili dosyayı düzenler.
- **Büyük yeni özellikler:** **mutlaka** `plan my project:` ile başla. Referans dosyalarını sağdaki panele sürüklemeyi unutma — yoksa AI bağlamı kaybeder ve yanlış yere gider.

  Sol taraftaki dosya menüsünde şu dosyaları bul:

- `references/`
- `README.md`
- `skill.md`

---

## Günlük kullanım ipuçları

- Projeyi çalıştırmak için ya AI'a "projeyi çalıştır" de ya da terminalde `npm run dev` yaz.
- Küçük tweakler için sağ panel yeterli.
- Yeni bir büyük özellik eklemek istiyorsan, her seferinde temiz bir `plan my project:` turu yap. Atladığında AI tahmin yürütmeye başlar.

---

## Projeyi yayınla (canlıya al)

Sitenin internette herkesin erişebileceği bir adres olmasını istediğinde:

### 1) GitHub'da yeni repo oluştur

- https://github.com/ → sağ üstte **+** → **New repository**
- İster public, ister private — ikisi de çalışır

### 2) Kodu GitHub'a yolla

GitHub yeni repoyu oluşturduktan sonra sana şuna benzer bir URL gösterecek:

```
https://github.com/KULLANICI_ADIN/REPO_ADIN.git
```

Bu URL'i kopyala. Antigravity'e dön:

- Sağdaki panelde modeli **Gemini Flash**'a geç (bu iş için hızlı ve ucuz)
- Yaz: `bunu github'a pushla: [kopyaladığın URL]`

İlk seferde AI senden GitHub girişi yapmanı isteyebilir — talimatları takip et.

### 3) Vercel'de deploy et

- GitHub'da repo sayfasını yenile, dosyaların yüklendiğini gör
- https://vercel.com adresine git → sağ üstte **Add New Project**
- En üstte yeni oluşturduğun repoyu göreceksin → **Deploy**'a tıkla
- Birkaç dakika içinde sitenin canlı linki hazır

---

## API ve veritabanı eklemek

Projen büyüdükçe form, kullanıcı girişi, skor saklama gibi özellikler isteyebilirsin.

- **API kısmını** AI tek başına halledebilir.
- **Veritabanı için** AI muhtemelen sana iki seçenek sunacak:
  1. Sen Vercel sitesi üzerinden kurulumu yap (AI sana adımları söyler)
  2. Vercel MCP kur ve AI yapsın
- **Tavsiye:** Birinci yol (Vercel sitesinden senin yapman) genelde daha hızlı ve daha az hata çıkarır.

---

## Bu projede ne var?

Time2LearnEU bir öğrenme/quiz oyunu. Kullanılan teknolojiler:

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **@dnd-kit** (sürükle-bırak)
- **Vitest** (testler)

> `AGENTS.md` dosyasında AI editörler için özel notlar var. Bu Next.js'in versiyonu yenidir — eski sürümlerden farklı davranır, AI'ın bunu bilmesi önemli.

---

## Sorun çıkarsa

- `npm install` hata veriyorsa: Node.js'in kurulu olduğundan emin ol (`node -v` ile kontrol et).
- `npm run dev` çalışmıyorsa: Önce `npm install` adımının başarıyla bittiğinden emin ol.
- Antigravity'de AI hata veriyorsa: Doğru modeli seçtiğinden emin ol (planlama için **Opus 4.6**, kod yazma için **Claude Sonnet**, basit işler için **Gemini Flash**).
