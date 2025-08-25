import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  onSwitchToRegister, 
  onSwitchToForgotPassword 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const validateEmail = (email: string): boolean => {
    return email.endsWith('@skit.org.in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    const success = await login(email, password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - College branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <img 
          src="/public/WhatsApp Image 2025-08-19 at 12.24.05_988bae3d.jpg" 
          alt="College Campus" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="flex items-center mb-8">
            <GraduationCap className="w-16 h-16 mr-4" />
            <div>
              <h1 className="text-4xl font-bold">SmartQPGen</h1>
              <p className="text-xl opacity-90">Intelligent Question Paper Generator</p>
            </div>
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Welcome Back</h2>
            <p className="text-lg opacity-90">
              Generate, manage, and approve question papers with ease.
              Streamline your academic workflow today.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <GraduationCap className="w-12 h-12 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">SmartQPGen</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your question paper dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKIT Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="username@skit.org.in"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Demo Credentials (After Supabase Setup):</p>
                <div className="space-y-1">
                  <p><strong>Faculty Login:</strong> faculty@skit.org.in / password123</p>
                  <p><strong>HOD Login:</strong> hod@skit.org.in / password123</p>
                </div>
                <p className="text-xs mt-2 text-blue-600">Click "Connect to Supabase" in top-right to set up database</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <button
                onClick={onSwitchToForgotPassword}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Forgot your password?
              </button>
              
              <div className="border-t border-gray-200 pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={onSwitchToRegister}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};