import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, FileText, Brain, BarChart3, LogOut, Menu, X,
  GraduationCap, Search, Plus, ChevronRight, Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { course } = useData();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentView = location.pathname === '/' ? 'dashboard' : location.pathname.slice(1);

  const studentMenu = [
    { id: 'dashboard', label: 'Главная', icon: BookOpen, path: '/' },
    { id: 'notes', label: 'Мои конспекты', icon: FileText, path: '/notes' },
    { id: 'shared', label: 'Общие конспекты', icon: GraduationCap, path: '/shared' },
    { id: 'quiz', label: 'Самопроверка', icon: Brain, path: '/quiz' },
    { id: 'search', label: 'Поиск', icon: Search, path: '/search' },
  ];

  const teacherMenu = [
    { id: 'dashboard', label: 'Главная', icon: BookOpen, path: '/' },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3, path: '/analytics' },
    { id: 'notes', label: 'Конспекты курса', icon: FileText, path: '/notes' },
    { id: 'topics', label: 'Темы курса', icon: GraduationCap, path: '/topics' },
    { id: 'official', label: 'Материалы', icon: Sparkles, path: '/official' },
  ];

  const menu = user?.role === 'teacher' ? teacherMenu : studentMenu;

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Умный конспект</h1>
                <p className="text-xs text-gray-500">{course.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menu.map(item => {
              const isActive = currentView === item.id || (item.id === 'dashboard' && (currentView === '' || currentView === 'dashboard'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'teacher' ? '👨‍🏫 Преподаватель' : '👨‍🎓 Студент'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" /> Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {menu.find(m => m.id === currentView)?.label || 'Главная'}
              </h2>
            </div>
            {user?.role === 'student' && currentView === 'notes' && (
              <button
                onClick={() => handleNavigation('/notes')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Новый конспект
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export { Layout };
