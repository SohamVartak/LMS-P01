import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Book, 
  User, 
  BorrowRecord, 
  SeatReservation, 
  BookExchangeItem, 
  ReadingCompanion, 
  ShelfInfo, 
  NotificationItem, 
  ActivityTimelineItem,
  NavigationPage, 
  ToastMessage,
  BookCondition,
  SearchHistoryItem,
  BackgroundTheme
} from '../types';
import { 
  INITIAL_BOOKS, 
  INITIAL_USER, 
  INITIAL_BORROW_RECORDS, 
  INITIAL_SEAT_RESERVATIONS, 
  INITIAL_EXCHANGE_ITEMS, 
  INITIAL_COMPANIONS, 
  INITIAL_SHELVES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACTIVITIES,
  INITIAL_SEARCH_HISTORY
} from '../data/mockData';

interface LibraryContextType {
  books: Book[];
  user: User;
  borrowedBooks: BorrowRecord[];
  wishlist: string[];
  reservations: SeatReservation[];
  exchangeItems: BookExchangeItem[];
  companions: ReadingCompanion[];
  shelves: ShelfInfo[];
  notifications: NotificationItem[];
  activities: ActivityTimelineItem[];
  searchHistory: SearchHistoryItem[];
  selectedBookModal: Book | null;
  toasts: ToastMessage[];
  currentPage: NavigationPage;
  isLoggedIn: boolean;
  authLoading: boolean;
  userRole: 'STUDENT' | 'AUTHOR' | 'ADMIN' | null;
  theme: BackgroundTheme;
  setTheme: (theme: BackgroundTheme) => void;
  
