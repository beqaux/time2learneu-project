# Time2LearnEU — Branding Guide

## 1. İsim & Kimlik

### 1.1 Proje Adı
- **Ad**: Time2LearnEU
- **Telaffuz**: "Taym tu Lörn İ-Yu"
- **Anlam**: "AB'yi öğrenme zamanı" — eğitim odaklı, aksiyon çağrısı
- **Kodda**: `time2learneu`
- **Yazıda**: Time2LearnEU (tek kelime, büyük T/L/EU)

### 1.2 Slogan
- **Birincil**: "Avrupa Birliği'ni öğrenmenin en eğlenceli yolu"
- **Kısa**: "Oyna, öğren, AB'yi keşfet!"

### 1.3 Asansör Konuşması
Time2LearnEU, Avrupa Birliği hakkında bilgi edinmek isteyen öğrenciler için tasarlanmış interaktif bir quiz platformudur. Çoktan seçmeli, serbest metin ve eşleştirme formatlarında sorularla AB'nin tarihini, kurumlarını ve kültürünü keşfetmenizi sağlar. Kayıt gerektirmez — tarayıcınızda hemen oynamaya başlayabilirsiniz.

## 2. Logo

### 2.1 Konsept
AB bayrağının 12 yıldızından ilham alan, kitap/bilgi simgesi ile birleştirilmiş modern bir ikon. Yıldız çemberi bilgiyi, merkezdeki soru işareti/kitap ise öğrenmeyi temsil eder.

### 2.2 Spesifikasyonlar
- **Birincil işaret**: AB mavi zemin üzerinde altın yıldız çemberi + merkez quiz ikonu
- **İkon**: Tek yıldız + soru işareti (küçük boyutlar için)
- **Metin**: "Time2LearnEU" Inter Bold yazı tipi
- **Minimum boyut**: 32px (ikon), 120px (tam logo)
- **Boşluk**: Logo etrafında en az logo yüksekliğinin %25'i kadar boşluk

### 2.3 AI Üretim Prompt'u
```
Flat, minimal logo design. A circle of 12 golden stars (EU flag style) on a deep blue 
background (#003399). In the center, a stylized quiz/question mark icon in gold (#FFCC00). 
Clean vector style, no gradients, no text. 1:1 square format. Suitable for favicon and 
app icon use. Modern, educational feel.
```

## 3. Renk Paleti

### 3.1 Marka Renkleri

| Rol | İsim | Hex | RGB | Kullanım |
|-----|------|-----|-----|----------|
| Primary | EU Blue | #003399 | rgb(0,51,153) | Ana butonlar, başlıklar, navbar |
| Secondary | EU Gold | #FFCC00 | rgb(255,204,0) | Vurgular, yıldızlar, aktif öğeler |
| Accent | Royal Blue | #1a56db | rgb(26,86,219) | Linkler, hover durumları, ikonlar |

### 3.2 Nötr Renkler

| Rol | Hex | Kullanım |
|-----|-----|----------|
| Text Primary | #1a1a2e | Gövde metni, başlıklar |
| Text Secondary | #6b7280 | Alt yazılar, açıklamalar |
| Background | #f0f4ff | Sayfa arka planı (açık mavi ton) |
| Surface | #ffffff | Kartlar, paneller |
| Border | #d1d9e6 | Ayırıcılar, input kenarlıkları |

### 3.3 Semantik Renkler

| Rol | Hex | Kullanım |
|-----|-----|----------|
| Success | #16a34a | Doğru cevap, onay |
| Error | #dc2626 | Yanlış cevap, hata |
| Warning | #f59e0b | Uyarılar, dikkat |
| Info | #3b82f6 | Bilgilendirme, ipuçları |

### 3.4 CSS Değişkenleri (Tailwind v4 @theme)

```css
@theme {
  /* Marka */
  --color-eu-blue: #003399;
  --color-eu-gold: #FFCC00;
  --color-eu-royal: #1a56db;
  --color-eu-dark: #001a4d;
  --color-eu-light: #f0f4ff;

  /* Nötr */
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #6b7280;
  --color-bg: #f0f4ff;
  --color-surface: #ffffff;
  --color-border: #d1d9e6;

  /* Semantik */
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}
```

## 4. Tipografi

### 4.1 Font Ailesi

| Rol | Font | Ağırlıklar | Yedek |
|-----|------|-----------|-------|
| Başlıklar | Inter | 600, 700, 800 | system-ui, sans-serif |
| Gövde | Inter | 400, 500 | system-ui, sans-serif |

### 4.2 Tip Ölçeği

| Öğe | Boyut | Ağırlık | Satır Yüksekliği |
|-----|-------|---------|-----------------|
| H1 | 2.5rem (40px) | 800 | 1.2 |
| H2 | 2rem (32px) | 700 | 1.3 |
| H3 | 1.5rem (24px) | 600 | 1.4 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |
| Badge | 0.75rem (12px) | 600 | 1.4 |

## 5. Ses & Ton

### 5.1 Kişilik
- **Teşvik edici**: Öğrencileri motive eden, pozitif dil — "Harika! Bir adım daha yaklaştın!"
- **Erişilebilir**: Akademik jargondan kaçınan, sade Türkçe
- **Eğlenceli**: Ciddi ama sıkıcı olmayan, oyun atmosferi yaratan
- **Bilgilendirici**: Her yanlış cevap bir öğrenme fırsatı — açıklamalar dahil

### 5.2 Yazım Kuralları
- Başlıklar: Kısa, aksiyon odaklı ("Kategorini Seç", "Hazır mısın?")
- Geri bildirim: Pozitif pekiştirme ("Doğru! 🎉", "Bir dahaki sefere!")
- Açıklamalar: 1-2 cümle, öğretici, "Biliyor muydun?" formatı
- Hata mesajları: Yardımcı, yönlendirici

### 5.3 Kelime Tercihleri

| Tercih Et | Kaçın |
|-----------|-------|
| Oyna | Sınavı çöz |
| Öğren | Ezberle |
| Keşfet | Çalış |
| Başar | Kazan |
| Deneme | Test |

## 6. Görsel Dil

### 6.1 Köşe Yarıçapı
- Kartlar: 12px (`rounded-xl`)
- Butonlar: 8px (`rounded-lg`)
- Badge: 9999px (`rounded-full`)
- Input: 8px (`rounded-lg`)

### 6.2 Gölgeler
- Kart varsayılan: `shadow-md` (0 4px 6px rgba(0,0,0,0.07))
- Kart hover: `shadow-lg` (0 10px 15px rgba(0,0,0,0.1))
- Buton aktif: `shadow-sm`

### 6.3 Boşluk Sistemi
- Temel birim: 4px
- Ölçek: 4, 8, 12, 16, 24, 32, 48, 64, 96
- Kart padding: 24px
- Bölüm boşlukları: 48-64px
- Grid gap: 16-24px

### 6.4 İkonlar
- Kütüphane: Emoji (MVP için — bağımlılık yok)
- Kategori ikonları: 🏛️ 🏢 📜 🌍 🗺️
- Zorluk: ⭐ (Kolay), ⭐⭐ (Orta), ⭐⭐⭐ (Zor)
- Geri bildirim: ✅ (Doğru), ❌ (Yanlış)

## 7. Varlık Kontrol Listesi

| Varlık | Format | Boyut | Durum |
|--------|--------|-------|-------|
| Favicon | .ico | 32px, 16px | TBD |
| OG Image | PNG | 1200×630 | TBD |
| Hero görseli | SVG/CSS | Responsive | CSS ile oluşturulacak |
| Kategori kartları | CSS | — | Gradient + emoji |
