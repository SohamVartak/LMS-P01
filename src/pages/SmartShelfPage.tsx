import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookSpineCover } from '../components/common/BookSpineCover';
import { 
  QrCode, 
  MapPin, 
  Layers, 
  Search, 
  ScanLine, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SmartShelfPage: React.FC = () => {
  const { shelves, books, openBookModal, borrowBook, addToast } = useLibrary();
  const [selectedShelfCode, setSelectedShelfCode] = useState<string>('');
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);

  const currentShelf = shelves.find(s => s.code === selectedShelfCode) || shelves[0];
  if (!currentShelf) return <div className="p-8 text-sm text-slate-500">No shelf records are currently configured.</div>;
  
  // Filter books matching current shelf
  const shelfBooks = books.filter(b => b.category === currentShelf.category);

  const handleShelfSelect = () => {
    setScanSuccess(`Shelf ${currentShelf.code} selected from the configured shelf records.`);
    addToast('Shelf Selected', `Shelf ${currentShelf.code} · ${currentShelf.category}`, 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
          Physical Stacks Telemetry
        </span>
        <h1 className="text-2xl font-bold font-serif-academic text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
          <span>Smart Shelf Navigator</span>
          <QrCode className="w-6 h-6 text-blue-600" />
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Locate physical books in SIT Central Library stacks using configured shelf codes and current catalogue inventory.
        </p>
      </div>

      {/* Shelf Selectors Grid */}
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
          Select Physical Stack Rack
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {shelves.map(shelf => (
            <button
              key={shelf.id}
              onClick={() => {
                setSelectedShelfCode(shelf.code);
                setScanSuccess(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedShelfCode === shelf.code
                  ? 'bg-blue-950 text-white border-blue-950 shadow-sm'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-tabular">{shelf.code}</span>
                <span className={`text-[10px] opacity-75 font-medium ${selectedShelfCode === shelf.code ? 'text-blue-200' : 'text-slate-500'}`}>
                  Fl. {shelf.floor}
                </span>
              </div>
              <p className={`text-[11px] font-semibold mt-1 truncate ${selectedShelfCode === shelf.code ? 'text-blue-100' : 'text-slate-700'}`}>
                {shelf.category}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Shelf Information & QR Scanner Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Shelf Metadata Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                Floor {currentShelf.floor} · {currentShelf.section}
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-serif-academic mt-1">
                Shelf {currentShelf.code}: {currentShelf.category}
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Capacity</span>
                <span className="font-bold text-slate-800 font-tabular">{currentShelf.totalBooks} Books</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-[10px] text-slate-400 block">Available Copies</span>
                <span className="font-bold text-emerald-700 font-tabular">{currentShelf.availableBooks} in stacks</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {currentShelf.description}
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-tabular">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Aisle Location: {currentShelf.section}</span>
            </div>
            <span>QR Tag: {currentShelf.qrPayload}</span>
          </div>
        </div>

        {/* Right: Configured shelf locator */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col items-center justify-between text-center relative overflow-hidden">
          
          <div className="space-y-1">
            <h3 className="text-xs font-bold tracking-wider uppercase text-blue-300">
              Shelf Locator
            </h3>
            <p className="text-[11px] text-slate-400">
              Use the configured shelf record below
            </p>
          </div>

          {/* QR Box with animated scanning laser beam */}
          <div className="relative my-4 p-4 bg-white rounded-xl shadow-lg border border-slate-200">
            <QrCode className="w-24 h-24 text-slate-900" />
            
            {/* Animated Laser Sweep Line */}
            {isScanning && (
              <div className="absolute left-2 right-2 h-1 bg-rose-500 shadow-lg shadow-rose-500/80 animate-laser" />
            )}
          </div>

          {scanSuccess ? (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{scanSuccess}</span>
            </div>
          ) : (
            <button
              onClick={handleShelfSelect}
              className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ScanLine className="w-4 h-4" />
              <span>Select Shelf Record</span>
            </button>
          )}

        </div>

      </div>

      {/* Books on this Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 font-serif-academic">
            Books Located on Shelf {currentShelf.code} ({shelfBooks.length})
          </h3>
          <span className="text-xs text-slate-500">Current approved catalogue records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shelfBooks.map(book => (
            <div
              key={book.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div onClick={() => openBookModal(book)} className="cursor-pointer shrink-0">
                  <BookSpineCover book={book} size="sm" />
                </div>
                <div className="min-w-0">
                  <h4 
                    onClick={() => openBookModal(book)}
                    className="text-xs font-bold text-slate-900 truncate hover:text-blue-700 cursor-pointer"
                  >
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">by {book.author}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      book.availableCopies > 0 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Checked out'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  onClick={() => openBookModal(book)}
                  className="py-1 px-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold"
                >
                  Locate
                </button>
                {book.availableCopies > 0 && (
                  <button
                    onClick={() => borrowBook(book.id)}
                    className="py-1 px-2.5 rounded-lg bg-blue-950 text-white hover:bg-blue-900 text-[11px] font-semibold"
                  >
                    Issue
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
