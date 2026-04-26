# Time2LearnEU — Tasks

> IMPLEMENTATION.md'den türetilen sıralı iş kalemleri. Sırayla çalıştırılır.

## Özet

| Metrik | Değer |
|--------|-------|
| Toplam Task | 12 |
| Fazlar | 4 |
| Tahmini Efor | 20-30 saat |
| Temel Tamamlandı | Task 4 sonrası |
| MVP Tamamlandı | Task 10 sonrası |
| Tam Sürüm | Task 12 sonrası |

---

## Faz 1: Proje Temeli

> Proje yapısı, tipler ve veri katmanı. Bu faz sonunda: proje derlenir, henüz işlevsel değil.

### Task 1: Proje İskeleti & Bağımlılıklar

**Mevcut Next.js 16 projesine dizin yapısını ve bağımlılıkları ekle.**

**Dosyalar oluşturulacak:**
- `components/ui/` — boş dizin
- `components/landing/` — boş dizin
- `components/quiz/` — boş dizin
- `components/result/` — boş dizin
- `lib/types.ts` — boş export
- `lib/constants.ts` — boş export
- `hooks/` — boş dizin
- `data/categories.ts` — boş export
- `data/questions/` — boş dizin
- `__tests__/` — boş dizin

**Komutlar:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**package.json'a script ekle:**
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Kabul Kriterleri:**
- [ ] `npm run build` hatasız tamamlanır
- [ ] `npm run lint` geçer
- [ ] `npm test` çalışır (0 test, 0 hata)
- [ ] IMPLEMENTATION.md §3.1'deki tüm dizinler mevcut
- [ ] @dnd-kit paketleri node_modules'da yüklü

**Bağımlılıklar:** Yok
**Efor:** 1 saat
**Ref:** IMPL §1.3, §3.1

---

### Task 2: Tip Tanımları & Sabitler

**Tüm domain entity'lerini, arayüzleri ve sabitleri tanımla.**

**Dosyalar oluşturulacak:**
- `lib/types.ts` — Tüm TypeScript tipleri (SPEC §5.1)
- `lib/constants.ts` — Puan değerleri, eşik değerleri (SPEC §3.4)

**lib/types.ts içerik:**
```typescript
// Difficulty, QuestionType enum/union
// BaseQuestion, MultipleChoiceQuestion, FreeTextQuestion, MatchingQuestion
// Question (union type)
// Category, MatchingPair
// PlayerAnswer, EvaluationResult
// GameState, GameAction, GameStatus
```

**lib/constants.ts içerik:**
```typescript
// POINTS: { multipleChoice: 10, freeText: 15, matchingPair: 5 }
// FUZZY_THRESHOLD: 0.8
// MOTIVATIONAL_MESSAGES: { excellent, good, retry }
```

**Kabul Kriterleri:**
- [ ] Tüm tipler derlenir, `any` tipi yok
- [ ] Tüm entity'ler SPEC §5.1'deki alanları içerir
- [ ] Sabitler SPEC §3.4'teki puan değerlerini yansıtır
- [ ] Tipler diğer modüllerden import edilebilir

**Bağımlılıklar:** Task 1
**Efor:** 1-2 saat
**Ref:** SPEC §2, §5; IMPL §2

---

### Task 3: Fuzzy Matching Modülü

**Serbest metin cevaplar için Levenshtein distance tabanlı benzerlik karşılaştırma.**

**Dosyalar oluşturulacak:**
- `lib/fuzzy-match.ts` — levenshteinDistance, normalizeTurkish, fuzzyMatch fonksiyonları
- `__tests__/fuzzy-match.test.ts` — Kapsamlı testler

**Implementasyon detayları:**
- `normalizeTurkish(str)`: Küçük harf, Türkçe karakter normalize (ş→s, ç→c, ğ→g, ü→u, ö→o, ı→i), boşluk/noktalama temizle
- `levenshteinDistance(a, b)`: Standart Levenshtein algoritması
- `fuzzyMatch(input, target, threshold?)`: Normalize → mesafe hesapla → benzerlik oranı ≥ threshold ise true

