
import React, { useState, useCallback } from 'react';
import { GameMode, Question } from './types';
import { GAME_ICONS, MAX_NUMBER } from './constants';
import { getEncouragement, getImmediateFeedback } from './services/geminiService';
import VisualEquation from './components/VisualEquation';
import FeedbackModal from './components/FeedbackModal';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.HOME);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  const generateQuestion = useCallback((operationType?: '+' | '-') => {
    const op = operationType || (Math.random() > 0.5 ? '+' : '-');
    let n1 = Math.floor(Math.random() * MAX_NUMBER) + 1;
    let n2 = Math.floor(Math.random() * MAX_NUMBER) + 1;

    if (op === '-') {
      if (n2 > n1) [n1, n2] = [n2, n1];
    }

    const answer = op === '+' ? n1 + n2 : n1 - n2;
    
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 3) {
      const wrong = Math.max(0, Math.min(10, answer + (Math.floor(Math.random() * 5) - 2)));
      optionsSet.add(wrong);
    }

    const icon = GAME_ICONS[Math.floor(Math.random() * GAME_ICONS.length)].emoji;

    setCurrentQuestion({
      id: Math.random().toString(),
      num1: n1,
      num2: n2,
      operation: op,
      icon,
      correctAnswer: answer,
      options: Array.from(optionsSet).sort((a, b) => a - b)
    });
  }, []);

  const startMode = (newMode: GameMode) => {
    setMode(newMode);
    setScore(0);
    setQuestionCount(0);
    setFeedback(null);
    
    let op: '+' | '-' | undefined;
    if (newMode === GameMode.LEARN_ADD) op = '+';
    if (newMode === GameMode.LEARN_SUB) op = '-';
    
    generateQuestion(op);
  };

  const handleAnswer = (selected: number) => {
    if (!currentQuestion || feedback) return;

    const isCorrect = selected === currentQuestion.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    
    // الخطوة 1: إظهار الرسالة الفورية (هذا يمنع التعليق تماماً)
    const initialMsg = getImmediateFeedback(isCorrect);
    setFeedback({ isCorrect, message: initialMsg });

    // الخطوة 2: محاولة تحسين الرسالة عبر Gemini في الخلفية
    getEncouragement(isCorrect).then(smartMsg => {
      if (smartMsg) {
        setFeedback(prev => prev ? { ...prev, message: smartMsg } : null);
      }
    }).catch(() => {
      // إذا حدث أي خطأ في الخلفية، لا نفعل شيئاً ونبقى على الرسالة الفورية
    });
  };

  const nextStep = () => {
    setFeedback(null);
    const nextCount = questionCount + 1;
    setQuestionCount(nextCount);
    
    if (nextCount >= 5) {
      setMode(GameMode.HOME);
    } else {
      let op: '+' | '-' | undefined;
      if (mode === GameMode.LEARN_ADD) op = '+';
      if (mode === GameMode.LEARN_SUB) op = '-';
      generateQuestion(op);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-black text-blue-600 mb-4 animate-bounce">
          عالم الأرقام 🌈
        </h1>
        <p className="text-2xl text-gray-600 font-bold">هيا نلعب ونتعلم الحساب!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <button
          onClick={() => startMode(GameMode.LEARN_ADD)}
          className="bg-green-400 hover:bg-green-500 text-white p-8 rounded-[2.5rem] shadow-xl transform transition hover:scale-105 active:scale-95 border-b-8 border-green-600"
        >
          <span className="text-6xl block mb-4">🍎➕🍎</span>
          <span className="text-2xl font-black">تعلم الجمع</span>
        </button>

        <button
          onClick={() => startMode(GameMode.LEARN_SUB)}
          className="bg-pink-400 hover:bg-pink-500 text-white p-8 rounded-[2.5rem] shadow-xl transform transition hover:scale-105 active:scale-95 border-b-8 border-pink-600"
        >
          <span className="text-6xl block mb-4">🍌➖🍌</span>
          <span className="text-2xl font-black">تعلم الطرح</span>
        </button>

        <button
          onClick={() => startMode(GameMode.QUIZ)}
          className="bg-yellow-400 hover:bg-yellow-500 text-white p-8 rounded-[2.5rem] shadow-xl transform transition hover:scale-105 active:scale-95 border-b-8 border-yellow-600"
        >
          <span className="text-6xl block mb-4">🏆</span>
          <span className="text-2xl font-black">اختبار الذكاء</span>
        </button>
      </div>
    </div>
  );

  const renderGame = () => {
    if (!currentQuestion) return null;

    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6">
          <button 
            onClick={() => setMode(GameMode.HOME)}
            className="text-gray-500 font-bold bg-white px-4 py-2 rounded-2xl hover:bg-red-50 transition shadow-sm"
          >
            🏠 القائمة
          </button>
          <div className="bg-white px-6 py-2 rounded-full shadow-md text-blue-600 font-black text-xl">
             السؤال {questionCount + 1}
          </div>
          <div className="bg-green-500 px-6 py-2 rounded-full text-white font-black shadow-md">
            ⭐ {score}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md w-full rounded-[3.5rem] p-8 shadow-2xl border-b-[12px] border-blue-200">
          <h2 className="text-3xl font-black text-center text-blue-800 mb-8">
            كم عدد {GAME_ICONS.find(i => i.emoji === currentQuestion.icon)?.name}ات؟
          </h2>

          <VisualEquation 
            num1={currentQuestion.num1} 
            num2={currentQuestion.num2} 
            operation={currentQuestion.operation}
            icon={currentQuestion.icon}
          />

          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12">
            {currentQuestion.options.map((opt) => (
              <button
                key={opt}
                disabled={!!feedback}
                onClick={() => handleAnswer(opt)}
                className="bg-white border-4 border-blue-400 hover:bg-blue-50 text-blue-600 text-4xl md:text-6xl font-black py-8 rounded-[2rem] shadow-lg transform transition active:scale-90 disabled:opacity-80"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4 relative overflow-hidden">
      {/* عناصر جمالية في الخلفية */}
      <div className="absolute top-10 left-10 text-4xl opacity-30 animate-float">🎈</div>
      <div className="absolute bottom-10 right-10 text-4xl opacity-30 animate-float" style={{animationDelay: '1s'}}>☁️</div>
      <div className="absolute top-40 right-10 text-4xl opacity-30 animate-float" style={{animationDelay: '2s'}}>🦋</div>

      {mode === GameMode.HOME ? renderHome() : renderGame()}

      {feedback && (
        <FeedbackModal 
          isCorrect={feedback.isCorrect} 
          message={feedback.message} 
          onNext={nextStep} 
        />
      )}
    </div>
  );
};

export default App;
