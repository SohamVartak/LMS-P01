import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { Book } from '../types';
import { 
  Dices, 
  Sparkles, 
  Star, 
  Clock, 
  MapPin, 
  BookOpen, 
  RotateCcw, 
  HelpCircle,
  Bookmark
} from 'lucide-react';

export const SurpriseMePage: React.FC = () => {
  const { books, openBookModal, borrowBook, toggleWishlist, wishlist } = useLibrary();

  const [isRolling, setIsRolling] = useState(false);
  const [randomBook, setRandomBook] = useState<Book | null>(null);
  const [filterPreference, setFilterPreference] = useState<'any' | 'quick' | 'masterpiece'>('any');

  const handleRollDice = () => {
    if (!books.length || isRolling) return;
    setIsRolling(true);

    window.setTimeout(() => {
      let pool = [...books];
      if (filterPreference === 'quick') {
        const quickReads = books.filter(b => Number(b.pages) > 0 && Number(b.pages) <= 450);
        if (quickReads.length) pool = quickReads;
      } else if (filterPreference === 'masterpiece') {
        const topRated = books.filter(b => Math.max(b.onlineRating ?? 0, b.studentRating ?? 0, b.rating ?? 0) >= 4);
        if (topRated.length) pool = topRated;
      }

      const alternatives = randomBook && pool.length > 1
        ? pool.filter(book => book.id !== randomBook.id)
        : pool;
      const pick = alternatives[Math.floor(Math.random() * alternatives.length)];
      setRandomBook(pick ?? null);
      setIsRolling(false);
    }, 250);
  };

  if (!randomBook) { /* empty state is rendered below */ }

  const isSaved = randomBook ? wishlist.includes(randomBook.id) : false;

  return (
    <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Serendipitous Discovery
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center justify-center gap-2">
          <span>Surprise Me</span>
          <Dices className={`w-7 h-7 text-amber-500 ${isRolling ? 'animate-spin' : ''}`} />
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Overwhelmed by choices? Let our digital dice draw an unexpected title from the stacks.
        </p>
      </div>

      {/* Filter Mode Selector */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <button
          onClick={() => setFilterPreference('any')}
          className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
            filterPreference === 'any'
              ? 'bg-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Any Subject
        </button>
        <button
          onClick={() => setFilterPreference('quick')}
          className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
            filterPreference === 'quick'
              ? 'bg-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Quick Reads
        </button>
        <button
          onClick={() => setFilterPreference('masterpiece')}
          className={`py-1.5 px-3 rounded-lg font-medium transition-colors ${
            filterPreference === 'masterpiece'
              ? 'bg-blue-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Top Rated
        </button>
      </div>

      <div className="min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
        {!randomBook ? (
          <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 rounded-2xl shadow-xl border border-slate-800 min-h-[380px] flex flex-col items-center justify-center text-center space-y-5">
            <Dices className="w-10 h-10 text-amber-400" />
            <h2 className="text-xl font-bold font-serif-academic">Uncharted Knowledge Awaits</h2>
            <p className="text-xs text-blue-200/80 max-w-xs">Choose a filter and draw a real title from the approved engineering catalogue.</p>
            <button
              onClick={handleRollDice}
              disabled={isRolling || books.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              {isRolling ? 'Finding a book…' : books.length ? 'Surprise me' : 'No books available'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-lg bg-[var(--app-surface-elevated)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--app-border)] min-h-[380px] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div onClick={() => openBookModal(randomBook)} className="cursor-pointer shrink-0"><BookSpineCover book={randomBook} size="md" /></div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{randomBook.title}</h2>
                <p className="text-sm text-slate-500 mt-1">by {randomBook.author}</p>
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">{randomBook.description}</p>
                <div className="flex items-center gap-2 mt-4 text-xs text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{randomBook.onlineRating ?? randomBook.studentRating ?? 'Not rated'}</span>
                  <span className="text-slate-400">rating</span>
                </div>
                <p className="text-xs text-slate-500 mt-3"><MapPin className="inline w-3.5 h-3.5 mr-1" />{randomBook.shelfLocation || 'Shelf location not recorded'}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-2 border-t border-slate-200 pt-4">
              <button onClick={() => openBookModal(randomBook)} className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold">View Details</button>
              <button onClick={() => void borrowBook(randomBook.id)} className="flex-1 py-2 rounded-lg bg-blue-950 text-white text-xs font-semibold">Issue Copy</button>
              <button onClick={handleRollDice} disabled={isRolling || books.length === 0} aria-label="Pick another book" className="py-2 px-3 rounded-lg border border-slate-300 text-xs font-semibold disabled:opacity-50"><RotateCcw className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};