**Test gereksinimleri:**
- Tam eşleşme → true
- Büyük/küçük harf farkı → true
- Türkçe karakter varyasyonları → true
- %80+ benzerlik → true
- %80 altı → false
- Boş string → false

**Kabul Kriterleri:**
- [ ] `fuzzyMatch("Türkiye", "turkiye")` → true
- [ ] `fuzzyMatch("Maastricht", "Mastrict")` → true
- [ ] `fuzzyMatch("Avrupa", "Amerika")` → false
- [ ] `fuzzyMatch("", "test")` → false
- [ ] `npm test` tüm fuzzy-match testleri geçer

**Bağımlılıklar:** Task 2
**Efor:** 2 saat
**Ref:** SPEC §3.3.2; IMPL §1.2 (Fuzzy Matching kararı)

---

### Task 4: Oyun Motoru & Değerlendiriciler

**State machine (gameReducer) ve soru tipi değerlendiricilerini oluştur.**

**Dosyalar oluşturulacak:**
- `lib/evaluators.ts` — MultipleChoice, FreeText, Matching değerlendiricileri + evaluateAnswer()
- `lib/game-engine.ts` — gameReducer, initialGameState
- `__tests__/evaluators.test.ts` — Değerlendirme testleri
- `__tests__/game-engine.test.ts` — State machine testleri

**lib/evaluators.ts:**
- `evaluateAnswer(question, playerAnswer)` → EvaluationResult
- Multiple-choice: exactMatch → 10 puan
- Free-text: fuzzyMatch → 15 puan
- Matching: her doğru çift → 5 puan

**lib/game-engine.ts:**
- State Machine deseni (IMPL §2.1): idle → selecting → playing → answered → completed
- Actions: SELECT_CATEGORY, SELECT_DIFFICULTY, START_GAME, SUBMIT_ANSWER, NEXT_QUESTION, COMPLETE_GAME, RESET

**Kabul Kriterleri:**
- [ ] gameReducer tüm state geçişlerini doğru yönetir
- [ ] Geçersiz state geçişleri göz ardı edilir (SUBMIT_ANSWER sadece 'playing' durumunda)
- [ ] Çoktan seçmeli doğru cevap → 10 puan
- [ ] Serbest metin doğru cevap → 25 puan
- [ ] Eşleştirme her doğru çift → 5 puan
- [ ] `npm test` tüm testler geçer

**Bağımlılıklar:** Task 3
**Efor:** 3 saat
**Ref:** SPEC §3.3, §3.4; IMPL §2.1, §2.2

---

## Faz 2: Veri & Soru İçeriği

> Kategori tanımları ve soru verileri. Bu faz sonunda: tüm veriler hazır, UI henüz yok.

### Task 5: Kategori Tanımları & Soru Yükleyici

**Kategori metadata ve soru filtreleme/yükleme modülünü oluştur.**

**Dosyalar oluşturulacak:**
- `data/categories.ts` — 5 kategori tanımı
- `lib/question-loader.ts` — getQuestionsByCategory, getAllCategories fonksiyonları

**Kategoriler:**
1. `eu-history` — AB Tarihi (🏛️)
2. `institutions` — AB Kurumları (🏢)
3. `treaties` — Antlaşmalar (📜)
4. `culture-symbols` — Kültür & Semboller (🌍)
5. `geography-members` — Coğrafya & Üye Ülkeler (🗺️)

**Kabul Kriterleri:**
- [ ] 5 kategori tanımı id, name, description, icon alanlarını içerir
- [ ] `getQuestionsByCategory(id, difficulty)` doğru filtreleme yapar
- [ ] Geçersiz kategori ID için boş dizi döner
- [ ] Sorular rastgele sıralanır

