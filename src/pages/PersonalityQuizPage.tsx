import React, { useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

const makeQuestions = (book: Book): QuizQuestion[] => [
  {
    question: `Who is the recorded author of “${book.title}”?`,
    options: [book.author, 'Thomas H. Cormen', 'Ian Sommerville', 'S. Haykin'],
    answer: book.author
  },
  {
    question: `Which category is “${book.title}” listed under?`,
    options: [book.category, 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'],
    answer: book.category
  },
  {
    question: `Which publication year is recorded for “${book.title}”?`,
    options: [String(book.publicationYear), '2010', '2015', '2020'],
    answer: String(book.publicationYear)
  },
  {
    question: `Which title did you select for this quiz?`,
    options: [book.title, 'Clean Code', 'Digital Design', 'Signals and Systems'],
    answer: book.title
  },
  {
    question: `What publisher is recorded for “${book.title}”?`,
    options: [book.publisher || 'Publisher not recorded', 'Pearson', 'McGraw-Hill', 'Wiley'],
    answer: book.publisher || 'Publisher not recorded'
  }
];

export const PersonalityQuizPage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();
  const [query, setQuery] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const selectedBook = books.find(b => b.id === selectedBookId);
  const matches = useMemo(
    () => books.filter(b => !query || b.title.toLowerCase().includes(query.toLowerCase())),
    [books, query]
  );
  const current = questions[index];

  const startQuiz = () => {
    if (!selectedBook) return;
    setQuestions(makeQuestions(selectedBook));
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setScore(0);
  };

  const choose = (answer: string) => setAnswers(prev => ({ ...prev, [index]: answer }));

  const next = () => {
    if (!current || !answers[index]) return;
    if (index < questions.length - 1) {
      setIndex(v => v + 1);
      return;
    }
    const finalScore = questions.reduce((total, q, i) => total + (answers[i] === q.answer ? 1 : 0), 0);
    setScore(finalScore);
    setFinished(true);
  };

  const reset = () => {
    setQuestions([]);
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Book Quiz</span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-academic text-slate-900 mt-1">Quiz Me on a Book</h1>
        <p className="text-xs text-slate-500 mt-1">Enter a book name, select the catalogue title, and get questions based on that book's recorded information.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Book name</label>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Type a book title..." className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" />
        <select value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-sm">
          <option value="">Select a book</option>
          {matches.map(book => <option key={book.id} value={book.id}>{book.title} — {book.author}</option>)}
        </select>
        <button onClick={startQuiz} disabled={!selectedBook} className="px-5 py-2.5 rounded-xl bg-blue-950 text-white text-xs font-semibold disabled:bg-slate-200 disabled:text-slate-400">
          Generate Book Quiz
        </button>
      </div>

      {questions.length > 0 && !finished && current && (
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-7">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Question {index + 1} of {questions.length}</span>
            <span>{Math.round(((index + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
          </div>
          <h2 className="text-lg font-bold font-serif-academic text-slate-900">{current.question}</h2>
          <div className="space-y-3">
            {current.options.map(option => (
              <button key={option} onClick={() => choose(option)}
                className={`w-full p-4 rounded-xl border text-left text-sm ${answers[index] === option ? 'border-blue-900 bg-blue-50 ring-2 ring-blue-900' : 'border-slate-200 hover:bg-slate-50'}`}>
                <span className="flex items-center justify-between gap-3">
                  {option}
                  {answers[index] === option && <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />}
                </span>
              </button>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-slate-100">
            <button onClick={() => setIndex(v => Math.max(0, v - 1))} disabled={index === 0} className="px-4 py-2 rounded-lg border text-xs disabled:opacity-40 flex items-center gap-1"><ArrowLeft className="w-4 h-4" />Previous</button>
            <button onClick={next} disabled={!answers[index]} className="px-5 py-2 rounded-lg bg-blue-950 text-white text-xs disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-1">{index === questions.length - 1 ? 'Finish Quiz' : 'Next'}<ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {finished && selectedBook && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center space-y-5">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h2 className="text-2xl font-bold font-serif-academic">{selectedBook.title}</h2>
          <p className="text-sm text-slate-600">Your score: <strong>{score} / {questions.length}</strong></p>
          <div className="flex justify-center gap-2">
            <button onClick={() => openBookModal(selectedBook)} className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4" />View Book</button>
            <button onClick={() => void borrowBook(selectedBook.id)} className="px-4 py-2 rounded-lg bg-blue-950 text-white text-xs font-semibold">Issue Copy</button>
            <button onClick={reset} className="px-4 py-2 rounded-lg border text-xs font-semibold flex items-center gap-2"><RotateCcw className="w-4 h-4" />Retake</button>
          </div>
        </div>
      )}
    </div>
  );
};
