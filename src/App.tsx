/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { BookDetailModal } from './components/common/BookDetailModal';

// Pages
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { BrowseBooksPage } from './pages/BrowseBooksPage';
import { MyBooksPage } from './pages/MyBooksPage';
import { AIRecommendationPage } from './pages/AIRecommendationPage';
import { ReadingMoodPage } from './pages/ReadingMoodPage';
import { SeatReservationPage } from './pages/SeatReservationPage';
import { ReadingStreakPage } from './pages/ReadingStreakPage';
import { BookExchangePage } from './pages/BookExchangePage';
import { CompanionFinderPage } from './pages/CompanionFinderPage';
import { SmartShelfPage } from './pages/SmartShelfPage';
import { PersonalityQuizPage } from './pages/PersonalityQuizPage';
import { SurpriseMePage } from './pages/SurpriseMePage';
import { ReadingTimePage } from './pages/ReadingTimePage';
import { PopularityHeatMapPage } from './pages/PopularityHeatMapPage';
import { AIBookSummaryPage } from './pages/AIBookSummaryPage';
import { BookHealthPage } from './pages/BookHealthPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { RoleHomePage } from './pages/RoleHomePage';
import { AdminBookManagementPage } from './pages/AdminBookManagementPage';
import { AdminCirculationPage } from './pages/AdminCirculationPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppContent: React.FC = () => {
  const { isLoggedIn, authLoading, currentPage, theme, userRole, activePortal } = useLibrary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminPage, setAdminPage] = useState<'home' | 'books' | 'circulation'>('home');

  if (authLoading) {
    return <div data-theme={theme} className="min-h-screen flex items-center justify-center bg-[var(--app-canvas)] text-[var(--app-text)] text-sm">Loading library...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div data-theme={theme} className="min-h-screen">
        <AuthPage />
        <ToastContainer />
      </div>
    );
  }

  if (userRole === 'ADMIN' && activePortal === 'ADMIN') {
    if (adminPage === 'books') return <AdminBookManagementPage onOpenCirculation={() => setAdminPage('circulation')} />;
    if (adminPage === 'circulation') return <AdminCirculationPage onBack={() => setAdminPage('home')} />;
    return <AdminPortalPage onOpenBooks={() => setAdminPage('books')} onOpenCirculation={() => setAdminPage('circulation')} />;
  }

  if (activePortal === 'AUTHOR') {
    return <RoleHomePage />;
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'browse-books':
        return <BrowseBooksPage />;
      case 'my-books':
        return <MyBooksPage />;
      case 'ai-recommendations':
        return <AIRecommendationPage />;
      case 'reading-mood':
        return <ReadingMoodPage />;
      case 'seat-reservation':
        return <SeatReservationPage />;
      case 'reading-streak':
        return <ReadingStreakPage />;
      case 'book-exchange':
        return <BookExchangePage />;
      case 'companion-finder':
        return <CompanionFinderPage />;
      case 'smart-shelf':
        return <SmartShelfPage />;
      case 'personality-quiz':
        return <PersonalityQuizPage />;
      case 'surprise-me':
        return <SurpriseMePage />;
      case 'reading-time':
        return <ReadingTimePage />;
      case 'popularity-heat-map':
        return <PopularityHeatMapPage />;
      case 'ai-summary':
        return <AIBookSummaryPage />;
      case 'book-health':
        return <BookHealthPage />;
      case 'profile':
        return <ProfilePage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div 
      data-theme={theme} 
      className="min-h-screen flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-[var(--app-primary)] selection:text-[var(--app-text)]"
      style={{ backgroundColor: 'var(--app-canvas)', color: 'var(--app-text)' }}
    >
      <div className="flex flex-1">
        {/* Persistent Academic Sidebar */}
        <Sidebar 
          mobileOpen={mobileMenuOpen} 
          onCloseMobile={() => setMobileMenuOpen(false)} 
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)} />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {renderActivePage()}
          </main>

          <Footer />
        </div>
      </div>

      {/* Global Modals & Notifications */}
      <BookDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
