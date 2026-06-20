
import React from 'react';

interface FeedbackModalProps {
  isCorrect: boolean;
  message: string;
  onNext: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isCorrect, message, onNext }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all ${isCorrect ? 'scale-110' : 'scale-100'}`}>
        <div className="text-7xl mb-4">
          {isCorrect ? '🌟' : '💡'}
        </div>
        <h2 className={`text-3xl font-bold mb-4 ${isCorrect ? 'text-green-500' : 'text-orange-500'}`}>
          {isCorrect ? 'رائع!' : 'معلومة جديدة!'}
        </h2>
        <p className="text-xl text-gray-700 mb-8 font-medium">
          {message}
        </p>
        <button
          onClick={onNext}
          className={`w-full py-4 rounded-2xl text-white text-xl font-bold shadow-lg transform active:scale-95 transition-transform ${isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {isCorrect ? 'السؤال التالي ⬅️' : 'فهمت، السؤال التالي ⬅️'}
        </button>
      </div>
    </div>
  );
};

export default FeedbackModal;
