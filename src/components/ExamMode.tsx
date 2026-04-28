import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions, QuestionCategory, Question, categoryInfo } from '@/data/questions';
import { shuffleWithSeed } from '@/lib/seededRandom';
import Confetti from './Confetti';

interface ExamModeProps {
  onExit: () => void;
}

const EXAM_SECTIONS: { category: QuestionCategory; label: string; emoji: string; timeMinutes: number }[] = [
  { category: 'sentence-completion', label: 'השלמת משפטים', emoji: '✏️', timeMinutes: 12 },
  { category: 'word-relations', label: 'יחסי מילים', emoji: '🔗', timeMinutes: 12 },
  { category: 'math-problems', label: 'בעיות בחשבון', emoji: '🧮', timeMinutes: 12 },
  { category: 'number-sequences', label: 'סדרות מספרים', emoji: '🔢', timeMinutes: 12 },
  { category: 'shape-sequences', label: 'רצפי צורות', emoji: '🔷', timeMinutes: 12 },
];

const QUESTIONS_PER_SECTION = 10;

type ExamPhase = 'intro' | 'section-intro' | 'section-quiz' | 'section-transition' | 'results';

const optionColors = [
  'bg-primary hover:bg-primary/90 text-primary-foreground',
  'bg-secondary hover:bg-secondary/90 text-secondary-foreground',
  'bg-coral hover:bg-coral/90 text-coral-foreground',
  'bg-accent hover:bg-accent/90 text-accent-foreground',
];

