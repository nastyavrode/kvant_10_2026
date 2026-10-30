import React from 'react';
import { useData } from '../contexts/DataContext';
import { TopicDifficulty } from '../types';
import { BarChart3, TrendingDown, AlertTriangle, Users, BookOpen, Target } from 'lucide-react';

export default function AnalyticsPage() {
  const { course, quizResults, notes } = useData();

  const topicStats: TopicDifficulty[] = course.topics.map(topic => {
    const results = quizResults.filter(r => r.topicId === topic.id);
    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0 ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / totalAttempts) : 0;
    return { topicId: topic.id, topicTitle: topic.title, totalAttempts, averageScore, errorRate: totalAttempts > 0 ? 100 - averageScore : 0, difficultQuestions: [] };
  });

  const sortedByDifficulty = [...topicStats].sort((a, b) => b.errorRate - a.errorRate);
  const totalStudents = new Set(quizResults.map(r => r.userId)).size;
  const totalQuizzes = quizResults.length;
  const overallAvg = quizResults.length > 0 ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length) : 0;
  const maxAttempts = Math.max(...topicStats.map(t => t.totalAttempts), 1);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <p className="section-label mb-2">Преподавателю</p>
        <h2 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Аналитика курса</h2>
        <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>{course.name} • {course.code}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Студентов', value: totalStudents || 3, icon: Users, color: '#0891B2', bg: '#ECFEFF' },
          { label: 'Тестов', value: totalQuizzes, icon: BookOpen, color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Средний балл', value: `${overallAvg}%`, icon: Target, color: '#D97706', bg: '#FFFBEB' },
          { label: 'Конспектов', value: notes.length, icon: BarChart3, color: '#059669', bg: '#ECFDF5' },
        ].map((s, i) => (
          <div key={i} className="uni-card p-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.bg }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{s.value}</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heat map */}
      <div>
        <p className="section-label mb-2">Сложность</p>
        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Тепловая карта тем</h3>
        <div className="uni-card p-6 space-y-4">
          {sortedByDifficulty.map(topic => {
            const intensity = topic.errorRate / 100;
            return (
              <div key={topic.topicId} className="flex items-center gap-4">
                <div className="w-44 text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{topic.topicTitle}</div>
                <div className="flex-1 h-10 rounded-lg flex items-center px-4" style={{ backgroundColor: `rgba(220, 38, 38, ${intensity * 0.15})`, border: `1px solid rgba(220, 38, 38, ${intensity * 0.3})` }}>
                  <span className="text-sm font-bold" style={{ color: `rgba(185, 28, 28, ${Math.max(intensity, 0.4)})` }}>{topic.errorRate}% ошибок</span>
                </div>
                <div className="text-right text-sm w-24" style={{ color: 'var(--color-text-muted)' }}>
                  <div>{topic.averageScore}% балл</div>
                  <div className="text-xs">{topic.totalAttempts} попыток</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem areas & Students */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="uni-card">
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              <AlertTriangle className="w-5 h-5" style={{ color: '#D97706' }} /> Проблемные темы
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {sortedByDifficulty.filter(t => t.totalAttempts > 0).slice(0, 5).map((topic, idx) => (
              <div key={topic.topicId} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: idx === 0 ? '#FEF2F2' : idx === 1 ? '#FFFBEB' : '#ECFDF5', color: idx === 0 ? '#DC2626' : idx === 1 ? '#D97706' : '#059669' }}>{idx + 1}</div>
                <div className="flex-1"><p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{topic.topicTitle}</p><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Балл: {topic.averageScore}%</p></div>
                <span className="uni-badge" style={{ backgroundColor: topic.errorRate > 50 ? '#FEF2F2' : topic.errorRate > 30 ? '#FFFBEB' : '#ECFDF5', color: topic.errorRate > 50 ? '#DC2626' : topic.errorRate > 30 ? '#D97706' : '#059669' }}>{topic.errorRate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="uni-card">
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              <Users className="w-5 h-5" style={{ color: '#0891B2' }} /> Успеваемость
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {Array.from(new Set(quizResults.map(r => r.userId))).map(userId => {
              const userResults = quizResults.filter(r => r.userId === userId);
              const avg = Math.round(userResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / userResults.length);
              const note = notes.find(n => n.authorId === userId);
              const name = note?.authorName || userId;
              return (
                <div key={userId} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>{name.charAt(0)}</div>
                  <div className="flex-1"><p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</p><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{userResults.length} тестов</p></div>
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: avg >= 80 ? '#059669' : avg >= 50 ? '#D97706' : '#DC2626' }}>{avg}%</div>
                    <div className="w-16 h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--color-border)' }}><div className="h-full rounded-full" style={{ width: `${avg}%`, backgroundColor: avg >= 80 ? '#059669' : avg >= 50 ? '#D97706' : '#DC2626' }} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="uni-card p-6">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          <BarChart3 className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Попытки по темам
        </h3>
        <div className="flex items-end gap-4 h-48">
          {course.topics.map(topic => {
            const attempts = topicStats.find(t => t.topicId === topic.id)?.totalAttempts || 0;
            const height = maxAttempts > 0 ? (attempts / maxAttempts) * 100 : 0;
            return (
              <div key={topic.id} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{attempts}</span>
                <div className="w-full rounded-t-xl transition-all" style={{ height: `${Math.max(height, 5)}%`, background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-bright) 100%)' }} />
                <span className="text-xs text-center truncate w-full" style={{ color: 'var(--color-text-muted)' }}>{topic.title.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
