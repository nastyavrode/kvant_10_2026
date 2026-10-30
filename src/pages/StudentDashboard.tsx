import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FileText, Brain, Trophy, TrendingUp, BookOpen, Clock, ArrowRight, Star, Flame } from 'lucide-react';
import StreakBadge from '../components/StreakBadge';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getMyNotes, quizResults, course } = useData();
  const myNotes = getMyNotes();
  const myResults = quizResults.filter(r => r.userId === user?.id);

  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / myResults.length)
    : 0;

  const recentNotes = [...myNotes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const recentResults = [...myResults].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 3);

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="hero-section rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="uni-badge" style={{ backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' }}>
              <Flame className="w-3 h-3" /> {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </span>
            <StreakBadge />
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Привет, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mb-6">
            Продолжайте учиться и создавать конспекты. Каждый шаг приближает вас к успеху.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{course.name}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
              <Clock className="w-4 h-4" />
              <span className="text-sm">Код: {course.code}</span>
            </div>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FBBF24, transparent)' }} />
        <div className="absolute right-20 top-10 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #34D399, transparent)' }} />
      </div>

      {/* Stats Cards — University Style */}
      <div>
        <p className="section-label mb-2">Ваш прогресс</p>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Статистика обучения</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Конспектов', value: myNotes.length, icon: FileText, color: '#065F46', bg: '#ECFDF5' },
            { label: 'Тестов пройдено', value: myResults.length, icon: Brain, color: '#7C3AED', bg: '#F5F3FF' },
            { label: 'Средний балл', value: `${avgScore}%`, icon: Trophy, color: '#D97706', bg: '#FFFBEB' },
            { label: 'Тем в курсе', value: course.topics.length, icon: BookOpen, color: '#0891B2', bg: '#ECFEFF' },
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

      {/* Programs / Topics */}
      <div>
        <p className="section-label mb-2">Программа курса</p>
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Темы и материалы</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.topics.slice(0, 6).map((topic, idx) => {
            const topicNotes = myNotes.filter(n => n.topicId === topic.id);
            const topicResults = myResults.filter(r => r.topicId === topic.id);
            const avg = topicResults.length > 0
              ? Math.round(topicResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / topicResults.length)
              : null;
            
            return (
              <div key={topic.id} className="program-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
                    {idx + 1}
                  </div>
                  {avg !== null && (
                    <span className="uni-badge" style={{
                      backgroundColor: avg >= 80 ? '#ECFDF5' : avg >= 50 ? '#FFFBEB' : '#FEF2F2',
                      color: avg >= 80 ? '#059669' : avg >= 50 ? '#D97706' : '#DC2626',
                    }}>
                      {avg}%
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{topic.title}</h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>{topic.description}</p>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {topicNotes.length} конспектов</span>
                  <span className="flex items-center gap-1"><Brain className="w-3.5 h-3.5" /> {topicResults.length} тестов</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <div className="uni-card">
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Недавнее</p>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Последние конспекты</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {recentNotes.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--color-text-muted)' }}>Пока нет конспектов</p>
            ) : (
              recentNotes.map(note => (
                <div key={note.id} className="flex items-center gap-3 p-3 rounded-xl transition" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{note.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{new Date(note.updatedAt).toLocaleDateString('ru-RU')}</p>
                  </div>
                  <ArrowRight className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Quiz Results */}
        <div className="uni-card">
          <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Результаты</p>
                <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Самопроверки</h3>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#7C3AED' }} />
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3">
            {recentResults.length === 0 ? (
              <p className="text-center py-4" style={{ color: 'var(--color-text-muted)' }}>Пока нет результатов</p>
            ) : (
              recentResults.map(result => {
                const topic = course.topics.find(t => t.id === result.topicId);
                const percent = Math.round((result.score / result.totalQuestions) * 100);
                return (
                  <div key={result.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm" style={{
                      backgroundColor: percent >= 80 ? '#ECFDF5' : percent >= 50 ? '#FFFBEB' : '#FEF2F2',
                      color: percent >= 80 ? '#059669' : percent >= 50 ? '#D97706' : '#DC2626',
                    }}>
                      {percent}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{topic?.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{result.score}/{result.totalQuestions} правильных</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="uni-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFBEB' }}>
            <Star className="w-6 h-6" style={{ color: '#D97706' }} />
          </div>
          <div>
            <p className="section-label mb-0.5">Геймификация</p>
            <h3 className="font-bold text-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Ваши достижения</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { emoji: '📝', label: 'Первый конспект', unlocked: myNotes.length >= 1 },
            { emoji: '🧠', label: 'Первый тест', unlocked: myResults.length >= 1 },
            { emoji: '⭐', label: '5 конспектов', unlocked: myNotes.length >= 5 },
            { emoji: '🏆', label: '100% на тесте', unlocked: myResults.some(r => r.score === r.totalQuestions) },
          ].map((badge, i) => (
            <div key={i} className="text-center p-5 rounded-xl transition" style={{
              backgroundColor: badge.unlocked ? '#FFFBEB' : 'var(--color-light-bg)',
              border: badge.unlocked ? '2px solid #FBBF24' : '2px solid var(--color-border-light)',
              opacity: badge.unlocked ? 1 : 0.5,
            }}>
              <div className="text-4xl mb-2">{badge.emoji}</div>
              <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{badge.label}</p>
              {badge.unlocked && <p className="text-xs mt-1 font-bold" style={{ color: '#D97706' }}>✓ Получено</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
