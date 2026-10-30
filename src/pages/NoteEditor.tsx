import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Note, NoteBlock } from '../types';
import { marked } from 'marked';
import {
  ArrowLeft, Save, Plus, Trash2, Share2, Share, Brain,
  Sparkles, Type, AlignLeft, Code, Sigma, Image, FileText,
  Lightbulb, BookOpen, Download, Printer
} from 'lucide-react';
import { generateQuestions, simplifyText, summarizeText } from '../utils/aiService';
import { exportToMarkdown, exportToPDF } from '../utils/exportUtils';
import Comments from '../components/Comments';
import TreeVisualization from '../components/TreeVisualization';
import QuizPage from './QuizPage';

interface NoteEditorProps {
  note?: Note;
  onBack: () => void;
}

export default function NoteEditor({ note, onBack }: NoteEditorProps) {
  const { user } = useAuth();
  const { addNote, updateNote, course } = useData();

  const [title, setTitle] = useState(note?.title || '');
  const [topicId, setTopicId] = useState(note?.topicId || course.topics[0]?.id || '');
  const [blocks, setBlocks] = useState<NoteBlock[]>(note?.blocks || []);
  const [isShared, setIsShared] = useState(note?.isShared || false);
  const [saving, setSaving] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiLoading, setAiLoading] = useState('');
  const [aiResult, setAiResult] = useState<string>('');
  const [selectedText, setSelectedText] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const fullText = blocks.map(b => b.content).join('\n');

  const addBlock = (type: NoteBlock['type']) => {
    const newBlock: NoteBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex(b => b.id === id);
    if (direction === 'up' && idx > 0) {
      const newBlocks = [...blocks];
      [newBlocks[idx - 1], newBlocks[idx]] = [newBlocks[idx], newBlocks[idx - 1]];
      setBlocks(newBlocks);
    } else if (direction === 'down' && idx < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[idx], newBlocks[idx + 1]] = [newBlocks[idx + 1], newBlocks[idx]];
      setBlocks(newBlocks);
    }
  };

  const handleSave = () => {
    setSaving(true);
    const noteData: Note = {
      id: note?.id || `note-${Date.now()}`,
      title: title || 'Без названия',
      authorId: user?.id || '',
      authorName: user?.name || '',
      courseId: course.id,
      topicId,
      blocks,
      isShared,
      isOfficial: note?.isOfficial || false,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (note) {
      updateNote(noteData);
    } else {
      addNote(noteData);
    }
    setTimeout(() => {
      setSaving(false);
      onBack();
    }, 500);
  };

  const handleGenerateQuiz = async () => {
    setAiLoading('quiz');
    try {
      const questions = await generateQuestions({
        text: fullText,
        noteTitle: title,
        count: 7,
      });
      setGeneratedQuestions(questions);
      setShowQuiz(true);
    } catch (err: any) {
      alert(err.message || 'Ошибка генерации вопросов');
    }
    setAiLoading('');
  };

  const handleSimplify = async (mode: 'simple' | 'example') => {
    if (!selectedText) {
      alert('Выделите текст для упрощения');
      return;
    }
    setAiLoading('simplify');
    try {
      const result = await simplifyText({ text: selectedText, mode });
      setAiResult(mode === 'simple' ? result.simplified : `${result.simplified}\n\n${result.example || ''}`);
    } catch (err: any) {
      setAiResult('Ошибка: ' + (err.message || 'не удалось упростить'));
    }
    setAiLoading('');
  };

  const handleSummarize = async () => {
    setAiLoading('summary');
    try {
      const summary = await summarizeText({ text: fullText });
      setAiResult(summary);
    } catch (err: any) {
      setAiResult('Ошибка: ' + (err.message || 'не удалось создать резюме'));
    }
    setAiLoading('');
  };

  if (showQuiz && generatedQuestions.length > 0) {
    return (
      <QuizPage
        preGeneratedQuestions={generatedQuestions}
        noteId={note?.id || ''}
        topicId={topicId}
        onBack={() => { setShowQuiz(false); setGeneratedQuestions([]); }}
      />
    );
  }

  const blockIcons: Record<NoteBlock['type'], React.ReactNode> = {
    heading: <Type className="w-4 h-4" />,
    text: <AlignLeft className="w-4 h-4" />,
    formula: <Sigma className="w-4 h-4" />,
    image: <Image className="w-4 h-4" />,
    code: <Code className="w-4 h-4" />,
    markdown: <FileText className="w-4 h-4" />,
  };

  const blockLabels: Record<NoteBlock['type'], string> = {
    heading: 'Заголовок',
    text: 'Текст',
    formula: 'Формула',
    image: 'Изображение (URL)',
    code: 'Код',
    markdown: 'Markdown',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Название конспекта"
            className="text-xl font-bold text-gray-900 w-full outline-none bg-transparent placeholder-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (note) {
                const noteData = { ...note, title: title || 'Без названия', blocks, topicId, isShared, updatedAt: new Date().toISOString() };
                exportToMarkdown(noteData as Note);
              }
            }}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Экспорт в Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Экспорт в PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Topic selector & sharing */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={topicId}
          onChange={e => setTopicId(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {course.topics.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
        <button
          onClick={() => setIsShared(!isShared)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            isShared ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isShared ? <Share2 className="w-4 h-4" /> : <Share className="w-4 h-4" />}
          {isShared ? 'Общий доступ' : 'Приватный'}
        </button>
        <button
          onClick={() => setShowAI(!showAI)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            showAI ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Brain className="w-4 h-4" /> ИИ-помощник
        </button>
      </div>

      {/* AI Panel */}
      {showAI && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> ИИ-помощник
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={handleGenerateQuiz}
              disabled={!!aiLoading || blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
            >
              <Brain className="w-4 h-4" /> {aiLoading === 'quiz' ? 'Генерация...' : 'Сгенерировать тест'}
            </button>
            <button
              onClick={() => handleSimplify('simple')}
              disabled={!!aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-50 transition disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4" /> {aiLoading === 'simplify' ? 'Обработка...' : 'Объясни проще'}
            </button>
            <button
              onClick={() => handleSimplify('example')}
              disabled={!!aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-50 transition disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" /> С примером
            </button>
            <button
              onClick={handleSummarize}
              disabled={!!aiLoading || blocks.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-purple-700 border border-purple-200 rounded-lg text-sm font-medium hover:bg-purple-50 transition disabled:opacity-50"
            >
              <FileText className="w-4 h-4" /> {aiLoading === 'summary' ? 'Обработка...' : 'Суммаризация'}
            </button>
          </div>
          {aiResult && (
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(aiResult) }} />
              <button onClick={() => setAiResult('')} className="mt-2 text-xs text-gray-400 hover:text-gray-600">Закрыть</button>
            </div>
          )}
          <p className="text-xs text-purple-500 mt-2">💡 Выделите текст в конспекте, затем нажмите «Объясни проще» или «С примером»</p>
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, idx) => (
          <div key={block.id} className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-200 transition overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-gray-400">{blockIcons[block.type]}</span>
              <span className="text-xs font-medium text-gray-500">{blockLabels[block.type]}</span>
              <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => moveBlock(block.id, 'up')} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs">↑</button>
                <button onClick={() => moveBlock(block.id, 'down')} disabled={idx === blocks.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 text-xs">↓</button>
                <button onClick={() => removeBlock(block.id)} className="p-1 hover:bg-red-100 rounded text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              {block.type === 'heading' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder="Заголовок"
                  className="w-full text-lg font-bold text-gray-900 outline-none bg-transparent placeholder-gray-300"
                />
              )}
              {block.type === 'text' && (
                <textarea
                  value={block.content}
                  onChange={e => {
                    updateBlock(block.id, e.target.value);
                    if (window.getSelection()?.toString()) {
                      setSelectedText(window.getSelection()!.toString());
                    }
                  }}
                  onMouseUp={() => {
                    const sel = window.getSelection()?.toString();
                    if (sel) setSelectedText(sel);
                  }}
                  placeholder="Текст..."
                  rows={3}
                  className="w-full text-gray-700 outline-none resize-none bg-transparent placeholder-gray-300"
                />
              )}
              {block.type === 'markdown' && (
                <div>
                  <textarea
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="Markdown..."
                    rows={4}
                    className="w-full text-sm text-gray-700 outline-none resize-none bg-transparent placeholder-gray-300 font-mono"
                  />
                  {block.content && (
                    <div className="mt-3 pt-3 border-t border-gray-100 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(block.content) }} />
                  )}
                </div>
              )}
              {block.type === 'code' && (
                <textarea
                  value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder="Код..."
                  rows={6}
                  className="w-full text-sm text-gray-800 outline-none resize-none bg-gray-900 text-green-400 p-3 rounded-lg font-mono placeholder-gray-600"
                />
              )}
              {block.type === 'formula' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={e => updateBlock(block.id, e.target.value)}
                  placeholder="Формула (например: T(n) = O(n log n))"
                  className="w-full text-center text-lg font-mono text-indigo-700 bg-indigo-50 py-3 rounded-lg outline-none placeholder-indigo-300"
                />
              )}
              {block.type === 'image' && (
                <div>
                  <input
                    type="text"
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="URL изображения..."
                    className="w-full text-sm outline-none bg-transparent placeholder-gray-300 mb-2"
                  />
                  {block.content && (
                    <img src={block.content} alt="" className="max-w-full rounded-lg" onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add block buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {(Object.keys(blockLabels) as NoteBlock['type'][]).map(type => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {blockIcons[type]} {blockLabels[type]}
          </button>
        ))}
      </div>

      {/* 3D Tree Visualization */}
      {topicId === 'topic-3' && (
        <div className="mt-8">
          <TreeVisualization />
        </div>
      )}

      {/* Comments */}
      {note && <Comments noteId={note.id} />}
    </div>
  );
}
