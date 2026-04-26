# Time2LearnEU — Implementation Prompt

> Bu prompt, Time2LearnEU projesini sıfırdan inşa etmek için tüm bilgiyi içerir.
> Mevcut Next.js 16 projesi üzerine sırayla çalıştırılır.

## Proje Özeti

Time2LearnEU, AB hakkında sınırlı bilgiye sahip öğrenciler için tasarlanmış Türkçe bir quiz oyunudur. Çoktan seçmeli, serbest metin (fuzzy matching ile) ve eşleştirme (sürükle-bırak) formatlarında sorular sunar. Kayıt gerektirmez, tamamen client-side çalışır, statik JSON verilerle beslenir ve Vercel'e deploy edilir.

## Tech Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| Framework | Next.js | 16.2.4 |
| UI | React | 19.2.4 |
| Dil | TypeScript | ^5 |
| CSS | TailwindCSS | ^4 |
| DnD | @dnd-kit/core + sortable | latest |
| Test | Vitest + Testing Library | latest |
| Deploy | Vercel | — |

## Proje Yapısı

```
time2learneu-project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── favicon.ico
│   ├── play/
│   │   └── page.tsx
│   ├── play/[category]/
│   │   └── page.tsx
│   └── play/[category]/[difficulty]/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Badge.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   └── FeatureCards.tsx
│   ├── quiz/
│   │   ├── MultipleChoiceCard.tsx
│   │   ├── FreeTextCard.tsx
│   │   ├── MatchingCard.tsx
│   │   ├── QuestionHeader.tsx
│   │   ├── AnswerFeedback.tsx
│   │   └── ScoreDisplay.tsx
│   └── result/
│       ├── ResultSummary.tsx
│       └── MotivationalMessage.tsx
├── lib/
│   ├── types.ts
│   ├── constants.ts
│   ├── game-engine.ts
│   ├── evaluators.ts
│   ├── fuzzy-match.ts
│   ├── question-loader.ts
│   └── utils.ts
├── hooks/
│   └── useGameSession.ts
├── data/
│   ├── categories.ts
│   └── questions/
│       ├── eu-history.json
│       ├── institutions.json
│       ├── treaties.json
│       ├── culture-symbols.json
│       └── geography-members.json
├── __tests__/
│   ├── fuzzy-match.test.ts
│   ├── evaluators.test.ts
│   └── game-engine.test.ts
└── public/images/
```

## Tasarım Sistemi

