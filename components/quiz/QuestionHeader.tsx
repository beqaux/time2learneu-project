import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';
import type { Difficulty } from '@/lib/types';

interface QuestionHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  category: string;
  difficulty: Difficulty;
  categoryLabel: string;
}

const difficultyBadge: Record<Difficulty, 'difficulty-easy' | 'difficulty-medium' | 'difficulty-hard'> = {
  easy: 'difficulty-easy',
  medium: 'difficulty-medium',
  hard: 'difficulty-hard',
};

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Kolay',
  medium: 'Orta',
  hard: 'Zor',
};

export default function QuestionHeader({
  currentIndex,
  totalQuestions,
  score,
  difficulty,
  categoryLabel,
}: QuestionHeaderProps) {
  const progress = totalQuestions > 0 ? ((currentIndex) / totalQuestions) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="category">{categoryLabel}</Badge>
          <Badge variant={difficultyBadge[difficulty]}>{difficultyLabel[difficulty]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="score">⭐ {score} puan</Badge>
          <span className="text-[#6b7280] text-sm font-medium">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
