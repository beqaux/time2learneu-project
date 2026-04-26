import { describe, it, expect } from 'vitest';
import { gameReducer, initialGameState } from '../lib/game-engine';
import type { Question, GameAction, EvaluationResult, PlayerAnswer } from '../lib/types';

const mockQuestion: Question = {
  id: 'test-001',
  category: 'test',
  type: 'multiple-choice',
  difficulty: 'easy',
  question: 'Test?',
  options: ['A', 'B'],
  correctAnswer: 'A',
  explanation: 'Test',
};

const mockAnswer: PlayerAnswer = { questionId: 'test-001', type: 'multiple-choice', answer: 'A' };
const mockResult: EvaluationResult = { isCorrect: true, points: 10 };

describe('gameReducer', () => {
  it('Başlangıç state doğru', () => {
    expect(initialGameState.status).toBe('idle');
    expect(initialGameState.score).toBe(0);
  });

  it('START_GAME state\'i playing yapar', () => {
    const action: GameAction = { type: 'START_GAME', questions: [mockQuestion] };
    const state = gameReducer(initialGameState, action);
    expect(state.status).toBe('playing');
    expect(state.questions.length).toBe(1);
    expect(state.totalQuestions).toBe(1);
  });

  it('SUBMIT_ANSWER puanı artırır ve answered yapar', () => {
    const playingState = gameReducer(initialGameState, { type: 'START_GAME', questions: [mockQuestion] });
    const action: GameAction = { type: 'SUBMIT_ANSWER', answer: mockAnswer, result: mockResult };
    const state = gameReducer(playingState, action);
    expect(state.status).toBe('answered');
    expect(state.score).toBe(10);
  });

  it('NEXT_QUESTION son soruda completed yapar', () => {
    const playingState = gameReducer(initialGameState, { type: 'START_GAME', questions: [mockQuestion] });
    const answeredState = gameReducer(playingState, { type: 'SUBMIT_ANSWER', answer: mockAnswer, result: mockResult });
    const state = gameReducer(answeredState, { type: 'NEXT_QUESTION' });
    expect(state.status).toBe('completed');
  });

  it('RESET başlangıç state\'e döner', () => {
    const playingState = gameReducer(initialGameState, { type: 'START_GAME', questions: [mockQuestion] });
    const state = gameReducer(playingState, { type: 'RESET' });
    expect(state).toEqual(initialGameState);
  });
});
