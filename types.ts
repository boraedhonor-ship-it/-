
export enum GameMode {
  HOME = 'HOME',
  LEARN_ADD = 'LEARN_ADD',
  LEARN_SUB = 'LEARN_SUB',
  QUIZ = 'QUIZ'
}

export interface Question {
  id: string;
  num1: number;
  num2: number;
  operation: '+' | '-';
  icon: string;
  correctAnswer: number;
  options: number[];
}

export interface QuizState {
  score: number;
  currentQuestionIndex: number;
  isGameOver: boolean;
}
