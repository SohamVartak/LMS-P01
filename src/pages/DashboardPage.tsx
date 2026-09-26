import React, { useState, useEffect } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/common/BookCard';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { 
  BookOpen, 
  CheckCircle, 
  Flame, 
  Clock, 
  Search, 
  Armchair, 
  Sparkles, 
  Dices, 
  QrCode, 
  Users, 
  ChevronRight, 
  ArrowRight,
  Sliders
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    books, 
    borrowedBooks, 
    activities,
    setCurrentPage, 
    openBookModal,
    updateReadingProgress 
  } = useLibrary();

  // Live circulation statistics from Supabase-backed records
  const activeIssues = borrowedBooks.filter(b => b.status === 'Borrowed' || b.status === 'Currently Reading' || b.status === 'Overdue');
  const completedCount = borrowedBooks.filter(b => b.status === 'Completed').length;
  const pendingRequests = borrowedBooks.filter(b => b.status === 'Reserved').length;
  const dueSoonCount = activeIssues.filter(b => {
    if (!b.dueDate) return false;
    const due = new Date(b.dueDate + 'T23:59:59');
    const days = (due.getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 7;
  }).length;

  const [animatedStats, setAnimatedStats] = useState({ borrowed: 0, completed: 0, pending: 0 });

  const [activeProgressModal, setActiveProgressModal] = useState<string | null>(null);
  const [tempProgress, setTempProgress] = useState<number>(0);

  useEffect(() => {
    const duration = 500;
    const steps = 10;
    const intervalTime = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const factor = step / steps;
      setAnimatedStats({
        borrowed: Math.round(activeIssues.length * factor),
        completed: Math.round(completedCount * factor),
        pending: Math.round(pendingRequests * factor)
      });
      if (step >= steps) clearInterval(timer);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [activeIssues.length, completedCount, pendingRequests]);


  // Currently Reading books from borrowed records
  const currentlyReadingRecords = borrowedBooks.filter(
    b => b.status === 'Currently Reading' || b.progressPercent > 0
  );

  // Recommendations come from the current approved catalogue; no synthetic ranking is applied.
  const recommendedBooks = books.slice(0, 6);

  const liveActivities = borrowedBooks.slice(0, 5).map(record => ({
    id: `borrow-${record.id}`,
    title: record.status === 'Completed' ? 'Book returned' : record.status === 'Reserved' ? 'Book reserved' : 'Book borrowed',
    description: `${record.bookTitle} · ${record.status}`,
    timestamp: record.borrowDate ? new Date(record.borrowDate).toLocaleDateString('en-IN') : 'Date not recorded'
  }));

  const activityItems = liveActivities.length ? liveActivities : activities.slice(0, 5);

  const quickActions = [
    {
      title: 'Find Book',
      icon: <Search className="w-4 h-4 text-[var(--app-accent)]" />,
      desc: 'Catalogue search',
      action: () => setCurrentPage('browse-books')
    },
    {
      title: 'Reserve Seat',
      icon: <Armchair className="w-4 h-4 text-emerald-400" />,
      desc: 'Floor carrel booking',
      action: () => setCurrentPage('seat-reservation')
    },
    {
      title: 'AI Advisor',
      icon: <Sparkles className="w-4 h-4 text-[var(--app-accent)]" />,
      desc: 'Smart match engine',
      action: () => setCurrentPage('ai-recommendations')
    },
    {
      title: 'Surprise Me',
      icon: <Dices className="w-4 h-4 text-[var(--app-primary)]" />,
      desc: 'Random discovery',
      action: () => setCurrentPage('surprise-me')
    },
    {
      title: 'Smart Shelf',
      icon: <QrCode className="w-4 h-4 text-amber-400" />,
      desc: 'Scan physical stacks',
      action: () => setCurrentPage('smart-shelf')
    },
    {
      title: 'Companion',
      icon: <Users className="w-4 h-4 text-fuchsia-400" />,
      desc: 'Find study partner',
      action: () => setCurrentPage('companion-finder')
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Greeting Banner: Dynamic Vibrant Multi-Color Jewel Gradient - 100% Zero Blue */}
      <div 
        className="text-[var(--app-text)] rounded-2xl p-6 sm:p-8 shadow-xl border relative overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, var(--app-surface-elevated) 0%, var(--app-surface-subtle) 40%, var(--app-primary-dark) 100%)',
          borderColor: 'var(--app-border)'
        }}
      >
        {/* Radiant multi-color glowing ambient bursts */}
        <div 
          className="absolute -right-8 -top-8 w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-35"
          style={{ backgroundColor: 'var(--app-accent)' }}
        />
        <div 
          className="absolute right-1/3 -bottom-10 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-25"
          style={{ backgroundColor: 'var(--app-primary)' }}
        />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--app-surface)]/80 border border-[var(--app-border)] text-[var(--app-accent)] text-xs font-semibold mb-3 shadow-xs">
            <span>Year {user.year || '—'}</span>
            <span>·</span>
            <span>{user.department}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif-academic text-[var(--app-text)] tracking-tight">
            Good Morning, {user.name || 'Student'} 👋
          </h1>
          <p className="text-[var(--app-text-muted)] text-xs sm:text-sm mt-1 leading-relaxed">
            Continue your reading journey. You have <strong className="text-[var(--app-accent)] font-semibold">{dueSoonCount} books due soon</strong> and <strong className="text-[var(--app-text)] font-semibold">{pendingRequests} pending requests</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentPage('browse-books')}
              className="py-2.5 px-5 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[#0E0926] font-bold text-xs transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </button>
            <button
              onClick={() => setCurrentPage('seat-reservation')}
              className="py-2.5 px-4 rounded-xl bg-[var(--app-surface)]/80 hover:bg-[var(--app-surface)] text-[var(--app-text)] border border-[var(--app-border)] font-semibold text-xs transition-colors flex items-center gap-2 backdrop-blur-xs shadow-xs"
            >
              <Armchair className="w-3.5 h-3.5 text-[var(--app-accent)]" />
              <span>Book Study Carrel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Books Borrowed */}
        <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--app-text-muted)]">Books Borrowed</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-subtle)] text-[var(--app-accent)] flex items-center justify-center border border-[var(--app-border)]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-[var(--app-text)] transition-all duration-700">
              {animatedStats.borrowed}
            </span>
            <span className="text-[11px] text-[var(--app-text-muted)]">active issues</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-tabular">Active circulation records</p>
        </div>

        {/* Card 2: Books Completed */}
        <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--app-text-muted)]">Books Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-[var(--app-text)] transition-all duration-700">
              {animatedStats.completed}
            </span>
            <span className="text-[11px] text-[var(--app-text-muted)]">completed</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Recorded in your library history</p>
        </div>

        {/* Card 3: Reading Streak */}
        <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--app-text-muted)]">Reading Streak</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center">
              <Flame className="w-4 h-4 animate-flame" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-[var(--app-text)] transition-all duration-700">
              {user.readingStreak || 0}
            </span>
            <span className="text-[11px] text-amber-400 font-bold">active days</span>
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] mt-1">Live from your library activity</p>
        </div>

        {/* Card 4: Pending Returns */}
        <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--app-text-muted)]">Pending Returns</span>
            <div className="w-8 h-8 rounded-lg bg-orange-950/60 text-orange-400 border border-orange-800/40 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-[var(--app-text)] transition-all duration-700">
              {animatedStats.pending}
            </span>
            <span className="text-[11px] text-orange-400 font-semibold">due soon</span>
          </div>
          <p className="text-[11px] text-orange-400/90 mt-1 font-medium">{dueSoonCount > 0 ? 'Check My Books for due dates' : 'No books due in the next 7 days'}</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-muted)] mb-3">
          Quick Library Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((qa, index) => (
            <button
              key={index}
              onClick={qa.action}
              className="p-3.5 rounded-xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] hover:border-[var(--app-accent)] hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--app-surface-subtle)] group-hover:bg-[var(--app-surface)] flex items-center justify-center transition-colors">
                {qa.icon}
              </div>
              <div className="mt-3">
                <span className="block text-xs font-bold text-[var(--app-text)] group-hover:text-[var(--app-accent)] transition-colors">
                  {qa.title}
                </span>
                <span className="block text-[10px] text-[var(--app-text-muted)] mt-0.5">
                  {qa.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Currently Reading & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Currently Reading */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[var(--app-text)] font-serif-academic">
                Currently Reading
              </h2>
              <p className="text-xs text-[var(--app-text-muted)]">Pick up right where you left off</p>
            </div>
            <button
              onClick={() => setCurrentPage('my-books')}
              className="text-xs font-semibold text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] flex items-center gap-1"
            >
              <span>View All My Books</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {currentlyReadingRecords.map(rec => (
              <div
                key={rec.id}
                className="bg-[var(--app-surface-elevated)] p-4 rounded-xl border border-[var(--app-border)] shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:border-[var(--app-primary)] transition-colors"
              >
                {/* Book Cover */}
                <div className="shrink-0 cursor-pointer" onClick={() => {
                  const b = books.find(item => item.id === rec.bookId);
                  if (b) openBookModal(b);
                }}>
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
                </div>

                {/* Progress Details */}
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--app-accent)] tracking-wider">
                        {rec.category}
                      </span>
                      <h3 
                        onClick={() => {
                          const b = books.find(item => item.id === rec.bookId);
                          if (b) openBookModal(b);
                        }}
                        className="font-bold text-[var(--app-text)] text-sm hover:text-[var(--app-accent)] cursor-pointer transition-colors line-clamp-1"
                      >
                        {rec.bookTitle}
                      </h3>
                      <p className="text-xs text-[var(--app-text-muted)]">by {rec.author}</p>
                    </div>

                    <span className="text-xs font-bold text-[var(--app-accent)] font-tabular px-2 py-0.5 bg-[var(--app-surface-subtle)] rounded border border-[var(--app-border)]">
                      {rec.progressPercent}%
                    </span>
                  </div>

                  {/* Progress Bar with Royal Violet to Coral */}
                  <div className="mt-3">
                    <div className="w-full bg-[var(--app-surface-subtle)] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-accent)] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${rec.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[var(--app-text-muted)] mt-1 font-tabular">
                      <span>{rec.pagesRead} of {rec.totalPages} pages read</span>
                      <span>Due: {rec.dueDate}</span>
                    </div>
                  </div>

                  {/* Continue Reading / Update Progress */}
                  <div className="mt-3 pt-2.5 border-t border-[var(--app-border)] flex items-center justify-between">
                    <button
                      onClick={() => {
                        const b = books.find(item => item.id === rec.bookId);
                        if (b) openBookModal(b);
                      }}
                      className="text-xs font-semibold text-[var(--app-text)] hover:text-[var(--app-accent)] flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[var(--app-accent)]" />
                      <span>Continue Reading</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveProgressModal(rec.id);
                        setTempProgress(rec.progressPercent);
                      }}
                      className="text-xs font-medium text-[var(--app-text-muted)] hover:text-[var(--app-text)] flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3 opacity-60" />
                      <span>Log Pages</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Activity Timeline */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--app-text)] font-serif-academic">
              Recent Library Activity
            </h2>
            <p className="text-xs text-[var(--app-text-muted)]">Your campus circulation trail</p>
          </div>

          <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs space-y-4">
            {activityItems.map((act, index) => (
              <div key={act.id} className="flex items-start gap-3 relative">
                {/* Timeline vertical connector */}
                {index < activities.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-px bg-[var(--app-border)]" />
                )}

                <div className="w-5 h-5 rounded-full bg-[var(--app-surface-subtle)] border border-[var(--app-border)] text-[var(--app-accent)] flex items-center justify-center shrink-0 z-10 text-[10px] font-bold">
                  •
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-[var(--app-text)] truncate">
                      {act.title}
                    </h4>
                    <span className="text-[10px] text-[var(--app-text-muted)] shrink-0 font-tabular">
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--app-text-muted)] mt-0.5 leading-snug">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}

            {activityItems.length === 0 && (
              <p className="text-xs text-[var(--app-text-muted)] py-4">No library activity has been recorded yet.</p>
            )}

            <button
              onClick={() => setCurrentPage('my-books')}
              className="w-full mt-2 py-2 text-center text-xs font-semibold text-[var(--app-accent)] hover:bg-[var(--app-surface-subtle)] rounded-lg transition-colors border border-[var(--app-border)]"
            >
              View Full History &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Recommended Books Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--app-text)] font-serif-academic">
              Recommended for You
            </h2>
            <p className="text-xs text-[var(--app-text-muted)]">Selected from the current approved engineering catalogue</p>
          </div>
          <button
            onClick={() => setCurrentPage('browse-books')}
            className="text-xs font-semibold text-[var(--app-accent)] hover:text-[var(--app-accent-hover)] flex items-center gap-1"
          >
            <span>Explore All Books</span>
            <ArrowRight className="w-3.5 h-3.5 text-[var(--app-accent)]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {recommendedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      {/* Quick Log Pages / Progress Modal */}
      {activeProgressModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setActiveProgressModal(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-[var(--app-surface-elevated)] rounded-xl p-6 max-w-sm w-full shadow-2xl border border-[var(--app-border)]"
          >
            <h3 className="text-sm font-bold text-[var(--app-text)] mb-1">Update Reading Progress</h3>
            <p className="text-xs text-[var(--app-text-muted)] mb-4">Set your current completion percentage:</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--app-text)] font-tabular">
                <span>Completion:</span>
                <span className="text-[#4C1D95] text-sm">{tempProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={tempProgress}
                onChange={e => setTempProgress(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#4C1D95]"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveProgressModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-[var(--app-surface-subtle)] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateReadingProgress(activeProgressModal, tempProgress);
                  setActiveProgressModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#4C1D95] hover:bg-[#3B0764] rounded-lg shadow-xs"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
