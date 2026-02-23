import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  show: boolean;
}

const colors = [
  'hsl(174, 60%, 45%)',
  'hsl(280, 50%, 65%)',
  'hsl(10, 80%, 62%)',
  'hsl(45, 95%, 58%)',
  'hsl(260, 55%, 72%)',
  'hsl(145, 60%, 45%)',
];

const Confetti = ({ show }: ConfettiProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: window.innerHeight + 20,
              rotate: Math.random() * 720,
              x: Math.random() * window.innerWidth,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: Math.random() * 2 + 1.5,
              delay: Math.random() * 0.5,
              ease: 'easeIn',
            }}
            className="absolute rounded-md"
            style={{
              width: Math.random() * 10 + 6,
              height: Math.random() * 10 + 6,
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Confetti;
