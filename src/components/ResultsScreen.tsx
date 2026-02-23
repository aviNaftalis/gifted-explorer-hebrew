import { motion } from 'framer-motion';
import Confetti from './Confetti';

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

const ResultsScreen = ({ score, total, onRestart }: ResultsScreenProps) => {
  const percentage = Math.round((score / total) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 50;

  const getMessage = () => {
    if (isGreat) return { emoji: '🏆', text: 'מדהים! אתה/את כוכב/ת!' };
    if (isGood) return { emoji: '👏', text: 'כל הכבוד! עבודה טובה!' };
    return { emoji: '💪', text: 'המשיכו להתאמן, אתם משתפרים!' };
  };

  const msg = getMessage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Confetti show={isGreat} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="bg-card rounded-2xl shadow-fun p-8 md:p-12 max-w-md w-full text-center border-2 border-border"
      >
        <motion.div
          className="text-7xl mb-4"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: 2 }}
        >
          {msg.emoji}
        </motion.div>

        <h2 className="text-3xl font-black mb-2 text-gradient-fun">{msg.text}</h2>

        <div className="my-6">
          <div className="text-6xl font-black text-foreground">
            {score}
            <span className="text-2xl text-muted-foreground font-semibold">/{total}</span>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">תשובות נכונות</p>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: total }).map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
              className="text-3xl"
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
