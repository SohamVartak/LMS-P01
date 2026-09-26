import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCondition } from '../types';
import { 
  ArrowLeftRight, 
  Plus, 
  Search, 
  ShieldCheck, 
  User, 
  CheckCircle, 
  Clock, 
  X,
  BookOpen
} from 'lucide-react';

export const BookExchangePage: React.FC = () => {
  const { exchangeItems, addExchangeListing, requestExchange } = useLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Listing modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('Computer Science');
  const [newCondition, setNewCondition] = useState<BookCondition>('Good');
  const [newDescription, setNewDescription] = useState('');

  const filteredItems = exchangeItems.filter(item => {
    const matchesQuery = 
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCondition = selectedCondition === 'All' || item.condition === selectedCondition;

    return matchesQuery && matchesCondition;
  });

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    await addExchangeListing({
      title: newTitle,
      author: newAuthor,
      category: newCategory,
      condition: newCondition,
      description: newDescription.trim() || 'No description provided.'
    });

    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
    setIsModalOpen(false);
  };

  const conditionColors: Record<BookCondition, string> = {
    'Excellent': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'Good': 'text-blue-700 bg-blue-50 border-blue-200',
    'Needs Attention': 'text-amber-700 bg-amber-50 border-amber-200',
    'Damaged': 'text-rose-700 bg-rose-50 border-rose-200'
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
            Peer-to-Peer Academic Sharing
          </span>
          <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
            <span>Student Book Exchange</span>
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            List a physical engineering book you own and request books offered by other students.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-2.5 px-4 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Book for Exchange</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbook title, author, or student name..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="All">All Physical Conditions</option>
            <option value="Excellent">Excellent (Like New)</option>
            <option value="Good">Good (Minor Pencil Marks)</option>
            <option value="Needs Attention">Fair (Used / Highlighted)</option>
          </select>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                  {item.category}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${conditionColors[item.condition]}`}>
                  {item.condition}
                </span>
              </div>

              {/* Title & Author */}
              <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">by {item.author}</p>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100 line-clamp-3">
                &quot;{item.description}&quot;
              </p>
            </div>

            {/* Poster Info & Request Action */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  {item.ownerName[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-none">{item.ownerName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.department.split('&')[0]} · {item.year.split(' ')[0]}</p>
                </div>
              </div>

              {item.status === 'Available' ? (
                <button
                  onClick={() => void requestExchange(item.id)}
                  className="py-1.5 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Request</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Pending</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Post a Book Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif-academic">
                Post a Textbook for Exchange
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Textbook Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Operating System Concepts"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Author(s)
                </label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={e => setNewAuthor(e.target.value)}
                  placeholder="e.g. Silberschatz & Galvin"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Artificial Intelligence</option>
                    <option>Mathematics</option>
                    <option>Physics & Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Physical Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={e => setNewCondition(e.target.value as BookCondition)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Needs Attention">Fair / Annotated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Exchange Notes / Edition
                </label>
                <textarea
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Mention 10th edition, includes solved past gate questions, willing to exchange for DBMS textbook..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-950 hover:bg-blue-900 rounded-lg shadow-xs"
                >
                  Publish Exchange Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
