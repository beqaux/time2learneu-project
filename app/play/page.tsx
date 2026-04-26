import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import Card from '@/components/ui/Card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kategori Seç — Time2LearnEU',
  description: 'AB Tarihi, Kurumlar, Antlaşmalar ve daha fazlası! Bir kategori seçerek quiz\'e başla.',
};

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-[#f0f4ff] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#003399] hover:text-[#001a4d] font-medium mb-6 transition-colors"
          >
            ← Ana Sayfa
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-4">
            Kategori Seç
          </h1>
          <p className="text-[#6b7280] text-lg max-w-xl mx-auto">
            Hangi konuyu test etmek istersin? Bir kategori seçerek başla.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.id}
              href={`/play/${category.id}`}
              className="block animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <Card hoverable padding="lg" className="h-full text-center group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-2 group-hover:text-[#003399] transition-colors">
                  {category.name}
                </h2>
                <p className="text-[#6b7280] text-sm leading-relaxed">{category.description}</p>
                <div className="mt-4 text-[#003399] font-semibold text-sm flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Seç →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
