import { fuzzyMatch } from './fuzzy-match';
import { POINTS } from './constants';
import type { Question, PlayerAnswer, EvaluationResult, FreeTextQuestion, MultipleChoiceQuestion, MatchingQuestion } from './types';

function evaluateMultipleChoice(question: MultipleChoiceQuestion, answer: string): EvaluationResult {
  const isCorrect = answer === question.correctAnswer;
  return {
    isCorrect,
    points: isCorrect ? POINTS.multipleChoice : 0,
    correctAnswer: question.correctAnswer,
  };
}

function evaluateFreeText(question: FreeTextQuestion, answer: string): EvaluationResult {
  const isCorrect =
    fuzzyMatch(answer, question.correctAnswer) ||
    (question.acceptableAnswers?.some(a => fuzzyMatch(answer, a)) ?? false);
  return {
    isCorrect,
    points: isCorrect ? POINTS.freeText : 0,
    correctAnswer: question.correctAnswer,
  };
}

function evaluateMatching(question: MatchingQuestion, answer: Record<string, string>): EvaluationResult {
  const matchResults = question.pairs.map(pair => ({
    left: pair.left,
    right: pair.right,
    isCorrect: answer[pair.left] === pair.right,
  }));
  const correctCount = matchResults.filter(r => r.isCorrect).length;
  return {
    isCorrect: correctCount === question.pairs.length,
    points: correctCount * POINTS.matchingPair,
    matchResults,
  };
}

export function evaluateAnswer(question: Question, answer: PlayerAnswer): EvaluationResult {
  switch (question.type) {
    case 'multiple-choice':
      return evaluateMultipleChoice(question, answer.answer as string);
    case 'free-text':
      return evaluateFreeText(question, answer.answer as string);
    case 'matching':
      return evaluateMatching(question, answer.answer as Record<string, string>);
  }
}
