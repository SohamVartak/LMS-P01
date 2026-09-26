import React, { useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { 
  Flame, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Trophy, 
  Sparkles, 
  Target, 
  TrendingUp,
  Clock
} from 'lucide-react';

export const ReadingStreakPage: React.FC = () => {
  const { user, borrowedBooks, addToast } = useLibrary();

  const progressDates = useMemo(() => {
    const dates = new Set<string>();
    borrowedBooks.forEach(book => {
      if (book.progressPercent > 0) {
        const date = book.borrowDate ? new Date(book.borrowDate).toISOString().split('T')[0] : '';
        if (date) dates.add(date);
      }
    });
    return dates;
  }, [borrowedBooks]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const streakDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toISOString().split('T')[0];
    return {
      day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      completed: progressDates.has(key),
      isToday: index === 6
    };
  });

  const currentStreak = user.readingStreak || 0;
  const loggedToday = progressDates.has(today.toISOString().split('T')[0]);

  const badges = [
    { id: 'b-1', title: '3-Day Reader', tier: 'Bronze', unlocked: currentStreak >= 3, icon: '🥉', desc: 'Sustained reading activity for 3 continuous days.' },
    { id: 'b-2', title: '7-Day Scholar', tier: 'Silver', unlocked: currentStreak >= 7, icon: '🥈', desc: 'Recorded activity for 7 continuous days.' },
    { id: 'b-3', title: '14-Day Bookworm', tier: 'Gold', unlocked: currentStreak >= 14, icon: '🥇', desc: 'Recorded activity for 14 continuous days.' },
    { id: 'b-4', title: '30-Day Master', tier: 'Platinum', unlocked: currentStreak >= 30, icon: '🏆', desc: 'Recorded activity for 30 continuous days.' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Habit Gamification
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Reading Streak</span>
          <span className="text-2xl animate-flame">🔥</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your streak is based on reading activity recorded by the library system.
        </p>
      </div>

      {/* Hero Streak Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
            Current Active Cadence
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-tabular tracking-tight">
            {currentStreak} Day Streak 🔥
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-md leading-relaxed">
            Your streak is calculated from your recorded reading activity. Keep updating your book progress to maintain it.
          </p>
        </div>

        {/* Motivation Card Inside Banner */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 text-center w-full md:w-72 shrink-0 space-y-3">
          <Sparkles className="w-6 h-6 text-amber-200 mx-auto" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100">Today&apos;s Goal</h3>
          <p className="text-xs text-white">Update your reading progress today to record reading activity.</p>
          
          <button
            onClick={handleLogPages}
            className="w-full py-2 px-3 rounded-lg bg-white text-orange-700 font-bold text-xs hover:bg-amber-50 transition-colors shadow-xs"
          >
            {loggedToday ? '✓ Recorded Today' : 'Update Reading Progress'}
          </button>
        </div>
      </div>

      {/* Weekly Progress Tracker Calendar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Weekly Reading Cadence
          </h3>
          <span className="text-xs text-slate-500 font-medium font-tabular">
            {streakDays.filter(day => day.completed).length}/7 days recorded this week
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-2">
          {streakDays.map(day => (
            <div
              key={day.day}
              className={`p-3 sm:p-4 rounded-xl border text-center flex flex-col items-center justify-between h-24 sm:h-28 transition-all ${
                day.completed
                  ? 'border-orange-300 bg-orange-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50'
              } ${day.isToday ? 'ring-2 ring-orange-500' : ''}`}
            >
              <div className="text-[11px] font-semibold text-slate-600">
                <span>{day.day}</span>
                <span className="block text-[9px] text-slate-400 font-normal">{day.date}</span>
              </div>

              <div className="my-auto">
                {day.completed ? (
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    🔥
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs">
                    ○
                  </div>
                )}
              </div>

              <span className="text-[10px] font-semibold text-orange-700 font-tabular">
                {day.completed ? 'Complete' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges and Milestones Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Achievement Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                b.unlocked
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{b.icon}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    b.unlocked ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {b.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{b.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Tier: {b.tier}</span>
                {b.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
