import { QuestionCategory } from '@/data/questions';

export interface TestResult {
  id: string;
  date: string;
  category: QuestionCategory | 'all';
  testNumber: number;
  score: number;
  total: number;
  timeSeconds: number;
  seed: number;
}

const STORAGE_KEY = 'quiz-progress-history';

export function saveTestResult(result: Omit<TestResult, 'id' | 'date'>): TestResult {
  const entry: TestResult = {
    ...result,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };
  const history = getHistory();
  history.unshift(entry);
  // Keep last 100 results
  if (history.length > 100) history.length = 100;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return entry;
}

export function getHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getCategoryStats(category: QuestionCategory | 'all') {
  const history = getHistory().filter((r) => r.category === category);
  if (history.length === 0) return null;
  const totalScore = history.reduce((s, r) => s + r.score, 0);
  const totalQuestions = history.reduce((s, r) => s + r.total, 0);
  const bestScore = Math.max(...history.map((r) => Math.round((r.score / r.total) * 100)));
  const avgScore = Math.round((totalScore / totalQuestions) * 100);
  return { tests: history.length, bestScore, avgScore };
}
