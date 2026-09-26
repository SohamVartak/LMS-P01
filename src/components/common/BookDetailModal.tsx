import React, { useState } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { BookSpineCover } from './BookSpineCover';
import { 
  X, 
  Star, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  Users, 
  Building
} from 'lucide-react';

export const BookDetailModal: React.FC = () => {
  const { 
    selectedBookModal, 
    closeBookModal, 
    borrowBook, 
    reserveBook, 
    toggleWishlist, 
    wishlist, 
    setCurrentPage, 
    books,
    openBookModal,
    user,
    userRole,
    addToast
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'overview' | 'summary' | 'similar'>('overview');
  const [studentRating, setStudentRating] = useState(0);
  const [savingRating, setSavingRating] = useState(false);

  const submitStudentRating = async () => {
    if (userRole !== 'STUDENT' || !user.id || studentRating < 1) return;

    setSavingRating(true);

    const { error } = await import('../../lib/supabase').then(({ supabase }) =>
      supabase.from('book_student_ratings').upsert(
        {
          book_id: book.id,
          student_id: user.id,
          rating: studentRating
        },
        { onConflict: 'book_id,student_id' }
      )
    );

    if (error) {
      addToast('Rating Failed', error.message, 'error');
    } else {
      addToast('Rating Saved', 'Your student rating has been recorded.', 'success');
      const { supabase } = await import('../../lib/supabase');
      const { data } = await supabase
        .from('book_rating_summary')
        .select('student_rating, student_rating_count')
        .eq('book_id', book.id)
        .maybeSingle();

      if (data) {
        book.studentRating = data.student_rating == null ? null : Number(data.student_rating);
        book.studentRatingCount = Number(data.student_rating_count || 0);
      }
    }

    setSavingRating(false);
  };

  if (!selectedBookModal) return null;

  const book = selectedBookModal;
  const isWishlisted = wishlist.includes(book.id);
  const isAvailable = book.availableCopies > 0;

  // Similar books from same category
  const similarBooks = books
    .filter(b => b.category === book.category && b.id !== book.id)
    .slice(0, 3);

  const conditionColors = {
    'Excellent': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'Good': 'text-[#4C1D95] bg-[#F5F3FF] border-violet-200',
    'Needs Attention': 'text-[#F97316] bg-[#FFF7ED] border-[#F97316]/30',
    'Damaged': 'text-rose-700 bg-rose-50 border-rose-200'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeBookModal}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--app-surface-elevated)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--app-border)] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--app-border)] sticky top-0 bg-[var(--app-surface-elevated)]/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2 text-xs text-[var(--app-text-muted)]">
            <span>Catalogue</span>
            <span>/</span>
            <span className="font-semibold text-[#4C1D95]">{book.category}</span>
          </div>
          <button
            onClick={closeBookModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Left Cover & Shelf Card */}
            <div className="flex flex-col items-center mx-auto md:mx-0 shrink-0">
              <BookSpineCover book={book} size="lg" />
              
              <div className="mt-4 p-3 bg-[var(--app-surface-subtle)] rounded-xl border border-[var(--app-border)] w-full text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--app-text)]">
                  <MapPin className="w-3.5 h-3.5 text-[#4C1D95]" />
                  <span>{book.shelfLocation}</span>
                </div>
                <div className="text-[11px] text-[var(--app-text-muted)] flex items-center justify-center gap-1.5 font-tabular">
                  <Layers className="w-3 h-3 opacity-60" />
                  <span>{book.availableCopies} of {book.totalCopies} copies in stacks</span>
                </div>
                <div className="pt-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${conditionColors[book.condition]}`}>
                    Condition: {book.condition}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Information Column */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--app-text-muted)] mb-1">
                <span className="font-bold text-[#4C1D95] uppercase text-[10px] tracking-wider">{book.category}</span>
                <span>·</span>
                <span className="font-tabular">ISBN: {book.isbn}</span>
                <span>·</span>
                <span className="font-tabular">{book.publicationYear}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold font-serif-academic text-[var(--app-text)] leading-snug">
                {book.title}
              </h2>

              <p className="text-sm text-[var(--app-text-muted)] mt-1">
                Authored by <span className="font-semibold text-[var(--app-text)]">{book.author}</span>
              </p>

              {/* Badges / Rating Row */}
              <div className="flex flex-wrap items-center gap-4 my-4 py-2 border-y border-[var(--app-border)] text-xs text-[var(--app-text)]">
                <div className="flex items-center gap-3 font-semibold">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                  <span className="font-bold">{book.onlineRating == null ? '—' : book.onlineRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">Online</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">{book.studentRating == null ? '—' : book.studentRating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">Students</span>
                </div>
              </div>
                <div className="flex items-center gap-1 font-tabular">
                  <Building className="w-3.5 h-3.5 opacity-60" />
                  <span>{book.publisher}</span>
                </div>
              </div>

              {userRole === 'STUDENT' && (
                <div className="mb-4 p-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-subtle)]">
                  <div className="text-xs font-semibold text-[var(--app-text)] mb-2">Your student rating</div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(value => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setStudentRating(value)}
                        className="p-1"
                        aria-label={`Rate ${value} out of 5`}
                      >
                        <Star className={`w-5 h-5 ${value <= studentRating ? 'fill-emerald-500 text-emerald-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={savingRating || studentRating < 1}
                      onClick={() => void submitStudentRating()}
                      className="ml-2 px-3 py-1.5 rounded-lg bg-[var(--app-accent)] text-xs font-semibold disabled:opacity-50"
                    >
                      {savingRating ? 'Saving...' : 'Submit'}
                    </button>
                  </div>
                  <div className="text-[11px] text-[var(--app-text-muted)] mt-1">
                    {book.studentRatingCount} student rating{book.studentRatingCount === 1 ? '' : 's'} · average {book.studentRating == null ? '—' : book.studentRating.toFixed(1)}/5
                  </div>
                </div>
              )}

              {/* Sub-Navigation tabs */}
              <div className="flex items-center gap-2 border-b border-[var(--app-border)] mb-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-[#4C1D95] text-[#4C1D95]'
                      : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  Overview & Description
                </button>
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 flex items-center gap-1 ${
                    activeTab === 'summary'
                      ? 'border-[#4C1D95] text-[#4C1D95]'
                      : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>AI Executive Summary</span>
                </button>
                <button
                  onClick={() => setActiveTab('similar')}
                  className={`pb-2 text-xs font-bold transition-colors border-b-2 ${
                    activeTab === 'similar'
                      ? 'border-[#4C1D95] text-[#4C1D95]'
                      : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
                  }`}
                >
                  Similar Titles ({similarBooks.length})
                </button>
              </div>

              {/* Tab Contents */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-xs md:text-sm text-[var(--app-text)]/90 leading-relaxed">
                    {book.description}
                  </p>

                  {book.conditionNotes && (
                    <div className="p-3 bg-[var(--app-surface-subtle)] rounded-lg border border-[var(--app-border)] text-xs text-[var(--app-text)] flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-[var(--app-text)]">Physical Inspection Report: </span>
                        <span>{book.conditionNotes} (Inspected on {book.lastCheckedDate})</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-3 bg-[#F5F3FF] p-4 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4C1D95]">
                    <Sparkles className="w-4 h-4 text-[#F97316]" />
                    <span>Key Takeaway Synthesis</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {book.aiSummary.summary}
                  </p>
                  <div className="mt-2 space-y-1">
                    <span className="text-[11px] font-semibold text-[#1E293B]">Core Principles:</span>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                      {book.aiSummary.keyIdeas.map((idea, i) => (
                        <li key={i}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'similar' && (
                <div className="space-y-2">
                  {similarBooks.length === 0 ? (
                    <p className="text-xs text-[var(--app-text-muted)]">No other books in this specific category yet.</p>
                  ) : (
                    similarBooks.map(sim => (
                      <div 
                        key={sim.id}
                        onClick={() => openBookModal(sim)}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-[var(--app-border)] hover:border-[#4C1D95] hover:bg-[var(--app-surface-subtle)] cursor-pointer transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-semibold text-[var(--app-text)] truncate">{sim.title}</h4>
                          <p className="text-[11px] text-[var(--app-text-muted)]">by {sim.author}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#4C1D95] shrink-0">View &rarr;</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Action Buttons Toolbar */}
              <div className="mt-6 pt-4 border-t border-[var(--app-border)] flex flex-wrap gap-2.5">
                <button
                  disabled={!isAvailable}
                  onClick={() => {
                    borrowBook(book.id);
                  }}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors ${
                    isAvailable
                      ? 'bg-[#4C1D95] text-white hover:bg-[#3B0764] shadow-sm active:scale-95'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-[#F97316]" />
                  <span>{isAvailable ? 'Borrow Book (14 Days)' : 'Currently Unavailable'}</span>
                </button>

                <button
                  onClick={() => reserveBook(book.id)}
                  className="py-2 px-3.5 rounded-xl font-semibold text-xs border border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-surface-elevated)] hover:bg-[var(--app-surface-subtle)] hover:border-[#4C1D95] transition-colors"
                >
                  Reserve Hold
                </button>

                <button
                  onClick={() => toggleWishlist(book.id)}
                  className={`py-2 px-3.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-1.5 ${
                    isWishlisted
                      ? 'border-[#F97316] bg-[#FFF7ED] text-[#F97316]'
                      : 'border-[var(--app-border)] text-[var(--app-text)] bg-[var(--app-surface-elevated)] hover:bg-[var(--app-surface-subtle)]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#F97316] text-[#F97316]' : ''}`} />
                  <span>{isWishlisted ? 'Saved' : 'Reading List'}</span>
                </button>

                <button
                  onClick={() => {
                    closeBookModal();
                    setCurrentPage('companion-finder');
                  }}
                  className="py-2 px-3.5 rounded-xl font-semibold text-xs border border-violet-200 text-[#4C1D95] bg-[#F5F3FF] hover:bg-violet-100 transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-[#4C1D95]" />
                  <span>Find Companion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
