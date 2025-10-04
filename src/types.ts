export interface Profile {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
  createdAt: string;
  matched: boolean;
  questionnaire?: QuestionnaireAnswers;
}

export interface QuestionnaireAnswers {
  profileId: string;
  answers: Record<string, string>;
  completedAt: string;
}

export interface Match {
  id: string;
  profileId1: string;
  profileId2: string;
  createdAt: string;
}
