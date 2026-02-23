export type QuestionCategory = 'word-relations' | 'sentence-completion' | 'math-problems';

export interface Question {
  id: number;
  category: QuestionCategory;
  categoryLabel: string;
  categoryEmoji: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const questions: Question[] = [
  // יחסי מילים
  {
    id: 1,
    category: 'word-relations',
    categoryLabel: 'יחסי מילים',
    categoryEmoji: '🔗',
    prompt: 'כתום : גזר',
    options: ['שחור : לילה', 'מבריק : זהב', 'ירוק : דשא', 'כבד : משקולת'],
    correctIndex: 2,
    explanation: 'לגזר יש צבע כתום, ולדשא יש צבע ירוק. הקשר הוא צבע אופייני של דבר.',
  },
  {
    id: 2,
    category: 'word-relations',
    categoryLabel: 'יחסי מילים',
    categoryEmoji: '🔗',
    prompt: 'ספר : מדף',
    options: ['בגד : ארון', 'עט : כתיבה', 'תפוח : אדום', 'שולחן : כיסא'],
    correctIndex: 0,
    explanation: 'ספר נמצא על מדף, ובגד נמצא בארון. הקשר הוא מקום אחסון.',
  },
  {
    id: 3,
    category: 'word-relations',
    categoryLabel: 'יחסי מילים',
    categoryEmoji: '🔗',
    prompt: 'רופא : בית חולים',
    options: ['מורה : בית ספר', 'ילד : משחק', 'כלב : חתול', 'מים : ים'],
    correctIndex: 0,
    explanation: 'רופא עובד בבית חולים, ומורה עובד/ת בבית ספר. הקשר הוא מקום עבודה.',
  },
  // השלמת משפטים
  {
    id: 4,
    category: 'sentence-completion',
    categoryLabel: 'השלמת משפטים',
    categoryEmoji: '✏️',
    prompt: 'בחדשות אמרו שצפוי מזג אוויר _____, ולכן נאלצנו _____ את הטיול השנתי.',
    options: ['גשום ; לקיים', 'נפלא ; לבטל', 'קשה ; להשאיר', 'סוער ; לדחות'],
    correctIndex: 3,
    explanation: 'אם מזג האוויר סוער, הגיוני שנאלץ לדחות את הטיול השנתי.',
  },
  {
    id: 5,
    category: 'sentence-completion',
    categoryLabel: 'השלמת משפטים',
    categoryEmoji: '✏️',
    prompt: 'הכלב _____ בשמחה כשבעליו _____ הביתה.',
    options: ['נבח ; יצא', 'ישן ; הלך', 'קפץ ; חזר', 'ברח ; נכנס'],
    correctIndex: 2,
    explanation: 'כלבים שמחים כשבעליהם חוזרים הביתה ולכן קופצים בשמחה.',
  },
  {
    id: 6,
    category: 'sentence-completion',
    categoryLabel: 'השלמת משפטים',
    categoryEmoji: '✏️',
    prompt: 'הספרייה היא מקום _____ שבו אפשר _____ ספרים.',
    options: ['רועש ; לקנות', 'שקט ; לקרוא', 'גדול ; לבשל', 'קטן ; לשחק'],
    correctIndex: 1,
    explanation: 'ספרייה היא מקום שקט שבו אפשר לקרוא ולשאול ספרים.',
  },
  // בעיות בחשבון
  {
    id: 7,
    category: 'math-problems',
    categoryLabel: 'בעיות בחשבון',
    categoryEmoji: '🔢',
    prompt: 'חמישה חברים קנו תחפושת. כל אחד שילם 16 שקלים, וכל אחד קיבל 2 שקלים עודף בחזרה. כמה עלתה התחפושת?',
    options: ['60 שקלים', '80 שקלים', '70 שקלים', '58 שקלים'],
    correctIndex: 2,
    explanation: 'כל אחד שילם בפועל 14 שקלים (16 פחות 2). סה"כ: 5 × 14 = 70 שקלים.',
  },
  {
    id: 8,
    category: 'math-problems',
    categoryLabel: 'בעיות בחשבון',
    categoryEmoji: '🔢',
    prompt: 'לדנה יש 24 סוכריות. היא חילקה אותן שווה בשווה בין 4 חברות. כמה סוכריות קיבלה כל חברה?',
    options: ['4', '8', '6', '12'],
    correctIndex: 2,
    explanation: '24 חלקי 4 שווה 6. כל חברה קיבלה 6 סוכריות.',
  },
  {
    id: 9,
    category: 'math-problems',
    categoryLabel: 'בעיות בחשבון',
    categoryEmoji: '🔢',
    prompt: 'אוטובוס יצא עם 30 נוסעים. בתחנה הראשונה ירדו 8 ועלו 5. כמה נוסעים באוטובוס עכשיו?',
    options: ['25', '27', '23', '35'],
    correctIndex: 1,
    explanation: '30 פחות 8 שווה 22, ועוד 5 שווה 27 נוסעים.',
  },
  {
    id: 10,
    category: 'math-problems',
    categoryLabel: 'בעיות בחשבון',
    categoryEmoji: '🔢',
    prompt: 'לעומר יש 3 מדפים. בכל מדף 7 ספרים. כמה ספרים יש לעומר?',
    options: ['10', '24', '21', '18'],
    correctIndex: 2,
    explanation: '3 כפול 7 שווה 21 ספרים.',
  },
];

export const categoryInfo: Record<QuestionCategory, { label: string; emoji: string; color: string }> = {
  'word-relations': { label: 'יחסי מילים', emoji: '🔗', color: 'primary' },
  'sentence-completion': { label: 'השלמת משפטים', emoji: '✏️', color: 'secondary' },
  'math-problems': { label: 'בעיות בחשבון', emoji: '🔢', color: 'coral' },
};
