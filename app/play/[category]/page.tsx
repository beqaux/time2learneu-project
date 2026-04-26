import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { DIFFICULTY_LABELS } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { Metadata } from 'next';
import type { Difficulty } from '@/lib/types';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  return {
    title: cat ? `${cat.name} — Zorluk Seç | Time2LearnEU` : 'Time2LearnEU',
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) notFound();

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const difficultyVariants: Record<Difficulty, 'difficulty-easy' | 'difficulty-medium' | 'difficulty-hard'> = {
    easy: 'difficulty-easy',
    medium: 'difficulty-medium',
    hard: 'difficulty-hard',
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/play"
            className="inline-flex items-center gap-2 text-[#003399] hover:text-[#001a4d] font-medium mb-6 transition-colors"
          >
            ← Kategoriler
          </Link>
          <div className="text-5xl mb-4">{cat.icon}</div>
          <h1 className="text-4xl font-extrabold text-[#1a1a2e] mb-3">{cat.name}</h1>
          <p className="text-[#6b7280] text-lg">{cat.description}</p>
        </div>

        <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-8">Zorluk Seç</h2>

        {/* Difficulty Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {difficulties.map((diff, index) => {
            const info = DIFFICULTY_LABELS[diff];
            return (
              <Link
                key={diff}
                href={`/play/${category}/${diff}`}
                className="block animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card hoverable padding="lg" className="text-center group h-full">
                  <div className="text-3xl mb-3">{info.stars}</div>
                  <Badge variant={difficultyVariants[diff]} className="mb-3">
                    {info.label}
                  </Badge>
                  <p className="text-[#6b7280] text-sm mt-2">{info.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
