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

  const [isFlipped, setIsFlipped] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [randomBook, setRandomBook] = useState<Book | null>(null);
  const [filterPreference, setFilterPreference] = useState<'any' | 'quick' | 'masterpiece'>('any');

  const handleRollDice = () => {
    setIsRolling(true);
    setIsFlipped(false);

    setTimeout(() => {
      let pool = [...books];
      if (filterPreference === 'quick') {
        pool = books.filter(b => b.pages > 0 && b.pages <= 450);
      } else if (filterPreference === 'masterpiece') {
        pool = books.filter(b => (b.onlineRating ?? 0) >= 4);
      }

      if (pool.length === 0) pool = books;

      const pick = pool[Math.floor(Math.random() * pool.length)];
      setRandomBook(pick);
      setIsRolling(false);
      setIsFlipped(true);
    }, 600);
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

      {/* 3D Flip Card Container */}
      <div className="perspective-1000 min-h-[380px] sm:min-h-[420px] flex items-center justify-center">
        <div 
          className={`w-full max-w-lg transition-transform duration-700 preserve-3d relative ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front (Mystery / Unopened State) */}
          <div className="w-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-8 rounded-2xl shadow-xl border border-slate-800 backface-hidden flex flex-col items-center justify-between text-center min-h-[380px]">
            <div className="w-12 h-12 rounded-2xl bg-[var(--app-surface-subtle)] backdrop-blur-xs text-amber-400 flex items-center justify-center border border-[var(--app-border)]">
              <Dices className="w-6 h-6 text-[var(--app-accent)]" />
            </div>

            <div className="space-y-3 max-w-xs">
              <h2 className="text-xl font-bold font-serif-academic text-white">
                Uncharted Knowledge Awaits
              </h2>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Step outside your comfort zone. Click the button below to randomly select from the current approved engineering catalogue.
              </p>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Random algorithmic seed with balanced distribution</span>
            </div>
          </div>

          {/* Card Back (Revealed Book State) */}
          <div className="absolute inset-0 w-full bg-[var(--app-surface-elevated)] p-6 sm:p-8 rounded-2xl shadow-xl border border-[var(--app-border)] backface-hidden rotate-y-180 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div 
                onClick={() => openBookModal(randomBook)}
                className="cursor-pointer shrink-0"
              >
                <BookSpineCover book={randomBook} size="md" />
              </div>

              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-between gap-2 text-xs text-[var(--app-accent)] font-bold uppercase tracking-wider mb-1">
                  <span>{randomBook.category}</span>
                  <span className="text-[var(--app-text-muted)] font-tabular font-normal hidden sm:inline">
                    {randomBook.publicationYear}
                  </span>
                </div>

                <h3 
                  onClick={() => openBookModal(randomBook)}
                  className="text-base sm:text-lg font-bold font-serif-academic text-[var(--app-text)] leading-snug hover:text-[var(--app-primary)] cursor-pointer"
                >
                  {randomBook.title}
                </h3>
                <p className="text-xs text-[var(--app-text-muted)] mt-0.5">by {randomBook.author}</p>

                <div className="flex items-center justify-center sm:justify-start gap-3 my-3 text-xs text-[var(--app-text-muted)] font-tabular">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span className="font-semibold">{randomBook.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>~{randomBook.readingTimeHours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{randomBook.shelfLocation}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {randomBook.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions for Revealed Book */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => openBookModal(randomBook)}
                className="py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Full Details
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(randomBook.id)}
                  className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                    isSaved ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Save to reading list"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600' : ''}`} />
                </button>
                <button
                  onClick={() => borrowBook(randomBook.id)}
                  className="py-2 px-4 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Issue Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roll Action Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleRollDice}
          disabled={isRolling}
          className="py-3 px-8 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2.5 active:scale-95"
        >
          <Dices className={`w-5 h-5 text-amber-400 ${isRolling ? 'animate-spin' : ''}`} />
          <span>{isRolling ? 'Rolling Random Seed...' : (isFlipped ? 'Roll Again 🎲' : 'Roll The Dice 🎲')}</span>
        </button>
      </div>

    </div>
  );
};
