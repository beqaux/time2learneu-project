# Time2LearnEU — Implementation Plan

> SPECIFICATION.md'den türetilen teknik blueprint.

## 1. Tech Stack

### 1.1 Stack Summary

| Katman | Teknoloji | Versiyon | Gerekçe |
|--------|-----------|----------|---------|
| Dil | TypeScript | ^5 | Tip güvenliği, IDE desteği, hata önleme |
| Framework | Next.js | 16.2.4 | App Router, SSG desteği, Vercel entegrasyonu |
| UI Library | React | 19.2.4 | Bileşen tabanlı UI, hooks ekosistemi |
| CSS | TailwindCSS | ^4 | Hızlı prototipleme, responsive utility sınıfları |
| Veri | Statik JSON | — | Veritabanı gerektirmez, build-time import (SPEC §5) |
| Test | Vitest | ^3 | Hızlı, TypeScript-native, Jest uyumlu API |
| Lint | ESLint | ^9 | Mevcut kurulumda zaten var |
| Build | Turbopack | — | Next.js 16 varsayılan bundler |
| Deploy | Vercel | — | Git push → otomatik deploy, edge CDN |

### 1.2 Temel Teknik Kararlar

#### Karar: Client-Side Oyun Mantığı
- **Bağlam**: Quiz engine tamamen istemcide çalışacak (SPEC §4.2)
- **Seçenekler**:
  1. **Server Actions**: Güvenli ama her soru için ağ gecikmesi
  2. **Client-side state**: Anında geri bildirim, çevrimdışı potansiyeli
- **Seçim**: Client-side state (`"use client"` bileşenler)
- **Gerekçe**: Auth yok, veri hassas değil, anında geri bildirim gerekli
- **Sonuç**: Sorular build-time'da JSON import ile yüklenir, tüm mantık tarayıcıda çalışır

#### Karar: State Yönetimi
- **Seçenekler**:
  1. **React Context + useReducer**: Hafif, bağımlılık yok
  2. **Zustand**: Minimal, kolay
  3. **Redux**: Overkill
- **Seçim**: React Context + useReducer
- **Gerekçe**: MVP kapsamında tek bir oyun oturumu yönetimi yeterli, ek bağımlılık gereksiz

#### Karar: Fuzzy Matching Yaklaşımı
- **Seçenekler**:
  1. **Levenshtein distance (kendi implementasyonu)**: Bağımlılık yok, ~30 satır kod
  2. **fuse.js**: Kapsamlı ama bu kullanım için ağır
- **Seçim**: Kendi Levenshtein implementasyonu
- **Gerekçe**: Basit string karşılaştırma yeterli, ek paket gereksiz (SPEC §3.3.2)

#### Karar: Sürükle-Bırak Kütüphanesi
- **Seçenekler**:
  1. **@dnd-kit/core**: Modern, React 19 uyumlu, erişilebilir, hafif
  2. **react-beautiful-dnd**: Bakımı durdu
  3. **Native HTML5 DnD**: Mobilde sorunlu
- **Seçim**: @dnd-kit/core + @dnd-kit/sortable
- **Gerekçe**: Aktif bakım, React 19 desteği, mobil dokunmatik destek, erişilebilirlik

### 1.3 Bağımlılık Envanteri

| Paket | Amaç | Lisans | Gerekçe |
|-------|------|--------|---------|
| @dnd-kit/core | Sürükle-bırak altyapısı | MIT | Eşleştirme soruları için (SPEC §3.3.3) |
| @dnd-kit/sortable | Sıralama/eşleştirme uzantısı | MIT | dnd-kit üzerine sortable davranış |

**Bağımlılık felsefesi**: Minimal — stdlib-first. Sadece sürükle-bırak için dış bağımlılık. Fuzzy matching, puanlama ve oyun mantığı kendi kodumuz.

## 2. Tasarım Desenleri

### 2.1 State Machine (Oyun Akışı)

