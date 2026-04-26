'use client';

import { useReducer, useCallback } from 'react';
import { gameReducer, initialGameState } from '@/lib/game-engine';
import { evaluateAnswer } from '@/lib/evaluators';
import type { Question, PlayerAnswer, GameState } from '@/lib/types';

export function useGameSession(questions: Question[]) {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialGameState,
    questions,
    totalQuestions: questions.length,
    status: questions.length > 0 ? 'playing' : 'idle',
  });

  const submitAnswer = useCallback(
    (answer: PlayerAnswer) => {
      const currentQuestion = state.questions[state.currentIndex];
      if (!currentQuestion || state.status !== 'playing') return;
      const result = evaluateAnswer(currentQuestion, answer);
      dispatch({ type: 'SUBMIT_ANSWER', answer, result });
    },
    [state.questions, state.currentIndex, state.status]
  );

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const reset = useCallback((newQuestions?: Question[]) => {
    dispatch({ type: 'RESET' });
    if (newQuestions && newQuestions.length > 0) {
      dispatch({ type: 'START_GAME', questions: newQuestions });
    }
  }, []);

  return { state, submitAnswer, nextQuestion, reset };
}
