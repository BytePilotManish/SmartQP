import React from 'react';
import { 
  FileText, 
  Save, 
  Layout, 
  Send, 
  CheckCircle, 
  Settings, 
  HelpCircle,
  Plus,
  X,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, currentPage, setCurrentPage } = useApp();
  const { profile } = useAuth();

  const facultyMenuItems = [
    { id: 'new-question-paper', label: 'New Question Paper', icon: Plus, color: 'text-green-600' },
    { id: 'saved-papers', label: 'Saved Question Papers', icon: Save, color: 'text-blue-600' },
    { id: 'saved-schemes', label: 'Saved Schemes', icon: Layout, color: 'text-purple-600' },
    { id: 'sent-for-approval', label: 'Sent for Approval', icon: Send, color: 'text-orange-600' },
    { id: 'approved-rejected', label: 'Approved / Rejected', icon: CheckCircle, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
    { id: 'help', label: 'Help', icon: HelpCircle, color: 'text-gray-600' },
  ];

  const hodMenuItems = [
    { id: 'approval-dashboard', label: 'Approval Dashboard', icon: UserCheck, color: 'text-blue-600' },
    { id: 'approved-rejected', label: 'Approved / Rejected', icon: CheckCircle, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
    { id: 'help', label: 'Help', icon: HelpCircle, color: 'text-gray-600' },
  ];

  const menuItems = profile?.role === 'hod' ? hodMenuItems : facultyMenuItems;

  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`p-3 rounded-lg transition-all hover:bg-gray-100 ${
                currentPage === item.id ? 'bg-blue-50 border border-blue-200' : ''
              }`}
              title={item.label}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-gray-900">SmartQPGen</h2>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all hover:bg-gray-50 ${
                currentPage === item.id 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${
                currentPage === item.id ? 'text-blue-600' : item.color
              }`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          SmartQPGen v1.0
        </div>
      </div>
    </div>
  );
};