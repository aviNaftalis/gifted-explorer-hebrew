import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TestTimerProps {
  isRunning: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const TestTimer = ({ isRunning, onTimeUpdate }: TestTimerProps) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        onTimeUpdate?.(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, onTimeUpdate]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-fun border-2 border-border"
    >
      <span className="text-lg">⏱️</span>
      <span className="font-bold tabular-nums text-foreground text-lg">
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </motion.div>
  );
};

export default TestTimer;
