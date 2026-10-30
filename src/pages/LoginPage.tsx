import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserRole } from '../types';
import { GraduationCap, BookOpen, Sun, Moon, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [courseCode, setCourseCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      if (!name || !email || !password) { setError('Заполните все поля'); return; }
      register(name, email, password, role, courseCode);
    } else {
      if (!email || !password) { setError('Введите email и пароль'); return; }
      const success = login(email, password);
      if (!success) setError('Неверный email или пароль');
    }
  };

  const fillDemo = (type: 'student' | 'teacher') => {
    setEmail(type === 'student' ? 'student@university.ru' : 'professor@university.ru');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #064E3B 0%, #065F46 40%, #047857 100%)' }}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h80v80H0V0zm20 20v40h40V20H20zm20 50a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FBBF24, transparent)' }} />
        <div className="absolute bottom-32 right-16 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #34D399, transparent)' }} />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Умный конспект</h1>
              <p className="text-emerald-200 text-sm mt-0.5">Smart Notes Platform</p>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold leading-tight mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Начните своё<br />
            <span style={{ color: '#FBBF24' }}>академическое</span><br />
            путешествие
          </h2>
          
          <p className="text-emerald-100 text-lg leading-relaxed mb-10 max-w-md">
            Объединяйте конспекты, проходите ИИ-тесты и отслеживайте прогресс — всё в одном месте.
          </p>
          
          <div className="space-y-4">
            {['Блочный редактор с Markdown', 'ИИ-генерация вопросов', 'Аналитика для преподавателей'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)' }}>
                  <CheckCircle2 className="w-4 h-4" style={{ color: '#FBBF24' }} />
                </div>
                <span className="text-emerald-50">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Theme toggle */}
          <div className="flex justify-end mb-8">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full transition"
              style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-text-secondary)' }}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Умный конспект</h1>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Smart Notes Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <p className="section-label mb-2">Добро пожаловать</p>
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              {isRegister ? 'Создайте аккаунт' : 'Войдите в систему'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {isRegister ? 'Присоединяйтесь к нашему академическому сообществу' : 'Продолжите работу с вашими конспектами'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Имя</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="uni-input w-full" placeholder="Ваше имя" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Роль</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setRole('student')}
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition border-2"
                      style={{
                        borderColor: role === 'student' ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: role === 'student' ? 'var(--color-light-bg)' : 'transparent',
                        color: role === 'student' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}>
                      👨‍🎓 Студент
                    </button>
                    <button type="button" onClick={() => setRole('teacher')}
                      className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition border-2"
                      style={{
                        borderColor: role === 'teacher' ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: role === 'teacher' ? 'var(--color-light-bg)' : 'transparent',
                        color: role === 'teacher' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}>
                      👨‍🏫 Преподаватель
                    </button>
                  </div>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Код курса</label>
                    <input type="text" value={courseCode} onChange={e => setCourseCode(e.target.value)} className="uni-input w-full" placeholder="CS2024" />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="uni-input w-full" placeholder="email@university.ru" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Пароль</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="uni-input w-full" placeholder="••••••••" />
            </div>

            <button type="submit" className="btn-primary w-full justify-center mt-2">
              {isRegister ? 'Создать аккаунт' : 'Войти'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm font-medium transition" style={{ color: 'var(--color-primary-bright)' }}>
              {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-xs text-center mb-3 font-medium" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Демо-доступ</p>
              <div className="flex gap-3">
                <button onClick={() => fillDemo('student')} className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-light-bg)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  👨‍🎓 Студент
                </button>
                <button onClick={() => fillDemo('teacher')} className="flex-1 py-3 px-4 rounded-xl text-sm font-medium transition border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.backgroundColor = 'var(--color-light-bg)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  👨‍🏫 Преподаватель
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
