import { motion } from 'framer-motion';
import { getHistory, clearHistory, TestResult } from '@/lib/progressStorage';
import { categoryInfo, QuestionCategory } from '@/data/questions';
import { useState } from 'react';

interface HistoryScreenProps {
  onBack: () => void;
}

const HistoryScreen = ({ onBack }: HistoryScreenProps) => {
  const [history, setHistory] = useState<TestResult[]>(getHistory);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const getCatLabel = (cat: QuestionCategory | 'all') =>
    cat === 'all' ? 'כל השאלות' : categoryInfo[cat]?.label ?? cat;

  const getCatEmoji = (cat: QuestionCategory | 'all') =>
    cat === 'all' ? '🎯' : categoryInfo[cat]?.emoji ?? '📋';

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-success';
    if (pct >= 50) return 'text-warning';
    return 'text-destructive';
  };

  // Stats
  const totalTests = history.length;
  const avgPct = totalTests
    ? Math.round(history.reduce((s, r) => s + (r.score / r.total) * 100, 0) / totalTests)
    : 0;
  const bestPct = totalTests
    ? Math.round(Math.max(...history.map((r) => (r.score / r.total) * 100)))
    : 0;

  return (
    <div className="min-h-screen flex flex-col items-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-6">
          <span className="text-5xl mb-2 block">📊</span>
          <h2 className="text-3xl font-black text-gradient-fun mb-1">היסטוריית ציונים</h2>
          <p className="text-muted-foreground">{totalTests} מבחנים הושלמו</p>
        </div>

        {/* Summary cards */}
        {totalTests > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-card rounded-2xl border-2 border-border p-3 text-center">
              <div className="text-2xl font-black text-foreground">{totalTests}</div>
              <div className="text-xs text-muted-foreground">מבחנים</div>
            </div>
            <div className="bg-card rounded-2xl border-2 border-border p-3 text-center">
              <div className={`text-2xl font-black ${getScoreColor(avgPct)}`}>{avgPct}%</div>
              <div className="text-xs text-muted-foreground">ממוצע</div>
            </div>
            <div className="bg-card rounded-2xl border-2 border-border p-3 text-center">
              <div className={`text-2xl font-black ${getScoreColor(bestPct)}`}>{bestPct}%</div>
              <div className="text-xs text-muted-foreground">שיא</div>
            </div>
          </div>
        )}

        {/* History list */}
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-5xl block mb-3">🫙</span>
            <p className="text-lg font-semibold">אין היסטוריה עדיין</p>
            <p className="text-sm">סיימו מבחן כדי לראות תוצאות כאן</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4 max-h-[50vh] overflow-y-auto">
            {history.map((r, i) => {
              const pct = Math.round((r.score / r.total) * 100);
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-xl border border-border p-3 flex items-center gap-3"
                >
                  <span className="text-2xl">{getCatEmoji(r.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">
                      {getCatLabel(r.category)} • מבחן {r.testNumber}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.date).toLocaleDateString('he-IL')} • ⏱️ {formatTime(r.timeSeconds)}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <div className={`font-black text-lg ${getScoreColor(pct)}`}>{pct}%</div>
                    <div className="text-xs text-muted-foreground">{r.score}/{r.total}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {history.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClear}
            className="w-full text-destructive font-semibold py-2 rounded-xl hover:bg-destructive/10 transition-colors text-sm mb-2"
          >
            🗑️ מחק היסטוריה
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full text-muted-foreground font-semibold text-lg py-3 rounded-xl hover:bg-muted transition-colors"
        >
          ⬅️ חזרה
        </motion.button>
      </motion.div>
    </div>
  );
};

export default HistoryScreen;
