import React, { useState } from 'react';
import { Send, Calendar, User, Eye, Clock, AlertCircle } from 'lucide-react';
import { QuestionPaper } from '../../types';

// Mock data
const mockSentPapers: QuestionPaper[] = [
  {
    id: '1',
    title: 'Object Oriented Programming - CIE 1',
    subject: 'Computer Science',
    totalMarks: 100,
    examType: 'CIE',
    modulesCovered: 2,
    mainQuestions: [],
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-15'),
    status: 'sent_for_approval'
  },
  {
    id: '2',
    title: 'Database Management Systems - SEE',
    subject: 'Computer Science',
    totalMarks: 100,
    examType: 'SEE',
    modulesCovered: 5,
    mainQuestions: [],
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-12'),
    status: 'sent_for_approval'
  }
];

export const SentForApproval: React.FC = () => {
  const [papers] = useState<QuestionPaper[]>(mockSentPapers);

  const getDaysAgo = (date: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Sent for Approval</h1>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            {papers.length} papers pending approval
          </div>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No papers sent for approval</h3>
            <p className="text-gray-500">Papers you send for approval will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper) => (
              <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Send className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{paper.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {paper.subject}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {paper.createdAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            paper.examType === 'CIE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {paper.examType}
                          </span>
                        </div>
                        <div>
                          Total: {paper.totalMarks} marks
                        </div>
                      </div>
                      <div className="mt-3 flex items-center">
                        <Clock className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="text-sm text-orange-600 font-medium">
                          Sent {getDaysAgo(paper.createdAt)} days ago
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full">
                      Pending Approval
                    </span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Approval Process</h4>
              <p className="text-sm text-blue-800">
                Your question papers are currently being reviewed by the Head of Department. 
                You will receive a notification once they are approved or if any changes are requested.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};