**Bağımlılıklar:** Task 2
**Efor:** 1 saat
**Ref:** SPEC §5.1 Category; IMPL §4.3

---

### Task 6: Soru Veritabanı (JSON)

**5 kategori için 3 zorluk seviyesinde, 3 soru tipinde JSON soru dosyalarını oluştur.**

**Dosyalar oluşturulacak:**
- `data/questions/eu-history.json` — 12+ soru
- `data/questions/institutions.json` — 12+ soru
- `data/questions/treaties.json` — 12+ soru
- `data/questions/culture-symbols.json` — 12+ soru
- `data/questions/geography-members.json` — 12+ soru

**Her kategori için minimum:**
- Kolay: 2 multiple-choice + 1 free-text + 1 matching = 4 soru
- Orta: 2 multiple-choice + 1 free-text + 1 matching = 4 soru
- Zor: 2 multiple-choice + 1 free-text + 1 matching = 4 soru

**ID formatı:** `{kategori}-{tip}-{numara}` (ör: `eh-mc-001`)

**Kabul Kriterleri:**
- [ ] Her kategori en az 12 soru içerir
- [ ] Her zorluk seviyesinde en az 4 soru var
- [ ] 3 soru tipi de her kategoride temsil edilir
- [ ] Tüm JSON dosyaları geçerli ve Question tipine uygun
- [ ] Matching soruları 4-6 çift içerir
- [ ] Her soru explanation alanı içerir
- [ ] Sorular doğru ve anlamlı AB bilgisi içerir

**Bağımlılıklar:** Task 5
**Efor:** 3-4 saat
**Ref:** SPEC §5.1; IMPL §4.1, §4.2

---

## Faz 3: Kullanıcı Arayüzü

> Tüm ekranlar ve bileşenler. Bu faz sonunda: MVP oynanabilir durumda.

### Task 7: Tasarım Sistemi & Layout

**AB temalı renk paleti, tipografi, global stiller ve root layout.**

**Dosyalar düzenlenecek/oluşturulacak:**
- `app/globals.css` — AB design token'ları, Tailwind imports, global stiller
- `app/layout.tsx` — Google Fonts (Inter), metadata, global yapı
- `components/ui/Button.tsx` — Variant'lı buton (primary, secondary, ghost)
- `components/ui/Card.tsx` — Hover efektli kart bileşeni
- `components/ui/ProgressBar.tsx` — Animasyonlu ilerleme çubuğu
- `components/ui/Badge.tsx` — Zorluk/kategori etiketleri

**Renk paleti (IMPL §5.4):**
- EU Blue: #003399, EU Gold: #FFCC00
- Dark: #001a4d, Light: #e6edff
- Success: #16a34a, Error: #dc2626

**Kabul Kriterleri:**
- [ ] AB renk paleti Tailwind theme'de tanımlı
- [ ] Inter fontu Google Fonts'tan yüklenir
- [ ] Button, Card, ProgressBar, Badge bileşenleri render edilir
- [ ] Responsive tasarım: mobil 320px+, tablet 768px+, masaüstü 1024px+
- [ ] `npm run build` hatasız

**Bağımlılıklar:** Task 1
**Efor:** 2-3 saat
**Ref:** SPEC §6; IMPL §5.4

---

### Task 8: Ana Sayfa & Kategori Seçimi

**Landing page (Hero + CTA) ve kategori seçim sayfası.**

**Dosyalar oluşturulacak:**
- `app/page.tsx` — Ana sayfa (Hero, açıklama, "Oyuna Başla" CTA)
- `components/landing/Hero.tsx` — AB temalı hero section
- `components/landing/FeatureCards.tsx` — Özellik tanıtım kartları
- `app/play/page.tsx` — Kategori seçim sayfası (kart grid)
- `app/play/[category]/page.tsx` — Zorluk seçim sayfası

