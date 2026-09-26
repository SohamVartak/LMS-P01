import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { Hourglass, Clock, Calendar, BookOpen, Sliders, CheckCircle2, TrendingUp } from 'lucide-react';

export const ReadingTimePage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();

  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [readingSpeedWpm, setReadingSpeedWpm] = useState<number>(220); // User-adjustable reading speed
  const [dailyMinutes, setDailyMinutes] = useState<number>(30); // User-adjustable daily reading time

  const currentBook = books.find(b => b.id === selectedBookId) || books[0];
  if (!currentBook) return <div className="p-8 text-sm text-slate-500">No approved books are currently available.</div>;

  // Calculation formulas
  const wordsPerPage = 275;
  const totalWords = currentBook.pages * wordsPerPage;
  const totalMinutesToRead = Math.round(totalWords / readingSpeedWpm);
  const totalHoursToRead = (totalMinutesToRead / 60).toFixed(1);
  const daysToFinish = Math.max(1, Math.ceil(totalMinutesToRead / dailyMinutes));

  // Projected finish date
  const finishDate = new Date();
  finishDate.setDate(finishDate.getDate() + daysToFinish);
  const finishDateStr = finishDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Cognitive Load & Schedule Planning
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Reading Time & Pace Estimator</span>
          <Hourglass className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Calculate your realistic completion timeline based on your personal reading speed and daily study schedule.
        </p>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Controls & Estimates */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          
          {/* 1. Book Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              1. Select Book from SIT Catalogue
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-blue-600"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} — {b.author} ({b.pages} pages)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Reading Speed Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Your Reading Speed:</span>
              <span className="text-blue-700 font-bold font-tabular text-sm">
                {readingSpeedWpm} Words Per Minute (WPM)
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="450"
              step="10"
              value={readingSpeedWpm}
              onChange={(e) => setReadingSpeedWpm(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Careful Reader (150 WPM)</span>
              <span>College Average (220 WPM)</span>
              <span>Speed Reader (350+ WPM)</span>
            </div>
          </div>

          {/* 3. Daily Reading Time Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Daily Reading Commitment:</span>
              <span className="text-blue-700 font-bold font-tabular text-sm">
                {dailyMinutes} Minutes / Day
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Casual (15 min)</span>
              <span>Solid Habit (30 min)</span>
              <span>Intensive Study (60-90 min)</span>
            </div>
          </div>

          {/* Result Cards Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Reading Time</span>
              <span className="text-2xl font-bold font-tabular text-blue-950 mt-1 block">
                {totalHoursToRead} hrs
              </span>
              <span className="text-[10px] text-slate-500 font-tabular">~{totalWords.toLocaleString()} words</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Days to Finish</span>
              <span className="text-2xl font-bold font-tabular text-emerald-900 mt-1 block">
                {daysToFinish} days
              </span>
              <span className="text-[10px] text-emerald-700 font-tabular">at {dailyMinutes} mins/day</span>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="text-[11px] font-semibold text-slate-500 block">Target Completion</span>
              <span className="text-sm font-bold text-purple-950 mt-1.5 block">
                {finishDateStr}
              </span>
              <span className="text-[10px] text-purple-700 font-tabular">Calculated pacing</span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Selected Book Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
          <BookSpineCover book={currentBook} size="md" />

          <div>
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              {currentBook.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              {currentBook.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">by {currentBook.author}</p>
          </div>

          <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between font-tabular">
              <span>Page Count:</span>
              <strong>{currentBook.pages} pages</strong>
            </div>
            <div className="flex justify-between font-tabular">
              <span>Available Copies:</span>
              <strong>{currentBook.availableCopies} in stacks</strong>
            </div>
            <div className="flex justify-between font-tabular">
              <span>Shelf Location:</span>
              <strong>{currentBook.shelfLocation}</strong>
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button
              onClick={() => openBookModal(currentBook)}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Examine
            </button>
            <button
              onClick={() => borrowBook(currentBook.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold"
            >
              Issue
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
