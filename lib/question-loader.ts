import type { Question, Difficulty } from './types';
import { shuffleArray } from './utils';

import euHistoryRaw from '../data/questions/eu-history.json';
import institutionsRaw from '../data/questions/institutions.json';
import treatiesRaw from '../data/questions/treaties.json';
import cultureSymbolsRaw from '../data/questions/culture-symbols.json';
import geographyMembersRaw from '../data/questions/geography-members.json';

const ALL_QUESTIONS: Question[] = [
  ...(euHistoryRaw as Question[]),
  ...(institutionsRaw as Question[]),
  ...(treatiesRaw as Question[]),
  ...(cultureSymbolsRaw as Question[]),
  ...(geographyMembersRaw as Question[]),
];

export function getQuestionsByCategory(categoryId: string, difficulty: Difficulty): Question[] {
  const filtered = ALL_QUESTIONS.filter(
    q => q.category === categoryId && q.difficulty === difficulty
  );
  return shuffleArray(filtered);
}

export function getAllQuestions(): Question[] {
  return ALL_QUESTIONS;
}
