import { MOTIVATIONAL_MESSAGES } from '@/lib/constants';

interface MotivationalMessageProps {
  scorePercentage: number;
}

export default function MotivationalMessage({ scorePercentage }: MotivationalMessageProps) {
  let message: string;
  let emoji: string;
  let colorClass: string;

  if (scorePercentage >= MOTIVATIONAL_MESSAGES.excellent.threshold) {
    message = MOTIVATIONAL_MESSAGES.excellent.message;
    emoji = '🎉';
    colorClass = 'text-yellow-600';
  } else if (scorePercentage >= MOTIVATIONAL_MESSAGES.good.threshold) {
    message = MOTIVATIONAL_MESSAGES.good.message;
    emoji = '💪';
    colorClass = 'text-blue-600';
  } else {
    message = MOTIVATIONAL_MESSAGES.retry.message;
    emoji = '📚';
    colorClass = 'text-orange-600';
  }

  return (
    <p className={`text-lg font-semibold ${colorClass} flex items-center gap-2 justify-center`}>
      <span>{emoji}</span>
      <span>{message}</span>
    </p>
  );
}
