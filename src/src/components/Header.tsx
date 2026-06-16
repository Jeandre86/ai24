import React, { useEffect, useState } from 'react';
import { Search, Menu, X, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  // Open search with Cmd/Ctrl + K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const navLinks = [
  {
    name: 'Explore',
    path: '/explore'
  },
  {
    name: 'AI//24 Picks',
    path: '/picks'
  },
  {
    name: 'Community',
    path: '/community'
  },
  {
    name: 'Categories',
    path: '/categories'
  },
  {
    name: 'Preferences',
    path: '/preferences'
  }];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-base/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
          <img
            src="/ai24-logo.svg"
            alt="AI//24 Logo"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium relative group transition-colors ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`}>
                
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}>
                </span>
              </Link>);

          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface p-2 md:pl-3 md:pr-2 md:py-1.5 md:border md:border-border">
            
            <Search className="w-5 h-5 md:w-4 md:h-4" />
            <span className="hidden md:inline text-sm">Search</span>
            <kbd className="hidden md:inline text-[10px] font-sans px-1.5 py-0.5 rounded bg-base border border-border text-muted">
              ⌘K
            </kbd>
          </button>
          <button
            title="Coming soon"
            className="hidden md:inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold pl-3 pr-2 py-2 rounded-full transition-colors">
            
            <Chrome className="w-4 h-4" />
            <span>Get AI {'//'} 24</span>
            <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 px-1.5 py-0.5 rounded-full">
              Soon
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden text-secondary hover:text-primary p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            
            {isMobileMenuOpen ?
            <X className="w-6 h-6" /> :

            <Menu className="w-6 h-6" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden border-t border-border bg-base">
          
            <nav className="flex flex-col px-4 py-4 gap-4">
              {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`}>
                  
                    {link.name}
                  </Link>);

            })}
              <div className="h-px bg-border my-2"></div>
              <button
              title="Coming soon"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-3 rounded-full transition-colors">
              
                <Chrome className="w-4 h-4" />
                <span>Get AI {'//'} 24</span>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-white/20 px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </button>
            </nav>
          </motion.div>
        }
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)} />
      
    </header>);

}