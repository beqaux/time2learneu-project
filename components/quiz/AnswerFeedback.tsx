import type { EvaluationResult } from '@/lib/types';
import Button from '../ui/Button';

interface AnswerFeedbackProps {
  result: EvaluationResult;
  explanation: string;
  onNext: () => void;
  isLast: boolean;
}

export default function AnswerFeedback({ result, explanation, onNext, isLast }: AnswerFeedbackProps) {
  return (
    <div className="mt-6 animate-fade-in">
      {/* Result banner */}
      <div
        className={[
          'p-4 rounded-xl border-2 mb-4 flex items-center gap-3',
          result.isCorrect
            ? 'bg-green-50 border-green-500 text-green-800'
            : 'bg-red-50 border-red-500 text-red-800',
        ].join(' ')}
      >
        <span className="text-2xl">{result.isCorrect ? '✅' : '❌'}</span>
        <div>
          <p className="font-bold text-base">
            {result.isCorrect ? 'Doğru!' : 'Yanlış!'}
          </p>
          <p className="text-sm opacity-80">
            {result.points > 0 ? `+${result.points} puan kazandın` : 'Puan kazanılamadı'}
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
        <p className="text-sm font-semibold text-blue-800 mb-1">💡 Açıklama</p>
        <p className="text-sm text-blue-700 leading-relaxed">{explanation}</p>
      </div>

      {/* Matching pair results if applicable */}
      {result.matchResults && (
        <div className="p-4 bg-white border border-[#d1d9e6] rounded-xl mb-4">
          <p className="text-sm font-semibold text-[#1a1a2e] mb-2">Eşleştirme Sonuçları:</p>
          {result.matchResults.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm mb-1">
              <span>{r.isCorrect ? '✅' : '❌'}</span>
              <span className="font-medium">{r.left}</span>
              <span className="text-[#6b7280]">→</span>
              <span>{r.right}</span>
            </div>
          ))}
        </div>
      )}

      <Button id="next-question-btn" onClick={onNext} fullWidth size="lg" variant="primary">
        {isLast ? '🏆 Sonuçları Gör' : 'Sonraki Soru →'}
      </Button>
    </div>
  );
}
