// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface Session {
  sessionId: string;
  username: string;
  graderGrade: number;
  classifierGrade: number;
  question: Question;
  userResponses: UserResponse[];
  createdAt: number;
  updatedAt: number;
  lesson: Lesson;
}

export interface Question {
  text: string;
  expectations: Expectation[];
}

export interface Expectation {
  text: string;
}

export interface UserResponse {
  text: string;
  expectationScores: ExpectationScore[];
}

export interface ExpectationScore {
  classifierGrade: string;
  graderGrade?: string;
}

export interface FetchSession {
  session: Session;
}

export interface FetchSessions {
  sessions: SessionsData;
}

export interface SessionsData {
  edges: Edge<Session>[];
  pageInfo: PageInfo;
}

export interface SetGrade {
  setGrade: Session;
}

export interface Lesson {
  id: string;
  lessonId: string;
  name: string;
  intro: string;
  question: string;
  conclusion: string[];
  expectations: LessonExpectation[];
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface LessonExpectation {
  expectation: string;
  hints: Hint[];
}

export interface Hint {
  text: string;
}

export interface FetchLesson {
  lesson: Lesson;
}

export interface FetchLessons {
  lessons: LessonsData;
}

export interface LessonsData {
  edges: Edge<Lesson>[];
  pageInfo: PageInfo;
}

export interface UpdateLesson {
  updateLesson: Lesson;
}
