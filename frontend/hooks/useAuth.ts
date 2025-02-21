import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { User } from '@/types/api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: 'BUYER' | 'SELLER';
  companyName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  address?: string;
  companyWebsite?: string;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      const user:any = await authApi.getCurrentUser();
      setState({ user, loading: false, error: null });
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setState({ user: null, loading: false, error: 'Authentication failed' });
    }
  };

  const login = async ({ email, password }: LoginData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response:any = await authApi.login({ email, password });
      localStorage.setItem('token', response.token);
      setState({ user: response.user, loading: false, error: null });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response:any  = await authApi.signup(data);
      localStorage.setItem('token', response.token);
      setState({ user: response.user, loading: false, error: null });
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Signup failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setState({ user: null, loading: false, error: null });
  };

  const generateOTP = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.generateOTP(email);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to generate OTP';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.verifyOTP({ email, otp });
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to verify OTP';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.forgotPassword(email);
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to process password reset';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await authApi.resetPassword({ token, newPassword });
      setState(prev => ({ ...prev, loading: false }));
      return response;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to reset password';
      setState(prev => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    signup,
    logout,
    generateOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    checkAuth,
  };
} 