**Neden**: Oyun oturumu belirgin durumlara sahip: seçim → oynama → tamamlandı (SPEC §5.1 GameSession)

**Uygulama**: useReducer ile durum geçişleri kontrol edilir.

```typescript
type GameStatus = 'idle' | 'selecting' | 'playing' | 'answered' | 'completed';

type GameAction =
  | { type: 'SELECT_CATEGORY'; categoryId: string }
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SUBMIT_ANSWER'; answer: PlayerAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SUBMIT_ANSWER':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'answered', /* puan hesapla */ };
    // ...
  }
}
```

### 2.2 Strategy Pattern (Soru Değerlendirme)

**Neden**: 3 farklı soru tipi farklı değerlendirme mantığına sahip (SPEC §3.3)

```typescript
interface AnswerEvaluator {
  evaluate(question: Question, answer: PlayerAnswer): EvaluationResult;
  getPoints(difficulty: Difficulty): number;
}

const evaluators: Record<QuestionType, AnswerEvaluator> = {
  'multiple-choice': new MultipleChoiceEvaluator(),  // exactMatch
  'free-text': new FreeTextEvaluator(),               // fuzzyMatch
  'matching': new MatchingEvaluator(),                 // pairCheck
};
```

### 2.3 Factory Pattern (Soru Üretimi)

**Neden**: Kategori ve zorluk filtresiyle soru seti oluşturma (SPEC §3.2)

```typescript
function createGameSession(
  categoryId: string,
  difficulty: Difficulty,
  allQuestions: Question[]
): Question[] {
  return allQuestions
    .filter(q => q.category === categoryId && q.difficulty === difficulty)
    .sort(() => Math.random() - 0.5); // Karıştır
}
```

### 2.4 Container/Presentational (Bileşen Ayrımı)

**Neden**: Veri mantığını görsel bileşenlerden ayırmak (SPEC §6)

```
hooks/useGameSession.ts    → Oyun mantığı (container/logic)
components/QuizCard.tsx    → Soru gösterimi (presentational)
components/ScoreBoard.tsx  → Puan gösterimi (presentational)
```

## 3. Proje Yapısı

### 3.1 Dizin Düzeni

