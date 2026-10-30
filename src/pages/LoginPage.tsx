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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Умный конспект</h1>
          <p className="text-gray-500 mt-2">Цифровой сервис для учебных материалов</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isRegister ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <LogIn className="w-4 h-4 inline mr-1" /> Вход
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isRegister ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
            >
              <UserPlus className="w-4 h-4 inline mr-1" /> Регистрация
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    placeholder="Ваше имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition ${role === 'student' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                    >
                      <GraduationCap className="w-4 h-4 inline mr-1" /> Студент
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition ${role === 'teacher' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500'}`}
                    >
                      <BookOpen className="w-4 h-4 inline mr-1" /> Преподаватель
                    </button>
                  </div>
                </div>
                {role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Код курса</label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={e => setCourseCode(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="CS2024"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="email@university.ru"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </form>

          {!isRegister && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 text-center">Демо-аккаунты:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => fillDemo('student')}
                  className="flex-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition"
                >
                  👨‍🎓 Студент
                </button>
                <button
                  onClick={() => fillDemo('teacher')}
                  className="flex-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 transition"
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
