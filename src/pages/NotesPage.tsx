import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Note } from '../types';
import { Plus, Trash2, Edit3, Share2, FileText, Sparkles } from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function NotesPage() {
  const { user } = useAuth();
  const { getMyNotes, getSharedNotes, course, deleteNote } = useData();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);

  const allNotes = user?.role === 'teacher' ? getSharedNotes() : getMyNotes();

  if (editingNote) {
    return <NoteEditor note={editingNote} onBack={() => setEditingNote(null)} />;
  }

  if (creating) {
    return <NoteEditor onBack={() => setCreating(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {user?.role === 'teacher' ? 'Конспекты курса' : 'Мои конспекты'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {allNotes.length} {allNotes.length === 1 ? 'конспект' : allNotes.length < 5 ? 'конспекта' : 'конспектов'}
          </p>
        </div>
        {user?.role === 'student' && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Новый конспект
          </button>
        )}
      </div>

      {/* Notes grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allNotes.map(note => {
          const topic = course.topics.find(t => t.id === note.topicId);
          return (
            <div
              key={note.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex gap-1">
                    {note.isShared && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        <Share2 className="w-3 h-3 inline" /> Общий
                      </span>
                    )}
                    {note.isOfficial && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                        <Sparkles className="w-3 h-3 inline" /> Официальный
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{note.title}</h3>
                <p className="text-xs text-gray-500 mb-2">
                  Тема: {topic?.title || 'Не привязана'}
                </p>
                <p className="text-xs text-gray-400">
                  {note.authorName} • {new Date(note.updatedAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => setEditingNote(note)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-medium"
                >
                  <Edit3 className="w-4 h-4" /> Открыть
                </button>
                {note.authorId === user?.id && (
                  <button
                    onClick={() => {
                      if (confirm('Удалить конспект?')) deleteNote(note.id);
                    }}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Пока нет конспектов</p>
          {user?.role === 'student' && (
            <button
              onClick={() => setCreating(true)}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Создать первый конспект
            </button>
          )}
        </div>
      )}
    </div>
  );
}
