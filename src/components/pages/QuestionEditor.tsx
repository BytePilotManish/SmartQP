import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, RefreshCw, Plus, Save, Send, FileText, AlertCircle, Contrast as DragDropContext, Droplet as Droppable, Cable as Draggable } from 'lucide-react';
import { Question, MainQuestion, SubQuestion } from '../../types';
import { useApp } from '../../contexts/AppContext';

// Mock data for demonstration
const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Explain the concept of object-oriented programming and its key principles.',
    module: 1,
    difficulty: 'medium',
    marks: 10,
    subject: 'Computer Science',
    createdAt: new Date()
  },
  {
    id: '2',
    text: 'What is inheritance in OOP? Provide examples.',
    module: 1,
    difficulty: 'easy',
    marks: 5,
    subject: 'Computer Science',
    createdAt: new Date()
  },
  {
    id: '3',
    text: 'Describe polymorphism and its types with suitable examples.',
    module: 2,
    difficulty: 'hard',
    marks: 15,
    subject: 'Computer Science',
    createdAt: new Date()
  }
];

export const QuestionEditor: React.FC = () => {
  const { questions: contextQuestions, setQuestions: setContextQuestions, uploadedFile } = useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionPaper, setQuestionPaper] = useState<MainQuestion[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [totalMarks, setTotalMarks] = useState(100);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  // Use extracted questions from context
  useEffect(() => {
    console.log('Context questions updated:', contextQuestions);
    if (contextQuestions && contextQuestions.length > 0) {
      console.log('Setting questions from context:', contextQuestions.length);
      setQuestions(contextQuestions);
    } else {
      console.log('No context questions available, setting empty array');
      setQuestions([]);
    }
  }, [contextQuestions]);

  const handleDeleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    setContextQuestions(updatedQuestions);
  };

  const handleEditQuestion = (id: string, newText: string) => {
    const updatedQuestions = questions.map(q =>
      q.id === id ? { ...q, text: newText } : q
    );
    setQuestions(updatedQuestions);
    setContextQuestions(updatedQuestions);
    setEditingQuestion(null);
  };

  const handleRephraseQuestion = (id: string) => {
    // Simulate AI rephrasing
    const question = questions.find(q => q.id === id);
    if (question) {
      const rephrasedText = `[Rephrased] ${question.text}`;
      handleEditQuestion(id, rephrasedText);
    }
  };

  const generateQuestionPaper = () => {
    // Generate paper following the structure rules
    const mainQuestions: MainQuestion[] = [
      {
        id: '1',
        text: 'Answer any ONE of the following:',
        marks: 25,
        module: 1,
        subQuestions: [
          { id: '1a', text: questions[0]?.text || '', marks: 25, module: 1 }
        ]
      },
      {
        id: '2',
        text: 'Answer any ONE of the following:',
        marks: 25,
        module: 1,
        subQuestions: [
          { id: '2a', text: questions[1]?.text || '', marks: 25, module: 1 }
        ]
      },
      {
        id: '3',
        text: 'Answer the following:',
        marks: 25,
        module: 2,
        subQuestions: [
          { id: '3a', text: questions[2]?.text || '', marks: 10, module: 2 },
          { id: '3b', text: 'Additional sub-question', marks: 10, module: 2 },
          { id: '3c', text: 'Third sub-question', marks: 5, module: 3 }
        ]
      },
      {
        id: '4',
        text: 'Answer the following:',
        marks: 25,
        module: 2,
        subQuestions: [
          { id: '4a', text: 'First sub-question', marks: 10, module: 2 },
          { id: '4b', text: 'Second sub-question', marks: 10, module: 2 },
          { id: '4c', text: 'Third sub-question', marks: 5, module: 3 }
        ]
      }
    ];
    
    setQuestionPaper(mainQuestions);
    setShowGenerateModal(false);
  };

  return (
    <div className="flex h-full space-x-6">
      {/* Left Pane - Parsed Questions */}
      <div className="w-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Question Bank</h2>
            {uploadedFile && (
              <div className="flex items-center mt-2 text-sm text-blue-600">
                <FileText className="w-4 h-4 mr-1" />
                <span>File: {uploadedFile.name}</span>
              </div>
            )}
            <div className="text-sm text-gray-600 mt-1">
              Context Questions: {contextQuestions.length} | Local Questions: {questions.length}
            </div>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Question Paper
            </button>
            <button
              onClick={() => {
                console.log('Debug - Context Questions:', contextQuestions);
                console.log('Debug - Local Questions:', questions);
                console.log('Debug - Uploaded File:', uploadedFile);
              }}
              className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Debug
            </button>
          </div>
        </div>

        {/* Show message if no questions available */}
        {questions.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No questions available</p>
            <p className="text-gray-400 text-sm">
              Upload a PDF file with numbered questions to get started.
              <br />
              Questions should be numbered (1., 2., 3., etc.) and include CO, Level, and Marks information.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Module {question.module}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                    {question.marks} marks
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRephraseQuestion(question.id)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Rephrase"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingQuestion(question.id)}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {editingQuestion === question.id ? (
                <div className="space-y-2">
                  <textarea
                    defaultValue={question.text}
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                    rows={3}
                    onBlur={(e) => handleEditQuestion(question.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        handleEditQuestion(question.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">{question.text}</p>
              )}
            </div>
          ))}
          
          <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
            <Plus className="w-5 h-5 mx-auto mb-2" />
            Add New Question
          </button>
        </div>
      </div>

      {/* Right Pane - Question Paper Preview */}
      <div className="w-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Paper Preview</h2>
          <FileText className="w-6 h-6 text-gray-600" />
        </div>

        {questionPaper.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Generate a question paper to see the preview</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Paper Header */}
            <div className="text-center border-b border-gray-200 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Computer Science Engineering</h3>
              <p className="text-gray-600">Continuous Internal Evaluation (CIE)</p>
              <p className="text-gray-600">Total Marks: {totalMarks}</p>
              <p className="text-gray-600">Time: 3 Hours</p>
            </div>

            {/* Questions */}
            {questionPaper.map((mainQ, index) => (
              <div key={mainQ.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">
                    Q{index + 1}. {mainQ.text} ({mainQ.marks} Marks)
                  </h4>
                  <div className="flex space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 ml-4">
                  {mainQ.subQuestions.map((subQ, subIndex) => (
                    <div key={subQ.id} className="flex items-start justify-between">
                      <p className="text-gray-700">
                        {String.fromCharCode(97 + subIndex)}. {subQ.text} ({subQ.marks} marks)
                      </p>
                      <div className="flex space-x-1 ml-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <Save className="w-5 h-5 mr-2" />
                Save Question Paper
              </button>
              <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Save Scheme Format
              </button>
              <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                <Send className="w-5 h-5 mr-2" />
                Send for Approval
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Question Paper</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generateQuestionPaper}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};