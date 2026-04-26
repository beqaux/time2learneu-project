import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}: CardProps) {
  const paddingClass = { sm: 'p-4', md: 'p-6', lg: 'p-8' }[padding];

  return (
    <div
      onClick={onClick}
      className={[
        'bg-white rounded-xl shadow-md border border-[#d1d9e6]',
        paddingClass,
        hoverable
          ? 'card-hover cursor-pointer hover:border-[#003399] hover:shadow-xl'
          : '',
        onClick ? 'cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
