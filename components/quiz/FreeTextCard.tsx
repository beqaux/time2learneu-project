'use client';

import { useState } from 'react';
import type { FreeTextQuestion } from '@/lib/types';
import Button from '../ui/Button';

interface FreeTextCardProps {
  question: FreeTextQuestion;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  isCorrect?: boolean;
}

export default function FreeTextCard({
  question,
  onAnswer,
  disabled = false,
  correctAnswer,
  isCorrect,
}: FreeTextCardProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!input.trim() || submitted) return;
    setSubmitted(true);
    onAnswer(input.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit();
  }

  const inputBorderClass = !submitted
    ? 'border-[#d1d9e6] focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/20'
    : isCorrect
    ? 'border-green-500 bg-green-50 text-green-800'
    : 'border-red-500 bg-red-50 text-red-800';

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-6 leading-snug">
        {question.question}
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <input
            id="free-text-input"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || submitted}
            placeholder="Cevabınızı yazın..."
            className={[
              'w-full px-5 py-4 rounded-xl border-2 text-base font-medium outline-none transition-all duration-200',
              inputBorderClass,
            ].join(' ')}
          />
          {submitted && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
              {isCorrect ? '✅' : '❌'}
            </span>
          )}
        </div>

        {submitted && !isCorrect && correctAnswer && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-700">
              <span className="font-semibold">Doğru cevap:</span> {correctAnswer}
            </p>
          </div>
        )}

        {!submitted && (
          <Button
            id="submit-free-text"
            onClick={handleSubmit}
            disabled={!input.trim() || submitted}
            fullWidth
            size="lg"
          >
            Cevapla
          </Button>
        )}
      </div>
    </div>
  );
}
