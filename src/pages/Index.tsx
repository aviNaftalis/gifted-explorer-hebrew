import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import WelcomeScreen from '@/components/WelcomeScreen';
import QuizCard from '@/components/QuizCard';
import ProgressBar from '@/components/ProgressBar';
import ResultsScreen from '@/components/ResultsScreen';
import { questions } from '@/data/questions';

type Screen = 'welcome' | 'quiz' | 'results';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  const shuffledQuestions = useMemo(() => {
    return [...questions].sort(() => Math.random() - 0.5);
  }, [screen]); // reshuffle on restart

  const handleStart = () => {
    setScreen('quiz');
    setCurrentIndex(0);
    setScore(0);
  };

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);

    if (currentIndex + 1 >= shuffledQuestions.length) {
      setTimeout(() => setScreen('results'), 300);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  if (screen === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (screen === 'results') {
    return (
      <ResultsScreen
        score={score}
        total={shuffledQuestions.length}
        onRestart={handleStart}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <div className="max-w-2xl mx-auto w-full mb-6">
        <ProgressBar current={currentIndex + 1} total={shuffledQuestions.length} />
      </div>

      <div className="flex-1 flex items-center">
        <AnimatePresence mode="wait">
          <QuizCard
            key={shuffledQuestions[currentIndex].id}
            question={shuffledQuestions[currentIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
