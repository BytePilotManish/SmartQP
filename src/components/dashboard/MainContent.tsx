import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { NewQuestionPaper } from '../pages/NewQuestionPaper';
import { SavedPapers } from '../pages/SavedPapers';
import { SavedSchemes } from '../pages/SavedSchemes';
import { SentForApproval } from '../pages/SentForApproval';
import { ApprovedRejected } from '../pages/ApprovedRejected';
import { Settings } from '../pages/Settings';
import { Help } from '../pages/Help';
import { QuestionEditor } from '../pages/QuestionEditor';
import { ApprovalDashboard } from '../pages/ApprovalDashboard';
import { useAuth } from '../../contexts/AuthContext';

export const MainContent: React.FC = () => {
  const { currentPage } = useApp();
  const { profile } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'approval-dashboard':
        return <ApprovalDashboard />;
      case 'new-question-paper':
        return <NewQuestionPaper />;
      case 'saved-papers':
        return <SavedPapers />;
      case 'saved-schemes':
        return <SavedSchemes />;
      case 'sent-for-approval':
        return <SentForApproval />;
      case 'approved-rejected':
        return <ApprovedRejected />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <Help />;
      case 'question-editor':
        return <QuestionEditor />;
      default:
        return profile?.role === 'hod' ? <ApprovalDashboard /> : <NewQuestionPaper />;
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      {renderPage()}
    </main>
  );
};