import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Users, FileText, BarChart3, TrendingUp, Award, ArrowRight } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { course, notes, quizResults } = useData();

  const totalStudents = new Set(quizResults.map(r => r.userId)).size || 3;
  const totalQuizzes = quizResults.length;
  const overallAvg = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
    : 0;

  const recentActivity = [...quizResults].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="hero-section rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <span className="uni-badge mb-4 inline-flex" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' }}>
            👨‍🏫 Панель преподавателя
          </span>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Добро пожаловать,<br />
            <span style={{ color: '#FBBF24' }}>{user?.name}</span>
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mb-6">
            Управляйте курсом и отслеживайте прогресс студентов в реальном времени.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <BookOpen className="w-4 h-4" /> {course.name}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <span>🔑 {course.code}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <span>📝 {course.topics.length} тем</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FBBF24, transparent)' }} />
      </div>

      {/* Stats */}
      <div>
        <p className="section-label mb-2">Обзор курса</p>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Ключевые показатели</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Студентов', value: totalStudents, icon: Users, color: '#0891B2', bg: '#ECFEFF' },
            { label: 'Конспектов', value: notes.length, icon: FileText, color: '#059669', bg: '#ECFDF5' },
            { label: 'Тестов пройдено', value: totalQuizzes, icon: BarChart3, color: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Средний балл', value: `${overallAvg}%`, icon: TrendingUp, color: '#D97706', bg: '#FFFBEB' },
          ].map((stat, i) => (
            <div key={i} className="uni-card p-5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: stat.bg }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{stat.value}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topics Overview */}
      <div>
        <p className="section-label mb-2">Учебная программа</p>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Темы курса</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.topics.map((topic, idx) => {
            const topicResults = quizResults.filter(r => r.topicId === topic.id);
            const avg = topicResults.length > 0
              ? Math.round(topicResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / topicResults.length)
              : null;
            return (
              <div key={topic.id} className="program-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                    {idx + 1}
                  </div>
                  {avg !== null ? (
                    <span className="uni-badge" style={{
                      backgroundColor: avg >= 80 ? '#ECFDF5' : avg >= 50 ? '#FFFBEB' : '#FEF2F2',
                      color: avg >= 80 ? '#059669' : avg >= 50 ? '#D97706' : '#DC2626',
                    }}>{avg}%</span>
                  ) : (
                    <span className="uni-badge" style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-text-muted)' }}>—</span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{topic.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{topic.description}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {topicResults.length} тестов</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="uni-card">
        <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="section-label mb-1">Активность</p>
              <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Последние результаты</h3>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
              <Award className="w-5 h-5" style={{ color: '#7C3AED' }} />
            </div>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {recentActivity.map(result => {
            const topic = course.topics.find(t => t.id === result.topicId);
            const percent = Math.round((result.score / result.totalQuestions) * 100);
            const studentNote = notes.find(n => n.authorId === result.userId);
            return (
              <div key={result.id} className="flex items-center gap-4 p-4 rounded-xl transition" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>
                  {(studentNote?.authorName || 'С').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{studentNote?.authorName || 'Студент'}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{topic?.title}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: percent >= 80 ? '#059669' : percent >= 50 ? '#D97706' : '#DC2626' }}>
                    {percent}%
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(result.completedAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            );
          })}
          {recentActivity.length === 0 && (
            <p className="text-center py-6" style={{ color: 'var(--color-text-muted)' }}>Пока нет активности</p>
          )}
        </div>
      </div>
    </div>
  );
}
