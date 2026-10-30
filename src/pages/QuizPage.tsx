import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { QuizQuestion, QuizResult } from '../types';
import { Brain, CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { generateQuestions } from '../utils/aiService';

interface QuizPageProps {
  preGeneratedQuestions?: QuizQuestion[];
  noteId?: string;
  topicId?: string;
  onBack?: () => void;
}

export default function QuizPage({ preGeneratedQuestions, noteId = '', topicId = '', onBack }: QuizPageProps) {
  const { user } = useAuth();
  const { course, notes, addQuizResult, getMyNotes } = useData();
  const [questions, setQuestions] = useState<QuizQuestion[]>(preGeneratedQuestions || []);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(!preGeneratedQuestions);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState(topicId || course.topics[0]?.id || '');
  const [error, setError] = useState('');

  const myNotes = getMyNotes();

  useEffect(() => { if (preGeneratedQuestions) return; setLoading(false); }, []);

  const handleGenerate = async () => {
    if (!selectedNoteId) { setError('Выберите конспект'); return; }
    setLoading(true); setError('');
    try {
      const note = notes.find(n => n.id === selectedNoteId);
      if (!note) throw new Error('Конспект не найден');
      const text = note.blocks.map(b => b.content).join('\n');
      const generated = await generateQuestions({ text, noteTitle: note.title, count: 7 });
      setQuestions(generated);
      setSelectedTopicId(note.topicId);
    } catch (err: any) { setError(err.message || 'Ошибка генерации'); }
    setLoading(false);
  };

  const handleAnswer = (answer: string) => { const q = questions[currentQ]; setAnswers({ ...answers, [q.id]: answer }); };
  const handleNext = () => { if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1); };
  const handlePrev = () => { if (currentQ > 0) setCurrentQ(currentQ - 1); };

  const handleSubmit = () => {
    setShowResults(true);
    let correct = 0;
    questions.forEach(q => {
      const answer = answers[q.id] || '';
      if (answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() || answer.toLowerCase().includes(q.correctAnswer.toLowerCase())) correct++;
    });
    addQuizResult({ id: `qr-${Date.now()}`, userId: user?.id || '', noteId: selectedNoteId || noteId, topicId: selectedTopicId || topicId, questions, answers, score: correct, totalQuestions: questions.length, completedAt: new Date().toISOString() });
  };

  const getScore = () => { let c = 0; questions.forEach(q => { const a = answers[q.id] || ''; if (a.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() || a.toLowerCase().includes(q.correctAnswer.toLowerCase())) c++; }); return c; };
  const isCorrect = (q: QuizQuestion) => { const a = answers[q.id] || ''; return a.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() || a.toLowerCase().includes(q.correctAnswer.toLowerCase()); };

  if (questions.length === 0 && !loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ backgroundColor: '#F5F3FF' }}>
            <Brain className="w-10 h-10" style={{ color: '#7C3AED' }} />
          </div>
          <p className="section-label mb-2">ИИ-помощник</p>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>Самопроверка</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Выберите конспект для генерации вопросов с помощью ИИ</p>
        </div>
        {error && <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B' }}>{error}</div>}
        <div className="uni-card p-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>Выберите конспект</label>
              <select value={selectedNoteId} onChange={e => setSelectedNoteId(e.target.value)} className="uni-input w-full">
                <option value="">— Выберите конспект —</option>
                {myNotes.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            </div>
            <button onClick={handleGenerate} disabled={loading || !selectedNoteId} className="btn-accent w-full justify-center">
              <Sparkles className="w-5 h-5" /> Сгенерировать вопросы
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#E9D5FF', borderTopColor: '#7C3AED' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--color-text)' }}>ИИ генерирует вопросы...</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Анализируем конспект</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = getScore();
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center uni-card p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: percent >= 80 ? '#ECFDF5' : percent >= 50 ? '#FFFBEB' : '#FEF2F2' }}>
            <Trophy className="w-10 h-10" style={{ color: percent >= 80 ? '#059669' : percent >= 50 ? '#D97706' : '#DC2626' }} />
          </div>
          <p className="section-label mb-2">Результат</p>
          <h2 className="text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: percent >= 80 ? '#059669' : percent >= 50 ? '#D97706' : '#DC2626' }}>{percent}%</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{score} из {questions.length} правильных ответов</p>
        </div>
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const correct = isCorrect(q);
            return (
              <div key={q.id} className="uni-card p-5" style={{ borderColor: correct ? '#BBF7D0' : '#FECACA', borderWidth: '2px' }}>
                <div className="flex items-start gap-3">
                  {correct ? <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#059669' }} /> : <XCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: '#DC2626' }} />}
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: 'var(--color-text)' }}>{idx + 1}. {q.question}</p>
                    <p className="text-sm">Ваш ответ: <span className="font-medium" style={{ color: correct ? '#059669' : '#DC2626' }}>{answers[q.id] || '—'}</span></p>
                    {!correct && <p className="text-sm mt-1" style={{ color: '#059669' }}>Правильный: {q.correctAnswer}</p>}
                    <p className="text-sm mt-2 italic" style={{ color: 'var(--color-text-muted)' }}>💡 {q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setShowResults(false); setCurrentQ(0); setAnswers({}); }} className="btn-outline"><RotateCcw className="w-4 h-4" /> Заново</button>
          {onBack && <button onClick={onBack} className="btn-primary">К конспекту</button>}
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Вопрос {currentQ + 1} из {questions.length}</span>
          <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))' }} />
        </div>
      </div>
      <div className="uni-card p-8">
        <p className="text-xl font-medium mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{q.question}</p>
        {q.type === 'choice' && q.options ? (
          <div className="space-y-3">
            {q.options.map(option => (
              <button key={option} onClick={() => handleAnswer(option)} className="w-full text-left p-4 rounded-xl border-2 transition" style={{ borderColor: answers[q.id] === option ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: answers[q.id] === option ? 'var(--color-light-bg)' : 'transparent', color: 'var(--color-text)' }}>
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea value={answers[q.id] || ''} onChange={e => handleAnswer(e.target.value)} placeholder="Введите ваш ответ..." rows={4} className="uni-input w-full resize-none" />
        )}
      </div>
      <div className="flex items-center justify-between">
        <button onClick={handlePrev} disabled={currentQ === 0} className="flex items-center gap-2 px-4 py-2.5 rounded-full transition disabled:opacity-30" style={{ color: 'var(--color-text-secondary)' }}>
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>
        {currentQ === questions.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary"><CheckCircle className="w-4 h-4" /> Завершить</button>
        ) : (
          <button onClick={handleNext} className="btn-primary">Далее <ArrowRight className="w-4 h-4" /></button>
        )}
      </div>
    </div>
  );
}
