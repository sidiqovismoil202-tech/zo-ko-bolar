export type Grade = 1 | 2 | 3 | 4 | 5;

export type SubjectId = 'matematika' | 'ona_tili' | 'oqish' | 'ingliz_tili' | 'tabiat';

export interface Subject {
  id: SubjectId;
  name: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgLight: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  grade: Grade;
  subjectId: SubjectId;
  title: string;
  emoji: string;
  readTime: string;
  summary: string;
  content: {
    introduction: string;
    keyPoints: {
      emoji: string;
      title: string;
      description: string;
      example?: string;
    }[];
    funFact?: string;
  };
  quiz: QuizQuestion[];
}

export type GameId = 
  | 'math_quiz' 
  | 'memory' 
  | 'word_puzzle' 
  | 'match_pairs' 
  | 'english_explorer' 
  | 'drag_drop';

export interface GameInfo {
  id: GameId;
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
  color: string;
  gradient: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  requiredStars: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  grade: Grade;
  stars: number;
  completedLessons: string[]; // lesson ids
  completedQuizzes: string[]; // quiz ids
  unlockedBadges: string[];
  gamesPlayed: number;
}
