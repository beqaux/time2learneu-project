export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'multiple-choice' | 'free-text' | 'matching';
export type GameStatus = 'idle' | 'selecting' | 'playing' | 'answered' | 'completed';

export interface MatchingPair {
  left: string;
  right: string;
}

export interface BaseQuestion {
  id: string;
  category: string;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  explanation: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: string;
}

export interface FreeTextQuestion extends BaseQuestion {
  type: 'free-text';
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export type Question = MultipleChoiceQuestion | FreeTextQuestion | MatchingQuestion;

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PlayerAnswer {
  questionId: string;
  type: QuestionType;
  answer: string | string[] | Record<string, string>;
}

export interface EvaluationResult {
  isCorrect: boolean;
  points: number;
  correctAnswer?: string;
  matchResults?: { left: string; right: string; isCorrect: boolean }[];
}

export interface GameState {
  status: GameStatus;
  categoryId: string | null;
  difficulty: Difficulty | null;
  questions: Question[];
  currentIndex: number;
  answers: { question: Question; playerAnswer: PlayerAnswer; result: EvaluationResult }[];
  score: number;
  totalQuestions: number;
}

export type GameAction =
  | { type: 'SELECT_CATEGORY'; categoryId: string }
  | { type: 'SELECT_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'START_GAME'; questions: Question[] }
  | { type: 'SUBMIT_ANSWER'; answer: PlayerAnswer; result: EvaluationResult }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_GAME' }
  | { type: 'RESET' };
