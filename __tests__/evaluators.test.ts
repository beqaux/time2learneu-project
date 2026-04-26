import { describe, it, expect } from 'vitest';
import { evaluateAnswer } from '../lib/evaluators';
import type { MultipleChoiceQuestion, FreeTextQuestion, MatchingQuestion, PlayerAnswer } from '../lib/types';

const mcQuestion: MultipleChoiceQuestion = {
  id: 'test-mc-001',
  category: 'test',
  type: 'multiple-choice',
  difficulty: 'easy',
  question: 'Test sorusu?',
  options: ['A', 'B', 'C', 'D'],
  correctAnswer: 'B',
  explanation: 'Test açıklaması',
};

const ftQuestion: FreeTextQuestion = {
  id: 'test-ft-001',
  category: 'test',
  type: 'free-text',
  difficulty: 'easy',
  question: 'Serbest metin sorusu?',
  correctAnswer: 'Roma Antlaşması',
  acceptableAnswers: ['Roma antlaşması'],
  explanation: 'Test açıklaması',
};

const matchingQuestion: MatchingQuestion = {
  id: 'test-match-001',
  category: 'test',
  type: 'matching',
  difficulty: 'easy',
  question: 'Eşleştir',
  pairs: [
    { left: 'A', right: '1' },
    { left: 'B', right: '2' },
  ],
  explanation: 'Test açıklaması',
};

describe('evaluateAnswer - Multiple Choice', () => {
  it('Doğru cevap için 10 puan verir', () => {
    const answer: PlayerAnswer = { questionId: 'test-mc-001', type: 'multiple-choice', answer: 'B' };
    const result = evaluateAnswer(mcQuestion, answer);
    expect(result.isCorrect).toBe(true);
    expect(result.points).toBe(10);
  });

  it('Yanlış cevap için 0 puan verir', () => {
    const answer: PlayerAnswer = { questionId: 'test-mc-001', type: 'multiple-choice', answer: 'A' };
    const result = evaluateAnswer(mcQuestion, answer);
    expect(result.isCorrect).toBe(false);
    expect(result.points).toBe(0);
  });
});

describe('evaluateAnswer - Free Text', () => {
  it('Tam eşleşme için 25 puan verir', () => {
    const answer: PlayerAnswer = { questionId: 'test-ft-001', type: 'free-text', answer: 'Roma Antlaşması' };
    const result = evaluateAnswer(ftQuestion, answer);
    expect(result.isCorrect).toBe(true);
    expect(result.points).toBe(25);
  });

  it('Türkçe karakter farkıyla fuzzy match çalışır', () => {
    const answer: PlayerAnswer = { questionId: 'test-ft-001', type: 'free-text', answer: 'Roma antlasmasi' };
    const result = evaluateAnswer(ftQuestion, answer);
    expect(result.isCorrect).toBe(true);
  });

  it('Yanlış cevap için 0 puan', () => {
    const answer: PlayerAnswer = { questionId: 'test-ft-001', type: 'free-text', answer: 'xyz123' };
    const result = evaluateAnswer(ftQuestion, answer);
    expect(result.isCorrect).toBe(false);
    expect(result.points).toBe(0);
  });
});

describe('evaluateAnswer - Matching', () => {
  it('Tüm çiftler doğruysa tam puan', () => {
    const answer: PlayerAnswer = {
      questionId: 'test-match-001',
      type: 'matching',
      answer: { A: '1', B: '2' },
    };
    const result = evaluateAnswer(matchingQuestion, answer);
    expect(result.isCorrect).toBe(true);
    expect(result.points).toBe(10); // 2 pairs × 5
  });

  it('Kısmi doğru eşleşmelerde kısmi puan', () => {
    const answer: PlayerAnswer = {
      questionId: 'test-match-001',
      type: 'matching',
      answer: { A: '1', B: '9' },
    };
    const result = evaluateAnswer(matchingQuestion, answer);
    expect(result.isCorrect).toBe(false);
    expect(result.points).toBe(5); // 1 pair × 5
  });
});
