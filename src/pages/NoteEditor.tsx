import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Note, NoteBlock } from '../types';
import { marked } from 'marked';
import {
  ArrowLeft, Save, Trash2, Share2, Share, Brain,
  Sparkles, Type, AlignLeft, Code, Sigma, Image, FileText,
  Lightbulb, BookOpen, Download, Printer
} from 'lucide-react';
import { generateQuestions, simplifyText, summarizeText } from '../utils/aiService';
import { exportToMarkdown, exportToPDF } from '../utils/exportUtils';
import Comments from '../components/Comments';
import TreeVisualization from '../components/TreeVisualization';
import QuizPage from './QuizPage';

interface NoteEditorProps { note?: Note; onBack: () => void; }

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
  const [aiResult, setAiResult] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const fullText = blocks.map(b => b.content).join('\n');

  const addBlock = (type: NoteBlock['type']) => setBlocks([...blocks, { id: `block-${Date.now()}`, type, content: '' }]);
  const updateBlock = (id: string, content: string) => setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  const removeBlock = (id: string) => setBlocks(blocks.filter(b => b.id !== id));

  const handleSave = () => {
    setSaving(true);
    const noteData: Note = { id: note?.id || `note-${Date.now()}`, title: title || 'Без названия', authorId: user?.id || '', authorName: user?.name || '', courseId: course.id, topicId, blocks, isShared, isOfficial: note?.isOfficial || false, createdAt: note?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
    if (note) updateNote(noteData); else addNote(noteData);
    setTimeout(() => { setSaving(false); onBack(); }, 500);
  };

  const handleGenerateQuiz = async () => {
    setAiLoading('quiz');
    try { const q = await generateQuestions({ text: fullText, noteTitle: title, count: 7 }); setGeneratedQuestions(q); setShowQuiz(true); } catch (err: any) { alert(err.message); }
    setAiLoading('');
  };

  const handleSimplify = async (mode: 'simple' | 'example') => {
    if (!selectedText) { alert('Выделите текст'); return; }
    setAiLoading('simplify');
    try { const r = await simplifyText({ text: selectedText, mode }); setAiResult(mode === 'simple' ? r.simplified : `${r.simplified}\n\n${r.example || ''}`); } catch (err: any) { setAiResult('Ошибка'); }
    setAiLoading('');
  };

  const handleSummarize = async () => {
    setAiLoading('summary');
    try { setAiResult(await summarizeText({ text: fullText })); } catch { setAiResult('Ошибка'); }
    setAiLoading('');
  };

  if (showQuiz && generatedQuestions.length > 0) return <QuizPage preGeneratedQuestions={generatedQuestions} noteId={note?.id || ''} topicId={topicId} onBack={() => { setShowQuiz(false); setGeneratedQuestions([]); }} />;

  const blockIcons: Record<NoteBlock['type'], React.ReactNode> = { heading: <Type className="w-4 h-4" />, text: <AlignLeft className="w-4 h-4" />, formula: <Sigma className="w-4 h-4" />, image: <Image className="w-4 h-4" />, code: <Code className="w-4 h-4" />, markdown: <FileText className="w-4 h-4" /> };
  const blockLabels: Record<NoteBlock['type'], string> = { heading: 'Заголовок', text: 'Текст', formula: 'Формула', image: 'Изображение', code: 'Код', markdown: 'Markdown' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg transition" style={{ backgroundColor: 'var(--color-light-bg)' }}><ArrowLeft className="w-5 h-5" style={{ color: 'var(--color-text)' }} /></button>
        <div className="flex-1">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Название конспекта" className="text-2xl font-bold w-full outline-none bg-transparent" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => { if (note) exportToMarkdown({ ...note, title: title || 'Без названия', blocks, topicId, isShared, updatedAt: new Date().toISOString() } as Note); }} className="p-2.5 rounded-lg transition" style={{ backgroundColor: 'var(--color-light-bg)' }} title="Экспорт MD"><Download className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} /></button>
          <button onClick={exportToPDF} className="p-2.5 rounded-lg transition" style={{ backgroundColor: 'var(--color-light-bg)' }} title="PDF"><Printer className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} /></button>
          <button onClick={handleSave} disabled={saving} className="btn-primary"><Save className="w-4 h-4" /> {saving ? '...' : 'Сохранить'}</button>
        </div>
      </div>

      {/* Topic & sharing */}
      <div className="flex flex-wrap gap-3">
        <select value={topicId} onChange={e => setTopicId(e.target.value)} className="uni-input text-sm">
          {course.topics.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <button onClick={() => setIsShared(!isShared)} className="uni-badge cursor-pointer transition" style={{ backgroundColor: isShared ? '#ECFDF5' : 'var(--color-light-bg)', color: isShared ? '#059669' : 'var(--color-text-secondary)', border: `1px solid ${isShared ? '#BBF7D0' : 'var(--color-border)'}` }}>
          {isShared ? <Share2 className="w-3 h-3" /> : <Share className="w-3 h-3" />} {isShared ? 'Общий' : 'Приватный'}
        </button>
        <button onClick={() => setShowAI(!showAI)} className="uni-badge cursor-pointer transition" style={{ backgroundColor: showAI ? '#F5F3FF' : 'var(--color-light-bg)', color: showAI ? '#7C3AED' : 'var(--color-text-secondary)', border: `1px solid ${showAI ? '#DDD6FE' : 'var(--color-border)'}` }}>
          <Brain className="w-3 h-3" /> ИИ-помощник
        </button>
      </div>

      {/* AI Panel */}
      {showAI && (
        <div className="uni-card p-6" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #ECFDF5 100%)', borderColor: '#DDD6FE' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', color: '#7C3AED' }}><Sparkles className="w-5 h-5" /> ИИ-помощник</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={handleGenerateQuiz} disabled={!!aiLoading || blocks.length === 0} className="btn-accent text-sm py-2 px-4"><Brain className="w-4 h-4" /> {aiLoading === 'quiz' ? '...' : 'Сгенерировать тест'}</button>
            <button onClick={() => handleSimplify('simple')} disabled={!!aiLoading} className="btn-outline text-sm py-2 px-4"><Lightbulb className="w-4 h-4" /> Объясни проще</button>
            <button onClick={() => handleSimplify('example')} disabled={!!aiLoading} className="btn-outline text-sm py-2 px-4"><BookOpen className="w-4 h-4" /> С примером</button>
            <button onClick={handleSummarize} disabled={!!aiLoading || blocks.length === 0} className="btn-outline text-sm py-2 px-4"><FileText className="w-4 h-4" /> Суммаризация</button>
          </div>
          {aiResult && <div className="prose p-4 rounded-xl" style={{ backgroundColor: 'var(--color-surface)' }} dangerouslySetInnerHTML={{ __html: marked(aiResult) }} />}
        </div>
      )}

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, idx) => (
          <div key={block.id} className="uni-card group">
            <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: 'var(--color-light-bg)', borderBottom: '1px solid var(--color-border-light)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>{blockIcons[block.type]}</span>
              <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>{blockLabels[block.type]}</span>
              <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => removeBlock(block.id)} className="p-1 rounded" style={{ color: '#DC2626' }}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="p-4">
              {block.type === 'heading' && <input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="Заголовок" className="w-full text-xl font-bold outline-none bg-transparent" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }} />}
              {block.type === 'text' && <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} onMouseUp={() => { const s = window.getSelection()?.toString(); if (s) setSelectedText(s); }} placeholder="Текст..." rows={3} className="w-full outline-none resize-none bg-transparent" style={{ color: 'var(--color-text)' }} />}
              {block.type === 'markdown' && <div><textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="Markdown..." rows={4} className="w-full text-sm outline-none resize-none bg-transparent font-mono" style={{ color: 'var(--color-text)' }} />{block.content && <div className="mt-3 pt-3 prose" style={{ borderTop: '1px solid var(--color-border-light)' }} dangerouslySetInnerHTML={{ __html: marked(block.content) }} />}</div>}
              {block.type === 'code' && <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="Код..." rows={6} className="w-full text-sm outline-none resize-none p-3 rounded-lg font-mono" style={{ backgroundColor: 'var(--color-primary)', color: '#A7F3D0' }} />}
              {block.type === 'formula' && <input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="T(n) = O(n log n)" className="w-full text-center text-lg font-mono py-3 rounded-lg outline-none" style={{ backgroundColor: 'var(--color-light-bg)', color: 'var(--color-primary)' }} />}
              {block.type === 'image' && <div><input type="text" value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="URL..." className="w-full text-sm outline-none bg-transparent mb-2" style={{ color: 'var(--color-text)' }} />{block.content && <img src={block.content} alt="" className="max-w-full rounded-lg" />}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Add block */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(blockLabels) as NoteBlock['type'][]).map(type => (
          <button key={type} onClick={() => addBlock(type)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition border-2" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}>
            {blockIcons[type]} {blockLabels[type]}
          </button>
        ))}
      </div>

      {topicId === 'topic-3' && <TreeVisualization />}
      {note && <Comments noteId={note.id} />}
    </div>
  );
}
