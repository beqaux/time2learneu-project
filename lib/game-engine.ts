import type { GameState, GameAction } from './types';

export const initialGameState: GameState = {
  status: 'idle',
  categoryId: null,
  difficulty: null,
  questions: [],
  currentIndex: 0,
  answers: [],
  score: 0,
  totalQuestions: 0,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CATEGORY':
      return { ...state, status: 'selecting', categoryId: action.categoryId };
    case 'SELECT_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };
    case 'START_GAME':
      return {
        ...state,
        status: 'playing',
        questions: action.questions,
        totalQuestions: action.questions.length,
        currentIndex: 0,
        score: 0,
        answers: [],
      };
    case 'SUBMIT_ANSWER':
      if (state.status !== 'playing') return state;
      return {
        ...state,
        status: 'answered',
        score: state.score + action.result.points,
        answers: [
          ...state.answers,
          {
            question: state.questions[state.currentIndex],
            playerAnswer: action.answer,
            result: action.result,
          },
        ],
      };
    case 'NEXT_QUESTION': {
      if (state.status !== 'answered') return state;
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.totalQuestions) return { ...state, status: 'completed' };
      return { ...state, status: 'playing', currentIndex: nextIndex };
    }
    case 'COMPLETE_GAME':
      return { ...state, status: 'completed' };
    case 'RESET':
      return initialGameState;
    default:
      return state;
  }
}
