
import React from 'react';
import { AnswerResult, Question } from '../types';

interface QuestionNavigationProps {
  questions: Question[];
  answers: Record<number, AnswerResult>;
  currentIndex: number;
  onSelectQuestion: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  answers,
  currentIndex,
  onSelectQuestion,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mt-6 w-full max-w-3xl">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
        Question Map
      </h3>
      <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
        {questions.map((q, idx) => {
          const result = answers[q.id];
          let btnClass = "w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm font-bold rounded-lg flex items-center justify-center transition-all ";
          
          if (idx === currentIndex) {
            btnClass += "ring-2 ring-offset-2 ring-blue-500 ";
          }

          if (result) {
            if (result.isCorrect) {
              btnClass += "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200";
            } else {
              btnClass += "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200";
            }
          } else {
            btnClass += "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200";
          }

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={btnClass}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-1"></span> Correct</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-1"></span> Incorrect</div>
        <div className="flex items-center"><span className="w-3 h-3 bg-slate-100 border border-slate-200 rounded mr-1"></span> Unanswered</div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
