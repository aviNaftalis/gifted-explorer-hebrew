import { useState, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import CategorySelectScreen from '@/components/CategorySelectScreen';
import QuizCard from '@/components/QuizCard';
import ProgressBar from '@/components/ProgressBar';
import ResultsScreen from '@/components/ResultsScreen';
import HistoryScreen from '@/components/HistoryScreen';
import TestTimer from '@/components/TestTimer';
import ExamMode from '@/components/ExamMode';
import { questions, QuestionCategory } from '@/data/questions';
import { shuffleWithSeed } from '@/lib/seededRandom';
import { saveTestResult } from '@/lib/progressStorage';

type Screen = 'welcome' | 'category' | 'quiz' | 'results' | 'history' | 'exam';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');
  const [testNumber, setTestNumber] = useState(1);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [seed, setSeed] = useState(1);

  // Split questions into tests of 10 using seed-based shuffling
  const testQuestions = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? [...questions]
      : questions.filter((q) => q.category === selectedCategory);
    const shuffled = shuffleWithSeed(filtered, seed);
    const testsCount = Math.ceil(shuffled.length / 10);
    const tests: typeof filtered[] = [];
    for (let i = 0; i < testsCount; i++) {
      tests.push(shuffled.slice(i * 10, (i + 1) * 10));
    }
    return tests;
  }, [selectedCategory, seed]);

  const currentTest = testQuestions[testNumber - 1] || testQuestions[0] || [];

  const handleStart = () => {
    setScreen('category');
  };

  const handleSelectCategory = (category: QuestionCategory | 'all', selectedTest: number, timer: boolean, newSeed: number) => {
    setSelectedCategory(category);
    setTestNumber(selectedTest);
    setTimerEnabled(timer);
    setSeed(newSeed);
    setCurrentIndex(0);
    setScore(0);
    setTotalTime(0);
    setScreen('quiz');
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);

    if (currentIndex + 1 >= currentTest.length) {
      setTimeout(() => {
        const finalScore = correct ? score + 1 : score;
        saveTestResult({
          category: selectedCategory,
          testNumber,
          score: finalScore,
          total: currentTest.length,
          timeSeconds: totalTime,
          seed,
        });
        setScreen('results');
      }, 300);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleTimeUpdate = useCallback((seconds: number) => {
    setTotalTime(seconds);
  }, []);

  const handleRestart = () => {
    setScreen('category');
    setCurrentIndex(0);
    setScore(0);
    setTotalTime(0);
  };

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} onHistory={() => setScreen('history')} onExam={() => setScreen('exam')} />;
  }

  if (screen === 'exam') {
    return <ExamMode onExit={() => setScreen('welcome')} />;
  }

  if (screen === 'history') {
    return <HistoryScreen onBack={() => setScreen('welcome')} />;
  }

  if (screen === 'category') {
    return (
      <CategorySelectScreen
        onSelectCategory={handleSelectCategory}
        onBack={() => setScreen('welcome')}
      />
    );
  }

  if (screen === 'results') {
    return (
      <ResultsScreen
        score={score}
        total={currentTest.length}
        totalTime={totalTime}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="max-w-2xl mx-auto w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <TestTimer isRunning={screen === 'quiz'} onTimeUpdate={handleTimeUpdate} />
          <div className="text-sm font-semibold text-muted-foreground bg-card rounded-full px-3 py-1 border border-border">
            מבחן {testNumber}
          </div>
        </div>
        <ProgressBar current={currentIndex + 1} total={currentTest.length} />
      </div>

      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <QuizCard
            key={currentTest[currentIndex].id}
            question={currentTest[currentIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            timerDuration={timerEnabled ? 45 : 0}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
