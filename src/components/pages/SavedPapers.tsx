import React, { useState } from 'react';
import { FileText, Calendar, User, Eye, Edit3, Trash2, Search } from 'lucide-react';
import { QuestionPaper } from '../../types';

// Mock data
const mockSavedPapers: QuestionPaper[] = [
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
    status: 'draft'
  },
  {
    id: '2',
    title: 'Data Structures - SEE',
    subject: 'Computer Science',
    totalMarks: 100,
    examType: 'SEE',
    modulesCovered: 5,
    mainQuestions: [],
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-10'),
    status: 'draft'
  }
];

export const SavedPapers: React.FC = () => {
  const [papers, setPapers] = useState<QuestionPaper[]>(mockSavedPapers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'CIE' | 'SEE'>('all');

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || paper.examType === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setPapers(papers.filter(p => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Saved Question Papers</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'CIE' | 'SEE')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="CIE">CIE</option>
              <option value="SEE">SEE</option>
            </select>
          </div>
        </div>

        {filteredPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved papers found</h3>
            <p className="text-gray-500">Create your first question paper to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                      <p className="text-sm text-gray-500">{paper.subject}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    paper.examType === 'CIE' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {paper.examType}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {paper.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {paper.createdBy}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Marks: {paper.totalMarks} | Modules: {paper.modulesCovered}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    paper.status === 'draft' 
                      ? 'bg-gray-100 text-gray-800'
                      : paper.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {paper.status.charAt(0).toUpperCase() + paper.status.slice(1)}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(paper.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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