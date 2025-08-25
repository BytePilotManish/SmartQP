import React, { createContext, useContext, useState } from 'react';
import { Question, Notification } from '../types';
import { useAuth } from './AuthContext';
import { pdfProcessor } from '../utils/pdfProcessor';

interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  total_marks: number;
  exam_type: 'CIE' | 'SEE';
  modules_covered: number;
  questions: any;
  created_by: string;
  created_at: string;
  status: 'draft' | 'sent_for_approval' | 'approved' | 'rejected';
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
}

interface AppContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  questionPapers: QuestionPaper[];
  setQuestionPapers: (papers: QuestionPaper[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  isProcessingFile: boolean;
  setIsProcessingFile: (processing: boolean) => void;
  processUploadedFile: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState(
    profile?.role === 'hod' ? 'approval-dashboard' : 'new-question-paper'
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const processUploadedFile = async (file: File) => {
    try {
      console.log('Starting to process file:', file.name);
      setIsProcessingFile(true);
      setUploadedFile(file);

      // Extract text from PDF
      console.log('Extracting text from PDF...');
      const extractedText = await pdfProcessor.extractTextFromPDF(file);
      console.log('Extracted text length:', extractedText.length);
      console.log('First 500 characters:', extractedText.substring(0, 500));

      // Parse questions from extracted text
      console.log('Parsing questions from text...');
      const extractedQuestions = pdfProcessor.parseQuestions(extractedText);
      console.log('Extracted questions:', extractedQuestions);

      // Convert to Question objects
      console.log('Converting to Question objects...');
      const parsedQuestions = pdfProcessor.convertToQuestions(extractedQuestions);
      console.log('Parsed questions:', parsedQuestions);

      // Update questions in context
      console.log('Setting questions in context...');
      setQuestions(parsedQuestions);

      // Show success notification
      addNotification({
        type: 'success',
        message: `Successfully extracted ${parsedQuestions.length} questions from ${file.name}`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to process the uploaded file',
      });
      setQuestions([]); // Clear questions on error
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <AppContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      currentPage,
      setCurrentPage,
      questions,
      setQuestions,
      questionPapers,
      setQuestionPapers,
      notifications,
      setNotifications,
      addNotification,
      uploadedFile,
      setUploadedFile,
      isProcessingFile,
      setIsProcessingFile,
      processUploadedFile,
    }}>
      {children}
    </AppContext.Provider>
  );
};