```
time2learneu-project/
├── app/                          # Next.js App Router sayfaları
│   ├── layout.tsx                # Root layout (font, metadata, global providers)
│   ├── page.tsx                  # Ana sayfa — karşılama ekranı
│   ├── globals.css               # Global stiller + Tailwind imports
│   ├── favicon.ico               # Site ikonu
│   ├── play/
│   │   └── page.tsx              # Kategori seçim ekranı
│   ├── play/[category]/
│   │   └── page.tsx              # Zorluk seçim ekranı
│   └── play/[category]/[difficulty]/
│       └── page.tsx              # Oyun ekranı (quiz engine)
├── components/                   # Yeniden kullanılabilir UI bileşenleri
│   ├── ui/                       # Genel UI bileşenleri
│   │   ├── Button.tsx            # Ortak buton bileşeni
│   │   ├── Card.tsx              # Kart bileşeni
│   │   ├── ProgressBar.tsx       # İlerleme çubuğu
│   │   └── Badge.tsx             # Zorluk/kategori etiketleri
│   ├── landing/                  # Ana sayfa bileşenleri
│   │   ├── Hero.tsx              # Hero section
│   │   └── FeatureCards.tsx      # Özellik tanıtım kartları
│   ├── quiz/                     # Quiz bileşenleri
│   │   ├── MultipleChoiceCard.tsx  # Çoktan seçmeli soru
│   │   ├── FreeTextCard.tsx        # Serbest metin soru
│   │   ├── MatchingCard.tsx        # Eşleştirme soru (DnD)
│   │   ├── QuestionHeader.tsx      # Soru üst bilgisi (numara, ilerleme)
│   │   ├── AnswerFeedback.tsx      # Doğru/yanlış geri bildirim
│   │   └── ScoreDisplay.tsx        # Anlık puan gösterimi
│   └── result/                   # Sonuç ekranı bileşenleri
│       ├── ResultSummary.tsx       # Puan özeti
│       └── MotivationalMessage.tsx # Başarı mesajı
├── lib/                          # İş mantığı ve yardımcılar
│   ├── types.ts                  # Tüm TypeScript tipleri
│   ├── constants.ts              # Sabitler (puan değerleri, eşik değerleri)
│   ├── game-engine.ts            # gameReducer + oyun mantığı
│   ├── evaluators.ts             # Soru değerlendirme strategy'leri
│   ├── fuzzy-match.ts            # Levenshtein distance + Türkçe normalize
│   ├── question-loader.ts        # JSON'dan soru filtreleme ve yükleme
│   └── utils.ts                  # Genel yardımcı fonksiyonlar
├── hooks/                        # Custom React hooks
│   └── useGameSession.ts         # Oyun oturumu yönetimi hook'u
├── data/                         # Statik soru verileri
│   ├── categories.ts             # Kategori tanımları
│   └── questions/                # Kategori bazlı soru dosyaları
│       ├── eu-history.json       # AB Tarihi soruları
│       ├── institutions.json     # AB Kurumları soruları
│       ├── treaties.json         # Antlaşmalar soruları
│       ├── culture-symbols.json  # Kültür & Semboller soruları
│       └── geography-members.json # Coğrafya & Üye Ülkeler soruları
├── public/                       # Statik dosyalar
│   └── images/                   # Görseller (AB bayrağı vb.)
├── docs/                         # Proje belgeleri
├── __tests__/                    # Test dosyaları
│   ├── fuzzy-match.test.ts       # Fuzzy matching testleri
│   ├── evaluators.test.ts        # Değerlendirme testleri
│   └── game-engine.test.ts       # Oyun motoru testleri
├── next.config.ts
├── tailwind.config.ts            # (Tailwind v4 — gerekirse)
├── tsconfig.json
└── package.json
```

**Yapısal Felsefe**: Katman bazlı (layer-based) organizasyon. `app/` yalnızca sayfa routing, `components/` yalnızca UI, `lib/` yalnızca iş mantığı, `data/` yalnızca veri. Testler ayrı `__tests__/` klasöründe.

### 3.2 Modül Detayları

#### Modül: lib/game-engine.ts
- **Sorumluluk**: Oyun durumunu yöneten state machine (SPEC §5.1)
- **Dışa aktarır**: `gameReducer`, `initialGameState`, `GameState`, `GameAction`
- **Bağımlılıklar**: `lib/types.ts`, `lib/evaluators.ts`

#### Modül: lib/evaluators.ts
- **Sorumluluk**: Her soru tipi için cevap değerlendirme (SPEC §3.3, §3.4)
- **Dışa aktarır**: `evaluateAnswer()`, `MultipleChoiceEvaluator`, `FreeTextEvaluator`, `MatchingEvaluator`
- **Bağımlılıklar**: `lib/fuzzy-match.ts`, `lib/types.ts`, `lib/constants.ts`

#### Modül: lib/fuzzy-match.ts
- **Sorumluluk**: Serbest metin cevaplar için benzerlik karşılaştırma (SPEC §3.3.2)
- **Dışa aktarır**: `fuzzyMatch()`, `levenshteinDistance()`, `normalizeTurkish()`
- **Bağımlılıklar**: Yok (standalone)

#### Modül: hooks/useGameSession.ts
- **Sorumluluk**: React bileşenlerine oyun state'ini sağlama
- **Dışa aktarır**: `useGameSession()` hook
- **Bağımlılıklar**: `lib/game-engine.ts`, `lib/question-loader.ts`

#### Modül: data/categories.ts
- **Sorumluluk**: Kategori metadata tanımları (SPEC §5.1 Category)
- **Dışa aktarır**: `categories: Category[]`
- **Bağımlılıklar**: Yok

