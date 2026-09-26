import React from 'react';
import { Book } from '../../types';
import { BookOpen, Bookmark } from 'lucide-react';

interface BookSpineCoverProps {
  book: Pick<Book, 'title' | 'author' | 'category' | 'coverUrl' | 'coverGradient' | 'coverAccent'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpineShadow?: boolean;
}

export const BookSpineCover: React.FC<BookSpineCoverProps> = ({ 
  book, 
  size = 'md',
  showSpineShadow = true 
}) => {
  const sizeClasses = {
    sm: 'w-20 h-28 text-[9px] p-2',
    md: 'w-36 h-52 text-[11px] p-3.5',
    lg: 'w-48 h-68 text-xs p-4',
    xl: 'w-64 h-92 text-sm p-6'
  };

  return (
    <div 
      className={`relative shrink-0 rounded-r-md rounded-l-xs overflow-hidden shadow-lg select-none transition-transform duration-300 bg-gradient-to-br ${book.coverGradient} text-white flex flex-col justify-between ${sizeClasses[size]} ${showSpineShadow ? 'shadow-black/60' : ''}`}
      style={{
        boxShadow: 'inset 4px 0 8px rgba(0, 0, 0, 0.45), 2px 4px 12px rgba(0, 0, 0, 0.4)'
      }}
    >
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      {/* Book Spine crease effect on left */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/50 via-white/10 to-transparent pointer-events-none" />
      
      {/* Subtle Cloth texture lines */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
          backgroundSize: '8px 8px'
        }}
      />

      {/* Ribbon bookmark top right */}
      <div 
        className="absolute top-0 right-3 w-3 h-5 rounded-b-xs shadow-sm"
        style={{ backgroundColor: book.coverAccent || '#f59e0b' }}
      >
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[4px] border-b-black/30 absolute bottom-0" />
      </div>

      {/* Top Header / Category */}
      <div className="relative z-10 pr-4">
        <span 
          className="uppercase tracking-widest text-[8px] font-semibold opacity-85 block truncate"
          style={{ color: book.coverAccent || '#FBBF24' }}
        >
          {book.category}
        </span>
      </div>

      {/* Middle Title */}
      <div className="relative z-10 my-auto py-1">
        <h4 className="font-serif-academic font-bold leading-tight tracking-tight line-clamp-3 text-white drop-shadow-sm">
          {book.title}
        </h4>
        <div 
          className="w-8 h-0.5 mt-2 rounded-full opacity-80"
          style={{ backgroundColor: book.coverAccent || '#ffffff' }}
        />
      </div>

      {/* Bottom Author & SIT seal */}
      <div className="relative z-10 pt-1 flex items-end justify-between border-t border-white/15">
        <p className="font-medium text-white/90 truncate max-w-[80%]">
          {book.author}
        </p>
        <BookOpen className="w-3.5 h-3.5 text-white/60 shrink-0" />
      </div>

      {/* Right Edge Page Simulation */}
      <div className="absolute right-0 top-1 bottom-1 w-1 bg-gradient-to-l from-black/25 to-transparent pointer-events-none" />
    </div>
  );
};
