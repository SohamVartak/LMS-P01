import React from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { BookOpen, Shield, Clock, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useLibrary();

  return (
    <footer 
      className="border-t mt-12 text-[var(--app-text-muted)] text-xs transition-colors duration-200"
      style={{ 
        backgroundColor: 'var(--app-surface)', 
        borderColor: 'var(--app-border)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-[var(--app-border)]">
          {/* Identity */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--app-primary)] text-[var(--app-text)] flex items-center justify-center font-bold text-xs shadow-md border border-[var(--app-border)]">
                <BookOpen className="w-3.5 h-3.5 text-[var(--app-accent)]" />
              </div>
              <span className="font-bold text-[var(--app-text)] text-sm font-serif-academic">Central Digital Library</span>
            </div>
            <p className="text-[var(--app-text-muted)] text-[11px] leading-relaxed">
              Sarthak&apos;s Institute of Technology. Modern academic resource center supporting engineering research, DBMS, and digital curriculum.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-[var(--app-text)] text-xs uppercase tracking-wider">Quick Navigation</h5>
            <ul className="space-y-1 text-[var(--app-text-muted)]">
              <li><button onClick={() => setCurrentPage('browse-books')} className="hover:text-[var(--app-accent)] transition-colors">Complete Catalogue</button></li>
              <li><button onClick={() => setCurrentPage('seat-reservation')} className="hover:text-[var(--app-accent)] transition-colors">Study Carrel Booking</button></li>
              <li><button onClick={() => setCurrentPage('smart-shelf')} className="hover:text-[var(--app-accent)] transition-colors">QR Smart Stacks</button></li>
              <li><button onClick={() => setCurrentPage('book-exchange')} className="hover:text-[var(--app-accent)] transition-colors">Student Book Exchange</button></li>
            </ul>
          </div>

          {/* Library Hours */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-[var(--app-text)] text-xs uppercase tracking-wider">Library Hours</h5>
            <div className="text-[var(--app-text-muted)] space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--app-accent)] shrink-0" />
                <span>Mon – Sat: 08:00 AM – 10:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--app-accent)] shrink-0" />
                <span>Sundays & Holidays: 09:00 AM – 05:00 PM</span>
              </div>
              <p className="text-[var(--app-text-muted)]/80 pt-1">Digital catalog & AI services accessible 24/7</p>
            </div>
          </div>

          {/* Location & Help */}
          <div className="space-y-1.5">
            <h5 className="font-bold text-[var(--app-text)] text-xs uppercase tracking-wider">Campus Circulation</h5>
            <div className="text-[var(--app-text-muted)] space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--app-accent)] shrink-0" />
                <span>SIT North Campus · Academic Block 4</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>RFID Gate & Digital Attendance Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[var(--app-text-muted)] text-[11px]">
          <p>© 2026 Sarthak&apos;s Institute of Technology — Central Library</p>
          <div className="flex items-center gap-4">
            <span className="text-[var(--app-accent)] font-semibold">DBMS Academic Project</span>
            <span>·</span>
            <span className="font-tabular">v2.4-Web</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
