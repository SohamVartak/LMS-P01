import React, { useEffect, useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Flame } from 'lucide-react';

export const ReadingStreakPage: React.FC = () => {
  const { user } = useLibrary();
  const [activityDates, setActivityDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      if (!user.id) { setLoading(false); return; }
      const { data } = await supabase.from('reading_progress').select('updated_at').eq('user_id', user.id).not('updated_at', 'is', null);
      const dates = new Set<string>();
      (data || []).forEach((row: any) => { const d = new Date(row.updated_at); if (!Number.isNaN(d.getTime())) dates.add(d.toLocaleDateString('en-CA')); });
      setActivityDates(dates);
      setLoading(false);
    };
    void loadActivity();
  }, [user.id]);

  const todayKey = new Date().toLocaleDateString('en-CA');
  const currentStreak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    if (!activityDates.has(todayKey)) cursor.setDate(cursor.getDate() - 1);
    while (activityDates.has(cursor.toLocaleDateString('en-CA'))) { count++; cursor.setDate(cursor.getDate() - 1); }
    return count;
  }, [activityDates, todayKey]);

  const streakDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today); date.setDate(today.getDate() - (6 - index));
      const key = date.toLocaleDateString('en-CA');
      return { day: date.toLocaleDateString('en-IN', { weekday: 'short' }), date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), completed: activityDates.has(key), isToday: index === 6 };
    });
  }, [activityDates]);

  const badges = [['3-Day Reader',3,'🥉'],['7-Day Scholar',7,'🥈'],['14-Day Bookworm',14,'🥇'],['30-Day Master',30,'🏆']] as const;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-200"><span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Reading Activity</span><h1 className="text-2xl font-bold font-serif-academic text-slate-900 mt-0.5 flex items-center gap-2">Reading Streak <Flame className="w-6 h-6 text-orange-500" /></h1><p className="text-xs text-slate-500 mt-1">Calculated from timestamps recorded in your reading-progress records.</p></div>
      <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-xs text-center"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current streak</p><p className="text-5xl font-extrabold font-tabular text-slate-900 mt-2">{loading ? '—' : currentStreak}</p><p className="text-sm text-slate-500 mt-1">consecutive days with recorded progress activity</p></div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"><div className="flex items-center justify-between"><h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Last 7 days</h3><span className="text-xs text-slate-500">{streakDays.filter(d => d.completed).length}/7 recorded</span></div>
        <div className="grid grid-cols-7 gap-2 sm:gap-4">{streakDays.map(day => <div key={day.date} className={'p-3 rounded-xl border text-center h-24 flex flex-col items-center justify-between ' + (day.completed ? 'border-orange-300 bg-orange-50' : 'border-slate-200 bg-slate-50') + (day.isToday ? ' ring-2 ring-orange-400' : '')}><div className="text-[10px] font-semibold text-slate-600">{day.day}<span className="block text-[9px] text-slate-400 font-normal">{day.date}</span></div>{day.completed ? <CheckCircle2 className="w-7 h-7 text-orange-500" /> : <span className="text-xl text-slate-300">○</span>}<span className="text-[10px] font-semibold">{day.completed ? 'Recorded' : 'No record'}</span></div>)}</div>
      </div>
      <div className="space-y-4"><h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Milestones</h3><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{badges.map(([title, threshold, icon]) => { const unlocked = currentStreak >= threshold; return <div key={title} className={'p-5 rounded-xl border ' + (unlocked ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60')}><div className="text-3xl">{icon}</div><h4 className="text-sm font-bold text-slate-900 mt-3">{title}</h4><p className="text-xs text-slate-500 mt-1">{unlocked ? 'Unlocked from recorded activity.' : 'Requires ' + threshold + ' consecutive days.'}</p></div>; })}</div></div>
    </div>
  );
};