import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { BorrowRecord } from '../types';
import { 
  BookMarked, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Bookmark, 
  Sliders, 
  BookOpen, 
  Trash2
} from 'lucide-react';

export const MyBooksPage: React.FC = () => {
  const { 
    borrowedBooks, 
    books, 
    wishlist, 
    toggleWishlist, 
    returnBook, 
    updateReadingProgress, 
    borrowBook, 
    openBookModal 
  } = useLibrary();

  const [activeTab, setActiveTab] = useState<'reading' | 'borrowed' | 'completed' | 'reserved' | 'wishlist'>('reading');
  const [editingProgressId, setEditingProgressId] = useState<string | null>(null);
  const [progressVal, setProgressVal] = useState(50);

  // Categorize records
  const currentlyReading = borrowedBooks.filter(b => b.status === 'Currently Reading');
  const activeBorrowed = borrowedBooks.filter(b => b.status === 'Borrowed');
  const completedBooks = borrowedBooks.filter(b => b.status === 'Completed');
  const reservedBooks = borrowedBooks.filter(b => b.status === 'Reserved');
  const wishlistedBooks = books.filter(b => wishlist.includes(b.id));

  const tabCounts = {
    reading: currentlyReading.length,
    borrowed: activeBorrowed.length,
    completed: completedBooks.length,
    reserved: reservedBooks.length,
    wishlist: wishlistedBooks.length
  };

  const handleOpenProgress = (record: BorrowRecord) => {
    setEditingProgressId(record.id);
    setProgressVal(record.progressPercent);
  };

  const handleSaveProgress = () => {
    if (editingProgressId) {
      updateReadingProgress(editingProgressId, progressVal);
      setEditingProgressId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-[#4C1D95] uppercase tracking-wider">
            Personal Academic Bookshelf
          </span>
          <h1 className="text-2xl font-bold font-serif-academic text-[#1E293B] tracking-tight">
            My Books
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your active circulation loans, reading milestones, reserved holds, and wishlist.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span className="px-2.5 py-1 bg-[#F5F3FF] text-[#4C1D95] rounded-lg border border-violet-200 font-tabular font-bold">
            {borrowedBooks.filter(b => b.status !== 'Completed' && b.status !== 'Reserved').length} of 6 Quota Used
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px text-xs font-medium">
        <button
          onClick={() => setActiveTab('reading')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'reading'
              ? 'border-[#4C1D95] text-[#4C1D95] font-bold'
              : 'border-transparent text-slate-500 hover:text-[#1E293B]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#4C1D95]" />
          <span>Currently Reading ({tabCounts.reading})</span>
        </button>

        <button
          onClick={() => setActiveTab('borrowed')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'borrowed'
              ? 'border-[#4C1D95] text-[#4C1D95] font-bold'
              : 'border-transparent text-slate-500 hover:text-[#1E293B]'
          }`}
        >
          <BookMarked className="w-4 h-4 text-[#4C1D95]" />
          <span>Issued ({tabCounts.borrowed})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'completed'
              ? 'border-[#4C1D95] text-[#4C1D95] font-bold'
              : 'border-transparent text-slate-500 hover:text-[#1E293B]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Completed ({tabCounts.completed})</span>
        </button>

        <button
          onClick={() => setActiveTab('reserved')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'reserved'
              ? 'border-[#4C1D95] text-[#4C1D95] font-bold'
              : 'border-transparent text-slate-500 hover:text-[#1E293B]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#F97316]" />
          <span>Reserved Holds ({tabCounts.reserved})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            activeTab === 'wishlist'
              ? 'border-[#4C1D95] text-[#4C1D95] font-bold'
              : 'border-transparent text-slate-500 hover:text-[#1E293B]'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#F97316]" />
          <span>Wishlist ({tabCounts.wishlist})</span>
        </button>
      </div>

      {/* Tab Panels */}

      {/* 1. Currently Reading */}
      {activeTab === 'reading' && (
        <div className="space-y-4">
          {currentlyReading.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No books currently in progress</p>
              <p className="text-xs text-slate-500 mt-1">Start reading one of your borrowed books to log progress.</p>
            </div>
          ) : (
            currentlyReading.map(rec => (
              <div 
                key={rec.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <BookSpineCover 
                    book={{
                      title: rec.bookTitle,
                      author: rec.author,
                      category: rec.category,
                      coverGradient: rec.coverGradient,
                      coverAccent: '#F97316'
                    }} 
                    size="sm" 
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#4C1D95] tracking-wider">
                      {rec.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B] hover:text-[#4C1D95] cursor-pointer"
                        onClick={() => {
                          const b = books.find(item => item.id === rec.bookId);
                          if (b) openBookModal(b);
                        }}>
                      {rec.bookTitle}
                    </h3>
                    <p className="text-xs text-slate-500">by {rec.author}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-tabular">
                      <span>Due: <strong className="text-[#1E293B]">{rec.dueDate}</strong></span>
                      <span>·</span>
                      <span>{rec.pagesRead} of {rec.totalPages} pages</span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#1E293B]">
                    <span>Reading Progress</span>
                    <span className="text-[#4C1D95] font-bold font-tabular">{rec.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#4C1D95] to-[#F97316] h-2 rounded-full" style={{ width: `${rec.progressPercent}%` }} />
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleOpenProgress(rec)}
                      className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 text-[#1E293B] hover:bg-slate-50 hover:border-[#4C1D95] text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      <Sliders className="w-3 h-3 text-slate-400" />
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => returnBook(rec.id)}
                      className="py-1.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Return</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. Borrowed (Not yet reading or fresh issue) */}
      {activeTab === 'borrowed' && (
        <div className="space-y-4">
          {activeBorrowed.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <BookMarked className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No additional borrowed books</p>
              <p className="text-xs text-slate-500 mt-1">All borrowed books are currently in progress or completed.</p>
            </div>
          ) : (
            activeBorrowed.map(rec => (
              <div 
                key={rec.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <BookSpineCover 
                    book={{
                      title: rec.bookTitle,
                      author: rec.author,
                      category: rec.category,
                      coverGradient: rec.coverGradient,
                      coverAccent: '#F97316'
                    }} 
                    size="sm" 
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#4C1D95] tracking-wider">
                      {rec.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B]">{rec.bookTitle}</h3>
                    <p className="text-xs text-slate-500">by {rec.author}</p>
                    <p className="text-[11px] text-slate-500 mt-1 font-tabular">
                      Borrowed on {rec.borrowDate} · Due: <strong className="text-[#1E293B]">{rec.dueDate}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateReadingProgress(rec.id, 10)}
                    className="py-1.5 px-4 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Start Reading</span>
                  </button>
                  <button
                    onClick={() => returnBook(rec.id)}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 text-[#1E293B] hover:bg-slate-50 text-xs font-semibold"
                  >
                    Return Copy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. Completed Books */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedBooks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No completed books logged yet</p>
            </div>
          ) : (
            completedBooks.map(rec => (
              <div 
                key={rec.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <BookSpineCover 
                    book={{
                      title: rec.bookTitle,
                      author: rec.author,
                      category: rec.category,
                      coverGradient: rec.coverGradient,
                      coverAccent: '#10b981'
                    }} 
                    size="sm" 
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed 100%</span>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E293B] mt-0.5">{rec.bookTitle}</h3>
                    <p className="text-xs text-slate-500">by {rec.author}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-tabular">
                      All {rec.totalPages} pages finished
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const b = books.find(item => item.id === rec.bookId);
                      if (b) openBookModal(b);
                    }}
                    className="py-1.5 px-3 rounded-lg border border-slate-300 text-[#1E293B] hover:bg-slate-50 text-xs font-semibold"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => borrowBook(rec.bookId)}
                    className="py-1.5 px-3 rounded-lg bg-[#F5F3FF] text-[#4C1D95] border border-violet-200 hover:bg-violet-100 text-xs font-semibold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Re-issue</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Reserved Holds */}
      {activeTab === 'reserved' && (
        <div className="space-y-4">
          {reservedBooks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No active book hold reservations</p>
            </div>
          ) : (
            reservedBooks.map(rec => (
              <div 
                key={rec.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <BookSpineCover 
                    book={{
                      title: rec.bookTitle,
                      author: rec.author,
                      category: rec.category,
                      coverGradient: rec.coverGradient,
                      coverAccent: '#F97316'
                    }} 
                    size="sm" 
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-[#F97316] bg-[#FFF7ED] px-2 py-0.5 rounded border border-[#F97316]/30">
                      Hold Pending Return
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B] mt-1">{rec.bookTitle}</h3>
                    <p className="text-xs text-slate-500">by {rec.author}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Priority queue position: #1 · You will receive an SMS/Email notification upon check-in.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => returnBook(rec.id)}
                  className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                >
                  Cancel Hold
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedBooks.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Your reading wishlist is currently empty</p>
              <p className="text-xs text-slate-500 mt-1">Browse the catalogue and click the bookmark icon to save titles for later.</p>
            </div>
          ) : (
            wishlistedBooks.map(book => (
              <div 
                key={book.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <BookSpineCover book={book} size="sm" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#4C1D95] tracking-wider">
                      {book.category}
                    </span>
                    <h3 className="text-sm font-bold text-[#1E293B]">{book.title}</h3>
                    <p className="text-xs text-slate-500">by {book.author}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {book.shelfLocation} · {book.availableCopies} available of {book.totalCopies}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => borrowBook(book.id)}
                    className="py-1.5 px-3 rounded-lg bg-[#4C1D95] text-white hover:bg-[#3B0764] text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>Issue Now</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Progress Update Modal */}
      {editingProgressId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setEditingProgressId(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-slate-200"
          >
            <h3 className="text-sm font-bold text-[#1E293B] mb-1">Update Reading Progress</h3>
            <p className="text-xs text-slate-500 mb-4">Set percentage completed:</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E293B] font-tabular">
                <span>Completed:</span>
                <span className="text-[#4C1D95] text-sm">{progressVal}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={e => setProgressVal(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4C1D95]"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingProgressId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4C1D95] hover:bg-[#3B0764] rounded-lg shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
