/*
This software is Copyright ©️ 2020 The University of Southern California. All Rights Reserved. 
Permission to use, copy, modify, and distribute this software and its documentation for educational, research and non-profit purposes, without fee, and without a written agreement is hereby granted, provided that the above copyright notice and subject to the full license file found in the root of this software deliverable. Permission to make commercial use of this software may be obtained by contacting:  USC Stevens Center for Innovation University of Southern California 1150 S. Olive Street, Suite 2300, Los Angeles, CA 90115, USA Email: accounting@stevens.usc.edu

The full terms of this copyright and license should always be found in the root directory of this software deliverable as "license.txt" and if these terms are not found with this software, please contact the USC Stevens Center for the full license.
*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = any;

export interface Edge<T> {
  cursor: string;
  node: T;
}

export interface PageInfo {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface Session {
  sessionId: string;
  username: string;
  graderGrade: number;
  classifierGrade: number;
  question: Question;
  userResponses: UserResponse[];
  createdAt: string;
  updatedAt: string;
  lesson: Lesson;
  lessonName: string;
  lessonCreatedBy: string;
  deleted: boolean;
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

export interface Lesson {
  lessonId: string;
  name: string;
  intro: string;
  question: string;
  image: string;
  expectations: LessonExpectation[];
  conclusion: string[];
  lastTrainedAt: string;
  features: any;
  isTrainable: boolean;
  createdBy: string;
  createdByName: string;
  userPermissions: UserPermission;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface UserPermission {
  view: boolean;
  edit: boolean;
}

export interface LessonExpectation {
  expectation: string;
  features: any;
  hints: Hint[];
}

export interface Hint {
  text: string;
}

export interface TrainJob {
  id: string;
  lesson: boolean;
  statusUrl: string;
}

export enum TrainState {
  FAILURE = "FAILURE",
  NONE = "NONE",
  SUCCESS = "SUCCESS",
}

export interface TrainStatus {
  state: TrainState;
  status?: string;
  info?: TrainingInfo;
}

export interface TrainExpectionResult {
  accuracy: number;
}

export interface TrainResult {
  expectations: TrainExpectionResult[];
}

export interface TrainingInfo {
  lesson: string;
  expectations?: TrainExpectionResult[];
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserAccessToken {
  user: User;
  accessToken: string;
  expirationDate: string;
}

export interface Login {
  login: UserAccessToken;
}

export interface LoginGoogle {
  loginGoogle: UserAccessToken;
}

export interface FetchSession {
  me: {
    session: Session;
  };
}

export interface FetchSessions {
  me: {
    sessions: Connection<Session>;
  };
}

export interface SetGrade {
  me: {
    setGrade: Session;
  };
}

export interface FetchLesson {
  me: {
    lesson: Lesson;
  };
}

export interface FetchLessons {
  me: {
    lessons: Connection<Lesson>;
  };
}

export interface UpdateLesson {
  me: {
    updateLesson: Lesson;
  };
}

export interface DeleteLesson {
  me: {
    deleteLesson: Lesson;
  };
}

export interface DeleteSession {
  me: {
    deleteSession: Session;
  };
}
