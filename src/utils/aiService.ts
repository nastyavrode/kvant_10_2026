import { QuizQuestion } from '../types';

// AI Service - stub implementation that generates realistic questions
// In production, this would call an external LLM API

interface GenerateQuestionsOptions {
  text: string;
  noteTitle: string;
  count?: number;
}

interface SimplifyOptions {
  text: string;
  mode: 'simple' | 'example';
}

interface SummarizeOptions {
  text: string;
}

// Simulate async API call with delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateQuestions({ text, noteTitle, count = 5 }: GenerateQuestionsOptions): Promise<QuizQuestion[]> {
  await delay(1500); // Simulate API latency

  // Rate limiting check
  const lastCall = parseInt(localStorage.getItem('ai_lastCall') || '0');
  const now = Date.now();
  if (now - lastCall < 2000) {
    throw new Error('Слишком частые запросы. Подождите немного.');
  }
  localStorage.setItem('ai_lastCall', now.toString());

  const questions: QuizQuestion[] = [];

  // Generate questions based on content analysis
  const keywords = extractKeywords(text);
  const hasCode = text.includes('def ') || text.includes('class ') || text.includes('function');
  const hasFormula = text.includes('O(') || text.includes('=') || text.includes('∑');

  // Question templates based on content type
  const templates = [
    {
      type: 'choice' as const,
      question: `Что из перечисленного лучше всего описывает основную тему "${noteTitle}"?`,
      options: generateOptions(keywords),
      correctAnswer: keywords[0] || 'Основная концепция',
      explanation: `Основная тема конспекта — ${keywords[0] || 'ключевая концепция'}. Это следует из основного содержания материала.`
    },
    {
      type: 'open' as const,
      question: `Объясните своими словами, что такое ${keywords[1] || 'ключевое понятие'} из данного конспекта.`,
      correctAnswer: keywords[1] || 'ключевое понятие',
      explanation: `${keywords[1] || 'Ключевое понятие'} — это важная часть темы. Ответ должен отражать понимание основной идеи.`
    },
    {
      type: 'choice' as const,
      question: `Какой из вариантов правильно характеризует подход, описанный в конспекте?`,
      options: ['Итеративный подход', 'Рекурсивный подход', 'Жадный алгоритм', 'Динамическое программирование'],
      correctAnswer: detectApproach(text),
      explanation: `В конспекте описывается ${detectApproach(text)}. Это определяется структурой представленного материала.`
    },
    ...(hasCode ? [{
      type: 'open' as const,
      question: `Какова временная сложность алгоритма, представленного в коде?`,
      correctAnswer: detectComplexity(text),
      explanation: `Сложность алгоритма — ${detectComplexity(text)}. Это определяется количеством вложенных циклов и рекурсивных вызовов.`
    }] : []),
    ...(hasFormula ? [{
      type: 'choice' as const,
      question: `Что означает формула/запись, приведённая в конспекте?`,
      options: ['Асимптотическую оценку', 'Точное время выполнения', 'Количество операций', 'Объём памяти'],
      correctAnswer: 'Асимптотическую оценку',
      explanation: 'Формула в конспекте описывает асимптотическую оценку — как ведёт себя алгоритм при больших входных данных.'
    }] : []),
    {
      type: 'choice' as const,
      question: `В каком случае применение метода из конспекта будет НЕэффективным?`,
      options: ['Большие объёмы данных', 'Маленькие объёмы данных', 'Отсортированные данные', 'Случайные данные'],
      correctAnswer: getInefficientCase(text),
      explanation: `Метод может быть неэффективен в случае "${getInefficientCase(text)}" из-за особенностей реализации.`
    },
    {
      type: 'open' as const,
      question: `Приведите пример практического применения концепции из конспекта "${noteTitle}".`,
      correctAnswer: 'практическое применение',
      explanation: 'Концепции из конспекта применяются в реальных системах: поисковые движки, базы данных, сетевые протоколы.'
    },
    {
      type: 'choice' as const,
      question: `Какой тип структуры данных наиболее связан с темой конспекта?`,
      options: ['Массив', 'Связный список', 'Дерево', 'Граф'],
      correctAnswer: getRelatedStructure(text),
      explanation: `Тема конспекта наиболее тесно связана со структурой "${getRelatedStructure(text)}".`
    },
  ];

  // Select and randomize questions
  const selected = templates.slice(0, Math.min(count, templates.length));
  
  for (let i = 0; i < selected.length; i++) {
    questions.push({
      id: `q-${Date.now()}-${i}`,
      noteId: '',
      type: selected[i].type,
      question: selected[i].question,
      options: selected[i].options,
      correctAnswer: selected[i].correctAnswer,
      explanation: selected[i].explanation,
    });
  }

  return questions;
}

