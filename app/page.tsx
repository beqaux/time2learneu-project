import Hero from '@/components/landing/Hero';
import FeatureCards from '@/components/landing/FeatureCards';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Time2LearnEU — Avrupa Birliği Quiz Oyunu',
  description: 'AB hakkında bilgini test et! Çoktan seçmeli, serbest metin ve eşleştirme sorularıyla interaktif öğrenme.',
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <footer className="bg-[#001a4d] text-blue-200 py-8 text-center text-sm">
        <p>© 2024 Time2LearnEU — Avrupa Birliği hakkında eğlenceli öğrenme</p>
      </footer>
    </main>
  );
}
