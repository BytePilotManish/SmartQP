export interface Question {
  id: string;
  text: string;
  module: number;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  subject: string;
  createdAt: Date;
}

export interface SubQuestion {
  id: string;
  text: string;
  marks: number;
  module: number;
}

export interface MainQuestion {
  id: string;
  text: string;
  marks: number;
  module: number;
  subQuestions: SubQuestion[];
}

export interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  totalMarks: number;
  examType: 'CIE' | 'SEE';
  modulesCovered: number;
  mainQuestions: MainQuestion[];
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'sent_for_approval' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface QuestionPaperScheme {
  id: string;
  title: string;
  structure: {
    totalMarks: number;
    mainQuestions: {
      marks: number;
      subQuestions: { marks: number }[];
    }[];
  };
  createdBy: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'approval' | 'rejection';
  message: string;
  questionPaperId: string;
  read: boolean;
  createdAt: Date;
}