import Link from 'next/link';
import Button from '../ui/Button';
import { MOTIVATIONAL_MESSAGES } from '@/lib/constants';
import type { GameState } from '@/lib/types';

interface ResultSummaryProps {
  gameState: GameState;
  onReset: () => void;
}

export default function ResultSummary({ gameState, onReset }: ResultSummaryProps) {
  const { score, answers } = gameState;
  const correctCount = answers.filter(a => a.result.isCorrect).length;
  const total = answers.length;
  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Max possible score
  const maxScore = answers.reduce((acc, a) => {
    if (a.question.type === 'multiple-choice') return acc + 10;
    if (a.question.type === 'free-text') return acc + 25;
    if (a.question.type === 'matching') return acc + (a.question as any).pairs.length * 5;
    return acc;
  }, 0);

  const scorePercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  let emoji = '📚';
  let bgClass = 'bg-orange-50 border-orange-200';
  let textClass = 'text-orange-700';
  if (scorePercentage >= 80) { emoji = '🏆'; bgClass = 'bg-yellow-50 border-yellow-300'; textClass = 'text-yellow-700'; }
  else if (scorePercentage >= 50) { emoji = '💪'; bgClass = 'bg-blue-50 border-blue-200'; textClass = 'text-blue-700'; }

  const msg =
    scorePercentage >= 80
      ? MOTIVATIONAL_MESSAGES.excellent.message
      : scorePercentage >= 50
      ? MOTIVATIONAL_MESSAGES.good.message
      : MOTIVATIONAL_MESSAGES.retry.message;

  return (
    <div className="min-h-screen bg-[#f0f4ff] py-12 px-4 flex items-start justify-center">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8 animate-slide-up">
          <div className="text-7xl mb-4">{emoji}</div>
          <h1 className="text-4xl font-extrabold text-[#1a1a2e] mb-2">Quiz Bitti!</h1>
          <p className={`px-6 py-3 rounded-xl border-2 inline-block font-medium ${bgClass} ${textClass}`}>
            {msg}
          </p>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#d1d9e6] p-6 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="text-center mb-6">
            <div className="text-5xl font-extrabold text-[#003399] mb-1">
              {score} puan
            </div>
            <div className="text-[#6b7280]">Maksimum: {maxScore} puan</div>
          </div>

          <div className="w-full bg-[#e0e8ff] rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${scorePercentage}%`,
                background: 'linear-gradient(90deg, #003399, #1a56db, #FFCC00)',
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-[#f0f4ff] rounded-xl p-4">
              <div className="text-3xl font-bold text-[#16a34a]">{correctCount}</div>
              <div className="text-xs text-[#6b7280] mt-1">Doğru</div>
            </div>
            <div className="bg-[#f0f4ff] rounded-xl p-4">
              <div className="text-3xl font-bold text-[#dc2626]">{total - correctCount}</div>
              <div className="text-xs text-[#6b7280] mt-1">Yanlış</div>
            </div>
            <div className="bg-[#f0f4ff] rounded-xl p-4">
              <div className="text-3xl font-bold text-[#003399]">{percentage}%</div>
              <div className="text-xs text-[#6b7280] mt-1">Başarı</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button id="replay-btn" onClick={onReset} fullWidth size="lg" variant="primary">
            🔄 Tekrar Oyna
          </Button>
          <Link href="/play" className="block">
            <Button id="change-category-btn" fullWidth size="lg" variant="secondary">
              📚 Başka Kategori
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button id="home-btn" fullWidth size="lg" variant="ghost">
              🏠 Ana Sayfa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