### 3.3 Modül Bağımlılık Grafiği

```
[app/ pages] → [hooks/useGameSession] → [lib/game-engine]
                     ↓                         ↓
              [components/quiz/*]        [lib/evaluators]
                     ↓                         ↓
              [components/ui/*]          [lib/fuzzy-match]
                                               ↓
[data/categories] ← [lib/question-loader] ← [data/questions/*.json]
```

## 4. Veri Katmanı

### 4.1 JSON Şema Yapısı

Veritabanı yok. Tüm veriler statik JSON dosyalarında (SPEC §8.1).

```typescript
// data/questions/eu-history.json örneği
[
  {
    "id": "eh-mc-001",
    "category": "eu-history",
    "type": "multiple-choice",
    "difficulty": "easy",
    "question": "Avrupa Birliği'nin temeli hangi antlaşma ile atılmıştır?",
    "options": ["Roma Antlaşması", "Paris Antlaşması", "Maastricht Antlaşması", "Lizbon Antlaşması"],
    "correctAnswer": "Roma Antlaşması",
    "explanation": "1957 Roma Antlaşması, AET'yi kurarak AB'nin temelini oluşturmuştur."
  },
  {
    "id": "eh-ft-001",
    "category": "eu-history",
    "type": "free-text",
    "difficulty": "medium",
    "question": "Avrupa Kömür ve Çelik Topluluğu'nu kuran antlaşma hangi yılda imzalanmıştır?",
    "correctAnswer": "1951",
    "acceptableAnswers": ["1951"],
    "explanation": "Paris Antlaşması 1951'de imzalanarak AKÇT'yi kurmuştur."
  },
  {
    "id": "eh-mt-001",
    "category": "eu-history",
    "type": "matching",
    "difficulty": "hard",
    "question": "Aşağıdaki antlaşmaları imza yıllarıyla eşleştirin:",
    "pairs": [
      { "left": "Roma Antlaşması", "right": "1957" },
      { "left": "Maastricht Antlaşması", "right": "1992" },
      { "left": "Lizbon Antlaşması", "right": "2007" },
      { "left": "Paris Antlaşması", "right": "1951" }
    ],
    "explanation": "Bu dört antlaşma AB'nin kuruluş ve gelişim sürecinin temel taşlarıdır."
  }
]
```

### 4.2 Soru ID Konvansiyonu

Format: `{kategori-kısaltma}-{tip-kısaltma}-{numara}`
- Kategori: `eh` (eu-history), `in` (institutions), `tr` (treaties), `cs` (culture-symbols), `gm` (geography-members)
- Tip: `mc` (multiple-choice), `ft` (free-text), `mt` (matching)
- Örnek: `eh-mc-001`, `tr-ft-003`, `gm-mt-002`

### 4.3 Veri Erişim Deseni

```typescript
// lib/question-loader.ts
import euHistory from '@/data/questions/eu-history.json';
import institutions from '@/data/questions/institutions.json';
// ... diğer kategoriler

const allQuestions: Question[] = [
  ...euHistory, ...institutions, ...treaties,
  ...cultureSymbols, ...geographyMembers
];

export function getQuestionsByCategory(
  categoryId: string,
  difficulty: Difficulty
): Question[] {
  return allQuestions
    .filter(q => q.category === categoryId && q.difficulty === difficulty)
    .sort(() => Math.random() - 0.5);
}
```

## 5. Frontend Implementasyonu

### 5.1 Bileşen Hiyerarşisi

```
RootLayout
├── LandingPage (/)
│   ├── Hero
│   └── FeatureCards
├── CategoryPage (/play)
│   └── CategoryCard × N
├── DifficultyPage (/play/[category])
│   └── DifficultyCard × 3
└── GamePage (/play/[category]/[difficulty])
    ├── QuestionHeader (ilerleme + puan)
    ├── MultipleChoiceCard | FreeTextCard | MatchingCard
    ├── AnswerFeedback
    └── ResultSummary (oyun sonu)
```