**Renkler (Tailwind v4 @theme):**
```css
@theme {
  --color-eu-blue: #003399;
  --color-eu-gold: #FFCC00;
  --color-eu-royal: #1a56db;
  --color-eu-dark: #001a4d;
  --color-eu-light: #f0f4ff;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #6b7280;
  --color-bg: #f0f4ff;
  --color-surface: #ffffff;
  --color-border: #d1d9e6;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

**Font:** Inter (Google Fonts), ağırlıklar 400-800.
**Köşeler:** Kartlar 12px, butonlar 8px, badge full-round.
**Ton:** Teşvik edici, erişilebilir, eğlenceli. Türkçe arayüz.

---

## Adım 1: Bağımlılıklar & Dizin Yapısı

**Komutlar:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**package.json script'lere ekle:**
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Tüm dizinleri oluştur:** `components/ui/`, `components/landing/`, `components/quiz/`, `components/result/`, `lib/`, `hooks/`, `data/questions/`, `__tests__/`, `public/images/`

**🔍 Checkpoint:** `npm run build` hatasız tamamlanmalı.

---

## Adım 2: Tip Tanımları & Sabitler

**Dosyalar:** `lib/types.ts`, `lib/constants.ts`

**lib/types.ts:**
```typescript
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple-choice' | 'free-text' | 'matching';
export type GameStatus = 'idle' | 'selecting' | 'playing' | 'answered' | 'completed';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface BaseQuestion {
  id: string;
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface FreeTextQuestion extends BaseQuestion {
  type: 'free-text';
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export type Question = MultipleChoiceQuestion | FreeTextQuestion | MatchingQuestion;

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PlayerAnswer {
  questionId: string;
  type: QuestionType;
  answer: string | string[] | Record<string, string>;
}

export interface EvaluationResult {
  isCorrect: boolean;
  points: number;
  correctAnswer?: string;
  matchResults?: { left: string; right: string; isCorrect: boolean }[];
}

export interface GameState {
  status: GameStatus;
  categoryId: string | null;
  difficulty: Difficulty | null;
  questions: Question[];
  currentIndex: number;
  answers: { question: Question; playerAnswer: PlayerAnswer; result: EvaluationResult }[];
  score: number;
  totalQuestions: number;
}

export type GameAction =
  | { type: 'SELECT_CATEGORY'; categoryId: string }
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SUBMIT_ANSWER'; answer: PlayerAnswer; result: EvaluationResult }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET' };
```

**lib/constants.ts:**
```typescript
export const POINTS = {
  multipleChoice: 10,
  freeText: 25,
  matchingPair: 5,
} as const;

export const FUZZY_THRESHOLD = 0.8;

export const DIFFICULTY_LABELS: Record<string, { label: string; description: string; stars: string }> = {
  easy: { label: 'Kolay', description: 'Temel AB bilgisi', stars: '⭐' },
  medium: { label: 'Orta', description: 'Detaylı bilgi gerektirir', stars: '⭐⭐' },
  hard: { label: 'Zor', description: 'Uzman seviyesi', stars: '⭐⭐⭐' },
};

export const MOTIVATIONAL_MESSAGES = {
  excellent: { threshold: 80, message: 'Harika! AB konusunda gerçek bir uzman oluyorsun! 🎉' },
  good: { threshold: 50, message: 'İyi gidiyorsun! Biraz daha pratikle mükemmel olacak! 💪' },
  retry: { threshold: 0, message: 'Her deneme bir öğrenme fırsatı! Tekrar dene! 📚' },
};
```

---

## Adım 3: Fuzzy Matching

**Dosyalar:** `lib/fuzzy-match.ts`, `__tests__/fuzzy-match.test.ts`

```typescript
// lib/fuzzy-match.ts
const TURKISH_MAP: Record<string, string> = {
  'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
  'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u',
};

export function normalizeTurkish(str: string): string {
  return str
    .split('')
    .map(c => TURKISH_MAP[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

export function fuzzyMatch(input: string, target: string, threshold = 0.8): boolean {
  if (!input || !target) return false;
  const a = normalizeTurkish(input);
  const b = normalizeTurkish(target);
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return false;
  const distance = levenshteinDistance(a, b);
  const similarity = 1 - distance / maxLen;
  return similarity >= threshold;
}
```

**Testler:** Tam eşleşme, büyük/küçük harf, Türkçe karakter, %80+ benzerlik, %80 altı, boş string senaryoları.

**🔍 Checkpoint:** `npm test` fuzzy-match testleri geçmeli.

---

## Adım 4: Oyun Motoru & Değerlendiriciler

**Dosyalar:** `lib/evaluators.ts`, `lib/game-engine.ts`, `__tests__/evaluators.test.ts`, `__tests__/game-engine.test.ts`

**lib/evaluators.ts — Strategy Pattern:**
```typescript
import { fuzzyMatch } from './fuzzy-match';
import { POINTS } from './constants';
import type { Question, PlayerAnswer, EvaluationResult, FreeTextQuestion } from './types';

export function evaluateAnswer(question: Question, answer: PlayerAnswer): EvaluationResult {
  switch (question.type) {
    case 'multiple-choice':
      return evaluateMultipleChoice(question, answer.answer as string);
    case 'free-text':
      return evaluateFreeText(question, answer.answer as string);
    case 'matching':
      return evaluateMatching(question, answer.answer as Record<string, string>);
  }
}
// Her tip için ayrı evaluate fonksiyonu:
// - multiple-choice: exactMatch → POINTS.multipleChoice
// - free-text: fuzzyMatch(input, correctAnswer) || acceptableAnswers.some(...) → POINTS.freeText
// - matching: her çift kontrol → doğru çift sayısı × POINTS.matchingPair
```

**lib/game-engine.ts — State Machine:**
```typescript
import type { GameState, GameAction } from './types';

export const initialGameState: GameState = {
  status: 'idle',
  categoryId: null,
  difficulty: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  totalQuestions: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, status: 'playing', questions: action.questions, totalQuestions: action.questions.length, currentIndex: 0, score: 0, answers: [] };
    case 'SUBMIT_ANSWER':
      if (state.status !== 'playing') return state;
      return { ...state, status: 'answered', score: state.score + action.result.points, answers: [...state.answers, { question: state.questions[state.currentIndex], playerAnswer: action.answer, result: action.result }] };
    case 'NEXT_QUESTION':
      if (state.status !== 'answered') return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.totalQuestions) return { ...state, status: 'completed' };
      return { ...state, status: 'playing', currentIndex: nextIndex };
    case 'RESET':
      return initialGameState;
    default:
      return state;
  }
}
```

**🔍 Checkpoint:** `npm test` tüm unit testler geçmeli.

---

## Adım 5: Kategoriler & Soru Yükleyici

**Dosyalar:** `data/categories.ts`, `lib/question-loader.ts`

**5 Kategori:**
1. `eu-history` — AB Tarihi 🏛️
2. `institutions` — AB Kurumları 🏢
3. `treaties` — Antlaşmalar 📜
4. `culture-symbols` — Kültür & Semboller 🌍
5. `geography-members` — Coğrafya & Üye Ülkeler 🗺️

**question-loader.ts:** Tüm JSON dosyalarını import et, `getQuestionsByCategory(id, difficulty)` ile filtrele ve karıştır.

---

## Adım 6: Soru Veritabanı (JSON)

**Dosyalar:** `data/questions/*.json` — 5 dosya, her biri 12+ soru.

**Her kategori için:** Kolay/Orta/Zor × multiple-choice/free-text/matching. **ID formatı:** `{kategori}-{tip}-{numara}` (ör: `eh-mc-001`).

**Tüm sorular Türkçe ve doğru AB bilgisi içermelidir.** Her soru explanation alanı içerir. Matching soruları 4-6 çift.

---

## Adım 7: Tasarım Sistemi & UI Bileşenleri

**Dosyalar:** `app/globals.css`, `app/layout.tsx`, `components/ui/*.tsx`

- **globals.css:** Tailwind imports + @theme ile AB renk token'ları (yukarıdaki CSS)
- **layout.tsx:** Inter fontu (Google Fonts `next/font/google`), SEO metadata (title: "Time2LearnEU", description), lang="tr"
- **Button.tsx:** variant prop (primary=EU Blue, secondary=outline, ghost), size prop, disabled state
- **Card.tsx:** Surface bg, shadow-md, hover:shadow-lg, rounded-xl, transition
- **ProgressBar.tsx:** Animasyonlu dolum, EU Blue gradient
- **Badge.tsx:** Zorluk/kategori etiketleri, rounded-full

---

## Adım 8: Ana Sayfa & Kategori/Zorluk Seçimi

**Dosyalar:** `app/page.tsx`, `components/landing/Hero.tsx`, `components/landing/FeatureCards.tsx`, `app/play/page.tsx`, `app/play/[category]/page.tsx`

- **Ana sayfa:** AB temalı hero (mavi-sarı gradient arka plan, yıldız deseni), "Time2LearnEU" başlık, kısa açıklama, "Oyuna Başla" CTA butonu → `/play`
- **Kategori sayfası:** 5 kategori kartı grid (mobilde tek sütun, tablette 2, masaüstünde 3). Her kart: ikon, ad, açıklama. Tıklayınca `/play/[category]`
- **Zorluk sayfası:** 3 kart (Kolay ⭐, Orta ⭐⭐, Zor ⭐⭐⭐) + açıklamalar. Tıklayınca `/play/[category]/[difficulty]`
- Geçersiz kategori → notFound()

---

## Adım 9: Quiz Bileşenleri

**Dosyalar:** `components/quiz/*.tsx`

- **QuestionHeader:** Soru N/M, ilerleme çubuğu, kategori badge, toplam puan
- **MultipleChoiceCard:** 4 seçenek buton, tıklayınca seçim işaretlenir, cevap sonrası doğru=yeşil yanlış=kırmızı
- **FreeTextCard:** Input + "Cevapla" butonu, boş gönderilemez, cevap sonrası doğru/yanlış + doğru cevap gösterimi
- **MatchingCard:** @dnd-kit ile sol→sağ sürükle-bırak, mobilde tıklama-tabanlı, tüm eşleşmeler yapılınca "Kontrol Et"
- **AnswerFeedback:** Doğru ✅ / Yanlış ❌ + explanation + kazanılan puan
- **ScoreDisplay:** Toplam puan gösterimi (animasyonlu artış)

---

## Adım 10: Oyun Sayfası & Sonuç Ekranı

**Dosyalar:** `hooks/useGameSession.ts`, `app/play/[category]/[difficulty]/page.tsx`, `components/result/ResultSummary.tsx`, `components/result/MotivationalMessage.tsx`

**Bu sayfa `"use client"` directive kullanır.**

**useGameSession hook:** `useReducer(gameReducer, initialState)` sarmalayıcı, `submitAnswer`, `nextQuestion`, `reset` fonksiyonlarını expose eder.

**Oyun akışı:**
1. URL parametrelerinden kategori + zorluk al → `getQuestionsByCategory()` ile soruları yükle
2. `question.type`'a göre doğru bileşeni render et (MultipleChoiceCard | FreeTextCard | MatchingCard)
3. Cevap → `evaluateAnswer()` → `dispatch(SUBMIT_ANSWER)` → AnswerFeedback göster
4. "Sonraki Soru" → `dispatch(NEXT_QUESTION)`
5. Son soru → `status === 'completed'` → ResultSummary + MotivationalMessage

**Sonuç ekranı:** Toplam puan, doğru/yanlış sayısı, başarı yüzdesi, mesaj (%80+ tebrik, %50-79 cesaretlendirme, <%50 tekrar). Butonlar: "Tekrar Oyna" / "Başka Kategori" / "Ana Sayfa"

**🔍 Checkpoint:** Tam oyun akışı (Ana Sayfa → Kategori → Zorluk → Oyun → Sonuç) çalışmalı.

---

## Adım 11: Responsive, Animasyon & SEO

- **Responsive:** Tüm sayfalar 320px-1440px arası test edilmeli
- **Animasyonlar:** Kart hover scale, fade-in sayfa geçişleri, doğru/yanlış renk geçişi, puan artış animasyonu
- **SEO:** Her sayfada title + description metadata, Open Graph tags, lang="tr"
- **Lighthouse:** Performance 90+, Accessibility 80+

---

## Adım 12: Vercel Deploy

```bash
npm run build    # Hatasız tamamlanmalı
npm test         # Tüm testler geçmeli
```

**Final doğrulama:**
- [ ] Ana Sayfa → Kategori → Zorluk → Oyun → Sonuç akışı çalışır
- [ ] 3 soru tipi doğru render edilir ve değerlendirilir
- [ ] Puanlama: MC=10, FT=25, Matching=çift×5
- [ ] Fuzzy matching Türkçe karakterlerle çalışır
- [ ] Mobil ve masaüstünde responsive
- [ ] Vercel'de canlı URL erişilebilir

## Puanlama Referansı

| Soru Tipi | Doğru Puan | Yanlış Puan |
|-----------|-----------|------------|
| Çoktan Seçmeli | 10 | 0 |
| Serbest Metin | 25 | 0 |
| Eşleştirme (çift başına) | 5 | 0 |
