import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Users, BookOpen, Target, CheckCircle2, UserPlus, Search, Sparkles, Clock } from 'lucide-react';

export const CompanionFinderPage: React.FC = () => {
  const { companions, connectCompanion } = useLibrary();
  const [filterGenre, setFilterGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const genres = [
    'All',
    'Computer Science',
    'Software Engineering',
    'Finance & Business',
    'Science & Physics',
    'Self-Improvement'
  ];

  const filteredCompanions = companions.filter(c => {
    const matchesSearch = 
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentlyReading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre = filterGenre === 'All' || c.favoriteGenre.toLowerCase().includes(filterGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

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

      {/* Companions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanions.map(companion => (
          <div
            key={companion.id}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div>
              {/* Header: Avatar, Name, Compatibility */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${companion.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-xs`}>
                    {companion.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {companion.name}
                    </h3>
                    <p className="text-xs text-slate-500">{companion.department}</p>
                    <p className="text-[11px] text-slate-400">{companion.year}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-tabular bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{companion.compatibility}% Match</span>
                </span>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 mt-3 italic line-clamp-2">
                &quot;{companion.bio}&quot;
              </p>

              {/* Current Book Info */}
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Reading: <strong>{companion.currentlyReading}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Goal: {companion.readingGoal}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>Cadence: {companion.preferredReadingTime} ({companion.readingLevel})</span>
                </div>
              </div>

              {/* Genre Tag */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                  Focus: {companion.favoriteGenre}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              {companion.connectionStatus === 'connected' ? (
                <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Study Partner Connected</span>
                </div>
              ) : (
                <button
                  onClick={() => connectCompanion(companion.id)}
                  className="w-full py-2 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Invite to Study Circle</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
