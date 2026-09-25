import React, { useState } from 'react';
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
  const { user, updateUserProfile, addToast } = useLibrary();
  const [loggedToday, setLoggedToday] = useState<boolean>(true);
  const [pagesToLog, setPagesToLog] = useState<number>(25);

  const streakDays = [
    { day: 'Mon', date: 'Sep 18', completed: true },
    { day: 'Tue', date: 'Sep 19', completed: true },
    { day: 'Wed', date: 'Sep 20', completed: true },
    { day: 'Thu', date: 'Sep 21', completed: true },
    { day: 'Fri', date: 'Sep 22', completed: true },
    { day: 'Sat', date: 'Sep 23', completed: true },
    { day: 'Sun', date: 'Sep 24', completed: loggedToday, isToday: true },
  ];

  const badges = [
    {
      id: 'b-1',
      title: '3-Day Reader',
      tier: 'Bronze',
      unlocked: true,
      icon: '🥉',
      desc: 'Sustained reading habit for 3 continuous days.'
    },
    {
      id: 'b-2',
      title: '7-Day Scholar',
      tier: 'Silver',
      unlocked: true,
      icon: '🥈',
      desc: 'Achieved a whole week of daily engineering study.'
    },
    {
      id: 'b-3',
      title: '14-Day Bookworm',
      tier: 'Gold',
      unlocked: false,
      icon: '🥇',
      desc: 'Read for 14 continuous days without dropping session.'
    },
    {
      id: 'b-4',
      title: '30-Day Master',
      tier: 'Platinum',
      unlocked: false,
      icon: '🏆',
      desc: 'One full month of unbroken academic reading streak.'
    }
  ];

  const handleLogPages = () => {
    if (!loggedToday) {
      setLoggedToday(true);
      updateUserProfile({ readingStreak: user.readingStreak + 1 });
      addToast('Streak Extended! 🔥', `Logged ${pagesToLog} pages today! Your streak is now ${user.readingStreak + 1} days!`, 'success');
    } else {
      addToast('Already Logged Today', `Great work! You already added ${pagesToLog} extra pages to your daily journal.`, 'info');
    }
  };

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
          Build lasting academic discipline by reading at least 15-20 pages every single day.
        </p>
      </div>

      {/* Hero Streak Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider">
            Current Active Cadence
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-tabular tracking-tight">
            {user.readingStreak} Day Streak 🔥
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 max-w-md leading-relaxed">
            You are in the top 5% of active readers at SIT Central Library! 7 more days to unlock the 14-Day Bookworm Medal.
          </p>
        </div>

        {/* Motivation Card Inside Banner */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 text-center w-full md:w-72 shrink-0 space-y-3">
          <Sparkles className="w-6 h-6 text-amber-200 mx-auto" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-100">Today&apos;s Goal</h3>
          <p className="text-xs text-white">Read 20 pages today to maintain your streak!</p>
          
          <button
            onClick={handleLogPages}
            className="w-full py-2 px-3 rounded-lg bg-white text-orange-700 font-bold text-xs hover:bg-amber-50 transition-colors shadow-xs"
          >
            {loggedToday ? '✓ Logged Today (+25 pgs)' : 'Log Today&apos;s Reading'}
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
            100% attendance this week
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
