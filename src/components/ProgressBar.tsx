import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm font-semibold text-muted-foreground">
        <span>שאלה {current} מתוך {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${i < current ? 'bg-primary' : 'bg-muted'}`}
              animate={i === current - 1 ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
      <div className="h-4 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-fun rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
