import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, FileText, User, Calendar } from 'lucide-react';
import { marked } from 'marked';

export default function SearchPage() {
  const { searchNotes, course } = useData();
  const [query, setQuery] = useState('');
  const results = query.length >= 2 ? searchNotes(query) : [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Поиск по конспектам..."
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          autoFocus
        />
      </div>

      {query.length >= 2 && (
        <p className="text-sm text-gray-500 mb-4">
          Найдено: {results.length} {results.length === 1 ? 'результат' : results.length < 5 ? 'результата' : 'результатов'}
        </p>
      )}

      <div className="space-y-4">
        {results.map(note => {
          const topic = course.topics.find(t => t.id === note.topicId);
          const preview = note.blocks.find(b => b.content.toLowerCase().includes(query.toLowerCase()));
          return (
            <div key={note.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{note.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {note.authorName}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(note.updatedAt).toLocaleDateString('ru-RU')}</span>
                    {topic && <span className="px-2 py-0.5 bg-gray-100 rounded-full">{topic.title}</span>}
                  </div>
                  {preview && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      ...{preview.content.substring(0, 150)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {query.length >= 2 && results.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ничего не найдено по запросу «{query}»</p>
          <p className="text-sm text-gray-400 mt-1">Попробуйте другие ключевые слова</p>
        </div>
      )}

      {query.length < 2 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Введите минимум 2 символа для поиска</p>
        </div>
      )}
    </div>
  );
}
