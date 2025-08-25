import React, { useState } from 'react';
import { CheckCircle, XCircle, Calendar, User, Eye, Edit3, MessageSquare } from 'lucide-react';
import { QuestionPaper } from '../../types';

// Mock data
const mockPapers: QuestionPaper[] = [
  {
    id: '1',
    title: 'Data Structures and Algorithms - CIE 1',
    subject: 'Computer Science',
    totalMarks: 100,
    examType: 'CIE',
    modulesCovered: 2,
    mainQuestions: [],
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-10'),
    status: 'approved',
    approvedBy: 'Dr. Jane Doe (HOD)',
    approvedAt: new Date('2024-01-12')
  },
  {
    id: '2',
    title: 'Operating Systems - SEE',
    subject: 'Computer Science',
    totalMarks: 100,
    examType: 'SEE',
    modulesCovered: 5,
    mainQuestions: [],
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-08'),
    status: 'rejected',
    rejectionReason: 'Questions need to be more balanced across modules. Please ensure equal distribution of difficulty levels.'
  }
];

export const ApprovedRejected: React.FC = () => {
  const [papers] = useState<QuestionPaper[]>(mockPapers);
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all');

  const filteredPapers = papers.filter(paper => {
    if (filter === 'all') return paper.status === 'approved' || paper.status === 'rejected';
    return paper.status === filter;
  });

  const approvedCount = papers.filter(p => p.status === 'approved').length;
  const rejectedCount = papers.filter(p => p.status === 'rejected').length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Approved / Rejected Papers</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">{approvedCount} Approved</span>
              </div>
              <div className="flex items-center">
                <XCircle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">{rejectedCount} Rejected</span>
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'approved' | 'rejected')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
          </div>
        </div>

        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No papers found</h3>
            <p className="text-gray-500">Approved and rejected papers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      paper.status === 'approved' 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}>
                      {paper.status === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{paper.title}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
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
                      
                      {paper.status === 'approved' && paper.approvedBy && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="font-medium">Approved by {paper.approvedBy}</span>
                          </div>
                          {paper.approvedAt && (
                            <p className="text-sm text-green-700 mt-1">
                              on {paper.approvedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {paper.status === 'rejected' && paper.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                          <div className="flex items-start">
                            <MessageSquare className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-red-800 mb-1">Rejection Reason:</p>
                              <p className="text-sm text-red-700">{paper.rejectionReason}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      paper.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {paper.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    {paper.status === 'rejected' && (
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};