import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Layers, 
  Users, 
  BookOpen, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const PopularityHeatMapPage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments = [
    'All',
    'Computer Science & Eng',
    'AI & Data Science',
    'Mathematics & Theory',
    'Business & Innovation',
    'Literature & Humanities'
  ];

  // Map category to department
  const getDept = (category: string) => {
    if (category === 'Computer Science' || category === 'Software Engineering') return 'Computer Science & Eng';
    if (category === 'Artificial Intelligence') return 'AI & Data Science';
    if (category === 'Mathematics' || category === 'Science & Physics') return 'Mathematics & Theory';
    if (category === 'Finance & Business' || category === 'Self-Improvement') return 'Business & Innovation';
    return 'Literature & Humanities';
  };

  const filteredBooks = books
    .filter(b => {
      const dept = getDept(b.category);
      const matchesDept = selectedDept === 'All' || dept === selectedDept;
      const matchesQuery = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesQuery;
    })
    .sort((a, b) => b.popularityScore - a.popularityScore);

  const getHeatBadge = (score: number) => {
    if (score >= 90) {
      return {
        label: 'Peak Circulation 🔥',
        style: 'bg-rose-50 text-rose-700 border-rose-200',
        barColor: 'bg-rose-500'
      };
    } else if (score >= 80) {
      return {
        label: 'High Demand',
        style: 'bg-orange-50 text-orange-700 border-orange-200',
        barColor: 'bg-orange-500'
      };
    } else if (score >= 70) {
      return {
        label: 'Moderate',
        style: 'bg-blue-50 text-blue-700 border-blue-200',
        barColor: 'bg-blue-500'
      };
    }
    return {
      label: 'Steady',
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-500'
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Circulation Telemetry
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Popularity Heat Map & Analytics</span>
          <BarChart3 className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor real-time student checkout velocity, textbook demand hotspots, and stack utilization rates across SIT departments.
        </p>
      </div>

      {/* Top Department Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Highest Circulation Stack</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Computer Science & Algorithms</h3>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Utilization Rate:</span>
            <span className="font-bold text-rose-600 font-tabular">94.2%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '94.2%' }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Fastest Turning Over Titles</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">AI & Autonomous Agents</h3>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Utilization Rate:</span>
            <span className="font-bold text-orange-600 font-tabular">88.7%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '88.7%' }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active Campus Reservations</span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">Database Systems & DDIA</h3>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <span>Hold Queue:</span>
            <span className="font-bold text-blue-700 font-tabular">14 students waiting</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '82%' }} />
          </div>
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
            placeholder="Filter title or author in circulation heat map..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'All Academic Departments' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Heat Map Circulation Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Circulation Matrix ({filteredBooks.length} Titles)
          </h3>
          <span className="text-xs text-slate-500">Live RFID circulation readings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Title & Author</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Popularity Index</th>
                <th className="py-3 px-4 font-semibold">Copies Available</th>
                <th className="py-3 px-4 font-semibold">Heat Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBooks.map((book) => {
                const heat = getHeatBadge(book.popularityScore);
                return (
                  <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div 
                        onClick={() => openBookModal(book)}
                        className="cursor-pointer hover:text-blue-700"
                      >
                        <span className="font-semibold block truncate max-w-xs">{book.title}</span>
                        <span className="text-[11px] text-slate-400 font-normal">by {book.author}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium truncate max-w-[130px]">
                      {book.category}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[11px] font-bold font-tabular text-slate-700">
                          <span>{book.popularityScore}%</span>
                          <span className="text-slate-400 font-normal">{book.reviewsCount} reviews</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${heat.barColor}`}
                            style={{ width: `${book.popularityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-tabular">
                      <span className={`font-semibold ${book.availableCopies > 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                        {book.availableCopies}
                      </span>
                      <span className="text-slate-400"> of {book.totalCopies}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${heat.style}`}>
                        {heat.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openBookModal(book)}
                          className="py-1 px-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold"
                        >
                          Details
                        </button>
                        {book.availableCopies > 0 && (
                          <button
                            onClick={() => borrowBook(book.id)}
                            className="py-1 px-2.5 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-[11px] font-semibold"
                          >
                            Issue
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
