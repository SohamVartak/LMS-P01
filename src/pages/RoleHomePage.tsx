import React from 'react';
import { BookOpen, ShieldCheck, PenLine, LogOut } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

type Role = 'AUTHOR' | 'ADMIN';

const content: Record<Role, { title: string; subtitle: string; icon: React.ReactNode; items: string[] }> = {
  AUTHOR: {
    title: 'Author Portal',
    subtitle: 'Manage your library author activities from this dedicated portal.',
    icon: <PenLine className="w-7 h-7" />,
    items: ['Author profile', 'Your published books', 'Book submission and updates', 'Library notifications'],
  },
  ADMIN: {
    title: 'Administrator Portal',
    subtitle: 'Manage library operations from the secured administrator domain.',
    icon: <ShieldCheck className="w-7 h-7" />,
    items: ['Student and author management', 'Book catalogue management', 'Issue and return management', 'Library reports and settings'],
  },
};

export const RoleHomePage: React.FC = () => {
  const { user, userRole, logout } = useLibrary();
  const role = userRole === 'AUTHOR' || userRole === 'ADMIN' ? userRole : 'ADMIN';
  const data = content[role];

  return (
    <div className="min-h-screen bg-[var(--app-canvas)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#4C1D95] to-[#1E293B] p-8 sm:p-10 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#F97316] flex items-center justify-center"><BookOpen /></div>
              <div><h1 className="text-xl font-bold">SIT Central Library</h1><p className="text-xs text-purple-200">Library Management System</p></div>
            </div>
            <button onClick={() => void logout()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">{data.icon}</div>
            <div><h2 className="text-3xl font-bold">{data.title}</h2><p className="mt-1 text-sm text-purple-100">Welcome, {user.name}.</p></div>
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <p className="text-sm text-slate-600 mb-6">{data.subtitle}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {data.items.map(item => (
              <div key={item} className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-900 text-sm">{item}</h3>
                <p className="text-xs text-slate-500 mt-1">Available within the {role.toLowerCase()} domain.</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
            Role access is active. Student-only features are not available from this portal.
          </div>
        </div>
      </div>
    </div>
  );
};
