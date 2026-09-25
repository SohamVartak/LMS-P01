import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { NavigationPage } from '../../types';
import {
  LayoutDashboard,
  Compass,
  BookMarked,
  Sparkles,
  Smile,
  Armchair,
  Flame,
  ArrowLeftRight,
  Users,
  QrCode,
  HelpCircle,
  Dices,
  Hourglass,
  BarChart3,
  FileText,
  Activity,
  UserCheck,
  Bell,
  LogOut,
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentPage, setCurrentPage, notifications, logout } = useLibrary();

  const unreadCount = notifications.filter(n => !n.read).length;

  const mainNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'browse-books', label: 'Browse Books', icon: <Compass className="w-4 h-4" /> },
    { id: 'my-books', label: 'My Books', icon: <BookMarked className="w-4 h-4" /> },
    { id: 'ai-recommendations', label: 'AI Advisor', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'reading-mood', label: 'Reading Mood', icon: <Smile className="w-4 h-4" /> },
    { id: 'seat-reservation', label: 'Seat Reservation', icon: <Armchair className="w-4 h-4" /> },
    { id: 'reading-streak', label: 'Reading Streak', icon: <Flame className="w-4 h-4 text-[#F97316]" />, badge: '7d' },
    { id: 'book-exchange', label: 'Book Exchange', icon: <ArrowLeftRight className="w-4 h-4" /> },
    { id: 'companion-finder', label: 'Companion Finder', icon: <Users className="w-4 h-4" /> },
    { id: 'smart-shelf', label: 'Smart Shelf QR', icon: <QrCode className="w-4 h-4" /> },
    { id: 'personality-quiz', label: 'Personality Quiz', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'surprise-me', label: 'Surprise Me', icon: <Dices className="w-4 h-4 text-[#F97316]" /> },
    { id: 'reading-time', label: 'Reading Time', icon: <Hourglass className="w-4 h-4" /> },
    { id: 'popularity-heat-map', label: 'Heat Map', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai-summary', label: 'AI Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'book-health', label: 'Book Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'profile', label: 'Student Profile', icon: <UserCheck className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: NavigationPage) => {
    setCurrentPage(id);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[var(--app-surface)] text-[var(--app-text)] w-64 border-r border-[var(--app-border)] shadow-2xl">
      {/* College Identity Header */}
      <div className="p-5 border-b border-[var(--app-border)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--app-primary)] text-[var(--app-text)] flex items-center justify-center font-bold text-xs shadow-md border border-[var(--app-border)]">
              <BookOpen className="w-4 h-4 text-[var(--app-accent)]" />
            </div>
            <span className="font-bold text-sm tracking-tight text-[var(--app-text)] font-serif-academic">
              SIT Central Library
            </span>
          </div>
          <p className="text-[11px] text-[var(--app-text-muted)] mt-1 font-medium">Sarthak&apos;s Institute of Technology</p>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 text-[var(--app-text-muted)] hover:text-[var(--app-text)]"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation Links List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[10px] uppercase tracking-wider font-bold text-[var(--app-accent)] px-3 py-1">
          Academic Portal
        </div>
        {mainNavItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[var(--app-surface-elevated)] text-[var(--app-text)] font-bold border border-[var(--app-primary)] shadow-md'
                  : 'text-[var(--app-text-muted)] hover:bg-[var(--app-surface-subtle)] hover:text-[var(--app-text)]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className={isActive ? 'text-[var(--app-accent)]' : 'text-[var(--app-text-muted)]'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-[var(--app-primary)]/30 text-[var(--app-accent)]' : 'bg-[var(--app-accent)]/20 text-[var(--app-accent)]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Sticky Section: Notifications, Settings, Logout */}
      <div className="p-3 border-t border-[var(--app-border)] space-y-1 bg-[var(--app-surface-subtle)]/60">
        <button
          onClick={() => handleNavClick('notifications')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
            currentPage === 'notifications'
              ? 'bg-[var(--app-surface-elevated)] text-[var(--app-text)] font-semibold border border-[var(--app-primary)]'
              : 'text-[var(--app-text-muted)] hover:bg-[var(--app-surface-subtle)] hover:text-[var(--app-text)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Bell className={`w-4 h-4 ${currentPage === 'notifications' ? 'text-[var(--app-accent)]' : 'text-[var(--app-text-muted)]'}`} />
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F97316] text-[#0E0926] font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (persistent) */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