**Kabul Kriterleri:**
- [ ] Ana sayfada proje adı, açıklama ve "Oyuna Başla" butonu görünür
- [ ] "Oyuna Başla" → `/play` sayfasına yönlendirir
- [ ] `/play` sayfasında 5 kategori kartı grid halinde listelenir
- [ ] Her kart kategori adı, açıklaması ve ikonunu gösterir
- [ ] Kategori kartına tıklayınca `/play/[category]` sayfasına gider
- [ ] Zorluk sayfasında 3 seviye kartı (Kolay/Orta/Zor) gösterilir
- [ ] Geçersiz kategori için 404 veya yönlendirme

**Bağımlılıklar:** Task 5, Task 7
**Efor:** 3 saat
**Ref:** SPEC §3.1, §3.2; IMPL §5.1, §5.3

---

### Task 9: Quiz Bileşenleri

**3 soru tipi bileşeni, soru başlığı, geri bildirim ve puan gösterimi.**

**Dosyalar oluşturulacak:**
- `components/quiz/QuestionHeader.tsx` — Soru numarası, ilerleme çubuğu, kategori
- `components/quiz/MultipleChoiceCard.tsx` — 4 seçenek, tıklama, geri bildirim
- `components/quiz/FreeTextCard.tsx` — Metin giriş, cevapla butonu
- `components/quiz/MatchingCard.tsx` — @dnd-kit ile sürükle-bırak eşleştirme
- `components/quiz/AnswerFeedback.tsx` — Doğru/yanlış gösterimi + açıklama
- `components/quiz/ScoreDisplay.tsx` — Anlık toplam puan

**Implementasyon:**
- MultipleChoiceCard: Seçenek tıklandığında seçim, onay sonrası doğru/yanlış renk kodu
- FreeTextCard: Input + submit, boş gönderim engeli
- MatchingCard: @dnd-kit/sortable ile sürükle-bırak, mobilde tıklama fallback
- AnswerFeedback: Doğru → yeşil + ✓, yanlış → kırmızı + ✗ + doğru cevap, explanation

**Kabul Kriterleri:**
- [ ] MultipleChoiceCard 4 seçenek gösterir, tıklama ile seçim yapılır
- [ ] FreeTextCard boş cevap gönderimini engeller
- [ ] MatchingCard sürükle-bırak ile çalışır
- [ ] AnswerFeedback doğru/yanlış durumlarını doğru gösterir
- [ ] Tüm bileşenler mobilde responsive çalışır
- [ ] `npm run build` hatasız

**Bağımlılıklar:** Task 7
**Efor:** 4 saat
**Ref:** SPEC §3.3; IMPL §2.2, §5.1

---

### Task 10: Oyun Sayfası & Entegrasyon

**Quiz engine'i sayfaya bağla: useGameSession hook + oyun akışı + sonuç ekranı.**

**Dosyalar oluşturulacak:**
- `hooks/useGameSession.ts` — useReducer tabanlı oyun oturumu hook'u
- `app/play/[category]/[difficulty]/page.tsx` — `"use client"` oyun sayfası
- `components/result/ResultSummary.tsx` — Puan, doğru/yanlış, başarı yüzdesi
- `components/result/MotivationalMessage.tsx` — Yüzdeye göre mesaj

