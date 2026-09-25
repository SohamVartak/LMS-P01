import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Pencil, Trash2, Search, X, RefreshCw, ShieldCheck, ClipboardList, Check, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLibrary } from '../context/LibraryContext';
import type { AdminBookInput } from '../context/LibraryContext';

const emptyBook: AdminBookInput = {
  isbn: '', title: '', author_name: '', category: 'Computer Science', description: '',
  publication_year: null, publisher: '', total_copies: 1, available_copies: 1,
  shelf_location: '', shelf_id: '', condition: 'Good', condition_notes: ''
};

const categories = ['Computer Science','Artificial Intelligence','Software Engineering','Mathematics','Self-Improvement','Finance & Business','Classic Literature','Science & Physics'];

export const AdminBookManagementPage: React.FC<{ onOpenCirculation: () => void }> = ({ onOpenCirculation }) => {
  const { books, userRole, refreshBooks, createBook, updateBook, deleteBook, addToast } = useLibrary();
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<AdminBookInput>(emptyBook);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => { if (userRole === 'ADMIN') { void refreshBooks(); void loadPending(); } }, [userRole]);

  const loadPending = async () => {
    const { data, error } = await supabase.from('books').select('id,title,author_name,category,description,pdf_path,ai_status,submitted_at').eq('approval_status','PENDING').order('submitted_at',{ ascending:false });
    if (!error) setPending(data || []);
  };

  const reviewSubmission = async (bookId: string, approved: boolean) => {
    setReviewing(true);
    const { error } = await supabase.from('books').update({ approval_status: approved ? 'APPROVED' : 'REJECTED' }).eq('id', bookId).eq('approval_status','PENDING');
    if (error) addToast('Review Failed', error.message, 'error');
    else addToast(approved ? 'Book Approved' : 'Book Rejected', approved ? 'The book is now visible in the student catalogue.' : 'The submission was rejected.', approved ? 'success' : 'warning');
    await loadPending(); await refreshBooks(); setReviewing(false);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    return books.filter(b => [b.title,b.author,b.isbn,b.category,b.shelfLocation].some(v => v.toLowerCase().includes(q)));
  }, [books, query]);

  const openAdd = () => { setEditingId(null); setForm(emptyBook); setShowForm(true); };
  const openEdit = (book: any) => {
    setEditingId(book.id);
    setForm({
      isbn: book.isbn || '', title: book.title, author_name: book.author || '',
      category: book.category, description: book.description || '', publication_year: book.publicationYear || null,
      publisher: book.publisher || '', total_copies: book.totalCopies, available_copies: book.availableCopies,
      shelf_location: book.shelfLocation || '', shelf_id: book.shelfId || '',
      condition: book.condition, condition_notes: book.conditionNotes || ''
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author_name.trim()) return;
    setSaving(true);
    const ok = editingId ? await updateBook(editingId, form) : await createBook(form);
    setSaving(false);
    if (ok) setShowForm(false);
  };

  const remove = async (id: string, title: string) => {
    if (window.confirm('Delete "' + title + '" from the catalogue? This cannot be undone.')) await deleteBook(id);
  };

  if (userRole !== 'ADMIN') return null;

  const field = (label: string, key: keyof AdminBookInput, type = 'text') => (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-700 mb-1">{label}</span>
      <input
        type={type}
        value={form[key] ?? ''}
        onChange={e => setForm(prev => ({ ...prev, [key]: type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value }))}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:border-violet-600"
      />
    </label>
  );

  return <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-violet-700 text-xs font-bold uppercase tracking-wider"><ShieldCheck className="w-4 h-4"/> Administrator</div>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">Book Management</h1>
          <p className="text-sm text-slate-500 mt-1">Add, edit, search and remove books from the library catalogue.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onOpenCirculation} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold flex items-center gap-2"><ClipboardList className="w-4 h-4"/> Circulation</button>
          <button onClick={() => void refreshBooks()} className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Refresh</button>
          <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-violet-700 text-white text-sm font-semibold flex items-center gap-2"><Plus className="w-4 h-4"/> Add Book</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-amber-200 mb-5 overflow-hidden">
        <div className="px-5 py-4 border-b bg-amber-50 flex justify-between"><div><span className="font-semibold text-slate-900">Author Submissions</span><p className="text-xs text-slate-500 mt-1">Review books before they enter the student catalogue.</p></div><span className="text-sm font-semibold text-amber-700">{pending.length} pending</span></div>
        {pending.length > 0 && <div className="divide-y">{pending.map(book => <div key={book.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><p className="font-semibold">{book.title}</p><p className="text-xs text-slate-500">by {book.author_name} · {book.category || 'Uncategorised'}</p><p className="text-xs text-slate-500 mt-1">{book.description || 'No description provided.'}</p><p className="text-[11px] text-amber-700 mt-1">AI summary status: {book.ai_status || 'PENDING'}</p></div><div className="flex gap-2 shrink-0"><button disabled={reviewing} onClick={()=>void reviewSubmission(book.id,false)} className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 text-xs font-semibold flex gap-1.5"><XCircle className="w-4 h-4"/> Reject</button><button disabled={reviewing} onClick={()=>void reviewSubmission(book.id,true)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex gap-1.5"><Check className="w-4 h-4"/> Approve</button></div></div>)}</div>}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title, author, ISBN, category or shelf..." className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 text-sm outline-none focus:border-violet-600"/>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between"><span className="font-semibold text-slate-900">Catalogue</span><span className="text-sm text-slate-500">{filtered.length} books</span></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr><th className="px-5 py-3">Book</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Copies</th><th className="px-4 py-3">Shelf</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(book => <tr key={book.id} className="hover:bg-slate-50">
                <td className="px-5 py-4"><div className="font-semibold text-slate-900">{book.title}</div><div className="text-xs text-slate-500">{book.author}{book.isbn ? ' · ISBN ' + book.isbn : ''}</div></td>
                <td className="px-4 py-4 text-xs text-slate-600">{book.category}</td>
                <td className="px-4 py-4"><span className={book.availableCopies > 0 ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>{book.availableCopies}</span> / {book.totalCopies}</td>
                <td className="px-4 py-4 text-xs text-slate-600">{book.shelfLocation || '—'}</td>
                <td className="px-4 py-4"><div className="flex justify-end gap-2">
                  <button onClick={() => openEdit(book)} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100" title="Edit"><Pencil className="w-4 h-4"/></button>
                  <button onClick={() => void remove(book.id, book.title)} className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" title="Delete"><Trash2 className="w-4 h-4"/></button>
                </div></td>
              </tr>)}
              {!filtered.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500"><BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300"/>No books found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    {showForm && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <form onSubmit={save} className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-slate-200">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div><h2 className="font-bold text-lg text-slate-900">{editingId ? 'Edit Book' : 'Add New Book'}</h2><p className="text-xs text-slate-500">Catalogue information</p></div>
          <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          {field('Title *','title')}
          {field('Author *','author_name')}
          {field('ISBN','isbn')}
          {field('Publisher','publisher')}
          <label><span className="block text-xs font-semibold text-slate-700 mb-1">Category</span><select value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm">{categories.map(c=><option key={c}>{c}</option>)}</select></label>
          {field('Publication Year','publication_year','number')}
          {field('Total Copies *','total_copies','number')}
          {field('Available Copies *','available_copies','number')}
          {field('Shelf Location','shelf_location')}
          {field('Shelf ID','shelf_id')}
          <label><span className="block text-xs font-semibold text-slate-700 mb-1">Condition</span><select value={form.condition} onChange={e=>setForm(p=>({...p,condition:e.target.value as AdminBookInput['condition']}))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm"><option>Excellent</option><option>Good</option><option>Needs Attention</option><option>Damaged</option></select></label>
          {field('Condition Notes','condition_notes')}
          <label className="sm:col-span-2"><span className="block text-xs font-semibold text-slate-700 mb-1">Description</span><textarea rows={4} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm resize-y"/></label>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
          <button type="button" onClick={()=>setShowForm(false)} className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold">Cancel</button>
          <button disabled={saving} className="px-5 py-2.5 rounded-lg bg-violet-700 text-white text-sm font-semibold disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Book'}</button>
        </div>
      </form>
    </div>}
  </div>;
};
