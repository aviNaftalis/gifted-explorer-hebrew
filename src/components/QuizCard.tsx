import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/data/questions';
import Confetti from './Confetti';
import QuizTimer from './QuizTimer';

interface QuizCardProps {
  question: Question;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  timerDuration?: number; // seconds, 0 = no timer
}

const optionColors = [
  'bg-primary hover:bg-primary/90 text-primary-foreground',
  'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
  'bg-coral hover:bg-coral/90 text-coral-foreground',
  'bg-accent hover:bg-accent/90 text-accent-foreground',
];

const QuizCard = ({ question, onAnswer, questionNumber, timerDuration = 0 }: QuizCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleTimeUp = useCallback(() => {
    if (showResult) return;
    // Auto-select wrong answer when time runs out
    setSelected(-1);
    setShowResult(true);
  }, [showResult]);

  const handleSelect = useCallback((index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    const isCorrect = index === question.correctIndex;
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
  }, [showResult, question.correctIndex]);

  const handleNext = () => {
    const isCorrect = selected === question.correctIndex;
    setSelected(null);
    setShowResult(false);
    onAnswer(isCorrect);
  };

  return (
    <>
      <Confetti show={showConfetti} />
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="bg-card rounded-2xl shadow-fun p-6 md:p-8 border-2 border-border">
          {/* Timer */}
          {timerDuration > 0 && (
            <div className="mb-4">
              <QuizTimer
                key={question.id}
                duration={timerDuration}
                onTimeUp={handleTimeUp}
                isPaused={showResult}
              />
            </div>
          )}

          {/* Category badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-2 mb-4 text-sm font-semibold"
          >
            <span className="text-lg">{question.categoryEmoji}</span>
            <span>{question.categoryLabel}</span>
          </motion.div>

          {/* Image (if present) */}
          {question.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="mb-4 rounded-xl overflow-hidden border-2 border-border bg-white"
            >
              <img
                src={question.image}
                alt="שאלה עם תמונה"
                className="w-full h-auto max-h-64 object-contain mx-auto"
              />
            </motion.div>
          )}

          {/* Question */}
          <motion.h2
            className="text-xl md:text-2xl font-bold mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {question.prompt}
          </motion.h2>

          {/* Options */}
          <div className="grid gap-3">
            {question.options.map((option, index) => {
              let stateClass = '';
              if (showResult) {
                if (index === question.correctIndex) {
                  stateClass = '!bg-success !text-success-foreground ring-4 ring-success/30';
                } else if (index === selected && index !== question.correctIndex) {
                  stateClass = '!bg-destructive !text-destructive-foreground ring-4 ring-destructive/30';
                } else {
                  stateClass = 'opacity-50';
                }
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={!showResult ? { scale: 1.03 } : {}}
                  whileTap={!showResult ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(index)}
                  disabled={showResult}
                  className={`w-full text-right p-4 rounded-xl font-semibold text-lg transition-all duration-200 ${optionColors[index]} ${stateClass} cursor-pointer disabled:cursor-default`}
                >
                  <span className="flex items-center gap-3">
                    <span className="bg-card/20 rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </span>
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <div className={`rounded-xl p-4 ${selected === question.correctIndex ? 'bg-success/10 border-2 border-success/30' : 'bg-destructive/10 border-2 border-destructive/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {selected === question.correctIndex ? '🌟' : selected === -1 ? '⏰' : '💪'}
                    </span>
                    <span className="font-bold text-lg">
                      {selected === question.correctIndex
                        ? 'כל הכבוד! תשובה נכונה!'
                        : selected === -1
                          ? 'נגמר הזמן!'
                          : 'לא נורא, בפעם הבאה!'}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{question.explanation}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="mt-4 w-full bg-gradient-fun text-primary-foreground font-bold text-lg py-3 rounded-xl shadow-fun"
                >
                  לשאלה הבאה ➡️
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

export default QuizCard;
