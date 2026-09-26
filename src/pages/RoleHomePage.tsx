import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, PenLine, LogOut, Plus, BookMarked, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { supabase } from '../lib/supabase';

type AuthorBook = {
  id: string; title: string; isbn: string | null; category: string | null;
  total_copies: number; available_copies: number; read_count: number; reading_list_count: number;
};

export const RoleHomePage: React.FC = () => {
  const { user, userRole, logout, addToast } = useLibrary();
  const [books, setBooks] = useState<AuthorBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', isbn: '', category: 'Computer Science', description: '', publicationYear: '', publisher: '', totalCopies: '1' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const loadAuthorData = async () => {
    if (userRole !== 'AUTHOR' || !user.id) return;
    setLoading(true);
    const { data, error } = await supabase.from('books')
      .select('id,title,isbn,category,total_copies,available_copies')
      .eq('author_id', user.id).order('created_at', { ascending: false });
    if (error) { addToast('Could Not Load Books', error.message, 'error'); setLoading(false); return; }

    const rows: AuthorBook[] = [];
    for (const book of data || []) {
      const [{ data: reads }, { data: lists }] = await Promise.all([
        supabase.from('borrow_records').select('id').eq('book_id', book.id).eq('status', 'RETURNED'),
        supabase.from('reading_list').select('id').eq('book_id', book.id)
      ]);
      rows.push({ ...book, read_count: reads?.length || 0, reading_list_count: lists?.length || 0 });
    }
    setBooks(rows);
    setLoading(false);
  };

  useEffect(() => { void loadAuthorData(); }, [user.id, userRole]);

  if (userRole !== 'AUTHOR') {
    return (
      <div className="min-h-screen bg-[var(--app-canvas)] flex items-center justify-center p-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
          <div className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold">Administrator Portal</h1><p className="text-sm text-slate-500 mt-1">Welcome, {user.name}.</p></div>
            <button onClick={() => void logout()} className="px-3 py-2 border rounded-lg text-xs font-semibold flex gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
          </div>
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {['Student and author management','Book catalogue management','Issue and return management','Library reports and settings'].map(x => <div key={x} className="p-5 rounded-xl border bg-slate-50 text-sm font-semibold">{x}</div>)}
          </div>
        </div>
      </div>
    );
  }

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const total = Math.max(1, Number(form.totalCopies) || 1);
    if (!form.title.trim()) { addToast('Title Required', 'Enter the book title before submitting.', 'warning'); setSubmitting(false); return; }
    if (!pdfFile || pdfFile.type !== 'application/pdf') { addToast('PDF Required', 'Upload the book PDF before submitting.', 'warning'); setSubmitting(false); return; }
    const filePath = user.id + '/' + crypto.randomUUID() + '.pdf';
    const { error: uploadError } = await supabase.storage.from('author-book-pdfs').upload(filePath, pdfFile, { contentType: 'application/pdf', upsert: false });
    if (uploadError) { addToast('PDF Upload Failed', uploadError.message, 'error'); setSubmitting(false); return; }
    const { error } = await supabase.from('books').insert({
      title: form.title.trim(), author_name: user.name || 'Author', author_id: user.id,
      isbn: form.isbn.trim() || null, category: form.category, description: form.description.trim(),
      publication_year: form.publicationYear ? Number(form.publicationYear) : null,
      publisher: form.publisher.trim(), total_copies: total, available_copies: total, condition: 'Good', approval_status: 'PENDING', pdf_path: filePath, ai_status: 'PENDING'
    });
    if (error) {
      // Clean up the uploaded PDF if the database insert fails.
      await supabase.storage.from('author-book-pdfs').remove([filePath]);
      addToast('Submission Failed', error.message, 'error');
      setSubmitting(false);
      return;
    }

    addToast(
      'Submitted for Review',
      'Your book and PDF were submitted successfully. The administrator will review it before it appears to students.',
      'success'
    );
    setShowAdd(false);
    setForm({ title:'', isbn:'', category:'Computer Science', description:'', publicationYear:'', publisher:'', totalCopies:'1' });
    setPdfFile(null);
    await loadAuthorData();
    setSubmitting(false);
  };

  const totalReads = books.reduce((n, b) => n + b.read_count, 0);
  const totalLists = books.reduce((n, b) => n + b.reading_list_count, 0);

  return (
    <div className="min-h-screen bg-[var(--app-canvas)] p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white rounded-2xl border p-6 flex justify-between items-center gap-4">
          <div><p className="text-xs font-semibold text-[#4C1D95] uppercase">SIT Central Library</p><h1 className="text-2xl font-bold mt-1">Author Portal</h1><p className="text-sm text-slate-500 mt-1">Welcome, {user.name}.</p></div>
          <button onClick={() => void logout()} className="px-3 py-2 border rounded-lg text-xs font-semibold flex gap-2"><LogOut className="w-4 h-4" /> Sign Out</button>
        </header>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-5"><BookOpen className="w-5 h-5 text-[#4C1D95]" /><p className="text-xs text-slate-500 mt-3">Published Books</p><p className="text-3xl font-bold">{books.length}</p></div>
          <div className="bg-white rounded-xl border p-5"><CheckCircle2 className="w-5 h-5 text-emerald-600" /><p className="text-xs text-slate-500 mt-3">Completed Reads</p><p className="text-3xl font-bold">{totalReads}</p></div>
          <div className="bg-white rounded-xl border p-5"><BookMarked className="w-5 h-5 text-amber-600" /><p className="text-xs text-slate-500 mt-3">Reading List Saves</p><p className="text-3xl font-bold">{totalLists}</p></div>
        </div>

        <section className="bg-white rounded-2xl border">
          <div className="p-5 border-b flex justify-between items-center gap-3"><div><h2 className="font-bold">Your Books</h2><p className="text-xs text-slate-500 mt-1">See copies, completed reads and reading-list saves.</p></div><div className="flex gap-2"><button onClick={() => void loadAuthorData()} className="px-3 py-2 border rounded-lg text-xs font-semibold flex gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button><button onClick={() => setShowAdd(true)} className="px-3 py-2 bg-[#4C1D95] text-white rounded-lg text-xs font-semibold flex gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Book</button></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-slate-50 text-left text-xs text-slate-500"><th className="p-4">Book</th><th className="p-4">Copies</th><th className="p-4">Read</th><th className="p-4">Reading List</th></tr></thead><tbody>
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-xs text-slate-500">Loading...</td></tr> : books.map(b => <tr key={b.id} className="border-b last:border-0"><td className="p-4"><b>{b.title}</b><div className="text-xs text-slate-500">{b.category || 'Uncategorised'}{b.isbn ? ' · ISBN ' + b.isbn : ''}</div></td><td className="p-4 text-xs">{b.available_copies} / {b.total_copies} available</td><td className="p-4 font-semibold">{b.read_count}</td><td className="p-4 font-semibold">{b.reading_list_count}</td></tr>)}
            {!loading && books.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-xs text-slate-500">No books yet. Add your first book.</td></tr>}
          </tbody></table></div>
        </section>

        {showAdd && <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"><form onSubmit={publish} className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl">
          <div className="flex justify-between mb-5"><div><h2 className="font-bold text-lg">Add Book</h2><p className="text-xs text-slate-500">This book will belong to your author account.</p></div><button type="button" onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-xs font-semibold">Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
            <label className="text-xs font-semibold">ISBN<input value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
            <label className="text-xs font-semibold">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm"><option>Computer Science</option><option>Artificial Intelligence</option><option>Software Engineering</option><option>Mathematics</option><option>Science & Physics</option><option>Finance & Business</option><option>Classic Literature</option><option>Self-Improvement</option></select></label>
            <label className="text-xs font-semibold">Publisher<input value={form.publisher} onChange={e=>setForm({...form,publisher:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
            <label className="text-xs font-semibold">Publication Year<input type="number" value={form.publicationYear} onChange={e=>setForm({...form,publicationYear:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
            <label className="text-xs font-semibold">Total Copies<input type="number" min="1" value={form.totalCopies} onChange={e=>setForm({...form,totalCopies:e.target.value})} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
          </div>
          <label className="block text-xs font-semibold mt-4">Book PDF (required)
            <input required type="file" accept="application/pdf" onChange={e=>setPdfFile(e.target.files?.[0] || null)} className="mt-1 w-full border rounded-lg p-2.5 text-sm" />
            <span className="block text-[11px] text-slate-500 mt-1">The PDF is private. Students will only see the approved AI-generated summary.</span>
          </label>
          <label className="block text-xs font-semibold mt-4">Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={4} className="mt-1 w-full border rounded-lg p-2.5 text-sm" /></label>
          <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={()=>setShowAdd(false)} className="px-4 py-2 border rounded-lg text-xs">Cancel</button><button type="submit" disabled={submitting} className="px-4 py-2 bg-[#4C1D95] disabled:opacity-60 text-white rounded-lg text-xs font-semibold">{submitting ? 'Submitting...' : 'Submit for Approval'}</button></div>
        </form></div>}
      </div>
    </div>
  );
};
