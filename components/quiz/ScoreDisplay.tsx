'use client';

import { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  className?: string;
}

export default function ScoreDisplay({ score, className = '' }: ScoreDisplayProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const diff = score - display;
    if (diff <= 0) {
      setDisplay(score);
      return;
    }
    const step = Math.ceil(diff / 10);
    const timer = setInterval(() => {
      setDisplay(prev => {
        if (prev + step >= score) {
          clearInterval(timer);
          return score;
        }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  return (
    <span className={`font-bold tabular-nums ${className}`}>
      {display}
    </span>
  );
}
