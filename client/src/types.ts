// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Session {
  sessionId: string;
  classifierGrade: number;
  grade: number;
}

export interface SessionLog {
  username: string;
  answers: string[];
}
