import React, { useState, useRef, useEffect } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { ThemeColorMode } from '../../types';
import { 
  Menu, 
  Bell, 
  Search, 
  BookOpen, 
  User as UserIcon, 
  LogOut,
  ChevronDown,
  Clock,
  X,
  Trash2,
  ArrowRight,
  Sparkles,
  Palette,
  Check
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { 
    user, 
    notifications, 
    currentPage, 
    setCurrentPage, 
    logout,
    searchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
    addSearchHistory,
    books,
    theme,
    setTheme
  } = useLibrary();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const themeContainerRef = useRef<HTMLDivElement>(null);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (themeContainerRef.current && !themeContainerRef.current.contains(e.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (profileContainerRef.current && !profileContainerRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const pageTitles: Record<string, string> = {
    'dashboard': 'Dashboard',
    'browse-books': 'Library Catalogue',
    'my-books': 'My Books',
    'ai-recommendations': 'AI Advisor',
    'reading-mood': 'Mood Recommender',
    'seat-reservation': 'Seat Reservation',
    'reading-streak': 'Reading Streak',
    'book-exchange': 'Student Book Exchange',
    'companion-finder': 'Study Companion',
    'smart-shelf': 'Smart Shelf QR',
    'personality-quiz': 'Reader Personality',
    'surprise-me': 'Surprise Me Discovery',
    'reading-time': 'Reading Time Calculator',
    'popularity-heat-map': 'Popularity Heat Map',
    'ai-summary': 'AI Book Synthesis',
    'book-health': 'Book Health & Condition',
    'profile': 'Academic Profile',
    'notifications': 'Circulation Notifications',
  };

  const executeSearch = (query: string) => {
    if (!query.trim()) return;
    const matches = books.filter(b => 
      b.title.toLowerCase().includes(query.toLowerCase()) || 
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.category.toLowerCase().includes(query.toLowerCase())
    );
    addSearchHistory(query, matches.length, 'All Disciplines');
    setSearchFocused(false);
    setCurrentPage('browse-books');
  };

  const themeOptions: {
    id: ThemeColorMode;
    label: string;
    description: string;
    bgPreview: string;
    primaryPreview: string;
    accentPreview: string;
  }[] = [
    {
      id: 'amethyst',
      label: 'Cosmic Amethyst',
      description: 'Deep Violet Abyss & Neon Amber',
      bgPreview: '#0E0926',
      primaryPreview: '#8B5CF6',
      accentPreview: '#F97316'
    },
    {
      id: 'cyberpunk',
      label: 'Cyberpunk Neon',
      description: 'Obsidian Plum, Hot Pink & Electric Lime',
      bgPreview: '#13061C',
      primaryPreview: '#EC4899',
      accentPreview: '#84CC16'
    },
    {
      id: 'sunset',
      label: 'Molten Sunset',
      description: 'Burnt Umber, Fiery Coral & Sun Gold',
      bgPreview: '#1A0906',
      primaryPreview: '#F97316',
      accentPreview: '#FBBF24'
    },
    {
      id: 'emerald',
      label: 'Dark Jade Academia',
      description: 'Forest Emerald & Solar Gold',
      bgPreview: '#051A14',
      primaryPreview: '#10B981',
      accentPreview: '#F59E0B'
    },
    {
      id: 'sapphire',
      label: 'Cyber Sapphire',
      description: 'Deep Cobalt Ocean & Cyan Glow',
      bgPreview: '#081026',
      primaryPreview: '#38BDF8',
      accentPreview: '#FB923C'
    },
    {
      id: 'ruby',
      label: 'Velvet Ruby',
      description: 'Deep Garnet Wine & Molten Gold',
      bgPreview: '#1C0916',
      primaryPreview: '#F43F5E',
      accentPreview: '#F59E0B'
    },
    {
      id: 'aurora',
      label: 'Aurora Borealis',
      description: 'Polar Night Teal & Radiant Mint',
      bgPreview: '#041619',
      primaryPreview: '#14B8A6',
      accentPreview: '#38BDF8'
    },
    {
      id: 'gold',
      label: 'Imperial Gold & Onyx',
      description: 'Obsidian Espresso & Royal Gold',
      bgPreview: '#141006',
      primaryPreview: '#EAB308',
      accentPreview: '#FB923C'
    },
    {
      id: 'midnight',
      label: 'Obsidian Midnight',
      description: 'Deep Slate Night & Electric Violet',
      bgPreview: '#0B0E17',
      primaryPreview: '#818CF8',
      accentPreview: '#F97316'
    },
    {
      id: 'parchment',
      label: 'Antique Amber',
      description: 'Aged Mahogany & Rich Bronze',
      bgPreview: '#211912',
      primaryPreview: '#D97706',
      accentPreview: '#F97316'
    },
    {
      id: 'slate',
      label: 'Steel Nebula',
      description: 'Deep Architectural Indigo & Cobalt',
      bgPreview: '#0D131F',
      primaryPreview: '#60A5FA',
      accentPreview: '#F97316'
    },
    {
      id: 'charcoal',
      label: 'Cosmic Charcoal',
      description: 'Deep Pure Charcoal & Electric Purple',
      bgPreview: '#121217',
      primaryPreview: '#A78BFA',
      accentPreview: '#F97316'
    }
  ];

  const currentThemeObj = themeOptions.find(t => t.id === theme) || themeOptions[0];

  return (
    <header className="sticky top-0 z-30 bg-[var(--app-surface)]/95 backdrop-blur-md border-b border-[var(--app-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Mobile toggle + Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-[var(--app-surface-subtle)] lg:hidden focus:outline-hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#4C1D95] text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-[#3B0764] transition-colors border border-violet-800">
              <BookOpen className="w-4 h-4 text-[#F97316]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--app-text)] tracking-tight text-sm md:text-base leading-none font-serif-academic">
                SIT Central Library
              </span>
              <span className="text-[10px] text-[var(--app-text-muted)] hidden sm:inline">
                Sarthak&apos;s Institute of Technology
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Contextual Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-[var(--app-text-muted)] font-medium">
          <span>Portal</span>
          <span className="opacity-40">/</span>
          <span className="text-[#4C1D95] font-bold">{pageTitles[currentPage] || 'Overview'}</span>
        </div>

        {/* Zone 3: Global Search + Palette Switcher + Notifications + Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Interactive Global Search with History Popover */}
          <div ref={searchContainerRef} className="relative">
            <div className="flex items-center relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search catalogue..."
                value={navSearchInput}
                onChange={(e) => setNavSearchInput(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeSearch(navSearchInput);
                  }
                }}
                className="w-32 sm:w-48 md:w-64 pl-8 pr-7 py-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-xs text-[var(--app-text)] focus:outline-hidden focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95] transition-all placeholder:text-[var(--app-text-muted)]"
              />
              {navSearchInput && (
                <button
                  onClick={() => setNavSearchInput('')}
                  className="absolute right-2.5 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Recent Search History Popover Dropdown */}
            {searchFocused && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 rounded-xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--app-border)]">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--app-text)]">
                    <Clock className="w-3.5 h-3.5 text-[#4C1D95]" />
                    <span>Recent Searches</span>
                  </div>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSearchHistory();
                      }}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear all</span>
                    </button>
                  )}
                </div>

                {searchHistory.length === 0 ? (
                  <div className="py-4 text-center text-xs text-[var(--app-text-muted)]">
                    <Sparkles className="w-5 h-5 text-[#F97316] mx-auto mb-1 opacity-70" />
                    <p>No recent search history</p>
                    <p className="text-[10px] opacity-75 mt-0.5">Try searching for &quot;Database Systems&quot; or &quot;Algorithms&quot;</p>
                  </div>
                ) : (
                  <div className="space-y-1 max-h-56 overflow-y-auto">
                    {searchHistory.slice(0, 6).map(item => (
                      <div
                        key={item.id}
                        className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-[var(--app-surface-subtle)] text-xs transition-colors cursor-pointer"
                        onClick={() => {
                          setNavSearchInput(item.query);
                          executeSearch(item.query);
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Search className="w-3 h-3 text-slate-400 shrink-0 group-hover:text-[#4C1D95]" />
                          <span className="text-[var(--app-text)] truncate font-medium">{item.query}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-[var(--app-text-muted)] opacity-70 font-tabular">{item.timestamp}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSearchHistoryItem(item.id);
                            }}
                            className="text-slate-400 hover:text-rose-600 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove search"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {navSearchInput.trim() && (
                  <div className="pt-2 mt-2 border-t border-[var(--app-border)]">
                    <button
                      onClick={() => executeSearch(navSearchInput)}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#4C1D95] hover:bg-[#3B0764] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Search for &quot;{navSearchInput}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#F97316]" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Background Theme Selector Dropdown */}
          <div ref={themeContainerRef} className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="px-2.5 py-1.5 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface-elevated)] hover:bg-[var(--app-surface-subtle)] hover:border-[var(--app-accent)] transition-all flex items-center gap-2 shadow-2xs group cursor-pointer"
              title={`Current Theme: ${currentThemeObj.label}. Click to switch theme`}
              aria-label="Theme Selector"
              aria-expanded={themeDropdownOpen}
            >
              {/* Palette Icon with Multi-color Swatch */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Palette className="w-3.5 h-3.5 text-[var(--app-accent)] transition-transform group-hover:rotate-12 duration-200" />
                <div className="flex items-center -space-x-1 shrink-0">
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-[var(--app-border)] shadow-2xs" 
                    style={{ backgroundColor: currentThemeObj.bgPreview }} 
                  />
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-[var(--app-surface)] shadow-2xs" 
                    style={{ backgroundColor: currentThemeObj.primaryPreview }} 
                  />
                  <span 
                    className="w-2.5 h-2.5 rounded-full border border-[var(--app-surface)] shadow-2xs" 
                    style={{ backgroundColor: currentThemeObj.accentPreview }} 
                  />
                </div>
              </div>

              {/* Theme Name */}
              <span className="hidden sm:inline-block text-xs font-semibold text-[var(--app-text)] max-w-[120px] truncate">
                {currentThemeObj.label.split(' ')[0]}
              </span>

              {/* Dropdown chevron */}
              <ChevronDown className={`w-3 h-3 text-[var(--app-text-muted)] transition-transform duration-200 ${themeDropdownOpen ? 'rotate-180 text-[var(--app-accent)]' : ''}`} />
            </button>

            {themeDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md"
              >
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[var(--app-border)] px-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[var(--app-accent)]" />
                      <h4 className="text-xs font-bold text-[var(--app-text)]">Color Theme Selector</h4>
                    </div>
                    <p className="text-[10px] text-[var(--app-text-muted)] mt-0.5">Zero-white vibrant palettes</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--app-surface-subtle)] text-[var(--app-accent)] border border-[var(--app-border)] font-semibold">
                    {themeOptions.length} Themes
                  </span>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                  {themeOptions.map((opt) => {
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setTheme(opt.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-[var(--app-accent)] bg-[var(--app-surface-subtle)] shadow-xs ring-1 ring-[var(--app-accent)]/30' 
                            : 'border-transparent hover:border-[var(--app-border)] hover:bg-[var(--app-surface-subtle)]/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Color Swatch Triad */}
                          <div className="flex items-center -space-x-1.5 shrink-0">
                            <span 
                              className="w-5 h-5 rounded-full border border-[var(--app-border)] shadow-xs" 
                              style={{ backgroundColor: opt.bgPreview }} 
                              title="Canvas"
                            />
                            <span 
                              className="w-4 h-4 rounded-full border border-[var(--app-surface)] shadow-xs" 
                              style={{ backgroundColor: opt.primaryPreview }} 
                              title="Primary"
                            />
                            <span 
                              className="w-3.5 h-3.5 rounded-full border border-[var(--app-surface)] shadow-xs" 
                              style={{ backgroundColor: opt.accentPreview }} 
                              title="Accent"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[var(--app-text)] leading-tight flex items-center gap-1.5">
                              <span className="truncate">{opt.label}</span>
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[var(--app-accent)] text-[#0E0926] font-bold">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[var(--app-text-muted)] truncate mt-0.5">
                              {opt.description}
                            </p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-[var(--app-accent)] text-[#0E0926] flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-2 h-2 rounded-full opacity-0 group-hover:opacity-40 bg-[var(--app-text-muted)] shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setCurrentPage('notifications')}
            className="relative p-2 rounded-lg text-[var(--app-text-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)] transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#F97316] ring-2 ring-[var(--app-surface)] animate-pulse" />
            )}
          </button>

          {/* User Profile Pill & Dropdown */}
          <div ref={profileContainerRef} className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[var(--app-border)] hover:border-[var(--app-primary)] bg-[var(--app-surface-elevated)] transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-[var(--app-primary)] text-[var(--app-text)] flex items-center justify-center font-bold text-xs relative shadow-xs">
                SG
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#F97316] ring-1 ring-[var(--app-surface)]" />
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-[var(--app-text)] truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[var(--app-text-muted)] truncate max-w-[100px] font-tabular">
                  {user.studentId}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--app-surface-elevated)] border border-[var(--app-border)] shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-[var(--app-border)]">
                  <p className="text-xs font-bold text-[var(--app-text)]">{user.name}</p>
                  <p className="text-[11px] text-[var(--app-text-muted)] truncate">{user.email}</p>
                  <p className="text-[10px] text-[var(--app-accent)] font-semibold mt-0.5">{user.department}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => setCurrentPage('profile')}
                    className="w-full px-4 py-2 text-left text-xs text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)] flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Profile</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('my-books')}
                    className="w-full px-4 py-2 text-left text-xs text-[var(--app-text)] hover:bg-[var(--app-surface-subtle)] flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Bookshelf ({user.booksBorrowed})</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[var(--app-border)]">
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
