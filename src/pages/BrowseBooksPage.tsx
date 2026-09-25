import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/common/BookCard';
import { BookCategory } from '../types';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  BookOpen,
  Check,
  Clock,
  X
} from 'lucide-react';

export const BrowseBooksPage: React.FC = () => {
  const { books, searchHistory, addSearchHistory, removeSearchHistoryItem, clearSearchHistory } = useLibrary();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [availabilityOnly, setAvailabilityOnly] = useState<boolean>(false);
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const categories: (BookCategory | 'All')[] = [
    'All',
    'Computer Science',
    'Artificial Intelligence',
    'Software Engineering',
    'Mathematics',
    'Finance & Business',
    'Self-Improvement',
    'Science & Physics',
    'Classic Literature'
  ];

  // Filtering & Sorting pipeline
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Search query (title, author, isbn)
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          book.isbn.toLowerCase().includes(q) ||
          book.shelfLocation.toLowerCase().includes(q);

        // Category filter
        const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

        // Availability filter
        const matchesAvailability = !availabilityOnly || book.availableCopies > 0;

        // Publication Year
        let matchesYear = true;
        if (yearFilter === '2020+') matchesYear = book.publicationYear >= 2020;
        else if (yearFilter === '2010-2019') matchesYear = book.publicationYear >= 2010 && book.publicationYear <= 2019;
        else if (yearFilter === 'classic') matchesYear = book.publicationYear < 2000;

        return matchesQuery && matchesCategory && matchesAvailability && matchesYear;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.publicationYear - a.publicationYear;
        if (sortBy === 'oldest') return a.publicationYear - b.publicationYear;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'author') return a.author.localeCompare(b.author);
        return 0;
      });
  }, [books, searchQuery, selectedCategory, availabilityOnly, yearFilter, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery, filteredBooks.length, selectedCategory !== 'All' ? selectedCategory : undefined);
    }
  };

  const handleApplyHistoryQuery = (query: string) => {
    setSearchQuery(query);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setAvailabilityOnly(false);
    setYearFilter('All');
    setSortBy('popular');
  };

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    availabilityOnly || 
    yearFilter !== 'All';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[var(--app-border)]">
        <div>
          <span className="text-xs font-semibold text-[#4C1D95] uppercase tracking-wider">
            Live Library Catalogue
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-serif-academic text-[var(--app-text)] tracking-tight mt-0.5">
            Explore Our Library
          </h1>
          <p className="text-xs text-[var(--app-text-muted)] mt-1">
            Search the live library catalogue by title, author, ISBN, category, shelf, and availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="py-2 px-3 rounded-lg border border-[var(--app-border)] text-xs font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="text-xs font-semibold text-[var(--app-text-muted)] bg-[var(--app-surface-elevated)] border border-[var(--app-border)] px-3 py-2 rounded-lg font-tabular">
            Showing <strong className="text-[var(--app-text)]">{filteredBooks.length}</strong> of {books.length} Books
          </div>
        </div>
      </div>

      {/* Main Search Bar & Search History Section */}
      <div className="bg-[var(--app-surface-elevated)] p-5 rounded-2xl border border-[var(--app-border)] shadow-xs space-y-4">
        
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by textbook title, author, ISBN, or shelf location (e.g., 'Clean Code', 'Knuth', 'A1')..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] placeholder-[var(--app-text-muted)] focus:outline-hidden focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#4C1D95] hover:bg-[#3B0764] text-white text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters || yearFilter !== 'All'
                  ? 'border-[#4C1D95] bg-[#F5F3FF] text-[#4C1D95]'
                  : 'border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </form>

        {/* Search History Row & Chips */}
        {searchHistory.length > 0 && (
          <div className="pt-2 border-t border-[var(--app-border)] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[var(--app-text-muted)] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#F97316]" />
                <span>Recent Searches:</span>
              </span>

              {searchHistory.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--app-surface-subtle)] border border-[var(--app-border)] text-[var(--app-text)] hover:border-[#4C1D95] hover:bg-[#F5F3FF] transition-all group cursor-pointer"
                  onClick={() => handleApplyHistoryQuery(item.query)}
                >
                  <span className="font-medium group-hover:text-[#4C1D95]">{item.query}</span>
                  <span className="text-[10px] text-[var(--app-text-muted)] font-tabular">({item.resultsCount})</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSearchHistoryItem(item.id);
                    }}
                    className="p-0.5 rounded text-slate-400 hover:text-rose-600 transition-colors ml-0.5"
                    title="Remove item"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={clearSearchHistory}
              className="text-[11px] text-[var(--app-text-muted)] hover:text-rose-600 font-medium transition-colors"
            >
              Clear History
            </button>
          </div>
        )}

        {/* Categories Tab Bar */}
        <div className="pt-1 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#4C1D95] text-white shadow-xs'
                    : 'bg-[var(--app-surface-subtle)] text-[var(--app-text)] hover:bg-[#F5F3FF] hover:text-[#4C1D95]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Panel (Collapsible) */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-[var(--app-border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
            
            {/* Availability Switch */}
            <div className="flex flex-col justify-center">
              <label className="text-xs font-semibold text-[var(--app-text)] mb-1.5">Availability</label>
              <button
                type="button"
                onClick={() => setAvailabilityOnly(!availabilityOnly)}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                  availabilityOnly
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)]'
                }`}
              >
                <span>Only Available in Stacks</span>
                {availabilityOnly && <Check className="w-4 h-4 text-emerald-600" />}
              </button>
            </div>

            {/* Publication Year */}
            <div>
              <label className="text-xs font-semibold text-[var(--app-text)] mb-1.5 block">Publication Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-[var(--app-border)] text-xs bg-[var(--app-surface-elevated)] text-[var(--app-text)] focus:outline-hidden focus:border-[#4C1D95]"
              >
                <option value="All">All Publication Years</option>
                <option value="2020+">2020 and newer</option>
                <option value="2010-2019">2010–2019</option>
                <option value="2000-2009">2000–2009</option>
                <option value="classic">Before 2000</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="text-xs font-semibold text-[var(--app-text)] mb-1.5 block">Sort Catalogue By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2 px-3 rounded-lg border border-[var(--app-border)] text-xs bg-[var(--app-surface-elevated)] text-[var(--app-text)] text-xs focus:outline-hidden focus:border-[#4C1D95]"
              >
                <option value="newest">Newest Publication</option>
                <option value="oldest">Oldest Publication</option>
                <option value="title">Title A–Z</option>
                <option value="author">Author A–Z</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* Book Grid Results */}
      {filteredBooks.length === 0 ? (
        <div className="bg-[var(--app-surface-elevated)] p-12 text-center rounded-2xl border border-[var(--app-border)] space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-[var(--app-text)] font-serif-academic">
            No matching books found
          </h3>
          <p className="text-xs text-[var(--app-text-muted)] max-w-md mx-auto">
            We couldn&apos;t find any books matching &quot;{searchQuery}&quot;. Try adjusting your keywords, selecting a broader discipline, or clearing active filters.
          </p>
          <div className="pt-2">
            <button
              onClick={resetFilters}
              className="py-2 px-4 rounded-xl bg-[#4C1D95] text-white text-xs font-semibold hover:bg-[#3B0764] transition-colors"
            >
              Reset All Filters & Search
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
};
