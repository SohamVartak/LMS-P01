import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { PersonalityResult } from '../types';
import { 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Award 
} from 'lucide-react';

const QUIZ_QUESTIONS = [
  { question: 'Which library activity sounds most useful?', options: [{text:'Understand algorithms and data structures',personality:'The Analyst'},{text:'Build and debug software systems',personality:'The Builder'},{text:'Study circuits, processors, and embedded systems',personality:'The Engineer'},{text:'Explore AI and machine learning concepts',personality:'The Explorer'}] },
  { question: 'How do you prefer to learn?', options: [{text:'Step-by-step theory and proofs',personality:'The Analyst'},{text:'Hands-on implementation',personality:'The Builder'},{text:'Diagrams, hardware, and system behavior',personality:'The Engineer'},{text:'Compare ideas across different fields',personality:'The Explorer'}] },
  { question: 'What would you most likely do with a new technical book?', options: [{text:'Work through the concepts carefully',personality:'The Analyst'},{text:'Code along with the examples',personality:'The Builder'},{text:'Connect it to real hardware or architecture',personality:'The Engineer'},{text:'Jump between chapters and related topics',personality:'The Explorer'}] },
  { question: 'What kind of project interests you most?', options: [{text:'An algorithmic problem solver',personality:'The Analyst'},{text:'A complete software application',personality:'The Builder'},{text:'A processor, embedded, or electronics project',personality:'The Engineer'},{text:'An AI experiment or research prototype',personality:'The Explorer'}] },
  { question: 'What is your main reason for using the library?', options: [{text:'Master fundamentals',personality:'The Analyst'},{text:'Improve practical skills',personality:'The Builder'},{text:'Understand how engineered systems work',personality:'The Engineer'},{text:'Discover new technical areas',personality:'The Explorer'}] }
];

export const PersonalityQuizPage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<PersonalityResult | null>(null);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100);

  const handleSelectOption = (personality: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: personality
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate archetype tally
      const counts: Record<string, number> = {};
      Object.values(selectedAnswers).forEach(pers => {
        counts[pers] = (counts[pers] || 0) + 1;
      });

      // Find highest tally or default to 'The Thinker'
      let bestPers = 'The Thinker';
      let maxCount = 0;
      Object.entries(counts).forEach(([pers, cnt]) => {
        if (cnt > maxCount) {
          maxCount = cnt;
          bestPers = pers;
        }
      });

      const resultMap: Record<string, PersonalityResult> = {
        'The Analyst': { title:'The Analyst', badge:'🧠', description:'You prefer structured reasoning and strong fundamentals.', strengths:['Logical analysis','Conceptual depth','Careful study'], recommendedBookIds:[] },
        'The Builder': { title:'The Builder', badge:'🛠️', description:'You prefer learning by creating and implementing.', strengths:['Practical learning','Problem solving','Implementation'], recommendedBookIds:[] },
        'The Engineer': { title:'The Engineer', badge:'⚙️', description:'You enjoy understanding how technical systems work together.', strengths:['Systems thinking','Engineering reasoning','Applied learning'], recommendedBookIds:[] },
        'The Explorer': { title:'The Explorer', badge:'🔎', description:'You enjoy discovering connections across technical fields.', strengths:['Curiosity','Cross-disciplinary thinking','Exploration'], recommendedBookIds:[] }
      };
      const matchedResult = resultMap[bestPers] || resultMap['The Analyst'];
      setResult(matchedResult);
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setResult(null);
  };

  const startingBook = (result && result.recommendedBookIds.length > 0)
    ? books.find(b => b.id === result.recommendedBookIds[0])
    : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Psychometric Reading Profiler
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center justify-center gap-2">
          <span>Discover Your Reading Personality</span>
          <span className="text-2xl">📖</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
          Answer 5 academic preference questions to uncover your reading archetype and ideal bibliography.
        </p>
      </div>

      {!quizCompleted ? (
        /* Quiz Interface */
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-xs space-y-8">
          
          {/* Progress Bar & Question Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="text-blue-700 font-tabular">{progressPercent}% Completed</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-academic text-slate-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === option.personality;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option.personality)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/50 ring-2 ring-blue-900 text-slate-900 font-semibold'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs sm:text-sm leading-relaxed">{option.text}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-900 bg-blue-900 text-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`py-2 px-4 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentQuestionIndex === 0
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className={`py-2.5 px-6 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
                selectedAnswers[currentQuestionIndex]
                  ? 'bg-blue-950 text-white hover:bg-blue-900'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{currentQuestionIndex === QUIZ_QUESTIONS.length - 1 ? 'Reveal Archetype' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : (
        /* Result Reveal Card */
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-lg space-y-8 animate-in zoom-in-95 duration-300">
          
          <div className="text-center space-y-2">
            <span className="text-4xl">{result?.badge}</span>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider mt-2">
              Your Academic Persona
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-academic text-slate-900">
              {result?.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {result?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Strengths */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Core Intellectual Strengths</span>
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {result?.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Stacks */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Recommended Catalogue References</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your result is based only on the answers you selected in this session. Catalogue suggestions use the current engineering collection.
              </p>
            </div>
          </div>

          {/* Recommended Starting Book */}
          {startingBook && (
            <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                  Catalogue Book for Your Result
                </span>
                <span className="text-xs font-semibold text-blue-700">Current Catalogue</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-blue-100">
                <div 
                  onClick={() => openBookModal(startingBook)}
                  className="cursor-pointer shrink-0"
                >
                  <BookSpineCover book={startingBook} size="sm" />
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 
                    onClick={() => openBookModal(startingBook)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer"
                  >
                    {startingBook.title}
                  </h4>
                  <p className="text-xs text-slate-500">by {startingBook.author}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {startingBook.description}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => openBookModal(startingBook)}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    Examine
                  </button>
                  <button
                    onClick={() => borrowBook(startingBook.id)}
                    className="py-1.5 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold"
                  >
                    Issue Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Retake Button */}
          <div className="pt-2 text-center">
            <button
              onClick={handleRetake}
              className="py-2 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Reader Personality Quiz</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
