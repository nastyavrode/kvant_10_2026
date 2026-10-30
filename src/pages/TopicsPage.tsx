import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, FileText, Users, CheckCircle } from 'lucide-react';

export default function TopicsPage() {
  const { course, notes, quizResults } = useData();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Темы курса</h2>
        <p className="text-sm text-gray-500 mt-1">{course.name}</p>
      </div>

      <div className="space-y-4">
        {course.topics.map((topic, idx) => {
          const topicNotes = notes.filter(n => n.topicId === topic.id);
          const topicResults = quizResults.filter(r => r.topicId === topic.id);
          const avgScore = topicResults.length > 0
            ? Math.round(topicResults.reduce((sum, r) => sum + (r.score / r.totalQuestions) * 100, 0) / topicResults.length)
            : null;

          return (
            <div key={topic.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-indigo-600">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{topic.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        {topicNotes.length} конспектов
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-purple-500" />
                        {topicResults.length} тестов
                      </span>
                      {avgScore !== null && (
                        <span className={`flex items-center gap-1.5 text-sm font-medium ${
                          avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          <CheckCircle className="w-4 h-4" />
                          {avgScore}% средний балл
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes list */}
              {topicNotes.length > 0 && (
                <div className="px-5 pb-4">
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    {topicNotes.map(note => (
                      <div key={note.id} className="flex items-center gap-2 text-sm">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-700">{note.title}</span>
                        <span className="text-gray-400">— {note.authorName}</span>
                        {note.isOfficial && <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">офиц.</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
