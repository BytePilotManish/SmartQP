import React, { useState } from 'react';
import { Upload, FileText, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { pdfProcessor } from '../../utils/pdfProcessor';

export const NewQuestionPaper: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { setCurrentPage, processUploadedFile, isProcessingFile, setQuestions } = useApp();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateQuestions = async () => {
    if (selectedFile) {
      try {
        console.log('NewQuestionPaper: Starting to process file:', selectedFile.name);
        await processUploadedFile(selectedFile);
        console.log('NewQuestionPaper: File processed successfully, navigating to editor');
        setCurrentPage('question-editor');
      } catch (error) {
        console.error('NewQuestionPaper: Error processing file:', error);
        // Error handling is done in processUploadedFile
      }
    }
  };

  // Test function to create mock questions without PDF
  const handleTestWithMockQuestions = () => {
    console.log('Creating test questions...');
    // This will help us test if the context is working
    const testQuestions = [
      {
        id: 'test_1',
        text: 'Test question 1: Explain the concept of algorithms.',
        module: 1,
        difficulty: 'medium' as const,
        marks: 8,
        subject: 'Computer Science',
        createdAt: new Date()
      },
      {
        id: 'test_2',
        text: 'Test question 2: What is data structure?',
        module: 2,
        difficulty: 'easy' as const,
        marks: 5,
        subject: 'Computer Science',
        createdAt: new Date()
      }
    ];

    // Manually set questions in context for testing
    setQuestions(testQuestions);
    setCurrentPage('question-editor');
  };

  // Test function to test PDF parsing without actual PDF
  const handleTestPdfParsing = () => {
    console.log('Testing PDF parsing...');

    const sampleText = `
SL# Question CO Level Marks
1. Define algorithm. Explain asymptotic notations Big Oh, Big Omega and Big Theta notations. CO1 L2 08
2. Explain the general plan for analyzing the efficiency of recursive algorithm. CO1 L2 08
3. Explain general plan of mathematical analysis of non-recursive algorithms. CO1 L2 08
    `;

    try {
      const extractedQuestions = pdfProcessor.parseQuestions(sampleText);
      console.log('Extracted questions:', extractedQuestions);

      const questions = pdfProcessor.convertToQuestions(extractedQuestions);
      console.log('Converted questions:', questions);

      setQuestions(questions);
      setCurrentPage('question-editor');
    } catch (error) {
      console.error('PDF parsing test failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Question Paper</h1>
          <p className="text-gray-600">Upload your question bank to get started</p>
        </div>

        {/* File Upload Section */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : selectedFile
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your question bank file here
                  </p>
                  <p className="text-gray-500 mb-4">or</p>
                  <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 mr-2" />
                    Browse Files
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: TXT, DOC, DOCX, PDF
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Question Bank Format Guidelines</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Each question should be on a separate line</li>
                <li>• Include module numbers and difficulty levels if available</li>
                <li>• Specify marks for each question</li>
                <li>• Use clear, concise language</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center space-y-4">
          <button
            onClick={handleGenerateQuestions}
            disabled={!selectedFile || isProcessingFile}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium text-lg"
          >
            {isProcessingFile ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing PDF...
              </>
            ) : (
              <>
                Generate Questions
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>

          {/* Test Buttons for debugging */}
          <div className="space-y-2">
            <div>
              <button
                onClick={handleTestWithMockQuestions}
                className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm mr-2"
              >
                Test with Sample Questions
              </button>
              <button
                onClick={handleTestPdfParsing}
                className="inline-flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium text-sm"
              >
                Test PDF Parsing
              </button>
            </div>
            <p className="text-xs text-gray-500">
              For testing - creates sample questions without PDF
            </p>
          </div>

          {isProcessingFile && (
            <p className="text-sm text-gray-600 mt-2">
              Extracting questions from your PDF file. This may take a moment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};