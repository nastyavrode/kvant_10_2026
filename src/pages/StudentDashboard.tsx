import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FileText, Brain, Trophy, TrendingUp, BookOpen, Clock, Flame } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getMyNotes, quizResults, course } = useData();
  const myNotes = getMyNotes();
  const myResults = quizResults.filter(r => r.userId === user?.id);

  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / myResults.length)
    : 0;

  const stats = [
    { label: 'Конспектов', value: myNotes.length, icon: FileText, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Тестов пройдено', value: myResults.length, icon: Brain, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Средний балл', value: `${avgScore}%`, icon: Trophy, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
    { label: 'Тем в курсе', value: course.topics.length, icon: BookOpen, color: 'bg-green-500', bgColor: 'bg-green-50' },
  ];

  const recentNotes = [...myNotes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const recentResults = [...myResults].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">Привет, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-indigo-100 text-lg">Продолжайте учиться и создавать конспекты. Вы на верном пути!</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-indigo-200">
              <Clock className="w-4 h-4" />
              Курс: {course.name} • Код: {course.code}
            </div>
          </div>
          <StreakBadge />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent notes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" /> Последние конспекты
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {recentNotes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Пока нет конспектов</p>
            ) : (
              recentNotes.map(note => (
                <div key={note.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent quiz results */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" /> Результаты тестов
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {recentResults.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Пока нет результатов</p>
            ) : (
              recentResults.map(result => {
                const topic = course.topics.find(t => t.id === result.topicId);
                const percent = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <div key={result.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      percent >= 80 ? 'bg-green-100 text-green-700' :
                      percent >= 50 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {percent}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{topic?.title}</p>
                      <p className="text-xs text-gray-500">
                        {result.score}/{result.totalQuestions} правильных
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Gamification */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Достижения
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { emoji: '📝', label: 'Первый конспект', unlocked: myNotes.length >= 1 },
            { emoji: '🧠', label: 'Первый тест', unlocked: myResults.length >= 1 },
            { emoji: '⭐', label: '5 конспектов', unlocked: myNotes.length >= 5 },
            { emoji: '🏆', label: '100% на тесте', unlocked: myResults.some(r => r.score === r.totalQuestions) },
          ].map((badge, i) => (
            <div key={i} className={`text-center p-4 rounded-xl border-2 transition ${
              badge.unlocked ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50 opacity-50'
            }`}>
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="text-xs font-medium text-gray-700">{badge.label}</p>
              {badge.unlocked && <p className="text-xs text-amber-600 mt-1">✓ Получено</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
