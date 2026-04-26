'use client';

import { useEffect, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { CATEGORIES } from '@/data/categories';
import { getQuestionsByCategory } from '@/lib/question-loader';
import { useGameSession } from '@/hooks/useGameSession';
import QuestionHeader from '@/components/quiz/QuestionHeader';
import MultipleChoiceCard from '@/components/quiz/MultipleChoiceCard';
import FreeTextCard from '@/components/quiz/FreeTextCard';
import MatchingCard from '@/components/quiz/MatchingCard';
import AnswerFeedback from '@/components/quiz/AnswerFeedback';
import ResultSummary from '@/components/result/ResultSummary';
import Card from '@/components/ui/Card';
import type { Difficulty, PlayerAnswer } from '@/lib/types';

interface GameClientProps {
  categoryId: string;
  difficulty: Difficulty;
}

export default function GameClient({ categoryId, difficulty }: GameClientProps) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const questions = useMemo(
    () => getQuestionsByCategory(categoryId, difficulty),
    [categoryId, difficulty]
  );

  const { state, submitAnswer, nextQuestion, reset } = useGameSession(questions);

  if (!category) return null;

  // No questions for this combo
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Soru Bulunamadı</h2>
          <p className="text-[#6b7280]">Bu kategori ve zorluk için henüz soru eklenmemiş.</p>
        </Card>
      </div>
    );
  }

  // Game completed
  if (state.status === 'completed') {
    return (
      <ResultSummary
        gameState={state}
        onReset={() => reset(getQuestionsByCategory(categoryId, difficulty))}
      />
    );
  }

  const currentQuestion = state.questions[state.currentIndex];
  const lastAnswer = state.answers[state.answers.length - 1];
  const isAnswered = state.status === 'answered';
  const isLast = state.currentIndex === state.totalQuestions - 1;

  function handleAnswer(rawAnswer: string | Record<string, string>) {
    if (!currentQuestion) return;
    const answer: PlayerAnswer = {
      questionId: currentQuestion.id,
      type: currentQuestion.type,
      answer: rawAnswer,
    };
    submitAnswer(answer);
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <QuestionHeader
          currentIndex={state.currentIndex}
          totalQuestions={state.totalQuestions}
          score={state.score}
          category={categoryId}
          difficulty={difficulty}
          categoryLabel={`${category.icon} ${category.name}`}
        />

        <Card padding="lg" className="animate-slide-up">
          {currentQuestion.type === 'multiple-choice' && (
            <MultipleChoiceCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={answer => handleAnswer(answer)}
              disabled={isAnswered}
              selectedAnswer={
                isAnswered ? (lastAnswer?.playerAnswer.answer as string) : undefined
              }
              correctAnswer={isAnswered ? currentQuestion.correctAnswer : undefined}
            />
          )}

          {currentQuestion.type === 'free-text' && (
            <FreeTextCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={answer => handleAnswer(answer)}
              disabled={isAnswered}
              correctAnswer={isAnswered ? currentQuestion.correctAnswer : undefined}
              isCorrect={isAnswered ? lastAnswer?.result.isCorrect : undefined}
            />
          )}

          {currentQuestion.type === 'matching' && (
            <MatchingCard
              key={currentQuestion.id}
              question={currentQuestion}
              onAnswer={answer => handleAnswer(answer as Record<string, string>)}
              disabled={isAnswered}
              matchResults={isAnswered ? lastAnswer?.result.matchResults : undefined}
            />
          )}

          {isAnswered && lastAnswer && (
            <AnswerFeedback
              result={lastAnswer.result}
              explanation={currentQuestion.explanation}
              onNext={nextQuestion}
              isLast={isLast}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
