import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Users, Search } from 'lucide-react';

export const CompanionFinderPage: React.FC = () => {
  const { } = useLibrary();
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Peer Collaboration
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Find Reading Companions</span>
          <Users className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Connect with students reading the same engineering texts, researching similar DBMS themes, or sharing study goals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, book, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-700"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All Shared Subject Focuses' : g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">No public reading companions yet</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Companion matching will appear here when students have opted in to peer discovery and real reading activity is available. No sample student profiles or synthetic compatibility scores are shown.
        </p>
        <div className="mt-5 max-w-sm mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search will work when companions are available..." disabled className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-400" />
        </div>
      </div>

    </div>
  );
};