export async function simplifyText({ text, mode }: SimplifyOptions): Promise<{ simplified: string; example?: string }> {
  await delay(1000);

  if (mode === 'simple') {
    return {
      simplified: `Простыми словами: ${text.split('.').slice(0, 2).join('. ')}. Если совсем просто — это как инструкция, где каждый шаг понятен даже без специальных знаний. Основная идея в том, что мы берём сложную задачу и разбиваем её на простые части.`
    };
  } else {
    return {
      simplified: `Давайте разберём на примере из жизни.`,
      example: `Представьте, что вы ищете слово в словаре. Вы не листаете каждую страницу — вы открываете примерно посередине и смотрите, дальше или раньше нужное слово. Это и есть принцип, описанный в конспекте: вместо перебора всех вариантов мы используем умный подход, который сразу отбрасывает неподходящие.`
    };
  }
}

export async function summarizeText({ text }: SummarizeOptions): Promise<string> {
  await delay(1200);

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 3).map(s => s.trim());

  return `📋 **Краткое резюме:**\n\n${keyPoints.map((p, i) => `${i + 1}. ${p}.`).join('\n')}\n\n**Главная мысль:** Материал посвящён ключевым концепциям, которые необходимо понимать для решения практических задач. Рекомендуется обратить внимание на связь теории с реализацией в коде.`;
}

// Helper functions
function extractKeywords(text: string): string[] {
  const stopwords = new Set(['и', 'в', 'на', 'с', 'по', 'для', 'что', 'это', 'как', 'не', 'из', 'при', 'все', 'или', 'а', 'но', 'то', 'же', 'бы', 'от', 'до', 'о', 'за', 'так', 'мы', 'он', 'она']);
  const words = text.toLowerCase().replace(/[^\wа-яё\s]/g, '').split(/\s+/);
  const filtered = words.filter(w => w.length > 3 && !stopwords.has(w));
  const freq: Record<string, number> = {};
  filtered.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
}

function generateOptions(keywords: string[]): string[] {
  const base = keywords[0] || 'Алгоритм';
  return [
    base.charAt(0).toUpperCase() + base.slice(1),
    'Структура данных',
    'Математическая модель',
    'Протокол связи'
  ];
}

function detectApproach(text: string): string {
  if (text.includes('рекурсив') || text.includes('recursive')) return 'Рекурсивный подход';
  if (text.includes('while') || text.includes('for')) return 'Итеративный подход';
  if (text.includes('жадн') || text.includes('greedy')) return 'Жадный алгоритм';
  return 'Итеративный подход';
}

function detectComplexity(text: string): string {
  if (text.includes('O(log')) return 'O(log n)';
  if (text.includes('O(n²') || text.includes('O(n^2)')) return 'O(n²)';
  if (text.includes('O(n log')) return 'O(n log n)';
  if (text.includes('O(1)')) return 'O(1)';
  return 'O(n)';
}

function getInefficientCase(text: string): string {
  if (text.includes('sort') || text.includes('сорт')) return 'Отсортированные данные';
  if (text.includes('search') || text.includes('поиск')) return 'Маленькие объёмы данных';
  return 'Большие объёмы данных';
}

function getRelatedStructure(text: string): string {
  if (text.includes('дерев') || text.includes('tree') || text.includes('BST')) return 'Дерево';
  if (text.includes('граф') || text.includes('graph') || text.includes('вершин')) return 'Граф';
  if (text.includes('sort') || text.includes('сорт') || text.includes('массив')) return 'Массив';
  return 'Массив';
}
