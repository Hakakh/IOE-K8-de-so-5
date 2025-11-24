
import React, { useState, useEffect } from 'react';
import { Question, QuestionType } from '../types';
import AudioPlayer from './AudioPlayer';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (answer: string) => void;
  showFeedback: boolean;
  userAnswer: string | null;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSubmit,
  showFeedback,
  userAnswer
}) => {
  const [inputValue, setInputValue] = useState('');
  const [rearrangeOrder, setRearrangeOrder] = useState<string[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [isHintVisible, setIsHintVisible] = useState(false);

  useEffect(() => {
    setInputValue('');
    setIsHintVisible(false); // Reset hint state on new question
    
    if (question.type === QuestionType.REARRANGE && question.rearrangeParts) {
      setRearrangeOrder([]);
      setAvailableParts([...question.rearrangeParts]); 
    }
    // Pre-fill input if there is a previous answer (useful for review/navigation)
    if (userAnswer) {
        if (question.type !== QuestionType.REARRANGE) {
            setInputValue(userAnswer);
        }
    }
  }, [question, userAnswer, showFeedback]);

  const handleSubmit = () => {
    if (showFeedback) return;

    let finalAnswer = '';
    if (question.type === QuestionType.MULTIPLE_CHOICE) {
        finalAnswer = inputValue;
    } else if (question.type === QuestionType.FILL_IN_BLANK) {
        finalAnswer = inputValue.trim();
    } else if (question.type === QuestionType.REARRANGE) {
        finalAnswer = rearrangeOrder.join(' ');
    }
    
    if (finalAnswer) {
        onAnswerSubmit(finalAnswer);
    }
  };

  const handleOptionClick = (option: string) => {
    if (showFeedback) return;
    setInputValue(option);
    onAnswerSubmit(option);
  };

  const handleRearrangeClick = (word: string, fromAvailable: boolean) => {
    if (showFeedback) return;

    if (fromAvailable) {
      setAvailableParts(prev => prev.filter(w => w !== word));
      setRearrangeOrder(prev => [...prev, word]);
    } else {
      setRearrangeOrder(prev => prev.filter(w => w !== word));
      setAvailableParts(prev => [...prev, word]);
    }
  };

  const isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-3xl w-full mx-auto animate-fade-in relative overflow-hidden flex flex-col">
      {/* Question Header & Media */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2 flex-wrap">
                 <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-blue-600 bg-blue-100 rounded-full mb-2">
                    QUESTION {question.id}
                </span>
                {!showFeedback && (
                    <button
                        onClick={() => setIsHintVisible(!isHintVisible)}
                        className={`inline-flex items-center px-3 py-1 text-xs font-bold tracking-wider rounded-full mb-2 transition-colors ${
                            isHintVisible 
                            ? 'bg-yellow-200 text-yellow-800' 
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                    >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>
                        {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                    </button>
                )}
            </div>
             {question.type === QuestionType.REARRANGE && (
                 <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">Tap words to arrange</span>
             )}
        </div>
        
        {/* Hint Box */}
        {isHintVisible && !showFeedback && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg animate-fade-in">
                <p className="text-sm text-yellow-800 font-bold mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Gợi ý (Hint):
                </p>
                <p className="text-sm text-yellow-900 italic leading-relaxed">
                    {question.explanation}
                </p>
            </div>
        )}
        
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.questionText}
        </h2>
        
        {question.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex justify-center p-2">
            <img 
              src={question.imageUrl} 
              alt={`Illustration for question ${question.id}`} 
              className="max-w-full h-auto max-h-[300px] object-contain rounded-lg"
              loading="lazy"
            />
          </div>
        )}
        
        {question.audioUrl && (
          <div className="flex justify-center mb-6">
             <AudioPlayer src={question.audioUrl} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mb-8 flex-grow">
        {question.type === QuestionType.MULTIPLE_CHOICE && question.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, idx) => {
               let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center shadow-sm ";
               if (showFeedback) {
                   if (option === question.correctAnswer) {
                       btnClass += "border-green-500 bg-green-50 text-green-800 font-bold shadow-green-100";
                   } else if (option === userAnswer && option !== question.correctAnswer) {
                       btnClass += "border-red-500 bg-red-50 text-red-800 opacity-80 shadow-red-100";
                   } else {
                       btnClass += "border-gray-100 text-gray-400 opacity-50 bg-gray-50";
                   }
               } else {
                   btnClass += "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700 bg-white hover:shadow-md";
               }

               return (
                <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    disabled={showFeedback}
                    className={btnClass}
                >
                    <div className={`w-8 h-8 rounded-full border-2 mr-3 flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                         showFeedback && option === question.correctAnswer ? 'border-green-500 bg-green-500 text-white' : 
                         showFeedback && option === userAnswer ? 'border-red-500 bg-red-500 text-white' :
                         'border-gray-300 text-gray-500'
                    }`}>
                        {['A', 'B', 'C', 'D'][idx]}
                    </div>
                    <span className="flex-grow">{option}</span>
                </button>
               );
            })}
          </div>
        )}

        {question.type === QuestionType.FILL_IN_BLANK && (
            <div className="relative max-w-lg mx-auto">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    disabled={showFeedback}
                    placeholder="Type your answer..."
                    className={`w-full p-4 pl-6 text-lg border-2 rounded-xl focus:outline-none transition-all shadow-sm ${
                        showFeedback 
                         ? isCorrect 
                            ? 'border-green-500 bg-green-50 text-green-800 font-bold' 
                            : 'border-red-500 bg-red-50 text-red-800 font-bold'
                         : 'border-gray-200 focus:border-blue-500 text-gray-800 focus:shadow-md'
                    }`}
                />
                 {!showFeedback && (
                    <button 
                        onClick={handleSubmit}
                        disabled={!inputValue.trim()}
                        className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Submit
                    </button>
                 )}
            </div>
        )}

        {question.type === QuestionType.REARRANGE && (
            <div className="space-y-6">
                 {/* Constructed Answer Area */}
                 <div className={`min-h-[100px] p-5 rounded-xl border-2 flex flex-wrap gap-2 items-center content-start transition-colors ${
                      showFeedback 
                         ? isCorrect 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                         : 'border-blue-200 bg-blue-50/50'
                 }`}>
                    {rearrangeOrder.length === 0 && !showFeedback && (
                        <span className="text-gray-400 w-full text-center py-4 italic">Tap words below to build sentence...</span>
                    )}
                    {rearrangeOrder.map((word, idx) => (
                        <button
                            key={`${word}-${idx}`}
                            onClick={() => handleRearrangeClick(word, false)}
                            disabled={showFeedback}
                            className="bg-white border border-blue-200 text-blue-800 px-3 py-2 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors font-medium animate-fade-in"
                        >
                            {word}
                        </button>
                    ))}
                 </div>

                 {/* Available Words */}
                 {!showFeedback && (
                     <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        {availableParts.map((word, idx) => (
                            <button
                                key={`${word}-${idx}`}
                                onClick={() => handleRearrangeClick(word, true)}
                                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:border-blue-400 hover:text-blue-600 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all"
                            >
                                {word}
                            </button>
                        ))}
                     </div>
                 )}
                 
                 {!showFeedback && (
                    <div className="flex justify-center mt-4">
                        <button 
                            onClick={handleSubmit}
                            disabled={rearrangeOrder.length === 0}
                            className="bg-blue-600 text-white py-3 px-10 rounded-xl font-bold hover:bg-blue-700 shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform hover:scale-105"
                        >
                            Submit Answer
                        </button>
                    </div>
                 )}
            </div>
        )}
      </div>

      {/* Explanation / Feedback */}
      {showFeedback && (
        <div className={`mt-auto p-5 rounded-xl border-l-4 animate-slide-up shadow-sm ${
            isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
        }`}>
            <div className="flex items-center mb-3">
                <div className={`p-1.5 rounded-full mr-3 ${isCorrect ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                    {isCorrect ? (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                </div>
                <h3 className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
            </div>
            
            {!isCorrect && (
                <div className="mb-4 text-red-800 bg-red-100/50 p-3 rounded-lg border border-red-100">
                    <span className="font-bold text-xs uppercase tracking-wide opacity-70 mb-1 block">Correct Answer</span>
                    <p className="font-semibold text-lg">{question.correctAnswer}</p>
                </div>
            )}
            
            <div className="text-gray-700 pt-2">
                 <span className="font-bold text-xs uppercase tracking-wide text-gray-500 mb-1 block">Explanation</span>
                 <p className="leading-relaxed">{question.explanation}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
