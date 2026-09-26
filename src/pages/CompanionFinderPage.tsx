import React, { useEffect, useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { supabase } from '../lib/supabase';
import { Users, Search, ShieldCheck } from 'lucide-react';

interface CompanionRow {
  id: string;
  full_name: string;
  department: string | null;
  year: string | null;
}

export const CompanionFinderPage: React.FC = () => {
  const { user, addToast } = useLibrary();
  const [optIn, setOptIn] = useState(false);
  const [companions, setCompanions] = useState<CompanionRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user.id) return;
    setLoading(true);
    const { data: profile } = await supabase.from('profiles').select('companion_opt_in').eq('id', user.id).maybeSingle();
    setOptIn(Boolean(profile?.companion_opt_in));

    if (profile?.companion_opt_in) {
      const { data, error } = await supabase.rpc('find_reading_companions');
      if (!error) setCompanions((data || []) as CompanionRow[]);
    } else {
      setCompanions([]);
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, [user.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companions;
    return companions.filter(c =>
      (c.full_name || '').toLowerCase().includes(q) ||
      (c.department || '').toLowerCase().includes(q) ||
      (c.year || '').toLowerCase().includes(q)
    );
  }, [companions, query]);

  const toggleOptIn = async () => {
    const next = !optIn;
    const { error } = await supabase.from('profiles').update({ companion_opt_in: next }).eq('id', user.id);
    if (error) {
      addToast('Companion Setting Failed', error.message, 'error');
      return;
    }
    setOptIn(next);
    addToast(next ? 'Companion Discovery Enabled' : 'Companion Discovery Disabled',
      next ? 'Your approved student profile can now appear in peer discovery.' : 'Your profile will no longer appear in peer discovery.',
      'success');
    await load();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Peer Collaboration</span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 mt-0.5 flex items-center gap-2">
          Find Reading Companions <Users className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">Only students who explicitly opt in are discoverable.</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Peer discovery</h2>
            <p className="text-xs text-slate-500 mt-1">Your name, department and year are shared only after you enable this.</p>
          </div>
          <button onClick={() => void toggleOptIn()} className={`px-4 py-2 rounded-lg text-xs font-semibold ${optIn ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 border border-slate-300'}`}>
            {optIn ? 'Opted In' : 'Opt In'}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> No fabricated names or compatibility scores are shown.
        </div>
      </div>

      {optIn && (
        <>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search opted-in companions..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-slate-300 bg-white" />
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-xs text-slate-500">Loading opted-in students...</div>
          ) : filtered.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(c => (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold">{c.full_name?.charAt(0)?.toUpperCase() || '?'}</div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{c.full_name}</h3>
                      <p className="text-xs text-slate-500">{c.department || 'Department not recorded'} · {c.year || 'Year not recorded'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-900">No opted-in companions found</h2>
              <p className="text-xs text-slate-500 mt-2">Only real, approved student profiles that have opted in will appear here.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};