  setCurrentPage: (page: NavigationPage) => void;
  openBookModal: (book: Book) => void;
  closeBookModal: () => void;
  addToast: (title: string, description: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  addSearchHistory: (query: string, resultsCount: number, category?: string) => void;
  removeSearchHistoryItem: (id: string) => void;
  clearSearchHistory: () => void;
  
  borrowBook: (bookId: string) => boolean;
  reserveBook: (bookId: string) => boolean;
  returnBook: (borrowRecordId: string) => void;
  toggleWishlist: (bookId: string) => void;
  updateReadingProgress: (borrowRecordId: string, percent: number) => void;
  
  reserveSeat: (floor: number, seatNumber: string, date: string, timeSlot: string, section: string) => boolean;
  cancelSeatReservation: (resId: string) => void;
  
  updateBookCondition: (bookId: string, condition: BookCondition, notes?: string) => void;
  addExchangeListing: (item: { title: string; author: string; category: string; condition: BookCondition; description: string }) => void;
  requestExchange: (itemId: string) => void;
  connectCompanion: (companionId: string) => void;
  
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  updateUserProfile: (updated: Partial<User>) => void;
  login: (email: string, password: string, expectedRole: 'STUDENT' | 'AUTHOR' | 'ADMIN') => Promise<boolean>;
  logout: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>(INITIAL_BORROW_RECORDS);
  const [wishlist, setWishlist] = useState<string[]>(['b-7', 'b-8', 'b-24']);
  const [reservations, setReservations] = useState<SeatReservation[]>(INITIAL_SEAT_RESERVATIONS);
  const [exchangeItems, setExchangeItems] = useState<BookExchangeItem[]>(INITIAL_EXCHANGE_ITEMS);
  const [companions, setCompanions] = useState<ReadingCompanion[]>(INITIAL_COMPANIONS);
  const [shelves] = useState<ShelfInfo[]>(INITIAL_SHELVES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityTimelineItem[]>(INITIAL_ACTIVITIES);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(INITIAL_SEARCH_HISTORY);
  
  const [selectedBookModal, setSelectedBookModal] = useState<Book | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentPage, setCurrentPageState] = useState<NavigationPage>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<'STUDENT' | 'AUTHOR' | 'ADMIN' | null>(null);
  const [theme, setThemeState] = useState<BackgroundTheme>('amethyst');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (userId: string) => {
      const { data, error } = await supabase.from('profiles')
        .select('full_name, role, student_id, department, year')
        .eq('id', userId).maybeSingle();

      if (!mounted) return;
      if (error || !data || !['STUDENT', 'AUTHOR', 'ADMIN'].includes(data.role)) {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setUserRole(null);
        setCurrentPageState('dashboard');
        return;
      }

      setUser(prev => ({
        ...prev,
        id: userId,
        name: data.full_name || prev.name,
        studentId: data.student_id || prev.studentId,
        department: data.department || prev.department,
        year: data.year || prev.year,
      }));
      setUserRole(data.role as 'STUDENT' | 'AUTHOR' | 'ADMIN');
      setIsLoggedIn(true);
      setCurrentPageState('dashboard');
      if (data.role === 'STUDENT') void loadStudentData(userId);
    };

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) await loadProfile(data.session.user.id);
      if (mounted) setAuthLoading(false);
    };
    void init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsLoggedIn(false);
        setUserRole(null);
        setAuthLoading(false);
      } else {
        setTimeout(() => { void loadProfile(session.user.id); }, 0);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);


  const loadStudentData = async (userId: string) => {
    if (userRole !== 'STUDENT') return;

    const { data: dbBooks, error: booksError } = await supabase
      .from('books')
      .select('*')
      .order('title', { ascending: true });

    if (!booksError && dbBooks && dbBooks.length > 0) {
      const mappedBooks: Book[] = dbBooks.map((b: any) => ({
        id: b.id,
        isbn: b.isbn || '',
        title: b.title,
        author: b.author_name || 'Unknown Author',
        category: (b.category || 'Computer Science') as Book['category'],
        description: b.description || '',
        rating: 0,
        reviewsCount: 0,
        pages: 0,
        readingTimeHours: 0,
        shelfLocation: b.shelf_location || 'Not assigned',
        shelfId: b.shelf_id || '',
        totalCopies: b.total_copies || 0,
        availableCopies: b.available_copies || 0,
        condition: (b.condition || 'Good') as BookCondition,
        conditionNotes: b.condition_notes || '',
        lastCheckedDate: b.updated_at ? b.updated_at.slice(0, 10) : '',
        publicationYear: b.publication_year || 0,
        publisher: b.publisher || '',
        coverGradient: 'from-slate-800 to-violet-950',
        coverAccent: '#F97316',
        popularityScore: 0,
        aiSummary: {
          summary: b.description || 'No AI summary available yet.',
          keyIdeas: [],
          importantConcepts: [],
          mainTakeaways: [],
          whyRead: ''
        }
      }));
      setBooks(mappedBooks);
    }

    const { data: dbBorrowed, error: borrowError } = await supabase
      .from('borrow_records')
      .select('id, book_id, issue_date, due_date, return_date, status, books(title, author_name, category, pages)')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });

    if (!borrowError && dbBorrowed) {
      const mappedBorrowed: BorrowRecord[] = dbBorrowed.map((r: any) => {
        const book = r.books || {};
        const dbStatus = String(r.status || 'BORROWED');
        const status: BorrowRecord['status'] = dbStatus === 'RETURNED' ? 'Completed' : dbStatus === 'RESERVED' ? 'Reserved' : dbStatus === 'OVERDUE' ? 'Overdue' : 'Borrowed';
        return {
          id: r.id,
          bookId: r.book_id,
          bookTitle: book.title || 'Library Book',
          author: book.author_name || 'Unknown Author',
          category: (book.category || 'Computer Science') as Book['category'],
          coverGradient: 'from-slate-800 to-violet-950',
          borrowDate: r.issue_date,
          dueDate: r.due_date,
          status,
          progressPercent: status === 'Completed' ? 100 : 0,
          pagesRead: 0,
          totalPages: book.pages || 0
        };
      });
      setBorrowedBooks(mappedBorrowed);
    }

    const { data: dbNotifications, error: notificationsError } = await supabase
      .from('notifications')
      .select('id, title, message, type, read, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!notificationsError && dbNotifications) {
      setNotifications(dbNotifications.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: (n.type || 'system') as NotificationItem['type'],
        timestamp: new Date(n.created_at).toLocaleString(),
        read: n.read
      })));
    }
  };

  const setTheme = (newTheme: BackgroundTheme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    const themeNames: Record<BackgroundTheme, string> = {
      amethyst: 'Cosmic Amethyst (Vibrant Deep Violet & Neon Amber)',
      cyberpunk: 'Cyberpunk Neon (Dark Obsidian Plum, Hot Pink & Lime)',
      sunset: 'Molten Sunset (Deep Burnt Umber, Coral & Solar Gold)',
      emerald: 'Dark Jade Academia (Luminous Forest & Solar Gold)',
      sapphire: 'Cyber Sapphire (Deep Cobalt Ocean & Cyan Glow)',
      ruby: 'Velvet Ruby (Deep Garnet Wine & Molten Amber)',
      aurora: 'Aurora Borealis (Polar Night Teal & Radiant Mint)',
      gold: 'Imperial Gold & Onyx (Obsidian Espresso & Royal Gold)',
      midnight: 'Obsidian Midnight (Deep Night Study & Violet Glow)',
      parchment: 'Antique Amber (Deep Aged Scholarly Leather & Bronze)',
      slate: 'Steel Nebula (Deep Architectural Indigo & Cobalt)',
      charcoal: 'Cosmic Charcoal (Deep Obsidian Night & Electric Violet)'
    };
    addToast('Palette Updated', `Background theme set to ${themeNames[newTheme]}`, 'info');
  };

  const addSearchHistory = (query: string, resultsCount: number, category?: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      // Remove previous duplicate if existing
      const filtered = prev.filter(item => item.query.toLowerCase() !== trimmed.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: 'sh-' + Date.now(),
        query: trimmed,
        timestamp: 'Just now',
        category: category || 'All Disciplines',
        resultsCount
      };
      return [newItem, ...filtered].slice(0, 12); // Keep last 12
    });
  };

  const removeSearchHistoryItem = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    addToast('Search History Cleared', 'Your recent catalogue searches have been wiped.', 'info');
  };

  const addToast = (title: string, description: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openBookModal = (book: Book) => {
    setSelectedBookModal(book);
  };

  const closeBookModal = () => {
    setSelectedBookModal(null);
  };

  const borrowBook = (bookId: string): boolean => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return false;
    
    // Check if already active
    const alreadyBorrowed = borrowedBooks.some(
      b => b.bookId === bookId && (b.status === 'Currently Reading' || b.status === 'Borrowed')
    );
    if (alreadyBorrowed) {
      addToast('Already Borrowed', `You currently hold an active issue for "${targetBook.title}".`, 'warning');
      return false;
    }

    if (targetBook.availableCopies <= 0) {
      addToast('No Copies Available', `All physical copies are checked out. You can reserve this title.`, 'warning');
      return false;
    }

    // Update book inventory
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b));

    // Calculate due date (14 days from today)
    const due = new Date();
    due.setDate(due.getDate() + 14);
    const dueDateStr = due.toISOString().split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];

    const newRecord: BorrowRecord = {
      id: 'br-' + Date.now(),
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      author: targetBook.author,
      category: targetBook.category,
      coverGradient: targetBook.coverGradient,
      borrowDate: todayStr,
      dueDate: dueDateStr,
      status: 'Borrowed',
      progressPercent: 0,
      pagesRead: 0,
      totalPages: targetBook.pages
    };

    setBorrowedBooks(prev => [newRecord, ...prev]);
    setUser(prev => ({
      ...prev,
      booksBorrowed: prev.booksBorrowed + 1,
      pendingReturns: prev.pendingReturns + 1
    }));

    // Add activity
    setActivities(prev => [
      {
        id: 'act-' + Date.now(),
        title: 'Book Borrowed',
        description: `Checked out "${targetBook.title}" (Due: ${dueDateStr})`,
        timestamp: 'Just now',
        type: 'borrow'
      },
      ...prev
    ]);

    addToast('Book Issued Successfully', `"${targetBook.title}" added to My Books. Due in 14 days.`, 'success');
    return true;
  };

  const reserveBook = (bookId: string): boolean => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return false;

    const alreadyReserved = borrowedBooks.some(b => b.bookId === bookId && b.status === 'Reserved');
    if (alreadyReserved) {
      addToast('Already Reserved', `You already have an active hold on this title.`, 'info');
      return false;
    }

    const newRecord: BorrowRecord = {
      id: 'br-res-' + Date.now(),
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      author: targetBook.author,
      category: targetBook.category,
      coverGradient: targetBook.coverGradient,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: 'Hold pending pickup',
      status: 'Reserved',
      progressPercent: 0,
      pagesRead: 0,
      totalPages: targetBook.pages
    };

    setBorrowedBooks(prev => [newRecord, ...prev]);
    addToast('Hold Placed Successfully', `Reserved "${targetBook.title}". We will notify you when a copy returns.`, 'success');
    return true;
  };

  const returnBook = (borrowRecordId: string) => {
    const record = borrowedBooks.find(b => b.id === borrowRecordId);
    if (!record) return;

    // Return copy to available stock
    setBooks(prev => prev.map(b => b.id === record.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b));

    // Update status
    setBorrowedBooks(prev => prev.map(b => b.id === borrowRecordId ? { ...b, status: 'Completed', progressPercent: 100 } : b));
    
    setUser(prev => ({
      ...prev,
      booksCompleted: prev.booksCompleted + 1,
      pendingReturns: Math.max(0, prev.pendingReturns - 1)
    }));

    setActivities(prev => [
      {
        id: 'act-' + Date.now(),
        title: 'Book Returned',
        description: `Successfully returned "${record.bookTitle}" to SIT Central Library circulation desk.`,
        timestamp: 'Just now',
        type: 'return'
      },
      ...prev
    ]);

    addToast('Book Returned', `"${record.bookTitle}" marked as returned. Circulation verified ✓`, 'success');
  };

  const toggleWishlist = (bookId: string) => {
    const exists = wishlist.includes(bookId);
    const targetBook = books.find(b => b.id === bookId);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== bookId));
      addToast('Removed from Wishlist', `"${targetBook?.title || 'Book'}" removed from your reading list.`, 'info');
    } else {
      setWishlist(prev => [...prev, bookId]);
      addToast('Added to Wishlist', `"${targetBook?.title || 'Book'}" saved to your reading wishlist ✓`, 'success');
    }
  };

  const updateReadingProgress = (borrowRecordId: string, percent: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    setBorrowedBooks(prev => prev.map(b => {
      if (b.id === borrowRecordId) {
        const pagesRead = Math.round((clamped / 100) * b.totalPages);
        const newStatus = clamped === 100 ? 'Completed' : (clamped > 0 ? 'Currently Reading' : 'Borrowed');
        return {
          ...b,
          progressPercent: clamped,
          pagesRead,
          status: newStatus
        };
      }
      return b;
    }));

    addToast('Reading Progress Saved', `Updated to ${clamped}% complete.`, 'info');
  };

  const reserveSeat = (floor: number, seatNumber: string, date: string, timeSlot: string, section: string): boolean => {
    // Check collision in mock reservations
    const exists = reservations.some(r => r.floor === floor && r.seatNumber === seatNumber && r.date === date && r.timeSlot === timeSlot && r.status !== 'Cancelled');
    if (exists) {
      addToast('Seat Occupied', `Seat ${seatNumber} is already reserved for this slot. Please pick another.`, 'warning');
      return false;
    }

    const newRes: SeatReservation = {
      id: 'res-' + Date.now(),
      seatNumber,
      floor,
      section,
      date,
      timeSlot,
      status: 'Confirmed',
      createdAt: 'Just now'
    };

    setReservations(prev => [newRes, ...prev]);

    setActivities(prev => [
      {
        id: 'act-' + Date.now(),
        title: 'Seat Reserved',
        description: `Reserved Seat ${seatNumber} (Floor ${floor}) for ${date}, ${timeSlot}`,
        timestamp: 'Just now',
        type: 'seat'
      },
      ...prev
    ]);

    setNotifications(prev => [
      {
        id: 'notif-' + Date.now(),
        title: 'Seat Reservation Confirmed',
        message: `Your reservation for Seat ${seatNumber} (Floor ${floor}) is confirmed for ${timeSlot} on ${date}.`,
        type: 'seat',
        timestamp: 'Just now',
        read: false,
        linkPage: 'seat-reservation'
      },
      ...prev
    ]);

    addToast('Seat Reserved Successfully', `Seat ${seatNumber} on Floor ${floor} confirmed for ${timeSlot} ✓`, 'success');
    return true;
  };

  const cancelSeatReservation = (resId: string) => {
    const target = reservations.find(r => r.id === resId);
    if (!target) return;

    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: 'Cancelled' } : r));
    addToast('Reservation Cancelled', `Seat ${target.seatNumber} booking has been released.`, 'info');
  };

  const updateBookCondition = (bookId: string, condition: BookCondition, notes?: string) => {
    const today = new Date().toISOString().split('T')[0];
    setBooks(prev => prev.map(b => b.id === bookId ? {
      ...b,
      condition,
      conditionNotes: notes || b.conditionNotes,
      lastCheckedDate: today
    } : b));

    addToast('Condition Updated', `Book condition logged as "${condition}" in library health register ✓`, 'success');
  };

  const addExchangeListing = (item: { title: string; author: string; category: string; condition: BookCondition; description: string }) => {
    const newItem: BookExchangeItem = {
      id: 'ex-' + Date.now(),
      title: item.title,
      author: item.author,
      category: item.category,
      condition: item.condition,
      description: item.description,
      ownerName: user.name,
      ownerId: user.studentId,
      department: user.department,
      year: user.year,
      status: 'Available',
      postedDate: new Date().toISOString().split('T')[0]
    };

    setExchangeItems(prev => [newItem, ...prev]);
    setActivities(prev => [
      {
        id: 'act-' + Date.now(),
        title: 'Exchange Listing Posted',
        description: `Listed "${item.title}" on the Student Book Exchange Corner.`,
        timestamp: 'Just now',
        type: 'exchange'
      },
      ...prev
    ]);

    addToast('Listing Published', `"${item.title}" is now visible to all students for book exchange ✓`, 'success');
  };

  const requestExchange = (itemId: string) => {
    const target = exchangeItems.find(e => e.id === itemId);
    if (!target) return;

    setExchangeItems(prev => prev.map(e => e.id === itemId ? { ...e, status: 'Requested' } : e));
    addToast('Exchange Request Sent', `Request submitted to ${target.ownerName} (${target.department}). They will be notified!`, 'success');
  };

  const connectCompanion = (companionId: string) => {
    const target = companions.find(c => c.id === companionId);
    if (!target) return;

    setCompanions(prev => prev.map(c => c.id === companionId ? { ...c, connectionStatus: 'connected' } : c));
    addToast('Study Connection Established', `You are now paired with ${target.name} (${target.department})!`, 'success');
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('All Read', 'Marked all notifications as read.', 'info');
  };

  const updateUserProfile = (updated: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updated }));
    addToast('Profile Updated', 'Your student details and reading preferences have been saved ✓', 'success');
  };

  const login = async (email: string, password: string, expectedRole: 'STUDENT' | 'AUTHOR' | 'ADMIN'): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return false;

    const { data: profile, error: profileError } = await supabase.from('profiles')
      .select('full_name, role, student_id, department, year')
      .eq('id', data.user.id).maybeSingle();

    if (profileError || !profile || profile.role !== expectedRole) {
      await supabase.auth.signOut();
      return false;
    }

    setUser(prev => ({
      ...prev,
      id: data.user.id,
      name: profile.full_name || prev.name,
      email: data.user.email || email,
      studentId: profile.student_id || prev.studentId,
      department: profile.department || prev.department,
      year: profile.year || prev.year,
    }));
    setUserRole(profile.role as 'STUDENT' | 'AUTHOR' | 'ADMIN');
    setIsLoggedIn(true);
    setCurrentPageState('dashboard');
    if (profile.role === 'STUDENT') void loadStudentData(data.user.id);
    addToast('Welcome Back', `Signed in as ${profile.full_name || email}`, 'success');
    return true;
  };

  const setCurrentPage = (page: NavigationPage) => {
    // Only Student accounts can enter the existing student-feature pages.
    // Author and Administrator portals are isolated from this navigation domain.
    if (userRole !== 'STUDENT' && page !== 'dashboard') {
      setCurrentPageState('dashboard');
      return;
    }
    setCurrentPageState(page);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserRole(null);
    addToast('Logged Out', 'You have been safely signed out of the library.', 'info');
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        user,
        borrowedBooks,
        wishlist,
        reservations,
        exchangeItems,
        companions,
        shelves,
        notifications,
        activities,
        searchHistory,
        selectedBookModal,
        toasts,
        currentPage,
        isLoggedIn,
        authLoading,
        userRole,
        setCurrentPage,
        openBookModal,
        closeBookModal,
        addToast,
        removeToast,
        addSearchHistory,
        removeSearchHistoryItem,
        clearSearchHistory,
        borrowBook,
        reserveBook,
        returnBook,
        toggleWishlist,
        updateReadingProgress,
        reserveSeat,
        cancelSeatReservation,
        updateBookCondition,
        addExchangeListing,
        requestExchange,
        connectCompanion,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserProfile,
        login,
        logout,
        theme,
        setTheme
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
