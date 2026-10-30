import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Note, NoteBlock } from '../types';
import { Sparkles, Plus, FileText, Upload } from 'lucide-react';
import { marked } from 'marked';

export default function OfficialNotesPage() {
  const { user } = useAuth();
  const { course, notes, addNote, updateNote } = useData();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [topicId, setTopicId] = useState(course.topics[0]?.id || '');
  const [content, setContent] = useState('');

  const officialNotes = notes.filter(n => n.isOfficial);

  const handleCreate = () => {
    if (!title || !content) return;
    const newNote: Note = {
      id: `note-official-${Date.now()}`,
      title,
      authorId: user?.id || '',
      authorName: user?.name || '',
      courseId: course.id,
      topicId,
      blocks: [
        { id: 'b1', type: 'markdown', content },
      ],
      isShared: true,
      isOfficial: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addNote(newNote);
    setCreating(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Официальные материалы</h2>
          <p className="text-sm text-gray-500 mt-1">Конспекты и материалы преподавателя</p>
        </div>
        {user?.role === 'teacher' && (
          <button
            onClick={() => setCreating(!creating)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition"
          >
            <Plus className="w-4 h-4" /> Добавить материал
          </button>
        )}
      </div>

      {creating && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 space-y-4">
          <h3 className="font-semibold text-amber-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Новый официальный материал
          </h3>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Название"
            className="w-full px-4 py-2.5 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
          <select
            value={topicId}
            onChange={e => setTopicId(e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          >
            {course.topics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Содержание (поддерживается Markdown)..."
            rows={8}
            className="w-full px-4 py-3 border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-white resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition"
            >
              Опубликовать
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {officialNotes.map(note => {
          const topic = course.topics.find(t => t.id === note.topicId);
          return (
            <div key={note.id} className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{note.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Тема: {topic?.title} • {note.authorName}
                    </p>
                  </div>
                </div>
                <div className="mt-4 prose prose-sm max-w-none text-gray-700">
                  {note.blocks.map(block => (
                    <div key={block.id}>
                      {block.type === 'markdown' ? (
                        <div dangerouslySetInnerHTML={{ __html: marked(block.content) }} />
                      ) : (
                        <p>{block.content}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {officialNotes.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Пока нет официальных материалов</p>
        </div>
      )}
    </div>
  );
}
