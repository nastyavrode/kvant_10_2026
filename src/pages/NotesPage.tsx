import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Note } from '../types';
import { Plus, Trash2, Edit3, Share2, FileText, Sparkles, ArrowRight } from 'lucide-react';
import NoteEditor from './NoteEditor';

export default function NotesPage() {
  const { user } = useAuth();
  const { getMyNotes, getSharedNotes, course, deleteNote } = useData();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);

  const allNotes = user?.role === 'teacher' ? getSharedNotes() : getMyNotes();

  if (editingNote) return <NoteEditor note={editingNote} onBack={() => setEditingNote(null)} />;
  if (creating) return <NoteEditor onBack={() => setCreating(false)} />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="section-label mb-1">Библиотека</p>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
            {user?.role === 'teacher' ? 'Конспекты курса' : 'Мои конспекты'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {allNotes.length} {allNotes.length === 1 ? 'конспект' : allNotes.length < 5 ? 'конспекта' : 'конспектов'}
          </p>
        </div>
        {user?.role === 'student' && (
          <button onClick={() => setCreating(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> Новый конспект
          </button>
        )}
      </div>

      {/* Notes grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allNotes.map(note => {
          const topic = course.topics.find(t => t.id === note.topicId);
          return (
            <div key={note.id} className="program-card group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-light-bg)' }}>
                    <FileText className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div className="flex gap-1.5">
                    {note.isShared && (
                      <span className="uni-badge uni-badge-success"><Share2 className="w-3 h-3" /> Общий</span>
                    )}
                    {note.isOfficial && (
                      <span className="uni-badge uni-badge-accent"><Sparkles className="w-3 h-3" /> Офиц.</span>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{note.title}</h3>
                <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Тема: {topic?.title || 'Не привязана'}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{note.authorName} • {new Date(note.updatedAt).toLocaleDateString('ru-RU')}</p>
              </div>
              <div className="px-6 py-4 flex gap-2" style={{ borderTop: '1px solid var(--color-border-light)' }}>
                <button onClick={() => setEditingNote(note)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition" style={{ color: 'var(--color-primary)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-light-bg)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Edit3 className="w-4 h-4" /> Открыть
                </button>
                {note.authorId === user?.id && (
                  <button onClick={() => { if (confirm('Удалить конспект?')) deleteNote(note.id); }} className="p-2 rounded-lg transition" style={{ color: '#DC2626' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#FEF2F2'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {allNotes.length === 0 && (
        <div className="text-center py-16 uni-card">
          <FileText className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text)' }}>Пока нет конспектов</p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Создайте свой первый конспект и начните учиться</p>
          {user?.role === 'student' && (
            <button onClick={() => setCreating(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Создать конспект
            </button>
          )}
        </div>
      )}
    </div>
  );
}
