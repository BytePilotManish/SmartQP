import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Upload, 
  Send, 
  CheckCircle,
  MessageCircle,
  Mail,
  Phone
} from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: 'How do I create a new question paper?',
    answer: 'To create a new question paper, click on "New Question Paper" in the sidebar, upload your question bank file, and click "Generate Questions". You can then edit and customize your paper in the two-pane editor.',
    category: 'Getting Started'
  },
  {
    id: 2,
    question: 'What file formats are supported for question banks?',
    answer: 'SmartQPGen supports TXT, DOC, DOCX, and PDF file formats. Make sure each question is on a separate line with clear formatting.',
    category: 'File Upload'
  },
  {
    id: 3,
    question: 'How does the approval process work?',
    answer: 'After creating a question paper, you can send it for approval. The paper goes to your Head of Department who can either approve or reject it with feedback. You\'ll receive notifications about the status.',
    category: 'Approval Process'
  },
  {
    id: 4,
    question: 'Can I edit a rejected question paper?',
    answer: 'Yes, rejected papers appear in the "Approved / Rejected" section. You can click on them to open the editor, make changes, and resubmit for approval.',
    category: 'Editing'
  },
  {
    id: 5,
    question: 'What is a question paper scheme?',
    answer: 'A scheme is a template that defines the structure of your question paper (number of questions, marks distribution, sub-questions) without the actual question content. You can save and reuse schemes.',
    category: 'Schemes'
  }
];

const guides = [
  {
    id: 1,
    title: 'Getting Started with SmartQPGen',
    description: 'Learn the basics of creating your first question paper',
    icon: FileText,
    steps: [
      'Create your account and log in',
      'Upload your question bank',
      'Generate and customize your paper',
      'Save or send for approval'
    ]
  },
  {
    id: 2,
    title: 'Question Paper Structure Rules',
    description: 'Understand the formatting requirements',
    icon: Upload,
    steps: [
      '4 Main Questions (25 marks each)',
      'Q1 & Q2 from same module with OR',
      'Q3 & Q4 with mixed module sub-questions',
      'Total 100 marks distribution'
    ]
  },
  {
    id: 3,
    title: 'Approval Workflow',
    description: 'How the review process works',
    icon: Send,
    steps: [
      'Submit paper for approval',
      'HOD reviews the paper',
      'Receive approval or feedback',
      'Make changes if needed and resubmit'
    ]
  }
];

export const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
        <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600">Find answers to common questions and get help with SmartQPGen</p>
      </div>

      {/* Quick Start Guides */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <div key={guide.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">{guide.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{guide.description}</p>
                <ul className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <span className="text-sm text-blue-600">{faq.category}</span>
                </div>
                {expandedFaq === faq.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-4 pb-4 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>
          
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get help via email</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Send Email
            </button>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <Phone className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us for immediate help</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};