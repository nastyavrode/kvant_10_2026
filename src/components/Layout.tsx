import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, FileText, Brain, BarChart3, LogOut, Menu, X,
  GraduationCap, Search, ChevronRight, Sparkles, Sun, Moon, Palette
} from 'lucide-react';
import StreakBadge from './StreakBadge';

interface LayoutProps { children: React.ReactNode; }

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { course } = useData();
  const { theme, toggleTheme } = useTheme();
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
    { id: 'design', label: 'Дизайн', icon: Palette, path: '/design' },
  ];

  const teacherMenu = [
    { id: 'dashboard', label: 'Главная', icon: BookOpen, path: '/' },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3, path: '/analytics' },
    { id: 'notes', label: 'Конспекты', icon: FileText, path: '/notes' },
    { id: 'topics', label: 'Темы курса', icon: GraduationCap, path: '/topics' },
    { id: 'official', label: 'Материалы', icon: Sparkles, path: '/official' },
    { id: 'design', label: 'Дизайн', icon: Palette, path: '/design' },
  ];

  const menu = user?.role === 'teacher' ? teacherMenu : studentMenu;

  const handleNavigation = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ width: '280px' }}>
        <div className="uni-sidebar h-full flex flex-col relative">
          {/* Logo */}
          <div className="p-6 relative z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
                <GraduationCap className="w-6 h-6" style={{ color: '#FBBF24' }} />
              </div>
              <div>
                <h1 className="font-bold text-white text-lg" style={{ fontFamily: 'var(--font-display)' }}>Умный конспект</h1>
                <p className="text-xs text-emerald-200/70">{course.code}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 relative z-10">
            {menu.map(item => {
              const isActive = currentView === item.id || (item.id === 'dashboard' && (currentView === '' || currentView === 'dashboard'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
                    borderLeft: isActive ? '3px solid #FBBF24' : '3px solid transparent',
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {user?.role === 'student' && (
              <div className="mb-3 flex justify-center">
                <StreakBadge />
              </div>
            )}
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-emerald-200/60">
                  {user?.role === 'teacher' ? 'Преподаватель' : 'Студент'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
              <button onClick={logout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgba(252, 165, 165, 0.9)' }}>
                <LogOut className="w-4 h-4" /> Выйти
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 px-4 lg:px-8 py-4" style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg" style={{ backgroundColor: 'var(--color-light-bg)' }}>
              {sidebarOpen ? <X className="w-5 h-5" style={{ color: 'var(--color-text)' }} /> : <Menu className="w-5 h-5" style={{ color: 'var(--color-text)' }} />}
            </button>
            <div className="flex-1">
              <p className="section-label mb-0.5">{course.name}</p>
              <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {menu.find(m => m.id === currentView)?.label || 'Главная'}
              </h2>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export { Layout };
