import React from 'react';

type BadgeVariant = 'default' | 'difficulty-easy' | 'difficulty-medium' | 'difficulty-hard' | 'category' | 'score';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#f0f4ff] text-[#003399] border border-[#d1d9e6]',
  'difficulty-easy': 'bg-green-100 text-green-700 border border-green-200',
  'difficulty-medium': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  'difficulty-hard': 'bg-red-100 text-red-700 border border-red-200',
  category: 'bg-[#003399] text-white',
  score: 'bg-[#FFCC00] text-[#001a4d] font-bold',
};

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