**Oyun akışı:**
1. Sayfa yüklenince → kategori + zorluk parametrelerinden soruları yükle
2. Sırayla soru göster (tip'e göre doğru bileşen)
3. Cevap → değerlendir → geri bildirim göster → "Sonraki" butonu
4. Son soru sonrası → sonuç ekranı
5. Sonuç ekranında: Tekrar Oyna / Başka Kategori / Ana Sayfa butonları

**Kabul Kriterleri:**
- [ ] `/play/eu-history/easy` gibi URL'ler çalışır
- [ ] Sorular sırayla gösterilir, tip'e göre doğru bileşen render edilir
- [ ] Puan her doğru cevapla güncellenir
- [ ] İlerleme çubuğu soru sayısına göre ilerler
- [ ] Son soru sonrası sonuç ekranı gösterilir
- [ ] Sonuç ekranında puan, doğru/yanlış sayısı, başarı yüzdesi doğru
- [ ] Motivasyonel mesaj yüzdeye göre değişir (%80+, %50-79, <%50)
- [ ] "Tekrar Oyna" aynı kategori/zorlukta yeni oyun başlatır
- [ ] `npm run build` hatasız

**Bağımlılıklar:** Task 4, Task 6, Task 9
**Efor:** 3-4 saat
**Ref:** SPEC §3.3, §3.4, §3.5; IMPL §2.1, §5.2

---

## Faz 4: Cilalama & Yayınlama

> Son dokunuşlar, testler ve deploy. Bu faz sonunda: MVP production'da.

### Task 11: Responsive, Animasyon & SEO

**Responsive ince ayarlar, mikro-animasyonlar, SEO metadata.**

**Dosyalar düzenlenecek:**
- `app/layout.tsx` — SEO metadata (title, description, Open Graph)
- `app/globals.css` — Animasyonlar (fade-in, slide-up, hover scale)
- Tüm sayfa ve bileşenler — responsive fine-tuning
- `public/images/` — AB temalı favicon, OG image

**Kabul Kriterleri:**
- [ ] Tüm sayfalar 320px-1440px arası düzgün görünür
- [ ] Kart hover efektleri ve geçiş animasyonları mevcut
- [ ] Doğru/yanlış geri bildirimde animasyon var
- [ ] HTML `<title>` ve `<meta description>` her sayfada doğru
- [ ] Lighthouse Performance skoru 90+
- [ ] Lighthouse Accessibility skoru 80+

**Bağımlılıklar:** Task 10
**Efor:** 2 saat
**Ref:** SPEC §6.3; IMPL §8.3

---

### Task 12: Vercel Deploy & Son Testler

**Vercel'e deploy, son kontroller ve README güncelleme.**

**Dosyalar düzenlenecek:**
- `README.md` — Proje açıklaması, kurulum, kullanım
- `vercel.json` — (gerekirse) framework ayarı

**Komutlar:**
```bash
npm run build          # Production build testi
npx vercel --prod      # Deploy (veya Vercel Git entegrasyonu)
```

**Kabul Kriterleri:**
- [ ] `npm run build` hatasız tamamlanır
- [ ] `npm test` tüm testler geçer
- [ ] Vercel'de canlı URL erişilebilir
- [ ] Ana sayfa → Kategori → Zorluk → Oyun → Sonuç akışı çalışır
- [ ] 3 soru tipi de doğru render edilir ve değerlendirilir
- [ ] Mobil ve masaüstünde düzgün görünür
- [ ] README kurulum ve kullanım talimatlarını içerir

**Bağımlılıklar:** Task 11
**Efor:** 1-2 saat
**Ref:** SPEC §7; IMPL §8

---

## Milestone'lar

| Milestone | Task Sonrası | Ne Başarıldı | Demo? |
|-----------|-------------|--------------|-------|
| Temel | Task 4 | Oyun motoru çalışır, testler geçer | Unit testler |
| Veri | Task 6 | 60+ soru hazır, yüklenebilir | JSON doğrulama |
| UI | Task 9 | Tüm bileşenler render edilir | Bileşen önizleme |
| MVP | Task 10 | Oyun baştan sona oynanabilir | Tam oyun akışı |
| Yayın | Task 12 | Production'da canlı | Canlı URL |

---

## Bağımlılık Grafiği

```
[T1] → [T2] → [T3] → [T4] ──────────────────┐
  │      │                                      │
  │      └──→ [T5] → [T6] ───────────────────┐│
  │                                            ││
  └──→ [T7] → [T8] ─┐                        ││
          │           │                        ││
          └──→ [T9] ──┴──→ [T10] → [T11] → [T12]
```
