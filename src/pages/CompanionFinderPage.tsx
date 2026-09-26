import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Users, Search } from 'lucide-react';

export const CompanionFinderPage: React.FC = () => {
  useLibrary();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Peer Collaboration</span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 mt-0.5 flex items-center gap-2">
          Find Reading Companions <Users className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Find students who have explicitly opted in to peer reading discovery.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search opted-in companions..."
            disabled
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 bg-slate-50 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-900">No opted-in companions available</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          No student profiles are currently exposed for companion matching. The system will not display fabricated names, books, goals, or compatibility scores.
        </p>
      </div>
    </div>
  );
};
