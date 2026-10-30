import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { TopicDifficulty } from '../types';
import { BarChart3, TrendingDown, AlertTriangle, Users, BookOpen, Target } from 'lucide-react';

export default function AnalyticsPage() {
  const { course, quizResults, notes } = useData();

  // Calculate topic difficulty
  const topicStats: TopicDifficulty[] = course.topics.map(topic => {
    const results = quizResults.filter(r => r.topicId === topic.id);
    const totalAttempts = results.length;
    const averageScore = totalAttempts > 0
      ? Math.round(results.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / totalAttempts)
      : 0;
    const errorRate = totalAttempts > 0 ? 100 - averageScore : 0;

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      totalAttempts,
      averageScore,
      errorRate,
      difficultQuestions: [],
    };
  });

  const sortedByDifficulty = [...topicStats].sort((a, b) => b.errorRate - a.errorRate);
  const totalStudents = new Set(quizResults.map(r => r.userId)).size;
  const totalQuizzes = quizResults.length;
  const overallAvg = quizResults.length > 0
    ? Math.round(quizResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / quizResults.length)
    : 0;

  const maxAttempts = Math.max(...topicStats.map(t => t.totalAttempts), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Аналитика курса</h2>
        <p className="text-gray-500 mt-1">{course.name} • {course.code}</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
          <p className="text-sm text-gray-500">Студентов</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
          <p className="text-sm text-gray-500">Тестов пройдено</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-3">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{overallAvg}%</p>
          <p className="text-sm text-gray-500">Средний балл</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
          <p className="text-sm text-gray-500">Конспектов</p>
        </div>
      </div>

      {/* Heat map */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" /> Тепловая карта сложности тем
          </h3>
          <p className="text-sm text-gray-500 mt-1">Чем краснее — тем больше ошибок у студентов</p>
        </div>
        <div className="p-5 space-y-4">
          {sortedByDifficulty.map(topic => {
            const intensity = topic.errorRate / 100;
            const bgColor = `rgba(239, 68, 68, ${intensity * 0.3})`;
            const borderColor = `rgba(239, 68, 68, ${intensity * 0.5})`;
            return (
              <div key={topic.topicId} className="flex items-center gap-4">
                <div className="w-48 text-sm font-medium text-gray-700 truncate" title={topic.topicTitle}>
                  {topic.topicTitle}
                </div>
                <div className="flex-1">
                  <div
                    className="h-10 rounded-lg flex items-center px-4 transition-all"
                    style={{ backgroundColor: bgColor, border: `1px solid ${borderColor}` }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-current opacity-60" style={{ width: `${Math.min(topic.totalAttempts / maxAttempts * 100, 100)}%`, minWidth: '8px' }} />
                      <span className="text-sm font-medium" style={{ color: `rgba(185, 28, 28, ${Math.max(intensity, 0.5)})` }}>
                        {topic.errorRate}% ошибок
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 w-24">
                  <div>{topic.averageScore}% средний</div>
                  <div className="text-xs">{topic.totalAttempts} попыток</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Problem areas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Difficult topics */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Проблемные темы
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {sortedByDifficulty.filter(t => t.totalAttempts > 0).slice(0, 5).map((topic, idx) => (
              <div key={topic.topicId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx === 0 ? 'bg-red-100 text-red-700' :
                  idx === 1 ? 'bg-orange-100 text-orange-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{topic.topicTitle}</p>
                  <p className="text-xs text-gray-500">Средний балл: {topic.averageScore}%</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  topic.errorRate > 50 ? 'bg-red-100 text-red-700' :
                  topic.errorRate > 30 ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {topic.errorRate}% ошибок
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student performance */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Успеваеть студентов
            </h3>
          </div>
          <div className="p-5 space-y-3">
            {Array.from(new Set(quizResults.map(r => r.userId))).map(userId => {
              const userResults = quizResults.filter(r => r.userId === userId);
              const avg = Math.round(userResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / userResults.length);
              // Find user name from notes
              const note = notes.find(n => n.authorId === userId);
              const name = note?.authorName || userId;
              return (
                <div key={userId} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{userResults.length} тестов</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${avg >= 80 ? 'text-green-600' : avg >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {avg}%
                    </div>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                      <div className={`h-full rounded-full ${avg >= 80 ? 'bg-green-500' : avg >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${avg}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Topic bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" /> Распределение попыток по темам
        </h3>
        <div className="flex items-end gap-3 h-48">
          {course.topics.map(topic => {
            const attempts = topicStats.find(t => t.topicId === topic.id)?.totalAttempts || 0;
            const height = maxAttempts > 0 ? (attempts / maxAttempts) * 100 : 0;
            return (
              <div key={topic.id} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">{attempts}</span>
                <div
                  className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <span className="text-xs text-gray-500 text-center truncate w-full" title={topic.title}>
                  {topic.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
