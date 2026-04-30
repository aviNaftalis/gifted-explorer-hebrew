import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface ResultsScreenProps {
  score: number;
  total: number;
  totalTime: number;
  onRestart: () => void;
}

const ResultsScreen = ({ score, total, totalTime, onRestart }: ResultsScreenProps) => {
  const percentage = Math.round((score / total) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 50;
  const isBad = percentage < 50;

  const getMessage = () => {
    if (isGreat) return { emoji: '🏆', text: 'מדהים! אתה/את כוכב/ת!' };
    if (isGood) return { emoji: '👏', text: 'כל הכבוד! עבודה טובה!' };
    return { emoji: '💪', text: 'המשיכו להתאמן, אתם משתפרים!' };
  };

  const msg = getMessage();

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Confetti show={isGreat} />

      {/* Failure animation - falling X marks */}
      {isBad && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{ 
                top: -50, 
                left: `${Math.random() * 100}%`,
                rotate: 0,
                opacity: 0 
              }}
              animate={{ 
                top: '110%', 
                rotate: 360,
                opacity: [0, 0.3, 0.1] 
              }}
              transition={{ 
                duration: 3 + Math.random() * 2, 
                delay: i * 0.3,
                ease: 'easeIn' 
              }}
            >
              ❌
            </motion.div>
          ))}
        </div>
      )}

      {/* Good (not great) animation - floating stars */}
      {isGood && !isGreat && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ 
                bottom: -50, 
                left: `${10 + Math.random() * 80}%`,
                opacity: 0 
              }}
              animate={{ 
                bottom: '110%', 
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.2, 0.8] 
              }}
              transition={{ 
                duration: 4 + Math.random() * 2, 
                delay: i * 0.4,
                ease: 'easeOut' 
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-card rounded-2xl shadow-fun p-8 md:p-12 max-w-md w-full text-center border-2 border-border relative z-10"
      >
        <motion.div
          className="text-7xl mb-4"
          animate={isBad 
            ? { scale: [1, 0.9, 1], y: [0, 5, 0] } 
            : { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
          }
          transition={{ duration: 1, repeat: 2 }}
        >
          {msg.emoji}
        </motion.div>

        <h2 className="text-3xl font-black mb-2 text-gradient-fun">{msg.text}</h2>

        <div className="my-6">
          <motion.div 
            className="text-6xl font-black text-foreground"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            {score}
            <span className="text-2xl text-muted-foreground font-semibold">/{total}</span>
          </motion.div>
          <p className="text-muted-foreground mt-2 text-lg">תשובות נכונות</p>
        </div>

        {/* Time display */}
        {totalTime > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-muted rounded-xl p-3 mb-6 inline-flex items-center gap-2"
          >
            <span className="text-xl">⏱️</span>
            <span className="font-bold text-lg tabular-nums">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <span className="text-muted-foreground text-sm">זמן כולל</span>
          </motion.div>
        )}

        {/* Score bar */}
        <div className="mb-6">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${isGreat ? 'bg-success' : isGood ? 'bg-warning' : 'bg-destructive'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {percentage}%
          </motion.p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="text-2xl"
            >
              {i < score ? '⭐' : '☆'}
            </motion.span>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="w-full bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-xl shadow-fun"
        >
          🔄 לשחק שוב!
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultsScreen;
