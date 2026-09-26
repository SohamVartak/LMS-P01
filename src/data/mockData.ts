import { Book, User, BorrowRecord, SeatReservation, BookExchangeItem, ReadingCompanion, ShelfInfo, NotificationItem, ActivityTimelineItem } from '../types';

export const INITIAL_BOOKS: Book[] = [];

export const INITIAL_USER: User = {
  id: '',
  name: '',
  studentId: '',
  email: '',
  department: 'Computer Science & Engineering',
  year: '',
  readingStreak: 0,
  booksCompleted: 0,
  booksBorrowed: 0,
  pendingReturns: 0,
  totalReadingHours: 0,
  longestStreak: 0,
  favoriteGenre: 'Computer Engineering',
  preferences: {
    genres: ['Computer Science', 'Computer Engineering', 'Electrical Engineering'],
    dailyGoalMinutes: 30,
    preferredTime: 'Evening'
  }
};

export const INITIAL_BORROW_RECORDS: BorrowRecord[] = [];
export const INITIAL_SEAT_RESERVATIONS: SeatReservation[] = [];
export const INITIAL_EXCHANGE_ITEMS: BookExchangeItem[] = [];
export const INITIAL_COMPANIONS: ReadingCompanion[] = [];
export const INITIAL_SHELVES: ShelfInfo[] = [];
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
export const INITIAL_ACTIVITIES: ActivityTimelineItem[] = [];

export const INITIAL_SEARCH_HISTORY = [];