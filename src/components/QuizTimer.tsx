import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface QuizTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPaused: boolean;
}

const QuizTimer = ({ duration, onTimeUp, isPaused }: QuizTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, onTimeUp]);

  const progress = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-3">
      <motion.div
        className={`text-lg font-bold tabular-nums ${isCritical ? 'text-destructive' : isLow ? 'text-warning' : 'text-foreground'}`}
        animate={isCritical ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        ⏱️ {minutes}:{seconds.toString().padStart(2, '0')}
      </motion.div>
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isCritical ? 'bg-destructive' : isLow ? 'bg-warning' : 'bg-gradient-fun'}`}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>
    </div>
  );
};

export default QuizTimer;
