import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'faculty' | 'hod';
  department: string;
  created_at: string;
  updated_at: string;
}

interface AuthUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { email: string; password: string; fullName: string; role: 'faculty' | 'hod'; department: string }) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Supabase is not configured, set loading to false and return
    if (!isSupabaseConfigured()) {
      return;
    }

    setIsLoading(true);
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email: string): boolean => {
    return email.endsWith('@skit.org.in');
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Please connect to Supabase first using the button in the top-right corner');
      setIsLoading(false);
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please use your SKIT college email (@skit.org.in)');
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: { email: string; password: string; fullName: string; role: 'faculty' | 'hod'; department: string }): Promise<boolean> => {
    setError(null);
    setIsLoading(true);
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Please connect to Supabase first using the button in the top-right corner');
      setIsLoading(false);
      return false;
    }

    if (!validateEmail(userData.email)) {
      setError('Please use your SKIT college email (@skit.org.in)');
      setIsLoading(false);
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: userData.email,
            full_name: userData.fullName,
            role: userData.role,
            department: userData.department,
          });

        if (profileError) throw profileError;
        
        setUser(data.user);
        await fetchProfile(data.user.id);
      }
      
      return true;
    } catch (error: any) {
      setError(error.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setError(null);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    setError(null);
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Please connect to Supabase first using the button in the top-right corner');
      return false;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return true;
    } catch (error: any) {
      setError(error.message || 'Password reset failed');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      forgotPassword,
      isLoading,
      profile,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};