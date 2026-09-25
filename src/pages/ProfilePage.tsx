import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BackgroundTheme } from '../types';
import { 
  UserCheck, 
  CreditCard, 
  BookOpen, 
  Save, 
  CheckCircle2,
  Palette,
  Check
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile, theme, setTheme } = useLibrary();

  // Form states
  const [name, setName] = useState(user.name);
  const [department, setDepartment] = useState(user.department);
  const [year, setYear] = useState(user.year);
  const [semesterGoal, setSemesterGoal] = useState(15);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      department,
      year
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const themes: {
    id: BackgroundTheme;
    name: string;
    description: string;
    canvasHex: string;
    surfaceHex: string;
  }[] = [
    {
      id: 'amethyst',
      name: 'Cosmic Amethyst (Default)',
      description: 'Deep ultraviolet nebula abyss with glowing amber and rich violet cards',
      canvasHex: '#0E0926',
      surfaceHex: '#231A56'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon',
      description: 'Dark obsidian plum with hot electric pink and lime neon accents',
      canvasHex: '#13061C',
      surfaceHex: '#33124C'
    },
    {
      id: 'sunset',
      name: 'Molten Sunset',
      description: 'Deep burnt umber velvet with fiery coral glow and sun gold',
      canvasHex: '#1A0906',
      surfaceHex: '#3E1810'
    },
    {
      id: 'emerald',
      name: 'Dark Jade Academia',
      description: 'Deep forest malachite night with luminous polished emerald cards',
      canvasHex: '#051A14',
      surfaceHex: '#133D30'
    },
    {
      id: 'sapphire',
      name: 'Cyber Sapphire',
      description: 'Deep ocean cobalt depth with vibrant electric cyan & lapis cards',
      canvasHex: '#081026',
      surfaceHex: '#152B66'
    },
    {
      id: 'ruby',
      name: 'Imperial Velvet Ruby',
      description: 'Garnet wine velvet abyss with radiant dark ruby and molten gold',
      canvasHex: '#1C0916',
      surfaceHex: '#3E1632'
    },
    {
      id: 'aurora',
      name: 'Aurora Borealis',
      description: 'Deep polar night with mystic glowing teal and electric mint',
      canvasHex: '#041619',
      surfaceHex: '#10363D'
    },
    {
      id: 'gold',
      name: 'Imperial Gold & Onyx',
      description: 'Deep obsidian espresso with radiant bronze and royal gold',
      canvasHex: '#141006',
      surfaceHex: '#332A15'
    },
    {
      id: 'midnight',
      name: 'Obsidian Midnight',
      description: 'Deep architectural night mode for focus study sessions',
      canvasHex: '#0B0E17',
      surfaceHex: '#1D273D'
    },
    {
      id: 'parchment',
      name: 'Antique Amber',
      description: 'Aged mahogany and rich polished leather library study',
      canvasHex: '#211912',
      surfaceHex: '#3E2F22'
    },
    {
      id: 'slate',
      name: 'Steel Nebula',
      description: 'Deep architectural indigo with vibrant cobalt and coral',
      canvasHex: '#0D131F',
      surfaceHex: '#1E2D4A'
    },
    {
      id: 'charcoal',
      name: 'Cosmic Charcoal',
      description: 'Deep pure charcoal with electric purple and sunset glow',
      canvasHex: '#121217',
      surfaceHex: '#282834'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-[var(--app-border)]">
        <span className="text-xs font-semibold text-[var(--app-accent)] uppercase tracking-wider">
          Institutional Identity & Preferences
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-[var(--app-text)] tracking-tight mt-0.5 flex items-center gap-2">
          <span>Student Academic Profile</span>
          <UserCheck className="w-6 h-6 text-[var(--app-accent)]" />
        </h1>
        <p className="text-xs text-[var(--app-text-muted)] mt-1">
          Review your institutional library credentials, digital circulation card, reading theme, and semester goals.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Digital Library Card Pass */}
        <div className="space-y-6">
          
          {/* Card Representation */}
          <div 
            className="text-[var(--app-text)] p-6 rounded-2xl shadow-xl border border-[var(--app-border)] relative overflow-hidden flex flex-col justify-between h-72"
            style={{
              background: 'linear-gradient(135deg, var(--app-surface-elevated) 0%, var(--app-surface-subtle) 50%, var(--app-primary-dark) 100%)'
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--app-accent)] block">
                  Sarthak&apos;s Institute of Technology
                </span>
                <span className="font-bold text-sm tracking-tight text-[var(--app-text)] font-serif-academic">Central Digital Library</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[var(--app-accent)] text-[#0E0926] flex items-center justify-center font-extrabold text-xs shadow-xs">
                SIT
              </div>
            </div>

            {/* Center: Student Name & ID */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-lg font-bold font-serif-academic text-[var(--app-text)]">{user.name}</h3>
              <p className="text-xs text-[var(--app-accent)] font-tabular font-medium">{user.studentId}</p>
              <p className="text-[11px] text-[var(--app-text-muted)]">{user.department}</p>
            </div>

            {/* Bottom Barcode simulation & Status */}
            <div className="relative z-10 pt-3 border-t border-[var(--app-border)] flex items-end justify-between text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[var(--app-text-muted)] block">Barcode / RFID Tag</span>
                <span className="font-mono text-[11px] text-[var(--app-text)] tracking-wider">|| | | |||| | ||| |||</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/40">
                ACTIVE &bull; CLEAR
              </span>
            </div>
          </div>

          {/* Circulation Account Standing */}
          <div className="bg-[var(--app-surface-elevated)] p-5 rounded-xl border border-[var(--app-border)] shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-[var(--app-text)] uppercase tracking-wider">
              Circulation Privileges
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Max Active Loan Quota</span>
                <span className="font-bold text-[var(--app-text)] font-tabular">6 Books</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Current Active Loans</span>
                <span className="font-bold text-[var(--app-accent)] font-tabular">{user.booksBorrowed} Books</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--app-border)]">
                <span className="text-[var(--app-text-muted)]">Outstanding Overdue Fines</span>
                <span className="font-bold text-emerald-400 font-tabular">₹0.00 (Clear)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--app-text-muted)]">Renewal Cycle</span>
                <span className="font-medium text-[var(--app-text)]">14 Days / 1 Auto-Renewal</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Editable Student Details & Reading Goals */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Background Palette Settings */}
          <div className="bg-[var(--app-surface-elevated)] p-6 sm:p-8 rounded-2xl border border-[var(--app-border)] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--app-border)]">
              <Palette className="w-5 h-5 text-[var(--app-accent)]" />
              <div>
                <h3 className="text-sm font-bold text-[var(--app-text)]">
                  Background Color Combination
                </h3>
                <p className="text-xs text-[var(--app-text-muted)]">
                  Select your preferred background palette to eliminate sterile white glare.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {themes.map(t => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between h-28 ${
                      isSelected
                        ? 'border-[var(--app-accent)] bg-[var(--app-surface-subtle)] ring-2 ring-[var(--app-accent)]/30 shadow-xs'
                        : 'border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface)] hover:bg-[var(--app-surface-subtle)]/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md border border-[var(--app-border)] overflow-hidden flex">
                          <div className="w-1/2 h-full" style={{ backgroundColor: t.canvasHex }} />
                          <div className="w-1/2 h-full" style={{ backgroundColor: t.surfaceHex }} />
                        </div>
                        <span className="text-xs font-bold text-[var(--app-text)]">{t.name}</span>
                      </div>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[var(--app-accent)] text-[#0E0926] flex items-center justify-center shrink-0 font-bold">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--app-text-muted)] line-clamp-2 mt-1 leading-snug">
                      {t.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSave} className="bg-[var(--app-surface-elevated)] p-6 sm:p-8 rounded-2xl border border-[var(--app-border)] shadow-xs space-y-6">
            <h3 className="text-base font-bold text-[var(--app-text)] font-serif-academic pb-3 border-b border-[var(--app-border)]">
              Academic & Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] focus:outline-hidden focus:border-[var(--app-accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Student ID Number
                </label>
                <input
                  type="text"
                  disabled
                  value={user.studentId}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-subtle)] text-[var(--app-text-muted)] cursor-not-allowed font-tabular"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  College Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-subtle)] text-[var(--app-text-muted)] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                  Department / Major
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] focus:outline-hidden focus:border-[var(--app-accent)]"
                >
                  <option>Computer Science & Engineering</option>
                  <option>Information Technology</option>
                  <option>Artificial Intelligence & Data Science</option>
                  <option>Electronics & Communication</option>
                  <option>Mechanical Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--app-text)] mb-1">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text)] focus:outline-hidden focus:border-[var(--app-accent)]"
              >
                <option>1st Year (Semester I & II)</option>
                <option>2nd Year (Semester III & IV)</option>
                <option>3rd Year (Semester V & VI)</option>
                <option>4th Year (Semester VII & VIII)</option>
              </select>
            </div>

            {/* Reading Goal Target */}
            <div className="p-4 rounded-xl bg-[var(--app-surface-subtle)] border border-[var(--app-border)] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--app-text)]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[var(--app-accent)]" />
                  <span>Annual Reading Target:</span>
                </span>
                <span className="text-[var(--app-accent)] font-bold font-tabular">{user.booksCompleted} / {semesterGoal} Books</span>
              </div>
              <div className="w-full bg-[var(--app-surface)] rounded-full h-2 overflow-hidden border border-[var(--app-border)]">
                <div
                  className="bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-accent)] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((user.booksCompleted / semesterGoal) * 100))}%` }}
                />
              </div>
              <p className="text-[11px] text-[var(--app-text-muted)]">
                You have reached {Math.round((user.booksCompleted / semesterGoal) * 100)}% of your annual syllabus and leisure reading goal.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {isSaved ? (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Profile changes saved ✓</span>
                </span>
              ) : (
                <span className="text-[11px] text-[var(--app-text-muted)]">Updates sync across SIT library stations</span>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[#0E0926] font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
