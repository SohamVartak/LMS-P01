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

const buildQuestions = (book: any) => [
  {
    question: `Which author is associated with “${book.title}”?`,
    options: [book.author, 'Martin Fowler', 'Andrew S. Tanenbaum', 'Robert C. Martin'].sort(() => 0.5 - Math.random())
  },
  {
    question: `Which category is this book listed under?`,
    options: [book.category, 'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering'].sort(() => 0.5 - Math.random())
  },
  {
    question: `What is the publication year recorded for “${book.title}”?`,
    options: [String(book.publicationYear), '2010', '2015', '2020'].sort(() => 0.5 - Math.random())
  },
  {
    question: `Which title did you choose for this quiz?`,
    options: [book.title, 'Clean Code', 'Digital Design', 'Signals and Systems'].sort(() => 0.5 - Math.random())
  },
  {
    question: `Who wrote “${book.title}”?`,
    options: [book.author, 'Thomas H. Cormen', 'Ian Sommerville', 'S. Haykin'].sort(() => 0.5 - Math.random())
  }
];

export const PersonalityQuizPage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();
  const [bookQuery, setBookQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number,string>>({});

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const selectedBook = books.find(b => b.id === selectedBookId);
  const currentQ = quizQuestions[currentQuestionIndex];
  const progressPercent = quizQuestions.length ? Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100) : 0;

  const startQuiz = () => {
    if (!selectedBook) return;
    setQuizQuestions(buildQuestions(selectedBook));
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleSelectOption = (answer: string) => setQuizAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));

  const handleNext = () => {
    if (!currentQ || !quizAnswers[currentQuestionIndex]) return;
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      let score = 0;
      quizQuestions.forEach((q, index) => {
        if (quizAnswers[index] === q.options[0]) score += 1;
      });
      setQuizScore(score);
      setQuizCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleRetake = () => {
    setQuizAnswers({});
    setCurrentQuestionIndex(0);
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const startingBook = selectedBook;

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
          Enter a book name, then answer questions based on that book's catalogue information.
        </p>
      </div>
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Enter a book name</label>
        <input value={bookQuery} onChange={e=>setBookQuery(e.target.value)} placeholder="Search the approved engineering catalogue..." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
        <select value={selectedBookId} onChange={e=>setSelectedBookId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white">
          <option value="">Select a matching book</option>
          {books.filter(b => !bookQuery || b.title.toLowerCase().includes(bookQuery.toLowerCase())).map(b=><option key={b.id} value={b.id}>{b.title} — {b.author}</option>)}
        </select>
        <button disabled={!selectedBook} onClick={startQuiz} className="px-5 py-2.5 rounded-xl bg-blue-950 text-white text-xs font-semibold disabled:bg-slate-200 disabled:text-slate-400">Generate Book Quiz</button>
      </div>


      {!selectedBookId || !quizQuestions.length ? (
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
                  onClick={() => handleSelectOption(option)}
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
              Your Book Quiz Result
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-academic text-slate-900">
              {selectedBook?.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              {selectedBook ? `You scored ${quizScore} / ${quizQuestions.length} on this book quiz.` : ''}
            </p>
          </div>

          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 text-center text-sm text-slate-700">
            Score: <strong>{quizScore} / {quizQuestions.length}</strong>
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
