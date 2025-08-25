import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { NotificationToast } from './components/ui/NotificationToast';
import './test/testPdfProcessor'; // Import test for browser console access

type AuthView = 'login' | 'register' | 'forgot-password';

const AuthWrapper: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const { user, isLoading } = useAuth();

  // Only show loading if Supabase is configured and we're actually loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <AppProvider>
        <Dashboard />
        <NotificationToast />
      </AppProvider>
    );
  }

  switch (currentView) {
    case 'register':
      return <RegisterPage onSwitchToLogin={() => setCurrentView('login')} />;
    case 'forgot-password':
      return <ForgotPasswordPage onSwitchToLogin={() => setCurrentView('login')} />;
    default:
      return (
        <LoginPage
          onSwitchToRegister={() => setCurrentView('register')}
          onSwitchToForgotPassword={() => setCurrentView('forgot-password')}
        />
      );
  }
};

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

export default App;