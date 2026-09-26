import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLibrary } from '../context/LibraryContext';
import { BookCondition } from '../types';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Wrench, 
  X,
  FileCheck
} from 'lucide-react';

export const BookHealthPage: React.FC = () => {
  const { books: contextBooks, openBookModal, userRole } = useLibrary();
  const [books, setBooks] = useState<any[]>(contextBooks);
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('books').select('id,title,author_name,category,shelf_location,condition,condition_notes,condition_set_at,author_id').eq('approval_status','APPROVED').order('title');
      setBooks(data || []);
    };
    void load();
  }, []);
  const updateBookCondition = async (bookId: string, condition: BookCondition, notes?: string) => {
    if (userRole !== 'ADMIN') return;
    const { error } = await supabase.rpc('set_book_condition', { p_book_id: bookId, p_condition: condition, p_notes: notes || null });
    if (error) {
      const fallback = await supabase.from('books').update({ condition, condition_notes: notes || null, condition_set_at: new Date().toISOString() }).eq('id', bookId);
      if (fallback.error) return;
    }
    const { data } = await supabase.from('books').select('id,title,author_name,category,shelf_location,condition,condition_notes,condition_set_at,author_id').eq('approval_status','APPROVED').order('title');
    setBooks(data || []);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConditionFilter, setSelectedConditionFilter] = useState<string>('All');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [newCondition, setNewCondition] = useState<BookCondition>('Good');
  const [conditionNotes, setConditionNotes] = useState('');

  const conditionCounts = {
    Excellent: books.filter(b => b.condition === 'Excellent').length,
    Good: books.filter(b => b.condition === 'Good').length,
    'Needs Attention': books.filter(b => b.condition === 'Needs Attention').length,
    Damaged: books.filter(b => b.condition === 'Damaged').length,
  };

  const filteredBooks = books.filter(book => {
    const matchesQuery = 
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.shelf_location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCond = selectedConditionFilter === 'All' || book.condition === selectedConditionFilter;

    return matchesQuery && matchesCond;
  });

  const conditionBadges: Record<BookCondition, { style: string; icon: React.ReactNode }> = {
    'Excellent': {
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    'Good': {
      style: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
    },
    'Needs Attention': {
      style: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
    },
    'Damaged': {
      style: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: <Wrench className="w-3.5 h-3.5 text-rose-600" />
    }
  };

  const handleOpenEdit = (bookId: string, currentCond: BookCondition, currentNotes?: string) => {
    setEditingBookId(bookId);
    setNewCondition(currentCond);
    setConditionNotes(currentNotes || '');
  };

  const handleSaveCondition = () => {
    if (editingBookId) {
      updateBookCondition(editingBookId, newCondition, conditionNotes);
      setEditingBookId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Asset Preservation & Circulation Integrity
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Book Health & Condition Monitoring</span>
          <Activity className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor the physical condition recorded for approved library books.
        </p>
      </div>

      {/* Condition Health Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Excellent</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-slate-900">
              {conditionCounts.Excellent}
            </span>
            <span className="text-xs text-slate-500">volumes</span>
          </div>
          <p className="text-[11px] text-emerald-600 mt-1">Pristine physical condition</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Good (Standard)</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-slate-900">
              {conditionCounts.Good}
            </span>
            <span className="text-xs text-slate-500">volumes</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Normal shelf wear</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>Needs Attention</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-slate-900">
              {conditionCounts['Needs Attention']}
            </span>
            <span className="text-xs text-slate-500">volumes</span>
          </div>
          <p className="text-[11px] text-amber-600 mt-1">Spine reinforcement needed</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-rose-700">
            <span>In Bindery / Damaged</span>
            <Wrench className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-tabular text-slate-900">
              {conditionCounts.Damaged}
            </span>
            <span className="text-xs text-slate-500">volumes</span>
          </div>
          <p className="text-[11px] text-rose-600 mt-1">Under repair or replacement</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbook title, author, or rack code..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedConditionFilter}
            onChange={(e) => setSelectedConditionFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            <option value="All">All Health Statuses</option>
            <option value="Excellent">Pristine / Excellent</option>
            <option value="Good">Good Condition</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="Damaged">Damaged / Bindery</option>
          </select>
        </div>
      </div>

      {/* Book Health Register Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Health & Inspection Registry ({filteredBooks.length} Items)
          </h3>
          <span className="text-xs text-slate-500">Condition records are maintained by library administrators.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Book Title & Author</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Physical State</th>
                <th className="py-3 px-4 font-semibold">Last Checked</th>
                <th className="py-3 px-4 font-semibold">Inspection Notes</th>
                <th className="py-3 px-4 font-semibold text-right">Log Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => {
                const badge = conditionBadges[book.condition];
                return (
                  <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div 
                        className="font-semibold"
                      >
                        <span className="font-semibold block truncate max-w-xs">{book.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">by {book.author_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {book.shelf_location}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border ${badge.style}`}>
                        {badge.icon}
                        <span>{book.condition}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-tabular">
                      {book.condition_set_at ? new Date(book.condition_set_at).toLocaleDateString('en-IN') : 'Not checked'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                      {book.condition_notes || 'No inspection note recorded.'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {userRole === 'ADMIN' && (
                        <button
                          onClick={() => handleOpenEdit(book.id, book.condition, book.condition_notes)}
                          className="py-1 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold transition-colors"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Condition Modal */}
      {editingBookId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setEditingBookId(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 font-serif-academic">
                Log Physical Condition Audit
              </h3>
              <button onClick={() => setEditingBookId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Physical Health Rating
              </label>
              <select
                value={newCondition}
                onChange={e => setNewCondition(e.target.value as BookCondition)}
                className="w-full py-2 px-3 rounded-lg border border-slate-300 text-xs bg-white font-medium"
              >
                <option value="Excellent">Excellent — Crisp spine, clean pages</option>
                <option value="Good">Good — Minor cosmetic shelf rubbing</option>
                <option value="Needs Attention">Needs Attention — Binding loose or highlighted pages</option>
                <option value="Damaged">Damaged — Sent to college bindery for repair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Inspector Observation Notes
              </label>
              <textarea
                value={conditionNotes}
                onChange={e => setConditionNotes(e.target.value)}
                placeholder="e.g. Spine reinforced with archival cloth tape; barcode relabeled..."
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingBookId(null)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCondition}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-950 hover:bg-blue-900 rounded-lg shadow-xs"
              >
                Save Inspection Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
