'use client';

import { useState } from 'react';
import type { MatchingQuestion } from '@/lib/types';
import Button from '../ui/Button';

interface MatchingCardProps {
  question: MatchingQuestion;
  onAnswer: (answer: Record<string, string>) => void;
  disabled?: boolean;
  matchResults?: { left: string; right: string; isCorrect: boolean }[];
}

export default function MatchingCard({
  question,
  onAnswer,
  disabled = false,
  matchResults,
}: MatchingCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Shuffle rights for display
  const [shuffledRights] = useState(() => {
    const rights = question.pairs.map(p => p.right);
    for (let i = rights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rights[i], rights[j]] = [rights[j], rights[i]];
    }
    return rights;
  });

  const matchedRights = new Set(Object.values(matches));

  function handleLeftClick(left: string) {
    if (disabled || submitted) return;
    setSelected(prev => (prev === left ? null : left));
  }

  function handleRightClick(right: string) {
    if (disabled || submitted || !selected) return;
    // Remove any existing mapping for this right
    const newMatches = { ...matches };
    // Remove previous match if right was already used
    for (const key of Object.keys(newMatches)) {
      if (newMatches[key] === right) delete newMatches[key];
    }
    newMatches[selected] = right;
    setMatches(newMatches);
    setSelected(null);
  }

  function handleSubmit() {
    if (submitted) return;
    setSubmitted(true);
    onAnswer(matches);
  }

  function getLeftStyle(left: string) {
    const base = 'px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer text-left ';
    if (submitted) {
      const result = matchResults?.find(r => r.left === left);
      if (result?.isCorrect) return base + 'border-green-500 bg-green-50 text-green-800';
      return base + 'border-red-500 bg-red-50 text-red-800';
    }
    if (selected === left) return base + 'border-[#003399] bg-[#f0f4ff] text-[#003399] shadow-md';
    if (matches[left]) return base + 'border-[#003399]/40 bg-[#f0f4ff]/60 text-[#1a1a2e]';
    return base + 'border-[#d1d9e6] text-[#1a1a2e] hover:border-[#003399] hover:bg-[#f0f4ff]';
  }

  function getRightStyle(right: string) {
    const base = 'px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 text-left ';
    if (submitted) {
      const pair = question.pairs.find(p => p.right === right);
      const result = matchResults?.find(r => r.right === right);
      if (result?.isCorrect) return base + 'border-green-500 bg-green-50 text-green-800 cursor-default';
      if (matches[pair?.left ?? ''] === right)
        return base + 'border-red-500 bg-red-50 text-red-800 cursor-default';
      return base + 'border-[#d1d9e6] text-[#6b7280] cursor-default opacity-60';
    }
    if (matchedRights.has(right)) return base + 'border-[#003399]/40 bg-[#f0f4ff]/60 text-[#1a1a2e] cursor-pointer';
    if (selected)
      return base + 'border-[#d1d9e6] text-[#1a1a2e] hover:border-[#FFCC00] hover:bg-yellow-50 cursor-pointer';
    return base + 'border-[#d1d9e6] text-[#6b7280] cursor-not-allowed opacity-60';
  }

  const allMatched = Object.keys(matches).length === question.pairs.length;

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[#1a1a2e] mb-2 leading-snug">
        {question.question}
      </h2>
      {!submitted && (
        <p className="text-sm text-[#6b7280] mb-6">
          {selected
            ? 'Şimdi sağ taraftan eşleşen seçeneği seçin'
            : 'Sol taraftan bir öğe seçin, sonra sağ taraftan eşleşeni tıklayın'}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Left column */}
        <div className="space-y-3">
          {question.pairs.map((pair, i) => (
            <button
              key={i}
              onClick={() => handleLeftClick(pair.left)}
              disabled={disabled || submitted}
              className={getLeftStyle(pair.left)}
            >
              <span className="flex items-center gap-2">
                {matches[pair.left] && !submitted && (
                  <span className="text-xs text-[#003399]">✓</span>
                )}
                {pair.left}
              </span>
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {shuffledRights.map((right, i) => (
            <button
              key={i}
              onClick={() => handleRightClick(right)}
              disabled={disabled || submitted || !selected}
              className={getRightStyle(right)}
            >
              {right}
            </button>
          ))}
        </div>
      </div>

      {/* Arrow indicators for matches */}
      {!submitted && Object.entries(matches).length > 0 && (
        <div className="mb-4 p-3 bg-[#f0f4ff] rounded-xl border border-[#d1d9e6]">
          <p className="text-xs text-[#6b7280] font-medium mb-2">Eşleştirilen:</p>
          {Object.entries(matches).map(([left, right]) => (
            <div key={left} className="text-sm text-[#1a1a2e] flex items-center gap-2">
              <span className="font-medium">{left}</span>
              <span className="text-[#003399]">→</span>
              <span>{right}</span>
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <Button
          id="submit-matching"
          onClick={handleSubmit}
          disabled={!allMatched || submitted}
          fullWidth
          size="lg"
        >
          {allMatched ? 'Kontrol Et' : `${Object.keys(matches).length}/${question.pairs.length} eşleştirildi`}
        </Button>
      )}
    </div>
  );
}
