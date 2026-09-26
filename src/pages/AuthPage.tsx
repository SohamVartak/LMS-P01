import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, PenLine, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLibrary } from '../context/LibraryContext';

type Role = 'STUDENT' | 'AUTHOR' | 'ADMIN';

const roles: Record<Role, { title: string; description: string; icon: React.ReactNode }> = {
  STUDENT: { title: 'Student / User', description: 'Browse, borrow books, reserve seats and manage your reading.', icon: <GraduationCap className="w-7 h-7" /> },
  AUTHOR: { title: 'Author', description: 'Access the library author portal.', icon: <PenLine className="w-7 h-7" /> },
  ADMIN: { title: 'Administrator', description: 'Secure administrative library access.', icon: <ShieldCheck className="w-7 h-7" /> },
};

export const AuthPage: React.FC = () => {
  const { login, addToast, authError } = useLibrary();
  const [role, setRole] = useState<Role | null>(null);
  const [register, setRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('3rd Year (Semester VI)');
  const [confirm, setConfirm] = useState('');

  const choose = (r: Role) => { setRole(r); setRegister(false); setError(''); };
  const back = () => { setRole(null); setRegister(false); setError(''); };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError('');
    setLoading(true);
    const ok = await login(email.trim(), password, role);
    setLoading(false);
    if (!ok) setError(authError || 'Login failed. Please check your email, password, and portal.');
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || role === 'ADMIN') return;
    if (!name.trim() || !email.trim()) return setError('Name and email are required.');
    if (role === 'STUDENT' && !studentId.trim()) return setError('Student ID is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm) return setError('Passwords do not match.');

    setError('');
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), role, student_id: studentId.trim(), department, year } },
    });
    setLoading(false);

    if (authError) return setError(authError.message);
    if (!data.session) {
      setRegister(false);
      addToast('Account Created', 'Check your email to confirm your account, then sign in.', 'success');
    } else {
      addToast('Account Created', 'Your account is ready.', 'success');
    }
  };

  const resetPassword = async () => {
    if (!email.trim()) return setError('Enter your email address first.');
    setLoading(true);
    const { error: e } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (e) return setError(e.message);
    addToast('Reset Link Sent', 'Password reset instructions were sent to your email.', 'info');
  };

  if (!role) return (
    <div className="min-h-screen bg-[var(--app-canvas)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#4C1D95] to-[#1E293B] p-8 sm:p-10 text-white">
          <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-[#F97316] flex items-center justify-center"><BookOpen /></div><div><h1 className="text-xl font-bold">SIT Central Library</h1><p className="text-xs text-purple-200">Library Management System</p></div></div>
          <h2 className="mt-10 text-3xl font-bold">Choose your portal</h2>
          <p className="mt-2 text-sm text-purple-100">Select your account type to continue.</p>
        </div>
        <div className="p-6 sm:p-8 grid gap-4 md:grid-cols-3">
          {(Object.keys(roles) as Role[]).map(r => <button key={r} onClick={() => choose(r)} className="text-left p-5 rounded-xl border border-slate-200 hover:border-[#4C1D95] hover:shadow-md transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#4C1D95] flex items-center justify-center mb-4">{roles[r].icon}</div>
            <h3 className="font-bold text-slate-900">{roles[r].title}</h3><p className="text-xs text-slate-500 mt-2">{roles[r].description}</p>
            <div className="mt-5 text-xs font-semibold text-[#4C1D95] flex items-center gap-1">Continue <ArrowRight className="w-3.5 h-3.5" /></div>
          </button>)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--app-canvas)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden md:flex">
        <div className="md:w-5/12 bg-gradient-to-br from-[#4C1D95] via-[#3B0764] to-[#1E293B] p-8 text-white">
          <button onClick={back} className="flex items-center gap-1 text-xs text-purple-200 hover:text-white"><ArrowLeft className="w-3.5 h-3.5" /> Change portal</button>
          <div className="mt-10 w-12 h-12 rounded-xl bg-[#F97316] flex items-center justify-center">{roles[role].icon}</div>
          <h2 className="mt-5 text-2xl font-bold">{roles[role].title}</h2><p className="text-sm text-purple-100 mt-2">{roles[role].description}</p>
        </div>
        <div className="md:w-7/12 p-7 sm:p-10">
          <h2 className="text-xl font-bold text-slate-900">{register ? 'Create Account' : roles[role].title + ' Sign In'}</h2>
          <p className="text-xs text-slate-500 mt-1">{register ? 'Create your library account.' : 'Enter your email and password.'}</p>
          {error && <div className="my-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{error}</div>}

          {!register ? <form onSubmit={signIn} className="space-y-4 mt-6">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" required /></div>
            <div><div className="flex justify-between mb-1"><label className="text-xs font-semibold text-slate-700">Password</label><button type="button" onClick={resetPassword} className="text-[11px] text-[#4C1D95] font-semibold">Forgot Password?</button></div><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm" required /></div>
            <button disabled={loading} className="w-full py-2.5 rounded-xl bg-[#4C1D95] disabled:opacity-60 text-white font-semibold text-sm">{loading ? 'Signing in...' : 'Sign In'}</button>
            {role !== 'ADMIN' ? <p className="pt-4 border-t text-center text-xs text-slate-600">Don't have an account? <button type="button" onClick={() => setRegister(true)} className="text-[#4C1D95] font-semibold">Create Account</button></p> : <p className="pt-4 border-t text-center text-[11px] text-slate-400">Administrator accounts are created by the library administrator.</p>}
          </form> : <form onSubmit={signUp} className="space-y-3 mt-6">
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" required /></div>
            {role === 'STUDENT' && <div className="grid sm:grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-700 mb-1">Student ID</label><input value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" required /></div><div><label className="block text-xs font-semibold text-slate-700 mb-1">Department</label><select value={department} onChange={e => setDepartment(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"><option>Computer Science & Engineering</option><option>Artificial Intelligence & Data Science</option><option>Information Technology</option><option>Electronics & Telecommunications</option></select></div></div>}
            <div><label className="block text-xs font-semibold text-slate-700 mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" required /></div>
            {role === 'STUDENT' && <div><label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label><select value={year} onChange={e => setYear(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm"><option>1st Year (Semester I & II)</option><option>2nd Year (Semester III & IV)</option><option>3rd Year (Semester V & VI)</option><option>4th Year (Semester VII & VIII)</option></select></div>}
            <div className="grid sm:grid-cols-2 gap-3"><div><label className="block text-xs font-semibold text-slate-700 mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" required /></div><div><label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm" required /></div></div>
            <button disabled={loading} className="w-full py-2.5 rounded-xl bg-[#4C1D95] disabled:opacity-60 text-white font-semibold text-sm">{loading ? 'Creating...' : 'Create Account'}</button>
            <p className="pt-3 border-t text-center text-xs text-slate-600">Already have an account? <button type="button" onClick={() => setRegister(false)} className="text-[#4C1D95] font-semibold">Sign In</button></p>
          </form>}
        </div>
      </div>
    </div>
  );
};