const ExamMode = ({ onExit }: ExamModeProps) => {
  const [phase, setPhase] = useState<ExamPhase>('intro');
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [sectionScores, setSectionScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [sectionTimes, setSectionTimes] = useState<number[]>([0, 0, 0, 0, 0]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 100000));
  const sectionStartRef = useRef(0);

  const sectionQuestions = useMemo(() => {
    return EXAM_SECTIONS.map((section, i) => {
      const catQ = questions.filter(q => q.category === section.category);
      const shuffled = shuffleWithSeed(catQ, seed + i * 997);
      return shuffled.slice(0, Math.min(QUESTIONS_PER_SECTION, catQ.length));
    });
  }, [seed]);

  useEffect(() => {
    if (phase !== 'section-quiz' || showFeedback) return;
    if (timeRemaining <= 0) {
      finishSection();
      return;
    }
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, timeRemaining, showFeedback]);

  useEffect(() => {
    if (phase === 'section-quiz' && timeRemaining <= 0 && !showFeedback) {
      finishSection();
    }
  }, [timeRemaining, phase, showFeedback]);

  const startExam = () => {
    setSectionIdx(0);
    setPhase('section-intro');
  };

  const startSection = () => {
    const time = EXAM_SECTIONS[sectionIdx].timeMinutes * 60;
    setTimeRemaining(time);
    sectionStartRef.current = time;
    setQuestionIdx(0);
    setSelected(null);
    setShowFeedback(false);
    setPhase('section-quiz');
  };

  const handleSelect = useCallback((index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);

    const currentQ = sectionQuestions[sectionIdx][questionIdx];
    if (index === currentQ.correctIndex) {
      setSectionScores(prev => {
        const next = [...prev];
        next[sectionIdx]++;
        return next;
      });
    }

    setTimeout(() => {
      if (questionIdx + 1 >= sectionQuestions[sectionIdx].length) {
        finishSection();
      } else {
        setQuestionIdx(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
      }
    }, 800);
  }, [showFeedback, sectionIdx, questionIdx, sectionQuestions]);

  const finishSection = useCallback(() => {
    const timeUsed = sectionStartRef.current - timeRemaining;
    setSectionTimes(prev => {
      const next = [...prev];
      next[sectionIdx] = timeUsed;
      return next;
    });
    setSelected(null);
    setShowFeedback(false);

    if (sectionIdx + 1 >= EXAM_SECTIONS.length) {
      setPhase('results');
    } else {
      setPhase('section-transition');
    }
  }, [sectionIdx, timeRemaining]);

  const nextSection = () => {
    setSectionIdx(prev => prev + 1);
    setQuestionIdx(0);
    setPhase('section-intro');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalScore = sectionScores.reduce((a, b) => a + b, 0);
  const totalQuestions = EXAM_SECTIONS.length * QUESTIONS_PER_SECTION;
  const totalTime = sectionTimes.reduce((a, b) => a + b, 0);

  // ==================== INTRO ====================
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full text-center"
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📝
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-black text-gradient-fun mb-3">
            מבחן לדוגמה
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            סימולציה של מבחן מחוננים שלב ב׳
          </p>

          <div className="bg-card rounded-2xl border-2 border-border p-6 mb-6 text-right">
            <h3 className="font-bold text-lg mb-3 text-center">מבנה המבחן</h3>
            <div className="space-y-2">
              {EXAM_SECTIONS.map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-muted rounded-xl px-4 py-2">
                  <span className="text-sm text-muted-foreground">{s.timeMinutes} דקות • {QUESTIONS_PER_SECTION} שאלות</span>
                  <span className="font-semibold flex items-center gap-2">
                    {s.label} <span className="text-xl">{s.emoji}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-sm">
              <span className="font-bold">סה״כ: {EXAM_SECTIONS.length * QUESTIONS_PER_SECTION} שאלות • {EXAM_SECTIONS.reduce((a, s) => a + s.timeMinutes, 0)} דקות</span>
              <span className="text-xl">⏱️</span>
            </div>
          </div>

          <div className="bg-muted rounded-xl p-4 mb-6 text-sm text-muted-foreground text-right space-y-1">
            <p>• לכל פרק יש טיימר - כשנגמר הזמן עוברים לפרק הבא</p>
            <p>• אין ניקוד שלילי - תמיד כדאי לנחש!</p>
            <p>• אי אפשר לחזור לפרק קודם</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startExam}
            className="w-full bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-fun mb-3"
          >
            🚀 התחלת מבחן
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExit}
            className="w-full text-muted-foreground font-semibold text-lg py-3 rounded-xl hover:bg-muted transition-colors"
          >
            ⬅️ חזרה
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ==================== SECTION INTRO ====================
  if (phase === 'section-intro') {
    const section = EXAM_SECTIONS[sectionIdx];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            {EXAM_SECTIONS.map((_, i) => (
              <div
                key={i}
                className={`w-10 h-2 rounded-full ${i < sectionIdx ? 'bg-success' : i === sectionIdx ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>

          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {section.emoji}
          </motion.div>

          <p className="text-sm text-muted-foreground mb-1">פרק {sectionIdx + 1} מתוך {EXAM_SECTIONS.length}</p>
          <h2 className="text-3xl font-black text-gradient-fun mb-2">{section.label}</h2>
          <p className="text-muted-foreground mb-6">
            {QUESTIONS_PER_SECTION} שאלות • {section.timeMinutes} דקות
          </p>

          <div className="bg-muted rounded-xl p-4 mb-6 text-sm text-muted-foreground">
            {categoryInfo[section.category].description}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startSection}
            className="w-full bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-fun"
          >
            ▶️ התחלת פרק
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ==================== SECTION QUIZ ====================
  if (phase === 'section-quiz') {
    const section = EXAM_SECTIONS[sectionIdx];
    const currentQ = sectionQuestions[sectionIdx][questionIdx];
    if (!currentQ) {
      finishSection();
      return null;
    }

    const isLow = timeRemaining <= 60;
    const isCritical = timeRemaining <= 30;
    const progress = (timeRemaining / (section.timeMinutes * 60)) * 100;
    const isShapeCategory = currentQ.category === 'shape-sequences';

    return (
      <div className="min-h-screen flex flex-col p-4 md:p-8">
        <div className="max-w-2xl mx-auto w-full mb-4">
          {/* Section header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{section.emoji}</span>
              <span className="font-bold text-sm">{section.label}</span>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                פרק {sectionIdx + 1}/{EXAM_SECTIONS.length}
              </span>
            </div>
            <motion.div
              className={`flex items-center gap-2 rounded-full px-4 py-2 border-2 font-bold tabular-nums ${
                isCritical ? 'bg-destructive/10 border-destructive text-destructive' :
                isLow ? 'bg-warning/10 border-warning text-warning' :
                'bg-card border-border text-foreground'
              }`}
              animate={isCritical ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span>⏱️</span>
              <span>{formatTime(timeRemaining)}</span>
            </motion.div>
          </div>

          {/* Timer progress bar */}
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              className={`h-full rounded-full ${isCritical ? 'bg-destructive' : isLow ? 'bg-warning' : 'bg-gradient-fun'}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Question progress */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>שאלה {questionIdx + 1} מתוך {sectionQuestions[sectionIdx].length}</span>
            <div className="flex gap-1">
              {sectionQuestions[sectionIdx].map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full ${i < questionIdx ? 'bg-primary' : i === questionIdx ? 'bg-primary animate-pulse' : 'bg-muted-foreground/20'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className="flex-1 flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${sectionIdx}-${questionIdx}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-2xl mx-auto"
            >
              <div className="bg-card rounded-2xl shadow-fun p-6 md:p-8 border-2 border-border">
                {currentQ.image && (
                  <div className="mb-4 rounded-xl overflow-hidden border-2 border-border bg-white">
                    <img src={currentQ.image} alt="שאלה" className="w-full h-auto max-h-56 object-contain mx-auto" />
                  </div>
                )}

                <h2 className="text-xl md:text-2xl font-bold mb-6 leading-relaxed">
                  {currentQ.prompt}
                </h2>

                <div className="grid gap-3">
                  {currentQ.options.map((option, index) => {
                    let stateClass = '';
                    if (showFeedback) {
                      if (index === currentQ.correctIndex) {
                        stateClass = '!bg-success !text-success-foreground ring-4 ring-success/30';
                      } else if (index === selected && index !== currentQ.correctIndex) {
                        stateClass = '!bg-destructive !text-destructive-foreground ring-4 ring-destructive/30';
                      } else {
                        stateClass = 'opacity-40';
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        onClick={() => handleSelect(index)}
                        disabled={showFeedback}
                        className={`w-full text-right p-4 rounded-xl font-semibold text-lg transition-all duration-200 ${optionColors[index]} ${stateClass} cursor-pointer disabled:cursor-default`}
                      >
                        <span className={`flex items-center gap-3 ${isShapeCategory ? 'justify-center' : ''}`}>
                          <span className="bg-card/20 rounded-full w-8 h-8 flex items-center justify-center text-sm shrink-0">
                            {index + 1}
                          </span>
                          <span className={isShapeCategory ? 'text-4xl leading-none' : ''}>{option}</span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ==================== SECTION TRANSITION ====================
  if (phase === 'section-transition') {
    const completedSection = EXAM_SECTIONS[sectionIdx];
    const sectionScore = sectionScores[sectionIdx];
    const nextSec = EXAM_SECTIONS[sectionIdx + 1];

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <motion.div
            className="text-6xl mb-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6 }}
          >
            ✅
          </motion.div>
          <h2 className="text-2xl font-black mb-2">סיימת את פרק {sectionIdx + 1}!</h2>
          <p className="text-lg text-muted-foreground mb-1">
            {completedSection.emoji} {completedSection.label}
          </p>
          <p className="text-3xl font-black text-gradient-fun mb-1">
            {sectionScore} / {sectionQuestions[sectionIdx].length}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            ⏱️ {formatTime(sectionTimes[sectionIdx])}
          </p>

          <div className="bg-muted rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground">הפרק הבא:</p>
            <p className="font-bold text-lg">
              {nextSec.emoji} {nextSec.label}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSection}
            className="w-full bg-gradient-fun text-primary-foreground font-bold text-xl py-4 rounded-2xl shadow-fun"
          >
            ▶️ המשך לפרק הבא
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ==================== RESULTS ====================
  const percentage = Math.round((totalScore / totalQuestions) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 50;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <Confetti show={isGreat} />

      {isGood && !isGreat && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ bottom: -50, left: `${10 + Math.random() * 80}%`, opacity: 0 }}
              animate={{ bottom: '110%', opacity: [0, 0.6, 0], scale: [0.5, 1.2, 0.8] }}
              transition={{ duration: 4 + Math.random() * 2, delay: i * 0.4, ease: 'easeOut' }}
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
        className="bg-card rounded-2xl shadow-fun p-6 md:p-10 max-w-lg w-full text-center border-2 border-border relative z-10"
      >
        <motion.div
          className="text-6xl mb-3"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: 2 }}
        >
          {isGreat ? '🏆' : isGood ? '👏' : '💪'}
        </motion.div>

        <h2 className="text-2xl font-black text-gradient-fun mb-1">
          {isGreat ? 'מדהים! ביצועים מעולים!' : isGood ? 'כל הכבוד! עבודה טובה!' : 'המשיכו להתאמן!'}
        </h2>
        <p className="text-muted-foreground mb-4">תוצאות המבחן</p>

        {/* Total score */}
        <motion.div
          className="text-5xl font-black mb-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {totalScore}
          <span className="text-xl text-muted-foreground font-semibold">/{totalQuestions}</span>
        </motion.div>
        <p className="text-lg font-bold mb-1">{percentage}%</p>
        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4 mx-8">
          <motion.div
            className={`h-full rounded-full ${isGreat ? 'bg-success' : isGood ? 'bg-warning' : 'bg-destructive'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>

        {/* Time */}
        <div className="bg-muted rounded-xl px-4 py-2 mb-5 inline-flex items-center gap-2">
          <span>⏱️</span>
          <span className="font-bold tabular-nums">{formatTime(totalTime)}</span>
          <span className="text-sm text-muted-foreground">זמן כולל</span>
        </div>

        {/* Per-section breakdown */}
        <div className="space-y-2 mb-6">
          {EXAM_SECTIONS.map((section, i) => {
            const sScore = sectionScores[i];
            const sTotal = sectionQuestions[i].length;
            const sPct = Math.round((sScore / sTotal) * 100);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-center justify-between bg-muted rounded-xl px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sPct >= 80 ? 'bg-success/20 text-success' : sPct >= 50 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}`}>
                    {sPct}%
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{sScore}/{sTotal}</span>
                  <span className="text-xs text-muted-foreground">⏱️ {formatTime(sectionTimes[i])}</span>
                </div>
                <span className="font-semibold text-sm flex items-center gap-1">
                  {section.label} {section.emoji}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setSectionScores([0, 0, 0, 0, 0]);
              setSectionTimes([0, 0, 0, 0, 0]);
              setSectionIdx(0);
              setQuestionIdx(0);
              setPhase('intro');
            }}
            className="bg-gradient-fun text-primary-foreground font-bold text-lg py-3 rounded-xl shadow-fun"
          >
            🔄 מבחן חדש
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExit}
            className="bg-muted text-foreground font-bold text-lg py-3 rounded-xl border-2 border-border"
          >
            🏠 חזרה הביתה
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ExamMode;
