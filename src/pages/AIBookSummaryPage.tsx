import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { 
  Sparkles, 
  FileText, 
  Copy, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Lightbulb, 
  GraduationCap 
} from 'lucide-react';

export const AIBookSummaryPage: React.FC = () => {
  const { books, openBookModal, borrowBook, addToast } = useLibrary();

  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const currentBook = books.find(b => b.id === selectedBookId) || books[0];

  if (!currentBook) {
    return <div className="p-8 text-sm text-slate-500">No approved books are currently available for AI summaries.</div>;
  }

  const handleCopySummary = () => {
    const textToCopy = `AI Summary: ${currentBook.title} by ${currentBook.author}\n\n${currentBook.aiSummary.summary}\n\nKey Concepts:\n${currentBook.aiSummary.keyIdeas.map(idea => `• ${idea}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    addToast('Copied to Clipboard', `Summary for "${currentBook.title}" copied!`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Executive Synthesis
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>AI Book Summary & Knowledge Extraction</span>
          <Sparkles className="w-6 h-6 text-amber-500" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review the summary and key ideas stored for an approved engineering book.
        </p>
      </div>

      {/* Book Selector Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-2/3">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            Choose Book from Prescribed Catalogue
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full py-2 px-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-blue-600"
          >
            {books.map(b => (
              <option key={b.id} value={b.id}>
                {b.title} — {b.author} ({b.category})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCopySummary}
          className="w-full sm:w-auto py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Summary Copied ✓' : 'Copy Synthesis Notes'}</span>
        </button>
      </div>

      {/* Main Summary Presentation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Book Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center justify-between space-y-4">
          <BookSpineCover book={currentBook} size="md" />

          <div>
            <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
              {currentBook.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              {currentBook.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">by {currentBook.author}</p>
          </div>

          <div className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between font-tabular">
              <span>Stack Location:</span>
              <strong>{currentBook.shelfLocation}</strong>
            </div>
            <div className="flex justify-between font-tabular">
              <span>Reading Pace:</span>
              <strong>Not recorded</strong>
            </div>
            <div className="flex justify-between font-tabular">
              <span>Copies Available:</span>
              <strong>{currentBook.availableCopies} in stacks</strong>
            </div>
          </div>

          <div className="w-full flex gap-2">
            <button
              onClick={() => openBookModal(currentBook)}
              className="flex-1 py-2 px-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Examine
            </button>
            <button
              onClick={() => borrowBook(currentBook.id)}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-xs font-semibold"
            >
              Issue
            </button>
          </div>
        </div>

        {/* Right Summary Deep-Dive */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Synthesis Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 font-serif-academic">
                Executive Synthesis
              </h2>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {currentBook.aiSummary.summary}
            </p>
          </div>

          {/* Core Principles & Takeaways */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900 font-serif-academic">
                Essential Thematic Principles
              </h3>
            </div>

            <div className="space-y-3">
              {currentBook.aiSummary.keyIdeas.map((idea, index) => (
                <div 
                  key={index}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {idea}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Curriculum Context */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3 text-xs text-blue-950">
            <GraduationCap className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">SIT Coursework Relevance:</strong>
              <span>
                Recommended for Semester V/VI Computer Science syllabus, covering database normalization, distributed architectures, clean refactoring, and engineering ethics.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
