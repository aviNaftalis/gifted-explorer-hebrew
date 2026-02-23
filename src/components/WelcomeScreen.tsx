import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

const floatingEmojis = ['🌟', '🧠', '🚀', '📚', '✨', '💡', '🎯', '🏆'];

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Floating background emojis */}
      {floatingEmojis.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute text-3xl md:text-4xl select-none pointer-events-none"
          style={{
            top: `${10 + Math.random() * 70}%`,
            left: `${5 + Math.random() * 85}%`,
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        >
          {emoji}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-lg"
      >
        <motion.div
          className="text-7xl md:text-8xl mb-6"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🧠
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black mb-4 text-gradient-fun leading-tight">
          אתגר המחוננים!
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
          בואו נתרגל שאלות ונתכונן למבחן המחוננים! 🎯
          <br />
          <span className="text-base">יחסי מילים, השלמת משפטים ובעיות חשבון</span>
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-gradient-fun text-primary-foreground font-bold text-xl px-10 py-4 rounded-2xl shadow-fun"
        >
          🚀 יאללה, מתחילים!
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex justify-center gap-4 text-sm text-muted-foreground"
        >
          <span className="bg-muted rounded-full px-3 py-1">🔗 יחסי מילים</span>
          <span className="bg-muted rounded-full px-3 py-1">✏️ משפטים</span>
          <span className="bg-muted rounded-full px-3 py-1">🔢 חשבון</span>
          <span className="bg-muted rounded-full px-3 py-1">🔷 צורות</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
