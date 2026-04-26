'use client';

import { useState } from 'react';
import type { MultipleChoiceQuestion } from '@/lib/types';
import Button from '../ui/Button';

interface MultipleChoiceCardProps {
  question: MultipleChoiceQuestion;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
  selectedAnswer?: string;
  correctAnswer?: string;
}

export default function MultipleChoiceCard({
  question,
  onAnswer,
  disabled = false,
  selectedAnswer,
  correctAnswer,
}: MultipleChoiceCardProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer ?? null);

  function handleSelect(option: string) {
    if (disabled || selected) return;
    setSelected(option);
    onAnswer(option);
  }

  function getOptionStyle(option: string): string {
    const base =
      'w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all duration-200 ';
    if (!selected) {
      return base + 'border-[#d1d9e6] text-[#1a1a2e] hover:border-[#003399] hover:bg-[#f0f4ff] cursor-pointer';
    }
    if (option === correctAnswer) {
      return base + 'border-green-500 bg-green-50 text-green-800 cursor-default';
    }
    if (option === selected && option !== correctAnswer) {
      return base + 'border-red-500 bg-red-50 text-red-800 cursor-default';
    }
    return base + 'border-[#d1d9e6] text-[#6b7280] cursor-default opacity-60';
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-6 leading-snug">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            id={`option-${idx}`}
            onClick={() => handleSelect(option)}
            disabled={disabled || !!selected}
            className={getOptionStyle(option)}
          >
            <span className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              {option}
              {selected && option === correctAnswer && <span className="ml-auto">✅</span>}
              {selected && option === selected && option !== correctAnswer && (
                <span className="ml-auto">❌</span>
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
