import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { demoUsers } from '../data/demoData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole, courseCode?: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('smartNotes_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email: string, _password: string): boolean => {
    const found = demoUsers.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('smartNotes_user', JSON.stringify(found));
      return true;
    }
    // Check localStorage for registered users
    const registered = JSON.parse(localStorage.getItem('smartNotes_registered') || '[]');
    const reg = registered.find((u: User) => u.email === email);
    if (reg) {
      setUser(reg);
      localStorage.setItem('smartNotes_user', JSON.stringify(reg));
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, _password: string, role: UserRole, courseCode?: string): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      courseCode,
    };
    const registered = JSON.parse(localStorage.getItem('smartNotes_registered') || '[]');
    registered.push(newUser);
    localStorage.setItem('smartNotes_registered', JSON.stringify(registered));
    setUser(newUser);
    localStorage.setItem('smartNotes_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartNotes_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
