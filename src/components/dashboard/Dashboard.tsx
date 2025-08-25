import React from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { MainContent } from './MainContent';
import { useApp } from '../../contexts/AppContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { sidebarOpen } = useApp();
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background college image */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="College Campus"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-white/80"></div>
      </div>
      
      <div className="relative z-10 flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          {!supabaseConfigured && (
            <div className="bg-orange-50 border-b border-orange-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Database className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-orange-900">Database Connection Required</h3>
                    <p className="text-sm text-orange-700">Connect to Supabase to enable full functionality including authentication and data storage.</p>
                  </div>
                </div>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Connect to Supabase
                </button>
              </div>
            </div>
          )}
          <MainContent />
        </div>
      </div>
    </div>
  );
};