import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { Book } from '../types';
import { Sparkles, Check, ArrowRight, BookOpen, Brain, Target, Star, Loader2 } from 'lucide-react';

interface RecommendedMatch {
  book: Book;
  matchScore: number;
  reason: string;
}

export const AIRecommendationPage: React.FC = () => {
  const { books, openBookModal, borrowBook } = useLibrary();

  // Preferences state
  const [selectedGenre, setSelectedGenre] = useState<string>('Computer Engineering');
  const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [selectedGoal, setSelectedGoal] = useState<string>('Improve Skills');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<RecommendedMatch[] | null>(null);

  const genres = [
    'Computer Science',
    'Computer Engineering',
    'Artificial Intelligence',
    'Software Engineering',
    'Electrical Engineering',
    'Electronics & Communication',
    'Mechanical Engineering'
  ];

  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  const lengths: ('Short' | 'Medium' | 'Long')[] = [
    'Short',
    'Medium',
    'Long'
  ];

  const goals = [
    'Learn',
    'Build Skills',
    'Prepare for Exams',
    'Explore a Topic'
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setRecommendations(null);

    window.setTimeout(() => {
      const normalized = selectedGenre.toLowerCase();
      const matches = books
        .filter(book => book.category.toLowerCase() === normalized)
        .sort((x, y) => (y.studentRating ?? y.onlineRating ?? 0) - (x.studentRating ?? x.onlineRating ?? 0))
        .slice(0, 3)
        .map(book => ({
          book,
          matchScore: 0,
          reason: `Catalogue match for ${selectedGenre}, with your selected ${selectedLevel.toLowerCase()} level and ${selectedLength.toLowerCase()} reading preference. Goal: ${selectedGoal}.`
        }));

      setRecommendations(matches.length ? matches : []);
      setIsGenerating(false);
    }, 300);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          AI Advisory Engine
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Your Personal Book Advisor</span>
          <span className="text-xl">🤖</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Choose your engineering area and preferences. Recommendations are generated from the current approved catalogue.
        </p>
      </div>

      {/* Preferences Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* 1. Favourite Genre */}
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            1. Favourite Genre
          </label>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGenre === genre
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Reading Level & Preferred Length */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              2. Reading Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`py-2 text-center rounded-xl text-xs font-semibold transition-all ${
                    selectedLevel === level
                      ? 'bg-blue-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              3. Preferred Length
            </label>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map(length => (
                <button
                  key={length}
                  onClick={() => setSelectedLength(length)}
                  className={`py-2 text-center rounded-xl text-xs font-semibold transition-all ${
                    selectedLength === length
                      ? 'bg-blue-950 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Current Goal */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
            4. Current Study & Personal Goal
          </label>
          <div className="flex flex-wrap gap-2">
            {goals.map(goal => (
              <button
                key={goal}
                onClick={() => setSelectedGoal(goal)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                  selectedGoal === goal
                    ? 'bg-blue-950 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Targeting: <strong className="text-slate-800">{selectedGenre}</strong> · {selectedLevel} · {selectedGoal}
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                <span>Synthesizing Academic Syllabus...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Recommendations</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Recommendations Results Showcase */}
      {recommendations && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 font-serif-academic">
              Tailored Advisor Recommendations
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Matches from the current engineering catalogue
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-sm text-slate-600">No approved books are currently available in this category.</div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.book.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Top Match Score Pill */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold font-tabular bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Catalogue Match</span>
                    </span>
                    <span className="text-[11px] text-slate-400">{rec.book.category}</span>
                  </div>

                  {/* Book Spine Cover & Title */}
                  <div className="flex gap-4 items-start">
                    <div 
                      onClick={() => openBookModal(rec.book)}
                      className="cursor-pointer shrink-0"
                    >
                      <BookSpineCover book={rec.book} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <h3 
                        onClick={() => openBookModal(rec.book)}
                        className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-700 cursor-pointer"
                      >
                        {rec.book.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">by {rec.book.author}</p>
                      <div className="flex items-center gap-1 text-xs text-amber-600 mt-2 font-tabular">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-semibold">{rec.book.onlineRating ?? rec.book.studentRating ?? 'Not rated'}</span>
                        <span className="text-slate-400 text-[10px]">({rec.book.onlineRatingCount + rec.book.studentRatingCount} ratings)</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Reason */}
                  <div className="mt-4 p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs text-slate-700 leading-relaxed">
                    <strong className="text-blue-950 font-semibold block mb-0.5">Why recommended:</strong>
                    &quot;{rec.reason}&quot;
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => openBookModal(rec.book)}
                    className="flex-1 py-1.5 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => borrowBook(rec.book.id)}
                    className="py-1.5 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Issue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

    </div>
  );
};
