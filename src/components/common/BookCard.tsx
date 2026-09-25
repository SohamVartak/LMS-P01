import React from 'react';
import { Book } from '../../types';
import { useLibrary } from '../../context/LibraryContext';
import { BookSpineCover } from './BookSpineCover';
import { Star, Clock, Bookmark, BookOpen, TrendingUp } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenDetails?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpenDetails }) => {
  const { openBookModal, wishlist, toggleWishlist, borrowBook } = useLibrary();
  const isWishlisted = wishlist.includes(book.id);
  const isAvailable = book.availableCopies > 0;

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails();
    } else {
      openBookModal(book);
    }
  };

  return (
    <div 
      className="group bg-[var(--app-surface-elevated)] rounded-xl border border-[var(--app-border)] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
    >
      {/* Top Cover Banner */}
      <div 
        onClick={handleCardClick}
        className="p-5 pb-3 flex justify-center items-center bg-[var(--app-surface-subtle)]/60 border-b border-[var(--app-border)] cursor-pointer relative overflow-hidden"
      >
        <BookSpineCover book={book} size="md" />

        {/* Quick Wishlist bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
            isWishlisted 
              ? 'bg-amber-950/70 text-amber-400 shadow-xs ring-1 ring-amber-500/40' 
              : 'bg-[var(--app-surface-elevated)]/90 backdrop-blur-xs text-[var(--app-text-muted)] hover:text-[var(--app-accent)] shadow-xs border border-[var(--app-border)]'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          aria-label="Wishlist toggle"
        >
          <Bookmark className={`w-4 h-4 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>

        {/* Availability status badge */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[var(--app-surface-elevated)]/95 backdrop-blur-xs border border-[var(--app-border)] shadow-2xs font-tabular">
          <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className={isAvailable ? 'text-[var(--app-text)] font-semibold' : 'text-rose-400 font-semibold'}>
            {isAvailable ? `${book.availableCopies} available` : 'Checked out'}
          </span>
        </div>
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[var(--app-text-muted)] mb-1.5">
            <span className="font-semibold text-[var(--app-accent)] truncate max-w-[130px] uppercase text-[10px] tracking-wider">
              {book.category}
            </span>
            <div className="flex items-center gap-1 text-[var(--app-text)] shrink-0 font-tabular font-medium">
              <Star className="w-3.5 h-3.5 fill-[var(--app-accent)] text-[var(--app-accent)]" />
              <span className="font-bold">{book.rating.toFixed(1)}</span>
              <span className="opacity-60 text-[10px]">({book.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={handleCardClick}
            className="font-bold text-[var(--app-text)] text-sm leading-snug line-clamp-2 hover:text-[var(--app-accent)] cursor-pointer transition-colors"
            title={book.title}
          >
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-[var(--app-text-muted)] mt-1 line-clamp-1">
            by <span className="font-medium text-[var(--app-text)]">{book.author}</span>
          </p>

          {/* Metadata row: reading time and popularity */}
          <div className="mt-3 pt-2 border-t border-[var(--app-border)] flex items-center justify-between text-[11px] text-[var(--app-text-muted)]">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 opacity-60" />
              <span>~{book.readingTimeHours}h read</span>
            </div>
            <div className="flex items-center gap-1 font-tabular">
              <TrendingUp className="w-3 h-3 text-[var(--app-accent)]" />
              <span>{book.popularityScore}% Pop.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 flex items-center gap-2">
          <button
            onClick={handleCardClick}
            className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-surface-elevated)] hover:bg-[var(--app-surface-subtle)] hover:border-[var(--app-accent)] transition-colors text-center"
          >
            Details
          </button>
          
          <button
            disabled={!isAvailable}
            onClick={() => borrowBook(book.id)}
            className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              isAvailable
                ? 'bg-[var(--app-accent)] text-[#0E0926] hover:bg-[var(--app-accent-hover)] shadow-xs active:scale-95'
                : 'bg-[var(--app-surface-subtle)] text-[var(--app-text-muted)] opacity-50 cursor-not-allowed border border-[var(--app-border)]'
            }`}
          >
            <BookOpen className={`w-3.5 h-3.5 ${isAvailable ? 'text-[#0E0926]' : 'text-[var(--app-text-muted)]'}`} />
            <span>{isAvailable ? 'Borrow' : 'Held'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
