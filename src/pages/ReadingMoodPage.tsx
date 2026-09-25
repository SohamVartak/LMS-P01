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
    {
      id: 'happy',
      emoji: '😊',
      label: 'Happy & Joyful',
      subtitle: 'Lighthearted inspiration and uplifting narratives',
      color: 'hover:border-amber-400 bg-amber-50/40',
      recommendedBookIds: ['b-13', 'b-14', 'b-10'] // Ikigai, Alchemist, Python
    },
    {
      id: 'calm',
      emoji: '😌',
      label: 'Calm & Mindful',
      subtitle: 'Serene prose and philosophical grounding',
      color: 'hover:border-teal-400 bg-teal-50/40',
      recommendedBookIds: ['b-13', 'b-12', 'b-16'] // Ikigai, Psychology of Money, Mockingbird
    },
    {
      id: 'motivated',
      emoji: '🔥',
      label: 'Motivated & Driven',
      subtitle: 'Habit mastery, discipline, and execution',
      color: 'hover:border-orange-400 bg-orange-50/40',
      recommendedBookIds: ['b-11', 'b-30', 'b-1'] // Atomic Habits, Think & Grow Rich, Clean Code
    },
    {
      id: 'curious',
      emoji: '🧠',
      label: 'Curious & Inquisitive',
      subtitle: 'System internals, science, and the cosmos',
      color: 'hover:border-blue-400 bg-blue-50/40',
      recommendedBookIds: ['b-21', 'b-22', 'b-4', 'b-29'] // Sapiens, Brief History, DBMS, DDIA
    },
    {
      id: 'emotional',
      emoji: '❤️',
      label: 'Emotional & Empathetic',
      subtitle: 'Deep human connection and classic literature',
      color: 'hover:border-rose-400 bg-rose-50/40',
      recommendedBookIds: ['b-16', 'b-14', 'b-17'] // Mockingbird, Alchemist, Gatsby
    },
    {
      id: 'relaxed',
      emoji: '😴',
      label: 'Relaxed & Unhurried',
      subtitle: 'Gentle pacing without heavy cognitive load',
      color: 'hover:border-indigo-400 bg-indigo-50/40',
      recommendedBookIds: ['b-14', 'b-28', 'b-12'] // Alchemist, Head First Java, Psych of Money
    },
    {
      id: 'ambitious',
      emoji: '🚀',
      label: 'Ambitious & Bold',
      subtitle: 'Startups, venture scale, and tech disruption',
      color: 'hover:border-purple-400 bg-purple-50/40',
      recommendedBookIds: ['b-19', 'b-20', 'b-18', 'b-7'] // Zero to One, Lean Startup, Rich Dad, AI
    },
    {
      id: 'melancholic',
      emoji: '🌧️',
      label: 'Melancholic & Reflective',
      subtitle: 'Profound dystopias and moral inquiry',
      color: 'hover:border-slate-400 bg-slate-100/50',
      recommendedBookIds: ['b-15', 'b-17', 'b-23'] // 1984, Great Gatsby, Selfish Gene
    }
  ];

  const currentMood = moods.find(m => m.id === selectedMoodId) || moods[3];
  const matchedBooks = books.filter(b => currentMood.recommendedBookIds.includes(b.id));

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
