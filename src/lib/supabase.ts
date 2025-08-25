import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create client even with placeholder values to prevent app crash
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl && supabaseAnonKey;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'faculty' | 'hod';
          department: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role: 'faculty' | 'hod';
          department: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: 'faculty' | 'hod';
          department?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      question_papers: {
        Row: {
          id: string;
          title: string;
          subject: string;
          total_marks: number;
          exam_type: 'CIE' | 'SEE';
          modules_covered: number;
          questions: any;
          created_by: string;
          created_at: string;
          updated_at: string;
          status: 'draft' | 'sent_for_approval' | 'approved' | 'rejected';
          rejection_reason?: string;
          approved_by?: string;
          approved_at?: string;
        };
        Insert: {
          id?: string;
          title: string;
          subject: string;
          total_marks: number;
          exam_type: 'CIE' | 'SEE';
          modules_covered: number;
          questions: any;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'sent_for_approval' | 'approved' | 'rejected';
          rejection_reason?: string;
          approved_by?: string;
          approved_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subject?: string;
          total_marks?: number;
          exam_type?: 'CIE' | 'SEE';
          modules_covered?: number;
          questions?: any;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'draft' | 'sent_for_approval' | 'approved' | 'rejected';
          rejection_reason?: string;
          approved_by?: string;
          approved_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'approval' | 'rejection';
          message: string;
          question_paper_id: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'approval' | 'rejection';
          message: string;
          question_paper_id: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'approval' | 'rejection';
          message?: string;
          question_paper_id?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
};