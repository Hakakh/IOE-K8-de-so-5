
import React, { useState } from 'react';
import { AnswerResult } from '../types';

interface ResultScreenProps {
  playerName: string;
  score: number;
  points: number;
  total: number;
  results: AnswerResult[];
  onRestart: () => void;
  onRetryWrong: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ playerName, score, points, total, results, onRestart, onRetryWrong }) => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const wrongCount = total - score;
  
  let message = "Good effort!";
  let color = "text-blue-600";
  
  if (percentage >= 90) {
      message = "Outstanding!";
      color = "text-yellow-400";
  } else if (percentage >= 70) {
      message = "Great Job!";
      color = "text-green-400";
  } else if (percentage < 50) {
      message = "Keep Practicing!";
      color = "text-slate-300";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-fade-in max-w-2xl mx-auto w-full mb-10">
      <div className="bg-white rounded-3xl shadow-2xl w-full overflow-hidden">
        <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
             {/* Background decoration */}
             <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-blue-500 to-purple-500 rotate-12"></div>
             </div>
             
             <h2 className="text-2xl md:text-3xl font-bold mb-2 relative z-10">{message} {playerName}!</h2>
             <div className={`text-6xl font-extrabold mb-2 relative z-10 ${color}`}>
                {points} <span className="text-2xl font-bold text-white opacity-80">pts</span>
             </div>
             <p className="text-slate-300 relative z-10">You answered {score} out of {total} correctly</p>
        </div>

        <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <span className="block text-2xl font-bold text-green-700">{score}</span>
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Correct</span>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                    <span className="block text-2xl font-bold text-red-700">{wrongCount}</span>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Incorrect</span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <button
                    onClick={onRestart}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform active:scale-95"
                >
                    Restart Full Exam
                </button>
                
                {wrongCount > 0 && (
                    <button
                        onClick={onRetryWrong}
                        className="w-full bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold py-4 px-8 rounded-xl transition-transform active:scale-95"
                    >
                        Retry Incorrect Answers ({wrongCount})
                    </button>
                )}
            </div>
            
            <div className="border-t pt-6">
                <h3 className="font-bold text-gray-700 mb-4">Question Summary</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {results.map((res, index) => (
                        <div key={index} className={`flex items-start p-3 rounded-lg text-sm ${res.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                            <span className={`font-bold mr-3 ${res.isCorrect ? 'text-green-600' : 'text-red-600'}`}>#{index + 1}</span>
                            <div className="flex-1">
                                <p className="text-gray-800 mb-1 font-medium truncate">{res.userAnswer || "(No Answer)"}</p>
                                {!res.isCorrect && (
                                    <div className="mt-1">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Correct Answer:</p>
                                        <p className="text-green-600 font-medium">{res.correctAnswer}</p>
                                    </div>
                                )}
                            </div>
                            <div className="ml-2">
                                {res.isCorrect ? (
                                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
