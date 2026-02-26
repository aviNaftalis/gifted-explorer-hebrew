import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QuestionCategory, categoryInfo, questions } from '@/data/questions';
import { shuffleWithSeed } from '@/lib/seededRandom';

interface CategorySelectScreenProps {
  onSelectCategory: (category: QuestionCategory | 'all', testNumber: number, timer: boolean, seed: number) => void;
  onBack: () => void;
}

const CategorySelectScreen = ({ onSelectCategory, onBack }: CategorySelectScreenProps) => {
  const categories = Object.entries(categoryInfo) as [QuestionCategory, typeof categoryInfo[QuestionCategory]][];
  const [selectedCat, setSelectedCat] = useState<QuestionCategory | 'all' | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));

  const getQuestionCount = (cat: QuestionCategory | 'all') =>
    cat === 'all' ? questions.length : questions.filter((q) => q.category === cat).length;

  const testsForCategory = useMemo(() => {
    if (selectedCat === null) return [];
    const filtered = selectedCat === 'all'
      ? [...questions]
      : questions.filter((q) => q.category === selectedCat);
    const shuffled = shuffleWithSeed(filtered, seed);
    const count = Math.ceil(shuffled.length / 10);
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      size: Math.min(10, shuffled.length - i * 10),
    }));
  }, [selectedCat, seed]);

  const handleCategoryClick = (cat: QuestionCategory | 'all') => {
    setSelectedCat(cat);
  };

  const handleStartTest = (testNumber: number) => {
    if (!selectedCat) return;
    onSelectCategory(selectedCat, testNumber, timerEnabled, seed);
  };

  const handleReshuffle = () => {
    setSeed(Math.floor(Math.random() * 100000));
  };

  // Test selection screen
  if (selectedCat !== null) {
    const totalAvailable = getQuestionCount(selectedCat);
    const catLabel = selectedCat === 'all' ? 'כל השאלות' : categoryInfo[selectedCat].label;
    const catEmoji = selectedCat === 'all' ? '🎯' : categoryInfo[selectedCat].emoji;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-6">
            <span className="text-5xl mb-2 block">{catEmoji}</span>
            <h2 className="text-2xl md:text-3xl font-black text-gradient-fun mb-1">{catLabel}</h2>
            <p className="text-muted-foreground">{totalAvailable} שאלות • {testsForCategory.length} מבחנים</p>
          </div>

          {/* Timer toggle */}
          <div className="bg-card rounded-2xl border-2 border-border p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⏱️</span>
              <div>
                <span className="font-bold">טיימר</span>
                <p className="text-xs text-muted-foreground">45 שניות לכל שאלה</p>
              </div>
            </div>
            <button
              onClick={() => setTimerEnabled(!timerEnabled)}
              className={`w-14 h-8 rounded-full transition-colors relative ${timerEnabled ? 'bg-primary' : 'bg-muted'}`}
            >
              <motion.div
                className="w-6 h-6 bg-card rounded-full absolute top-1"
                animate={{ left: timerEnabled ? '1.75rem' : '0.25rem' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Reshuffle button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReshuffle}
            className="w-full mb-4 bg-muted text-foreground font-semibold py-3 rounded-2xl border-2 border-border flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔀</span>
            <span>ערבב שאלות מחדש</span>
          </motion.button>

          {/* Test buttons */}
          <div className="grid gap-3">
            {testsForCategory.map((test) => (
              <motion.button
                key={test.number}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleStartTest(test.number)}
                className="bg-card rounded-2xl border-2 border-border p-4 text-right shadow-fun hover:shadow-candy transition-shadow flex items-center gap-3"
              >
                <span className="text-3xl bg-muted rounded-full w-12 h-12 flex items-center justify-center font-black text-foreground shrink-0">
                  {test.number}
                </span>
                <div>
                  <span className="font-bold text-lg">מבחן {test.number}</span>
                  <p className="text-sm text-muted-foreground">{test.size} שאלות</p>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setSelectedCat(null)}
            className="mt-4 w-full text-muted-foreground font-semibold text-lg py-3 rounded-xl hover:bg-muted transition-colors"
          >
            ⬅️ חזרה לנושאים
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📋
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-gradient-fun mb-2">
            בחרו נושא לתרגול
          </h2>
          <p className="text-muted-foreground text-lg">
            בחרו נושא ואז מבחן של 10 שאלות!
          </p>
        </div>

        {/* All questions button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleCategoryClick('all')}
          className="w-full mb-4 bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-fun"
        >
          🎯 כל השאלות ({questions.length})
        </motion.button>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(([key, info], i) => {
            const count = getQuestionCount(key);
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleCategoryClick(key)}
                className="bg-card rounded-2xl border-2 border-border p-5 text-right shadow-fun hover:shadow-candy transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{info.emoji}</span>
                  <span className="font-bold text-lg">{info.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{info.description}</p>
                <div className="mt-2 text-xs font-semibold bg-muted rounded-full px-3 py-1 inline-block">
                  {count} שאלות • {Math.ceil(count / 10)} מבחנים
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onBack}
          className="mt-6 w-full text-muted-foreground font-semibold text-lg py-3 rounded-xl hover:bg-muted transition-colors"
        >
          ⬅️ חזרה
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CategorySelectScreen;
