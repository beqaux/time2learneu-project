'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  className = '',
  showLabel = false,
  label,
  animated = true,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => setDisplayValue(value), 50);
      return () => clearTimeout(timeout);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-[#6b7280]">{label}</span>
          <span className="text-sm font-semibold text-[#003399]">{value}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-[#e0e8ff] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${displayValue}%`,
            background: 'linear-gradient(90deg, #003399, #1a56db)',
          }}
        />
      </div>
    </div>
  );
}
