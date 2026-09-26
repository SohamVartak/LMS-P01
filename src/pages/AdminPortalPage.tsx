import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle, Users, UserRound, BookOpen, MapPin, RefreshCw, Clock3, ShieldCheck } from 'lucide-react';

type Section = 'overview' | 'students' | 'authors' | 'books' | 'library';

interface Props {
  onOpenBooks: () => void;
  onOpenCirculation: () => void;
}

export const AdminPortalPage: React.FC<Props> = ({ onOpenBooks, onOpenCirculation }) => {
  const [section, setSection] = useState<Section>('overview');
  const [students, setStudents] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [pendingBooks, setPendingBooks] = useState<any[]>([]);
  const [authorBooks, setAuthorBooks] = useState<any[]>([]);
  const [presence, setPresence] = useState<any[]>([]);
  const [borrowed, setBorrowed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<Record<string,string>>({});

  const load = async () => {
    setLoading(true);
    const [studentRes, authorRes, bookRes, presenceRes, borrowRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,student_id,department,year,role,approval_status,approval_note,created_at').eq('role','STUDENT').order('created_at',{ascending:false}),
      supabase.from('profiles').select('id,full_name,email,department,year,role,created_at').eq('role','AUTHOR').order('created_at',{ascending:false}),
      supabase.from('books').select('id,title,author_name,author_id,approval_status,ai_status,pdf_path,submitted_at,category,total_copies,available_copies').order('created_at',{ascending:false}),
      supabase.from('library_presence').select('user_id,table_number,activity,status,updated_at,profiles(full_name,email,student_id,department,year)').eq('status','IN_LIBRARY').order('updated_at',{ascending:false}),
      supabase.from('borrow_records').select('id,student_id,book_id,issue_date,due_date,status,books(title,author_name)').order('created_at',{ascending:false})
    ]);
    if (!studentRes.error) setStudents(studentRes.data || []);
    if (!authorRes.error) setAuthors(authorRes.data || []);
    if (!bookRes.error) { setAuthorBooks(bookRes.data || []); setPendingBooks((bookRes.data || []).filter((b:any) => b.approval_status === 'PENDING')); }
    if (!presenceRes.error) setPresence(presenceRes.data || []);
    if (!borrowRes.error) setBorrowed(borrowRes.data || []);
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const approveStudent = async (id: string, status: 'APPROVED'|'REJECTED') => {
    const { error } = await supabase.from('profiles').update({
      approval_status: status,
      approval_note: note[id] || null
    }).eq('id', id).eq('role','STUDENT');
    if (error) return;
    await load();
  };

  const approveBook = async (book: any, status: 'APPROVED'|'REJECTED') => {
    const { error } = await supabase.from('books').update({
      approval_status: status,
      rejection_reason: note[book.id] || null
    }).eq('id', book.id).eq('approval_status','PENDING');
    if (error) return;
    await load();
  };

  const studentsById = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
  const activeCount = presence.length;
  const readingCount = presence.filter(p => String(p.activity).toLowerCase().includes('read')).length;
  const workCount = activeCount - readingCount;
  const occupiedTables = new Set(presence.map(p => p.table_number).filter(Boolean));

  const card = (title: string, count: number | string, icon: React.ReactNode, target: Section, text: string) => (
    <button onClick={() => setSection(target)} className="text-left rounded-2xl border border-violet-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">{icon}</div>
        <span className="text-3xl font-bold text-slate-900">{count}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-violet-950 text-white px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-violet-300 uppercase">Administrator</div>
            <h1 className="text-3xl font-bold mt-1">Library Control Center</h1>
            <p className="text-violet-200 mt-1">Manage students, authors, books, circulation and live library activity.</p>
          </div>
          <button onClick={() => void load()} className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 flex items-center gap-2"><RefreshCw className="w-4 h-4"/> Refresh</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            ['overview','Overview'],['students','Students'],['authors','Authors'],['books','Book Approvals'],['library','Live Library']
          ] as [Section,string][]).map(([id,label]) => (
            <button key={id} onClick={() => setSection(id)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${section===id ? 'bg-violet-700 text-white' : 'bg-white border text-slate-600'}`}>{label}</button>
          ))}
          <button onClick={onOpenBooks} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border text-slate-600">Full Book Catalogue</button>
          <button onClick={onOpenCirculation} className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border text-slate-600">Circulation</button>
        </div>

        {section === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {card('Students', students.length, <Users className="w-5 h-5"/>, 'students', 'Approve registrations and view student details.')}
              {card('Authors', authors.length, <UserRound className="w-5 h-5"/>, 'authors', 'See every author and their uploaded books.')}
              {card('Pending Books', pendingBooks.length, <BookOpen className="w-5 h-5"/>, 'books', 'Approve or reject author book submissions.')}
              {card('Students In Library', activeCount, <MapPin className="w-5 h-5"/>, 'library', 'See activity and table occupancy in real time.')}
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl border p-5"><div className="text-sm text-slate-500">Reading</div><div className="text-3xl font-bold mt-1">{readingCount}</div></div>
              <div className="bg-white rounded-2xl border p-5"><div className="text-sm text-slate-500">Personal Work / Other</div><div className="text-3xl font-bold mt-1">{workCount}</div></div>
              <div className="bg-white rounded-2xl border p-5"><div className="text-sm text-slate-500">Borrow Records</div><div className="text-3xl font-bold mt-1">{borrowed.length}</div></div>
            </div>
          </>
        )}

        {section === 'students' && (
          <section className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-5 border-b"><h2 className="text-xl font-bold">Student Registration & Records</h2><p className="text-sm text-slate-500 mt-1">Approve registrations, then see their Gmail, student details and borrowed books.</p></div>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50"><tr>{['Student','Email','Student ID','Department / Year','Registration','Books'].map(x=><th key={x} className="text-left px-4 py-3">{x}</th>)}</tr></thead><tbody>
              {students.map(s => {
                const records = borrowed.filter(b => b.student_id === s.id && b.status !== 'RETURNED');
                return <tr key={s.id} className="border-t">
                  <td className="px-4 py-4 font-semibold">{s.full_name || 'Unnamed'}</td>
                  <td className="px-4 py-4">{s.email}</td>
                  <td className="px-4 py-4">{s.student_id || '—'}</td>
                  <td className="px-4 py-4">{s.department || '—'}{s.year ? ` · ${s.year}` : ''}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.approval_status==='APPROVED'?'bg-emerald-100 text-emerald-700':s.approval_status==='REJECTED'?'bg-red-100 text-red-700':'bg-amber-100 text-amber-700'}`}>{s.approval_status}</span>
                    {s.approval_status==='PENDING' && <div className="mt-2 flex gap-2"><button onClick={()=>void approveStudent(s.id,'APPROVED')} className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs">Accept</button><button onClick={()=>void approveStudent(s.id,'REJECTED')} className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs">Reject</button></div>}
                  </td>
                  <td className="px-4 py-4">{records.length ? records.map(r => <div key={r.id} className="mb-2"><b>{r.books?.title}</b><div className="text-xs text-slate-500">{r.issue_date} → {r.due_date || 'No due date'} · {r.status}</div></div>) : 'No active book'}</td>
                </tr>
              })}
            </tbody></table></div>
          </section>
        )}

        {section === 'authors' && (
          <section className="space-y-4">
            {authors.map(a => {
              const books = authorBooks.filter(b => b.author_id === a.id);
              return <div key={a.id} className="bg-white rounded-2xl border p-5"><div className="flex justify-between gap-4"><div><h2 className="font-bold text-lg">{a.full_name || 'Author'}</h2><p className="text-sm text-slate-500">{a.email}</p></div><span className="text-sm text-slate-500">{a.department || ''} {a.year || ''}</span></div><div className="mt-4 space-y-2">{books.length ? books.map(b=><div key={b.id} className="border-t pt-3 flex items-center justify-between gap-3"><span><b>{b.title}</b><span className="text-slate-500"> · {b.approval_status} · AI {b.ai_status}</span></span>{b.approval_status==='PENDING' && <button onClick={()=>setSection('books')} className="text-violet-700 font-semibold">Review</button>}</div>) : <span className="text-slate-500">No uploaded books.</span>}</div></div>
            })}
          </section>
        )}

        {section === 'books' && (
          <section className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-5 border-b"><h2 className="text-xl font-bold">Author Book Approval</h2><p className="text-sm text-slate-500">A submitted book stays out of the student catalogue until an administrator approves it.</p></div>
            {pendingBooks.length === 0 ? <div className="p-8 text-center text-slate-500">No pending submissions.</div> : <div className="divide-y">{pendingBooks.map(b=><div key={b.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h3 className="font-bold">{b.title}</h3><p className="text-sm text-slate-500">{b.author_name} · {b.category || 'Uncategorised'} · AI {b.ai_status}</p><p className="text-xs text-slate-400 mt-1">Submitted {b.submitted_at ? new Date(b.submitted_at).toLocaleString() : '—'}</p></div><div className="flex gap-2"><button onClick={()=>void approveBook(b,'APPROVED')} className="px-3 py-2 rounded-lg bg-emerald-600 text-white flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Approve</button><button onClick={()=>void approveBook(b,'REJECTED')} className="px-3 py-2 rounded-lg bg-red-600 text-white flex items-center gap-1"><XCircle className="w-4 h-4"/> Reject</button></div></div>)}</div>}
          </section>
        )}

        {section === 'library' && (
          <section>
            <div className="bg-white rounded-2xl border p-5 mb-4"><h2 className="text-xl font-bold">Live Library Monitor</h2><p className="text-sm text-slate-500 mt-1">Students currently marked inside the library, what they are doing, and their table.</p><div className="flex gap-6 mt-4 text-sm"><span><b>{activeCount}</b> students inside</span><span><b>{readingCount}</b> reading</span><span><b>{workCount}</b> personal work / other</span><span><b>{occupiedTables.size}</b> tables occupied</span><span><b>{40-occupiedTables.size}</b> tables available</span></div></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-5">{Array.from({length:40},(_,i)=>{const n=String(i+1); const p=presence.find(x=>x.table_number===n); return <div key={n} className={`rounded-xl border p-3 min-h-20 ${p?'bg-violet-100 border-violet-300':'bg-white'}`}><div className="text-xs text-slate-500">Table {n}</div><div className="font-semibold text-sm mt-1">{p?p.profiles?.full_name||'Occupied':'Available'}</div></div>})}</div>
            <div className="bg-white rounded-2xl border overflow-hidden"><table className="w-full text-sm"><thead className="bg-slate-50"><tr><th className="text-left px-4 py-3">Student</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Activity</th><th className="text-left px-4 py-3">Table</th><th className="text-left px-4 py-3">Last update</th></tr></thead><tbody>{presence.map(p=><tr key={p.user_id} className="border-t"><td className="px-4 py-3 font-semibold">{p.profiles?.full_name}</td><td className="px-4 py-3">{p.profiles?.email}</td><td className="px-4 py-3">{p.activity}</td><td className="px-4 py-3">{p.table_number || '—'}</td><td className="px-4 py-3">{new Date(p.updated_at).toLocaleString()}</td></tr>)}</tbody></table></div>
          </section>
        )}
      </main>
      {loading && <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm flex gap-2"><Clock3 className="w-4 h-4"/> Updating…</div>}
    </div>
  );
};
