
import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (name: string) => void;
  totalQuestions: number;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, totalQuestions }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full">
        <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce-short">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
          IOE English Master
        </h1>
        <p className="text-slate-500 text-lg mb-6 font-medium">
          Grade 8 - Exam #05
        </p>

        <div className="text-left bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
           <label htmlFor="playerName" className="block text-sm font-bold text-slate-700 mb-2">
             Enter your name to start:
           </label>
           <input 
             type="text" 
             id="playerName"
             value={name}
             onChange={(e) => setName(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
             placeholder="Your Name (e.g. Nguyen Van A)"
             className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold text-slate-800 placeholder-slate-400"
             autoFocus
           />
        </div>

        <div className="space-y-4 mb-8 text-left text-sm text-slate-600 px-2">
          <div className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xs font-bold">1</span>
            <span>Answer <strong>{totalQuestions} questions</strong> (10 points each)</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 text-xs font-bold">2</span>
            <span>Learn from detailed explanations</span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
