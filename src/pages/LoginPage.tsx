import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { BookOpen, GraduationCap, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const { login, register } = useAuth();
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
      if (!name || !email || !password) {
        setError('Заполните все поля');
        return;
      }
      register(name, email, password, role, courseCode);
    } else {
      if (!email || !password) {
        setError('Введите email и пароль');
        return;
      }
      const success = login(email, password);
      if (!success) {
        setError('Неверный email или пароль. Используйте демо-аккаунты.');
      }
    }
  };

  const fillDemo = (type: 'student' | 'teacher') => {
    if (type === 'student') {
      setEmail('student@university.ru');
      setPassword('demo123');
    } else {
      setEmail('professor@university.ru');
      setPassword('demo123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, var(--color-background) 0%, var(--color-surface) 50%, #EDE9FE 100%)` }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: 'var(--color-primary)' }}>
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Умный конспект</h1>
          <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Цифровой сервис для учебных материалов</p>
        </div>

        <div className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
          <div className="flex mb-6 p-1 rounded-lg" style={{ backgroundColor: 'var(--color-neutral-100)' }}>
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isRegister ? 'shadow' : ''}`}
              style={{
                backgroundColor: !isRegister ? 'var(--color-surface)' : 'transparent',
                color: !isRegister ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <LogIn className="w-4 h-4 inline mr-1" /> Вход
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isRegister ? 'shadow' : ''}`}
              style={{
                backgroundColor: isRegister ? 'var(--color-surface)' : 'transparent',
                color: isRegister ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <UserPlus className="w-4 h-4 inline mr-1" /> Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full outline-none transition"
                    style={{ padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Роль</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition"
                      style={{
                        border: role === 'student' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        backgroundColor: role === 'student' ? '#EEF2FF' : 'transparent',
                        color: role === 'student' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      <GraduationCap className="w-4 h-4 inline mr-1" /> Студент
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition"
                      style={{
                        border: role === 'teacher' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                        backgroundColor: role === 'teacher' ? '#EEF2FF' : 'transparent',
                        color: role === 'teacher' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      <BookOpen className="w-4 h-4 inline mr-1" /> Преподаватель
                    </button>
                  </div>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Код курса</label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={e => setCourseCode(e.target.value)}
                      className="w-full outline-none transition"
                      style={{ padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                      placeholder="CS2024"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full outline-none transition"
                style={{ padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                placeholder="email@university.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full outline-none transition"
                style={{ padding: '10px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--rounded-md)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: 'var(--color-primary)', color: '#FFFFFF', boxShadow: 'var(--shadow-md)' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-xs mb-3 text-center" style={{ color: 'var(--color-text-secondary)' }}>Демо-аккаунты:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fillDemo('student')}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition"
                  style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)')}
                >
                  👨‍🎓 Студент
                </button>
                <button
                  onClick={() => fillDemo('teacher')}
                  className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition"
                  style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-700)' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--color-neutral-200)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)')}
                >
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
