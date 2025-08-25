import React, { useState } from 'react';
import { Layout, Calendar, User, Eye, Edit3, Trash2, Search, Plus } from 'lucide-react';
import { QuestionPaperScheme } from '../../types';

// Mock data
const mockSchemes: QuestionPaperScheme[] = [
  {
    id: '1',
    title: 'Standard CIE Format - 4 Questions',
    structure: {
      totalMarks: 100,
      mainQuestions: [
        { marks: 25, subQuestions: [{ marks: 25 }] },
        { marks: 25, subQuestions: [{ marks: 25 }] },
        { marks: 25, subQuestions: [{ marks: 10 }, { marks: 10 }, { marks: 5 }] },
        { marks: 25, subQuestions: [{ marks: 10 }, { marks: 10 }, { marks: 5 }] }
      ]
    },
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'SEE Format - 5 Questions',
    structure: {
      totalMarks: 100,
      mainQuestions: [
        { marks: 20, subQuestions: [{ marks: 20 }] },
        { marks: 20, subQuestions: [{ marks: 20 }] },
        { marks: 20, subQuestions: [{ marks: 20 }] },
        { marks: 20, subQuestions: [{ marks: 20 }] },
        { marks: 20, subQuestions: [{ marks: 20 }] }
      ]
    },
    createdBy: 'Dr. John Smith',
    createdAt: new Date('2024-01-10')
  }
];

export const SavedSchemes: React.FC = () => {
  const [schemes, setSchemes] = useState<QuestionPaperScheme[]>(mockSchemes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredSchemes = schemes.filter(scheme =>
    scheme.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setSchemes(schemes.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Saved Question Paper Schemes</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Scheme
            </button>
          </div>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="text-center py-12">
            <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved schemes found</h3>
            <p className="text-gray-500">Create your first question paper scheme to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <div key={scheme.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Layout className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{scheme.title}</h3>
                      <p className="text-sm text-gray-500">Total: {scheme.structure.totalMarks} marks</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600">
                    <strong>Structure:</strong>
                  </div>
                  {scheme.structure.mainQuestions.map((q, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Question {index + 1}</span>
                        <span className="text-sm text-gray-600">{q.marks} marks</span>
                      </div>
                      {q.subQuestions.length > 1 && (
                        <div className="text-xs text-gray-500 space-y-1">
                          {q.subQuestions.map((sub, subIndex) => (
                            <div key={subIndex} className="flex justify-between">
                              <span>Sub-question {String.fromCharCode(97 + subIndex)}</span>
                              <span>{sub.marks} marks</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {scheme.createdAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    {scheme.createdBy}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(scheme.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Scheme</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheme Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter scheme title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};