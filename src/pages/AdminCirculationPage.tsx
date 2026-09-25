import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, CalendarDays, CheckCircle2, ClipboardList, Search, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLibrary } from '../context/LibraryContext';

type BorrowRow = {
  id: string;
  book_id: string;
  student_id: string;
  issue_date: string;
  due_date: string | null;
  return_date: string | null;
  status: string;
  books?: { title: string; author_name: string } | null;
  profiles?: { full_name: string; student_id: string | null } | null;
};

export const AdminCirculationPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { userRole, books, refreshBooks, addToast } = useLibrary();
  const [records, setRecords] = useState<BorrowRow[]>([]);
  const [students, setStudents] = useState<{id:string; full_name:string; student_id:string|null}[]>([]);
  const [query, setQuery] = useState('');
  const [studentId, setStudentId] = useState('');
  const [bookId, setBookId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [borrowRes, studentRes] = await Promise.all([
      supabase.from('borrow_records').select('id, book_id, student_id, issue_date, due_date, return_date, status, books(title, author_name), profiles:student_id(full_name, student_id)').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, full_name, student_id').eq('role', 'STUDENT').order('full_name')
    ]);
    if (borrowRes.error) addToast('Circulation Error', borrowRes.error.message, 'error');
    else setRecords((borrowRes.data || []) as BorrowRow[]);
    if (!studentRes.error) setStudents(studentRes.data || []);
    setLoading(false);
  };

  useEffect(() => { if (userRole === 'ADMIN') { void load(); void refreshBooks(); } }, [userRole]);

  const pendingRecords = records.filter(r => r.status === 'RESERVED');
  const activeRecords = records.filter(r => r.status === 'BORROWED' || r.status === 'OVERDUE');
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return activeRecords;
    return activeRecords.filter(r =>
      [r.books?.title, r.books?.author_name, r.profiles?.full_name, r.profiles?.student_id]
        .some(v => (v || '').toLowerCase().includes(q))
    );
  }, [activeRecords, query]);

  const issueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !bookId || !dueDate) return;
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) {
      addToast('No Copy Available', 'This book has no available copy.', 'warning');
      return;
    }
    setSaving(true);
    const { error: insertError } = await supabase.from('borrow_records').insert({
      book_id: bookId, student_id: studentId, issue_date: new Date().toISOString().slice(0,10),
      due_date: dueDate, status: 'BORROWED'
    });
    if (!insertError) {
      const { error: stockError } = await supabase.from('books').update({ available_copies: book.availableCopies - 1 }).eq('id', bookId);
      if (stockError) {
        await supabase.from('borrow_records').delete().eq('id', (await supabase.from('borrow_records').select('id').eq('book_id', bookId).eq('student_id', studentId).eq('status','BORROWED').order('created_at',{ascending:false}).limit(1).single()).data?.id || '');
        addToast('Issue Failed', stockError.message, 'error');
      } else {
        addToast('Book Issued', 'The book has been issued to the selected student.', 'success');
        setStudentId(''); setBookId(''); setDueDate('');
        await load(); await refreshBooks();
      }
    } else addToast('Issue Failed', insertError.message, 'error');
    setSaving(false);
  };

  const approveRequest = async (record: BorrowRow) => {
    const book = books.find(b => b.id === record.book_id);
    if (!book || book.availableCopies <= 0) { addToast('No Copy Available', 'This book currently has no available copy.', 'warning'); return; }
    const selectedDue = window.prompt('Enter due date (YYYY-MM-DD):', new Date(Date.now() + 14 * 86400000).toISOString().slice(0,10));
    if (!selectedDue) return;
    setSaving(true);
    const { error } = await supabase.from('borrow_records').update({ status: 'BORROWED', issue_date: new Date().toISOString().slice(0,10), due_date: selectedDue }).eq('id', record.id).eq('status', 'RESERVED');
    if (!error) {
      const { error: stockError } = await supabase.from('books').update({ available_copies: book.availableCopies - 1 }).eq('id', book.id).gte('available_copies', 1);
      if (stockError) { await supabase.from('borrow_records').update({ status: 'RESERVED', due_date: null }).eq('id', record.id); addToast('Approval Failed', stockError.message, 'error'); }
      else {
        await supabase.from('notifications').insert({ user_id: record.student_id, title: 'Book Issued', message: 'Your requested book has been issued. Due date: ' + selectedDue + '.', type: 'library' });
        addToast('Request Approved', 'The book has been issued to the student.', 'success');
      }
      await load(); await refreshBooks();
    } else addToast('Approval Failed', error.message, 'error');
    setSaving(false);
  };

  const rejectRequest = async (record: BorrowRow) => {
    setSaving(true);
    const { error } = await supabase.from('borrow_records').delete().eq('id', record.id).eq('status', 'RESERVED');
    if (error) addToast('Rejection Failed', error.message, 'error');
    else {
      await supabase.from('notifications').insert({ user_id: record.student_id, title: 'Book Request Declined', message: 'Your book request was declined by the library administrator.', type: 'library' });
      addToast('Request Declined', 'The reservation request was removed.', 'info');
      await load();
    }
    setSaving(false);
  };
  const returnBook = async (record: BorrowRow) => {
    const book = books.find(b => b.id === record.book_id);
    if (!book) return;
    setSaving(true);
    const { error } = await supabase.from('borrow_records').update({
      status: 'RETURNED', return_date: new Date().toISOString().slice(0,10)
    }).eq('id', record.id);
    if (!error) {
      const { error: stockError } = await supabase.from('books').update({
        available_copies: Math.min(book.totalCopies, book.availableCopies + 1)
      }).eq('id', book.id);
      if (stockError) addToast('Return Partially Saved', stockError.message, 'error');
      else addToast('Book Returned', 'The copy is available again.', 'success');
      await load(); await refreshBooks();
    } else addToast('Return Failed', error.message, 'error');
    setSaving(false);
  };

  if (userRole !== 'ADMIN') return null;

  return <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
    <div className="max-w-7xl mx-auto">
      <button onClick={onBack} className="mb-5 text-sm font-semibold text-violet-700 flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back to Book Management</button>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider"><ClipboardList className="w-4 h-4"/> Circulation</div>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Issue & Return Books</h1>
        <p className="text-sm text-slate-500 mt-1">Issue books to students and record returns from the administrator portal.</p>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5">
        <form onSubmit={issueBook} className="bg-white rounded-xl border border-slate-200 p-5 h-fit">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Issue a Book</h2>
          <label className="block mb-4"><span className="text-xs font-semibold text-slate-700">Student</span>
            <select value={studentId} onChange={e=>setStudentId(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" required>
              <option value="">Select student</option>{students.map(s=><option key={s.id} value={s.id}>{s.full_name}{s.student_id ? ' · '+s.student_id : ''}</option>)}
            </select>
          </label>
          <label className="block mb-4"><span className="text-xs font-semibold text-slate-700">Book</span>
            <select value={bookId} onChange={e=>setBookId(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" required>
              <option value="">Select available book</option>{books.filter(b=>b.availableCopies>0).map(b=><option key={b.id} value={b.id}>{b.title} · {b.availableCopies} available</option>)}
            </select>
          </label>
          <label className="block mb-5"><span className="text-xs font-semibold text-slate-700">Due Date</span>
            <div className="relative mt-1"><CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm" required/></div>
          </label>
          <button disabled={saving} className="w-full py-2.5 rounded-lg bg-violet-700 text-white text-sm font-semibold disabled:opacity-50">{saving ? 'Processing...' : 'Issue Book'}</button>
        </form>

        <div className="space-y-5">
        <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
          <div className="p-4 border-b border-amber-100 bg-amber-50"><div className="flex items-center justify-between"><h2 className="font-bold text-slate-900">Pending Book Requests</h2><span className="text-xs text-amber-700">{pendingRecords.length} pending</span></div></div>
          {pendingRecords.length === 0 ? <div className="p-6 text-center text-sm text-slate-500">No pending requests.</div> :
          <div className="divide-y divide-slate-100">{pendingRecords.map(r=><div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><div className="font-semibold text-slate-900">{r.books?.title || 'Book'}</div><div className="text-xs text-slate-500">{r.profiles?.full_name || 'Student'}{r.profiles?.student_id ? ' · '+r.profiles.student_id : ''}</div><div className="text-xs text-slate-500 mt-1">Requested {r.issue_date}</div></div>
            <div className="flex gap-2"><button disabled={saving} onClick={()=>void approveRequest(r)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold">Approve & Issue</button><button disabled={saving} onClick={()=>void rejectRequest(r)} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 text-xs font-semibold">Decline</button></div>
          </div>)}</div>}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3"><h2 className="font-bold text-slate-900">Active Issues</h2><span className="text-xs text-slate-500">{activeRecords.length} active</span></div>
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search student or book..." className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 text-sm"/></div>
          </div>
          {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading circulation records...</div> :
          filtered.length === 0 ? <div className="p-10 text-center text-sm text-slate-500"><UserRound className="w-8 h-8 mx-auto mb-2 text-slate-300"/>No active issues found.</div> :
          <div className="divide-y divide-slate-100">{filtered.map(r=><div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><div className="font-semibold text-slate-900">{r.books?.title || 'Book'}</div><div className="text-xs text-slate-500">{r.profiles?.full_name || 'Student'}{r.profiles?.student_id ? ' · '+r.profiles.student_id : ''}</div><div className="text-xs text-slate-500 mt-1">Issued {r.issue_date} · Due {r.due_date}</div></div>
            <button disabled={saving} onClick={()=>void returnBook(r)} className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Mark Returned</button>
          </div>)}</div>}
        </div>
      </div>
    </div>
  </div>;
};
