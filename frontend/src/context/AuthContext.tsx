import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'agent' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string, role?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { access, user: userData } = response.data;

      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    role: string = 'customer'
  ) => {
    try {
      // IMPORTANT: Django requires password2
      await api.post('/auth/register/', {
        name,
        email,
        password,
        password2: confirmPassword,
        role,
      });

      // no auto-login because backend does NOT return token here
    } catch (error: any) {
      throw new Error(
        error.response?.data?.password ||
        error.response?.data?.email ||
        error.response?.data?.detail ||
        'Registration failed'
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
