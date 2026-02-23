import { motion } from 'framer-motion';
import { QuestionCategory, categoryInfo, questions } from '@/data/questions';

interface CategorySelectScreenProps {
  onSelectCategory: (category: QuestionCategory | 'all') => void;
  onBack: () => void;
}

const CategorySelectScreen = ({ onSelectCategory, onBack }: CategorySelectScreenProps) => {
  const categories = Object.entries(categoryInfo) as [QuestionCategory, typeof categoryInfo[QuestionCategory]][];

  const getQuestionCount = (cat: QuestionCategory) =>
    questions.filter((q) => q.category === cat).length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-3"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📋
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-black text-gradient-fun mb-2">
            בחרו נושא לתרגול
          </h2>
          <p className="text-muted-foreground text-lg">
            תתרגלו נושא ספציפי או את כל השאלות ביחד!
          </p>
        </div>

        {/* All questions button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelectCategory('all')}
          className="w-full mb-4 bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-fun"
        >
          🎯 כל השאלות ({questions.length})
        </motion.button>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categories.map(([key, info], i) => {
            const count = getQuestionCount(key);
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectCategory(key)}
                className="bg-card rounded-2xl border-2 border-border p-5 text-right shadow-fun hover:shadow-candy transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{info.emoji}</span>
                  <span className="font-bold text-lg">{info.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{info.description}</p>
                <div className="mt-2 text-xs font-semibold bg-muted rounded-full px-3 py-1 inline-block">
                  {count} שאלות
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={onBack}
          className="mt-6 w-full text-muted-foreground font-semibold text-lg py-3 rounded-xl hover:bg-muted transition-colors"
        >
          ⬅️ חזרה
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CategorySelectScreen;
