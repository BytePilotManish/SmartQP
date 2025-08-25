import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Calendar, User, Eye, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

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
  creator_profile?: {
    full_name: string;
    email: string;
  };
}

export const ApprovalDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (profile?.role === 'hod') {
      fetchPendingPapers();
    }
  }, [profile]);

  const fetchPendingPapers = async () => {
    try {
      const { data, error } = await supabase
        .from('question_papers')
        .select(`
          *,
          creator_profile:profiles!question_papers_created_by_fkey(full_name, email)
        `)
        .eq('status', 'sent_for_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paperId: string) => {
    try {
      const { error } = await supabase
        .from('question_papers')
        .update({
          status: 'approved',
          approved_by: profile?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', paperId);

      if (error) throw error;

      // Create notification
      const paper = papers.find(p => p.id === paperId);
      if (paper) {
        await supabase
          .from('notifications')
          .insert({
            user_id: paper.created_by,
            type: 'approval',
            message: `Your question paper "${paper.title}" has been approved by ${profile?.full_name}`,
            question_paper_id: paperId,
          });
      }

      fetchPendingPapers();
    } catch (error) {
      console.error('Error approving paper:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedPaper || !rejectionReason.trim()) return;

    try {
      const { error } = await supabase
        .from('question_papers')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
        })
        .eq('id', selectedPaper.id);

      if (error) throw error;

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedPaper.created_by,
          type: 'rejection',
          message: `Your question paper "${selectedPaper.title}" has been rejected. Reason: ${rejectionReason}`,
          question_paper_id: selectedPaper.id,
        });

      setShowRejectModal(false);
      setSelectedPaper(null);
      setRejectionReason('');
      fetchPendingPapers();
    } catch (error) {
      console.error('Error rejecting paper:', error);
    }
  };

  if (profile?.role !== 'hod') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only HODs can access the approval dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Approval Dashboard</h1>
          <div className="flex items-center text-sm text-gray-600">
            <Send className="w-4 h-4 mr-2" />
            {papers.length} papers pending approval
          </div>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending approvals</h3>
            <p className="text-gray-500">All question papers have been reviewed</p>
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
                          {paper.creator_profile?.full_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(paper.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            paper.exam_type === 'CIE' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {paper.exam_type}
                          </span>
                        </div>
                        <div>
                          Subject: {paper.subject}
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600">
                        Total Marks: {paper.total_marks} | Modules: {paper.modules_covered}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleApprove(paper.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaper(paper);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && selectedPaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Question Paper</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedPaper.title}"
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Enter rejection reason..."
              required
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedPaper(null);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};