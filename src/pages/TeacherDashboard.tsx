import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Users, FileText, BarChart3, TrendingUp, Award } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { course, notes, quizResults } = useData();

  const totalStudents = new Set(quizResults.map(r => r.userId)).size;
  const totalQuizzes = quizResults.length;
  const overallAvg = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
    : 0;

  const stats = [
    { label: 'Студентов в курсе', value: totalStudents || 3, icon: Users, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Конспектов', value: notes.length, icon: FileText, color: 'bg-green-500', bgColor: 'bg-green-50' },
    { label: 'Тестов пройдено', value: totalQuizzes, icon: BarChart3, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Средний балл', value: `${overallAvg}%`, icon: TrendingUp, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  ];

  const recentActivity = [...quizResults]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Добро пожаловать, {user?.name}! 👨‍🏫</h1>
        <p className="text-emerald-100 text-lg">Управляйте курсом и отслеживайте прогресс студентов</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-emerald-200">
          <span>📚 {course.name}</span>
          <span>•</span>
          <span>🔑 Код: {course.code}</span>
          <span>•</span>
          <span>📝 {course.topics.length} тем</span>
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
        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> Последняя активность
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {recentActivity.map(result => {
              const topic = course.topics.find(t => t.id === result.topicId);
              const percent = Math.round((result.score / result.totalQuestions) * 100);
              const studentNote = notes.find(n => n.authorId === result.userId);
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
                    <p className="text-sm font-medium text-gray-900">{studentNote?.authorName || 'Студент'}</p>
                    <p className="text-xs text-gray-500">{topic?.title}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(result.completedAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              );
            })}
            {recentActivity.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">Пока нет активности</p>
            )}
          </div>
        </div>

        {/* Topics overview */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Темы курса
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {course.topics.map((topic, idx) => {
              const topicResults = quizResults.filter(r => r.topicId === topic.id);
              const avg = topicResults.length > 0
                ? Math.round(topicResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / topicResults.length)
                : null;
              return (
                <div key={topic.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-sm font-bold text-indigo-600">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{topic.title}</p>
                    <p className="text-xs text-gray-500">{topicResults.length} тестов</p>
                  </div>
                  {avg !== null ? (
                    <span className={`text-sm font-bold ${avg >= 80 ? 'text-green-600' : avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {avg}%
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Нет данных</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
