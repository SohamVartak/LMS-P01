import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookCard } from '../components/common/BookCard';
import { Book } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
  color: string;
  recommendedBookIds: string[];
}

export const ReadingMoodPage: React.FC = () => {
  const { books } = useLibrary();
  const [selectedMoodId, setSelectedMoodId] = useState<string>('curious');

  const moods: MoodOption[] = [
    { id:'focused', emoji:'🎯', label:'Focused', subtitle:'Structured technical learning', color:'hover:border-blue-400 bg-blue-50/40' },
    { id:'curious', emoji:'🧠', label:'Curious', subtitle:'Explore a new engineering topic', color:'hover:border-indigo-400 bg-indigo-50/40' },
    { id:'motivated', emoji:'🔥', label:'Motivated', subtitle:'Build practical technical skills', color:'hover:border-orange-400 bg-orange-50/40' },
    { id:'exploring', emoji:'🔎', label:'Exploring', subtitle:'Discover something outside your usual area', color:'hover:border-teal-400 bg-teal-50/40' }
  ];

  const currentMood = moods.find(m => m.id === selectedMoodId) || moods[3];
  const matchedBooks = books.filter(b => {
    const text = `${b.category} ${b.title} ${b.description}`.toLowerCase();
    if (selectedMoodId === 'focused') return /computer|software|algorithm|engineering|systems/.test(text);
    if (selectedMoodId === 'curious') return /artificial|science|computer|electronics|signals/.test(text);
    if (selectedMoodId === 'motivated') return /software|engineering|embedded|design|machine/.test(text);
    return true;
  }).slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Affective Reader Matching
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5">
          How are you feeling today?
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your emotional or intellectual frequency to discover books tuned to your current wavelength.
        </p>
      </div>

      {/* Mood Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {moods.map((mood) => {
          const isSelected = selectedMoodId === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => setSelectedMoodId(mood.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-28 relative overflow-hidden ${
                isSelected
                  ? 'border-blue-900 bg-white ring-2 ring-blue-950 shadow-md translate-y-[-2px]'
                  : `border-slate-200 bg-white hover:shadow-xs ${mood.color}`
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{mood.emoji}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-blue-900" />
                )}
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 truncate">
                  {mood.label}
                </span>
                <span className="block text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {mood.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mood Showcase Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentMood.emoji}</span>
            <h2 className="text-base font-bold text-slate-900 font-serif-academic">
              You&apos;re feeling {currentMood.label}
            </h2>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            &quot;{currentMood.subtitle}&quot; — Here are some books curated for this state of mind.
          </p>
        </div>

        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shrink-0 font-tabular">
          {matchedBooks.length} recommended titles
        </span>
      </div>

      {/* Book Recommendations Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {matchedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

    </div>
  );
};
