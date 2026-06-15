import React, { useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { heroStories, feedStories } from '../data';
interface SearchResult {
  id: string;
  title: string;
  category: string;
  source: string;
  image: string;
}
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const allStories: SearchResult[] = [...heroStories, ...feedStories].map(
  (s) => ({
    id: s.id,
    title: s.title,
    category: s.category,
    source: s.source,
    image: s.image
  })
);
export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStories.slice(0, 6);
    return allStories.filter(
      (s) =>
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.source.toLowerCase().includes(q)
    );
  }, [query]);
  // Reset state + focus when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      // focus after the modal mounts
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);
  // Keep active index in range
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);
  const handleSelect = (id: string) => {
    navigate(`/story/${id}`);
    onClose();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[activeIndex];
      if (selected) handleSelect(selected.id);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
        role="dialog"
        aria-modal="true"
        aria-label="Search articles">
        
          {/* Backdrop */}
          <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose} />
        

          {/* Panel */}
          <motion.div
          initial={{
            opacity: 0,
            y: -12,
            scale: 0.98
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: -12,
            scale: 0.98
          }}
          transition={{
            duration: 0.15
          }}
          className="relative w-full max-w-xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden"
          onKeyDown={handleKeyDown}>
          
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, topics, sources…"
              className="flex-1 bg-transparent py-4 text-primary placeholder:text-muted focus:outline-none text-base" />
            
              <button
              aria-label="Close search"
              onClick={onClose}
              className="text-muted hover:text-primary transition-colors p-1 rounded-md">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length > 0 ?
            <>
                  {!query.trim() &&
              <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-muted">
                      Suggested
                    </p>
              }
                  {results.map((result, index) =>
              <button
                key={result.id}
                onClick={() => handleSelect(result.id)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${index === activeIndex ? 'bg-base' : 'hover:bg-base'}`}>
                
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-base">
                        <img
                    src={result.image}
                    alt=""
                    className="w-full h-full object-cover" />
                  
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-primary line-clamp-1">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          <span className="text-accent font-medium">
                            {result.category}
                          </span>{' '}
                          · {result.source}
                        </p>
                      </div>
                      {index === activeIndex &&
                <CornerDownLeft className="w-4 h-4 text-muted shrink-0" />
                }
                    </button>
              )}
                </> :

            <div className="px-4 py-10 text-center">
                  <p className="text-sm text-primary font-medium">
                    No results for “{query}”
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Try a different keyword or topic.
                  </p>
                </div>
            }
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-base border border-border font-sans">
                  ↑↓
                </kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-base border border-border font-sans">
                  ↵
                </kbd>
                to open
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-base border border-border font-sans">
                  esc
                </kbd>
                to close
              </span>
            </div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}