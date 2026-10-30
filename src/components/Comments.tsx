import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Comment } from '../types';
import { MessageCircle, Send, Trash2 } from 'lucide-react';

interface CommentsProps {
  noteId: string;
}

export default function Comments({ noteId }: CommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`smartNotes_comments_${noteId}`);
    if (saved) setComments(JSON.parse(saved));
  }, [noteId]);

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem(`smartNotes_comments_${noteId}`, JSON.stringify(newComments));
  };

  const handleAdd = () => {
    if (!newComment.trim() || !user) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      noteId,
      authorId: user.id,
      authorName: user.name,
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    saveComments([...comments, comment]);
    setNewComment('');
  };

  const handleDelete = (id: string) => {
    saveComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
      >
        <MessageCircle className="w-4 h-4" />
        Комментарии ({comments.length})
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{comment.authorName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {comment.authorId === user?.id && (
                    <button onClick={() => handleDelete(comment.id)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Добавить комментарий..."
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 dark:text-gray-100"
            />
            <button
              onClick={handleAdd}
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
