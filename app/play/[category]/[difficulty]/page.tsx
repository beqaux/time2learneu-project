import { notFound } from 'next/navigation';
import { CATEGORIES } from '@/data/categories';
import { DIFFICULTY_LABELS } from '@/lib/constants';
import type { Difficulty } from '@/lib/types';
import type { Metadata } from 'next';
import GameClient from './GameClient';

interface Props {
  params: Promise<{ category: string; difficulty: string }>;
}

const VALID_DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, difficulty } = await params;
  const cat = CATEGORIES.find(c => c.id === category);
  const diff = DIFFICULTY_LABELS[difficulty];
  return {
    title: cat && diff
      ? `${cat.name} — ${diff.label} | Time2LearnEU`
      : 'Time2LearnEU Quiz',
  };
}

export default async function GamePage({ params }: Props) {
  const { category, difficulty } = await params;

  const cat = CATEGORIES.find(c => c.id === category);
  if (!cat) notFound();

  if (!VALID_DIFFICULTIES.includes(difficulty as Difficulty)) notFound();

  return <GameClient categoryId={category} difficulty={difficulty as Difficulty} />;
}
