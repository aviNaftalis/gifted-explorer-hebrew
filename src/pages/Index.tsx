import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import CategorySelectScreen from '@/components/CategorySelectScreen';
import QuizCard from '@/components/QuizCard';
import ProgressBar from '@/components/ProgressBar';
import ResultsScreen from '@/components/ResultsScreen';
import { questions, QuestionCategory } from '@/data/questions';

type Screen = 'welcome' | 'category' | 'quiz' | 'results';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'all'>('all');

  const filteredQuestions = useMemo(() => {
    const filtered = selectedCategory === 'all'
      ? [...questions]
      : questions.filter((q) => q.category === selectedCategory);
    return filtered.sort(() => Math.random() - 0.5);
  }, [screen, selectedCategory]); // reshuffle on restart

  const handleStart = () => {
    setScreen('category');
  };

  const handleSelectCategory = (category: QuestionCategory | 'all') => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setScore(0);
    setScreen('quiz');
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);

    if (currentIndex + 1 >= filteredQuestions.length) {
      setTimeout(() => setScreen('results'), 300);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRestart = () => {
    setScreen('category');
    setCurrentIndex(0);
    setScore(0);
  };

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
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
        total={filteredQuestions.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="max-w-2xl mx-auto w-full mb-6">
        <ProgressBar current={currentIndex + 1} total={filteredQuestions.length} />
      </div>

      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <QuizCard
            key={filteredQuestions[currentIndex].id}
            question={filteredQuestions[currentIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
