
import React, { useState, useEffect } from 'react';
import { GameState, AnswerResult, Question } from './types';
import { QUIZ_DATA } from './constants';
import StartScreen from './components/StartScreen';
import QuestionCard from './components/QuestionCard';
import ResultScreen from './components/ResultScreen';
import ProgressBar from './components/ProgressBar';
import QuestionNavigation from './components/QuestionNavigation';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [playerName, setPlayerName] = useState('');
  
  // State to hold the current set of active questions (allows for filtering wrong answers)
  const [activeQuestions, setActiveQuestions] = useState<Question[]>(QUIZ_DATA);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Store results by Question ID to allow random access
  const [answers, setAnswers] = useState<Record<number, AnswerResult>>({});
  
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentQuestion = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(answers).length;
  
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length;
  const currentPoints = correctCount * 10;

  const handleStartGame = (name?: string) => {
    if (typeof name === 'string' && name.trim()) {
        setPlayerName(name);
    }
    setActiveQuestions(QUIZ_DATA);
    setGameState(GameState.PLAYING);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowFeedback(false);
  };

  const handleRestart = () => {
      // Restart with existing name
      handleStartGame();
  }

  const handleRetryWrong = () => {
    // Filter questions that were answered incorrectly or not answered
    const wrongQuestionIds = activeQuestions
        .filter(q => {
            const ans = answers[q.id];
            return !ans || !ans.isCorrect;
        })
        .map(q => q.id);
    
    const wrongQuestions = QUIZ_DATA.filter(q => wrongQuestionIds.includes(q.id));
    
    if (wrongQuestions.length === 0) {
        handleStartGame();
        return;
    }

    setActiveQuestions(wrongQuestions);
    setGameState(GameState.PLAYING);
    setCurrentQuestionIndex(0);
    setAnswers({}); // Reset answers for the new session
    setShowFeedback(false);
  };

  const handleAnswerSubmit = (answer: string) => {
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    const result: AnswerResult = {
        questionId: currentQuestion.id,
        isCorrect,
        userAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer
    };

    setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: result
    }));
    
    setShowFeedback(true);
  };

  const jumpToQuestion = (index: number) => {
      setCurrentQuestionIndex(index);
      const targetQ = activeQuestions[index];
      if (answers[targetQ.id]) {
          setShowFeedback(true);
      } else {
          setShowFeedback(false);
      }
  };

  const handleNextQuestion = () => {
      if (currentQuestionIndex < totalQuestions - 1) {
          jumpToQuestion(currentQuestionIndex + 1);
      } else {
          if (answeredCount === totalQuestions) {
              setGameState(GameState.FINISHED);
          } else {
             const firstUnanswered = activeQuestions.findIndex(q => !answers[q.id]);
             if (firstUnanswered !== -1) {
                 jumpToQuestion(firstUnanswered);
             } else {
                 setGameState(GameState.FINISHED);
             }
          }
      }
  };
  
  const handleFinish = () => {
      setGameState(GameState.FINISHED);
  }

  // Scroll to top when question changes
  useEffect(() => {
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex, gameState]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
       {/* Header */}
       <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
         <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <h1 className="font-bold text-lg hidden sm:block">IOE Master</h1>
            </div>
            
            {gameState === GameState.PLAYING && (
                <div className="flex items-center gap-4">
                    {playerName && (
                        <div className="hidden sm:flex items-center text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                             <svg className="w-4 h-4 mr-2 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                             {playerName}
                        </div>
                    )}
                    <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
                        <span className="text-xs text-blue-600 font-bold uppercase mr-2">Points</span>
                        <span className="text-lg font-extrabold text-blue-700">{currentPoints}</span>
                    </div>
                    <button 
                        onClick={handleFinish}
                        className="text-xs font-bold text-slate-500 hover:text-red-500 uppercase tracking-wide px-2"
                    >
                        Finish
                    </button>
                </div>
            )}
         </div>
       </header>

       <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-5xl mx-auto">
         
         {gameState === GameState.START && (
            <StartScreen onStart={handleStartGame} totalQuestions={QUIZ_DATA.length} />
         )}

         {gameState === GameState.PLAYING && currentQuestion && (
             <div className="w-full flex flex-col items-center pb-20 md:pb-0">
                 <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />
                 
                 <QuestionCard 
                    key={currentQuestion.id} 
                    question={currentQuestion} 
                    onAnswerSubmit={handleAnswerSubmit} 
                    showFeedback={showFeedback}
                    userAnswer={answers[currentQuestion.id]?.userAnswer || null}
                 />

                 <QuestionNavigation 
                    questions={activeQuestions}
                    answers={answers}
                    currentIndex={currentQuestionIndex}
                    onSelectQuestion={jumpToQuestion}
                 />

                 {/* Navigation Buttons */}
                 {showFeedback && (
                     <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200 md:relative md:bg-transparent md:border-0 md:p-0 md:mt-6 z-30 flex justify-center animate-slide-up shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
                         <button
                            onClick={handleNextQuestion}
                            className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white text-lg font-bold py-3 px-12 rounded-xl shadow-xl transition-transform active:scale-95 flex items-center justify-center"
                         >
                            <span>
                                {currentQuestionIndex === totalQuestions - 1 && answeredCount === totalQuestions 
                                    ? "Finish Exam" 
                                    : "Next Question"}
                            </span>
                            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                         </button>
                     </div>
                 )}
             </div>
         )}

         {gameState === GameState.FINISHED && (
             <ResultScreen 
                playerName={playerName}
                score={correctCount} 
                points={currentPoints}
                total={totalQuestions} 
                results={activeQuestions.map(q => answers[q.id] || {
                    questionId: q.id,
                    isCorrect: false,
                    userAnswer: '',
                    correctAnswer: q.correctAnswer
                })} 
                onRestart={handleRestart}
                onRetryWrong={handleRetryWrong}
             />
         )}

       </main>
    </div>
  );
};

export default App;
