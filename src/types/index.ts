export type BookCondition = 'Excellent' | 'Good' | 'Needs Attention' | 'Damaged';

export type BookCategory = 
  | 'Computer Science' 
  | 'Artificial Intelligence' 
  | 'Software Engineering' 
  | 'Mathematics' 
  | 'Self-Improvement' 
  | 'Finance & Business' 
  | 'Classic Literature' 
  | 'Science & Physics';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: BookCategory;
  description: string;
  rating: number;
  reviewsCount: number;
  pages: number;
  readingTimeHours: number;
  shelfLocation: string; // e.g. "Floor 2 · Shelf CS-03"
  shelfId: string;
  totalCopies: number;
  availableCopies: number;
  condition: BookCondition;
  conditionNotes?: string;
  lastCheckedDate: string;
  publicationYear: number;
  publisher: string;
  coverGradient: string; // Tailored cover gradient
  coverAccent: string;
  popularityScore: number; // 1-100
  aiSummary: {
    summary: string;
    keyIdeas: string[];
    importantConcepts: string[];
    mainTakeaways: string[];
    whyRead: string;
  };
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  department: string;
  year: string;
  avatarUrl?: string;
  readingStreak: number;
  booksCompleted: number;
  booksBorrowed: number;
  pendingReturns: number;
  totalReadingHours: number;
  longestStreak: number;
  favoriteGenre: string;
  preferences: {
    genres: string[];
    dailyGoalMinutes: number;
    preferredTime: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  };
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  category: BookCategory;
  coverGradient: string;
  borrowDate: string;
  dueDate: string;
  status: 'Currently Reading' | 'Borrowed' | 'Completed' | 'Reserved' | 'Overdue';
  progressPercent: number;
  pagesRead: number;
  totalPages: number;
  rating?: number;
}

export interface SeatReservation {
  id: string;
  seatNumber: string;
  floor: number;
  section: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface BookExchangeItem {
  id: string;
  title: string;
  author: string;
  ownerName: string;
  ownerId: string;
  department: string;
  year: string;
  category: string;
  condition: BookCondition;
  description: string;
  status: 'Available' | 'Requested' | 'Exchanged';
  postedDate: string;
}

export interface ReadingCompanion {
  id: string;
  name: string;
  department: string;
  year: string;
  avatarBg: string;
  avatarInitials: string;
  favoriteGenre: string;
  readingGoal: string;
  preferredReadingTime: string;
  readingLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  compatibility: number;
  currentlyReading: string;
  bio: string;
  connectionStatus: 'none' | 'pending' | 'connected';
}

export interface ShelfInfo {
  id: string;
  code: string;
  name: string;
  category: BookCategory;
  floor: number;
  section: string;
  totalBooks: number;
  availableBooks: number;
  qrPayload: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'due' | 'seat' | 'streak' | 'recommendation' | 'exchange' | 'system';
  timestamp: string;
  read: boolean;
  linkPage?: NavigationPage;
}

export interface ActivityTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'borrow' | 'return' | 'seat' | 'review' | 'streak' | 'exchange';
}

export type NavigationPage = 
  | 'dashboard'
  | 'browse-books'
  | 'my-books'
  | 'ai-recommendations'
  | 'reading-mood'
  | 'seat-reservation'
  | 'reading-streak'
  | 'book-exchange'
  | 'companion-finder'
  | 'smart-shelf'
  | 'personality-quiz'
  | 'surprise-me'
  | 'reading-time'
  | 'popularity-heat-map'
  | 'ai-summary'
  | 'book-health'
  | 'profile'
  | 'notifications';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  category?: string;
  resultsCount: number;
}

export interface PersonalityResult {
  title: string;
  badge: string;
  description: string;
  strengths: string[];
  recommendedBookIds: string[];
}

export type BackgroundTheme = 
  | 'amethyst' 
  | 'cyberpunk' 
  | 'sunset' 
  | 'emerald' 
  | 'sapphire' 
  | 'ruby' 
  | 'aurora' 
  | 'gold' 
  | 'midnight' 
  | 'parchment' 
  | 'slate' 
  | 'charcoal';
export type ThemeColorMode = BackgroundTheme;
