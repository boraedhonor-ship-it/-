
import React from 'react';

interface VisualEquationProps {
  num1: number;
  num2: number;
  operation: '+' | '-';
  icon: string;
}

const VisualEquation: React.FC<VisualEquationProps> = ({ num1, num2, operation, icon }) => {
  const renderIcons = (count: number, color: string) => (
    <div className={`flex flex-wrap gap-2 justify-center p-4 bg-white rounded-2xl shadow-sm border-2 ${color}`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-4xl md:text-5xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
          {icon}
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 my-8">
      <div className="flex flex-col items-center">
        {renderIcons(num1, 'border-blue-200')}
        <span className="text-2xl font-bold mt-2 text-blue-600">{num1}</span>
      </div>

      <div className="text-5xl font-black text-pink-500 bg-white w-16 h-16 rounded-full flex items-center justify-center shadow-md">
        {operation === '+' ? '➕' : '➖'}
      </div>

      <div className="flex flex-col items-center">
        {renderIcons(num2, 'border-green-200')}
        <span className="text-2xl font-bold mt-2 text-green-600">{num2}</span>
      </div>

      <div className="text-5xl font-black text-yellow-500">=</div>

      <div className="w-24 h-24 bg-white rounded-3xl border-4 border-dashed border-yellow-400 flex items-center justify-center">
        <span className="text-5xl">؟</span>
      </div>
    </div>
  );
};

export default VisualEquation;
