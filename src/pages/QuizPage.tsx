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

  useEffect(() => {
    if (preGeneratedQuestions) return;
    // Don't auto-generate, let user select a note first
    setLoading(false);
  }, []);

  const handleGenerate = async () => {
    if (!selectedNoteId) {
      setError('Выберите конспект');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const note = notes.find(n => n.id === selectedNoteId);
      if (!note) throw new Error('Конспект не найден');
      const text = note.blocks.map(b => b.content).join('\n');
      const generated = await generateQuestions({
        text,
        noteTitle: note.title,
        count: 7,
      });
      setQuestions(generated);
      setSelectedTopicId(note.topicId);
    } catch (err: any) {
      setError(err.message || 'Ошибка генерации');
    }
    setLoading(false);
  };

  const handleAnswer = (answer: string) => {
    const q = questions[currentQ];
    setAnswers({ ...answers, [q.id]: answer });
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    // Calculate score
    let correct = 0;
    questions.forEach(q => {
      const answer = answers[q.id] || '';
      if (answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ||
          answer.toLowerCase().includes(q.correctAnswer.toLowerCase())) {
        correct++;
      }
    });

    const result: QuizResult = {
      id: `qr-${Date.now()}`,
      userId: user?.id || '',
      noteId: selectedNoteId || noteId,
      topicId: selectedTopicId || topicId,
      questions,
      answers,
      score: correct,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
    };
    addQuizResult(result);
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach(q => {
      const answer = answers[q.id] || '';
      if (answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ||
          answer.toLowerCase().includes(q.correctAnswer.toLowerCase())) {
        correct++;
      }
    });
    return correct;
  };

  const isCorrect = (q: QuizQuestion) => {
    const answer = answers[q.id] || '';
    return answer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() ||
           answer.toLowerCase().includes(q.correctAnswer.toLowerCase());
  };

  // Selection screen
  if (questions.length === 0 && !loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Самопроверка</h2>
          <p className="text-gray-500 mt-2">Выберите конспект для генерации вопросов с помощью ИИ</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Выберите конспект</label>
            <select
              value={selectedNoteId}
              onChange={e => setSelectedNoteId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">— Выберите конспект —</option>
              {myNotes.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !selectedNoteId}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Сгенерировать вопросы
          </button>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">ИИ генерирует вопросы...</p>
          <p className="text-sm text-gray-400 mt-1">Анализируем конспект и создаём тест</p>
        </div>
      </div>
    );
  }

  // Results
  if (showResults) {
    const score = getScore();
    const percent = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            percent >= 80 ? 'bg-green-100' : percent >= 50 ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            <Trophy className={`w-10 h-10 ${percent >= 80 ? 'text-green-600' : percent >= 50 ? 'text-amber-600' : 'text-red-600'}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Результаты</h2>
          <p className="text-4xl font-bold mt-2" style={{ color: percent >= 80 ? '#16a34a' : percent >= 50 ? '#d97706' : '#dc2626' }}>
            {percent}%
          </p>
          <p className="text-gray-500">{score} из {questions.length} правильных ответов</p>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => {
            const correct = isCorrect(q);
            return (
              <div key={q.id} className={`rounded-xl border p-5 ${correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {correct ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{idx + 1}. {q.question}</p>
                    <p className="text-sm text-gray-600">
                      Ваш ответ: <span className={correct ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>{answers[q.id] || '—'}</span>
                    </p>
                    {!correct && (
                      <p className="text-sm text-green-700 mt-1">Правильный ответ: {q.correctAnswer}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-2 italic">💡 {q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQ(0);
              setAnswers({});
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            <RotateCcw className="w-4 h-4" /> Пройти заново
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Вернуться к конспекту
            </button>
          )}
        </div>
      </div>
    );
  }

  // Quiz in progress
  const q = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Вопрос {currentQ + 1} из {questions.length}</span>
          <span className="text-sm font-medium text-purple-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-purple-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <p className="text-lg font-medium text-gray-900 mb-6">{q.question}</p>

        {q.type === 'choice' && q.options ? (
          <div className="space-y-3">
            {q.options.map(option => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[q.id] === option
                    ? 'border-purple-500 bg-purple-50 text-purple-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={answers[q.id] || ''}
            onChange={e => handleAnswer(e.target.value)}
            placeholder="Введите ваш ответ..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        {currentQ === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            <CheckCircle className="w-4 h-4" /> Завершить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
          >
            Далее <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