### 5.2 State Yönetimi

```typescript
// hooks/useGameSession.ts
export function useGameSession(questions: Question[]) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    questions,
    totalQuestions: questions.length,
  });

  const submitAnswer = (answer: PlayerAnswer) =>
    dispatch({ type: 'SUBMIT_ANSWER', answer });
  const nextQuestion = () => dispatch({ type: 'NEXT_QUESTION' });
  const reset = () => dispatch({ type: 'RESET' });

  return { state, submitAnswer, nextQuestion, reset };
}
```

### 5.3 Routing

| Route | Sayfa | Tip |
|-------|-------|-----|
| `/` | Ana sayfa (Hero + CTA) | SSG — statik |
| `/play` | Kategori seçimi | SSG — statik |
| `/play/[category]` | Zorluk seçimi | SSG — dynamicParams |
| `/play/[category]/[difficulty]` | Quiz oyunu | Client-side (`"use client"`) |

### 5.4 Stil Yaklaşımı

TailwindCSS v4 utility sınıfları + AB temalı özel renk paleti:

```css
/* globals.css — AB Design Tokens */
@import "tailwindcss";

@theme {
  --color-eu-blue: #003399;
  --color-eu-gold: #FFCC00;
  --color-eu-dark: #001a4d;
  --color-eu-light: #e6edff;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #f59e0b;
}
```

## 6. Hata Yönetimi

| Durum | Davranış |
|-------|----------|
| Geçersiz kategori/zorluk parametresi | 404 sayfası + ana sayfaya yönlendirme |
| Kategori için soru bulunamadı | "Bu kombinasyonda soru yok" mesajı |
| Boş metin gönderimi | Buton disabled, form validation |
| Tarayıcı DnD desteklemez | Tıklama-tabanlı fallback |

## 7. Test Stratejisi

| Seviye | Araç | Kapsam |
|--------|------|--------|
| Unit | Vitest | fuzzy-match, evaluators, game-engine — %90+ coverage |
| Component | Vitest + Testing Library | Quiz bileşenleri render + interaction |
| E2E | (MVP sonrası) | — |

```typescript
// __tests__/fuzzy-match.test.ts örneği
describe('fuzzyMatch', () => {
  it('Türkçe karakterleri normalize eder', () => {
    expect(fuzzyMatch('Türkiye', 'turkiye')).toBe(true);
  });
  it('%80+ benzerlikte doğru kabul eder', () => {
    expect(fuzzyMatch('Maastricht', 'Mastrict')).toBe(true);
  });
  it('%80 altında yanlış kabul eder', () => {
    expect(fuzzyMatch('Avrupa', 'Amerika')).toBe(false);
  });
});
```

## 8. Deployment

### 8.1 Build Komutu

```bash
npm run build   # next build — SSG + client bundles
```

### 8.2 Vercel Konfigürasyonu

```json
// vercel.json (gerekirse)
{
  "framework": "nextjs"
}
```

Varsayılan Vercel ayarları yeterli — özel konfigürasyon gereksiz.

### 8.3 Performans Hedefleri

- İlk sayfa yükleme: < 2 saniye (Vercel edge CDN ile)
- Lighthouse Performance: 90+
- Bundle boyutu: < 150KB (gzipped, @dnd-kit dahil)

## 9. Geliştirme İş Akışı

### 9.1 Yerel Kurulum

```bash
git clone <repo-url>
cd time2learneu-project
npm install
npm run dev        # http://localhost:3000
```

### 9.2 Kod Standartları

- ESLint: eslint-config-next varsayılan
- TypeScript: strict mode açık
- Dosya isimlendirme: PascalCase (bileşenler), kebab-case (lib/), camelCase (hooks/)
- Commit: Conventional Commits (feat:, fix:, docs:)
